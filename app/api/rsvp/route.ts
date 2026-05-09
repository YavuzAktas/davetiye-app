import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rsvpBildirimiGonder } from "@/lib/email";
import { bildirimOlustur } from "@/lib/bildirim";
import { tokenYenile, sarkilaraAra, playlistEEkle } from "@/lib/spotify";

/* ── Zod şeması ─────────────────────────────────────────── */
const rsvpSemasi = z.object({
  davetiyeId:   z.string().min(1).max(50),
  ad:           z.string().min(1).max(100),
  email:        z.string().email().max(254).optional().or(z.literal("")).transform(v => v || undefined),
  telefon:      z.string().max(20).optional(),
  katilim:      z.boolean(),
  kisiSayisi:   z.number().int().min(1).max(50).default(1),
  mesaj:        z.string().max(500).optional(),
  diyet:        z.string().max(100).optional(),
  sarkiOnerisi: z.string().max(200).optional(),
  spotifyTrackId: z.string().max(50).optional(),
});

/* ── IP tabanlı rate limiter (module-level, instance başına) */
const IP_LIMIT   = 10;         // istek / pencere
const IP_PENCERE = 60_000;     // 1 dakika

const ipSayac = new Map<string, { sayi: number; sifirAt: number }>();

function ipIzinVer(ip: string): boolean {
  const simdi = Date.now();
  const kayit = ipSayac.get(ip);
  if (!kayit || simdi > kayit.sifirAt) {
    ipSayac.set(ip, { sayi: 1, sifirAt: simdi + IP_PENCERE });
    return true;
  }
  if (kayit.sayi >= IP_LIMIT) return false;
  kayit.sayi++;
  return true;
}

/* ── DB tabanlı per-davetiye limitler ───────────────────── */
const LIMIT_DAKIKA      = 5;
const LIMIT_SAAT        = 100;
const LIMIT_MUKERRER_DK = 10;

/* ── Handler ────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* 1. IP kontrolü */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!ipIzinVer(ip)) {
    return NextResponse.json(
      { hata: "Çok fazla istek. Lütfen bir dakika bekleyin." },
      { status: 429 }
    );
  }

  /* 2. Zod doğrulama */
  const ham = await req.json().catch(() => null);
  const sonuc = rsvpSemasi.safeParse(ham);
  if (!sonuc.success) {
    const ilkHata = sonuc.error.issues[0]?.message ?? "Geçersiz veri.";
    return NextResponse.json({ hata: ilkHata }, { status: 400 });
  }

  const { davetiyeId, ad, email, telefon, katilim, kisiSayisi, mesaj, diyet, sarkiOnerisi, spotifyTrackId } = sonuc.data;

  /* 3. Davetiye var mı? */
  const davetiye = await prisma.davetiye.findUnique({
    where: { id: davetiyeId },
    include: { user: true, _count: false },
  });
  // Spotify için user'dan refresh token lazım — ayrı sorguda alalım
  const davetiyeOwner = davetiye ? await prisma.user.findUnique({
    where: { id: davetiye.userId },
    select: { spotifyRefreshToken: true },
  }) : null;

  if (!davetiye) {
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  }

  /* 4. DB tabanlı per-davetiye rate limit */
  const simdi = Date.now();

  const [dakikaCount, saatCount, mukerrerCount] = await Promise.all([
    prisma.rSVP.count({
      where: { davetiyeId, createdAt: { gte: new Date(simdi - 60_000) } },
    }),
    prisma.rSVP.count({
      where: { davetiyeId, createdAt: { gte: new Date(simdi - 3_600_000) } },
    }),
    prisma.rSVP.count({
      where: {
        davetiyeId,
        ad: { equals: ad.trim(), mode: "insensitive" },
        createdAt: { gte: new Date(simdi - LIMIT_MUKERRER_DK * 60_000) },
      },
    }),
  ]);

  if (dakikaCount >= LIMIT_DAKIKA) {
    return NextResponse.json(
      { hata: "Çok fazla istek gönderildi. Lütfen bir dakika bekleyin." },
      { status: 429 }
    );
  }
  if (saatCount >= LIMIT_SAAT) {
    return NextResponse.json(
      { hata: "Bu davetiye için saatlik RSVP sınırına ulaşıldı." },
      { status: 429 }
    );
  }
  if (mukerrerCount > 0) {
    return NextResponse.json(
      { hata: "Bu isimle zaten bir katılım bildirimi gönderildi. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  /* 5. Kaydet */
  const rsvp = await prisma.rSVP.create({
    data: {
      davetiyeId,
      ad:            ad.trim(),
      email:         email?.trim()         || null,
      telefon:       telefon?.trim()       || null,
      katilim,
      kisiSayisi,
      mesaj:         mesaj?.trim()         || null,
      diyet:         diyet?.trim()         || null,
      sarkiOnerisi:  sarkiOnerisi?.trim()  || null,
      spotifyTrackId: spotifyTrackId       || null,
    },
  });

  /* 6. Spotify'a şarkı ekle — response öncesi await et (Vercel'de bg task kesilir) */
  if (
    sarkiOnerisi &&
    davetiye.spotifyAktif &&
    davetiye.spotifyPlaylistId &&
    davetiyeOwner?.spotifyRefreshToken
  ) {
    try {
      const accessToken = await tokenYenile(davetiyeOwner.spotifyRefreshToken!);
      let trackUri = spotifyTrackId ? `spotify:track:${spotifyTrackId}` : null;
      let bulunanId = spotifyTrackId ?? null;
      if (!trackUri) {
        const sonuclar = await sarkilaraAra(sarkiOnerisi, accessToken);
        trackUri = sonuclar[0]?.uri ?? null;
        bulunanId = sonuclar[0]?.id ?? null;
      }
      if (trackUri) {
        const eklendi = await playlistEEkle(davetiye.spotifyPlaylistId!, trackUri, accessToken);
        console.log("Spotify şarkı eklendi:", eklendi, "trackUri:", trackUri);
        if (bulunanId) {
          await prisma.rSVP.update({
            where: { id: rsvp.id },
            data: { spotifyTrackId: bulunanId },
          });
        }
      } else {
        console.log("Spotify: trackUri bulunamadı, sarkiOnerisi:", sarkiOnerisi);
      }
    } catch (err) {
      console.error("Spotify şarkı ekleme hatası:", err);
    }
  }

  /* 7. In-app bildirim */
  bildirimOlustur({
    userId: davetiye.userId,
    tip: "rsvp",
    baslik: katilim ? `${ad.trim()} katılıyor 🎉` : `${ad.trim()} katılamıyor`,
    mesaj: `"${davetiye.baslik}" davetiyene yanıt geldi.`,
    davetiyeSlug: davetiye.slug,
  });

  /* 7. Bildirim e-postası (beklemeden gönder) */
  if (davetiye.user?.email) {
    rsvpBildirimiGonder({
      sahipEmail:     davetiye.user.email,
      sahipAd:        davetiye.user.name || "Kullanıcı",
      davetiyeBaslik: davetiye.baslik,
      davetiyeSlug:   davetiye.slug,
      misafirAd:      ad.trim(),
      katilim,
      kisiSayisi,
      misafirNot:     mesaj,
    });
  }

  return NextResponse.json({ basarili: true, rsvp });
}

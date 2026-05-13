import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rsvpBildirimiGonder } from "@/lib/email";
import { bildirimOlustur } from "@/lib/bildirim";
import { tokenYenile, sarkilaraAra, playlistEEkle, playlistOlustur } from "@/lib/spotify";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";

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

/* ── DB tabanlı per-davetiye limitler ───────────────────── */
const LIMIT_DAKIKA      = 5;
const LIMIT_SAAT        = 100;
const LIMIT_MUKERRER_DK = 10;

/* ── Handler ────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* 1. IP kontrolü */
  const ip = ipAlNextRequest(req);

  if (!(await ipIzinVer("rsvp", ip, 10, 60_000))) {
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

  /* 6. Spotify'a şarkı ekle */
  if (sarkiOnerisi && davetiye.spotifyAktif && davetiyeOwner?.spotifyRefreshToken) {
    try {
      const accessToken = await tokenYenile(davetiyeOwner.spotifyRefreshToken!);

      // Playlist yoksa otomatik oluştur
      let playlistId = davetiye.spotifyPlaylistId;
      if (!playlistId) {
        const meRes  = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const me = await meRes.json();
        const playlist = await playlistOlustur(me.id, `🎵 ${davetiye.baslik}`, accessToken);
        playlistId = playlist.id;
        await prisma.davetiye.update({
          where: { id: davetiye.id },
          data: { spotifyPlaylistId: playlist.id },
        });
      }

      let trackUri  = spotifyTrackId ? `spotify:track:${spotifyTrackId}` : null;
      let bulunanId = spotifyTrackId ?? null;
      if (!trackUri) {
        const sonuclar = await sarkilaraAra(sarkiOnerisi, accessToken);
        trackUri  = sonuclar[0]?.uri ?? null;
        bulunanId = sonuclar[0]?.id  ?? null;
      }
      if (trackUri) {
        await playlistEEkle(playlistId!, trackUri, accessToken);
        if (bulunanId) {
          await prisma.rSVP.update({
            where: { id: rsvp.id },
            data: { spotifyTrackId: bulunanId },
          });
        }
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

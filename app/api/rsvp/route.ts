import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rsvpBildirimiGonder } from "@/lib/email";
import { bildirimOlustur } from "@/lib/bildirim";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";

/* ── Zod şeması ─────────────────────────────────────────── */
const rsvpSemasi = z.object({
  davetiyeId:   z.string().min(1).max(50),
  ad:           z.string().min(1).max(100),
  email:        z.string().email().max(254).optional().or(z.literal("")).transform(v => v || undefined),
  telefon:      z.string().max(20).optional(),
  katilim:      z.boolean(),
  kisiSayisi:   z.number().int().min(1).max(2).default(1),
  mesaj:        z.string().max(500).optional(),
  diyet:        z.string().max(100).optional(),
  sarkiOnerisi: z.string().max(200).optional(),
  etkinlikler:  z.array(z.string().min(1).max(50)).max(20).optional(),
  ozelNitelikliVeriOnayi: z.boolean().optional(),
  cevaplar:     z.object({
    ulasim:    z.boolean().optional(),
    cocuk:     z.number().int().min(0).max(20).optional(),
    alerji:    z.string().max(500).optional(),
    ozelSoru:  z.string().max(200).optional(),
    ozelCevap: z.string().max(500).optional(),
  }).optional(),
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

  const { davetiyeId, ad, email, telefon, katilim, kisiSayisi, mesaj, diyet, sarkiOnerisi, etkinlikler, cevaplar, ozelNitelikliVeriOnayi } = sonuc.data;
  const hassasBeslenmeBilgisiVar = Boolean(diyet?.trim() || cevaplar?.alerji?.trim());

  if (hassasBeslenmeBilgisiVar && ozelNitelikliVeriOnayi !== true) {
    return NextResponse.json(
      { hata: "Yemek, alerji veya özel beslenme bilgisini iletmek için açık rıza onayı gereklidir." },
      { status: 400 },
    );
  }

  /* 3. Davetiye var mı? */
  const davetiye = await prisma.davetiye.findUnique({
    where: { id: davetiyeId },
    select: {
      id: true,
      userId: true,
      baslik: true,
      slug: true,
      aktif: true,
      kapasiteLimiti: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!davetiye || !davetiye.aktif) {
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  }

  /* Kapasite limiti kontrolü */
  if (davetiye.kapasiteLimiti && katilim) {
    const mevcutKisi = await prisma.rSVP.aggregate({
      where: { davetiyeId, katilim: true },
      _sum: { kisiSayisi: true },
    });
    const mevcutToplam = mevcutKisi._sum.kisiSayisi ?? 0;
    if (mevcutToplam + kisiSayisi > davetiye.kapasiteLimiti) {
      return NextResponse.json(
        { hata: `Davetiye kontenjanı doldu. Maksimum ${davetiye.kapasiteLimiti} kişilik yer mevcuttu.` },
        { status: 409 }
      );
    }
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
      ad:           ad.trim(),
      email:        email?.trim()        || null,
      telefon:      telefon?.trim()      || null,
      katilim,
      kisiSayisi,
      mesaj:        mesaj?.trim()        || null,
      diyet:        diyet?.trim()        || null,
      sarkiOnerisi: sarkiOnerisi?.trim() || null,
      cevaplar:     cevaplar ?? undefined,
    },
  });

  /* 6. Etkinlik RSVP kayıtları */
  if (etkinlikler && etkinlikler.length > 0) {
    const gecerliEtkinlikler = await prisma.etkinlikProgrami.findMany({
      where: { id: { in: etkinlikler }, davetiyeId },
      select: { id: true },
    });
    if (gecerliEtkinlikler.length > 0) {
      await prisma.etkinlikRSVP.createMany({
        data: gecerliEtkinlikler.map(e => ({ etkinlikId: e.id, rsvpId: rsvp.id })),
        skipDuplicates: true,
      });
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

  /* 8. Bildirim e-postası (beklemeden gönder) */
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

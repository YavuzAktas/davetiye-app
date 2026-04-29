import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rsvpBildirimiGonder } from "@/lib/email";

const LIMIT_DAKIKA  = 5;   // aynı davetiye, son 1 dakika
const LIMIT_SAAT    = 100; // aynı davetiye, son 1 saat
const LIMIT_MUKERRER_DK = 10; // aynı ad tekrarı bekleme süresi (dakika)

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { davetiyeId, ad, email, telefon, katilim, kisiSayisi, mesaj } = body;

  if (!davetiyeId || !ad?.trim() || katilim === undefined) {
    return NextResponse.json({ hata: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email.trim())) {
    return NextResponse.json({ hata: "Geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const davetiye = await prisma.davetiye.findUnique({
    where: { id: davetiyeId },
    include: { user: true },
  });

  if (!davetiye) {
    return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });
  }

  const simdi = Date.now();

  // Üç rate-limit kontrolünü paralel çalıştır
  const [dakikaCount, saatCount, mukerrerCount] = await Promise.all([
    // 1) Burst: aynı davetiye için son 1 dakikada kaç RSVP?
    prisma.rSVP.count({
      where: {
        davetiyeId,
        createdAt: { gte: new Date(simdi - 60_000) },
      },
    }),
    // 2) Sürekli spam: aynı davetiye için son 1 saatte kaç RSVP?
    prisma.rSVP.count({
      where: {
        davetiyeId,
        createdAt: { gte: new Date(simdi - 3_600_000) },
      },
    }),
    // 3) Mükerrer: aynı ad + aynı davetiye son 10 dakikada gönderildi mi?
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

  const rsvp = await prisma.rSVP.create({
    data: {
      davetiyeId,
      ad: ad.trim(),
      email: email?.trim() || null,
      telefon: telefon?.trim() || null,
      katilim,
      kisiSayisi: kisiSayisi || 1,
      mesaj: mesaj?.trim() || null,
    },
  });

  if (davetiye.user?.email) {
    rsvpBildirimiGonder({
      sahipEmail: davetiye.user.email,
      sahipAd:    davetiye.user.name || "Kullanıcı",
      davetiyeBaslik: davetiye.baslik,
      davetiyeSlug:   davetiye.slug,
      misafirAd:   ad.trim(),
      katilim,
      kisiSayisi:  kisiSayisi || 1,
      misafirNot:  mesaj,
    });
  }

  return NextResponse.json({ basarili: true, rsvp });
}

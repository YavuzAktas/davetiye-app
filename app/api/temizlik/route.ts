import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";
import { blobSilVeyaKuyrugaAl } from "@/lib/medya-silme";

function cronYetkiliMi(authHeader: string | null, cronSecret: string | undefined): boolean {
  const secret = cronSecret?.trim();
  if (!secret) return false;

  const beklenen = `Bearer ${secret}`;
  if (!authHeader || authHeader.length !== beklenen.length) return false;

  return timingSafeEqual(Buffer.from(authHeader), Buffer.from(beklenen));
}

function cronSecretEksik(): boolean {
  return !process.env.CRON_SECRET?.trim();
}

// Vercel Cron veya manuel tetikleme için CRON_SECRET ile korunur
export async function GET(req: NextRequest): Promise<NextResponse> {
  if (cronSecretEksik()) {
    return NextResponse.json(
      { hata: "Temizlik görevi yapılandırılmamış." },
      { status: 503 },
    );
  }

  if (!cronYetkiliMi(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const simdi = new Date();
  const birYilOnce = new Date(simdi.getTime() - 365 * 24 * 60 * 60 * 1000);
  const otuzGunOnce = new Date(simdi.getTime() - 30 * 24 * 60 * 60 * 1000);
  const onYilOnce = new Date(simdi.getTime() - 10 * 365 * 24 * 60 * 60 * 1000);
  const birGunOnce = new Date(simdi.getTime() - 24 * 60 * 60 * 1000);

  // 1) Etkinlik tarihi 1 yıldan önce geçmiş davetiyelerin misafir verilerini sil
  //    (KVKK politikası: "etkinlik tarihinden itibaren en geç 1 yıl içinde silinir")
  const eskiDavetiyeIdleri = await prisma.davetiye.findMany({
    where: {
      OR: [
        { tarih: { lt: birYilOnce } },                    // tarih varsa ve 1 yıl geçmişse
        { tarih: null, createdAt: { lt: birYilOnce } },   // tarih yoksa oluşturma tarihine göre
      ],
    },
    select: { id: true },
  });

  const idler = eskiDavetiyeIdleri.map(d => d.id);

  const silinenRsvp = await prisma.rSVP.deleteMany({
    where: { davetiyeId: { in: idler } },
  });

  const silinenDavetli = await prisma.davetli.deleteMany({
    where: { davetiyeId: { in: idler } },
  });

  // 2) Süresi dolmuş ve 30 günden eski OdemeToken'ları sil (kısa audit trail korunur)
  const silinenToken = await prisma.odemeToken.deleteMany({
    where: {
      expiresAt: { lt: otuzGunOnce },
    },
  });

  // 3) Yasal saklama süresi dolan ödeme kayıtlarını sil
  const silinenOdemeKaydi = await prisma.odemeKaydi.deleteMany({
    where: {
      createdAt: { lt: onYilOnce },
    },
  });

  // 4) Davetiye oluşturulmadan kalan geçici polaroid dosyalarını sil
  const eskiGeciciYuklemeler = await prisma.geciciYukleme.findMany({
    where: {
      kullanildi: false,
      createdAt: { lt: birGunOnce },
    },
    select: { id: true, dosyaUrl: true },
    take: 100,
  });

  let silinenGeciciYukleme = 0;
  for (const yukleme of eskiGeciciYuklemeler) {
    const silindi = await blobSilVeyaKuyrugaAl(yukleme.dosyaUrl, "gecici-yukleme-temizlik");
    if (silindi) {
      await prisma.geciciYukleme.delete({ where: { id: yukleme.id } });
      silinenGeciciYukleme++;
    }
  }

  // 5) Önceden silinemeyen medya dosyalarını yeniden dene
  const silmeKuyrugu = await prisma.medyaSilmeKuyrugu.findMany({
    where: {
      OR: [
        { sonrakiDeneme: null },
        { sonrakiDeneme: { lte: simdi } },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  let kuyruktanSilinenMedya = 0;
  for (const kayit of silmeKuyrugu) {
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error("BLOB_READ_WRITE_TOKEN eksik");
      }
      await del(kayit.dosyaUrl);
      await prisma.medyaSilmeKuyrugu.delete({ where: { id: kayit.id } });
      await prisma.geciciYukleme.deleteMany({ where: { dosyaUrl: kayit.dosyaUrl } });
      kuyruktanSilinenMedya++;
    } catch (err) {
      const denemeSayisi = kayit.denemeSayisi + 1;
      await prisma.medyaSilmeKuyrugu.update({
        where: { id: kayit.id },
        data: {
          denemeSayisi,
          sonHata: err instanceof Error ? err.message.slice(0, 500) : String(err).slice(0, 500),
          sonrakiDeneme: new Date(Date.now() + Math.min(60, denemeSayisi * 10) * 60_000),
        },
      });
    }
  }

  return NextResponse.json({
    basarili: true,
    silinenRsvp: silinenRsvp.count,
    silinenDavetli: silinenDavetli.count,
    silinenToken: silinenToken.count,
    silinenOdemeKaydi: silinenOdemeKaydi.count,
    silinenGeciciYukleme,
    kuyruktanSilinenMedya,
    tarih: simdi.toISOString(),
  });
}

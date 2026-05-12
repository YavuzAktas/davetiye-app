import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron veya manuel tetikleme için CRON_SECRET ile korunur
export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const simdi = new Date();
  const birYilOnce = new Date(simdi.getTime() - 365 * 24 * 60 * 60 * 1000);
  const otuzGunOnce = new Date(simdi.getTime() - 30 * 24 * 60 * 60 * 1000);
  const onYilOnce = new Date(simdi.getTime() - 10 * 365 * 24 * 60 * 60 * 1000);

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

  return NextResponse.json({
    basarili: true,
    silinenRsvp: silinenRsvp.count,
    silinenDavetli: silinenDavetli.count,
    silinenToken: silinenToken.count,
    silinenOdemeKaydi: silinenOdemeKaydi.count,
    tarih: simdi.toISOString(),
  });
}

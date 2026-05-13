import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";
import { blobSilVeyaKuyrugaAl } from "@/lib/medya-silme";
import { cronSecretEksik, cronYetkiliMi } from "@/lib/cron-auth";
import { imhaKayitlariOlustur } from "@/lib/imha-kaydi";

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
  const ucYilOnce = new Date(simdi.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
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

  // 4) Hesap silinmesinden sonra saklama süresi dolan yasal onay kayıtlarını sil
  const silinenYasalOnayKaydi = await prisma.yasalOnayKaydi.deleteMany({
    where: {
      hesapSilindiAt: { lt: ucYilOnce },
    },
  });

  // 5) Davetiye oluşturulmadan kalan geçici polaroid dosyalarını sil
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

  // 6) Önceden silinemeyen medya dosyalarını yeniden dene
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

  const kalanMedyaKuyrugu = await prisma.medyaSilmeKuyrugu.aggregate({
    _count: { id: true },
    _max: {
      denemeSayisi: true,
      createdAt: true,
    },
  });

  await imhaKayitlariOlustur([
    {
      kaynak: "temizlik-cron",
      islemTuru: "periyodik-imha",
      veriKategorisi: "RSVP kayıtları",
      adet: silinenRsvp.count,
      yontem: "veritabanı kayıt silme",
      gerekce: "Etkinlik tarihinden itibaren 1 yıllık saklama süresinin dolması",
    },
    {
      kaynak: "temizlik-cron",
      islemTuru: "periyodik-imha",
      veriKategorisi: "Davetli listesi kayıtları",
      adet: silinenDavetli.count,
      yontem: "veritabanı kayıt silme",
      gerekce: "Etkinlik tarihinden itibaren 1 yıllık saklama süresinin dolması",
    },
    {
      kaynak: "temizlik-cron",
      islemTuru: "periyodik-imha",
      veriKategorisi: "Süresi dolmuş ödeme tokenları",
      adet: silinenToken.count,
      yontem: "veritabanı kayıt silme",
      gerekce: "Ödeme token saklama süresinin dolması",
    },
    {
      kaynak: "temizlik-cron",
      islemTuru: "yasal-saklama-sonu-imha",
      veriKategorisi: "Ödeme kayıtları",
      adet: silinenOdemeKaydi.count,
      yontem: "veritabanı kayıt silme",
      gerekce: "10 yıllık yasal saklama süresinin dolması",
    },
    {
      kaynak: "temizlik-cron",
      islemTuru: "yasal-saklama-sonu-imha",
      veriKategorisi: "Yasal bilgilendirme ve kabul kayıtları",
      adet: silinenYasalOnayKaydi.count,
      yontem: "veritabanı kayıt silme",
      gerekce: "Hesap silinmesinden sonra 3 yıllık saklama süresinin dolması",
    },
    {
      kaynak: "temizlik-cron",
      islemTuru: "gecici-yukleme-imha",
      veriKategorisi: "Kullanılmamış geçici medya yüklemeleri",
      adet: silinenGeciciYukleme,
      yontem: "Vercel Blob ve veritabanı kayıt silme",
      gerekce: "Davetiye oluşturulmadan kalan geçici yükleme saklama süresinin dolması",
    },
    {
      kaynak: "temizlik-cron",
      islemTuru: "medya-silme-kuyrugu-imha",
      veriKategorisi: "Önceden silinemeyen medya dosyaları",
      adet: kuyruktanSilinenMedya,
      yontem: "Vercel Blob silme ve kuyruk kaydı silme",
      gerekce: "Önceki silme talebinin yeniden denenmesi",
    },
  ]);

  return NextResponse.json({
    basarili: true,
    silinenRsvp: silinenRsvp.count,
    silinenDavetli: silinenDavetli.count,
    silinenToken: silinenToken.count,
    silinenOdemeKaydi: silinenOdemeKaydi.count,
    silinenYasalOnayKaydi: silinenYasalOnayKaydi.count,
    silinenGeciciYukleme,
    kuyruktanSilinenMedya,
    kuyruktaKalanMedya: kalanMedyaKuyrugu._count.id,
    medyaSilmeEnYuksekDeneme: kalanMedyaKuyrugu._max.denemeSayisi ?? 0,
    medyaSilmeSonKayitTarihi: kalanMedyaKuyrugu._max.createdAt?.toISOString() ?? null,
    tarih: simdi.toISOString(),
  });
}

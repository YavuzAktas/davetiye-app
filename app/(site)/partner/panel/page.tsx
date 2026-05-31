import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import PanelIcerik from "./PanelIcerik";
import AktivasyonKodlari from "./AktivasyonKodlari";
import LogoYukle from "./LogoYukle";
import PartnerOperasyonOzeti from "./PartnerOperasyonOzeti";
import PartnerTeklifOlusturucu from "./PartnerTeklifOlusturucu";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Partner Paneli | Bekleriz",
  robots: { index: false },
};

export default async function PartnerPanelPage({
  searchParams,
}: {
  searchParams: Promise<{ odeme?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/giris?callbackUrl=/partner/panel");

  const [partner, aktivasyonKodlariHam, odemeKayitlariHam] = await Promise.all([
    prisma.partner.findUnique({
      where: { userId: session.user.id },
      include: {
        abonelikler: {
          where: { aktif: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.aktivasyonKodu.findMany({
      where: { partner: { userId: session.user.id } },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        kod: true,
        durum: true,
        createdAt: true,
        kullanilanAt: true,
        not: true,
      },
    }),
    prisma.odemeKaydi.findMany({
      where: { userId: session.user.id, urunTipi: "partner-paket" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        createdAt: true,
        planId: true,
        paidPrice: true,
        currency: true,
        paymentId: true,
        fiyatKirilimi: true,
      },
    }),
  ]);

  if (!partner) redirect("/partner/basvuru");

  const { odeme } = await searchParams;
  const odemeBasarili = odeme === "basarili";

  const abonelikHam = partner.abonelikler[0] ?? null;
  // Süresi dolmuş abonelikleri geçersiz say (cron henüz çalışmamış olabilir)
  const abonelikGecerli =
    abonelikHam && (!abonelikHam.bitisAt || abonelikHam.bitisAt > new Date());
  const abonelik = abonelikGecerli
    ? {
        paketId: abonelikHam.paketId,
        hakSayisi: abonelikHam.hakSayisi,
        kullanilanHak: abonelikHam.kullanilanHak,
        baslangicAt: abonelikHam.baslangicAt.toISOString(),
        bitisAt: abonelikHam.bitisAt?.toISOString() ?? null,
        otomatikYenileme: abonelikHam.otomatikYenileme,
        abonelikDurumu: abonelikHam.abonelikDurumu,
        sonrakiTahsilatAt: abonelikHam.sonrakiTahsilatAt?.toISOString() ?? null,
      }
    : null;

  const kodlar = aktivasyonKodlariHam.map(k => ({
    id: k.id,
    kod: k.kod,
    durum: k.durum,
    createdAt: k.createdAt.toISOString(),
    kullanilanAt: k.kullanilanAt?.toISOString() ?? null,
    not: k.not ?? null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {partner.durum === "aktif" && <LogoYukle mevcutLogo={partner.logoUrl ?? null} />}
            <div>
              <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-0.5">Partner Paneli</p>
              <h1 className="text-xl font-black text-gray-900">{partner.firmaAdi}</h1>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            partner.durum === "aktif" ? "bg-green-100 text-green-700" :
            partner.durum === "beklemede" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-600"
          }`}>
            {partner.durum}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {partner.durum === "beklemede" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">⏳</div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Başvurunuz İnceleniyor</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Başvurunuzu aldık. Ekibimiz inceleme yapıyor.
              </p>
            </div>

            {/* Süreç adımları */}
            <div className="space-y-3 mb-8">
              {[
                { label: "Başvuru alındı", done: true, desc: new Date(partner.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "İnceleme aşamasında", done: false, aktif: true, desc: "Ortalama 24 saat içinde değerlendiriyoruz" },
                { label: "Hesap aktivasyonu", done: false, desc: "Onay sonrası panel erişiminiz açılır" },
              ].map((adim, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                    adim.done ? "bg-green-500 text-white" :
                    adim.aktif ? "bg-yellow-400 text-white" :
                    "bg-gray-200 text-gray-400"
                  }`}>
                    {adim.done ? "✓" : i + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${adim.aktif ? "text-gray-900" : adim.done ? "text-gray-600" : "text-gray-400"}`}>
                      {adim.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{adim.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-xs text-gray-400 mb-1">Sorularınız için</p>
              <a href="mailto:destek@bekleriz.com" className="text-sm font-semibold text-purple-600 hover:underline">
                destek@bekleriz.com
              </a>
            </div>
          </div>
        )}

        {partner.durum === "askida" && (
          <div className="bg-white rounded-3xl border border-red-100 p-10 text-center">
            <div className="text-4xl mb-4">⛔</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Hesabınız Askıya Alındı</h2>
            <p className="text-sm text-gray-500">
              Detaylar için{" "}
              <a href="mailto:destek@bekleriz.com" className="text-purple-600 hover:underline">destek@bekleriz.com</a>
              {" "}adresine yazın.
            </p>
          </div>
        )}

        {partner.durum === "aktif" && (
          <div className="space-y-6">
            <PartnerOperasyonOzeti
              firmaAdi={partner.firmaAdi}
              abonelik={abonelik ? {
                paketId: abonelik.paketId,
                hakSayisi: abonelik.hakSayisi,
                kullanilanHak: abonelik.kullanilanHak,
                bitisAt: abonelik.bitisAt,
              } : null}
              kodlar={kodlar}
            />
            <PartnerTeklifOlusturucu firmaAdi={partner.firmaAdi} />
            <AktivasyonKodlari
              firmaAdi={partner.firmaAdi}
              abonelik={abonelik ? {
                paketId: abonelik.paketId,
                hakSayisi: abonelik.hakSayisi,
                kullanilanHak: abonelik.kullanilanHak,
                bitisAt: abonelik.bitisAt,
              } : null}
              kodlar={kodlar}
            />
            <PanelIcerik
              partner={{ id: partner.id, firmaAdi: partner.firmaAdi }}
              abonelik={abonelik}
              odemeBasarili={odemeBasarili}
              odemeGecmisi={odemeKayitlariHam.map(k => ({
                id: k.id,
                createdAt: k.createdAt.toISOString(),
                planId: k.planId,
                paidPrice: k.paidPrice,
                currency: k.currency,
                paymentId: k.paymentId,
                fiyatKirilimi: k.fiyatKirilimi,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

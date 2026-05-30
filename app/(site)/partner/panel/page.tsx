import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import PanelIcerik from "./PanelIcerik";
import AktivasyonKodlari from "./AktivasyonKodlari";
import LogoYukle from "./LogoYukle";

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
      }
    : null;

  const kodlar = aktivasyonKodlariHam.map(k => ({
    id: k.id,
    kod: k.kod,
    durum: k.durum,
    createdAt: k.createdAt.toISOString(),
    kullanilanAt: k.kullanilanAt?.toISOString() ?? null,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
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

      <div className="max-w-4xl mx-auto px-4 py-10">
        {partner.durum === "beklemede" && (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Başvurunuz İnceleniyor</h2>
            <p className="text-sm text-gray-500">Ekibimiz en kısa sürede sizinle iletişime geçecek.</p>
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
            <AktivasyonKodlari
              firmaAdi={partner.firmaAdi}
              abonelik={abonelik ? { hakSayisi: abonelik.hakSayisi, kullanilanHak: abonelik.kullanilanHak } : null}
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

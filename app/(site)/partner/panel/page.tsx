import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import PanelIcerik from "./PanelIcerik";
import AktivasyonKodlari from "./AktivasyonKodlari";
import LogoYukle from "./LogoYukle";
import PartnerMarkaAyarlari from "./PartnerMarkaAyarlari";
import PartnerHazirPaketler from "./PartnerHazirPaketler";
import PartnerLeadCRM from "./PartnerLeadCRM";
import PartnerOnboardingChecklist from "./PartnerOnboardingChecklist";
import PartnerOperasyonMerkezi from "./PartnerOperasyonMerkezi";
import PartnerPanelNav from "./PartnerPanelNav";
import PartnerSatisRehberi from "./PartnerSatisRehberi";
import PartnerTeklifOlusturucu from "./PartnerTeklifOlusturucu";
import PartnerWhatsappAsistani from "./PartnerWhatsappAsistani";

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

  const [partner, aktivasyonKodlariHam, odemeKayitlariHam, partnerLeadleriHam] = await Promise.all([
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
    prisma.partnerLead.findMany({
      where: { partner: { userId: session.user.id } },
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        baslik: true,
        ilgiliKisi: true,
        telefon: true,
        eposta: true,
        etkinlikTuru: true,
        etkinlikTarihi: true,
        kisiSayisi: true,
        kaynak: true,
        durum: true,
        not: true,
        sonGorusmeAt: true,
        createdAt: true,
        updatedAt: true,
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

  const durumRenk =
    partner.durum === "aktif"    ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/25" :
    partner.durum === "beklemede" ? "bg-yellow-400/15 text-yellow-300 border border-yellow-400/25" :
                                    "bg-red-400/15 text-red-300 border border-red-400/25";
  const durumLabel =
    partner.durum === "aktif"    ? "Aktif" :
    partner.durum === "beklemede" ? "İnceleniyor" :
                                    "Askıda";

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ── Dark hero header ── */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-700 opacity-20 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-pink-700 opacity-15 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/55 text-xs mb-8">
            <Link href="/dashboard" className="hover:text-white/80 transition-colors">Dashboard</Link>
            <span className="text-white/35">›</span>
            <span className="text-white/70">Partner Paneli</span>
          </div>

          {/* Logo + firma adı + durum */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {partner.durum === "aktif" && (
              <div className="shrink-0">
                <LogoYukle mevcutLogo={partner.logoUrl ?? null} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold tracking-[0.26em] uppercase text-purple-300/70 mb-1">
                Partner Paneli
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {partner.firmaAdi}
              </h1>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${durumRenk}`}>
              {durumLabel}
            </span>
          </div>
        </div>

        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
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
            <PartnerPanelNav abonelikVar={Boolean(abonelik)} />
            <div id="kurulum" className="scroll-mt-24">
              <PartnerOnboardingChecklist
                abonelik={abonelik ? {
                  paketId: abonelik.paketId,
                  hakSayisi: abonelik.hakSayisi,
                  kullanilanHak: abonelik.kullanilanHak,
                  bitisAt: abonelik.bitisAt,
                } : null}
                kodlar={kodlar}
                teklifHazir={partner.teklifHazir}
                marka={{
                  logoUrl: partner.logoUrl,
                  markaSlogani: partner.markaSlogani,
                  destekTelefonu: partner.destekTelefonu,
                  instagramUrl: partner.instagramUrl,
                  whatsappImzasi: partner.whatsappImzasi,
                }}
              />
            </div>
            {abonelik && (
              <>
                <div id="lead-crm" className="scroll-mt-24">
                  <PartnerLeadCRM
                    leadler={partnerLeadleriHam.map(lead => ({
                      id: lead.id,
                      baslik: lead.baslik,
                      ilgiliKisi: lead.ilgiliKisi,
                      telefon: lead.telefon,
                      eposta: lead.eposta,
                      etkinlikTuru: lead.etkinlikTuru,
                      etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
                      kisiSayisi: lead.kisiSayisi,
                      kaynak: lead.kaynak,
                      durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                      not: lead.not,
                      sonGorusmeAt: lead.sonGorusmeAt?.toISOString() ?? null,
                      createdAt: lead.createdAt.toISOString(),
                      updatedAt: lead.updatedAt.toISOString(),
                    }))}
                  />
                </div>
                <div id="paketler" className="scroll-mt-24">
                  <PartnerHazirPaketler firmaAdi={partner.firmaAdi} whatsappImzasi={partner.whatsappImzasi} />
                </div>
                <div id="whatsapp-asistani" className="scroll-mt-24">
                  <PartnerWhatsappAsistani
                    firmaAdi={partner.firmaAdi}
                    whatsappImzasi={partner.whatsappImzasi}
                    leadler={partnerLeadleriHam.map(lead => ({
                      id: lead.id,
                      baslik: lead.baslik,
                      ilgiliKisi: lead.ilgiliKisi,
                      telefon: lead.telefon,
                      etkinlikTuru: lead.etkinlikTuru,
                      etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
                      kisiSayisi: lead.kisiSayisi,
                      durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                    }))}
                  />
                </div>
                <div id="aktivasyon-kodlari" className="scroll-mt-24">
                  <AktivasyonKodlari
                    firmaAdi={partner.firmaAdi}
                    destekTelefonu={partner.destekTelefonu}
                    instagramUrl={partner.instagramUrl}
                    whatsappImzasi={partner.whatsappImzasi}
                    abonelik={{
                      paketId: abonelik.paketId,
                      hakSayisi: abonelik.hakSayisi,
                      kullanilanHak: abonelik.kullanilanHak,
                      bitisAt: abonelik.bitisAt,
                    }}
                    kodlar={kodlar}
                  />
                </div>
                <div id="operasyon" className="scroll-mt-24">
                  <PartnerOperasyonMerkezi
                    firmaAdi={partner.firmaAdi}
                    abonelik={{
                      paketId: abonelik.paketId,
                      hakSayisi: abonelik.hakSayisi,
                      kullanilanHak: abonelik.kullanilanHak,
                      bitisAt: abonelik.bitisAt,
                    }}
                    kodlar={kodlar}
                  />
                </div>
                <div id="satis" className="scroll-mt-24">
                  <PartnerSatisRehberi />
                </div>
                <div id="teklif" className="scroll-mt-24">
                  <PartnerTeklifOlusturucu
                    firmaAdi={partner.firmaAdi}
                    markaRenk={partner.markaRenk}
                    markaSlogani={partner.markaSlogani}
                    destekTelefonu={partner.destekTelefonu}
                    instagramUrl={partner.instagramUrl}
                    whatsappImzasi={partner.whatsappImzasi}
                    teklifHazir={partner.teklifHazir}
                    teklifNotlari={
                      Array.isArray(partner.teklifNotlari)
                        ? (partner.teklifNotlari as { id: string; metin: string; createdAt: string }[])
                        : []
                    }
                  />
                </div>
              </>
            )}
            <div id="marka" className="scroll-mt-24">
              <PartnerMarkaAyarlari
                firmaAdi={partner.firmaAdi}
                marka={{
                  markaRenk: partner.markaRenk,
                  markaSlogani: partner.markaSlogani,
                  destekTelefonu: partner.destekTelefonu,
                  instagramUrl: partner.instagramUrl,
                  whatsappImzasi: partner.whatsappImzasi,
                }}
              />
            </div>
            <div id="odeme" className="scroll-mt-24">
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
          </div>
        )}
      </div>
    </div>
  );
}

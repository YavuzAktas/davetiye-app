import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";
import PanelIcerik from "./PanelIcerik";
import AktivasyonKodlari from "./AktivasyonKodlari";
import PartnerEkipErisimleri from "./PartnerEkipErisimleri";
import LogoYukle from "./LogoYukle";
import PartnerMarkaAyarlari from "./PartnerMarkaAyarlari";
import PartnerHazirPaketler from "./PartnerHazirPaketler";
import PartnerLeadCRM from "./PartnerLeadCRM";
import PartnerMusteriSegmentleri from "./PartnerMusteriSegmentleri";
import PartnerOnboardingChecklist from "./PartnerOnboardingChecklist";
import PartnerOperasyonMerkezi from "./PartnerOperasyonMerkezi";
import PartnerPanelNav from "./PartnerPanelNav";
import PanelAracGrubu from "./PanelAracGrubu";
import PartnerPanelOzeti from "./PartnerPanelOzeti";
import PartnerSatisAnalitigi from "./PartnerSatisAnalitigi";
import PartnerSalonTakvimi from "./PartnerSalonTakvimi";
import PartnerSatisRehberi from "./PartnerSatisRehberi";
import PartnerTeslimRaporu from "./PartnerTeslimRaporu";
import PartnerTeklifOlusturucu from "./PartnerTeklifOlusturucu";
import PartnerWhatsappAsistani from "./PartnerWhatsappAsistani";
import PartnerTebrikEkrani from "./PartnerTebrikEkrani";
import PartnerIsAkisi from "./PartnerIsAkisi";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Partner Paneli | DavetRota",
  robots: { index: false },
};

const SITE_URL = getSiteUrl();

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
        ekipErisimleri: {
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            rol: true,
            etiket: true,
            aktif: true,
            expiresAt: true,
            lastUsedAt: true,
            revokedAt: true,
            createdAt: true,
          },
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
        davetiye: {
          select: {
            slug: true,
            baslik: true,
            aktif: true,
            tarih: true,
            goruntulenme: true,
            albumAktif: true,
            aniDefteriAktif: true,
            sesliAniAktif: true,
            canliDuvarAktif: true,
            oturmaPlanAktif: true,
            checkInAktif: true,
            aniKitabiAktif: true,
            updatedAt: true,
            _count: {
              select: {
                davetliler: true,
                rsvplar: true,
                albumFotolar: true,
                aniDefterleri: true,
                sesliAnilar: true,
                masalar: true,
              },
            },
          },
        },
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
        seansBaslangic: true,
        seansBitis: true,
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

  const teslimRaporuKodlari = aktivasyonKodlariHam.map(k => ({
    id: k.id,
    kod: k.kod,
    durum: k.durum,
    createdAt: k.createdAt.toISOString(),
    kullanilanAt: k.kullanilanAt?.toISOString() ?? null,
    not: k.not ?? null,
    davetiye: k.davetiye
      ? {
          slug: k.davetiye.slug,
          baslik: k.davetiye.baslik,
          aktif: k.davetiye.aktif,
          tarih: k.davetiye.tarih?.toISOString() ?? null,
          goruntulenme: k.davetiye.goruntulenme,
          albumAktif: k.davetiye.albumAktif,
          aniDefteriAktif: k.davetiye.aniDefteriAktif,
          sesliAniAktif: k.davetiye.sesliAniAktif,
          canliDuvarAktif: k.davetiye.canliDuvarAktif,
          oturmaPlanAktif: k.davetiye.oturmaPlanAktif,
          checkInAktif: k.davetiye.checkInAktif,
          aniKitabiAktif: k.davetiye.aniKitabiAktif,
          updatedAt: k.davetiye.updatedAt.toISOString(),
          sayilar: {
            davetli: k.davetiye._count.davetliler,
            rsvp: k.davetiye._count.rsvplar,
            foto: k.davetiye._count.albumFotolar,
            ani: k.davetiye._count.aniDefterleri,
            sesliAni: k.davetiye._count.sesliAnilar,
            masa: k.davetiye._count.masalar,
          },
        }
      : null,
  }));

  const durumRenk =
    partner.durum === "aktif"    ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    partner.durum === "beklemede" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                    "bg-red-50 text-red-700 border-red-200";
  const durumLabel =
    partner.durum === "aktif"    ? "Aktif" :
    partner.durum === "beklemede" ? "İnceleniyor" :
                                    "Askıda";

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden">

      {/* ── Light hero header ── */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-linear-to-br from-purple-50/70 via-white to-pink-50/30 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-8">
            <Link href="/dashboard" className="hover:text-purple-600 transition-colors font-semibold">Dashboard</Link>
            <span className="text-gray-300">›</span>
            <span className="text-gray-600 font-semibold">Partner Paneli</span>
          </div>

          {/* Logo + firma adı + durum */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {partner.durum === "aktif" && (
              <div className="shrink-0">
                <LogoYukle mevcutLogo={partner.logoUrl ?? null} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-600/70 mb-1.5">
                Partner Paneli
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {partner.firmaAdi}
              </h1>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 border ${durumRenk}`}>
              {durumLabel}
            </span>
          </div>
        </div>
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
              <a href="mailto:destek@davetrota.com" className="text-sm font-semibold text-purple-600 hover:underline">
                destek@davetrota.com
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
              <a href="mailto:destek@davetrota.com" className="text-purple-600 hover:underline">destek@davetrota.com</a>
              {" "}adresine yazın.
            </p>
          </div>
        )}

        {partner.durum === "aktif" && (
          <div className="space-y-6">
            <PartnerTebrikEkrani partnerId={partner.id} firmaAdi={partner.firmaAdi} />
            <PartnerPanelNav abonelikVar={Boolean(abonelik)} />
            <PanelBolum
              id="ozet"
              etiket="Özet"
              baslik="Bugün neye bakmalı?"
            >
              <PartnerPanelOzeti
                abonelik={abonelik ? {
                  paketId: abonelik.paketId,
                  hakSayisi: abonelik.hakSayisi,
                  kullanilanHak: abonelik.kullanilanHak,
                  bitisAt: abonelik.bitisAt,
                } : null}
                kodlar={kodlar}
                leadler={partnerLeadleriHam.map(lead => ({
                  id: lead.id,
                  baslik: lead.baslik,
                  durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                  etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
                  kisiSayisi: lead.kisiSayisi,
                  updatedAt: lead.updatedAt.toISOString(),
                }))}
                ekipErisimleri={partner.ekipErisimleri.map(erisim => ({
                  id: erisim.id,
                  aktif: erisim.aktif,
                  expiresAt: erisim.expiresAt?.toISOString() ?? null,
                  revokedAt: erisim.revokedAt?.toISOString() ?? null,
                }))}
                teklifHazir={partner.teklifHazir}
                marka={{
                  logoUrl: partner.logoUrl,
                  markaSlogani: partner.markaSlogani,
                  destekTelefonu: partner.destekTelefonu,
                  instagramUrl: partner.instagramUrl,
                  whatsappImzasi: partner.whatsappImzasi,
                }}
              />
              <PartnerIsAkisi
                abonelik={abonelik ? {
                  hakSayisi: abonelik.hakSayisi,
                  kullanilanHak: abonelik.kullanilanHak,
                } : null}
                kodlar={kodlar}
                teklifHazir={partner.teklifHazir}
                leadler={partnerLeadleriHam.map(lead => ({
                  id: lead.id,
                  baslik: lead.baslik,
                  durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                }))}
              />
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
            </PanelBolum>
            {abonelik && (
              <>
                <PanelBolum
                  id="satis-akisi"
                  etiket="Satış"
                  baslik="Müşteri ve teklif takibi"
                >
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
                        seansBaslangic: lead.seansBaslangic,
                        seansBitis: lead.seansBitis,
                        sonGorusmeAt: lead.sonGorusmeAt?.toISOString() ?? null,
                        createdAt: lead.createdAt.toISOString(),
                        updatedAt: lead.updatedAt.toISOString(),
                      }))}
                    />
                  </div>
                  <PanelAracGrubu
                    id="satis-takip-grubu"
                    baslik="Müşteri grupları ve raporlar"
                    aciklama="Hangi müşteri hangi aşamada, hızlıca kontrol edin."
                    hedefler={["segmentler", "analitik"]}
                  >
                    <div id="segmentler" className="scroll-mt-24">
                      <PartnerMusteriSegmentleri
                        leadler={partnerLeadleriHam.map(lead => ({
                          id: lead.id,
                          baslik: lead.baslik,
                          etkinlikTuru: lead.etkinlikTuru,
                          etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
                          kisiSayisi: lead.kisiSayisi,
                          kaynak: lead.kaynak,
                          durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                          createdAt: lead.createdAt.toISOString(),
                          updatedAt: lead.updatedAt.toISOString(),
                        }))}
                      />
                    </div>
                    <div id="analitik" className="scroll-mt-24">
                      <PartnerSatisAnalitigi
                        abonelik={{
                          paketId: abonelik.paketId,
                          hakSayisi: abonelik.hakSayisi,
                          kullanilanHak: abonelik.kullanilanHak,
                          bitisAt: abonelik.bitisAt,
                        }}
                        kodlar={kodlar.map(kod => ({
                          id: kod.id,
                          durum: kod.durum,
                          createdAt: kod.createdAt,
                          kullanilanAt: kod.kullanilanAt,
                        }))}
                        leadler={partnerLeadleriHam.map(lead => ({
                          id: lead.id,
                          baslik: lead.baslik,
                          etkinlikTuru: lead.etkinlikTuru,
                          etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
                          kisiSayisi: lead.kisiSayisi,
                          durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                          createdAt: lead.createdAt.toISOString(),
                          updatedAt: lead.updatedAt.toISOString(),
                        }))}
                        odemeGecmisi={odemeKayitlariHam.map(k => ({
                          id: k.id,
                          createdAt: k.createdAt.toISOString(),
                          planId: k.planId,
                          paidPrice: k.paidPrice,
                          currency: k.currency,
                          fiyatKirilimi: k.fiyatKirilimi,
                        }))}
                      />
                    </div>
                  </PanelAracGrubu>
                  <PanelAracGrubu
                    id="satis-araclari-grubu"
                    baslik="Teklif ve mesaj araçları"
                    aciklama="Paket metni, WhatsApp mesajı ve teklif çıktısını buradan hazırlayın."
                    hedefler={["paketler", "whatsapp-asistani", "teklif", "satis"]}
                  >
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
                        leadler={partnerLeadleriHam.map(lead => ({
                          id: lead.id,
                          baslik: lead.baslik,
                          ilgiliKisi: lead.ilgiliKisi,
                          etkinlikTuru: lead.etkinlikTuru,
                          etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
                          kisiSayisi: lead.kisiSayisi,
                          durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                        }))}
                      />
                    </div>
                    <div id="satis" className="scroll-mt-24">
                      <PartnerSatisRehberi />
                    </div>
                  </PanelAracGrubu>
                </PanelBolum>

                <PanelBolum
                  id="teslim-akisi"
                  etiket="Teslim"
                  baslik="Müşteriye teslim"
                >
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
                  <PanelAracGrubu
                    id="teslim-raporu-grubu"
                    baslik="Teslim raporu"
                    aciklama="Müşteriye göndereceğiniz kısa başarı özetini hazırlayın."
                    hedefler={["teslim-raporu"]}
                  >
                    <div id="teslim-raporu" className="scroll-mt-24">
                      <PartnerTeslimRaporu
                        firmaAdi={partner.firmaAdi}
                        kodlar={teslimRaporuKodlari}
                      />
                    </div>
                  </PanelAracGrubu>
                </PanelBolum>

                <PanelBolum
                  id="operasyon-akisi"
                  etiket="Operasyon"
                  baslik="Takvim ve ekip"
                >
                  <div id="salon-takvimi" className="scroll-mt-24">
                    <PartnerSalonTakvimi
                      leadler={partnerLeadleriHam.map(lead => ({
                        id: lead.id,
                        baslik: lead.baslik,
                        ilgiliKisi: lead.ilgiliKisi,
                        etkinlikTuru: lead.etkinlikTuru,
                        etkinlikTarihi: lead.etkinlikTarihi?.toISOString() ?? null,
                        kisiSayisi: lead.kisiSayisi,
                        durum: lead.durum as "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi",
                        seansBaslangic: lead.seansBaslangic,
                        seansBitis: lead.seansBitis,
                      }))}
                    />
                  </div>
                  <PanelAracGrubu
                    id="operasyon-detaylari-grubu"
                    baslik="Ekip linkleri ve iş takibi"
                    aciklama="Personele sınırlı erişim verin, açık işleri kontrol edin."
                    hedefler={["ekip", "operasyon"]}
                  >
                    <div id="ekip" className="scroll-mt-24">
                      <PartnerEkipErisimleri
                        baslangicErisimler={partner.ekipErisimleri.map(erisim => ({
                          id: erisim.id,
                          rol: erisim.rol,
                          rolEtiketi:
                            erisim.rol === "satis" ? "Satış" :
                            erisim.rol === "operasyon" ? "Operasyon" :
                            erisim.rol === "teslim" ? "Teslim" :
                            "Ekip",
                          etiket: erisim.etiket,
                          aktif: erisim.aktif,
                          expiresAt: erisim.expiresAt?.toISOString() ?? null,
                          lastUsedAt: erisim.lastUsedAt?.toISOString() ?? null,
                          revokedAt: erisim.revokedAt?.toISOString() ?? null,
                          createdAt: erisim.createdAt.toISOString(),
                        }))}
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
                  </PanelAracGrubu>
                </PanelBolum>
              </>
            )}
            <PanelBolum
              id="ayarlar-akisi"
              etiket="Ayarlar"
              baslik="Marka ve abonelik"
            >
              <div id="marka" className="scroll-mt-24">
                <PartnerMarkaAyarlari
                  firmaAdi={partner.firmaAdi}
                  portalUrl={`${SITE_URL}/partner/portal/${partner.id}`}
                  marka={{
                    markaRenk: partner.markaRenk,
                    markaSlogani: partner.markaSlogani,
                    destekTelefonu: partner.destekTelefonu,
                    instagramUrl: partner.instagramUrl,
                    whatsappImzasi: partner.whatsappImzasi,
                  }}
                />
              </div>
              <PanelAracGrubu
                id="odeme-grubu"
                baslik="Abonelik ve ödeme"
                aciklama="Paket, kart ve ödeme geçmişi işlemlerini buradan yönetin."
                hedefler={["odeme"]}
                varsayilanAcik={!abonelik || odemeBasarili}
              >
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
              </PanelAracGrubu>
            </PanelBolum>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelBolum({
  id,
  etiket,
  baslik,
  children,
}: {
  id: string;
  etiket: string;
  baslik: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-3 px-1">
        <span className="shrink-0 rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-sm shadow-purple-200/50">
          {etiket}
        </span>
        <h2 className="text-sm font-black text-gray-700">{baslik}</h2>
        <div className="h-px flex-1 bg-linear-to-r from-gray-100 to-transparent" />
      </div>
      {children}
    </section>
  );
}

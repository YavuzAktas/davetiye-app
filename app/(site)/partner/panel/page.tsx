import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
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
            <PanelBolum
              id="ozet"
              etiket="Özet"
              baslik="Bugünün önceliği"
              aciklama="Panele girince önce sıradaki işleri, hızlı işlemleri ve kurulum durumunu görün."
              linkler={[{ href: "#kurulum", label: "Kurulum" }]}
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
                  baslik="Müşteri kazanma ve teklif akışı"
                  aciklama="Müşteri adaylarını, satış paketlerini, mesajları, teklifleri ve raporları tek bölümde yönetin."
                  linkler={[
                    { href: "#lead-crm", label: "Müşteriler" },
                    { href: "#segmentler", label: "Müşteri grupları" },
                    { href: "#paketler", label: "Satış paketleri" },
                    { href: "#whatsapp-asistani", label: "Mesaj asistanı" },
                    { href: "#teklif", label: "Teklif" },
                    { href: "#analitik", label: "Raporlar" },
                    { href: "#satis", label: "Satış rehberi" },
                  ]}
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
                        sonGorusmeAt: lead.sonGorusmeAt?.toISOString() ?? null,
                        createdAt: lead.createdAt.toISOString(),
                        updatedAt: lead.updatedAt.toISOString(),
                      }))}
                    />
                  </div>
                  <PanelAracGrubu
                    id="satis-takip-grubu"
                    baslik="Müşteri takibi ve raporlar"
                    aciklama="Müşteri grupları ile satış raporlarını gerektiğinde açın; ana ekran daha sakin kalır."
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
                    aciklama="Hazır paket, WhatsApp metni, teklif oluşturucu ve satış rehberi bu yardımcı grupta."
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
                  baslik="Müşteriye teslim ve yayın akışı"
                  aciklama="Aktivasyon linklerini, teslim metinlerini ve müşteriye gönderilecek başarı raporlarını buradan yönetin."
                  linkler={[
                    { href: "#aktivasyon-kodlari", label: "Teslim linkleri" },
                    { href: "#teslim-raporu", label: "Teslim raporu" },
                  ]}
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
                    baslik="Teslim sonrası başarı raporu"
                    aciklama="Müşteriye gönderilecek özet raporu yalnızca gerektiğinde açın."
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
                  baslik="Etkinlik günü ve ekip yönetimi"
                  aciklama="Takvim, görevli erişimleri ve yayın sonrası takip işleri operasyon bölümünde toplanır."
                  linkler={[
                    { href: "#salon-takvimi", label: "Takvim" },
                    { href: "#ekip", label: "Ekip" },
                    { href: "#operasyon", label: "İş takibi" },
                  ]}
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
                      }))}
                    />
                  </div>
                  <PanelAracGrubu
                    id="operasyon-detaylari-grubu"
                    baslik="Ekip erişimi ve iş takibi"
                    aciklama="Personel linkleri ile yayın sonrası operasyon kontrolünü bu grupta tutun."
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
              baslik="Marka ve ödeme ayarları"
              aciklama="Müşteriye görünen marka bilgileri ile partner aboneliği/ödeme işlemleri bu bölümde yer alır."
              linkler={[
                { href: "#marka", label: "Marka" },
                { href: "#odeme", label: "Ödeme" },
              ]}
            >
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
              <PanelAracGrubu
                id="odeme-grubu"
                baslik="Abonelik ve ödeme işlemleri"
                aciklama="Paket satın alma, abonelik durumu ve ödeme geçmişini gerektiğinde açın."
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
  aciklama,
  linkler,
  children,
}: {
  id: string;
  etiket: string;
  baslik: string;
  aciklama: string;
  linkler: { href: string; label: string }[];
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="rounded-3xl border border-gray-100 bg-white px-5 py-5 shadow-sm sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">{etiket}</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">{baslik}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">{aciklama}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {linkler.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

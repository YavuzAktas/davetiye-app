"use client";

import { useMemo, useState } from "react";

type LeadDurumu = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  etkinlikTuru: string | null;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  durum: LeadDurumu;
  createdAt: string;
  updatedAt: string;
};

type Kod = {
  id: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
};

type Abonelik = {
  paketId: string;
  hakSayisi: number;
  kullanilanHak: number;
  bitisAt: string | null;
};

type OdemeKaydi = {
  id: string;
  createdAt: string;
  planId: string;
  paidPrice: string | null;
  currency: string | null;
  fiyatKirilimi: unknown;
};

type DurumMeta = {
  label: string;
  renk: string;
};

const DURUMLAR: Record<LeadDurumu, DurumMeta> = {
  yeni: { label: "Yeni", renk: "bg-gray-100 text-gray-700" },
  gorusuldu: { label: "Görüşüldü", renk: "bg-blue-50 text-blue-700" },
  teklif_gonderildi: { label: "Teklif", renk: "bg-purple-50 text-purple-700" },
  kapora_bekliyor: { label: "Kapora", renk: "bg-amber-50 text-amber-700" },
  kazandi: { label: "Kazanıldı", renk: "bg-emerald-50 text-emerald-700" },
  kaybedildi: { label: "Kaybedildi", renk: "bg-red-50 text-red-700" },
};

const AKTIVASYON_BASLADI = new Set(["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu", "yayinda"]);
const AKTIF_LEADLER = new Set<LeadDurumu>(["yeni", "gorusuldu", "teklif_gonderildi", "kapora_bekliyor"]);

function para(tutar: number, currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.max(0, tutar));
}

function yuzde(parca: number, toplam: number) {
  if (toplam <= 0) return 0;
  return Math.round((parca / toplam) * 100);
}

function tarihKisa(tarih: string) {
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

function sayiyaCevir(deger: string | null | undefined) {
  if (!deger) return 0;
  const sayi = Number(deger.replace(",", "."));
  return Number.isFinite(sayi) ? sayi : 0;
}

function fiyatKirilimiTutari(fiyatKirilimi: unknown) {
  if (!fiyatKirilimi || typeof fiyatKirilimi !== "object") return 0;
  const kayit = fiyatKirilimi as Record<string, unknown>;
  const adaylar = [kayit.toplamTutar, kayit.tutar, kayit.paidPrice, kayit.price];
  for (const aday of adaylar) {
    if (typeof aday === "number" && Number.isFinite(aday)) return aday;
    if (typeof aday === "string") {
      const sayi = sayiyaCevir(aday);
      if (sayi > 0) return sayi;
    }
  }
  return 0;
}

function odemeTutari(kayit: OdemeKaydi) {
  return sayiyaCevir(kayit.paidPrice) || fiyatKirilimiTutari(kayit.fiyatKirilimi);
}

function inputTutari(deger: string) {
  const sade = deger.replace(/\./g, "").replace(",", ".");
  const sayi = Number(sade);
  return Number.isFinite(sayi) ? sayi : 0;
}

export default function PartnerSatisAnalitigi({
  abonelik,
  kodlar,
  leadler,
  odemeGecmisi,
}: {
  abonelik: Abonelik;
  kodlar: Kod[];
  leadler: Lead[];
  odemeGecmisi: OdemeKaydi[];
}) {
  const [ortalamaSatis, setOrtalamaSatis] = useState("2500");
  const [karMarji, setKarMarji] = useState("35");

  const metrikler = useMemo(() => {
    const aktifKodlar = kodlar.filter(kod => kod.durum !== "iptal");
    const gonderilenKod = aktifKodlar.filter(kod => kod.durum !== "olusturuldu").length;
    const baslayanKod = aktifKodlar.filter(kod => AKTIVASYON_BASLADI.has(kod.durum)).length;
    const yayinKod = aktifKodlar.filter(kod => kod.durum === "yayinda").length;

    const aktifLead = leadler.filter(lead => AKTIF_LEADLER.has(lead.durum));
    const kazanilanLead = leadler.filter(lead => lead.durum === "kazandi");
    const kaybedilenLead = leadler.filter(lead => lead.durum === "kaybedildi");
    const teklifAsamasi = leadler.filter(lead => lead.durum === "teklif_gonderildi" || lead.durum === "kapora_bekliyor");

    const sonOdeme = odemeGecmisi[0] ?? null;
    const sonOdemeTutari = sonOdeme ? odemeTutari(sonOdeme) : 0;
    const paraBirimi = sonOdeme?.currency || "TRY";
    const hakBasinaMaliyet = abonelik.hakSayisi > 0 ? sonOdemeTutari / abonelik.hakSayisi : 0;

    const ortalamaSatisTutari = inputTutari(ortalamaSatis);
    const marj = Math.min(100, Math.max(0, inputTutari(karMarji))) / 100;
    const tahminiKar = ortalamaSatisTutari * marj;
    const amortiSatisAdedi = tahminiKar > 0 && sonOdemeTutari > 0 ? Math.ceil(sonOdemeTutari / tahminiKar) : 0;
    const aktifFirsatTutari = aktifLead.length * ortalamaSatisTutari;
    const kazanilanTahminiTutar = kazanilanLead.length * ortalamaSatisTutari;

    return {
      aktifKodlar,
      gonderilenKod,
      baslayanKod,
      yayinKod,
      aktifLead,
      kazanilanLead,
      kaybedilenLead,
      teklifAsamasi,
      sonOdemeTutari,
      paraBirimi,
      hakBasinaMaliyet,
      ortalamaSatisTutari,
      tahminiKar,
      amortiSatisAdedi,
      aktifFirsatTutari,
      kazanilanTahminiTutar,
    };
  }, [abonelik.hakSayisi, karMarji, kodlar, leadler, odemeGecmisi, ortalamaSatis]);

  const huni = [
    { label: "Lead", sayi: leadler.length, oran: 100 },
    { label: "Teklif/Kapora", sayi: metrikler.teklifAsamasi.length, oran: yuzde(metrikler.teklifAsamasi.length, leadler.length) },
    { label: "Kazanıldı", sayi: metrikler.kazanilanLead.length, oran: yuzde(metrikler.kazanilanLead.length, leadler.length) },
    { label: "Yayında", sayi: metrikler.yayinKod, oran: yuzde(metrikler.yayinKod, metrikler.aktifKodlar.length) },
  ];

  const durumDagilimi = (Object.keys(DURUMLAR) as LeadDurumu[]).map(durum => ({
    durum,
    ...DURUMLAR[durum],
    sayi: leadler.filter(lead => lead.durum === durum).length,
  }));

  const oncelikliFirsatlar = leadler
    .filter(lead => lead.durum === "teklif_gonderildi" || lead.durum === "kapora_bekliyor" || lead.durum === "gorusuldu")
    .sort((a, b) => {
      const sira: Record<LeadDurumu, number> = {
        kapora_bekliyor: 0,
        teklif_gonderildi: 1,
        gorusuldu: 2,
        yeni: 3,
        kazandi: 4,
        kaybedildi: 5,
      };
      return sira[a.durum] - sira[b.durum] || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 4);

  const oneriler = [
    metrikler.teklifAsamasi.length > 0
      ? `${metrikler.teklifAsamasi.length} fırsat teklif/kapora aşamasında. WhatsApp takip mesajı ile kapanış deneyin.`
      : "Teklif aşamasına gelen fırsat yok. Lead CRM'de görüşülen müşterilere hazır paket gönderin.",
    metrikler.gonderilenKod > metrikler.baslayanKod
      ? `${metrikler.gonderilenKod - metrikler.baslayanKod} teslim linkinde müşteri kuruluma başlamamış. Kısa hatırlatma iyi çalışır.`
      : "Teslim edilen linklerde kurulum başlangıcı sağlıklı görünüyor.",
    abonelik.hakSayisi - abonelik.kullanilanHak <= 2
      ? "Kalan dijital paket hakkı düşük. Satış görüşmelerinde kesinti yaşamamak için yenilemeyi planlayın."
      : "Dijital paket hakkı satış akışı için yeterli görünüyor.",
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-slate-950 via-purple-950 to-slate-900 px-5 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-200/80">
              Satış Analitiği
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Partner aboneliği işinize ne kadar katkı sağlıyor?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">
              Bu ekran muhasebe raporu değildir; CRM, teslim linki ve ödeme kayıtlarından satış odağı için tahmini karar verileri üretir.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-sm backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Abonelik Verimi</p>
            <p className="mt-1 text-2xl font-black tabular-nums">
              {metrikler.amortiSatisAdedi > 0 ? `${metrikler.amortiSatisAdedi} satış` : "-"}
            </p>
            <p className="mt-1 text-xs text-white/55">Paket maliyetini tahmini karla karşılama eşiği</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetrikKart baslik="Aktif Fırsat" deger={metrikler.aktifLead.length.toString()} aciklama={`${leadler.length} toplam lead`} />
          <MetrikKart baslik="Kapanış Oranı" deger={`%${yuzde(metrikler.kazanilanLead.length, leadler.length)}`} aciklama={`${metrikler.kazanilanLead.length} kazanıldı`} />
          <MetrikKart baslik="Hak Başı Maliyet" deger={metrikler.hakBasinaMaliyet ? para(metrikler.hakBasinaMaliyet, metrikler.paraBirimi) : "-"} aciklama="Son partner ödemesine göre" />
          <MetrikKart baslik="Aktif Fırsat Hacmi" deger={para(metrikler.aktifFirsatTutari)} aciklama="Manuel ortalama satışa göre" />
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr] sm:p-7">
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-950">Satış hunisi</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Lead'den yayındaki davetiyeye kadar nerede kayıp olduğunu gösterir.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:w-72">
                <label className="block">
                  <span className="text-[11px] font-bold text-gray-400">Ort. satış</span>
                  <input
                    value={ortalamaSatis}
                    onChange={e => setOrtalamaSatis(e.target.value)}
                    inputMode="decimal"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold text-gray-400">Kar marjı %</span>
                  <input
                    value={karMarji}
                    onChange={e => setKarMarji(e.target.value)}
                    inputMode="decimal"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {huni.map(adim => (
                <div key={adim.label}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-gray-700">{adim.label}</span>
                    <span className="font-black tabular-nums text-gray-950">
                      {adim.sayi} · %{adim.oran}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-purple-500 to-pink-500"
                      style={{ width: `${Math.max(5, adim.oran)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Tahmini Kar</p>
              <p className="mt-2 text-xl font-black text-gray-950">{para(metrikler.tahminiKar)}</p>
              <p className="mt-1 text-xs text-gray-500">1 satış için manuel varsayım</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Kazanılan Hacim</p>
              <p className="mt-2 text-xl font-black text-emerald-600">{para(metrikler.kazanilanTahminiTutar)}</p>
              <p className="mt-1 text-xs text-gray-500">{metrikler.kazanilanLead.length} kazanılan lead</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Kurulum Oranı</p>
              <p className="mt-2 text-xl font-black text-purple-700">
                %{yuzde(metrikler.baslayanKod, metrikler.gonderilenKod)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Teslim edilen linklerden</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-black text-gray-950">Öncelikli fırsatlar</h3>
            <div className="mt-3 space-y-2">
              {oncelikliFirsatlar.length > 0 ? oncelikliFirsatlar.map(lead => (
                <div key={lead.id} className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-gray-900">{lead.baslik}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {[lead.etkinlikTuru, lead.kisiSayisi ? `${lead.kisiSayisi} kişi` : null, lead.etkinlikTarihi ? tarihKisa(lead.etkinlikTarihi) : null].filter(Boolean).join(" · ") || "Detay eklenmemiş"}
                    </p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${DURUMLAR[lead.durum].renk}`}>
                    {DURUMLAR[lead.durum].label}
                  </span>
                </div>
              )) : (
                <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                  Takip edilecek teklif veya kapora aşaması yok.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-black text-gray-950">Lead durum dağılımı</h3>
            <div className="mt-3 space-y-2">
              {durumDagilimi.map(item => (
                <div key={item.durum} className="flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black ${item.renk}`}>{item.label}</span>
                  <span className="text-sm font-black tabular-nums text-gray-900">{item.sayi}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
            <h3 className="text-sm font-black text-purple-950">Bugünkü satış odağı</h3>
            <div className="mt-3 space-y-2">
              {oneriler.map(oneri => (
                <p key={oneri} className="rounded-2xl bg-white/80 px-4 py-3 text-xs font-semibold leading-relaxed text-purple-900">
                  {oneri}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-950 p-4 text-white shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">Paket özeti</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-black tabular-nums">{abonelik.hakSayisi - abonelik.kullanilanHak}</p>
                <p className="text-xs text-white/55">kalan hak</p>
              </div>
              <div>
                <p className="text-2xl font-black tabular-nums">{metrikler.yayinKod}</p>
                <p className="text-xs text-white/55">yayında</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${yuzde(abonelik.kullanilanHak, abonelik.hakSayisi)}%` }}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function MetrikKart({ baslik, deger, aciklama }: { baslik: string; deger: string; aciklama: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-sm backdrop-blur">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">{baslik}</p>
      <p className="mt-1.5 text-2xl font-black tabular-nums text-white">{deger}</p>
      <p className="mt-0.5 text-[11px] text-white/50">{aciklama}</p>
    </div>
  );
}

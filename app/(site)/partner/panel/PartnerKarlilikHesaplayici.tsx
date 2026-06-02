"use client";

import { useMemo, useState } from "react";

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

const PAKET_SENARYOLARI = [
  {
    id: "hizli",
    ad: "Hızlı davetiye",
    satis: "1490",
    adet: "4",
    direktMaliyet: "120",
    operasyonSaat: "0.5",
    saatlikMaliyet: "350",
  },
  {
    id: "operasyon",
    ad: "Salon operasyon",
    satis: "3490",
    adet: "3",
    direktMaliyet: "250",
    operasyonSaat: "1.5",
    saatlikMaliyet: "350",
  },
  {
    id: "premium",
    ad: "Premium deneyim",
    satis: "5990",
    adet: "2",
    direktMaliyet: "450",
    operasyonSaat: "2.5",
    saatlikMaliyet: "450",
  },
];

function inputTutari(deger: string) {
  const sade = deger.replace(/\./g, "").replace(",", ".");
  const sayi = Number(sade);
  return Number.isFinite(sayi) ? sayi : 0;
}

function sayiyaCevir(deger: string | null | undefined) {
  if (!deger) return 0;
  return inputTutari(deger);
}

function fiyatKirilimiTutari(fiyatKirilimi: unknown) {
  if (!fiyatKirilimi || typeof fiyatKirilimi !== "object") return 0;
  const kayit = fiyatKirilimi as Record<string, unknown>;
  const adaylar = [kayit.toplamTutar, kayit.tutar, kayit.paidPrice, kayit.price];
  for (const aday of adaylar) {
    if (typeof aday === "number" && Number.isFinite(aday)) return aday;
    if (typeof aday === "string") {
      const sayi = inputTutari(aday);
      if (sayi > 0) return sayi;
    }
  }
  return 0;
}

function odemeTutari(kayit: OdemeKaydi | null) {
  if (!kayit) return 0;
  return sayiyaCevir(kayit.paidPrice) || fiyatKirilimiTutari(kayit.fiyatKirilimi);
}

function para(tutar: number, currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(tutar));
}

function oran(deger: number, toplam: number) {
  if (toplam <= 0) return 0;
  return Math.round((deger / toplam) * 100);
}

export default function PartnerKarlilikHesaplayici({
  abonelik,
  odemeGecmisi,
}: {
  abonelik: Abonelik;
  odemeGecmisi: OdemeKaydi[];
}) {
  const sonOdeme = odemeGecmisi[0] ?? null;
  const paketMaliyeti = odemeTutari(sonOdeme);
  const paraBirimi = sonOdeme?.currency || "TRY";
  const hakBasinaMaliyet = abonelik.hakSayisi > 0 ? paketMaliyeti / abonelik.hakSayisi : 0;

  const [satisFiyati, setSatisFiyati] = useState(PAKET_SENARYOLARI[1].satis);
  const [adet, setAdet] = useState(PAKET_SENARYOLARI[1].adet);
  const [direktMaliyet, setDirektMaliyet] = useState(PAKET_SENARYOLARI[1].direktMaliyet);
  const [operasyonSaat, setOperasyonSaat] = useState(PAKET_SENARYOLARI[1].operasyonSaat);
  const [saatlikMaliyet, setSaatlikMaliyet] = useState(PAKET_SENARYOLARI[1].saatlikMaliyet);
  const [komisyonOrani, setKomisyonOrani] = useState("4");
  const [sabitKomisyon, setSabitKomisyon] = useState("0");
  const [ekGelir, setEkGelir] = useState("0");

  const metrikler = useMemo(() => {
    const satis = inputTutari(satisFiyati);
    const isAdedi = Math.max(0, Math.round(inputTutari(adet)));
    const ek = inputTutari(ekGelir);
    const direkt = inputTutari(direktMaliyet);
    const saat = inputTutari(operasyonSaat);
    const saatlik = inputTutari(saatlikMaliyet);
    const komisyonYuzde = Math.max(0, inputTutari(komisyonOrani)) / 100;
    const sabit = inputTutari(sabitKomisyon);

    const isBasinaGelir = satis + ek;
    const toplamGelir = isBasinaGelir * isAdedi;
    const isBasinaOperasyon = saat * saatlik;
    const isBasinaKomisyon = isBasinaGelir * komisyonYuzde + sabit;
    const isBasinaMaliyet = hakBasinaMaliyet + direkt + isBasinaOperasyon + isBasinaKomisyon;
    const isBasinaKar = isBasinaGelir - isBasinaMaliyet;
    const toplamMaliyet = isBasinaMaliyet * isAdedi;
    const toplamKar = isBasinaKar * isAdedi;
    const karMarji = oran(toplamKar, toplamGelir);
    const paketAmortiAdedi = isBasinaKar > 0 && paketMaliyeti > 0 ? Math.ceil(paketMaliyeti / isBasinaKar) : 0;
    const kalanHak = Math.max(0, abonelik.hakSayisi - abonelik.kullanilanHak);
    const kalanHakPotansiyelKar = isBasinaKar * kalanHak;

    return {
      isAdedi,
      isBasinaGelir,
      toplamGelir,
      isBasinaMaliyet,
      isBasinaKar,
      toplamMaliyet,
      toplamKar,
      karMarji,
      paketAmortiAdedi,
      kalanHak,
      kalanHakPotansiyelKar,
      isBasinaOperasyon,
      isBasinaKomisyon,
    };
  }, [
    abonelik.hakSayisi,
    abonelik.kullanilanHak,
    adet,
    direktMaliyet,
    ekGelir,
    hakBasinaMaliyet,
    komisyonOrani,
    operasyonSaat,
    paketMaliyeti,
    sabitKomisyon,
    saatlikMaliyet,
    satisFiyati,
  ]);

  const senaryoSec = (id: string) => {
    const senaryo = PAKET_SENARYOLARI.find(item => item.id === id);
    if (!senaryo) return;
    setSatisFiyati(senaryo.satis);
    setAdet(senaryo.adet);
    setDirektMaliyet(senaryo.direktMaliyet);
    setOperasyonSaat(senaryo.operasyonSaat);
    setSaatlikMaliyet(senaryo.saatlikMaliyet);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-emerald-50 via-white to-purple-50 px-5 py-5 sm:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Kârlılık hesaplayıcı</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Satış fiyatını kâra göre netleştirin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Bu hesaplama muhasebe veya vergi raporu değildir. Partner paket maliyeti, operasyon zamanı ve komisyon varsayımlarına göre teklif öncesi tahmini karar desteği sağlar.
            </p>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-gray-400">Hak başı maliyet</p>
            <p className="mt-1 text-2xl font-black tabular-nums text-gray-950">
              {hakBasinaMaliyet > 0 ? para(hakBasinaMaliyet, paraBirimi) : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[390px_1fr] sm:p-7">
        <aside className="space-y-4 rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Hızlı senaryo</p>
            <div className="mt-3 grid gap-2">
              {PAKET_SENARYOLARI.map(senaryo => (
                <button
                  key={senaryo.id}
                  type="button"
                  onClick={() => senaryoSec(senaryo.id)}
                  className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <p className="text-sm font-black text-gray-950">{senaryo.ad}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">
                    {para(inputTutari(senaryo.satis))} satış · {senaryo.adet} iş varsayımı
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Alan label="Satış fiyatı" value={satisFiyati} onChange={setSatisFiyati} />
            <Alan label="İş adedi" value={adet} onChange={setAdet} />
            <Alan label="Ek gelir" value={ekGelir} onChange={setEkGelir} yardim="Masa kartı, canlı duvar kurulumu, ek tasarım gibi." />
            <Alan label="Direkt maliyet" value={direktMaliyet} onChange={setDirektMaliyet} yardim="Baskı, personel, tasarım veya dış hizmet maliyeti." />
            <Alan label="Operasyon saati" value={operasyonSaat} onChange={setOperasyonSaat} />
            <Alan label="Saatlik maliyet" value={saatlikMaliyet} onChange={setSaatlikMaliyet} />
            <Alan label="Komisyon %" value={komisyonOrani} onChange={setKomisyonOrani} />
            <Alan label="Sabit komisyon" value={sabitKomisyon} onChange={setSabitKomisyon} />
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metrik baslik="İş başı net kâr" deger={para(metrikler.isBasinaKar)} vurgu={metrikler.isBasinaKar > 0 ? "iyi" : "risk"} />
            <Metrik baslik="Toplam net kâr" deger={para(metrikler.toplamKar)} vurgu={metrikler.toplamKar > 0 ? "iyi" : "risk"} />
            <Metrik baslik="Kâr marjı" deger={`%${metrikler.karMarji}`} vurgu={metrikler.karMarji >= 25 ? "iyi" : "uyari"} />
            <Metrik baslik="Amorti eşiği" deger={metrikler.paketAmortiAdedi > 0 ? `${metrikler.paketAmortiAdedi} satış` : "-"} />
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-950 p-5 text-white">
            <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
              <div>
                <p className="text-sm font-black">Kâr kırılımı</p>
                <div className="mt-4 space-y-3">
                  <Kirilim label="İş başı gelir" value={metrikler.isBasinaGelir} toplam={Math.max(1, metrikler.isBasinaGelir)} />
                  <Kirilim label="Hak başı paket maliyeti" value={hakBasinaMaliyet} toplam={Math.max(1, metrikler.isBasinaGelir)} ters />
                  <Kirilim label="Operasyon maliyeti" value={metrikler.isBasinaOperasyon} toplam={Math.max(1, metrikler.isBasinaGelir)} ters />
                  <Kirilim label="Ödeme/komisyon maliyeti" value={metrikler.isBasinaKomisyon} toplam={Math.max(1, metrikler.isBasinaGelir)} ters />
                  <Kirilim label="Diğer direkt maliyet" value={inputTutari(direktMaliyet)} toplam={Math.max(1, metrikler.isBasinaGelir)} ters />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/40">Kalan hak potansiyeli</p>
                <p className="mt-2 text-3xl font-black tabular-nums">{para(metrikler.kalanHakPotansiyelKar)}</p>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-white/50">
                  {metrikler.kalanHak} kalan hak aynı kâr varsayımıyla satılırsa oluşabilecek tahmini net kâr.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-black text-emerald-950">Fiyat önerisi</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-emerald-800">
                %30 üstü marj için bu senaryoda satış fiyatını en az {para(Math.ceil((metrikler.isBasinaMaliyet / 0.7) / 10) * 10)} seviyesinde tutmak daha sağlıklı görünür.
              </p>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-sm font-black text-amber-950">Dikkat</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-amber-800">
                Vergi, iade, kampanya indirimi, tahsilat gecikmesi ve şirket giderleri bu hesapta otomatik düşülmez. Resmi fiyatlandırma için muhasebecinizle netleştirin.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-black text-gray-950">Özet</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-600">
              {metrikler.isAdedi} iş için tahmini gelir {para(metrikler.toplamGelir)}, tahmini maliyet {para(metrikler.toplamMaliyet)} ve net kâr {para(metrikler.toplamKar)}. Marj düşükse satış fiyatını artırın, operasyon saatini azaltın veya ek hizmetleri ayrıca fiyatlayın.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Alan({
  label,
  value,
  onChange,
  yardim,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  yardim?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-gray-500">{label}</span>
      <input
        value={value}
        onChange={event => onChange(event.target.value)}
        inputMode="decimal"
        className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-900 outline-none transition-colors focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
      />
      {yardim && <span className="mt-1 block text-[11px] font-semibold leading-relaxed text-gray-400">{yardim}</span>}
    </label>
  );
}

function Metrik({
  baslik,
  deger,
  vurgu,
}: {
  baslik: string;
  deger: string;
  vurgu?: "iyi" | "uyari" | "risk";
}) {
  const renk =
    vurgu === "iyi" ? "border-emerald-100 bg-emerald-50 text-emerald-700" :
    vurgu === "risk" ? "border-red-100 bg-red-50 text-red-700" :
    vurgu === "uyari" ? "border-amber-100 bg-amber-50 text-amber-700" :
    "border-gray-100 bg-white text-gray-950";

  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${renk}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.12em] opacity-60">{baslik}</p>
      <p className="mt-2 text-2xl font-black tabular-nums">{deger}</p>
    </div>
  );
}

function Kirilim({
  label,
  value,
  toplam,
  ters,
}: {
  label: string;
  value: number;
  toplam: number;
  ters?: boolean;
}) {
  const width = Math.max(4, Math.min(100, Math.round((value / toplam) * 100)));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-white/65">{label}</span>
        <span className={ters ? "font-black text-red-200" : "font-black text-emerald-200"}>{para(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${ters ? "bg-red-300" : "bg-emerald-300"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

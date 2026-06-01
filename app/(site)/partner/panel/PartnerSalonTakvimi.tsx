"use client";

import { useMemo, useState } from "react";

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  ilgiliKisi: string | null;
  etkinlikTuru: string | null;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  durum: LeadDurum;
  seansBaslangic: string | null;
  seansBitis: string | null;
};

const DURUM_LABEL: Record<LeadDurum, string> = {
  yeni: "Yeni", gorusuldu: "Görüşüldü", teklif_gonderildi: "Teklif",
  kapora_bekliyor: "Kapora", kazandi: "Kazandı", kaybedildi: "Kaybedildi",
};

const DURUM_CHIP: Record<LeadDurum, string> = {
  yeni: "bg-sky-100 text-sky-700",
  gorusuldu: "bg-indigo-100 text-indigo-700",
  teklif_gonderildi: "bg-purple-100 text-purple-700",
  kapora_bekliyor: "bg-amber-100 text-amber-700",
  kazandi: "bg-emerald-100 text-emerald-700",
  kaybedildi: "bg-gray-100 text-gray-500",
};

const AY_ADLARI = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const GUN_ADLARI = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function padZ(n: number) { return String(n).padStart(2, "0"); }

function tarihStr(yil: number, ay: number, gun: number) {
  return `${yil}-${padZ(ay + 1)}-${padZ(gun)}`;
}

function bugunStr() {
  const d = new Date();
  return `${d.getFullYear()}-${padZ(d.getMonth() + 1)}-${padZ(d.getDate())}`;
}

function ayGunleri(yil: number, ay: number): (number | null)[] {
  const offset = (new Date(yil, ay, 1).getDay() + 6) % 7; // Pzt=0
  const sonGun = new Date(yil, ay + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= sonGun; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function tarihUzun(str: string) {
  return new Date(str + "T12:00:00").toLocaleDateString("tr-TR",
    { day: "numeric", month: "long", year: "numeric" });
}

function saatDk(saat: string | null): number {
  if (!saat) return -1;
  const [h, m] = saat.split(":").map(Number);
  return h * 60 + m;
}

function seansEtiketi(baslangic: string | null, bitis: string | null): string {
  if (!baslangic) return "Tüm gün";
  return bitis ? `${baslangic}–${bitis}` : `${baslangic}+`;
}

function cakisiyorMu(a: Lead, b: Lead): boolean {
  const aB = saatDk(a.seansBaslangic);
  const aBit = saatDk(a.seansBitis);
  const bB = saatDk(b.seansBaslangic);
  const bBit = saatDk(b.seansBitis);
  // Herhangi biri tüm gün → kesin çakışma
  if (aB === -1 || bB === -1) return true;
  // İkisi de bitiş saati yok → sadece başlangıca bakılamaz, tüm gün say
  if (aBit === -1 || bBit === -1) return true;
  // Zaman dilimi örtüşmesi: A başlamadan B bitmiş mi? değilse çakışıyor
  return aB < bBit && bB < aBit;
}

export default function PartnerSalonTakvimi({ leadler }: { leadler: Lead[] }) {
  const bugun = bugunStr();
  const now = new Date();

  const [yil, setYil] = useState(now.getFullYear());
  const [ay, setAy]   = useState(now.getMonth()); // 0-indexed
  const [seciliGun, setSeciliGun] = useState<string | null>(null);

  const tarihliLeadler = useMemo(
    () => leadler.filter(l => l.etkinlikTarihi && l.durum !== "kaybedildi"),
    [leadler],
  );

  const gunMap = useMemo(() => {
    const map = new Map<string, Lead[]>();
    tarihliLeadler.forEach(l => {
      const k = l.etkinlikTarihi!.slice(0, 10);
      map.set(k, [...(map.get(k) ?? []), l]);
    });
    return map;
  }, [tarihliLeadler]);

  const cells = useMemo(() => ayGunleri(yil, ay), [yil, ay]);

  const ayPrefix = `${yil}-${padZ(ay + 1)}`;
  const ayLeadleri = useMemo(
    () => tarihliLeadler.filter(l => l.etkinlikTarihi!.startsWith(ayPrefix)),
    [tarihliLeadler, ayPrefix],
  );
  const cakismaGunSet = useMemo(() => {
    const set = new Set<string>();
    gunMap.forEach((gunLeadler, tarih) => {
      if (gunLeadler.length < 2) return;
      for (let i = 0; i < gunLeadler.length; i++) {
        for (let j = i + 1; j < gunLeadler.length; j++) {
          if (cakisiyorMu(gunLeadler[i], gunLeadler[j])) { set.add(tarih); break; }
        }
        if (set.has(tarih)) break;
      }
    });
    return set;
  }, [gunMap]);

  const cakismaGun = [...cakismaGunSet].filter(k => k.startsWith(ayPrefix)).length;

  const yaklasan = useMemo(
    () => tarihliLeadler
      .filter(l => l.etkinlikTarihi!.slice(0, 10) >= bugun)
      .sort((a, b) => a.etkinlikTarihi!.localeCompare(b.etkinlikTarihi!))
      .slice(0, 6),
    [tarihliLeadler, bugun],
  );

  function oncekiAy() {
    if (ay === 0) { setYil(y => y - 1); setAy(11); } else setAy(a => a - 1);
  }
  function sonrakiAy() {
    if (ay === 11) { setYil(y => y + 1); setAy(0); } else setAy(a => a + 1);
  }

  function yaklasinGit(tarih: string) {
    const d = new Date(tarih + "T12:00:00");
    setYil(d.getFullYear());
    setAy(d.getMonth());
    setSeciliGun(tarih.slice(0, 10));
  }

  const seciliLeadler = seciliGun ? (gunMap.get(seciliGun) ?? []) : [];

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-gray-100 bg-linear-to-br from-purple-50/60 via-white to-pink-50/30 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-purple-600/70">Salon Takvimi</p>
            <h2 className="mt-1.5 text-xl font-black text-gray-950 sm:text-2xl">
              Tarih yoğunluğunu ve çakışmaları gör
            </h2>
          </div>
          <a href="#lead-crm"
            className="shrink-0 self-start rounded-2xl border border-purple-100 bg-white px-4 py-2.5 text-xs font-black text-purple-700 shadow-sm transition-colors hover:bg-purple-50 sm:self-auto">
            + Lead Tarihi Ekle
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px]">

        {/* ── Takvim ── */}
        <div className="p-4 sm:p-6">

          {/* Ay navigasyonu */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <button onClick={oncekiAy}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="text-base font-black text-gray-950">{AY_ADLARI[ay]} {yil}</p>
            <button onClick={sonrakiAy}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Gün başlıkları */}
          <div className="mb-1 grid grid-cols-7">
            {GUN_ADLARI.map(g => (
              <div key={g} className="py-2 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                {g}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((gun, i) => {
              if (!gun) return <div key={`bos-${i}`} className="min-h-16" />;

              const gStr      = tarihStr(yil, ay, gun);
              const gunLeadler = gunMap.get(gStr) ?? [];
              const isToday   = gStr === bugun;
              const isSecili  = gStr === seciliGun;
              const cakisma   = cakismaGunSet.has(gStr);
              const hasLead   = gunLeadler.length > 0;

              return (
                <button
                  key={gStr}
                  onClick={() => setSeciliGun(isSecili ? null : gStr)}
                  className={`min-h-16 rounded-2xl p-1.5 text-left transition-all ${
                    isSecili
                      ? "border-2 border-purple-400 bg-purple-50 shadow-sm"
                      : cakisma
                      ? "border border-red-200 bg-red-50/60 hover:bg-red-50"
                      : hasLead
                      ? "border border-purple-100 bg-purple-50/30 hover:bg-purple-50/60"
                      : "border border-transparent hover:border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  {/* Tarih numarası */}
                  <span className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                    isToday
                      ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-sm shadow-purple-200"
                      : isSecili
                      ? "text-purple-700"
                      : "text-gray-700"
                  }`}>
                    {gun}
                  </span>

                  {/* Event chip'leri */}
                  <div className="space-y-0.5">
                    {gunLeadler.slice(0, 2).map(lead => (
                      <div key={lead.id}
                        className={`rounded-md px-1 py-0.5 text-[9px] font-black leading-tight ${DURUM_CHIP[lead.durum]}`}>
                        <p className="truncate">{lead.baslik}</p>
                        <p className="truncate font-semibold opacity-80">
                          {seansEtiketi(lead.seansBaslangic, lead.seansBitis)}
                        </p>
                      </div>
                    ))}
                    {gunLeadler.length > 2 && (
                      <div className="rounded-md bg-gray-100 px-1 py-0.5 text-[9px] font-black text-gray-500">
                        +{gunLeadler.length - 2}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Seçili gün detayı */}
          {seciliGun && seciliLeadler.length > 0 && (
            <div className="mt-4 rounded-3xl border border-purple-100 bg-purple-50/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-black text-gray-950">{tarihUzun(seciliGun)}</p>
                {cakismaGunSet.has(seciliGun) && (
                  <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-700">
                    ⚠ Saat çakışması
                  </span>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {seciliLeadler.map(lead => (
                  <div key={lead.id} className="flex items-start justify-between gap-2 rounded-2xl bg-white p-3 shadow-sm">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-gray-950">{lead.baslik}</p>
                      <p className="mt-0.5 text-xs font-semibold text-gray-500">
                        {lead.etkinlikTuru || "Etkinlik türü yok"}
                        {lead.kisiSayisi ? ` · ${lead.kisiSayisi} kişi` : ""}
                      </p>
                      <p className="mt-1 text-[11px] font-black text-gray-700">
                        🕐 {seansEtiketi(lead.seansBaslangic, lead.seansBitis)}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${DURUM_CHIP[lead.durum]}`}>
                      {DURUM_LABEL[lead.durum]}
                    </span>
                  </div>
                ))}
              </div>
              {cakismaGunSet.has(seciliGun) && (
                <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3">
                  <p className="text-xs font-black text-red-800">Saat aralıkları örtüşüyor</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-red-700">
                    Bu güne ait seanslar çakışıyor. CRM'de saat aralıklarını kontrol edin veya bir seansı iptal edin.
                  </p>
                </div>
              )}
            </div>
          )}

          {seciliGun && seciliLeadler.length === 0 && (
            <div className="mt-4 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-sm font-black text-gray-900">{tarihUzun(seciliGun)}</p>
              <p className="mt-1 text-xs text-gray-400">Bu güne ait lead yok.</p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="border-t border-gray-100 p-4 sm:p-6 lg:border-l lg:border-t-0">

          {/* Bu ay istatistikleri */}
          <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-gray-400">{AY_ADLARI[ay]} özeti</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "İş",        value: ayLeadleri.length },
              { label: "Çakışma",   value: cakismaGun, kirmizi: cakismaGun > 0 },
              { label: "Kazanılan", value: ayLeadleri.filter(l => l.durum === "kazandi").length },
              { label: "Kişi",      value: ayLeadleri.reduce((s, l) => s + (l.kisiSayisi ?? 0), 0) || "—" },
            ].map(item => (
              <div key={item.label} className={`rounded-2xl border p-3 ${
                item.kirmizi ? "border-red-100 bg-red-50" : "border-gray-100 bg-gray-50"
              }`}>
                <p className={`text-xl font-black ${item.kirmizi ? "text-red-700" : "text-gray-950"}`}>
                  {item.value}
                </p>
                <p className={`mt-0.5 text-[11px] font-bold ${item.kirmizi ? "text-red-500" : "text-gray-500"}`}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Çakışma uyarısı */}
          {cakismaGun > 0 && (
            <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-3">
              <p className="text-xs font-black text-red-800">⚠ {cakismaGun} gün çakışıyor</p>
              <p className="mt-1 text-[11px] leading-relaxed text-red-700">
                Takvimde kırmızı günleri kontrol edin.
              </p>
            </div>
          )}

          {/* Yaklaşan işler */}
          <div className="mt-5">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-gray-400">Yaklaşan işler</p>
            <div className="space-y-1.5">
              {yaklasan.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-3 text-xs font-semibold text-gray-400">
                  Yaklaşan tarihli lead yok.
                </p>
              ) : (
                yaklasan.map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => yaklasinGit(lead.etkinlikTarihi!)}
                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-3 text-left transition-colors hover:border-purple-100 hover:bg-purple-50/50"
                  >
                    <p className="truncate text-xs font-black text-gray-900">{lead.baslik}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold text-gray-500">
                        {tarihUzun(lead.etkinlikTarihi!)}
                      </p>
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black ${DURUM_CHIP[lead.durum]}`}>
                        {DURUM_LABEL[lead.durum]}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Renk rehberi */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">Statü renkleri</p>
            <div className="space-y-1">
              {Object.entries(DURUM_LABEL).filter(([k]) => k !== "kaybedildi").map(([id, label]) => (
                <div key={id} className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${
                    id === "yeni" ? "bg-sky-400" :
                    id === "gorusuldu" ? "bg-indigo-400" :
                    id === "teklif_gonderildi" ? "bg-purple-400" :
                    id === "kapora_bekliyor" ? "bg-amber-400" :
                    "bg-emerald-400"
                  }`} />
                  <p className="text-[11px] font-semibold text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

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
};

const DURUM_LABEL: Record<LeadDurum, string> = {
  yeni: "Yeni",
  gorusuldu: "Görüşüldü",
  teklif_gonderildi: "Teklif",
  kapora_bekliyor: "Kapora",
  kazandi: "Kazandı",
  kaybedildi: "Kaybedildi",
};

const AY_ADLARI = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function gunAnahtari(tarih: string) {
  return tarih.slice(0, 10);
}

function tarihKisa(tarih: string) {
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function ayAnahtari(tarih: Date) {
  return `${tarih.getFullYear()}-${String(tarih.getMonth() + 1).padStart(2, "0")}`;
}

function ayBasligi(anahtar: string) {
  const [yil, ay] = anahtar.split("-").map(Number);
  return `${AY_ADLARI[ay - 1]} ${yil}`;
}

function bugunAnahtari() {
  const bugun = new Date();
  return `${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, "0")}-${String(bugun.getDate()).padStart(2, "0")}`;
}

export default function PartnerSalonTakvimi({ leadler }: { leadler: Lead[] }) {
  const tarihliLeadler = useMemo(
    () =>
      leadler
        .filter(lead => lead.etkinlikTarihi && lead.durum !== "kaybedildi")
        .sort((a, b) => new Date(a.etkinlikTarihi!).getTime() - new Date(b.etkinlikTarihi!).getTime()),
    [leadler]
  );

  const aySecenekleri = useMemo(() => {
    const anahtarlar = new Set<string>();
    tarihliLeadler.forEach(lead => anahtarlar.add(ayAnahtari(new Date(lead.etkinlikTarihi!))));
    anahtarlar.add(ayAnahtari(new Date()));
    return Array.from(anahtarlar).sort();
  }, [tarihliLeadler]);

  const [seciliAy, setSeciliAy] = useState(() => aySecenekleri[0] ?? ayAnahtari(new Date()));
  const bugun = bugunAnahtari();

  const ayLeadleri = useMemo(
    () => tarihliLeadler.filter(lead => ayAnahtari(new Date(lead.etkinlikTarihi!)) === seciliAy),
    [seciliAy, tarihliLeadler]
  );

  const gunGruplari = useMemo(() => {
    const map = new Map<string, Lead[]>();
    ayLeadleri.forEach(lead => {
      const anahtar = gunAnahtari(lead.etkinlikTarihi!);
      map.set(anahtar, [...(map.get(anahtar) ?? []), lead]);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [ayLeadleri]);

  const cakismalar = gunGruplari.filter(([, liste]) => liste.length > 1);
  const toplamKisi = ayLeadleri.reduce((toplam, lead) => toplam + (lead.kisiSayisi ?? 0), 0);
  const kazanilan = ayLeadleri.filter(lead => lead.durum === "kazandi").length;
  const yaklasan = tarihliLeadler.filter(lead => gunAnahtari(lead.etkinlikTarihi!) >= bugun).slice(0, 5);

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Salon takvimi</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Tarih yoğunluğunu ve çakışmaları gör
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Lead CRM'e girilen etkinlik tarihlerinden takvim oluşturulur. Aynı güne birden fazla iş düşerse uyarı verir;
              özel müşteri verisi veya davetli bilgisi göstermez.
            </p>
          </div>
          <a
            href="#lead-crm"
            className="inline-flex items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-xs font-black text-purple-700 transition-colors hover:bg-purple-100"
          >
            Lead Tarihi Ekle
          </a>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[320px_1fr] lg:p-7">
        <aside className="space-y-3">
          <label className="block rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-gray-400">Ay seç</span>
            <select
              value={seciliAy}
              onChange={e => setSeciliAy(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-black text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
            >
              {aySecenekleri.map(ay => (
                <option key={ay} value={ay}>
                  {ayBasligi(ay)}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "İş", value: ayLeadleri.length },
              { label: "Çakışma", value: cakismalar.length },
              { label: "Kazanılan", value: kazanilan },
              { label: "Kişi", value: toplamKisi || "-" },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-2xl font-black text-gray-950">{item.value}</p>
                <p className="mt-1 text-xs font-bold text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-black text-gray-950">Yaklaşan işler</p>
            <div className="mt-3 space-y-2">
              {yaklasan.length === 0 && (
                <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-3 text-xs font-semibold text-gray-400">
                  Tarihli lead yok.
                </p>
              )}
              {yaklasan.map(lead => (
                <div key={lead.id} className="rounded-2xl bg-white p-3 text-xs shadow-sm">
                  <p className="font-black text-gray-900">{lead.baslik}</p>
                  <p className="mt-1 font-semibold text-gray-500">{tarihKisa(lead.etkinlikTarihi!)}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {cakismalar.length > 0 && (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-black text-red-800">Aynı gün yoğunluk uyarısı</p>
              <p className="mt-1 text-xs leading-relaxed text-red-700">
                Aynı tarihte birden fazla iş görünüyor. Salon/saat bilgisi ayrıca kontrol edilmeli.
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-gray-950">{ayBasligi(seciliAy)} planı</p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-gray-500 ring-1 ring-gray-100">
                {ayLeadleri.length} kayıt
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {gunGruplari.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center">
                  <p className="text-sm font-black text-gray-900">Bu ay için tarihli lead yok</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">
                    Lead CRM'de etkinlik tarihi girildiğinde burada görünür.
                  </p>
                </div>
              )}

              {gunGruplari.map(([gun, liste]) => {
                const cakismaVar = liste.length > 1;
                return (
                  <div
                    key={gun}
                    className={`rounded-3xl border p-4 ${
                      cakismaVar ? "border-red-100 bg-red-50/70" : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-gray-950">{tarihKisa(`${gun}T12:00:00.000Z`)}</p>
                        <p className="mt-0.5 text-xs font-semibold text-gray-500">
                          {liste.length} iş · {liste.reduce((toplam, lead) => toplam + (lead.kisiSayisi ?? 0), 0) || "-"} kişi
                        </p>
                      </div>
                      {cakismaVar && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                          Çakışma kontrolü
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {liste.map(lead => (
                        <div key={lead.id} className="rounded-2xl border border-gray-100 bg-white p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-gray-950">{lead.baslik}</p>
                              <p className="mt-1 text-xs font-semibold text-gray-500">
                                {lead.etkinlikTuru || "Etkinlik türü yok"} · {lead.kisiSayisi ? `${lead.kisiSayisi} kişi` : "kişi sayısı yok"}
                              </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-black text-gray-500">
                              {DURUM_LABEL[lead.durum]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

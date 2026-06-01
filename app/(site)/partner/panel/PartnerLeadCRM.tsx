"use client";

import { useEffect, useMemo, useState } from "react";

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  ilgiliKisi: string | null;
  telefon: string | null;
  eposta: string | null;
  etkinlikTuru: string | null;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  kaynak: string | null;
  durum: LeadDurum;
  not: string | null;
  sonGorusmeAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  baslik: string;
  ilgiliKisi: string;
  telefon: string;
  eposta: string;
  etkinlikTuru: string;
  etkinlikTarihi: string;
  kisiSayisi: string;
  kaynak: string;
  durum: LeadDurum;
  not: string;
};

const DURUMLAR: { id: LeadDurum; label: string; renk: string }[] = [
  { id: "yeni", label: "Yeni", renk: "bg-sky-50 text-sky-700 border-sky-100" },
  { id: "gorusuldu", label: "Görüşüldü", renk: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { id: "teklif_gonderildi", label: "Teklif", renk: "bg-purple-50 text-purple-700 border-purple-100" },
  { id: "kapora_bekliyor", label: "Kapora", renk: "bg-amber-50 text-amber-700 border-amber-100" },
  { id: "kazandi", label: "Kazandı", renk: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { id: "kaybedildi", label: "Kaybedildi", renk: "bg-gray-50 text-gray-500 border-gray-100" },
];

const BOS_FORM: FormState = {
  baslik: "",
  ilgiliKisi: "",
  telefon: "",
  eposta: "",
  etkinlikTuru: "",
  etkinlikTarihi: "",
  kisiSayisi: "",
  kaynak: "",
  durum: "yeni",
  not: "",
};

function tarihKisa(deger: string | null) {
  if (!deger) return "Tarih yok";
  return new Date(deger).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function inputTarihi(deger: string | null) {
  if (!deger) return "";
  return deger.slice(0, 10);
}

function leadFormu(lead: Lead): FormState {
  return {
    baslik: lead.baslik,
    ilgiliKisi: lead.ilgiliKisi ?? "",
    telefon: lead.telefon ?? "",
    eposta: lead.eposta ?? "",
    etkinlikTuru: lead.etkinlikTuru ?? "",
    etkinlikTarihi: inputTarihi(lead.etkinlikTarihi),
    kisiSayisi: lead.kisiSayisi ? String(lead.kisiSayisi) : "",
    kaynak: lead.kaynak ?? "",
    durum: lead.durum,
    not: lead.not ?? "",
  };
}

function payloadHazirla(form: FormState) {
  return {
    baslik: form.baslik,
    ilgiliKisi: form.ilgiliKisi,
    telefon: form.telefon,
    eposta: form.eposta,
    etkinlikTuru: form.etkinlikTuru,
    etkinlikTarihi: form.etkinlikTarihi,
    kisiSayisi: form.kisiSayisi ? Number(form.kisiSayisi) : null,
    kaynak: form.kaynak,
    durum: form.durum,
    not: form.not,
  };
}

export default function PartnerLeadCRM({ leadler: baslangicLeadler }: { leadler: Lead[] }) {
  const [leadler, setLeadler] = useState<Lead[]>(baslangicLeadler);
  const [form, setForm] = useState<FormState>(BOS_FORM);
  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null);
  const [hata, setHata] = useState("");
  const [bilgi, setBilgi] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [formAcik, setFormAcik] = useState(false);
  const [notKapatildi, setNotKapatildi] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("crm-not-kapatildi") === "1") setNotKapatildi(true);
  }, []);

  const notiKapat = () => {
    setNotKapatildi(true);
    localStorage.setItem("crm-not-kapatildi", "1");
  };

  const ozet = useMemo(() => {
    const aktif = leadler.filter(l => !["kazandi", "kaybedildi"].includes(l.durum)).length;
    const kazanilan = leadler.filter(l => l.durum === "kazandi").length;
    const teklif = leadler.filter(l => ["teklif_gonderildi", "kapora_bekliyor"].includes(l.durum)).length;
    return { toplam: leadler.length, aktif, teklif, kazanilan };
  }, [leadler]);

  const kolonlar = useMemo(
    () => DURUMLAR.map(durum => ({
      ...durum,
      leadler: leadler.filter(lead => lead.durum === durum.id),
    })),
    [leadler]
  );

  const guncelle = <K extends keyof FormState>(alan: K, deger: FormState[K]) => {
    setForm(prev => ({ ...prev, [alan]: deger }));
  };

  const formuTemizle = () => {
    setForm(BOS_FORM);
    setDuzenlenenId(null);
    setHata("");
    setFormAcik(false);
  };

  const duzenlemeBaslat = (lead: Lead) => {
    setDuzenlenenId(lead.id);
    setForm(leadFormu(lead));
    setHata("");
    setBilgi("");
    setFormAcik(true);
  };

  const kaydet = async () => {
    setHata("");
    setBilgi("");
    if (form.baslik.trim().length < 2) {
      setHata("Lead başlığı en az 2 karakter olmalı.");
      return;
    }

    setKaydediliyor(true);
    try {
      const res = await fetch("/api/partner/leadler", {
        method: duzenlenenId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duzenlenenId ? { id: duzenlenenId, ...payloadHazirla(form) } : payloadHazirla(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Lead kaydedilemedi.");

      setLeadler(prev => {
        const lead = data.lead as Lead;
        const digerleri = prev.filter(l => l.id !== lead.id);
        return [lead, ...digerleri].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
      setBilgi(duzenlenenId ? "Lead güncellendi." : "Yeni lead eklendi.");
      formuTemizle();
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Lead kaydedilemedi.");
    } finally {
      setKaydediliyor(false);
    }
  };

  const durumDegistir = async (lead: Lead, durum: LeadDurum) => {
    setHata("");
    setBilgi("");
    try {
      const res = await fetch("/api/partner/leadler", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, durum }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Durum güncellenemedi.");
      setLeadler(prev => prev.map(l => (l.id === lead.id ? data.lead : l)));
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Durum güncellenemedi.");
    }
  };

  const sil = async (lead: Lead) => {
    if (!confirm(`${lead.baslik} kaydı silinsin mi?`)) return;
    setHata("");
    setBilgi("");
    try {
      const res = await fetch("/api/partner/leadler", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Lead silinemedi.");
      setLeadler(prev => prev.filter(l => l.id !== lead.id));
      if (duzenlenenId === lead.id) formuTemizle();
      setBilgi("Lead silindi.");
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Lead silinemedi.");
    }
  };

  const formGorunur = formAcik || duzenlenenId !== null;

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Lead CRM</p>
          <h2 className="mt-2 text-2xl font-black text-gray-950">Müşteri adaylarını takip et</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            if (formGorunur) {
              formuTemizle();
            } else {
              setForm(BOS_FORM);
              setDuzenlenenId(null);
              setFormAcik(true);
            }
          }}
          className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition-colors ${
            formGorunur
              ? "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              : "bg-gray-950 text-white hover:bg-purple-700"
          }`}
        >
          {formGorunur ? "Vazgeç" : "+ Müşteri ekle"}
        </button>
      </div>

      {/* Özet kartları */}
      {leadler.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Toplam lead", value: ozet.toplam },
            { label: "Aktif takip", value: ozet.aktif },
            { label: "Teklif süreci", value: ozet.teklif },
            { label: "Kazanılan", value: ozet.kazanilan },
          ].map(item => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-2xl font-black text-gray-950">{item.value}</p>
              <p className="mt-1 text-xs font-bold text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Güvenli kullanım notu (dismissible) */}
      {!notKapatildi && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/60 p-4 text-sm text-purple-900">
          <p className="flex-1 leading-relaxed">
            <span className="font-black">Güvenli kullanım: </span>
            Bu alan satış takibi içindir. TCKN, sağlık bilgisi veya ödeme kartı verisi kaydetmeyin.
          </p>
          <button
            type="button"
            onClick={notiKapat}
            className="mt-0.5 shrink-0 rounded-lg px-2 py-1 text-xs font-black text-purple-500 hover:bg-purple-100"
            aria-label="Notu kapat"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Form paneli */}
      {formGorunur && (
        <div className="mt-5 rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <p className="font-black text-gray-950">{duzenlenenId ? "Lead düzenle" : "Yeni lead"}</p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Lead başlığı</span>
              <input
                value={form.baslik}
                onChange={e => guncelle("baslik", e.target.value)}
                placeholder="Örn. Haziran düğünü - Salon A"
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                maxLength={120}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">İlgili kişi</span>
                <input
                  value={form.ilgiliKisi}
                  onChange={e => guncelle("ilgiliKisi", e.target.value)}
                  placeholder="Opsiyonel"
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  maxLength={120}
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Durum</span>
                <select
                  value={form.durum}
                  onChange={e => guncelle("durum", e.target.value as LeadDurum)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                >
                  {DURUMLAR.map(durum => <option key={durum.id} value={durum.id}>{durum.label}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Telefon</span>
                <input
                  value={form.telefon}
                  onChange={e => guncelle("telefon", e.target.value)}
                  placeholder="+90..."
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  maxLength={30}
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">E-posta</span>
                <input
                  value={form.eposta}
                  onChange={e => guncelle("eposta", e.target.value)}
                  placeholder="Opsiyonel"
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  maxLength={160}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Etkinlik tarihi</span>
                <input
                  type="date"
                  value={form.etkinlikTarihi}
                  onChange={e => guncelle("etkinlikTarihi", e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Kişi sayısı</span>
                <input
                  type="number"
                  value={form.kisiSayisi}
                  onChange={e => guncelle("kisiSayisi", e.target.value)}
                  placeholder="250"
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  min={1}
                  max={10000}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Etkinlik türü</span>
                <input
                  value={form.etkinlikTuru}
                  onChange={e => guncelle("etkinlikTuru", e.target.value)}
                  placeholder="Düğün, nişan..."
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  maxLength={60}
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Kaynak</span>
                <input
                  value={form.kaynak}
                  onChange={e => guncelle("kaynak", e.target.value)}
                  placeholder="Instagram, referans..."
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                  maxLength={60}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-gray-500">Kısa not</span>
              <textarea
                value={form.not}
                onChange={e => guncelle("not", e.target.value)}
                placeholder="Örn. 300 kişilik organizasyon, canlı duvar ilgisini çekti."
                className="mt-1 min-h-24 w-full resize-none rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                maxLength={500}
              />
              <span className="mt-1 block text-right text-[11px] font-semibold text-gray-400">{form.not.length}/500</span>
            </label>

            {hata && <p className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{hata}</p>}
            {bilgi && <p className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">{bilgi}</p>}

            <button
              type="button"
              onClick={kaydet}
              disabled={kaydediliyor}
              className="w-full rounded-2xl bg-gray-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {kaydediliyor ? "Kaydediliyor..." : duzenlenenId ? "Lead'i güncelle" : "Lead ekle"}
            </button>
          </div>
        </div>
      )}

      {/* Boş durum */}
      {leadler.length === 0 && !formGorunur && (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">👥</div>
          <h3 className="text-base font-black text-gray-900">Henüz müşteri adayı yok</h3>
          <p className="mt-2 text-sm text-gray-500">Görüştüğünüz salonu veya organizasyonu ekleyerek takip etmeye başlayın.</p>
          <button
            type="button"
            onClick={() => { setForm(BOS_FORM); setDuzenlenenId(null); setFormAcik(true); }}
            className="mt-5 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
          >
            İlk müşteriyi ekle
          </button>
        </div>
      )}

      {/* Kanban */}
      {leadler.length > 0 && (
        <div className="mt-5 overflow-x-auto pb-2">
          <div className="grid min-w-230 grid-cols-6 gap-3">
            {kolonlar.map(kolon => (
              <div key={kolon.id} className="rounded-3xl border border-gray-100 bg-gray-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${kolon.renk}`}>
                    {kolon.label}
                  </span>
                  <span className="text-xs font-black text-gray-400">{kolon.leadler.length}</span>
                </div>

                <div className="space-y-2">
                  {kolon.leadler.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-3 text-xs font-semibold leading-relaxed text-gray-400">
                      Bu aşamada lead yok.
                    </div>
                  )}

                  {kolon.leadler.map(lead => (
                    <article key={lead.id} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                      <p className="line-clamp-2 text-sm font-black text-gray-950">{lead.baslik}</p>
                      <div className="mt-2 space-y-1 text-xs font-semibold text-gray-500">
                        <p>{lead.ilgiliKisi || "İlgili kişi yok"}</p>
                        <p>{lead.etkinlikTuru || "Etkinlik türü yok"} · {tarihKisa(lead.etkinlikTarihi)}</p>
                        {lead.kisiSayisi && <p>{lead.kisiSayisi} kişi</p>}
                        {lead.kaynak && <p>Kaynak: {lead.kaynak}</p>}
                      </div>
                      {lead.not && <p className="mt-2 line-clamp-3 rounded-xl bg-gray-50 p-2 text-xs leading-relaxed text-gray-500">{lead.not}</p>}

                      <div className="mt-3 space-y-2">
                        <select
                          value={lead.durum}
                          onChange={e => durumDegistir(lead, e.target.value as LeadDurum)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs font-bold text-gray-700 outline-none focus:border-purple-300"
                        >
                          {DURUMLAR.map(durum => <option key={durum.id} value={durum.id}>{durum.label}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => duzenlemeBaslat(lead)}
                            className="rounded-xl border border-gray-200 px-2 py-2 text-xs font-black text-gray-600 hover:border-purple-200 hover:text-purple-700"
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            onClick={() => sil(lead)}
                            className="rounded-xl border border-red-100 px-2 py-2 text-xs font-black text-red-500 hover:bg-red-50"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

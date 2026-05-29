"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Etkinlik {
  id: string;
  isim: string;
  tarih: string | null;
  saat: string | null;
  mekan: string | null;
  aciklama: string | null;
  ikon: string;
  sira: number;
  _count: { rsvplar: number };
}

const HAZIR_IKONLAR = [
  "💒","💍","🕯️","🎂","⭐","🥂","⛪","🍽️","🎤","💼","🌸","🎭",
  "🎊","🎉","🌙","🌅","🏖️","🎵","🍾","🫶","✨","🎗️","🎪","🎀",
];

const SABLON_RENKLER: Record<string, string> = {
  "klasik-dugun": "#7C3AED", "romantik-dugun": "#DB2777", "altin-dugun": "#B45309",
  "modern-dugun": "#111827", "nisan-luks": "#C9A96E", "dugun-luks": "#D4AA70",
  "eglenceli-dogumgunu": "#D97706", "kurumsal-toplanti": "#1E40AF",
};

function tarihFormatla(tarihStr: string | null, saat: string | null): string {
  const parcalar: string[] = [];
  if (tarihStr) {
    parcalar.push(
      new Date(tarihStr).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
      })
    );
  }
  if (saat) parcalar.push(saat);
  return parcalar.join(" · ");
}

const BOSH_FORM = { isim: "", tarih: "", saat: "", mekan: "", aciklama: "", ikon: "🎉" };

export default function ProgramSayfasi() {
  const params = useParams();
  const slug = params.slug as string;

  const [etkinlikler, setEtkinlikler] = useState<Etkinlik[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [sablon, setSablon] = useState("klasik-dugun");
  const [baslik, setBaslik] = useState("");

  // Ekleme formu
  const [ekleAcik, setEkleAcik] = useState(false);
  const [ekleForm, setEkleForm] = useState(BOSH_FORM);
  const [ekleniyor, setEkleniyor] = useState(false);

  // Düzenleme
  const [duzenleId, setDuzenleId] = useState<string | null>(null);
  const [duzenleForm, setDuzenleForm] = useState(BOSH_FORM);
  const [kaydediyor, setKaydediyor] = useState(false);

  // Silme
  const [silOnayId, setSilOnayId] = useState<string | null>(null);
  const [siliniyor, setSiliniyor] = useState<string | null>(null);

  const renk = SABLON_RENKLER[sablon] ?? "#7C3AED";

  const yukle = useCallback(async () => {
    const [davetiyeRes, programRes] = await Promise.all([
      fetch(`/api/davetiye/${slug}`),
      fetch(`/api/dashboard/davetiye/${slug}/program`),
    ]);
    if (davetiyeRes.ok) {
      const d = await davetiyeRes.json();
      setSablon(d.davetiye?.sablon ?? "klasik-dugun");
      setBaslik(d.davetiye?.baslik ?? "");
    }
    if (programRes.ok) {
      const p = await programRes.json();
      setEtkinlikler(p.etkinlikler ?? []);
    }
    setYukleniyor(false);
  }, [slug]);

  useEffect(() => { yukle(); }, [yukle]);

  // ── CRUD ──────────────────────────────────────────────

  const ekle = async () => {
    if (!ekleForm.isim.trim()) return;
    setEkleniyor(true);
    const res = await fetch(`/api/dashboard/davetiye/${slug}/program`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ekleForm),
    });
    if (res.ok) {
      const { etkinlik } = await res.json();
      setEtkinlikler(prev => [...prev, etkinlik]);
      setEkleForm(BOSH_FORM);
      setEkleAcik(false);
    }
    setEkleniyor(false);
  };

  const kaydet = async () => {
    if (!duzenleId || !duzenleForm.isim.trim()) return;
    setKaydediyor(true);
    const res = await fetch(`/api/dashboard/davetiye/${slug}/program/${duzenleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duzenleForm),
    });
    if (res.ok) {
      const { etkinlik } = await res.json();
      setEtkinlikler(prev => prev.map(e => e.id === duzenleId ? etkinlik : e));
      setDuzenleId(null);
    }
    setKaydediyor(false);
  };

  const sil = async (id: string) => {
    setSiliniyor(id);
    const res = await fetch(`/api/dashboard/davetiye/${slug}/program/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEtkinlikler(prev => prev.filter(e => e.id !== id).map((e, i) => ({ ...e, sira: i })));
      setSilOnayId(null);
    }
    setSiliniyor(null);
  };

  const siraDegistir = async (id: string, yon: "yukari" | "asagi") => {
    const idx = etkinlikler.findIndex(e => e.id === id);
    if (idx === -1) return;
    const hedefIdx = yon === "yukari" ? idx - 1 : idx + 1;
    if (hedefIdx < 0 || hedefIdx >= etkinlikler.length) return;

    const yeni = [...etkinlikler];
    [yeni[idx], yeni[hedefIdx]] = [yeni[hedefIdx], yeni[idx]];
    yeni[idx].sira = idx;
    yeni[hedefIdx].sira = hedefIdx;
    setEtkinlikler(yeni);

    await Promise.all([
      fetch(`/api/dashboard/davetiye/${slug}/program/${yeni[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sira: idx }),
      }),
      fetch(`/api/dashboard/davetiye/${slug}/program/${yeni[hedefIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sira: hedefIdx }),
      }),
    ]);
  };

  const duzenleAc = (e: Etkinlik) => {
    setDuzenleId(e.id);
    setDuzenleForm({
      isim:     e.isim,
      tarih:    e.tarih ? e.tarih.slice(0, 10) : "",
      saat:     e.saat    ?? "",
      mekan:    e.mekan   ?? "",
      aciklama: e.aciklama ?? "",
      ikon:     e.ikon,
    });
  };

  // ── Form UI ──────────────────────────────────────────

  const EtkinlikFormu = ({
    form, setForm, onKaydet, onIptal, yukleniyor: yuk, baslangic,
  }: {
    form: typeof BOSH_FORM;
    setForm: (f: typeof BOSH_FORM) => void;
    onKaydet: () => void;
    onIptal: () => void;
    yukleniyor: boolean;
    baslangic?: boolean;
  }) => (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-4">
      {/* İkon seçici */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">İkon</p>
        <div className="flex flex-wrap gap-1.5">
          {HAZIR_IKONLAR.map(ikon => (
            <button
              key={ikon}
              type="button"
              onClick={() => setForm({ ...form, ikon })}
              className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                form.ikon === ikon ? "shadow-sm scale-110" : "hover:bg-gray-100"
              }`}
              style={form.ikon === ikon ? { backgroundColor: renk + "20", outline: `2px solid ${renk}40` } : {}}
            >
              {ikon}
            </button>
          ))}
        </div>
      </div>

      {/* Etkinlik adı */}
      <input
        type="text"
        placeholder="Etkinlik adı *  (örn: Kına Gecesi, Nikah, After Party)"
        value={form.isim}
        onChange={e => setForm({ ...form, isim: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
        style={{ ["--tw-ring-color" as string]: renk + "44" }}
        autoFocus={baslangic}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Tarih</label>
          <input
            type="date"
            value={form.tarih}
            onChange={e => setForm({ ...form, tarih: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Saat</label>
          <input
            type="text"
            placeholder="örn: 19:00"
            value={form.saat}
            onChange={e => setForm({ ...form, saat: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Mekan (opsiyonel)"
        value={form.mekan}
        onChange={e => setForm({ ...form, mekan: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
      />

      <input
        type="text"
        placeholder="Açıklama (opsiyonel)"
        value={form.aciklama}
        onChange={e => setForm({ ...form, aciklama: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
      />

      <div className="flex gap-2 pt-1">
        <button
          onClick={onKaydet}
          disabled={!form.isim.trim() || yuk}
          className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 transition-all"
          style={{ backgroundColor: renk }}
        >
          {yuk
            ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          }
          Kaydet
        </button>
        <button
          onClick={onIptal}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
        >
          İptal
        </button>
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white/90 border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/dashboard/davetiye/${slug}`}
              className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">
                {baslik} ·{" "}
                <span className="font-semibold" style={{ color: renk }}>
                  {etkinlikler.length} etkinlik
                </span>
              </p>
              <h1 className="text-base font-bold text-gray-900">Etkinlik Programı</h1>
            </div>
          </div>
          <button
            onClick={() => { setEkleAcik(true); setDuzenleId(null); }}
            className="flex items-center gap-1.5 text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all shrink-0"
            style={{ backgroundColor: renk }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ekle
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Bilgi kartı */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-xl shrink-0">📅</span>
          <div>
            <p className="text-sm font-semibold text-blue-900">Etkinlik programı misafirlere gösterilir</p>
            <p className="text-xs text-blue-700 mt-0.5">
              2 veya daha fazla etkinlik eklendiğinde, RSVP formunda misafirler hangi etkinliklere katılacaklarını seçer.
            </p>
          </div>
        </div>

        {/* Ekleme formu */}
        {ekleAcik && (
          <EtkinlikFormu
            form={ekleForm}
            setForm={setEkleForm}
            onKaydet={ekle}
            onIptal={() => { setEkleAcik(false); setEkleForm(BOSH_FORM); }}
            yukleniyor={ekleniyor}
            baslangic
          />
        )}

        {/* Liste */}
        {etkinlikler.length === 0 && !ekleAcik ? (
          <div className="bg-white border border-gray-100 rounded-3xl py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📅</div>
            <p className="text-gray-500 text-sm font-medium">Henüz etkinlik eklenmedi</p>
            <p className="text-gray-300 text-xs mt-1">Kına, nikah, düğün gibi etkinlikleri ekleyin</p>
            <button
              onClick={() => setEkleAcik(true)}
              className="mt-4 text-sm font-semibold px-5 py-2.5 rounded-xl text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: renk }}
            >
              İlk Etkinliği Ekle
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {etkinlikler.map((e, idx) => {
              const duzenleniyor = duzenleId === e.id;
              const silOnay = silOnayId === e.id;

              return (
                <div key={e.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  {/* Ana satır */}
                  <div className="flex items-start gap-4 px-5 py-4">
                    {/* Sıra kontrolleri */}
                    <div className="flex flex-col gap-0.5 shrink-0 mt-1">
                      <button
                        onClick={() => siraDegistir(e.id, "yukari")}
                        disabled={idx === 0}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 disabled:opacity-20 transition-all text-xs"
                        title="Yukarı taşı"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => siraDegistir(e.id, "asagi")}
                        disabled={idx === etkinlikler.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 disabled:opacity-20 transition-all text-xs"
                        title="Aşağı taşı"
                      >
                        ↓
                      </button>
                    </div>

                    {/* İkon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: renk + "15" }}
                    >
                      {e.ikon}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{e.isim}</p>
                        {e._count.rsvplar > 0 && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: renk }}
                          >
                            {e._count.rsvplar} katılım
                          </span>
                        )}
                      </div>
                      {(e.tarih || e.saat || e.mekan) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {[tarihFormatla(e.tarih, e.saat), e.mekan].filter(Boolean).join("  ·  ")}
                        </p>
                      )}
                      {e.aciklama && (
                        <p className="text-xs text-gray-400 italic mt-0.5">{e.aciklama}</p>
                      )}
                    </div>

                    {/* Eylemler */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => duzenleniyor ? setDuzenleId(null) : duzenleAc(e)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                        title="Düzenle"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSilOnayId(silOnay ? null : e.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all"
                        title="Sil"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Silme onayı */}
                  {silOnay && (
                    <div className="mx-5 mb-4 px-4 py-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between gap-3">
                      <p className="text-xs text-red-700 font-medium">
                        &ldquo;{e.isim}&rdquo; silinsin mi? Bu işlem geri alınamaz.
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => sil(e.id)}
                          disabled={siliniyor === e.id}
                          className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                        >
                          {siliniyor === e.id ? "..." : "Sil"}
                        </button>
                        <button
                          onClick={() => setSilOnayId(null)}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-white transition-all"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Düzenleme formu */}
                  {duzenleniyor && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-50">
                      <EtkinlikFormu
                        form={duzenleForm}
                        setForm={setDuzenleForm}
                        onKaydet={kaydet}
                        onIptal={() => setDuzenleId(null)}
                        yukleniyor={kaydediyor}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

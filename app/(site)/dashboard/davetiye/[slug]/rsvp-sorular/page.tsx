"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { type RsvpSoru, type RsvpSoruId, VARSAYILAN_RSVP_SORULAR, SORU_META } from "@/lib/rsvp-sorular";

interface Props {
  params: Promise<{ slug: string }>;
}

function Toggle({ acik, onChange }: { acik: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${acik ? "bg-purple-600" : "bg-gray-200"}`}
      aria-pressed={acik}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${acik ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export default function RsvpSorularPage({ params }: Props) {
  const { slug } = use(params);
  const [sorular, setSorular] = useState<RsvpSoru[]>(VARSAYILAN_RSVP_SORULAR);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: "basarili" | "hata"; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/davetiye/${slug}/rsvp-sorular`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.rsvpSorular)) setSorular(data.rsvpSorular);
      })
      .catch(() => {})
      .finally(() => setYukleniyor(false));
  }, [slug]);

  function soruToggle(id: RsvpSoruId) {
    setSorular(prev => prev.map(s => s.id === id ? { ...s, aktif: !s.aktif } : s));
  }

  function ozelSoruGuncelle(soru: string) {
    setSorular(prev => prev.map(s => s.id === "ozel" ? { ...s, soru } : s));
  }

  async function kaydet() {
    setKaydediliyor(true);
    setMesaj(null);
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/rsvp-sorular`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvpSorular: sorular }),
      });
      if (!res.ok) throw new Error();
      setMesaj({ tip: "basarili", text: "RSVP soruları kaydedildi." });
    } catch {
      setMesaj({ tip: "hata", text: "Kaydedilemedi, tekrar deneyin." });
    } finally {
      setKaydediliyor(false);
    }
  }

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href={`/dashboard/davetiye/${slug}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RSVP Soruları</h1>
            <p className="text-sm text-gray-400">Misafirlerden toplanacak ekstra bilgileri seçin</p>
          </div>
        </div>

        {/* Açıklama kartı */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-6 flex gap-3">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-sm text-purple-700 leading-relaxed">
            Aktif ettiğiniz sorular RSVP formunda otomatik olarak görünür. Katılım bildirimi yapan misafirler bu soruları yanıtlar ve cevaplar Dashboard&apos;da görüntülenir.
          </p>
        </div>

        {/* Soru kartları */}
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 mb-6">
          {VARSAYILAN_RSVP_SORULAR.map(({ id }) => {
            const meta = SORU_META[id];
            const soru = sorular.find(s => s.id === id) ?? { id, aktif: false };
            return (
              <div key={id} className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{meta.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{meta.aciklama}</p>
                  </div>
                  <Toggle acik={soru.aktif} onChange={() => soruToggle(id)} />
                </div>

                {/* Özel soru metni */}
                {id === "ozel" && soru.aktif && (
                  <div className="mt-3 ml-14">
                    <input
                      type="text"
                      placeholder="Soru metninizi yazın (örn. Masa tercihiniz?)"
                      value={(soru as RsvpSoru).soru ?? ""}
                      maxLength={200}
                      onChange={e => ozelSoruGuncelle(e.target.value)}
                      className="w-full border-2 border-purple-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Misafirler bu soruyu görecek ve serbest metin olarak yanıtlayacak.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mesaj */}
        {mesaj && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
            mesaj.tip === "basarili"
              ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
              : "bg-red-50 border border-red-100 text-red-600"
          }`}>
            <span>{mesaj.tip === "basarili" ? "✅" : "⚠️"}</span>
            {mesaj.text}
          </div>
        )}

        {/* Kaydet */}
        <button
          onClick={kaydet}
          disabled={kaydediliyor}
          className="w-full py-3.5 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {kaydediliyor ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Kaydediliyor...</>
          ) : (
            "Kaydet"
          )}
        </button>
      </div>
    </div>
  );
}

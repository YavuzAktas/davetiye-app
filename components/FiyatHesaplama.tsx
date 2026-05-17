"use client";

import { useState } from "react";
import Link from "next/link";
import { DAVETIYE_FIYAT_KALEMLERI, tutarMetni } from "@/lib/davetiye-fiyatlandirma";

const OZELLIKLER = [
  {
    ...DAVETIYE_FIYAT_KALEMLERI.luksSablon,
    icon: "✨",
    desc: "Nişan Lüks, Düğün Lüks ve Doğum Günü Lüks şablonlar",
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.muzik,
    icon: "🎵",
    desc: "Seçilen müzik davetiyede arka planda çalar",
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.album,
    icon: "📸",
    desc: "Misafirler fotoğraf yükler, sen onaylarsın",
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.sesliAni,
    icon: "🎙️",
    desc: "Misafirler sesli mesaj bırakır, 30 sn limit",
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.canliDuvar,
    icon: "🖼️",
    desc: "Gerçek zamanlı fotoğraf akışı, misafirler canlı görür",
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.oturmaPlan,
    icon: "🪑",
    desc: "Masa ve koltuk düzeni, davetli atama",
  },
] as const;

const TEMEL = DAVETIYE_FIYAT_KALEMLERI.temel;

export default function FiyatHesaplama() {
  const [secili, setSecili] = useState<Set<string>>(new Set());

  const toggle = (kod: string) => {
    setSecili(prev => {
      const s = new Set(prev);
      s.has(kod) ? s.delete(kod) : s.add(kod);
      return s;
    });
  };

  const secilenler = OZELLIKLER.filter(o => secili.has(o.kod));
  const ekToplam   = secilenler.reduce((a, o) => a + o.tutar, 0);
  const toplam     = TEMEL.tutar + ekToplam;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6 items-start">

      {/* ── Feature toggles ── */}
      <div className="space-y-3">
        {/* Base — always included */}
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-purple-500/30 bg-purple-500/10">
          <div className="flex items-center gap-4">
            <span className="text-xl w-8 text-center">✉️</span>
            <div>
              <p className="text-sm font-bold text-white">Dijital davetiye</p>
              <p className="text-xs text-white/40 mt-0.5">RSVP formu, paylaşım linki, yönetim paneli dahil</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-bold text-purple-300">{tutarMetni(TEMEL.tutar)}</span>
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[11px] text-white font-bold">✓</span>
          </div>
        </div>

        {/* Add-ons */}
        {OZELLIKLER.map(ozellik => {
          const aktif = secili.has(ozellik.kod);
          return (
            <button
              key={ozellik.kod}
              type="button"
              onClick={() => toggle(ozellik.kod)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-left transition-all duration-200 ${
                aktif
                  ? "border-purple-500/30 bg-purple-500/10"
                  : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xl w-8 text-center shrink-0">{ozellik.icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold transition-colors ${aktif ? "text-purple-200" : "text-white/75"}`}>
                    {ozellik.ad}
                  </p>
                  <p className="text-xs text-white/35 mt-0.5 truncate">{ozellik.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className={`text-sm font-bold transition-colors ${aktif ? "text-purple-300" : "text-white/35"}`}>
                  +{tutarMetni(ozellik.tutar)}
                </span>
                {/* Toggle */}
                <div className={`relative w-11 h-6 rounded-full border transition-all duration-300 ${
                  aktif
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent"
                    : "bg-white/8 border-white/15"
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                    aktif ? "left-[22px]" : "left-0.5"
                  }`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Running total card ── */}
      <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl shadow-black/40">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/80 mb-5">
          Tahmini Toplam
        </p>

        {/* Line items */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/55">✉️ Dijital davetiye</span>
            <span className="text-sm font-semibold text-white/80">{tutarMetni(TEMEL.tutar)}</span>
          </div>
          {secilenler.map(o => (
            <div key={o.kod} className="flex justify-between items-center">
              <span className="text-sm text-white/55 truncate mr-3">{o.icon} {o.ad}</span>
              <span className="text-sm font-semibold text-purple-300 shrink-0">+{tutarMetni(o.tutar)}</span>
            </div>
          ))}
          {secilenler.length === 0 && (
            <p className="text-xs text-white/20 text-center py-2 italic">Ek özellik seçilmedi</p>
          )}
        </div>

        <div className="h-px bg-white/8 mb-5" />

        {/* Total */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-white/60">Toplam</span>
          <span className="text-3xl font-black text-white tabular-nums" style={{ transition: "all 0.3s" }}>
            {tutarMetni(toplam)}
          </span>
        </div>

        <Link
          href="/sablonlar"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
          style={{ boxShadow: "0 8px 28px rgba(124,58,237,0.4)" }}
        >
          Davetiye Oluştur
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        <p className="text-center text-[11px] text-white/20 mt-4">
          Ödeme tamamlanana kadar davetiye yayına alınmaz
        </p>
      </div>
    </div>
  );
}

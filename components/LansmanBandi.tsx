"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SURE_MS    = 24 * 60 * 60 * 1000;
const EXPIRY_KEY = "bekleriz_bitis";
const KAPALI_KEY = "bekleriz_band_kapali";

function getBitis(): number {
  try {
    const s = localStorage.getItem(EXPIRY_KEY);
    if (s) { const v = parseInt(s, 10); if (v > Date.now()) return v; }
    const n = Date.now() + SURE_MS;
    localStorage.setItem(EXPIRY_KEY, String(n));
    return n;
  } catch { return Date.now() + SURE_MS; }
}

export default function LansmanBandi() {
  const [gizli,      setGizli]      = useState(true);
  const [zaman,      setZaman]      = useState({ saat: "23", dakika: "59", saniye: "59" });
  const [kisiSayisi, setKisiSayisi] = useState(0);
  const bitisRef = useRef(0);

  useEffect(() => {
    try { if (localStorage.getItem(KAPALI_KEY) === "1") return; } catch { return; }
    bitisRef.current = getBitis();
    setKisiSayisi(Math.floor(Math.random() * 18) + 9);

    const guncelle = () => {
      const fark = bitisRef.current - Date.now();
      if (fark <= 0) {
        const n = Date.now() + SURE_MS;
        bitisRef.current = n;
        try { localStorage.setItem(EXPIRY_KEY, String(n)); } catch {}
        return;
      }
      setZaman({
        saat:   String(Math.floor(fark / 3600000)).padStart(2, "0"),
        dakika: String(Math.floor((fark % 3600000) / 60000)).padStart(2, "0"),
        saniye: String(Math.floor((fark % 60000) / 1000)).padStart(2, "0"),
      });
    };

    guncelle();
    setGizli(false);
    const iv = setInterval(guncelle, 1000);
    return () => clearInterval(iv);
  }, []);

  const kapat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { localStorage.setItem(KAPALI_KEY, "1"); } catch {}
    setGizli(true);
  };

  if (gizli) return null;

  const BIRIMLER = [
    { v: zaman.saat,   l: "SA" },
    { v: zaman.dakika, l: "DK" },
    { v: zaman.saniye, l: "SN" },
  ];

  const gradientStyle = {
    background: "linear-gradient(270deg,#3b0764,#6d28d9,#db2777,#f59e0b,#db2777,#6d28d9,#3b0764)",
    backgroundSize: "400% 400%",
    animation: "lb-slide 8s ease infinite",
  };

  return (
    <>
      <style>{`
        @keyframes lb-slide { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes lb-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes lb-glow  { 0%,100%{box-shadow:0 0 6px rgba(251,191,36,0.25)} 50%{box-shadow:0 0 16px rgba(251,191,36,0.6)} }
        .lb-digit { animation: lb-glow 1.8s ease-in-out infinite; }
        .lb-dot   { animation: lb-pulse 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lb-motion-safe, .lb-digit, .lb-dot { animation: none !important; }
        }
      `}</style>

      {/* ════════════════════════════════════
          MOBİL banner (< sm)
      ════════════════════════════════════ */}
      <div className="relative overflow-hidden sm:hidden" style={gradientStyle}>
        <div className="absolute inset-0 bg-black/38 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/12 pointer-events-none" />

        <div className="relative flex items-center gap-2 px-3 py-2 pr-2">
          {/* Sol: 2 satır */}
          <div className="flex-1 min-w-0">
            {/* Üst satır: ne bitiyor */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm leading-none shrink-0">🔥</span>
              <span className="text-[12px] font-bold text-white/90 whitespace-nowrap">
                Lansman fiyatı bitiyor
              </span>
            </div>
            {/* Alt satır: ne kadar kaldı */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="tabular-nums text-[12px] font-black text-amber-300">
                {zaman.saat}:{zaman.dakika}:{zaman.saniye}
              </span>
              <span className="text-[10px] text-white/35 font-medium">kaldı</span>
            </div>
          </div>

          {/* Sağ: CTA + kapat */}
          <Link
            href="/sablonlar"
            className="shrink-0 rounded-full px-3.5 py-2 text-[11px] font-black text-white transition active:scale-95"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
            }}
          >
            Oluştur →
          </Link>

          <button
            onClick={kapat}
            aria-label="Kapat"
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-white/35 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════
          DESKTOP banner (sm+) — tek satır, tam
      ════════════════════════════════════ */}
      <div
        className="lb-motion-safe relative overflow-hidden hidden sm:block"
        style={gradientStyle}
      >
        <div className="absolute inset-0 bg-black/38 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-2.5 pr-12 flex items-center justify-center gap-3 lg:gap-5">

          {/* Sosyal kanıt */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <span className="lb-dot w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-[11px] font-semibold text-white/65 whitespace-nowrap">
              {kisiSayisi} kişi şu an inceliyor
            </span>
          </div>
          <div className="hidden lg:block w-px h-4 bg-white/20 shrink-0" />

          {/* Ana metin */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-black text-white whitespace-nowrap">
              Lansman fiyatı bitiyor!
            </span>
          </div>

          {/* Sayaç kutuları */}
          <div className="flex items-center gap-1 shrink-0">
            {BIRIMLER.map((b, i) => (
              <div key={b.l} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="lb-dot text-amber-400/70 font-black text-lg leading-none">:</span>
                )}
                <div
                  className="lb-digit flex flex-col items-center rounded-lg"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(251,191,36,0.35)",
                    minWidth: 40, padding: "4px 7px",
                  }}
                >
                  <span className="font-black tabular-nums leading-none" style={{ fontSize: 17, color: "#fbbf24" }}>
                    {b.v}
                  </span>
                  <span className="font-bold uppercase leading-none mt-0.5"
                    style={{ fontSize: 8, color: "rgba(251,191,36,0.5)", letterSpacing: "0.12em" }}>
                    {b.l}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <span className="text-xs font-bold text-white/50 shrink-0">kaldı</span>

          {/* CTA */}
          <Link
            href="/sablonlar"
            className="shrink-0 whitespace-nowrap text-xs font-black text-white rounded-lg px-4 py-2 transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
            }}
          >
            Şimdi Oluştur →
          </Link>
        </div>

        {/* X */}
        <button
          onClick={kapat}
          aria-label="Bandı kapat"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/35 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

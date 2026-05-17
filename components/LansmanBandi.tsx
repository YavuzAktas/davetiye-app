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
  const [gizli,  setGizli]   = useState(true);
  const [zaman,  setZaman]   = useState({ saat: "23", dakika: "59", saniye: "59" });
  const [kisiSayisi, setKisiSayisi] = useState(0);
  const bitisRef = useRef(0);

  useEffect(() => {
    try { if (localStorage.getItem(KAPALI_KEY) === "1") return; } catch { return; }

    bitisRef.current = getBitis();
    setKisiSayisi(Math.floor(Math.random() * 18) + 9); // 9–26

    const guncelle = () => {
      const fark = bitisRef.current - Date.now();
      if (fark <= 0) {
        const n = Date.now() + SURE_MS;
        bitisRef.current = n;
        try { localStorage.setItem(EXPIRY_KEY, String(n)); } catch {}
        return;
      }
      const s  = Math.floor(fark / 3600000);
      const d  = Math.floor((fark % 3600000) / 60000);
      const sn = Math.floor((fark % 60000) / 1000);
      setZaman({
        saat:   String(s).padStart(2, "0"),
        dakika: String(d).padStart(2, "0"),
        saniye: String(sn).padStart(2, "0"),
      });
    };

    guncelle();
    setGizli(false);
    const iv = setInterval(guncelle, 1000);
    return () => clearInterval(iv);
  }, []);

  const kapat = () => {
    try { localStorage.setItem(KAPALI_KEY, "1"); } catch {}
    setGizli(true);
  };

  if (gizli) return null;

  return (
    <>
      <style>{`
        @keyframes lb-slide { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes lb-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.92)} }
        @keyframes lb-flip  {
          0%  { transform: translateY(0);   opacity: 1; }
          45% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(100%);  opacity: 0; }
          100%{ transform: translateY(0);   opacity: 1; }
        }
        @keyframes lb-glow  { 0%,100%{box-shadow:0 0 8px rgba(251,191,36,0.3)} 50%{box-shadow:0 0 18px rgba(251,191,36,0.65)} }
        .lb-digit { animation: lb-glow 1.8s ease-in-out infinite; }
        .lb-dot   { animation: lb-pulse 1s ease-in-out infinite; }
      `}</style>

      {/* Animasyonlu gradient band */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(270deg,#3b0764,#6d28d9,#db2777,#f59e0b,#db2777,#6d28d9,#3b0764)",
          backgroundSize: "400% 400%",
          animation: "lb-slide 8s ease infinite",
        }}
      >
        {/* İnce overlay — kontrastı artırır */}
        <div className="absolute inset-0 bg-black/38 pointer-events-none" />

        {/* Alt parlak çizgi */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── TEK SATIR: tüm elementler yatayda ── */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 py-2.5 pr-8">

            {/* Canlı gösterge + sosyal kanıt */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              <span className="lb-dot w-2 h-2 rounded-full bg-emerald-400 shrink-0 inline-block" />
              <span className="text-[11px] font-semibold text-white/70 whitespace-nowrap">
                {kisiSayisi} kişi şu an inceliyor
              </span>
            </div>

            <div className="hidden md:block w-px h-4 bg-white/20 shrink-0" />

            {/* Ana metin */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm">🔥</span>
              <span className="text-xs sm:text-sm font-black text-white tracking-tight whitespace-nowrap">
                Lansman fiyatı bitiyor!
              </span>
            </div>

            {/* Sayaç */}
            <div className="flex items-center gap-1 shrink-0">
              {[
                { v: zaman.saat,   l: "SA" },
                { v: zaman.dakika, l: "DK" },
                { v: zaman.saniye, l: "SN" },
              ].map((birim, i) => (
                <div key={birim.l} className="flex items-center gap-1">
                  {i > 0 && (
                    <span className="lb-dot text-white font-black text-base leading-none">:</span>
                  )}
                  <div
                    className="lb-digit flex flex-col items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(0,0,0,0.45)",
                      border: "1px solid rgba(251,191,36,0.4)",
                      minWidth: 38, padding: "3px 6px",
                    }}
                  >
                    <span
                      className="font-black tabular-nums leading-none"
                      style={{ fontSize: 16, color: "#fbbf24", letterSpacing: 1 }}
                    >
                      {birim.v}
                    </span>
                    <span
                      className="font-bold uppercase leading-none mt-0.5"
                      style={{ fontSize: 8, color: "rgba(251,191,36,0.55)", letterSpacing: "0.12em" }}
                    >
                      {birim.l}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* "kaldı" etiketi */}
            <span className="text-[11px] font-bold text-white/60 shrink-0 hidden sm:inline">kaldı</span>

            {/* CTA */}
            <Link
              href="/sablonlar"
              className="shrink-0 whitespace-nowrap text-xs font-black text-white rounded-lg px-3.5 py-2 transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              Şimdi Oluştur <span className="ml-0.5">→</span>
            </Link>
          </div>
        </div>

        {/* Kapat */}
        <button
          onClick={kapat}
          aria-label="Bandı kapat"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}

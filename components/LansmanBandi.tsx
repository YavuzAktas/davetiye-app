"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SURE_MS   = 24 * 60 * 60 * 1000;
const EXPIRY_KEY = "bekleriz_bitis";
const KAPALI_KEY = "bekleriz_band_kapali";

function getBitis(): number {
  try {
    const stored = localStorage.getItem(EXPIRY_KEY);
    if (stored) {
      const val = parseInt(stored, 10);
      if (val > Date.now()) return val;
    }
    const yeni = Date.now() + SURE_MS;
    localStorage.setItem(EXPIRY_KEY, String(yeni));
    return yeni;
  } catch {
    return Date.now() + SURE_MS;
  }
}

export default function LansmanBandi() {
  const [gizli,  setGizli]  = useState(true);
  const [zaman,  setZaman]  = useState({ saat: "23", dakika: "59", saniye: "59" });
  const bitisRef = useRef(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(KAPALI_KEY) === "1") return;
    } catch { return; }

    bitisRef.current = getBitis();

    const guncelle = () => {
      const fark = bitisRef.current - Date.now();
      if (fark <= 0) {
        bitisRef.current = Date.now() + SURE_MS;
        try { localStorage.setItem(EXPIRY_KEY, String(bitisRef.current)); } catch {}
        return;
      }
      const s  = Math.floor(fark / (1000 * 60 * 60));
      const d  = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));
      const sn = Math.floor((fark % (1000 * 60)) / 1000);
      setZaman({
        saat:    String(s).padStart(2, "0"),
        dakika:  String(d).padStart(2, "0"),
        saniye:  String(sn).padStart(2, "0"),
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

  const BIRIMLER = [
    { deger: zaman.saat,   etiket: "saat" },
    { deger: zaman.dakika, etiket: "dak"  },
    { deger: zaman.saniye, etiket: "sn"   },
  ];

  return (
    <div
      className="relative overflow-hidden border-b border-amber-500/12"
      style={{ background: "linear-gradient(90deg,#160328 0%,#0c0118 50%,#160328 100%)" }}
    >
      {/* Amber alt parıltı */}
      <div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent)" }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-3 sm:gap-5">

        {/* Ateş + metin */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm animate-pulse">🔥</span>
          <span className="text-xs sm:text-sm font-semibold text-white/75 whitespace-nowrap">
            Lansman fiyatı sona eriyor
          </span>
        </div>

        {/* Ayırıcı */}
        <div className="hidden sm:block w-px h-4 bg-white/10 shrink-0" />

        {/* Sayaç */}
        <div className="flex items-center gap-1 shrink-0">
          {BIRIMLER.map((birim, idx) => (
            <div key={birim.etiket} className="flex items-center gap-1">
              {idx > 0 && (
                <span className="text-amber-500/50 font-black text-sm tabular-nums">:</span>
              )}
              <div className="flex flex-col items-center bg-amber-500/10 border border-amber-500/22 rounded-md px-1.5 py-0.5 min-w-9">
                <span className="text-amber-400 font-black text-sm tabular-nums leading-none">
                  {birim.deger}
                </span>
                <span className="text-amber-600/60 text-[8px] font-bold uppercase tracking-wider mt-0.5">
                  {birim.etiket}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/sablonlar"
          className="hidden sm:inline-flex items-center gap-1.5 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap shrink-0"
          style={{ boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}
        >
          Şimdi Oluştur →
        </Link>

        {/* Kapat */}
        <button
          onClick={kapat}
          aria-label="Bandı kapat"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/22 hover:text-white/55 transition-colors p-1.5"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

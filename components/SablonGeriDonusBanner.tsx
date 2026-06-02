"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const KEY = "davetrota_sablon_secimi";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

type Secim = { sablonId: string; sablonIsim: string; savedAt: number };

export function saveSablonSecimi(sablonId: string, sablonIsim: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ sablonId, sablonIsim, savedAt: Date.now() }));
  } catch {}
}

export function clearSablonSecimi() {
  try { localStorage.removeItem(KEY); } catch {}
}

export default function SablonGeriDonusBanner() {
  const [secim, setSecim] = useState<Secim | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const s: Secim = JSON.parse(raw);
      if (Date.now() - s.savedAt > MAX_AGE) { localStorage.removeItem(KEY); return; }
      setSecim(s);
    } catch {}
  }, []);

  if (!secim) return null;

  const kapat = () => { clearSablonSecimi(); setSecim(null); };

  return (
    <div className="mx-4 sm:mx-auto sm:max-w-5xl mb-3 mt-3 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3.5 flex items-center gap-3 shadow-sm">
      <span className="text-xl shrink-0">↩️</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-purple-900 leading-tight">Kaldığınız yerden devam edin</p>
        <p className="text-xs text-purple-600 mt-0.5">
          <span className="font-semibold">{secim.sablonIsim}</span> şablonu seçtiniz
        </p>
      </div>
      <Link
        href={`/olustur?sablon=${secim.sablonId}`}
        onClick={kapat}
        className="shrink-0 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition-colors"
      >
        Devam Et →
      </Link>
      <button
        onClick={kapat}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-700 transition-colors text-xs"
        aria-label="Kapat"
      >
        ✕
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "oturma-plan-ipucu-v1";
const AUTO_DISMISS_MS = 6000;

export default function OturmaPlanIpucu() {
  const [goruldu, setGoruldu] = useState(true);
  const [progress, setProgress] = useState(100);
  const [dokunmatik, setDokunmatik] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    setDokunmatik(window.matchMedia("(pointer: coarse)").matches);
    setGoruldu(false);

    const baslangic = Date.now();
    const interval = setInterval(() => {
      const gecen = Date.now() - baslangic;
      const kalan = Math.max(0, 100 - (gecen / AUTO_DISMISS_MS) * 100);
      setProgress(kalan);
      if (kalan === 0) clearInterval(interval);
    }, 50);

    const timer = setTimeout(kapat, AUTO_DISMISS_MS);
    return () => { clearTimeout(timer); clearInterval(interval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kapat = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setGoruldu(true);
  };

  if (goruldu) return null;

  return (
    <div className="relative bg-purple-950/90 border border-purple-500/25 rounded-2xl overflow-hidden mb-6">
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-0.5 bg-purple-400 transition-none"
        style={{ width: `${progress}%` }}
      />

      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        {/* İkon */}
        <span className={`text-xl shrink-0 mt-0.5 ${dokunmatik ? "animate-bounce" : "animate-pulse"}`}>
          {dokunmatik ? "👆" : "🖱️"}
        </span>

        {/* Metin */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">
            {dokunmatik ? "Basılı tut ve sürükle" : "Sürükle ve bırak"}
          </p>
          <p className="text-xs text-purple-300/80 mt-0.5 leading-relaxed">
            {dokunmatik
              ? "Misafirin üzerine parmağını 1 saniye basılı tut, ardından masaya kaydır."
              : "Misafiri tutup masanın üzerine bırak. Kaldırmak için × butonunu kullan."}
          </p>
        </div>

        {/* Kapat */}
        <button
          onClick={kapat}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-purple-400 hover:text-white hover:bg-white/10 transition-colors text-base leading-none"
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "oturma-plan-ipucu-v1";
const AUTO_DISMISS_MS = 6000;

export default function OturmaPlanIpucu() {
  const [goruldu, setGoruldu] = useState(true);
  const [gorunen, setGorunen] = useState(false); // slide-up için ayrı state
  const [progress, setProgress] = useState(100);
  const [dokunmatik, setDokunmatik] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    setDokunmatik(window.matchMedia("(pointer: coarse)").matches);
    setGoruldu(false);
    // Bir tick bekle ki CSS transition çalışsın
    requestAnimationFrame(() => setGorunen(true));

    // Progress bar
    const baslangic = Date.now();
    const interval = setInterval(() => {
      const gecen = Date.now() - baslangic;
      const kalan = Math.max(0, 100 - (gecen / AUTO_DISMISS_MS) * 100);
      setProgress(kalan);
      if (kalan === 0) clearInterval(interval);
    }, 50);

    const timer = setTimeout(() => kapat(), AUTO_DISMISS_MS);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  const kapat = () => {
    setGorunen(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      setGoruldu(true);
    }, 300);
  };

  if (goruldu) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-300"
      style={{
        opacity: gorunen ? 1 : 0,
        transform: `translateX(-50%) translateY(${gorunen ? "0" : "1rem"})`,
      }}
    >
      <div className="relative bg-[#1a0a2e] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/40 overflow-hidden">
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 h-0.5 bg-purple-400 transition-none"
          style={{ width: `${progress}%` }}
        />

        <div className="flex items-start gap-4 px-5 py-4">
          {/* Animasyonlu ikon */}
          <div className="shrink-0 mt-0.5">
            {dokunmatik ? (
              <div className="relative w-10 h-10">
                <span className="absolute inset-0 flex items-center justify-center text-2xl animate-bounce">👆</span>
              </div>
            ) : (
              <div className="relative w-10 h-10">
                <span className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🖱️</span>
              </div>
            )}
          </div>

          {/* Metin */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">
              {dokunmatik ? "Basılı tut ve sürükle" : "Sürükle ve bırak"}
            </p>
            <p className="text-xs text-purple-300/80 mt-0.5 leading-relaxed">
              {dokunmatik
                ? "Misafirin üzerine parmağını basılı tut, ardından istediğin masaya kaydır."
                : "Misafiri tutup masanın üzerine bırak. Atanmış misafirleri geri almak için × butonunu kullan."}
            </p>
          </div>

          {/* Kapat */}
          <button
            onClick={kapat}
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-purple-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

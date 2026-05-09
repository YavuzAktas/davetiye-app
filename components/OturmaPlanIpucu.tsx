"use client";

import { useState, useEffect } from "react";

export default function OturmaPlanIpucu() {
  const [dokunmatik, setDokunmatik] = useState(false);

  useEffect(() => {
    setDokunmatik(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <div className="bg-purple-950/90 border border-purple-500/25 rounded-2xl mb-6">
      <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
        <span className={`text-xl shrink-0 mt-0.5 ${dokunmatik ? "animate-bounce" : "animate-pulse"}`}>
          {dokunmatik ? "👆" : "🖱️"}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">
            {dokunmatik ? "Basılı tut ve sürükle" : "Sürükle ve bırak"}
          </p>
          <p className="text-xs text-purple-300/80 mt-0.5 leading-relaxed">
            {dokunmatik
              ? "Misafirin üzerine parmağını 1 saniye basılı tut, ardından masaya kaydır."
              : "Misafiri tutup masanın üzerine bırak. Kaldırmak için × butonunu kullan."}
          </p>
        </div>
      </div>
    </div>
  );
}

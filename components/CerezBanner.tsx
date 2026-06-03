"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cerez-bilgi-goruldu";

export default function CerezBanner() {
  const [goruldu, setGoruldu] = useState(true); // SSR'da gizli başla

  useEffect(() => {
    setGoruldu(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function kapat() {
    localStorage.setItem(STORAGE_KEY, "1");
    setGoruldu(true);
  }

  if (goruldu) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        <div className="relative bg-[#0f0118]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4">

          {/* Sol: ikon + metin */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="hidden sm:block text-xl shrink-0 mt-0.5">🍪</span>
            <div>
              <p className="text-white/90 text-xs sm:text-sm font-medium leading-snug">
                Bu site yalnızca oturum açmak için zorunlu çerezler kullanır.
              </p>
              <p className="text-white/35 text-[11px] sm:text-xs mt-0.5 leading-relaxed">
                Reklam veya izleme çerezi yoktur.{" "}
                <Link
                  href="/gizlilik#bolum-6"
                  className="underline underline-offset-2 hover:text-white/60 transition-colors"
                >
                  Çerez Politikası
                </Link>
              </p>
            </div>
          </div>

          {/* Sağ: buton */}
          <button
            onClick={kapat}
            className="shrink-0 bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-xl"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
}

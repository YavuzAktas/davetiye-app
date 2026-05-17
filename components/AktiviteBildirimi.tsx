"use client";

import { useState, useEffect } from "react";

const AKTIVITELER = [
  { isim: "Ayşe K.",    sehir: "İstanbul",   eylem: "düğün davetiyesi oluşturdu",          emoji: "💒", renk: "from-purple-500 to-pink-600"   },
  { isim: "Mehmet T.",  sehir: "Ankara",      eylem: "nişan davetiyesini yayınladı",         emoji: "💍", renk: "from-rose-500 to-pink-500"     },
  { isim: "Zeynep D.",  sehir: "İzmir",       eylem: "doğum günü davetiyesi oluşturdu",      emoji: "🎂", renk: "from-amber-400 to-orange-500"  },
  { isim: "Can A.",     sehir: "Bursa",       eylem: "sünnet davetiyesini paylaştı",         emoji: "⭐", renk: "from-blue-500 to-indigo-500"   },
  { isim: "Fatma Y.",   sehir: "Antalya",     eylem: "kına gecesi davetiyesi oluşturdu",     emoji: "🕯️", renk: "from-amber-500 to-rose-500"    },
  { isim: "Hüseyin B.", sehir: "Konya",       eylem: "düğün davetiyesini paylaştı",         emoji: "💒", renk: "from-violet-500 to-purple-600"  },
  { isim: "Merve Ş.",   sehir: "İstanbul",    eylem: "nişan davetiyesi oluşturdu",           emoji: "💍", renk: "from-pink-500 to-rose-500"     },
  { isim: "Burak K.",   sehir: "Adana",       eylem: "doğum günü davetiyesini yayınladı",   emoji: "🎂", renk: "from-emerald-500 to-teal-500"  },
  { isim: "Selin A.",   sehir: "Trabzon",     eylem: "düğün davetiyesi oluşturdu",           emoji: "💒", renk: "from-purple-600 to-pink-500"   },
  { isim: "Tarık M.",   sehir: "İzmir",       eylem: "nişan şablonunu seçti",               emoji: "💍", renk: "from-blue-600 to-cyan-500"     },
  { isim: "Elif S.",    sehir: "Eskişehir",   eylem: "düğün davetiyesini yayınladı",        emoji: "💒", renk: "from-fuchsia-500 to-pink-500"  },
  { isim: "Osman Y.",   sehir: "Gaziantep",   eylem: "sünnet davetiyesi oluşturdu",          emoji: "⭐", renk: "from-sky-500 to-blue-600"      },
];

type Aktivite = typeof AKTIVITELER[0];

export default function AktiviteBildirimi() {
  const [aktif,  setAktif]  = useState<Aktivite | null>(null);
  const [goster, setGoster] = useState(false);
  const [cikis,  setCikis]  = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let kapatId:    ReturnType<typeof setTimeout>;
    let animId:     ReturnType<typeof setTimeout>;

    const gosterBildirim = () => {
      const item = AKTIVITELER[Math.floor(Math.random() * AKTIVITELER.length)];
      setAktif(item);
      setCikis(false);
      setGoster(true);

      kapatId = setTimeout(() => {
        setCikis(true);
        animId = setTimeout(() => setGoster(false), 400);
      }, 4500);
    };

    timeoutId = setTimeout(() => {
      gosterBildirim();
      intervalId = setInterval(gosterBildirim, 14000);
    }, 7000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(kapatId);
      clearTimeout(animId);
      clearInterval(intervalId);
    };
  }, []);

  const kapat = () => {
    setCikis(true);
    setTimeout(() => setGoster(false), 400);
  };

  if (!goster || !aktif) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-5 z-50 flex items-center gap-3 bg-white rounded-2xl shadow-2xl border border-gray-100 px-4 py-3.5 max-w-72 w-72"
      style={{
        transform: cikis ? "translateX(-115%)" : "translateX(0)",
        opacity:   cikis ? 0 : 1,
        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
      }}
    >
      {/* Avatar */}
      <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${aktif.renk} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
        {aktif.emoji}
      </div>

      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-xs font-bold leading-snug truncate">
          {aktif.isim}, {aktif.sehir}
        </p>
        <p className="text-gray-500 text-xs leading-snug mt-0.5 truncate">
          {aktif.eylem}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" style={{ boxShadow: "0 0 4px #34d399" }} />
          <p className="text-gray-300 text-[10px]">Az önce</p>
        </div>
      </div>

      {/* Kapat */}
      <button
        onClick={kapat}
        aria-label="Kapat"
        className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

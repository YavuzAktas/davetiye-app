"use client";

import { useState, useEffect } from "react";

const AKTIVITELER = [
  { isim: "Ayşe K.",    sehir: "İstanbul",  eylem: "düğün davetiyesi oluşturdu",       emoji: "💒", g1: "#a855f7", g2: "#db2777" },
  { isim: "Mehmet T.",  sehir: "Ankara",    eylem: "nişan davetiyesini yayınladı",      emoji: "💍", g1: "#f43f5e", g2: "#ec4899" },
  { isim: "Zeynep D.",  sehir: "İzmir",     eylem: "doğum günü davetiyesi oluşturdu",  emoji: "🎂", g1: "#f59e0b", g2: "#f97316" },
  { isim: "Can A.",     sehir: "Bursa",     eylem: "sünnet davetiyesini paylaştı",      emoji: "⭐", g1: "#3b82f6", g2: "#6366f1" },
  { isim: "Fatma Y.",   sehir: "Antalya",   eylem: "kına gecesi davetiyesi oluşturdu", emoji: "🕯️", g1: "#f59e0b", g2: "#f43f5e" },
  { isim: "Hüseyin B.", sehir: "Konya",     eylem: "düğün davetiyesini paylaştı",      emoji: "💒", g1: "#7c3aed", g2: "#a855f7" },
  { isim: "Merve Ş.",   sehir: "İstanbul",  eylem: "nişan davetiyesi oluşturdu",        emoji: "💍", g1: "#ec4899", g2: "#f43f5e" },
  { isim: "Burak K.",   sehir: "Adana",     eylem: "doğum günü davetiyesi yayınladı",  emoji: "🎂", g1: "#10b981", g2: "#0ea5e9" },
  { isim: "Selin A.",   sehir: "Trabzon",   eylem: "düğün davetiyesi oluşturdu",        emoji: "💒", g1: "#8b5cf6", g2: "#ec4899" },
  { isim: "Tarık M.",   sehir: "İzmir",     eylem: "nişan şablonunu seçti",             emoji: "💍", g1: "#0ea5e9", g2: "#6366f1" },
  { isim: "Elif S.",    sehir: "Eskişehir", eylem: "düğün davetiyesini yayınladı",     emoji: "💒", g1: "#d946ef", g2: "#ec4899" },
  { isim: "Osman Y.",   sehir: "Gaziantep", eylem: "sünnet davetiyesi oluşturdu",       emoji: "⭐", g1: "#38bdf8", g2: "#3b82f6" },
];

type Aktivite = typeof AKTIVITELER[0];

const SURE = 5000;

export default function AktiviteBildirimi() {
  const [aktif,  setAktif]  = useState<Aktivite | null>(null);
  const [goster, setGoster] = useState(false);
  const [cikis,  setCikis]  = useState(false);
  const [anim,   setAnim]   = useState(false);

  useEffect(() => {
    let mountId:    ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let kapatId:    ReturnType<typeof setTimeout>;
    let slideId:    ReturnType<typeof setTimeout>;

    const gosterBildirim = () => {
      const item = AKTIVITELER[Math.floor(Math.random() * AKTIVITELER.length)];
      setAktif(item);
      setCikis(false);
      setAnim(false);
      setGoster(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));

      kapatId = setTimeout(() => {
        setCikis(true);
        slideId = setTimeout(() => setGoster(false), 500);
      }, SURE);
    };

    mountId = setTimeout(() => {
      gosterBildirim();
      intervalId = setInterval(gosterBildirim, 14000);
    }, 8000);

    return () => {
      clearTimeout(mountId);
      clearTimeout(kapatId);
      clearTimeout(slideId);
      clearInterval(intervalId);
    };
  }, []);

  const kapat = () => {
    setCikis(true);
    setTimeout(() => setGoster(false), 500);
  };

  if (!goster || !aktif) return null;

  return (
    <>
      <style>{`
        @keyframes ab-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        @keyframes ab-pulse-dot {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(52,211,153,0.4); }
          50%      { opacity:.7; box-shadow:0 0 0 4px rgba(52,211,153,0); }
        }
      `}</style>

      {/* Mobilde gizle — masaüstü only */}
      <div
        role="status"
        aria-live="polite"
        onClick={kapat}
        className="fixed bottom-6 left-5 z-50 hidden sm:block cursor-pointer select-none"
        style={{
          transform: (!anim || cikis) ? "translateX(-110%) scale(0.95)" : "translateX(0) scale(1)",
          opacity:   (!anim || cikis) ? 0 : 1,
          transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.45s ease",
          willChange: "transform, opacity",
        }}
      >
        {/* Dış glow hâlesi */}
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{ boxShadow: `0 0 24px 2px ${aktif.g1}22, 0 8px 32px rgba(0,0,0,0.45)` }}
        />

        {/* Kart */}
        <div
          className="relative overflow-hidden rounded-2xl flex flex-col"
          style={{
            width: 248,
            background: "linear-gradient(135deg,rgba(18,9,40,0.92) 0%,rgba(12,6,28,0.95) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Üst aksan çizgisi */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${aktif.g1}99 40%, ${aktif.g2}99 100%)` }}
          />

          {/* Sol kenar aksan */}
          <div
            className="absolute left-0 top-4 bottom-4 w-px rounded-full"
            style={{ background: `linear-gradient(180deg, ${aktif.g1}60, ${aktif.g2}60)` }}
          />

          {/* İçerik */}
          <div className="flex items-center gap-3 px-4 py-3.5 pl-5">
            {/* Emoji avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
              style={{
                background: `linear-gradient(135deg,${aktif.g1},${aktif.g2})`,
                boxShadow: `0 2px 10px ${aktif.g1}40`,
              }}
            >
              {aktif.emoji}
            </div>

            {/* Metin */}
            <div className="flex-1 min-w-0">
              <p
                className="truncate font-semibold leading-snug"
                style={{ color: "rgba(255,255,255,0.88)", fontSize: 12 }}
              >
                {aktif.isim}
                <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>, {aktif.sehir}</span>
              </p>
              <p
                className="truncate leading-snug mt-0.5"
                style={{ color: "rgba(255,255,255,0.32)", fontSize: 10 }}
              >
                {aktif.eylem}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                  style={{ animation: "ab-pulse-dot 2s ease-in-out infinite" }}
                />
                <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 9, letterSpacing: "0.04em" }}>
                  Az önce
                </p>
              </div>
            </div>
          </div>

          {/* İlerleme çubuğu */}
          <div style={{ height: 2, background: "rgba(255,255,255,0.04)", borderRadius: "0 0 16px 16px" }}>
            <div
              style={{
                height: "100%",
                background: `linear-gradient(90deg,${aktif.g1},${aktif.g2})`,
                transformOrigin: "left center",
                animation: `ab-progress ${SURE}ms linear forwards`,
                borderRadius: "inherit",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

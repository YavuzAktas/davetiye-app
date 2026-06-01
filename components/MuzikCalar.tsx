"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface Props { muzikUrl: string; renk?: string; autoplay?: boolean; gizle?: boolean }

/* ── Ortak toggle butonu ── */
function ToggleButon({ caliyor, onClick, renk, yukleniyor }: {
  caliyor: boolean; onClick: () => void; renk: string; yukleniyor?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={caliyor ? "Müziği durdur" : "Müziği çal"}
      className="fixed bottom-6 right-5 z-50 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${renk}f0, ${renk}c0)`,
        width: 46, height: 46,
        boxShadow: caliyor
          ? `0 0 0 3px rgba(255,255,255,0.12), 0 4px 18px ${renk}55`
          : `0 4px 14px ${renk}44`,
        border: `1px solid rgba(255,255,255,0.15)`,
      }}
    >
      {yukleniyor ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : caliyor ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1.5" />
          <rect x="14" y="4" width="4" height="16" rx="1.5" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
    </button>
  );
}

/* ── Local / preview audio ── */
function useAudio(src: string, autoplay = false) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayRef = useRef(autoplay);
  const [caliyor, setCaliyor] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.addEventListener("play",  () => setCaliyor(true));
    audio.addEventListener("pause", () => setCaliyor(false));
    audio.addEventListener("ended", () => setCaliyor(false));

    const tryPlay = () => audio.play().catch(() => {});

    if (autoplayRef.current) tryPlay();

    const handleBaslat = () => { if (audio.paused) tryPlay(); };
    document.addEventListener("muzik-baslat", handleBaslat);

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("muzik-baslat", handleBaslat);
    };
  }, [src]);

  /* Rota değişince durdur — Next.js router cache component'i unmount etmeyebilir */
  useEffect(() => {
    const a = audioRef.current;
    if (a && !a.paused) a.pause();
  }, [pathname]);

  /* Sayfa gizlenince durdur (başka uygulamaya/taba geçince) */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
      }
    };
    const handlePageHide = () => {
      if (audioRef.current) audioRef.current.pause();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    a.paused ? a.play().catch(() => {}) : a.pause();
  };
  return { caliyor, toggle };
}

/* ── Dispatch ── */
export default function MuzikCalar({ muzikUrl, renk = "#7C3AED", autoplay = false, gizle = false }: Props) {
  const { caliyor, toggle } = useAudio(muzikUrl, autoplay);
  if (gizle) return null;
  return <ToggleButon caliyor={caliyor} onClick={toggle} renk={renk} />;
}

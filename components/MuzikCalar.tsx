"use client";

import { useEffect, useRef, useState } from "react";

interface Props { muzikUrl: string; renk?: string }

/* ── Ortak toggle butonu ── */
function ToggleButon({ caliyor, onClick, renk, yukleniyor }: {
  caliyor: boolean; onClick: () => void; renk: string; yukleniyor?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={caliyor ? "Müziği durdur" : "Müziği çal"}
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${renk}, ${renk}bb)`,
        width: 52, height: 52,
        boxShadow: `0 4px 20px ${renk}55`,
      }}
    >
      {yukleniyor ? (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : caliyor ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
      {caliyor && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse border-2 border-white"
          style={{ backgroundColor: renk }} />
      )}
    </button>
  );
}

/* ── Local / preview audio ── */
function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [caliyor, setCaliyor] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.addEventListener("play",  () => setCaliyor(true));
    audio.addEventListener("pause", () => setCaliyor(false));
    audio.addEventListener("ended", () => setCaliyor(false));

    const tryPlay = () => audio.play().catch(() => {});

    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        // Autoplay engellendi — mühür tıklaması veya herhangi bir etkileşimde başlat
        const resume = () => { tryPlay(); };
        document.addEventListener("muzik-baslat", resume, { once: true });
        document.addEventListener("click",        resume, { once: true });
        document.addEventListener("touchstart",   resume, { once: true, passive: true });
      });
    }

    const handleBaslat = () => { if (audio.paused) tryPlay(); };
    document.addEventListener("muzik-baslat", handleBaslat);

    return () => {
      audio.pause();
      audio.src = "";
      document.removeEventListener("muzik-baslat", handleBaslat);
    };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    a.paused ? a.play().catch(() => {}) : a.pause();
  };
  return { caliyor, toggle };
}

function LocalCalar({ muzikUrl, renk }: Props) {
  const { caliyor, toggle } = useAudio(muzikUrl);
  return <ToggleButon caliyor={caliyor} onClick={toggle} renk={renk ?? "#7C3AED"} />;
}

function SpotifyPreviewCalar({ previewUrl, renk }: { previewUrl: string; renk: string }) {
  const { caliyor, toggle } = useAudio(previewUrl);
  return <ToggleButon caliyor={caliyor} onClick={toggle} renk={renk} />;
}

/* ── Dispatch ── */
export default function MuzikCalar({ muzikUrl, renk = "#7C3AED" }: Props) {
  if (muzikUrl.startsWith("spotify:")) {
    const pipeIdx    = muzikUrl.indexOf("|");
    const previewUrl = pipeIdx !== -1 ? muzikUrl.slice(pipeIdx + 1) : "";
    if (!previewUrl) return null; // preview URL yoksa çalamayız
    return <SpotifyPreviewCalar previewUrl={previewUrl} renk={renk} />;
  }

  return <LocalCalar muzikUrl={muzikUrl} renk={renk} />;
}

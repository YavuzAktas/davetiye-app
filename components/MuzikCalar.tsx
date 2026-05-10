"use client";

import { useEffect, useRef, useState } from "react";

interface Props { muzikUrl: string; renk?: string }

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

    // Try autoplay immediately
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        // Blocked by browser — start on first user interaction
        const resume = () => {
          tryPlay();
          document.removeEventListener("click",      resume);
          document.removeEventListener("touchstart", resume);
          document.removeEventListener("keydown",    resume);
        };
        document.addEventListener("click",      resume, { once: true });
        document.addEventListener("touchstart", resume, { once: true, passive: true });
        document.addEventListener("keydown",    resume, { once: true });
      });
    }

    return () => { audio.pause(); audio.src = ""; };
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  };

  return { caliyor, toggle };
}

function ToggleButon({
  caliyor, onClick, renk,
}: {
  caliyor: boolean; onClick: () => void; renk: string;
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
      {caliyor ? (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse border-2 border-white"
            style={{ backgroundColor: renk }} />
        </>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
    </button>
  );
}

function LocalCalar({ muzikUrl, renk }: Props) {
  const { caliyor, toggle } = useAudio(muzikUrl);
  return <ToggleButon caliyor={caliyor} onClick={toggle} renk={renk ?? "#7C3AED"} />;
}

function SpotifyPreviewCalar({ previewUrl, renk }: { previewUrl: string; renk: string }) {
  const { caliyor, toggle } = useAudio(previewUrl);
  return <ToggleButon caliyor={caliyor} onClick={toggle} renk={renk} />;
}

function SpotifyEmbedFallback({ trackId, renk }: { trackId: string; renk: string }) {
  const [acik, setAcik] = useState(false);
  return (
    <>
      <button
        onClick={() => setAcik(a => !a)}
        title="Spotify ile çal"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          background: `linear-gradient(135deg, ${renk}, ${renk}bb)`,
          width: 52, height: 52,
          boxShadow: `0 4px 20px ${renk}55`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </button>
      {acik && (
        <div className="fixed bottom-20 right-4 z-50 rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            style={{ borderRadius: 16 }}
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
            width="280" height="80" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </>
  );
}

export default function MuzikCalar({ muzikUrl, renk = "#7C3AED" }: Props) {
  if (muzikUrl.startsWith("spotify:")) {
    const rest = muzikUrl.slice("spotify:".length);
    const pipeIdx = rest.indexOf("|");
    const previewUrl = pipeIdx !== -1 ? rest.slice(pipeIdx + 1) : "";
    const trackId   = pipeIdx !== -1 ? rest.slice(0, pipeIdx) : rest;

    if (previewUrl) return <SpotifyPreviewCalar previewUrl={previewUrl} renk={renk} />;
    return <SpotifyEmbedFallback trackId={trackId} renk={renk} />;
  }

  return <LocalCalar muzikUrl={muzikUrl} renk={renk} />;
}

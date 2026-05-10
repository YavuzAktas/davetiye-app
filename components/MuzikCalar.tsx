"use client";

import { useEffect, useRef, useState } from "react";

function SpotifyCalar({ trackId }: { trackId: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-2xl overflow-hidden shadow-2xl"
      style={{ width: 300 }}>
      <iframe
        style={{ borderRadius: 16 }}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="300"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

function LocalCalar({ muzikUrl }: { muzikUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [caliyor, setCaliyor] = useState(false);

  useEffect(() => {
    const audio = new Audio(muzikUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener("play",  () => setCaliyor(true));
    audio.addEventListener("pause", () => setCaliyor(false));
    audio.addEventListener("ended", () => setCaliyor(false));

    audio.play().catch(() => {});

    return () => { audio.pause(); audio.src = ""; };
  }, [muzikUrl]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  };

  return (
    <button onClick={toggle} title={caliyor ? "Müziği durdur" : "Müziği çal"}
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{ background: "linear-gradient(135deg,#9b7fa8,#6b4f7a)", width: 52, height: 52 }}>
      {caliyor ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
      {caliyor && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white" />
      )}
    </button>
  );
}

export default function MuzikCalar({ muzikUrl }: { muzikUrl: string }) {
  if (muzikUrl.startsWith("spotify:")) {
    return <SpotifyCalar trackId={muzikUrl.replace("spotify:", "")} />;
  }
  return <LocalCalar muzikUrl={muzikUrl} />;
}

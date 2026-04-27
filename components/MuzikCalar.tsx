"use client";

import { useEffect, useRef, useState } from "react";

export default function MuzikCalar({ muzikUrl }: { muzikUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [calıyor, setCaliyor] = useState(false);
  const [yuklendi, setYuklendi] = useState(false);

  useEffect(() => {
    const audio = new Audio(muzikUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => setYuklendi(true));
    audio.addEventListener("play", () => setCaliyor(true));
    audio.addEventListener("pause", () => setCaliyor(false));
    audio.addEventListener("ended", () => setCaliyor(false));

    // Autoplay on mount — browsers may block until user interaction
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [muzikUrl]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <button
      onClick={toggle}
      title={calıyor ? "Müziği durdur" : "Müziği çal"}
      className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: "linear-gradient(135deg, #9b7fa8, #6b4f7a)",
        width: 52,
        height: 52,
      }}
    >
      {calıyor ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
      {calıyor && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white" />
      )}
    </button>
  );
}

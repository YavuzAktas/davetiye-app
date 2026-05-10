"use client";

import { useEffect, useRef, useState } from "react";

function ToggleButon({ caliyor, onClick }: { caliyor: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={caliyor ? "Müziği durdur" : "Müziği çal"}
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{ background: "linear-gradient(135deg,#1DB954,#158a3e)", width: 52, height: 52 }}
    >
      {caliyor ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        /* Spotify logo */
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.747 3.808-.871 7.076-.496 9.713 1.115.293.18.387.563.207.857zm1.223-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.127-.413.106-.849.517-.974 3.632-1.102 8.147-.568 11.235 1.328.366.226.482.707.258 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.131-1.017.624-1.166 3.532-1.073 9.404-.866 13.115 1.338.445.264.59.838.326 1.282-.264.443-.838.59-1.282.325z" />
        </svg>
      )}
      {caliyor && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse border-2 border-[#1DB954]" />
      )}
    </button>
  );
}

function SpotifyPreviewCalar({ previewUrl }: { previewUrl: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [caliyor, setCaliyor] = useState(false);

  useEffect(() => {
    const audio = new Audio(previewUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener("play",  () => setCaliyor(true));
    audio.addEventListener("pause", () => setCaliyor(false));
    audio.addEventListener("ended", () => setCaliyor(false));

    audio.play().catch(() => {});

    return () => { audio.pause(); audio.src = ""; };
  }, [previewUrl]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  };

  return <ToggleButon caliyor={caliyor} onClick={toggle} />;
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

  return <ToggleButon caliyor={caliyor} onClick={toggle} />;
}

export default function MuzikCalar({ muzikUrl }: { muzikUrl: string }) {
  if (muzikUrl.startsWith("spotify:")) {
    // Format: spotify:{trackId}|{previewUrl}
    const rest = muzikUrl.slice("spotify:".length);
    const pipeIdx = rest.indexOf("|");
    const previewUrl = pipeIdx !== -1 ? rest.slice(pipeIdx + 1) : "";

    if (previewUrl) return <SpotifyPreviewCalar previewUrl={previewUrl} />;

    // Preview URL yoksa — yeşil Spotify butonu, tıklayınca embed açılır
    const trackId = pipeIdx !== -1 ? rest.slice(0, pipeIdx) : rest;
    return <SpotifyEmbedFallback trackId={trackId} />;
  }

  return <LocalCalar muzikUrl={muzikUrl} />;
}

function SpotifyEmbedFallback({ trackId }: { trackId: string }) {
  const [acik, setAcik] = useState(false);

  return (
    <>
      <button
        onClick={() => setAcik(a => !a)}
        title="Spotify ile çal"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg,#1DB954,#158a3e)", width: 52, height: 52 }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.747 3.808-.871 7.076-.496 9.713 1.115.293.18.387.563.207.857zm1.223-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.127-.413.106-.849.517-.974 3.632-1.102 8.147-.568 11.235 1.328.366.226.482.707.258 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.131-1.017.624-1.166 3.532-1.073 9.404-.866 13.115 1.338.445.264.59.838.326 1.282-.264.443-.838.59-1.282.325z" />
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

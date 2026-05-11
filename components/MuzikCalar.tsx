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

/* ── Spotify IFrame API — programmatic play/pause ── */
function SpotifyIframeCalar({ trackId, renk }: { trackId: string; renk: string }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const playIntentRef = useRef(false);
  const [caliyor, setCaliyor]       = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    let alive = true;

    const handleBaslat = () => {
      if (controllerRef.current) {
        controllerRef.current.play();
      } else {
        playIntentRef.current = true;
      }
    };
    document.addEventListener("muzik-baslat", handleBaslat);

    const initController = (IFrameAPI: any) => {
      if (!alive || !containerRef.current) return;
      IFrameAPI.createController(
        containerRef.current,
        { uri: `spotify:track:${trackId}` },
        (ctrl: any) => {
          if (!alive) return;
          controllerRef.current = ctrl;
          ctrl.addListener("playback_update", (e: any) => {
            if (alive) setCaliyor(!e.data.isPaused);
          });
          ctrl.addListener("ready", () => {
            if (!alive) return;
            setYukleniyor(false);
            if (playIntentRef.current) {
              ctrl.play();
              playIntentRef.current = false;
            }
          });
        }
      );
    };

    if ((window as any).SpotifyIframeApi) {
      initController((window as any).SpotifyIframeApi);
    } else {
      const prev = (window as any).onSpotifyIframeApiReady;
      (window as any).onSpotifyIframeApiReady = (api: any) => {
        (window as any).SpotifyIframeApi = api;
        initController(api);
        if (prev) prev(api);
      };
      if (!document.getElementById("spotify-iframe-api")) {
        const s = document.createElement("script");
        s.id  = "spotify-iframe-api";
        s.src = "https://open.spotify.com/embed/iframe-api/v1";
        s.async = true;
        document.head.appendChild(s);
      }
    }

    return () => {
      alive = false;
      document.removeEventListener("muzik-baslat", handleBaslat);
    };
  }, [trackId]);

  const toggle = () => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;
    caliyor ? ctrl.pause() : ctrl.play();
  };

  return (
    <>
      {/*
        Tam kendi boyutu kadar dışarı çıkar → tarayıcı yükler.
        transform → fixed child'lar için containing block, viewport'a sızmaz.
      */}
      <div style={{ position: "fixed", left: -300, top: -80, transform: "translateZ(0)", pointerEvents: "none" }}>
        <div ref={containerRef} style={{ width: 300, height: 80 }} />
      </div>
      <ToggleButon caliyor={caliyor} onClick={toggle} renk={renk} yukleniyor={yukleniyor} />
    </>
  );
}

/* ── Dispatch ── */
export default function MuzikCalar({ muzikUrl, renk = "#7C3AED" }: Props) {
  if (muzikUrl.startsWith("spotify:")) {
    const pipeIdx    = muzikUrl.indexOf("|");
    const previewUrl = pipeIdx !== -1 ? muzikUrl.slice(pipeIdx + 1) : "";
    const trackId    = (pipeIdx !== -1 ? muzikUrl.slice("spotify:".length, pipeIdx) : muzikUrl.slice("spotify:".length));

    if (previewUrl) return <SpotifyPreviewCalar previewUrl={previewUrl} renk={renk} />;
    return <SpotifyIframeCalar trackId={trackId} renk={renk} />;
  }

  return <LocalCalar muzikUrl={muzikUrl} renk={renk} />;
}

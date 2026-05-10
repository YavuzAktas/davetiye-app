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

    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        const resume = () => {
          audio.play().catch(() => {});
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

/* ── Spotify IFrame API — programmatic play/pause, iframe gizli ── */
function SpotifyIframeCalar({ trackId, renk }: { trackId: string; renk: string }) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const controllerRef  = useRef<any>(null);
  const [caliyor, setCaliyor]       = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    let alive = true;

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
            if (alive) setYukleniyor(false);
          });
        }
      );
    };

    if ((window as any).SpotifyIframeApi) {
      // API zaten yüklü
      initController((window as any).SpotifyIframeApi);
    } else {
      // Callback — API yüklenince çağrılır
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

    return () => { alive = false; };
  }, [trackId]);

  const toggle = () => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;
    caliyor ? ctrl.pause() : ctrl.play();
  };

  return (
    <>
      {/* Gizli iframe container — display:none ses bloklar, off-screen kullanıyoruz */}
      <div ref={containerRef} style={{
        position: "fixed", left: -9999, top: -9999,
        width: 300, height: 80, pointerEvents: "none",
      }} />
      <ToggleButon caliyor={caliyor} onClick={toggle} renk={renk} yukleniyor={yukleniyor} />
    </>
  );
}

/* ── Dispatch ── */
export default function MuzikCalar({ muzikUrl, renk = "#7C3AED" }: Props) {
  if (muzikUrl.startsWith("spotify:")) {
    const rest      = muzikUrl.slice("spotify:".length);
    const pipeIdx   = rest.indexOf("|");
    const previewUrl = pipeIdx !== -1 ? rest.slice(pipeIdx + 1) : "";
    const trackId   = pipeIdx !== -1 ? rest.slice(0, pipeIdx) : rest;

    if (previewUrl) return <SpotifyPreviewCalar previewUrl={previewUrl} renk={renk} />;
    // Preview URL yok → Spotify IFrame API ile tam kontrol
    return <SpotifyIframeCalar trackId={trackId} renk={renk} />;
  }

  return <LocalCalar muzikUrl={muzikUrl} renk={renk} />;
}

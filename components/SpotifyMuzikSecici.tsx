"use client";

import { useState, useEffect, useRef } from "react";

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string | null;
  duration_ms: number;
  preview_url: string | null;
}

interface Props {
  secili: string; // "spotify:{id}|{previewUrl}" veya ""
  onChange: (deger: string) => void;
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1DB954]">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.747 3.808-.871 7.076-.496 9.713 1.115.293.18.387.563.207.857zm1.223-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.127-.413.106-.849.517-.974 3.632-1.102 8.147-.568 11.235 1.328.366.226.482.707.258 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.131-1.017.624-1.166 3.532-1.073 9.404-.866 13.115 1.338.445.264.59.838.326 1.282-.264.443-.838.59-1.282.325z" />
  </svg>
);

export default function SpotifyMuzikSecici({ secili, onChange }: Props) {
  const [arama, setArama]               = useState("");
  const [sonuclar, setSonuclar]         = useState<Track[]>([]);
  const [yukleniyor, setYukleniyor]     = useState(false);
  const [seciliTrack, setSeciliTrack]   = useState<Track | null>(null);
  const [yapilandirilmamis, setYok]     = useState(false);
  const timerRef                         = useRef<ReturnType<typeof setTimeout> | null>(null);

  const seciliId = secili.startsWith("spotify:") ? secili.replace("spotify:", "").split("|")[0] : "";

  // Dışarıdan secili değişince (kaldırma) local state'i sıfırla
  useEffect(() => {
    if (!secili) setSeciliTrack(null);
  }, [secili]);

  // Arama debounce
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!arama.trim() || arama.trim().length < 2) { setSonuclar([]); return; }

    timerRef.current = setTimeout(async () => {
      setYukleniyor(true);
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(arama.trim())}`);
        const data = await res.json();
        if (data.hata === "Spotify yapılandırılmamış") { setYok(true); setSonuclar([]); return; }
        setSonuclar(data.tracks ?? []);
      } catch { setSonuclar([]); }
      finally { setYukleniyor(false); }
    }, 500);
  }, [arama]);

  const sec = (track: Track) => {
    setSeciliTrack(track);
    onChange(`spotify:${track.id}|${track.preview_url ?? ""}`);
    setArama("");
    setSonuclar([]);
  };

  const kaldir = () => {
    setSeciliTrack(null);
    onChange("");
  };

  if (yapilandirilmamis) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500">Spotify entegrasyonu henüz yapılandırılmamış.</p>
        <p className="text-xs text-gray-400 mt-1">
          <code className="bg-gray-100 px-1 rounded">SPOTIFY_CLIENT_ID</code> ve{" "}
          <code className="bg-gray-100 px-1 rounded">SPOTIFY_CLIENT_SECRET</code> env değişkenlerini ekle.
        </p>
      </div>
    );
  }

  return (
    <div>
      {seciliId ? (
        /* ── Seçili track ── */
        <div className="flex items-center gap-3 p-3 bg-[#1DB95415] border-2 border-[#1DB95440] rounded-xl">
          {seciliTrack?.image ? (
            <img src={seciliTrack.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#1DB95420] flex items-center justify-center shrink-0">
              <SpotifyIcon />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {seciliTrack?.name ?? "Şarkı seçildi ✓"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {seciliTrack?.artist ?? "Spotify"}
              {seciliTrack && ` · ${formatMs(seciliTrack.duration_ms)}`}
            </p>
          </div>
          <button onClick={kaldir}
            className="text-xs text-red-500 hover:text-red-700 font-semibold shrink-0 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
            Kaldır
          </button>
        </div>
      ) : (
        /* ── Arama ── */
        <>
          <div className="relative">
            <input
              type="text"
              placeholder="Şarkı veya sanatçı ara..."
              value={arama}
              onChange={e => setArama(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent bg-white"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {yukleniyor && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {sonuclar.length > 0 && (
            <div className="mt-2 space-y-1 max-h-64 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
              {sonuclar.map(track => (
                <button key={track.id} onClick={() => sec(track)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left">
                  {track.image ? (
                    <img src={track.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-lg">🎵</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{track.name}</p>
                    <p className="text-xs text-gray-400 truncate">{track.artist} · {formatMs(track.duration_ms)}</p>
                  </div>
                  <SpotifyIcon />
                </button>
              ))}
            </div>
          )}

          {arama.length >= 2 && !yukleniyor && sonuclar.length === 0 && (
            <p className="mt-2 text-xs text-gray-400 text-center py-3">
              &ldquo;{arama}&rdquo; için sonuç bulunamadı
            </p>
          )}

          <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <SpotifyIcon /> Spotify üzerinden arama yapılır
          </p>
        </>
      )}
    </div>
  );
}

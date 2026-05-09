"use client";

import { useState } from "react";

interface Props {
  slug: string;
  spotifyAktif: boolean;
  playlistId: string | null;
  spotifyBagli: boolean;
  renk: string;
}

export default function SpotifyPlaylistKarti({ slug, spotifyAktif, playlistId, spotifyBagli, renk }: Props) {
  const [aktif, setAktif] = useState(spotifyAktif);
  const [pid, setPid] = useState<string | null>(playlistId);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const playlistUrl = pid ? `https://open.spotify.com/playlist/${pid}` : null;

  const olustur = async () => {
    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/spotify`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setHata(data.hata ?? "Hata oluştu."); return; }
      const newId = data.playlistUrl?.split("/playlist/")[1] ?? null;
      setPid(newId);
      setAktif(true);
    } catch {
      setHata("Bağlantı hatası.");
    } finally {
      setYukleniyor(false);
    }
  };

  const devreDisi = async () => {
    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/spotify`, { method: "DELETE" });
      if (!res.ok) { setHata("Hata oluştu."); return; }
      setAktif(false);
      setPid(null);
    } catch {
      setHata("Bağlantı hatası.");
    } finally {
      setYukleniyor(false);
    }
  };

  if (!spotifyBagli) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🎵</span>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Etkinlik Çalma Listesi</p>
        </div>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Davetlilerin şarkı önerilerini otomatik Spotify çalma listesine eklemek için Spotify hesabınızı bağlayın.
        </p>
        <a
          href="/dashboard/ayarlar"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1DB954" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Spotify Bağla
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🎵</span>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Etkinlik Çalma Listesi</p>
        {aktif && (
          <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#1DB954" }}>
            Aktif
          </span>
        )}
      </div>

      {aktif && playlistUrl ? (
        <div className="space-y-3">
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#1DB95420" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">Spotify'da Aç</p>
              <p className="text-xs text-gray-400 truncate">Çalma listesini görüntüle</p>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">↗</span>
          </a>

          <button
            onClick={devreDisi}
            disabled={yukleniyor}
            className="w-full py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {yukleniyor ? "İşleniyor..." : "Entegrasyonu Devre Dışı Bırak"}
          </button>
        </div>
      ) : aktif && !playlistUrl ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            Davetliler RSVP sırasında şarkı önerebilir. Öneriler otomatik Spotify çalma listesine eklenir.
          </p>
          <button
            onClick={olustur}
            disabled={yukleniyor}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#1DB954" }}
          >
            {yukleniyor ? "Oluşturuluyor..." : "Playlist Oluştur"}
          </button>
          <button
            onClick={devreDisi}
            disabled={yukleniyor}
            className="w-full py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Devre Dışı Bırak
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            Davetliler RSVP sırasında şarkı önerebilir. Öneriler otomatik Spotify çalma listesine eklenir.
          </p>
          <button
            onClick={olustur}
            disabled={yukleniyor}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#1DB954" }}
          >
            {yukleniyor ? "Oluşturuluyor..." : "Playlist Oluştur & Aktifleştir"}
          </button>
        </div>
      )}

      {hata && (
        <p className="mt-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{hata}</p>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { MUZIKLER, MUZIK_KATEGORILER, type Muzik } from "@/lib/muzikler";

interface Props {
  secili: string;
  onChange: (dosya: string) => void;
}

export default function MuzikSecici({ secili, onChange }: Props) {
  const [aktifKategori, setAktifKategori] = useState<Muzik["kategori"] | "hepsi">("hepsi");
  const [onizleme, setOnizleme] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filtrelenmis =
    aktifKategori === "hepsi"
      ? MUZIKLER
      : MUZIKLER.filter((m) => m.kategori === aktifKategori);

  const onizlemeyiToggle = (dosya: string) => {
    if (onizleme === dosya) {
      audioRef.current?.pause();
      setOnizleme(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(dosya);
    audio.volume = 0.6;
    audio.play().catch(() => {});
    audio.addEventListener("ended", () => setOnizleme(null));
    audioRef.current = audio;
    setOnizleme(dosya);
  };

  const sec = (dosya: string) => {
    audioRef.current?.pause();
    setOnizleme(null);
    onChange(secili === dosya ? "" : dosya);
  };

  return (
    <div>
      {/* Kategori filtreleri */}
      <div className="flex gap-2 flex-wrap mb-4">
        {(["hepsi", ...Object.keys(MUZIK_KATEGORILER)] as const).map((k) => (
          <button
            key={k}
            onClick={() => setAktifKategori(k)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              aktifKategori === k
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {k === "hepsi" ? "Hepsi" : MUZIK_KATEGORILER[k as Muzik["kategori"]]}
          </button>
        ))}
      </div>

      {/* Parça listesi */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {filtrelenmis.map((muzik) => {
          const secildi = secili === muzik.dosya;
          const dinleniyor = onizleme === muzik.dosya;

          return (
            <div
              key={muzik.id}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                secildi
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
              onClick={() => sec(muzik.dosya)}
            >
              {/* Önizleme butonu */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onizlemeyiToggle(muzik.dosya);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  dinleniyor ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                title={dinleniyor ? "Durdur" : "Dinle"}
              >
                {dinleniyor ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                )}
              </button>

              {/* Bilgi */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${secildi ? "text-purple-700" : "text-gray-800"}`}>
                  {muzik.isim}
                </p>
                <p className="text-xs text-gray-400">
                  {MUZIK_KATEGORILER[muzik.kategori]} · {muzik.sure}
                </p>
              </div>

              {/* Seçim işareti */}
              {secildi && (
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {secili && (
        <p className="mt-3 text-xs text-purple-600 font-medium">
          Seçili: {MUZIKLER.find((m) => m.dosya === secili)?.isim ?? secili}
        </p>
      )}
    </div>
  );
}

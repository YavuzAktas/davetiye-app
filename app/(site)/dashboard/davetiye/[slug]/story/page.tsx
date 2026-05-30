"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Stil = "romantik" | "luks" | "eglenceli" | "minimal" | "geleneksel";

const STILLER: { id: Stil; label: string; emoji: string; aciklama: string }[] = [
  { id: "romantik",   label: "Romantik",    emoji: "🌸", aciklama: "Pembe & mor tonlar" },
  { id: "luks",       label: "Lüks",        emoji: "✨", aciklama: "Siyah & altın" },
  { id: "eglenceli",  label: "Eğlenceli",   emoji: "🎉", aciklama: "Canlı renkler" },
  { id: "minimal",    label: "Minimal",     emoji: "◻️", aciklama: "Beyaz & sade" },
  { id: "geleneksel", label: "Geleneksel",  emoji: "🌾", aciklama: "Sıcak sarı tonlar" },
];

export default function StoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [aktifStil, setAktifStil] = useState<Stil>("romantik");
  const [gorselYukleniyor, setGorselYukleniyor] = useState(true);
  const [indiriliyor, setIndiriliyor] = useState(false);

  const gorselUrl = `/api/story?slug=${slug}&stil=${aktifStil}`;

  const indir = useCallback(async () => {
    setIndiriliyor(true);
    try {
      const res = await fetch(gorselUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `davetiye-story-${aktifStil}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIndiriliyor(false);
    }
  }, [gorselUrl, aktifStil]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white/90 border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link
            href={`/dashboard/davetiye/${slug}`}
            className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400">Sosyal Medya</p>
            <h1 className="text-base font-bold text-gray-900">Story & Durum Görseli</h1>
          </div>
          <button
            onClick={indir}
            disabled={indiriliyor || gorselYukleniyor}
            className="flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 shrink-0"
          >
            {indiriliyor
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            }
            İndir
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sol: Görsel önizleme */}
          <div className="w-full lg:w-auto lg:flex-shrink-0 flex flex-col items-center gap-4">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase self-start">Önizleme</p>

            {/* Aspect-ratio container for 9:16 story */}
            <div className="relative w-full max-w-[280px] sm:max-w-[320px]" style={{ aspectRatio: "9/16" }}>
              {gorselYukleniyor && (
                <div className="absolute inset-0 bg-gray-100 rounded-3xl flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={gorselUrl}
                src={gorselUrl}
                alt="Story görseli"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
                style={{ display: gorselYukleniyor ? "none" : "block" }}
                onLoad={() => setGorselYukleniyor(false)}
                onLoadStart={() => setGorselYukleniyor(true)}
              />
            </div>

            {/* Boyut etiketi */}
            <p className="text-xs text-gray-400 text-center">
              1080 × 1920 px · Instagram Story, Reels Kapağı, WhatsApp Durum
            </p>
          </div>

          {/* Sağ: Kontroller */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Stil seçici */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Stil</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STILLER.map(stil => (
                  <button
                    key={stil.id}
                    onClick={() => {
                      setAktifStil(stil.id);
                      setGorselYukleniyor(true);
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                      aktifStil === stil.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{stil.emoji}</span>
                    <div>
                      <p className={`text-sm font-semibold ${aktifStil === stil.id ? "text-gray-900" : "text-gray-700"}`}>
                        {stil.label}
                      </p>
                      <p className="text-xs text-gray-400">{stil.aciklama}</p>
                    </div>
                    {aktifStil === stil.id && (
                      <div className="ml-auto w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* İndirme & paylaşım */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-3">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Paylaş</p>

              <button
                onClick={indir}
                disabled={indiriliyor || gorselYukleniyor}
                className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group disabled:opacity-40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Story olarak indir</p>
                    <p className="text-xs text-gray-400">1080×1920 PNG · Instagram, TikTok, WhatsApp</p>
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">↓</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Davetiyemi görüntülemek için: /davetiye/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-[#25D366]/30 hover:bg-[#25D366]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">WhatsApp&apos;ta paylaş</p>
                    <p className="text-xs text-gray-400">Davetiye linkini gönder</p>
                  </div>
                </div>
                <span className="text-gray-300 group-hover:text-[#25D366] transition-colors text-sm">↗</span>
              </a>
            </div>

            {/* Kullanım ipuçları */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Nasıl kullanılır?</p>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Görseli indirip Instagram Story olarak paylaş",
                  "WhatsApp durumuna ekle — yakınlarının haber olsun",
                  "QR kodu okutanlar direkt davetiyene gider",
                  "Reels kapak görseli olarak da kullanabilirsin",
                ].map((ipucu, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-300 shrink-0 mt-0.5">·</span>
                    {ipucu}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Foto = { id: string; yukleyenAd: string; dosyaUrl: string; oylamaSayisi: number };
type Cift = [Foto, Foto];
type Faz = "yukleniyor" | "oyun" | "bitti";

const MADALYA = ["🥇", "🥈", "🥉"];

function karistir<T>(dizi: T[]): T[] {
  const k = [...dizi];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

function ciftler(fotolar: Foto[]): Cift[] {
  const k = karistir(fotolar);
  const sonuc: Cift[] = [];
  for (let i = 0; i + 1 < k.length; i += 2) sonuc.push([k[i], k[i + 1]]);
  return sonuc;
}

function oturumIdAl(): string {
  const ANAHTAR = "foto-oylama-oturum";
  const mevcut = localStorage.getItem(ANAHTAR);
  if (mevcut) return mevcut;
  const yeni = crypto.randomUUID();
  localStorage.setItem(ANAHTAR, yeni);
  return yeni;
}

export default function FotoSecimi({
  slug, baslik, baslangicFotolar,
}: {
  slug: string;
  baslik: string;
  baslangicFotolar: Foto[];
}) {
  const [faz, setFaz] = useState<Faz>("yukleniyor");
  const [tümCiftler, setTumCiftler] = useState<Cift[]>([]);
  const [siradaki, setSiradaki] = useState(0);
  const [tamamlanan, setTamamlanan] = useState(0);
  const [fotolar, setFotolar] = useState<Foto[]>(baslangicFotolar);
  const [secilen, setSecilen] = useState<string | null>(null);
  const [animasyon, setAnimasyon] = useState(false);
  const oturumRef = useRef<string>("");

  useEffect(() => {
    oturumRef.current = oturumIdAl();
    if (baslangicFotolar.length < 2) { setFaz("bitti"); return; }
    const c = ciftler(baslangicFotolar);
    setTumCiftler(c);
    setFaz("oyun");
  }, [baslangicFotolar]);

  const oy = useCallback(async (kazananId: string) => {
    if (animasyon || secilen) return;
    setSecilen(kazananId);
    setAnimasyon(true);

    // Optimistic: local sayacı artır
    setFotolar(prev =>
      prev.map(f => f.id === kazananId ? { ...f, oylamaSayisi: f.oylamaSayisi + 1 } : f)
    );

    fetch(`/api/davetiye/${slug}/foto-oylama`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kazananId, oturumId: oturumRef.current }),
    }).catch(() => {/* sessiz hata */});

    await new Promise(r => setTimeout(r, 600));

    setTamamlanan(t => t + 1);
    setSecilen(null);
    setAnimasyon(false);

    if (siradaki + 1 >= tümCiftler.length) {
      // Tüm çiftler bitti → leaderboard için güncel verileri çek
      fetch(`/api/davetiye/${slug}/foto-oylama`)
        .then(r => r.json())
        .then((d: Foto[]) => { if (Array.isArray(d)) setFotolar(d); })
        .catch(() => {})
        .finally(() => setFaz("bitti"));
    } else {
      setSiradaki(s => s + 1);
    }
  }, [animasyon, secilen, siradaki, tümCiftler.length, slug]);

  const sifirla = useCallback(() => {
    const c = ciftler(fotolar);
    setTumCiftler(c);
    setSiradaki(0);
    setTamamlanan(0);
    setFaz("oyun");
  }, [fotolar]);

  const lider = useMemo(
    () => [...fotolar].sort((a, b) => b.oylamaSayisi - a.oylamaSayisi).slice(0, 10),
    [fotolar],
  );

  if (faz === "yukleniyor") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/15 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const cifSayisi = tümCiftler.length;
  const ilerleme = cifSayisi > 0 ? Math.round((tamamlanan / cifSayisi) * 100) : 100;
  const mevcutCift = tümCiftler[siradaki];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col select-none">
      <style>{`
        @keyframes seçildi { 0%{transform:scale(1)} 40%{transform:scale(1.04)} 100%{transform:scale(1)} }
        @keyframes elendi  { 0%{opacity:1;transform:scale(1)} 100%{opacity:0.25;transform:scale(0.94)} }
        .foto-secildi { animation: seçildi 0.5s ease-out forwards; }
        .foto-elendi  { animation: elendi  0.5s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-4 bg-black/50 backdrop-blur-sm border-b border-white/8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/60">Foto Seçimi</p>
          <h1 className="text-lg font-black text-white leading-tight">{baslik}</h1>
        </div>
        <div className="flex items-center gap-3">
          {faz === "oyun" && (
            <span className="text-xs font-bold text-white/40 tabular-nums">
              {tamamlanan}/{cifSayisi}
            </span>
          )}
          <a href={`/davetiye/${slug}/canli-duvar`}
            className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/60 hover:border-white/30 hover:text-white/90 transition-colors">
            Canlı Duvar →
          </a>
        </div>
      </header>

      {/* Oyun alanı */}
      {faz === "oyun" && mevcutCift && (
        <div className="flex-1 flex flex-col">
          {/* Soru */}
          <div className="text-center pt-6 pb-4 px-4">
            <p className="text-2xl font-black text-white">Hangisi daha güzel?</p>
            <p className="mt-1 text-sm text-white/40">Beğendiğin fotoğrafa dokunarak oy ver</p>
          </div>

          {/* Kart çifti */}
          <div className="flex-1 grid grid-cols-2 gap-3 px-3 pb-3">
            {mevcutCift.map((foto, idx) => {
              const kazandi = secilen === foto.id;
              const elendi  = secilen !== null && secilen !== foto.id;
              return (
                <button
                  key={foto.id}
                  onClick={() => oy(foto.id)}
                  disabled={animasyon}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all focus:outline-none ${
                    kazandi ? "border-purple-400 foto-secildi" :
                    elendi  ? "border-transparent foto-elendi" :
                    "border-white/10 hover:border-white/30 active:scale-[0.98]"
                  }`}
                >
                  {/* Fotoğraf */}
                  <div className="relative w-full" style={{ paddingBottom: "133%" }}>
                    <Image
                      src={foto.dosyaUrl}
                      alt={foto.yukleyenAd}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 400px"
                      priority={idx === 0}
                    />
                  </div>

                  {/* Overlay: isim + oy butonu */}
                  <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="bg-linear-to-t from-black/80 via-black/20 to-transparent p-3 pt-8">
                      <p className="text-xs font-semibold text-white/80 truncate">{foto.yukleyenAd}</p>
                      <div className={`mt-2 rounded-xl py-2 text-xs font-black text-center transition-all ${
                        kazandi ? "bg-purple-500 text-white" : "bg-white/15 text-white"
                      }`}>
                        {kazandi ? "✓ Seçildi!" : idx === 0 ? "← Bu" : "Bu →"}
                      </div>
                    </div>
                  </div>

                  {/* VS rozetçiği ortada */}
                  {idx === 0 && !animasyon && (
                    <div className="pointer-events-none absolute inset-y-0 -right-4 flex items-center z-10">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 border border-white/15 text-[11px] font-black text-white/60">
                        VS
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* İlerleme */}
          <div className="shrink-0 px-5 pb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-white/30">{tamamlanan} karşılaşma tamamlandı</span>
              <span className="text-[11px] font-bold text-white/30">{cifSayisi - tamamlanan} kaldı</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${ilerleme}%` }}
              />
            </div>
            {tamamlanan > 0 && (
              <button onClick={() => setFaz("bitti")}
                className="mt-3 w-full rounded-xl border border-white/10 py-2 text-xs font-semibold text-white/40 hover:text-white/70 hover:border-white/20 transition-colors">
                Sıralamayı gör →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bitti → Sıralama */}
      {faz === "bitti" && (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <p className="text-4xl mb-2">🏆</p>
              <h2 className="text-2xl font-black text-white">En Beğenilen Fotoğraflar</h2>
              <p className="mt-1 text-sm text-white/40">
                {fotolar.length} fotoğrafın toplu sıralaması
              </p>
            </div>

            {lider.length === 0 ? (
              <div className="text-center text-white/30 py-12">
                <p className="text-5xl mb-3">📸</p>
                <p className="font-semibold">Henüz oy kullanılmadı</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lider.map((foto, i) => (
                  <div
                    key={foto.id}
                    className={`flex items-center gap-3 rounded-2xl p-3 ${
                      i === 0 ? "bg-amber-500/15 border border-amber-500/30" :
                      i === 1 ? "bg-white/8 border border-white/10" :
                      i === 2 ? "bg-white/6 border border-white/8" :
                      "bg-white/4 border border-white/5"
                    }`}
                  >
                    <span className="text-xl w-8 text-center shrink-0">
                      {MADALYA[i] ?? `${i + 1}`}
                    </span>
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      <Image src={foto.dosyaUrl} alt={foto.yukleyenAd} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-white">{foto.yukleyenAd}</p>
                      <p className="text-xs text-white/40">{foto.oylamaSayisi} oy</p>
                    </div>
                    {i < 3 && (
                      <div className={`shrink-0 rounded-xl px-2.5 py-1 text-[11px] font-black ${
                        i === 0 ? "bg-amber-500/30 text-amber-300" :
                        i === 1 ? "bg-white/15 text-white/70" :
                        "bg-white/10 text-white/50"
                      }`}>
                        #{i + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              {baslangicFotolar.length >= 2 && (
                <button
                  onClick={sifirla}
                  className="w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-900/40 hover:opacity-90 transition-opacity"
                >
                  Tekrar Oyna →
                </button>
              )}
              <a
                href={`/davetiye/${slug}/canli-duvar`}
                className="w-full rounded-2xl border border-white/15 py-3.5 text-center text-sm font-bold text-white/70 hover:border-white/30 hover:text-white transition-colors"
              >
                Canlı Duvara Bak
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Yeterli foto yoksa */}
      {faz === "bitti" && baslangicFotolar.length < 2 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-5xl">📸</span>
          <p className="text-lg font-black text-white">Yeterli fotoğraf yok</p>
          <p className="text-sm text-white/40">
            Oylama için en az 2 onaylı fotoğraf gerekli.
          </p>
          <a href={`/davetiye/${slug}`}
            className="mt-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-bold text-white/70 hover:text-white transition-colors">
            Geri Dön
          </a>
        </div>
      )}
    </div>
  );
}

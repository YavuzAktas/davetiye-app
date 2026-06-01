"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Foto {
  id: string;
  yukleyenAd: string;
  dosyaUrl: string;
  createdAt: string;
  oylamaSayisi?: number;
}

const MADALYA = ["🥇", "🥈", "🥉"];

interface Props {
  slug: string;
  baslik: string;
  tarihStr: string | null;
}

const YENILEME_MS = 12_000;

function useKolonSayisi() {
  const [kolon, setKolon] = useState(2);
  useEffect(() => {
    const guncelle = () => {
      const w = window.innerWidth;
      setKolon(w < 500 ? 2 : w < 768 ? 3 : w < 1280 ? 4 : 5);
    };
    guncelle();
    window.addEventListener("resize", guncelle);
    return () => window.removeEventListener("resize", guncelle);
  }, []);
  return kolon;
}

export default function CanliDuvarGorunumu({ slug, baslik, tarihStr }: Props) {
  const [fotolar, setFotolar] = useState<Foto[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yeniIds, setYeniIds] = useState<Set<string>>(new Set());
  const [saat, setSaat] = useState("");
  const kolonSayisi = useKolonSayisi();
  const baslikRef = useRef<HTMLHeadingElement>(null);

  const getir = useCallback(async (mevcutIds?: Set<string>) => {
    try {
      const res = await fetch(`/api/davetiye/${slug}/album`, { cache: "no-store" });
      if (!res.ok) return undefined;
      const data: Foto[] = await res.json();

      if (mevcutIds && mevcutIds.size > 0) {
        const gelen = new Set(data.filter(f => !mevcutIds.has(f.id)).map(f => f.id));
        if (gelen.size > 0) {
          setYeniIds(gelen);
          setTimeout(() => setYeniIds(new Set()), 3500);
        }
      }

      setFotolar(data);
      setYukleniyor(false);
      return new Set(data.map(f => f.id));
    } catch {
      setYukleniyor(false);
      return undefined;
    }
  }, [slug]);

  useEffect(() => {
    let mevcutIds: Set<string> | undefined;
    getir().then(ids => { mevcutIds = ids; });

    const iv = setInterval(async () => {
      mevcutIds = await getir(mevcutIds);
    }, YENILEME_MS);

    return () => clearInterval(iv);
  }, [getir]);

  useEffect(() => {
    const tick = () =>
      setSaat(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="h-dvh bg-gray-950 text-white flex flex-col select-none overflow-hidden">
      <style>{`
        @keyframes cdFadeIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cd-yeni { animation: cdFadeIn 0.5s ease-out forwards; }
      `}</style>

      {/* ── Üst bar ── */}
      <header className="shrink-0 flex items-center gap-2 px-3 py-2.5 sm:px-6 sm:py-3 bg-black/60 backdrop-blur-sm border-b border-white/8">
        {/* Sol: başlık */}
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-purple-400/60 leading-none mb-0.5 hidden sm:block">
            Canlı Fotoğraf Duvarı
          </p>
          <h1
            ref={baslikRef}
            className="text-sm sm:text-xl font-black text-white leading-tight truncate"
          >
            {baslik}
          </h1>
          {tarihStr && (
            <p className="text-[10px] text-white/35 leading-none mt-0.5 hidden sm:block">{tarihStr}</p>
          )}
        </div>

        {/* Orta: foto sayısı */}
        {fotolar.length > 0 && (
          <div className="shrink-0 flex items-baseline gap-1">
            <span className="text-lg sm:text-2xl font-black tabular-nums text-white leading-none">
              {fotolar.length}
            </span>
            <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-wider">foto</span>
          </div>
        )}

        {/* Sağ: rozetler */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-3">
          <a
            href={`/davetiye/${slug}/foto-secimi`}
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] sm:text-xs font-black transition-colors"
            style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", color: "#c084fc" }}
          >
            ⚔️ <span className="sm:hidden">Düello</span>
            <span className="hidden sm:inline">Foto Düellosu</span>
          </a>

          <div className="flex items-center gap-1.5 rounded-full px-2 py-1.5"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-black text-red-400 tracking-widest">CANLI</span>
          </div>

          <p className="text-sm font-mono font-bold text-white/40 tabular-nums hidden sm:block">{saat}</p>
        </div>
      </header>

      {/* ── İçerik ── */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        {yukleniyor ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 min-h-[50vh]">
            <div className="w-8 h-8 border-2 border-white/15 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white/30 text-sm">Fotoğraflar yükleniyor…</p>
          </div>
        ) : fotolar.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 min-h-[50vh]">
            <span className="text-5xl">📸</span>
            <p className="text-white/40 text-base font-semibold">Henüz fotoğraf yok</p>
            <p className="text-white/20 text-xs text-center px-8">Misafirler davetiye sayfasından fotoğraf yükleyebilir</p>
          </div>
        ) : (
          <div style={{ columns: kolonSayisi, columnGap: 6 }}>
            {fotolar.map(foto => {
              const sira = fotolar.findIndex(f => f.id === foto.id);
              const madalya = MADALYA[sira];
              const oyVar = (foto.oylamaSayisi ?? 0) > 0;
              return (
                <div
                  key={foto.id}
                  className={yeniIds.has(foto.id) ? "cd-yeni" : ""}
                  style={{
                    breakInside: "avoid",
                    marginBottom: 6,
                    borderRadius: 8,
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: yeniIds.has(foto.id)
                      ? "0 0 0 2px #7C3AED, 0 8px 24px rgba(124,58,237,0.5)"
                      : "0 2px 8px rgba(0,0,0,0.5)",
                    transition: "box-shadow 0.4s",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.dosyaUrl}
                    alt={foto.yukleyenAd}
                    loading="lazy"
                    style={{ width: "100%", display: "block", maxHeight: "60vh", objectFit: "cover" }}
                  />

                  {/* Madalya rozeti */}
                  {madalya && oyVar && (
                    <div style={{
                      position: "absolute", top: 5, right: 5,
                      background: sira === 0 ? "rgba(234,179,8,0.92)" : "rgba(0,0,0,0.7)",
                      borderRadius: 6, padding: "2px 6px",
                      display: "flex", alignItems: "center", gap: 3,
                    }}>
                      <span style={{ fontSize: 12 }}>{madalya}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>
                        {foto.oylamaSayisi}
                      </span>
                    </div>
                  )}

                  {/* İsim overlay */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "16px 8px 6px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {foto.yukleyenAd}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Alt bilgi ── */}
      <footer className="shrink-0 flex items-center justify-between px-4 py-2 bg-black/40 border-t border-white/6">
        <p className="text-[10px] text-white/20">
          {YENILEME_MS / 1000}s&apos;de bir yenilenir
        </p>
        <p className="text-[10px] text-white/20 hidden sm:block">
          Fotoğraf yüklemek için davetiyeyi açın
        </p>
        <p className="text-[10px] text-white/30 font-mono sm:hidden">{saat}</p>
      </footer>
    </div>
  );
}

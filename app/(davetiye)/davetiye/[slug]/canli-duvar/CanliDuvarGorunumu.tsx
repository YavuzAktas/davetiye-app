"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function CanliDuvarGorunumu({ slug, baslik, tarihStr }: Props) {
  const [fotolar, setFotolar] = useState<Foto[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yeniIds, setYeniIds] = useState<Set<string>>(new Set());
  const [saat, setSaat] = useState("");

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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col select-none">
      <style>{`
        @keyframes cdFadeIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cd-yeni { animation: cdFadeIn 0.5s ease-out forwards; }
      `}</style>

      {/* ── Üst bar ── */}
      <header className="shrink-0 flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-sm border-b border-white/8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/60 mb-0.5">
            Canlı Fotoğraf Duvarı
          </p>
          <h1 className="text-2xl font-black text-white leading-tight">{baslik}</h1>
          {tarihStr && <p className="text-xs text-white/35 mt-0.5">{tarihStr}</p>}
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {fotolar.length > 0 && (
            <div className="text-right">
              <p className="text-3xl font-black tabular-nums text-white leading-none">{fotolar.length}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">fotoğraf</p>
            </div>
          )}
          <a
            href={`/davetiye/${slug}/foto-secimi`}
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black transition-colors"
            style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.35)", color: "#c084fc" }}
          >
            🏆 Oy Ver
          </a>

          <div className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)" }}>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="text-xs font-black text-red-400 tracking-widest">CANLI</span>
          </div>

          <p className="text-xl font-mono font-bold text-white/50 tabular-nums">{saat}</p>
        </div>
      </header>

      {/* ── İçerik ── */}
      <div className="flex-1 overflow-y-auto p-5">
        {yukleniyor ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 min-h-[60vh]">
            <div className="w-10 h-10 border-2 border-white/15 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white/30 text-sm">Fotoğraflar yükleniyor…</p>
          </div>
        ) : fotolar.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 min-h-[60vh]">
            <span className="text-6xl">📸</span>
            <p className="text-white/40 text-lg font-semibold">Henüz fotoğraf yok</p>
            <p className="text-white/20 text-sm">Misafirler davetiye sayfasından fotoğraf yükleyebilir</p>
          </div>
        ) : (
          <div style={{ columns: "5 200px", columnGap: 12 }}>
            {fotolar.map(foto => (
              <div
                key={foto.id}
                className={yeniIds.has(foto.id) ? "cd-yeni" : ""}
                style={{
                  breakInside: "avoid",
                  marginBottom: 12,
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: yeniIds.has(foto.id)
                    ? "0 0 0 3px #7C3AED, 0 12px 40px rgba(124,58,237,0.45)"
                    : "0 4px 20px rgba(0,0,0,0.55)",
                  transition: "box-shadow 0.4s",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto.dosyaUrl}
                  alt={foto.yukleyenAd}
                  loading="lazy"
                  style={{ width: "100%", display: "block" }}
                />
                {/* Madalya rozeti — ilk 3 fotoğraf (oylamaSayisi sıralamasına göre) */}
                {(() => {
                  const sira = fotolar.findIndex(f => f.id === foto.id);
                  const madalya = MADALYA[sira];
                  const oyVar = (foto.oylamaSayisi ?? 0) > 0;
                  if (!madalya || !oyVar) return null;
                  return (
                    <div style={{
                      position: "absolute", top: 8, right: 8,
                      background: sira === 0 ? "rgba(234,179,8,0.9)" : "rgba(0,0,0,0.65)",
                      borderRadius: 8, padding: "3px 7px",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <span style={{ fontSize: 14 }}>{madalya}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>
                        {foto.oylamaSayisi}
                      </span>
                    </div>
                  );
                })()}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "20px 10px 8px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)",
                }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                    {foto.yukleyenAd}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Alt bilgi şeridi ── */}
      <footer className="shrink-0 flex items-center justify-between px-8 py-2.5 bg-black/40 border-t border-white/6">
        <p className="text-[11px] text-white/20">
          bekleriz.com · {YENILEME_MS / 1000} saniyede bir yenilenir
        </p>
        <p className="text-[11px] text-white/20">
          Fotoğraf yüklemek için davetiyeyi açın
        </p>
      </footer>
    </div>
  );
}

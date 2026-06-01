"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Foto = { id: string; yukleyenAd: string; dosyaUrl: string; oylamaSayisi: number };
type Faz = "bekle" | "mac" | "sampiyonluk" | "siralama" | "yetersiz";

/* ── Turnuva state ─────────────────────────────────── */
type Turnuva = {
  kuyruk:     Foto[];
  kazananlar: Foto[];
  turNo:      number;
  toplam:     number;
};

function karistir<T>(d: T[]): T[] {
  const k = [...d];
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  return k;
}

function turBaslat(fotolar: Foto[]): Turnuva {
  return { kuyruk: karistir(fotolar), kazananlar: [], turNo: 1, toplam: fotolar.length };
}

function secimYap(t: Turnuva, kazanan: Foto): { sonrakiTurnuva: Turnuva; sampiyonMu: boolean } {
  const yeniKuyruk     = t.kuyruk.slice(2);
  const yeniKazananlar = [...t.kazananlar, kazanan];

  const byeVar        = yeniKuyruk.length === 1;
  const tumKazananlar = byeVar ? [...yeniKazananlar, yeniKuyruk[0]] : yeniKazananlar;
  const bitisKuyrugu  = byeVar ? [] : yeniKuyruk;
  const turBitti      = bitisKuyrugu.length === 0;

  if (turBitti) {
    if (tumKazananlar.length === 1) {
      return { sonrakiTurnuva: { ...t, kuyruk: [], kazananlar: tumKazananlar }, sampiyonMu: true };
    }
    return {
      sonrakiTurnuva: { kuyruk: karistir(tumKazananlar), kazananlar: [], turNo: t.turNo + 1, toplam: t.toplam },
      sampiyonMu: false,
    };
  }

  return {
    sonrakiTurnuva: { ...t, kuyruk: bitisKuyrugu, kazananlar: yeniKazananlar },
    sampiyonMu: false,
  };
}

function toplamTur(n: number): number { return n <= 1 ? 1 : Math.ceil(Math.log2(n)); }
function turMacSayisi(kuyrukBaslangic: number): number { return Math.floor(kuyrukBaslangic / 2); }

function oturumIdAl(): string {
  const KEY = "foto-oylama-oturum";
  const v = localStorage.getItem(KEY);
  if (v) return v;
  const u = crypto.randomUUID();
  localStorage.setItem(KEY, u);
  return u;
}

const MADALYA = ["🥇", "🥈", "🥉"];

/* ──────────────────────────────────────────────────── */

export default function FotoSecimi({
  slug, baslik, baslangicFotolar,
}: {
  slug: string;
  baslik: string;
  baslangicFotolar: Foto[];
}) {
  const [faz, setFaz]           = useState<Faz>("bekle");
  const [turnuva, setTurnuva]   = useState<Turnuva | null>(null);
  const [liderFotolar, setLiderFotolar] = useState<Foto[]>([]);
  const [secilen, setSecilen]   = useState<string | null>(null);
  const [animasyon, setAnimasyon]         = useState(false);
  const [siralamaYukleniyor, setSiralamaYukleniyor] = useState(false);
  const turBaslangicRef = useRef<number>(0);
  const oturumRef       = useRef<string>("");
  const oncekiFazRef    = useRef<Faz>("bekle");

  /* Mount: oturum + ilk sıralama fetch, bekle ekranında kal */
  useEffect(() => {
    oturumRef.current = oturumIdAl();
    if (baslangicFotolar.length < 2) { setFaz("yetersiz"); return; }
    fetch(`/api/davetiye/${slug}/foto-oylama`, { cache: "no-store" })
      .then(r => r.json())
      .then((d: Foto[]) => { if (Array.isArray(d)) setLiderFotolar(d); })
      .catch(() => {});
  }, [baslangicFotolar, slug]);

  const siralamayiGetir = useCallback(async () => {
    try {
      const r = await fetch(`/api/davetiye/${slug}/foto-oylama`, { cache: "no-store" });
      const d: Foto[] = await r.json();
      if (Array.isArray(d)) setLiderFotolar(d);
    } catch {}
  }, [slug]);

  const siralamayiGor = useCallback(async (gelenFaz: Faz) => {
    setSiralamaYukleniyor(true);
    oncekiFazRef.current = gelenFaz;
    await siralamayiGetir();
    setSiralamaYukleniyor(false);
    setFaz("siralama");
  }, [siralamayiGetir]);

  const turnuvayiBaslat = useCallback(() => {
    const t = turBaslat(baslangicFotolar);
    turBaslangicRef.current = t.kuyruk.length;
    setTurnuva(t);
    setFaz("mac");
  }, [baslangicFotolar]);

  const sec = useCallback(async (kazanan: Foto) => {
    if (animasyon || secilen || !turnuva) return;
    setSecilen(kazanan.id);
    setAnimasyon(true);
    await new Promise(r => setTimeout(r, 580));
    setSecilen(null);
    setAnimasyon(false);

    const { sonrakiTurnuva, sampiyonMu } = secimYap(turnuva, kazanan);

    if (sampiyonMu) {
      const sampiyon = sonrakiTurnuva.kazananlar[0];
      setTurnuva(sonrakiTurnuva);
      setFaz("sampiyonluk");
      // Önce oyu gönder, sonra güncel sıralamayı çek (race condition yok)
      try {
        await fetch(`/api/davetiye/${slug}/foto-oylama`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kazananId: sampiyon.id, oturumId: oturumRef.current }),
        });
      } catch {}
      await siralamayiGetir();
    } else {
      if (sonrakiTurnuva.turNo !== turnuva.turNo) {
        turBaslangicRef.current = sonrakiTurnuva.kuyruk.length;
      }
      setTurnuva(sonrakiTurnuva);
    }
  }, [animasyon, secilen, turnuva, slug, siralamayiGetir]);

  /* ── Hesaplamalar ─────────────────────────────── */
  const aktifCift = turnuva && turnuva.kuyruk.length >= 2
    ? [turnuva.kuyruk[0], turnuva.kuyruk[1]] as const
    : null;

  const macNo     = turnuva ? turnuva.kazananlar.length + 1 : 0;
  const macSayisi = turMacSayisi(turBaslangicRef.current);
  const turSayisi = toplamTur(baslangicFotolar.length);
  const sampiyon  = faz === "sampiyonluk" && turnuva ? turnuva.kazananlar[0] : null;

  const lider = useMemo(
    () => [...liderFotolar].sort((a, b) => b.oylamaSayisi - a.oylamaSayisi).slice(0, 10),
    [liderFotolar],
  );

  const kalanFoto = turnuva
    ? turnuva.kuyruk.length + turnuva.kazananlar.length
    : baslangicFotolar.length;

  /* ── Render ───────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col select-none overflow-hidden">
      <style>{`
        @keyframes secildi { 0%{transform:scale(1)} 40%{transform:scale(1.05)} 100%{transform:scale(1)} }
        @keyframes elendi  { 0%{opacity:1;filter:grayscale(0);transform:scale(1)} 100%{opacity:.15;filter:grayscale(1);transform:scale(.93)} }
        @keyframes konfeti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(80px) rotate(720deg);opacity:0} }
        .foto-secildi { animation:secildi .55s cubic-bezier(.34,1.56,.64,1) forwards; }
        .foto-elendi  { animation:elendi  .55s ease-out forwards; }
        .konfeti-parcasi { animation:konfeti 1.2s ease-in forwards; }
      `}</style>

      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-4 bg-black/50 backdrop-blur-sm border-b border-white/8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/60">Foto Düellosu</p>
          <h1 className="text-lg font-black text-white leading-tight">{baslik}</h1>
        </div>
        <div className="flex items-center gap-3">
          {faz === "mac" && turnuva && (
            <div className="text-right">
              <p className="text-xs font-black text-white/60">Tur {turnuva.turNo}/{turSayisi}</p>
              <p className="text-[10px] text-white/30">{kalanFoto} foto kaldı</p>
            </div>
          )}
          <a
            href={`/davetiye/${slug}/canli-duvar`}
            className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/60 hover:border-white/30 hover:text-white/90 transition-colors"
          >
            Canlı Duvar →
          </a>
        </div>
      </header>

      {/* ── GİRİŞ EKRANI ──────────────────────────── */}
      {faz === "bekle" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div>
            <p className="text-6xl mb-4">⚔️</p>
            <h2 className="text-2xl font-black text-white mb-2">Foto Düellosu</h2>
            <p className="text-sm text-white/50 max-w-xs mx-auto">
              İki fotoğraf karşı karşıya — favoriyi seç, diğeri elenir. Son kalan şampiyon!
            </p>
          </div>
          <div className="w-full max-w-xs flex flex-col gap-3">
            <button
              onClick={turnuvayiBaslat}
              className="w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 py-4 text-base font-black text-white shadow-lg shadow-purple-900/40 hover:opacity-90 transition-opacity"
            >
              ⚔️ Düelloyu Başlat
            </button>
            <button
              onClick={() => siralamayiGor("bekle")}
              disabled={siralamaYukleniyor}
              className="w-full rounded-2xl border border-white/15 py-3.5 text-sm font-bold text-white/60 hover:border-white/30 hover:text-white transition-colors disabled:opacity-40"
            >
              {siralamaYukleniyor ? "Yükleniyor…" : "🏆 Güncel Sıralama"}
            </button>
          </div>
          <p className="text-xs text-white/20">{baslangicFotolar.length} fotoğraf yarışıyor</p>
        </div>
      )}

      {/* ── MAÇ EKRANI ────────────────────────────── */}
      {faz === "mac" && aktifCift && (
        <div className="flex-1 flex flex-col">
          {/* Tur rozeti */}
          <div className="text-center pt-5 pb-3 px-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Tur {turnuva!.turNo}
              </span>
              {macSayisi > 0 && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-[10px] font-bold text-white/40">Maç {macNo}/{macSayisi}</span>
                </>
              )}
            </div>
            <p className="text-xl font-black text-white">Hangisini elemeyelim?</p>
            <p className="mt-1 text-xs text-white/40">Favori fotoğrafını seç — diğeri elenir</p>
          </div>

          {/* Fotoğraf çifti */}
          <div className="flex-1 grid grid-cols-2 gap-2 px-3 pb-2" style={{ minHeight: 0 }}>
            {aktifCift.map((foto, idx) => {
              const kazandi = secilen === foto.id;
              const elendi  = secilen !== null && secilen !== foto.id;
              return (
                <button
                  key={foto.id}
                  onClick={() => sec(foto)}
                  disabled={animasyon}
                  className={`relative overflow-hidden rounded-2xl border-2 focus:outline-none transition-colors ${
                    kazandi ? "border-emerald-400 foto-secildi" :
                    elendi  ? "border-red-500/60 foto-elendi" :
                    "border-white/10 hover:border-white/30 active:scale-[0.98]"
                  }`}
                >
                  <div className="relative w-full" style={{ paddingBottom: "125%" }}>
                    <Image
                      src={foto.dosyaUrl}
                      alt={foto.yukleyenAd}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 400px"
                      priority={idx === 0}
                    />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
                    <div className="bg-linear-to-t from-black/85 via-black/20 to-transparent p-3 pt-10">
                      <p className="text-xs font-semibold text-white/80 truncate leading-tight">{foto.yukleyenAd}</p>
                      <div className={`mt-2 rounded-xl py-2 text-xs font-black text-center transition-all ${
                        kazandi ? "bg-emerald-500 text-white" :
                        elendi  ? "bg-red-500/70 text-white" :
                        "bg-white/15 text-white"
                      }`}>
                        {kazandi ? "✓ Devam ediyor" : elendi ? "✗ Elendi" : idx === 0 ? "← Bunu seç" : "Bunu seç →"}
                      </div>
                    </div>
                  </div>

                  {idx === 0 && !animasyon && (
                    <div className="pointer-events-none absolute inset-y-0 -right-4 z-10 flex items-center">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 border border-white/15 text-[11px] font-black text-white/50">
                        VS
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tur ilerleme */}
          <div className="shrink-0 px-4 py-3">
            {macSayisi > 0 && (
              <div className="h-1 rounded-full bg-white/8 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.round(((macNo - 1) / macSayisi) * 100)}%` }}
                />
              </div>
            )}
            <div className="flex justify-center gap-1.5">
              {Array.from({ length: turSayisi }).map((_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${
                    i + 1 < turnuva!.turNo  ? "w-8 bg-emerald-500" :
                    i + 1 === turnuva!.turNo ? "w-8 bg-purple-500 animate-pulse" :
                    "w-4 bg-white/10"
                  }`} />
                  {i < turSayisi - 1 && <span className="text-white/20 text-[9px]">→</span>}
                </div>
              ))}
              <span className="ml-1 text-[11px]">🏆</span>
            </div>
          </div>
        </div>
      )}

      {/* ── ŞAMPİYON EKRANI ───────────────────────── */}
      {faz === "sampiyonluk" && sampiyon && (
        <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
          <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="konfeti-parcasi absolute"
                style={{
                  left: `${5 + (i * 5.5) % 92}%`,
                  top: "-10px",
                  animationDelay: `${(i * 0.07).toFixed(2)}s`,
                  animationDuration: `${1.1 + (i % 5) * 0.18}s`,
                  width: 8, height: 8,
                  borderRadius: i % 3 === 0 ? "50%" : 2,
                  background: ["#a855f7","#ec4899","#f59e0b","#10b981","#3b82f6"][i % 5],
                }}
              />
            ))}
          </div>

          <div className="w-full max-w-sm px-4 pt-8 pb-6">
            <div className="text-center mb-6">
              <p className="text-5xl mb-3">🏆</p>
              <h2 className="text-2xl font-black text-white">Senin Favorin!</h2>
              <p className="mt-1 text-sm text-white/50">Tüm rakiplerini geride bıraktı</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/60 shadow-2xl shadow-amber-900/40 mb-6">
              <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                <Image src={sampiyon.dosyaUrl} alt={sampiyon.yukleyenAd} fill className="object-cover" sizes="400px" priority />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2 rounded-xl bg-amber-500/90 px-3 py-1.5">
                <span className="text-base">🥇</span>
                <span className="text-xs font-black text-white">Şampiyonun</span>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-sm font-bold text-white">{sampiyon.yukleyenAd}</p>
              </div>
            </div>

            <button
              onClick={() => siralamayiGor("sampiyonluk")}
              disabled={siralamaYukleniyor}
              className="w-full rounded-2xl border border-white/15 py-3 text-sm font-bold text-white/60 hover:border-white/30 hover:text-white transition-colors mb-3 disabled:opacity-40"
            >
              {siralamaYukleniyor ? "Yükleniyor…" : "Tüm sıralamayı gör →"}
            </button>

            <button
              onClick={turnuvayiBaslat}
              className="w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-900/40 hover:opacity-90 transition-opacity"
            >
              ⚔️ Tekrar Oyna
            </button>
          </div>
        </div>
      )}

      {/* ── SIRALAMA EKRANI ───────────────────────── */}
      {faz === "siralama" && (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setFaz(oncekiFazRef.current)}
              className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-semibold mb-4 transition-colors"
            >
              ← Geri
            </button>
            <h2 className="text-xl font-black text-white mb-4">🏆 Genel Sıralama</h2>

            {lider.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-white/40 text-sm">Henüz oy kullanılmamış</p>
                <p className="text-white/20 text-xs mt-1">İlk oylayan sen ol!</p>
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
                      {MADALYA[i] ?? <span className="text-sm font-black text-white/30">{i + 1}</span>}
                    </span>
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      <Image src={foto.dosyaUrl} alt={foto.yukleyenAd} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-white">{foto.yukleyenAd}</p>
                      <p className="text-xs text-white/40">{foto.oylamaSayisi} oy</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={turnuvayiBaslat}
              className="mt-6 w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-black text-white hover:opacity-90 transition-opacity"
            >
              ⚔️ Düelloya Katıl
            </button>
          </div>
        </div>
      )}

      {/* ── YETERSİZ FOTO ─────────────────────────── */}
      {faz === "yetersiz" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-5xl">📸</span>
          <p className="text-lg font-black text-white">Yeterli fotoğraf yok</p>
          <p className="text-sm text-white/40">Turnuva için en az 2 onaylı fotoğraf gerekli.</p>
          <a
            href={`/davetiye/${slug}`}
            className="mt-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-bold text-white/70 hover:text-white transition-colors"
          >
            Geri Dön
          </a>
        </div>
      )}
    </div>
  );
}

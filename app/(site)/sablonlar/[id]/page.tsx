"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { SABLONLAR, Sablon } from "@/lib/sablonlar";
import {
  DEMO_URLS, PREMIUM, KAT_EMOJI,
  SABLON_ETIKETLER, ETIKET_STILI,
  PREMIUM_OZELLIKLER, STD_OZELLIK_LISTESI,
} from "@/lib/sablon-meta";
import { saveSablonSecimi } from "@/components/SablonGeriDonusBanner";

/* ── Telefon Mockup ── */
function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 260 }}>
      <div className="relative overflow-hidden"
        style={{ background: "#1a1a1a", padding: "14px 10px", borderRadius: 38,
          boxShadow: "0 0 0 1px #333,0 30px 80px rgba(0,0,0,0.55),inset 0 0 0 1px #444" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width: 80, height: 26, background: "#1a1a1a", borderRadius: "0 0 16px 16px" }} />
        <div style={{ borderRadius: 24, overflow: "hidden", height: 500, background: "#000" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Standart kapak önizleme ── */
function StdKapak({ sablon }: { sablon: Sablon }) {
  const r = sablon.renk;
  const emoji = KAT_EMOJI[sablon.kategori] ?? "✨";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(145deg,#fff 0%,${r}12 100%)` }}>
      <div className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(circle,${r}14 1px,transparent 1px)`, backgroundSize: "20px 20px" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: r }} />
      <div style={{ position: "absolute", inset: 16, border: `1px solid ${r}20`, borderRadius: 4 }} />
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
        <span style={{ fontSize: 42 }}>{emoji}</span>
        <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "1.8rem", color: "#1a1a1a", lineHeight: 1.15 }}>
          Ad <span style={{ color: r }}>&amp;</span> Soyad
        </p>
        <div style={{ width: 44, height: 1.5, background: r, borderRadius: 2 }} />
        <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 12, letterSpacing: "0.14em", color: "#999" }}>GÜN · AY · YIL</p>
        <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 12, color: "#bbb" }}>Mekan Adı</p>
        <div style={{ padding: "5px 18px", borderRadius: 20, border: `1px solid ${r}35`, color: r, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em" }}>
          {sablon.isim}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DETAY SAYFASI
══════════════════════════════════════════════ */
export default function SablonDetaySayfasi() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const sablon     = SABLONLAR.find(s => s.id === id);
  const isPremium  = PREMIUM.has(id);
  const demoUrl    = DEMO_URLS[id];
  const etiketler  = SABLON_ETIKETLER[id] ?? [];
  const ozellikler = PREMIUM_OZELLIKLER[id] ?? null;

  if (!sablon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="font-semibold text-gray-500 mb-4">Şablon bulunamadı</p>
          <Link href="/sablonlar" className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
            ← Şablonlara dön
          </Link>
        </div>
      </div>
    );
  }

  const r     = sablon.renk;
  const emoji = KAT_EMOJI[sablon.kategori] ?? "✨";

  /* iframe ölçekleme (240×500 hedef, 390 render genişliği) */
  const PHONE_W   = 240;
  const PHONE_H   = 500;
  const RENDER_W  = 390;
  const iScale    = PHONE_W / RENDER_W;
  const iH        = Math.round(PHONE_H / iScale);
  const iMR       = Math.round(RENDER_W * (1 - iScale));
  const iMB       = Math.round(iH * (1 - iScale));

  const goldGradient = "linear-gradient(135deg,#BF953F 0%,#FCF6BA 25%,#B38728 50%,#FBF5B7 75%,#AA771C 100%)";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm min-w-0">
            <Link
              href="/sablonlar"
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors font-medium shrink-0"
            >
              <ArrowLeft size={14} />
              Şablonlar
            </Link>
            <span className="text-gray-300 shrink-0">›</span>
            <span className="text-gray-800 font-semibold truncate">{sablon.isim}</span>
          </div>
          {isPremium && (
            <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full shrink-0 ml-3"
              style={{ background: "linear-gradient(135deg,#fef9e7,#fef3c7)", color: "#a16207", border: "1px solid #fde68a" }}>
              ✦ PREMIUM
            </span>
          )}
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Sol: Telefon Mockup */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center lg:sticky lg:top-32">
            <div style={{ transform: "scale(1.12)", transformOrigin: "top center", marginBottom: 24 }}>
              <TelefonMockup>
                {isPremium && demoUrl ? (
                  <iframe
                    src={demoUrl}
                    title={sablon.isim}
                    allow="autoplay"
                    style={{
                      display:         "block",
                      width:           RENDER_W,
                      height:          iH,
                      border:          "none",
                      transform:       `scale(${iScale})`,
                      transformOrigin: "0 0",
                      marginRight:     `-${iMR}px`,
                      marginBottom:    `-${iMB}px`,
                    }}
                  />
                ) : (
                  <StdKapak sablon={sablon} />
                )}
              </TelefonMockup>
            </div>
          </div>

          {/* Sağ: Bilgiler */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Kategori + Etiketler */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold tracking-wide px-3 py-1 rounded-full"
                style={{ background: `${r}12`, color: r, border: `1px solid ${r}28` }}>
                {emoji} {sablon.kategori.charAt(0).toUpperCase() + sablon.kategori.slice(1)}
              </span>
              {etiketler.map(etiket => {
                const s = ETIKET_STILI[etiket];
                return (
                  <span key={etiket} className="text-xs font-bold tracking-wide px-3 py-1 rounded-full"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    {etiket}
                  </span>
                );
              })}
            </div>

            {/* Şablon Adı */}
            <div>
              <h1 className="font-bold text-gray-900 leading-tight mb-2"
                style={{ fontFamily: "var(--font-cormorant),serif", fontSize: "clamp(2rem,4vw,3rem)" }}>
                {sablon.isim}
              </h1>
              {sablon.aciklama && (
                <p className="text-gray-500 text-base leading-relaxed">{sablon.aciklama}</p>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Özellikler */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-gray-400 mb-4">
                {isPremium ? "Bu Şablona Özel Özellikler" : "Tüm Şablonlarda Dahil"}
              </p>

              {isPremium && ozellikler ? (
                <div className="space-y-2">
                  {ozellikler.map(oz => (
                    <motion.div
                      key={oz.baslik}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                    >
                      <span className="text-lg shrink-0 leading-none">{oz.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{oz.baslik}</p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{oz.aciklama}</p>
                      </div>
                      <Check size={14} strokeWidth={2.5} className="text-green-500 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STD_OZELLIK_LISTESI.map(oz => (
                    <div key={oz.baslik}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-gray-100">
                      <span className="text-base shrink-0 leading-none mt-0.5">{oz.ikon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800">{oz.baslik}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{oz.aciklama}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fiyat Kartı */}
            <div className="rounded-2xl border p-5"
              style={{
                background: isPremium
                  ? "linear-gradient(135deg,#1a1200 0%,#2a1f00 100%)"
                  : "#ffffff",
                border: isPremium ? "1px solid rgba(212,170,112,0.2)" : "1px solid #f0f0f0",
              }}>
              {isPremium ? (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Temel pakete ek ücret</p>
                    <p className="text-3xl font-bold tabular-nums"
                      style={{ background: goldGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      +₺100
                    </p>
                    <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>Tek seferlik · Ömür boyu geçerli</p>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full shrink-0"
                    style={{ background: "rgba(212,170,112,0.12)", color: "#D4AA70", border: "1px solid rgba(212,170,112,0.25)" }}>
                    ✦ PREMIUM
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Davetiye paketine dahil</p>
                    <p className="text-xl font-bold text-gray-900">Ek ücret yok</p>
                    <p className="text-xs text-gray-400 mt-1">Seçilen pakette geçerlidir</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                    <Check size={18} strokeWidth={2.5} className="text-green-500" />
                  </div>
                </div>
              )}
            </div>

            {/* CTA Butonları */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { saveSablonSecimi(sablon.id, sablon.isim); router.push(`/olustur?sablon=${sablon.id}`); }}
                className="flex-1 py-4 rounded-2xl text-sm font-bold"
                style={{
                  background:  isPremium ? goldGradient : `linear-gradient(135deg,${r} 0%,${r}cc 100%)`,
                  color:       isPremium ? "#1a0a00" : "#ffffff",
                  boxShadow:   isPremium ? "0 4px 24px rgba(196,160,90,0.35)" : `0 4px 20px ${r}35`,
                }}
              >
                Bu Şablonla Oluştur →
              </motion.button>

              {demoUrl && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold border transition-all"
                  style={{ borderColor: isPremium ? "rgba(212,170,112,0.3)" : `${r}35`, color: isPremium ? "#D4AA70" : r, background: isPremium ? "rgba(212,170,112,0.05)" : `${r}06` }}
                >
                  <ExternalLink size={14} />
                  Canlı Örneği Gör
                </motion.a>
              )}
            </div>

            {/* Geri dön */}
            <Link
              href="/sablonlar"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors pt-2"
            >
              <ArrowLeft size={12} />
              Tüm şablonlara dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

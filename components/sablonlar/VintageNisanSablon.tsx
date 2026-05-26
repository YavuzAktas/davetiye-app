"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect, useRef } from "react";
import MuzikCalar from "@/components/MuzikCalar";

/* ─── Renkler ─── */
const BG       = "#F7F0E4";
const BG_DARK  = "#EDE0C8";
const BG_PAPER = "#FDFAF6";
const BURG     = "#6E1C2A";
const BURG_MED = "#8B2A3A";
const BROWN    = "#3D2219";
const BROWN_MD = "#7B4A32";
const TAN      = "#B8865A";

/* ─── Botanik SVG Süsleme ─── */
function Botanical({ side = "left", color = BURG, opacity = 0.18 }: { side?: "left" | "right"; color?: string; opacity?: number }) {
  const mirror = side === "right" ? "scale(-1,1)" : "scale(1,1)";
  return (
    <svg width="90" height="160" viewBox="0 0 90 160" fill="none" style={{ opacity, transform: side === "right" ? "scaleX(-1)" : "none" }}>
      {/* Ana dal */}
      <path d="M45 155 C45 140 42 120 44 100 C46 80 44 60 45 40 C46 20 45 10 45 5" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Sol yaprak grubu */}
      <path d="M44 110 C30 105 18 95 14 80 C24 78 36 88 44 100" fill={color} opacity="0.8"/>
      <path d="M44 88 C28 80 16 68 15 52 C26 52 38 64 44 78" fill={color} opacity="0.7"/>
      <path d="M44 68 C32 58 24 45 26 30 C36 32 44 46 45 60" fill={color} opacity="0.6"/>
      {/* Sağ yaprak grubu */}
      <path d="M46 100 C60 92 72 80 72 64 C62 64 50 76 46 90" fill={color} opacity="0.75"/>
      <path d="M46 80 C62 72 74 60 72 44 C62 46 50 58 46 72" fill={color} opacity="0.65"/>
      <path d="M45 55 C58 44 66 30 62 18 C53 22 46 36 45 50" fill={color} opacity="0.55"/>
      {/* Küçük çiçekler */}
      <circle cx="14" cy="79" r="3" fill={color} opacity="0.9"/>
      <circle cx="15" cy="51" r="2.5" fill={color} opacity="0.8"/>
      <circle cx="72" cy="63" r="3" fill={color} opacity="0.85"/>
    </svg>
  );
}

/* ─── İnce çizgi süs ─── */
function VintageDivider({ color = TAN }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color}60)` }} />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 2 L9.5 6.5 L14 8 L9.5 9.5 L8 14 L6.5 9.5 L2 8 L6.5 6.5 Z" fill={color} opacity="0.7"/>
      </svg>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color}60)` }} />
    </div>
  );
}

/* ─── Mühür ─── */
function WaxSeal({ size = 180, onClick }: { size?: number; onClick?: () => void }) {
  const [tapped, setTapped] = useState(false);
  const handle = () => {
    if (tapped) return;
    setTapped(true);
    onClick?.();
  };
  return (
    <div
      onClick={handle}
      style={{
        width: size, height: size,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        animation: tapped
          ? "sealTap 0.4s ease forwards"
          : "sealFloat 5s ease-in-out infinite",
      }}
    >
      {/* Dış halka */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle at 38% 38%, ${BURG_MED}, ${BURG})`,
        boxShadow: `0 8px 32px rgba(110,28,42,0.45), 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.1)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* İç daire */}
        <div style={{
          width: "78%", height: "78%", borderRadius: "50%",
          border: `1.5px solid rgba(245,237,216,0.3)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          {/* Küçük botanik yaprak */}
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
            <path d="M16 24 C16 18 10 12 6 8 C10 6 16 10 16 16 C16 10 22 6 26 8 C22 12 16 18 16 24Z" fill="rgba(245,237,216,0.85)"/>
          </svg>
          <div style={{ width: 36, height: 1, background: "rgba(245,237,216,0.35)" }} />
          <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: 11, color: "rgba(245,237,216,0.8)", letterSpacing: 2, marginTop: 2 }}>
            Nişan
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Fotoğraf sahibi yok placeholder ─── */
function PhotoPlaceholder() {
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${BG_DARK} 0%, ${BG} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill={TAN + "60"}>
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    </div>
  );
}

/* ─── Polaroid kart ─── */
function Polaroid({ rotate = 0, isActive = false, src }: { rotate?: number; isActive?: boolean; src?: string }) {
  const [imgErr, setImgErr] = useState(false);
  const valid = src && (src.startsWith("http://") || src.startsWith("https://"));
  return (
    <div style={{
      background: "#FEFCF8",
      borderRadius: 3,
      padding: "7px 7px 28px",
      transform: isActive ? `rotate(${rotate}deg) scale(1.08)` : `rotate(${rotate}deg) scale(1)`,
      boxShadow: isActive
        ? `0 24px 56px rgba(61,34,25,0.45), 0 6px 16px rgba(0,0,0,0.2)`
        : `0 10px 32px rgba(61,34,25,0.25), 0 2px 8px rgba(0,0,0,0.12)`,
      width: 200, flexShrink: 0,
      transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
      cursor: "pointer",
    }}>
      <div style={{ width: "100%", height: 220, borderRadius: 2, overflow: "hidden" }}>
        {valid && !imgErr ? (
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgErr(true)} />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>
    </div>
  );
}

/* ─── Hover renk diski ─── */
function SwatchDisk({ renk }: { renk: string }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 50, height: 50, borderRadius: "50%", background: renk,
        boxShadow: h
          ? `0 6px 22px ${renk}99, 0 0 0 3px ${BG_DARK}, 0 0 0 5px ${renk}55`
          : `0 3px 12px ${renk}55, 0 0 0 3px ${BG_DARK}, 0 0 0 4px ${renk}33`,
        transform: h ? "scale(1.18)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "default", flexShrink: 0,
      }}
    />
  );
}

/* ─── Dress Code Bölümü ─── */
function DressCodeSection({ dressKod, dressKodRenkler }: { dressKod: string; dressKodRenkler: string | null }) {
  let renkler = ["#6E1C2A", "#C49A6C", "#3D2219", "#8B4C36", "#F7F0E4"];
  try {
    const p = JSON.parse(dressKodRenkler ?? "[]");
    if (Array.isArray(p) && p.length >= 3) renkler = p.slice(0, 5);
  } catch { /* varsayılan */ }

  return (
    <section style={{ padding: "80px 24px 90px", textAlign: "center", background: BG_DARK }}>
      <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.36em", color: BURG, textTransform: "uppercase", marginBottom: 12 }}>
        DRESS CODE
      </p>
      <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(2.4rem,7vw,3.6rem)", color: BROWN, lineHeight: 1.15, marginBottom: 8 }}>
        Gecenin Renkleri
      </p>
      <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: "clamp(1rem,3vw,1.3rem)", fontStyle: "italic", color: BURG_MED, letterSpacing: "0.08em", marginBottom: 24 }}>
        {dressKod}
      </p>
      <div style={{ maxWidth: 160, margin: "0 auto 48px" }}><VintageDivider /></div>
      <div style={{ display: "flex", justifyContent: "center", gap: "clamp(12px,4vw,20px)", flexWrap: "wrap", marginBottom: 52 }}>
        {renkler.map((r, i) => <SwatchDisk key={i} renk={r} />)}
      </div>
      <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 13, fontStyle: "italic", color: `${BROWN}80`, maxWidth: 300, margin: "0 auto", lineHeight: 1.8 }}>
        Şıklığınızla gecemize renk katmanızı sabırsızlıkla bekliyoruz ✦
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────
   ANA BİLEŞEN
───────────────────────────────────────── */
export default function VintageNisanSablon({ davetiye, previewModu }: SablonProps) {
  const [acildi, setAcildi] = useState(previewModu ?? false);
  const [animating, setAnimating] = useState(false);
  const [aktifPolaroid, setAktifPolaroid] = useState<number | null>(null);

  /* Video intro states */
  const [videoGorunur, setVideoGorunur] = useState(false);
  const [isimlerGorunur, setIsimlerGorunur] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tarihObj = davetiye.tarih ? new Date(davetiye.tarih) : null;
  const tarihStr = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : null;
  const tarihKisa = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase() : null;
  const saatStr = tarihObj ? tarihObj.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : null;
  const gunStr = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { weekday: "long" }) : null;

  const calc = () => {
    if (!tarihObj) return { gun: 0, saat: 0, dakika: 0, saniye: 0 };
    const f = tarihObj.getTime() - Date.now();
    if (f <= 0) return { gun: 0, saat: 0, dakika: 0, saniye: 0 };
    return {
      gun: Math.floor(f / 86400000),
      saat: Math.floor((f % 86400000) / 3600000),
      dakika: Math.floor((f % 3600000) / 60000),
      saniye: Math.floor((f % 60000) / 1000),
    };
  };
  const [kalan, setKalan] = useState(calc);
  useEffect(() => {
    if (!tarihObj) return;
    setKalan(calc());
    const id = setInterval(() => setKalan(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarihObj?.getTime()]);

  const isim1 = davetiye.kisi1 || davetiye.baslik.split(/[&ve]/i)[0]?.trim() || davetiye.baslik;
  const isim2 = davetiye.kisi2 || davetiye.baslik.split(/[&ve]/i)[1]?.trim() || null;

  return (
    <>
      <style>{`
        @keyframes sealFloat {
          0%, 100% { transform: rotate(-1deg) translateY(0) scale(1); }
          50% { transform: rotate(1deg) translateY(-8px) scale(1.02); }
        }
        @keyframes sealTap {
          0% { transform: scale(1); }
          30% { transform: scale(0.88) rotate(-2deg); }
          65% { transform: scale(1.07) rotate(1deg); }
          100% { transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatPolaroid {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes isimFadeUp {
          0%   { opacity: 0; transform: translateY(36px) scale(0.96); }
          60%  { opacity: 1; transform: translateY(-4px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tarihFadeIn {
          0%   { opacity: 0; letter-spacing: 0.6em; }
          100% { opacity: 1; letter-spacing: 0.32em; }
        }
        @keyframes lineSvgDraw {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }
        .linen-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Cpath d='M1 1h1v1H1z' fill='rgba(61,34,25,0.04)'/%3E%3C/svg%3E");
          background-size: 4px 4px;
          pointer-events: none;
        }
      `}</style>

      {davetiye.muzik && <MuzikCalar muzikUrl={davetiye.muzik} renk={BURG} />}

      {/* ══ KAPALI: Zarf / Mühür + Video (her ikisi !acildi içinde) ══ */}
      {!acildi && (
        <>
          {/* ── Mühür sayfası ── */}
          <div
            className="min-h-screen flex flex-col relative overflow-hidden select-none linen-bg"
            style={{ background: BG, position: "relative" }}
          >
            {/* Keten doku deseni */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(61,34,25,0.018) 2px, rgba(61,34,25,0.018) 4px),
                                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(61,34,25,0.018) 2px, rgba(61,34,25,0.018) 4px)`,
              pointerEvents: "none",
            }} />

            {/* Köşe süsleri */}
            <div style={{ position: "absolute", top: 24, left: 24 }}>
              <Botanical side="left" color={BURG} opacity={0.2} />
            </div>
            <div style={{ position: "absolute", top: 24, right: 24 }}>
              <Botanical side="right" color={BURG} opacity={0.2} />
            </div>

            {/* Merkez içerik */}
            <div className="flex-1 flex flex-col items-center justify-center w-full" style={{ padding: "40px 24px" }}>
              <p style={{
                fontFamily: "var(--font-cormorant),serif",
                fontSize: 12, letterSpacing: "0.4em",
                color: BURG_MED, textTransform: "uppercase", marginBottom: 20, textAlign: "center",
              }}>
                Nişan Davetiyesi
              </p>

              <p style={{
                fontFamily: "var(--font-dancing),cursive",
                fontSize: "clamp(3rem,10vw,5rem)",
                color: BROWN, lineHeight: 1.1, textAlign: "center", marginBottom: 4,
              }}>{isim1}</p>
              <p style={{
                fontFamily: "var(--font-dancing),cursive",
                fontSize: "clamp(1.4rem,4.5vw,2.2rem)",
                color: TAN, textAlign: "center", marginBottom: 4,
              }}>&</p>
              {isim2 && (
                <p style={{
                  fontFamily: "var(--font-dancing),cursive",
                  fontSize: "clamp(3rem,10vw,5rem)",
                  color: BROWN, lineHeight: 1.1, textAlign: "center", marginBottom: 28,
                }}>{isim2}</p>
              )}

              {/* Mühür */}
              <div style={{ opacity: animating ? 0 : 1, transition: "opacity 0.5s ease", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <WaxSeal size={190} onClick={() => {
                  setAnimating(true);
                  /* play() çağrısı DOĞRUDAN burada — kullanıcı gesture zinciri korunuyor */
                  const v = videoRef.current;
                  if (!v) { setAcildi(true); return; }
                  v.play()
                    .then(() => { setVideoGorunur(true); })
                    .catch(() => {
                      /* Autoplay engellenirse (nadir) direkt aç */
                      setAcildi(true);
                    });
                }} />

                <div style={{ marginTop: 20, textAlign: "center" }}>
                  {tarihKisa && (
                    <p style={{
                      fontFamily: "var(--font-cormorant),serif",
                      fontSize: 13, letterSpacing: "0.32em",
                      color: BURG_MED, marginBottom: 8, fontWeight: 600,
                    }}>{tarihKisa}</p>
                  )}
                  <p style={{
                    fontFamily: "var(--font-cormorant),serif",
                    fontSize: 11, fontStyle: "italic",
                    color: `${BROWN}55`, letterSpacing: "0.12em",
                  }}>Mühüre dokun ✦</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Video overlay — her zaman DOM'da, videoGorunur ile görünür ── */}
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "#000",
              opacity: videoGorunur ? 1 : 0,
              transition: "opacity 0.6s ease",
              pointerEvents: videoGorunur ? "auto" : "none",
            }}
          >
            {/* Video pre-mounted: mühür tıklanmadan önce de DOM'da, hazır */}
            <video
              ref={videoRef}
              src="/background.mp4"
              playsInline
              preload="auto"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              onTimeUpdate={() => {
                const v = videoRef.current;
                if (!v || isimlerGorunur || !v.duration) return;
                if (v.duration - v.currentTime <= 3.2) setIsimlerGorunur(true);
              }}
              onEnded={() => {
                setTimeout(() => {
                  setVideoGorunur(false);
                  setTimeout(() => {
                    setAcildi(true);
                    document.dispatchEvent(new CustomEvent("muzik-baslat"));
                  }, 650);
                }, 1500);
              }}
            />

            {/* Vignette */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
            }} />

            {/* İsimler overlay */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", textAlign: "center", padding: "0 24px",
            }}>
              {isimlerGorunur && (
                <svg width="160" height="24" viewBox="0 0 160 24" fill="none" style={{ marginBottom: 20, animation: "lineSvgDraw 1.2s ease forwards" }}>
                  <path d="M0 12 C30 4 50 20 80 12 C110 4 130 20 160 12" stroke={TAN} strokeWidth="1" fill="none" strokeDasharray="400" strokeDashoffset="0" opacity="0.7"/>
                  <circle cx="80" cy="12" r="3" fill={TAN} opacity="0.8"/>
                  <circle cx="40" cy="12" r="1.5" fill={TAN} opacity="0.5"/>
                  <circle cx="120" cy="12" r="1.5" fill={TAN} opacity="0.5"/>
                </svg>
              )}

              <p style={{
                fontFamily: "var(--font-dancing),cursive",
                fontSize: "clamp(3.5rem,14vw,6.5rem)",
                color: BG, lineHeight: 1,
                textShadow: "0 2px 32px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.3)",
                opacity: isimlerGorunur ? 1 : 0,
                animation: isimlerGorunur ? "isimFadeUp 1.1s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
              }}>{isim1}</p>

              <p style={{
                fontFamily: "var(--font-dancing),cursive",
                fontSize: "clamp(2rem,8vw,4rem)",
                color: TAN, lineHeight: 1.3,
                textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                opacity: isimlerGorunur ? 1 : 0,
                animation: isimlerGorunur ? "isimFadeUp 1.1s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" : "none",
              }}>&</p>

              {isim2 && (
                <p style={{
                  fontFamily: "var(--font-dancing),cursive",
                  fontSize: "clamp(3.5rem,14vw,6.5rem)",
                  color: BG, lineHeight: 1,
                  textShadow: "0 2px 32px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.3)",
                  opacity: isimlerGorunur ? 1 : 0,
                  animation: isimlerGorunur ? "isimFadeUp 1.1s cubic-bezier(0.34,1.56,0.64,1) 0.3s both" : "none",
                }}>{isim2}</p>
              )}

              {tarihKisa && isimlerGorunur && (
                <p style={{
                  fontFamily: "var(--font-cormorant),serif",
                  fontSize: "clamp(0.8rem,3vw,1.2rem)",
                  color: TAN, marginTop: 20,
                  textShadow: "0 1px 12px rgba(0,0,0,0.5)",
                  animation: "tarihFadeIn 1.4s ease 0.5s both",
                }}>{tarihKisa}</p>
              )}

              {isimlerGorunur && (
                <svg width="160" height="24" viewBox="0 0 160 24" fill="none" style={{ marginTop: 18, animation: "lineSvgDraw 1.2s ease 0.2s both" }}>
                  <path d="M0 12 C30 20 50 4 80 12 C110 20 130 4 160 12" stroke={TAN} strokeWidth="1" fill="none" strokeDasharray="400" opacity="0.7"/>
                  <circle cx="80" cy="12" r="3" fill={TAN} opacity="0.8"/>
                  <circle cx="40" cy="12" r="1.5" fill={TAN} opacity="0.5"/>
                  <circle cx="120" cy="12" r="1.5" fill={TAN} opacity="0.5"/>
                </svg>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══ AÇIK DURUM ══ */}
      {acildi && (
        <div style={{ background: BG, minHeight: "100vh", overflowX: "hidden" }}>

          {/* ════════ BÖLÜM 1 — HERO ════════ */}
          <section style={{
            minHeight: "100svh", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "70px 24px 80px", position: "relative", overflow: "hidden",
            background: BG,
          }}>
            {/* Keten doku */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(61,34,25,0.015) 2px, rgba(61,34,25,0.015) 4px),
                                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(61,34,25,0.015) 2px, rgba(61,34,25,0.015) 4px)`,
              pointerEvents: "none",
            }} />

            {/* Köşe botanikler */}
            <div style={{ position: "absolute", top: 0, left: 0, opacity: 0.22 }}>
              <Botanical side="left" color={BURG} opacity={1} />
            </div>
            <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.22 }}>
              <Botanical side="right" color={BURG} opacity={1} />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.15, transform: "scaleY(-1)" }}>
              <Botanical side="left" color={BURG} opacity={1} />
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.15, transform: "scaleY(-1)" }}>
              <Botanical side="right" color={BURG} opacity={1} />
            </div>

            {/* Merkez kart */}
            <div style={{
              position: "relative", maxWidth: 420, width: "100%",
              border: `1px solid ${BURG}28`,
              borderRadius: "110px 110px 14px 14px",
              padding: "52px 36px 48px",
              textAlign: "center",
              background: "rgba(253,250,246,0.7)",
              boxShadow: `0 4px 40px rgba(110,28,42,0.06), 0 1px 8px rgba(0,0,0,0.04)`,
            }}>
              <div style={{
                position: "absolute", inset: 8,
                borderRadius: "103px 103px 8px 8px",
                border: `1px solid ${BURG}14`,
                pointerEvents: "none",
              }} />

              <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.38em", color: BURG, textTransform: "uppercase", marginBottom: 20 }}>
                Nişan Davetiyesi
              </p>

              <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(3.6rem,12vw,5.5rem)", color: BROWN, lineHeight: 1, marginBottom: 2 }}>
                {isim1}
              </p>
              <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(1.6rem,5vw,2.4rem)", color: TAN, lineHeight: 1.4 }}>
                &
              </p>
              {isim2 && (
                <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(3.6rem,12vw,5.5rem)", color: BROWN, lineHeight: 1, marginBottom: 8 }}>
                  {isim2}
                </p>
              )}

              <div style={{ margin: "18px auto", maxWidth: 200 }}>
                <VintageDivider />
              </div>

              {(tarihKisa || davetiye.mekan) && (
                <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 13, letterSpacing: "0.18em", color: `${BROWN}70`, marginBottom: 8 }}>
                  {tarihKisa}{tarihKisa && davetiye.mekan ? " · " : ""}{davetiye.mekan?.toUpperCase()}
                </p>
              )}
              <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 13, fontStyle: "italic", color: `${BROWN}55`, marginTop: 6 }}>
                Sizi bu özel günde yanımızda görmek isteriz
              </p>
            </div>

            {/* Aşağı oku */}
            <div style={{ marginTop: 48, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.3em", color: `${BURG}55`, marginBottom: 10, textTransform: "uppercase" }}>
                Aşağı Kaydır
              </p>
              <div style={{
                width: 26, height: 26, border: `1px solid ${BURG}30`, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto",
                color: `${BURG}55`, fontSize: 12, animation: "bounce 2s infinite",
              }}>↓</div>
            </div>
          </section>

          {/* ════════ BÖLÜM 2 — POLAROID ANILARI ════════ */}
          {davetiye.albumAktif && (
            <section style={{ padding: "80px 24px 100px", textAlign: "center", background: BG_DARK }}>
              {/* Keten doku */}
              <div style={{
                position: "relative",
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(61,34,25,0.02) 3px, rgba(61,34,25,0.02) 6px)`,
              }}>
                <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.36em", color: BURG, textTransform: "uppercase", marginBottom: 12 }}>
                  Bizim Hikayemiz
                </p>
                <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(2.4rem,7.5vw,3.8rem)", color: BROWN, lineHeight: 1.1, marginBottom: 20 }}>
                  En Güzel Anılar
                </p>
                <div style={{ maxWidth: 180, margin: "0 auto 56px" }}><VintageDivider /></div>
              </div>

              {/* Polaroid fan */}
              <div style={{ display: "flex", justifyContent: "center", minHeight: 400, marginBottom: 20 }}>
                <div style={{ position: "relative", width: 320, height: 340 }}>
                  <div
                    onMouseEnter={() => setAktifPolaroid(1)} onMouseLeave={() => setAktifPolaroid(null)}
                    onTouchStart={() => setAktifPolaroid(1)}
                    style={{ position: "absolute", top: 60, left: -10, zIndex: aktifPolaroid === 1 ? 10 : 1, animation: "fadeUp 0.8s ease backwards 0s" }}
                  >
                    <div style={{ animation: "floatPolaroid 6s ease-in-out infinite 0s" }}>
                      <Polaroid rotate={-9} isActive={aktifPolaroid === 1} src={davetiye.polaroid1 ?? undefined} />
                    </div>
                  </div>
                  <div
                    onMouseEnter={() => setAktifPolaroid(2)} onMouseLeave={() => setAktifPolaroid(null)}
                    onTouchStart={() => setAktifPolaroid(2)}
                    style={{ position: "absolute", top: 16, left: 60, zIndex: aktifPolaroid === 2 ? 10 : 2, animation: "fadeUp 0.8s ease backwards 0.2s" }}
                  >
                    <div style={{ animation: "floatPolaroid 6.5s ease-in-out infinite 0.6s" }}>
                      <Polaroid rotate={-2} isActive={aktifPolaroid === 2} src={davetiye.polaroid2 ?? undefined} />
                    </div>
                  </div>
                  <div
                    onMouseEnter={() => setAktifPolaroid(3)} onMouseLeave={() => setAktifPolaroid(null)}
                    onTouchStart={() => setAktifPolaroid(3)}
                    style={{ position: "absolute", top: 46, left: 128, zIndex: aktifPolaroid === 3 ? 10 : 3, animation: "fadeUp 0.8s ease backwards 0.4s" }}
                  >
                    <div style={{ animation: "floatPolaroid 7s ease-in-out infinite 1.1s" }}>
                      <Polaroid rotate={7} isActive={aktifPolaroid === 3} src={davetiye.polaroid3 ?? undefined} />
                    </div>
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: 17, fontStyle: "italic", color: `${BROWN}55` }}>
                Sonsuz bir yolculuğun ilk adımları... ✦
              </p>
            </section>
          )}

          {/* ════════ BÖLÜM 3 — ETKİNLİK DETAYLARI ════════ */}
          <section style={{ padding: "80px 24px", textAlign: "center", background: BG }}>
            {/* Üst botanik ince şerit */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32, opacity: 0.3 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="8" height="8" viewBox="0 0 8 8">
                  <path d="M4 0 L5 3 L8 4 L5 5 L4 8 L3 5 L0 4 L3 3Z" fill={BURG} />
                </svg>
              ))}
            </div>

            <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.36em", color: BURG, textTransform: "uppercase", marginBottom: 12 }}>
              Etkinlik Detayları
            </p>
            <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(2.2rem,7vw,3.6rem)", color: BROWN, marginBottom: 36 }}>
              Nerede &amp; Ne Zaman?
            </p>

            {/* Bilgi kartı */}
            <div style={{
              maxWidth: 480, margin: "0 auto 40px",
              background: BG_PAPER, borderRadius: 16,
              border: `1px solid ${BURG}18`,
              padding: "36px 32px",
              boxShadow: `0 8px 40px rgba(110,28,42,0.07), 0 2px 8px rgba(0,0,0,0.04)`,
              position: "relative", overflow: "hidden",
            }}>
              {/* Köşe süsler */}
              <span style={{ position: "absolute", top: 12, left: 16, color: BURG, opacity: 0.25, fontSize: 12 }}>✦</span>
              <span style={{ position: "absolute", top: 12, right: 16, color: BURG, opacity: 0.25, fontSize: 12 }}>✦</span>
              <span style={{ position: "absolute", bottom: 12, left: 16, color: BURG, opacity: 0.25, fontSize: 12 }}>✦</span>
              <span style={{ position: "absolute", bottom: 12, right: 16, color: BURG, opacity: 0.25, fontSize: 12 }}>✦</span>

              <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px,6vw,52px)", flexWrap: "wrap" }}>
                {[
                  { emoji: "📅", lbl: "TARİH", val: tarihStr ?? "—" },
                  { emoji: "🕐", lbl: "SAAT", val: saatStr ?? "—" },
                  { emoji: "📍", lbl: "MEKAN", val: davetiye.mekan ?? "Belirtilmedi" },
                  ...(gunStr ? [{ emoji: "🌸", lbl: "GÜN", val: gunStr }] : []),
                ].map(col => (
                  <div key={col.lbl} style={{ textAlign: "center", minWidth: 80 }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{col.emoji}</div>
                    <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 9, letterSpacing: "0.28em", color: BURG, textTransform: "uppercase", marginBottom: 6 }}>{col.lbl}</p>
                    <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 14, fontWeight: 600, color: BROWN }}>{col.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Harita */}
            {davetiye.mekan && (
              <div style={{
                maxWidth: 560, margin: "0 auto",
                borderRadius: 12, overflow: "hidden",
                border: `1px solid ${BURG}20`,
                boxShadow: `0 6px 24px rgba(110,28,42,0.1)`,
              }}>
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%" height="240"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            )}
          </section>

          {/* ════════ BÖLÜM 4 — KİŞİSEL NOT ════════ */}
          {davetiye.mesaj && (
            <section style={{ padding: "70px 24px 80px", textAlign: "center", background: BG_DARK }}>
              <div style={{ maxWidth: 400, margin: "0 auto" }}>
                <svg width="32" height="24" viewBox="0 0 32 24" style={{ marginBottom: 16, opacity: 0.35 }}>
                  <path d="M0 24 C0 16 4 8 12 4 C8 8 6 12 8 16 L0 24Z M20 24 C20 16 24 8 32 4 C28 8 26 12 28 16 L20 24Z" fill={BURG} />
                </svg>
                <div style={{ margin: "0 auto 20px", maxWidth: 180 }}><VintageDivider /></div>
                <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(1.4rem,5vw,2rem)", color: BROWN, lineHeight: 1.7, fontStyle: "italic" }}>
                  &ldquo;{davetiye.mesaj}&rdquo;
                </p>
                <div style={{ margin: "20px auto 0", maxWidth: 180 }}><VintageDivider /></div>
              </div>
            </section>
          )}

          {/* ════════ BÖLÜM 5 — GERİ SAYIM ════════ */}
          <section style={{ padding: "80px 24px", textAlign: "center", background: BG_PAPER }}>
            <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.36em", color: BURG, textTransform: "uppercase", marginBottom: 12 }}>
              Nişana Kalan Süre
            </p>
            <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(2.2rem,7vw,3.4rem)", color: BROWN, marginBottom: 48 }}>
              {tarihObj && tarihObj > new Date() ? "Sayıyoruz..." : "Kutlama Zamanı! 🎊"}
            </p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(8px,3vw,16px)", flexWrap: "wrap" }}>
              {[
                { val: kalan.gun, lbl: "GÜN" },
                { val: kalan.saat, lbl: "SAAT" },
                { val: kalan.dakika, lbl: "DAKİKA" },
                { val: kalan.saniye, lbl: "SANİYE" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "clamp(6px,2vw,14px)" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{
                      fontFamily: "var(--font-cormorant),serif",
                      fontSize: "clamp(3rem,9vw,4.8rem)", fontWeight: 600,
                      color: BURG, lineHeight: 1, fontVariantNumeric: "tabular-nums", minWidth: "2ch",
                    }}>{String(item.val).padStart(2, "0")}</p>
                    <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.22em", color: BROWN_MD, marginTop: 8 }}>{item.lbl}</p>
                  </div>
                  {i < 3 && (
                    <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: "clamp(2rem,6vw,3.2rem)", color: `${TAN}70`, lineHeight: 1.1, marginTop: 4 }}>:</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ════════ BÖLÜM 6 — DRESS CODE ════════ */}
          {davetiye.dressKod && <DressCodeSection dressKod={davetiye.dressKod} dressKodRenkler={davetiye.dressKodRenkler} />}

          {/* ════════ BÖLÜM 7 — RSVP ════════ */}
          <section style={{ padding: "80px 24px", background: BG }}>
            <div style={{ maxWidth: 480, margin: "0 auto" }}>
              <div style={{
                background: BG_PAPER, borderRadius: 16, padding: "40px 32px 44px",
                border: `1px solid ${BURG}20`,
                boxShadow: `0 16px 56px rgba(110,28,42,0.08), 0 4px 16px rgba(0,0,0,0.05)`,
                position: "relative",
              }}>
                <span style={{ position: "absolute", top: 16, left: 20, color: BURG, fontSize: 12, opacity: 0.3 }}>✦</span>
                <span style={{ position: "absolute", bottom: 16, right: 20, color: BURG, fontSize: 12, opacity: 0.3 }}>✦</span>

                <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 10, letterSpacing: "0.32em", color: BURG, textAlign: "center", textTransform: "uppercase", marginBottom: 10 }}>
                  Katılım Bildirimi
                </p>
                <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(1.8rem,6.5vw,2.8rem)", color: BROWN, textAlign: "center", lineHeight: 1.1, marginBottom: 22 }}>
                  Gelecek misiniz?
                </p>
                <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${TAN}50, transparent)`, marginBottom: 28 }} />
                <RsvpFormVintage davetiyeId={davetiye.id} />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ background: BG_DARK, padding: "32px 24px 80px", textAlign: "center", position: "relative" }}>
            {/* Üst botanik şerit */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, opacity: 0.2 }}>
              <Botanical side="left" color={BURG} opacity={1} />
              <Botanical side="right" color={BURG} opacity={1} />
            </div>
            <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "clamp(2rem,6vw,3rem)", color: BROWN }}>
              Sizi çok seviyoruz 🌸
            </p>
            {isim1 && isim2 && (
              <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 13, letterSpacing: "0.2em", color: `${BROWN}55`, marginTop: 8 }}>
                {isim1} &amp; {isim2}
              </p>
            )}
          </footer>

        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   RSVP FORMU — Vintage stil
───────────────────────────────────────── */
function RsvpFormVintage({ davetiyeId }: { davetiyeId: string }) {
  const [adim, setAdim] = useState<"form" | "tamam">("form");
  const [form, setForm] = useState({ ad: "", kisiSayisi: "1", katilim: "", sarkiDilegi: "" });
  const [secilenDiyet, setSecilenDiyet] = useState<string[]>([]);
  const toggleDiyet = (k: string) => setSecilenDiyet(p => p.includes(k) ? p.filter(d => d !== k) : [...p, k]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [ekBilgiAcik, setEkBilgiAcik] = useState(false);

  const fieldStyle: React.CSSProperties = {
    width: "100%", background: "transparent",
    border: "none", borderBottom: `1px solid ${TAN}55`,
    padding: "10px 0", fontSize: 14,
    fontFamily: "var(--font-cormorant),serif",
    color: BROWN, outline: "none", boxSizing: "border-box",
    appearance: "none" as const,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-cormorant),serif",
    fontSize: 10, letterSpacing: "0.28em",
    color: BURG_MED, textTransform: "uppercase",
    display: "block", marginBottom: 4, marginTop: 20,
  };

  const gonder = async () => {
    if (!form.ad.trim()) { setHata("Lütfen adınızı girin."); return; }
    if (!form.katilim) { setHata("Lütfen katılım durumunu seçin."); return; }
    setYukleniyor(true); setHata("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          davetiyeId,
          ad: form.ad,
          katilim: form.katilim === "evet",
          kisiSayisi: Number(form.kisiSayisi),
          diyet: secilenDiyet.length > 0 ? secilenDiyet.join(",") : undefined,
          sarkiOnerisi: form.sarkiDilegi.trim() || undefined,
        }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setHata(d.hata || "Bir hata oluştu."); return; }
      setAdim("tamam");
    } catch { setHata("Bir hata oluştu."); }
    finally { setYukleniyor(false); }
  };

  if (adim === "tamam") {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: 38, marginBottom: 12 }}>{form.katilim === "evet" ? "🌸" : "💙"}</p>
        <p style={{ fontFamily: "var(--font-dancing),cursive", fontSize: "1.9rem", color: BROWN, marginBottom: 8 }}>
          {form.katilim === "evet" ? "Görüşmek üzere!" : "Anlıyoruz..."}
        </p>
        <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 14, color: BROWN_MD }}>
          {form.katilim === "evet"
            ? "Katılım bilginiz iletildi. Sizi görmek için sabırsızlanıyoruz!"
            : "Katılım durumunuz iletildi."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <label style={labelStyle}>ADINIZ SOYADINIZ</label>
      <input type="text" value={form.ad}
        onChange={e => setForm({ ...form, ad: e.target.value })}
        placeholder="örn. Selin Kaya" style={fieldStyle} />

      <label style={labelStyle}>KAÇ KİŞİ?</label>
      <select value={form.kisiSayisi}
        onChange={e => setForm({ ...form, kisiSayisi: e.target.value })}
        style={fieldStyle}>
        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} kişi</option>)}
      </select>

      <label style={labelStyle}>KATILIM DURUMU</label>
      <select value={form.katilim}
        onChange={e => setForm({ ...form, katilim: e.target.value })}
        style={fieldStyle}>
        <option value="">Seçiniz</option>
        <option value="evet">Katılıyorum ✓</option>
        <option value="hayir">Katılamıyorum</option>
      </select>

      <div style={{ marginTop: 22, border: `1px solid ${TAN}28`, borderRadius: 10, overflow: "hidden", background: `rgba(184,134,90,0.04)` }}>
        <button type="button" onClick={() => setEkBilgiAcik(!ekBilgiAcik)} style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 14px", background: "transparent", border: "none", cursor: "pointer",
          fontFamily: "var(--font-cormorant),serif", color: BROWN, textAlign: "left",
        }}>
          <span>
            <span style={{ display: "block", fontSize: 13, fontWeight: 700 }}>Ek bilgi ekle</span>
            <span style={{ display: "block", fontSize: 11, color: BROWN_MD, marginTop: 2 }}>Diyet tercihi veya şarkı dileği</span>
          </span>
          <span style={{ fontSize: 18, color: TAN, transform: ekBilgiAcik ? "rotate(45deg)" : "none", transition: "transform 0.15s" }}>+</span>
        </button>
        {ekBilgiAcik && (
          <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${TAN}20` }}>
            {form.katilim === "evet" && (
              <div style={{ marginTop: 14 }}>
                <label style={labelStyle}>Diyet Tercihleri <span style={{ textTransform: "none", letterSpacing: 0, fontSize: 10, color: BROWN_MD }}>(isteğe bağlı)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {[{ k: "vegan", l: "🌱 Vegan" }, { k: "vejetaryen", l: "🥗 Vejetaryen" }, { k: "glutensiz", l: "🌾 Glutensiz" }, { k: "laktozsuz", l: "🥛 Laktozsuz" }].map(opt => (
                    <button key={opt.k} type="button" onClick={() => toggleDiyet(opt.k)} style={{
                      padding: "6px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                      fontFamily: "var(--font-cormorant),serif",
                      border: `1.5px solid ${secilenDiyet.includes(opt.k) ? TAN : TAN + "40"}`,
                      color: secilenDiyet.includes(opt.k) ? BROWN : BROWN_MD,
                      background: secilenDiyet.includes(opt.k) ? TAN + "22" : "transparent",
                      transition: "all 0.15s",
                    }}>{opt.l}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>🎵 Şarkı dileğiniz <span style={{ textTransform: "none", letterSpacing: 0, fontSize: 10, color: BROWN_MD }}>(isteğe bağlı)</span></label>
              <input type="text" value={form.sarkiDilegi}
                onChange={e => setForm({ ...form, sarkiDilegi: e.target.value })}
                placeholder="Dans pistimizdeki favori şarkınız?" maxLength={200} style={fieldStyle} />
            </div>
          </div>
        )}
      </div>

      {hata && (
        <p style={{ color: "#B91C1C", fontSize: 12, fontFamily: "var(--font-cormorant),serif", marginTop: 12 }}>{hata}</p>
      )}

      <button onClick={gonder} disabled={yukleniyor} style={{
        width: "100%", marginTop: 28, padding: "14px",
        background: BURG, color: BG, border: "none", borderRadius: 8,
        fontFamily: "var(--font-cormorant),serif",
        fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase",
        cursor: yukleniyor ? "not-allowed" : "pointer",
        opacity: yukleniyor ? 0.7 : 1,
      }}>
        {yukleniyor ? "GÖNDERİLİYOR..." : "BİLDİR"}
      </button>

      <p style={{ marginTop: 14, fontSize: 9.5, lineHeight: 1.7, fontFamily: "var(--font-cormorant),serif", color: `${BROWN_MD}70`, textAlign: "center" }}>
        Girdiğiniz bilgiler yalnızca katılım bildirimini davet sahibine iletmek amacıyla işlenmekte ve etkinlik tarihinden itibaren 1 yıl içinde silinmektedir.
      </p>
    </div>
  );
}

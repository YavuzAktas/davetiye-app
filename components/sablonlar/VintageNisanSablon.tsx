"use client";

// Vintage Nişan Şablonu
import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MuzikCalar from "@/components/MuzikCalar";

/* ════════════════ PALET ════════════════ */
const BG      = "#FAF7EE";
const BG_SOFT = "#F0E8D8";
const BG_CARD = "#FEFCF8";
const DUSK    = "#110820";
const SHADOW  = "#1C1030";

const LILAC   = "#7A52A0";
const LILAC_MD= "#A87CC8";
const LILAC_LT= "#CCB0E8";

const PETAL   = "#C07888";
const PETAL_LT= "#E0AABC";

const GOLD    = "#C9A840";
const GOLD_LT = "#E8D070";

const WARM    = "#2A1808";
const WARM_MD = "#6B3E18";

const GREEN   = "#3D6645";


/* ════════════════ YARDIMCI BİLEŞENLER ════════════════ */

function NightWisteria({ side = "left", opacity = 1 }: { side?: "left"|"right"; opacity?: number }) {
  return (
    <svg width="140" height="280" viewBox="0 0 140 280" fill="none"
      style={{ opacity, transform: side === "right" ? "scaleX(-1)" : "none" }}>
      <path d="M40 0 C42 30 36 62 40 94 C44 124 38 154 40 184 C42 214 38 248 40 280" stroke="#5A8A62" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M40 20 C60 13 78 18 96 10"  stroke="#5A8A62" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M40 20 C22 13 10 18 2 10"   stroke="#5A8A62" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M40 52 C62 45 80 50 98 42"  stroke="#5A8A62" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M40 52 C22 45 8 50 0 44"    stroke="#5A8A62" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <path d="M40 86 C60 80 76 84 90 78"  stroke="#5A8A62" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M40 120 C56 114 70 118 82 112" stroke="#5A8A62" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <ellipse cx="96" cy="17"  rx="5"   ry="9"   fill="#B490D8" opacity="0.75" />
      <ellipse cx="88" cy="25"  rx="4.5" ry="8"   fill="#CCB0E8" opacity="0.62" />
      <ellipse cx="103" cy="26" rx="4"   ry="7.5" fill="#9E72C4" opacity="0.55" />
      <ellipse cx="93" cy="34"  rx="4"   ry="7"   fill="#B490D8" opacity="0.48" />
      <ellipse cx="68" cy="14"  rx="4.5" ry="8"   fill="#CCB0E8" opacity="0.58" />
      <ellipse cx="62" cy="22"  rx="4"   ry="7"   fill="#B490D8" opacity="0.5"  />
      <ellipse cx="98" cy="49"  rx="5"   ry="9.5" fill="#B490D8" opacity="0.72" />
      <ellipse cx="90" cy="58"  rx="4.5" ry="8.5" fill="#CCB0E8" opacity="0.60" />
      <ellipse cx="106" cy="59" rx="4"   ry="8"   fill="#9E72C4" opacity="0.52" />
      <ellipse cx="96" cy="67"  rx="3.8" ry="7.5" fill="#B490D8" opacity="0.44" />
      <ellipse cx="90" cy="85"  rx="4.5" ry="8.5" fill="#B490D8" opacity="0.68" />
      <ellipse cx="82" cy="94"  rx="4"   ry="8"   fill="#CCB0E8" opacity="0.57" />
      <ellipse cx="97" cy="95"  rx="3.5" ry="7.5" fill="#9E72C4" opacity="0.49" />
      <ellipse cx="82" cy="119" rx="4.2" ry="8"   fill="#B490D8" opacity="0.65" />
      <ellipse cx="75" cy="128" rx="3.8" ry="7.5" fill="#CCB0E8" opacity="0.55" />
      <path d="M40 38 C26 30 17 18 21 7 C30 12 38 26 40 37"   fill="#3D6645" opacity="0.6"  />
      <path d="M40 70 C24 62 15 48 19 38 C28 43 37 58 40 69"  fill="#3D6645" opacity="0.55" />
      <path d="M40 104 C26 96 19 82 23 72 C32 77 39 92 40 103" fill="#3D6645" opacity="0.5" />
      <circle cx="20" cy="120" r="6"   fill="#D890A8" opacity="0.55" />
      <circle cx="28" cy="140" r="5"   fill="#EBB8CA" opacity="0.48" />
      <circle cx="16" cy="158" r="5.5" fill="#D890A8" opacity="0.52" />
      <circle cx="24" cy="178" r="5"   fill="#EBB8CA" opacity="0.44" />
    </svg>
  );
}

/* Altın üst süs */
function GoldOrnament() {
  return (
    <svg width="100" height="36" viewBox="0 0 100 36" fill="none" style={{ display: "block", margin: "0 auto 20px" }}>
      <line x1="0"  y1="18" x2="36" y2="18" stroke={GOLD} strokeWidth="0.7" opacity="0.6" />
      <line x1="64" y1="18" x2="100" y2="18" stroke={GOLD} strokeWidth="0.7" opacity="0.6" />
      <circle cx="10" cy="18" r="1.5" fill={GOLD} opacity="0.45" />
      <circle cx="90" cy="18" r="1.5" fill={GOLD} opacity="0.45" />
      <circle cx="50" cy="18" r="8" stroke={GOLD} strokeWidth="0.7" fill="none" opacity="0.40" />
      <circle cx="50" cy="18" r="2.8" fill={GOLD} opacity="0.88" />
    </svg>
  );
}

/* Altın lüks ayırıcı */
function LuxuryDivider({ color = GOLD }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 0.5, background: `linear-gradient(to right, transparent, ${color}70)` }} />
      <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
        <circle cx="4"  cy="8" r="2"   fill={color} opacity="0.35" />
        <circle cx="20" cy="8" r="5.5" stroke={color} strokeWidth="0.7" fill={color} fillOpacity="0.08" opacity="0.75" />
        <circle cx="20" cy="8" r="2"   fill={color} opacity="0.90" />
        <circle cx="36" cy="8" r="2"   fill={color} opacity="0.35" />
      </svg>
      <div style={{ flex: 1, height: 0.5, background: `linear-gradient(to left, transparent, ${color}70)` }} />
    </div>
  );
}

/* Wax Seal */
function WaxSeal({ size = 190, onClick }: { size?: number; onClick?: () => void }) {
  const [tapped, setTapped] = useState(false);
  const handle = () => { if (tapped) return; setTapped(true); onClick?.(); };
  return (
    <div onClick={handle} style={{
      width: size, height: size,
      cursor: onClick ? "pointer" : "default",
      animation: tapped ? "sealTap 0.4s ease forwards" : "sealFloat 5s ease-in-out infinite",
      filter: "drop-shadow(0 8px 28px rgba(42,24,8,0.18)) drop-shadow(0 2px 6px rgba(42,24,8,0.09))",
    }}>
      <Image src="/wax-seal.png" alt="" width={size} height={size} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

/* Polaroid */
function PhotoPlaceholder() {
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${BG_SOFT}, ${BG})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill={LILAC_LT + "80"}>
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    </div>
  );
}

function Polaroid({ rotate = 0, isActive = false, src }: { rotate?: number; isActive?: boolean; src?: string }) {
  const [imgErr, setImgErr] = useState(false);
  const valid = src && (src.startsWith("http://") || src.startsWith("https://"));
  return (
    <div style={{
      background: "#FEFCF8", borderRadius: 3, padding: "7px 7px 28px",
      transform: isActive ? `rotate(${rotate}deg) scale(1.08)` : `rotate(${rotate}deg) scale(1)`,
      boxShadow: isActive ? "0 24px 56px rgba(92,60,154,0.28), 0 6px 16px rgba(0,0,0,0.18)" : "0 10px 36px rgba(40,20,8,0.20), 0 2px 8px rgba(0,0,0,0.08)",
      width: 200, flexShrink: 0,
      transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease",
      cursor: "pointer",
    }}>
      <div style={{ position: "relative", width: "100%", height: 220, borderRadius: 2, overflow: "hidden" }}>
        {valid && !imgErr ? <Image src={src!} alt="" fill style={{ objectFit: "cover" }} onError={() => setImgErr(true)} /> : <PhotoPlaceholder />}
      </div>
    </div>
  );
}

/* Dress Code disk */
function SwatchDisk({ renk }: { renk: string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      width: 52, height: 52, borderRadius: "50%", background: renk,
      boxShadow: h ? `0 6px 22px ${renk}99, 0 0 0 3px ${BG_SOFT}, 0 0 0 5px ${renk}55` : `0 3px 12px ${renk}55, 0 0 0 3px ${BG_SOFT}, 0 0 0 4px ${renk}33`,
      transform: h ? "scale(1.18)" : "scale(1)",
      transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)", cursor: "default", flexShrink: 0,
    }} />
  );
}

/* Dress Code section */
function DressCodeSection({ dressKod, dressKodRenkler }: { dressKod: string; dressKodRenkler: string | null }) {
  let renkler = [LILAC, PETAL, GREEN, GOLD, BG_SOFT];
  try {
    const p = JSON.parse(dressKodRenkler ?? "[]");
    if (Array.isArray(p) && p.length >= 3) renkler = p.slice(0, 5);
  } catch { /* varsayılan */ }
  return (
    <section style={{ padding: "90px 24px 100px", textAlign: "center", background: DUSK, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.14 }}><NightWisteria side="left" /></div>
      <div style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.14 }}><NightWisteria side="right" /></div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.46em", color: GOLD, textTransform: "uppercase", marginBottom: 10 }}>Dress Code</p>
        <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(2.4rem,8vw,4rem)", color: "#FEFCF8", lineHeight: 1.1, marginBottom: 6 }}>Gecenin Renkleri</p>
        <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(0.9rem,3vw,1.1rem)", fontStyle: "italic", color: LILAC_LT, marginBottom: 28 }}>{dressKod}</p>
        <div style={{ maxWidth: 200, margin: "0 auto 48px" }}><LuxuryDivider color={GOLD + "90"} /></div>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(12px,4vw,20px)", flexWrap: "wrap", marginBottom: 40 }}>
          {renkler.map((r, i) => <SwatchDisk key={i} renk={r} />)}
        </div>
        <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 12, fontStyle: "italic", color: `rgba(253,252,248,0.45)`, maxWidth: 300, margin: "0 auto", lineHeight: 1.9 }}>
          Şıklığınızla gecemize renk katmanızı sabırsızlıkla bekliyoruz
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ANA BİLEŞEN
═══════════════════════════════════════════ */
export default function VintageNisanSablon({ davetiye, rsvpBileseni, previewModu }: SablonProps) {
  const [sealVar, setSealVar]       = useState(() => {
    if (previewModu) return false;
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("panel")) return false;
    return true;
  });
  const [sealFading, setSealFading] = useState(false);
  const [isimlerGorunur, setIsimlerGorunur] = useState(false);
  const [videoFinal, setVideoFinal]         = useState(false);
  const [aktifPolaroid, setAktifPolaroid]   = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tarihObj  = davetiye.tarih ? new Date(davetiye.tarih) : null;
  const tarihStr  = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : null;
  const tarihKisa = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).toUpperCase() : null;
  const saatStr   = tarihObj ? tarihObj.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) : null;
  const gunStr    = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { weekday: "long", timeZone: "UTC" }) : null;

  const calc = () => {
    if (!tarihObj) return { gun: 0, saat: 0, dakika: 0, saniye: 0 };
    /* Tarih UTC olarak saklanıyor ama timeZone:"UTC" ile yerel saat gibi gösteriliyor.
       getTimezoneOffset() (UTC+3 → -180) ekleyerek countdown'ı hizalıyoruz. */
    const tzOffsetMs = new Date().getTimezoneOffset() * 60_000;
    const f = tarihObj.getTime() + tzOffsetMs - Date.now();
    if (f <= 0) return { gun: 0, saat: 0, dakika: 0, saniye: 0 };
    return {
      gun:    Math.floor(f / 86400000),
      saat:   Math.floor((f % 86400000) / 3600000),
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

  /* Butonları video bitince göster */
  useEffect(() => {
    if (previewModu) return;
    if (!videoFinal) {
      document.body.classList.add("video-oyniyor");
      return () => document.body.classList.remove("video-oyniyor");
    }
    document.body.classList.remove("video-oyniyor");
    const t = setTimeout(() => document.dispatchEvent(new CustomEvent("muzik-baslat")), 150);
    return () => clearTimeout(t);
  }, [videoFinal, previewModu]);

  const tamIsim1 = davetiye.kisi1 || davetiye.baslik.split(/[&ve]/i)[0]?.trim() || davetiye.baslik;
  const tamIsim2 = davetiye.kisi2 || davetiye.baslik.split(/[&ve]/i)[1]?.trim() || null;

  // Soyadı ayır: 2+ kelimeli adlarda son kelime soyad, geri kalanı görüntü adı
  const p1 = tamIsim1.trim().split(/\s+/);
  const soyad1 = p1.length > 1 ? p1[p1.length - 1] : null;
  const isim1  = p1.length > 1 ? p1.slice(0, -1).join(" ") : tamIsim1;

  const p2     = tamIsim2 ? tamIsim2.trim().split(/\s+/) : null;
  const soyad2 = p2 && p2.length > 1 ? p2[p2.length - 1] : null;
  const isim2  = p2 ? (p2.length > 1 ? p2.slice(0, -1).join(" ") : tamIsim2) : null;

  const aileStr = soyad1 && soyad2 ? `${soyad1} & ${soyad2} Aileleri` : soyad1 ? `${soyad1} Ailesi` : null;

  const onSealClick = () => {
    if (sealFading) return;
    const v = videoRef.current;
    setSealFading(true);
    if (v) v.play().catch(() => {});
    setTimeout(() => setSealVar(false), 900);
  };

  return (
    <>
      <style>{`
        @keyframes sealFloat {
          0%,100% { transform: rotate(-1deg) translateY(0) scale(1); }
          50%      { transform: rotate(1deg) translateY(-10px) scale(1.02); }
        }
        @keyframes sealTap {
          0%   { transform: scale(1); }
          30%  { transform: scale(0.85) rotate(-3deg); }
          65%  { transform: scale(1.08) rotate(2deg); }
          100% { transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes isimFadeUp {
          0%   { opacity: 0; transform: translateY(28px) scale(0.97); }
          60%  { opacity: 1; transform: translateY(-2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lineDraw {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.7; transform: scale(1); }
          50%     { opacity: 1; transform: scale(1.04); }
        }
        @keyframes starPulse {
          0%,100% { opacity: 0.35; transform: scale(1); }
          50%     { opacity: 1;    transform: scale(1.4); }
        }
        @keyframes scrollFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chevronFlow {
          0%,100% { opacity: 0.15; transform: translateY(0); }
          50%     { opacity: 0.9;  transform: translateY(5px); }
        }
        @keyframes floatPolaroid {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(6px); }
        }
        button.bottom-24 { transition: opacity 0.5s ease, transform 0.5s ease; }
        body.video-oyniyor button.bottom-24 { opacity:0!important; pointer-events:none!important; transform:translateY(8px); }
        .vns-video { width:100%; height:100%; object-fit:cover; }
        @media (min-width:768px) { .vns-video { object-fit:contain; } }
      `}</style>

      {davetiye.muzik && videoFinal && <MuzikCalar muzikUrl={davetiye.muzik} renk={GOLD} />}

      {/* ══════════════════════════════════
          MÜHÜR OVERLAY
      ══════════════════════════════════ */}
      {sealVar && (
        <div onClick={onSealClick} style={{
          position: "fixed", inset: 0, zIndex: 45,
          cursor: "pointer",
          background: `
            radial-gradient(ellipse 55% 45% at 15% 20%, ${GOLD}10 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 85% 80%, ${PETAL}0C 0%, transparent 60%),
            radial-gradient(ellipse 80% 70% at 50% 50%, #FFFDF9 0%, #F2EAE0 100%)
          `,
          opacity: sealFading ? 0 : 1,
          transition: "opacity 1.2s ease",
          pointerEvents: sealFading ? "none" : "auto",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "clamp(28px,8vw,40px) clamp(16px,6vw,32px)",
          overflow: "hidden",
        }}>
          {/* Nişan Davetiyesi — çizgili başlık */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: "0.5px", background: `linear-gradient(to left, ${GOLD}50, transparent)` }} />
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.46em", color: GOLD, textTransform: "uppercase" }}>
              Nişan Davetiyesi
            </p>
            <div style={{ width: 48, height: "0.5px", background: `linear-gradient(to right, ${GOLD}50, transparent)` }} />
          </div>

          {/* İsimler */}
          <div style={{ marginBottom: 28, textAlign: "center", maxWidth: "90vw" }}>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,8.5vw,3.8rem)", color: WARM, lineHeight: 1.1, wordBreak: "break-word" }}>
              {isim1}
            </p>
            {isim2 && (
              <>
                <p style={{ fontFamily: "var(--font-lora),serif", fontStyle: "italic", fontSize: "clamp(1rem,4vw,1.5rem)", color: `${GOLD}CC`, lineHeight: 1, margin: "6px 0" }}>
                  &
                </p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,8.5vw,3.8rem)", color: WARM, lineHeight: 1.1, wordBreak: "break-word" }}>
                  {isim2}
                </p>
              </>
            )}
            {aileStr && (
              <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(10px,3vw,13px)", letterSpacing: "0.22em", color: `${WARM_MD}99`, textTransform: "uppercase", marginTop: 14 }}>
                {aileStr}
              </p>
            )}
          </div>

          {/* Mühür */}
          <WaxSeal size={180} onClick={onSealClick} />

          {/* İpucu */}
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14, animation: "glowPulse 2.4s ease-in-out infinite" }}>
            <div style={{ width: 40, height: "0.5px", background: `linear-gradient(to left, ${GOLD}70, transparent)` }} />
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(15px,4.5vw,20px)", fontStyle: "italic", fontWeight: 700, color: GOLD, letterSpacing: "0.22em", textShadow: `0 0 18px ${GOLD}70` }}>
              Mühüre Dokun
            </p>
            <div style={{ width: 40, height: "0.5px", background: `linear-gradient(to right, ${GOLD}70, transparent)` }} />
          </div>

          {/* Tarih */}
          {tarihKisa && (
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.18em", color: `${WARM}40`, marginTop: 20 }}>
              {tarihKisa}
            </p>
          )}
        </div>
      )}

      {/* ══════════════════════════════════
          SAYFA — video + davetiye içeriği
      ══════════════════════════════════ */}
      <div style={{ background: BG }}>

        {/* ── PREVIEW KAPAK — video yerine statik kapak (previewModu) ── */}
        {previewModu && (
          <section style={{
            height: "100svh", overflow: "hidden", position: "relative",
            background: `
              radial-gradient(ellipse 55% 45% at 15% 20%, ${GOLD}10 0%, transparent 65%),
              radial-gradient(ellipse 50% 40% at 85% 80%, ${PETAL}0C 0%, transparent 60%),
              radial-gradient(ellipse 80% 70% at 50% 50%, #FFFDF9 0%, #F2EAE0 100%)
            `,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "clamp(28px,8vw,40px) clamp(16px,6vw,32px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 48, height: "0.5px", background: `linear-gradient(to left, ${GOLD}50, transparent)` }} />
              <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.46em", color: GOLD, textTransform: "uppercase" }}>Nişan Davetiyesi</p>
              <div style={{ width: 48, height: "0.5px", background: `linear-gradient(to right, ${GOLD}50, transparent)` }} />
            </div>
            <div style={{ marginBottom: 28, textAlign: "center", maxWidth: "90vw" }}>
              <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,8.5vw,3.8rem)", color: WARM, lineHeight: 1.1, wordBreak: "break-word" }}>{isim1}</p>
              {isim2 && (
                <>
                  <p style={{ fontFamily: "var(--font-lora),serif", fontStyle: "italic", fontSize: "clamp(1rem,4vw,1.5rem)", color: `${GOLD}CC`, lineHeight: 1, margin: "6px 0" }}>&</p>
                  <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,8.5vw,3.8rem)", color: WARM, lineHeight: 1.1, wordBreak: "break-word" }}>{isim2}</p>
                </>
              )}
              {aileStr && (
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(10px,3vw,13px)", letterSpacing: "0.22em", color: `${WARM_MD}99`, textTransform: "uppercase", marginTop: 14 }}>{aileStr}</p>
              )}
            </div>
            <WaxSeal size={180} />
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: "0.5px", background: `linear-gradient(to left, ${GOLD}70, transparent)` }} />
              <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(15px,4.5vw,20px)", fontStyle: "italic", fontWeight: 700, color: GOLD, letterSpacing: "0.22em" }}>Mühüre Dokun</p>
              <div style={{ width: 40, height: "0.5px", background: `linear-gradient(to right, ${GOLD}70, transparent)` }} />
            </div>
            {tarihKisa && (
              <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.18em", color: `${WARM}40`, marginTop: 20 }}>{tarihKisa}</p>
            )}
          </section>
        )}

        {/* ── VİDEO HERO ── */}
        {!previewModu && (
          <section style={{ position: "relative", height: "100svh", overflow: "hidden", background: "#000" }}>
            <video
              ref={videoRef}
              src="/background.mp4"
              playsInline
              preload="auto"
              className="vns-video"
              style={{ position: "absolute", inset: 0 }}
              onTimeUpdate={() => {
                const v = videoRef.current;
                if (!v || isimlerGorunur || !v.duration) return;
                if (v.duration - v.currentTime <= 5) setIsimlerGorunur(true);
              }}
              onEnded={() => { setVideoFinal(true); }}
            />
            {/* Gradient */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: isimlerGorunur
                ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.52) 36%, rgba(0,0,0,0.08) 65%, transparent 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 55%)",
              transition: "background 1.4s ease",
            }} />
            {/* Vinyette */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.25) 100%)" }} />

            {/* Davetiye bilgileri — video üstünde */}
            {isimlerGorunur && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "clamp(80px,20svh,160px) 28px clamp(60px,10svh,100px)",
                pointerEvents: "none", textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.44em", color: "rgba(255,255,255,0.96)", textTransform: "uppercase", marginBottom: 14, animation: "fadeUp 0.7s ease 0.05s both", background: "rgba(0,0,0,0.32)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", padding: "5px 16px 5px 20px", borderRadius: 20 }}>
                  Nişan Davetiyesi
                </p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(3.2rem,13vw,6rem)", color: "#FFFFFF", lineHeight: 0.92, textShadow: "0 2px 40px rgba(0,0,0,0.95), 0 1px 8px rgba(0,0,0,1)", animation: "isimFadeUp 1s ease 0.15s both" }}>
                  {isim1}
                </p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.6rem,6vw,2.8rem)", color: PETAL_LT, lineHeight: 1.1, textShadow: "0 1px 20px rgba(0,0,0,0.95)", animation: "fadeUp 0.7s ease 0.3s both" }}>
                  &
                </p>
                {isim2 && (
                  <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(3.2rem,13vw,6rem)", color: "#FFFFFF", lineHeight: 0.92, marginBottom: 14, textShadow: "0 2px 40px rgba(0,0,0,0.95), 0 1px 8px rgba(0,0,0,1)", animation: "isimFadeUp 1s ease 0.42s both" }}>
                    {isim2}
                  </p>
                )}
                <div style={{ width: "clamp(100px,36vw,180px)", margin: "6px auto 14px", animation: "fadeUp 0.6s ease 0.55s both" }}>
                  <LuxuryDivider color="rgba(220,168,184,0.75)" />
                </div>
                {(tarihStr || saatStr || gunStr) && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(6px,2.5vw,14px)", flexWrap: "wrap", marginBottom: 7, animation: "fadeUp 0.7s ease 0.65s both" }}>
                    {tarihStr && <span style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(0.88rem,3vw,1.1rem)", color: "#FFFFFF", textShadow: "0 1px 12px rgba(0,0,0,1)" }}>{tarihStr}</span>}
                    {tarihStr && (gunStr || saatStr) && <span style={{ color: "rgba(200,174,221,0.65)", fontSize: 11 }}>·</span>}
                    {gunStr  && <span style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(0.88rem,3vw,1.1rem)", color: "#FFFFFF", textShadow: "0 1px 12px rgba(0,0,0,1)" }}>{gunStr}</span>}
                    {gunStr  && saatStr && <span style={{ color: "rgba(200,174,221,0.65)", fontSize: 11 }}>·</span>}
                    {saatStr  && <span style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(0.88rem,3vw,1.1rem)", color: "#FFFFFF", textShadow: "0 1px 12px rgba(0,0,0,1)" }}>{saatStr}</span>}
                  </div>
                )}
                {davetiye.mekan && (
                  <p style={{ fontFamily: "var(--font-lora),serif", fontStyle: "italic", fontSize: "clamp(0.82rem,2.8vw,1.05rem)", color: "rgba(220,192,240,0.95)", textShadow: "0 1px 14px rgba(0,0,0,1)", animation: "fadeUp 0.7s ease 0.75s both" }}>
                    {davetiye.mekan}
                  </p>
                )}
              </div>
            )}

            {/* Scroll ipucu */}
            {videoFinal && (
              <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, pointerEvents: "none", animation: "scrollFadeIn 1s ease 0.3s both" }}>
                <p style={{ fontFamily: "var(--font-lora),serif", fontStyle: "italic", fontWeight: 700, fontSize: 12, letterSpacing: "0.30em", color: GOLD, marginBottom: 6, textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
                  kaydır
                </p>
                {[0, 1, 2].map(i => (
                  <svg key={i} width="28" height="16" viewBox="0 0 28 16" fill="none"
                    style={{ display: "block", animation: `chevronFlow 1.6s ease-in-out ${i * 0.28}s infinite` }}>
                    <path d="M2 2L14 13L26 2" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════
            ETKİNLİK DETAYLARI — gece lüks
        ══════════════════════════════════ */}
        <section style={{ background: SHADOW, padding: "clamp(56px,14vw,100px) clamp(16px,5vw,24px) clamp(60px,14vw,110px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, opacity: 0.12 }}><NightWisteria side="left" /></div>
          <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.12 }}><NightWisteria side="right" /></div>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(90,50,140,0.14) 0%, transparent 70%)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.46em", color: `${GOLD}80`, textTransform: "uppercase", marginBottom: 44 }}>Etkinlik Detayları</p>

            {/* Gün + Tarih */}
            <div style={{ marginBottom: 16 }}>
              {gunStr && (
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(0.8rem,2.5vw,0.95rem)", letterSpacing: "0.2em", color: LILAC_LT, textTransform: "uppercase", marginBottom: 10 }}>
                  {gunStr}
                </p>
              )}
              <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(3rem,10vw,5.5rem)", color: GOLD_LT, lineHeight: 1 }}>
                {tarihStr ?? "—"}
              </p>
            </div>

            <div style={{ maxWidth: 220, margin: "28px auto" }}><LuxuryDivider color={GOLD + "70"} /></div>

            {/* Saat + Mekan — yan yana */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(20px,6vw,48px)", flexWrap: "nowrap", marginBottom: "clamp(32px,8vw,56px)", padding: "0 clamp(8px,4vw,16px)" }}>
              {saatStr && (
                <div style={{ textAlign: "center", flexShrink: 0, flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.36em", color: `${GOLD}65`, textTransform: "uppercase", marginBottom: 12 }}>Saat</p>
                  <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(1.6rem,5.5vw,2.4rem)", color: "#FEFCF8", lineHeight: 1.2 }}>{saatStr}</p>
                </div>
              )}
              {saatStr && davetiye.mekan && (
                <div style={{ width: 1, alignSelf: "stretch", minHeight: 60, flexShrink: 0, background: `${GOLD}22` }} />
              )}
              {davetiye.mekan && (
                <div style={{ minWidth: 0, textAlign: "center", flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.36em", color: `${GOLD}65`, textTransform: "uppercase", marginBottom: 12 }}>Mekan</p>
                  <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.6rem,5.5vw,2.4rem)", color: "#FEFCF8", lineHeight: 1.2, wordBreak: "break-word" }}>{davetiye.mekan}</p>
                </div>
              )}
            </div>

            {/* Harita */}
            {davetiye.mekan && (
              <div style={{ maxWidth: 560, margin: "0 auto", borderRadius: 16, overflow: "hidden", border: `1px solid ${GOLD}22`, boxShadow: "0 16px 48px rgba(0,0,0,0.35)" }}>
                <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="260" style={{ border: 0, display: "block" }} loading="lazy" allowFullScreen />
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════
            POLAROİD ANI ALBÜMÜ
        ══════════════════════════════════ */}
        {davetiye.albumAktif && (
          <section style={{ padding: "clamp(52px,12vw,90px) clamp(16px,5vw,24px) clamp(56px,12vw,100px)", textAlign: "center", background: BG_SOFT, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(201,168,64,0.07) 0%, transparent 70%)" }} />
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.44em", color: LILAC, textTransform: "uppercase", marginBottom: 12 }}>Bizim Hikayemiz</p>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(2.6rem,8vw,4rem)", color: WARM, lineHeight: 1.05, marginBottom: 12 }}>En Güzel Anlar</p>
            <div style={{ maxWidth: 200, margin: "0 auto 56px" }}><LuxuryDivider /></div>
            <div style={{ display: "flex", justifyContent: "center", minHeight: 360, marginBottom: 28 }}>
              <div style={{ position: "relative", width: "min(320px, 88vw)", height: 340 }}>
                {[
                  { top: 60, left: -10, rotate: -9, z: 1, delay: "0s",   dur: "6s",   src: davetiye.polaroid1, idx: 1 },
                  { top: 16, left: 60,  rotate: -2, z: 2, delay: "0.6s", dur: "6.5s", src: davetiye.polaroid2, idx: 2 },
                  { top: 46, left: 128, rotate: 7,  z: 3, delay: "1.1s", dur: "7s",   src: davetiye.polaroid3, idx: 3 },
                ].map(p => (
                  <div key={p.idx}
                    onMouseEnter={() => setAktifPolaroid(p.idx)}
                    onMouseLeave={() => setAktifPolaroid(null)}
                    onTouchStart={() => setAktifPolaroid(p.idx)}
                    style={{ position: "absolute", top: p.top, left: p.left, zIndex: aktifPolaroid === p.idx ? 10 : p.z, animation: `fadeUp 0.8s ease backwards ${p.delay}` }}>
                    <div style={{ animation: `floatPolaroid ${p.dur} ease-in-out infinite ${p.delay}` }}>
                      <Polaroid rotate={p.rotate} isActive={aktifPolaroid === p.idx} src={p.src ?? undefined} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: 16, color: `${WARM}45` }}>Sonsuz yolculuğun ilk adımları...</p>
          </section>
        )}

        {/* ══════════════════════════════════
            GERİ SAYIM — gece + altın
        ══════════════════════════════════ */}
        <section style={{ padding: "clamp(56px,14vw,100px) clamp(16px,5vw,24px)", textAlign: "center", background: DUSK, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(80,40,130,0.16) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.46em", color: `${GOLD}75`, textTransform: "uppercase", marginBottom: 14 }}>Nişana Kalan Süre</p>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,6vw,3rem)", color: "#FEFCF8", marginBottom: 52 }}>
              {tarihObj && tarihObj > new Date() ? "Sayıyoruz..." : "Kutlama Zamanı!"}
            </p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(8px,3vw,16px)", flexWrap: "wrap" }}>
              {[{ val: kalan.gun, lbl: "GÜN" }, { val: kalan.saat, lbl: "SAAT" }, { val: kalan.dakika, lbl: "DAKİKA" }, { val: kalan.saniye, lbl: "SANİYE" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "clamp(6px,2vw,14px)" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(3rem,9vw,5rem)", fontWeight: 600, color: GOLD_LT, lineHeight: 1, fontVariantNumeric: "tabular-nums", minWidth: "2ch", textShadow: `0 0 32px ${GOLD}50` }}>
                      {String(item.val).padStart(2, "0")}
                    </p>
                    <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.22em", color: LILAC_LT, marginTop: 10 }}>{item.lbl}</p>
                  </div>
                  {i < 3 && <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2rem,6vw,3.4rem)", color: `${PETAL}50`, lineHeight: 1.05, marginTop: 4 }}>:</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ DRESS CODE ══ */}
        {davetiye.dressKod && <DressCodeSection dressKod={davetiye.dressKod} dressKodRenkler={davetiye.dressKodRenkler} />}

        {/* ══════════════════════════════════
            RSVP — gece + kemer kart
        ══════════════════════════════════ */}
        <section style={{ background: SHADOW, padding: "clamp(48px,10vw,80px) clamp(12px,4vw,16px) clamp(56px,12vw,100px)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(80,40,130,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 400, margin: "0 auto" }}>
            <div style={{
              borderRadius: "200px 200px 16px 16px",
              border: `1px solid ${GOLD}35`,
              background: BG_CARD,
              boxShadow: "0 40px 120px rgba(0,0,0,0.45), 0 8px 32px rgba(92,52,140,0.20)",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: "10px 10px 0", borderRadius: "190px 190px 0 0", border: `0.5px solid ${GOLD}18`, pointerEvents: "none" }} />
              <div style={{ padding: "clamp(44px,12vw,68px) clamp(16px,6vw,32px) clamp(36px,10vw,56px)", textAlign: "center" }}>
                <GoldOrnament />
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.48em", color: GOLD, textTransform: "uppercase", marginBottom: 12 }}>Katılım Bildirimi</p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(2rem,7vw,3rem)", color: WARM, lineHeight: 1.1, marginBottom: 8 }}>Gelecek misiniz?</p>
                <LuxuryDivider />
                <div style={{ marginTop: 12 }}>
                  {previewModu ? <RsvpFormGarden davetiyeId={davetiye.id} /> : rsvpBileseni}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            FOOTER — sade kapanış
        ══════════════════════════════════ */}
        <footer style={{ background: BG, padding: "clamp(40px,10vw,64px) clamp(16px,5vw,24px) clamp(48px,10vw,72px)", textAlign: "center" }}>
          <div style={{ width: 48, height: 1, background: `${GOLD}50`, margin: "0 auto 40px" }} />
          <div style={{ textAlign: "center", maxWidth: "90vw", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,7vw,3.2rem)", color: WARM, lineHeight: 1.1, wordBreak: "break-word" }}>
              {isim1}
            </p>
            {isim2 && (
              <>
                <p style={{ fontFamily: "var(--font-lora),serif", fontStyle: "italic", fontSize: "clamp(0.9rem,3.5vw,1.3rem)", color: `${GOLD}CC`, lineHeight: 1, margin: "4px 0" }}>
                  &
                </p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,7vw,3.2rem)", color: WARM, lineHeight: 1.1, wordBreak: "break-word" }}>
                  {isim2}
                </p>
              </>
            )}
          </div>
          <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 13, letterSpacing: "0.32em", color: GOLD, textTransform: "uppercase", marginTop: 22, textShadow: `0 0 20px ${GOLD}55` }}>
            Sizi seviyoruz
          </p>
          {aileStr && (
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(10px,3vw,12px)", letterSpacing: "0.20em", color: `${WARM_MD}80`, textTransform: "uppercase", marginTop: 10 }}>
              {aileStr}
            </p>
          )}
        </footer>

        {/* ── DavetRota Rozeti ── */}
        {!previewModu && (
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", padding: "16px 16px 20px", textAlign: "center", background: "rgba(0,0,0,0.018)" }}>
            <a
              href="https://davetrota.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 11,
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                color: "rgba(0,0,0,0.28)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
              </svg>
              DavetRota ile oluşturuldu
            </a>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   RSVP FORMU
═══════════════════════════════════════════ */
function RsvpFormGarden({ davetiyeId }: { davetiyeId: string }) {
  const [adim, setAdim] = useState<"form"|"tamam">("form");
  const [form, setForm] = useState({ ad: "", katilim: "", sarkiDilegi: "" });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const fieldStyle: React.CSSProperties = { width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${LILAC_LT}60`, padding: "10px 0", fontSize: 14, fontFamily: "var(--font-lora),serif", color: WARM, outline: "none", boxSizing: "border-box", appearance: "none" as const };
  const labelStyle: React.CSSProperties = { fontFamily: "var(--font-lora),serif", fontSize: 12, letterSpacing: "0.10em", color: WARM, textTransform: "uppercase", display: "block", marginBottom: 6, marginTop: 20 };

  const gonder = async () => {
    if (!form.ad.trim()) { setHata("Lütfen adınızı girin."); return; }
    if (!form.katilim)   { setHata("Lütfen katılım durumunu seçin."); return; }
    setYukleniyor(true); setHata("");
    try {
      const res = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ davetiyeId, ad: form.ad, katilim: form.katilim === "evet", sarkiOnerisi: form.sarkiDilegi.trim() || undefined }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setHata(d.hata || "Bir hata oluştu."); return; }
      setAdim("tamam");
    } catch { setHata("Bir hata oluştu."); }
    finally { setYukleniyor(false); }
  };

  if (adim === "tamam") return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <p style={{ fontSize: 38, marginBottom: 12 }}>{form.katilim === "evet" ? "🌸" : "💙"}</p>
      <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "1.9rem", color: WARM, marginBottom: 8 }}>{form.katilim === "evet" ? "Görüşmek üzere!" : "Anlıyoruz..."}</p>
      <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 13, color: WARM_MD }}>{form.katilim === "evet" ? "Katılım bilginiz iletildi. Sizi görmek için sabırsızlanıyoruz!" : "Katılım durumunuz iletildi."}</p>
    </div>
  );

  return (
    <div>
      <label style={labelStyle}>ADINIZ SOYADINIZ</label>
      <input type="text" value={form.ad} onChange={e => setForm({ ...form, ad: e.target.value })} placeholder="örn. Selin Kaya" style={fieldStyle} />
      <label style={labelStyle}>KATILIM DURUMU</label>
      <select value={form.katilim} onChange={e => setForm({ ...form, katilim: e.target.value })} style={fieldStyle}>
        <option value="">Seçiniz</option>
        <option value="evet">Katılıyorum</option>
        <option value="hayir">Katılamıyorum</option>
      </select>
      <label style={labelStyle}>🎵 Şarkı dileğiniz <span style={{ textTransform: "none", letterSpacing: 0, fontSize: 10, color: WARM_MD }}>(isteğe bağlı)</span></label>
      <input type="text" value={form.sarkiDilegi} onChange={e => setForm({ ...form, sarkiDilegi: e.target.value })} placeholder="Dans pistindeki favori şarkınız?" maxLength={200} style={fieldStyle} />
      {hata && <p style={{ color: "#B91C1C", fontSize: 12, fontFamily: "var(--font-lora),serif", marginTop: 12 }}>{hata}</p>}
      <button onClick={gonder} disabled={yukleniyor} style={{ width: "100%", marginTop: 28, padding: "14px", background: `linear-gradient(135deg, ${LILAC} 0%, ${LILAC_MD} 100%)`, color: BG_CARD, border: "none", borderRadius: 8, fontFamily: "var(--font-lora),serif", fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase", cursor: yukleniyor ? "not-allowed" : "pointer", opacity: yukleniyor ? 0.7 : 1, boxShadow: `0 4px 20px ${LILAC}40` }}>
        {yukleniyor ? "GÖNDERİLİYOR..." : "BİLDİR"}
      </button>
      <p style={{ marginTop: 14, fontSize: 9.5, lineHeight: 1.7, fontFamily: "var(--font-lora),serif", color: `${WARM_MD}55`, textAlign: "center" }}>Girdiğiniz bilgiler yalnızca katılım bildirimini davet sahibine iletmek amacıyla işlenmekte ve etkinlik tarihinden itibaren 1 yıl içinde silinmektedir.</p>
    </div>
  );
}

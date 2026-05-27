"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect, useRef } from "react";
import MuzikCalar from "@/components/MuzikCalar";

/* ════════════════ FINE ART PALET ════════════════ */
const PEARL      = "#FCFBF9";
const CHAMPAGNE  = "#F4EFE6";
const ALABASTER  = "#EAE6DF";
const GOLD_DARK  = "#9E8755";
const GOLD       = "#C2A878";
const TEXT_DARK  = "#242424";
const TEXT_MUTED = "#6B6A65";
const SAGE       = "#859082";

/* ════════════════ YARDIMCI BİLEŞENLER ════════════════ */

/* Zarif Altın Ayırıcı */
function FineArtDivider({ width = 140 }: { width?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "30px auto", width }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD}80)` }} />
      <div style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD_DARK, opacity: 0.8 }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD}80)` }} />
    </div>
  );
}

/* Minimal Yaprak Süsü */
function LeafOrnament() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: "0 auto 16px", display: "block", opacity: 0.7 }}>
      <path d="M20 5 C20 5 30 10 30 20 C30 30 20 35 20 35 C20 35 10 30 10 20 C10 10 20 5 20 5 Z" stroke={GOLD_DARK} strokeWidth="1" fill="none" />
      <line x1="20" y1="5" x2="20" y2="35" stroke={GOLD_DARK} strokeWidth="1" />
    </svg>
  );
}

/* Wax Seal (Mühür) */
function WaxSeal({ size = 160, onClick }: { size?: number; onClick?: () => void }) {
  const [tapped, setTapped] = useState(false);
  const handle = () => { if (tapped) return; setTapped(true); onClick?.(); };
  return (
    <div onClick={handle} style={{
      width: size, height: size,
      cursor: onClick ? "pointer" : "default",
      animation: tapped ? "sealTap 0.5s ease forwards" : "sealFloat 4s ease-in-out infinite",
      filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))",
      margin: "0 auto"
    }}>
      <img src="/wax-seal.png" alt="Mühür" style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
    </div>
  );
}

/* Polaroid (Fine Art Galeri Stili) */
function Polaroid({ rotate = 0, isActive = false, src }: { rotate?: number; isActive?: boolean; src?: string }) {
  const [imgErr, setImgErr] = useState(false);
  const valid = src && (src.startsWith("http://") || src.startsWith("https://"));
  return (
    <div style={{
      background: "#FFFFFF",
      padding: "10px 10px 36px",
      border: `1px solid ${ALABASTER}`,
      transform: isActive ? `rotate(${rotate}deg) scale(1.05)` : `rotate(${rotate}deg) scale(1)`,
      boxShadow: isActive ? "0 20px 40px rgba(0,0,0,0.12)" : "0 10px 25px rgba(0,0,0,0.06)",
      width: 240, flexShrink: 0,
      transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
      cursor: "pointer",
    }}>
      <div style={{ width: "100%", height: 280, overflow: "hidden", background: CHAMPAGNE }}>
        {valid && !imgErr ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgErr(true)} /> : <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:GOLD}}><LeafOrnament/></div>}
      </div>
    </div>
  );
}

/* Dress Code disk */
function SwatchDisk({ renk }: { renk: string }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      width: 44, height: 44, borderRadius: "50%", background: renk,
      boxShadow: h ? `0 0 0 1px ${PEARL}, 0 0 0 3px ${renk}80` : `0 4px 10px rgba(0,0,0,0.05)`,
      transform: h ? "scale(1.1)" : "scale(1)",
      transition: "all 0.3s ease", cursor: "default", flexShrink: 0,
    }} />
  );
}

/* Dress Code section */
function DressCodeSection({ dressKod, dressKodRenkler }: { dressKod: string; dressKodRenkler: string | null }) {
  let renkler = [GOLD, SAGE, TEXT_DARK, CHAMPAGNE];
  try {
    const p = JSON.parse(dressKodRenkler ?? "[]");
    if (Array.isArray(p) && p.length >= 3) renkler = p.slice(0, 5);
  } catch { /* varsayılan */ }
  return (
    <section style={{ padding: "100px 24px", textAlign: "center", background: CHAMPAGNE }}>
      <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.4em", color: GOLD_DARK, textTransform: "uppercase", marginBottom: 12 }}>Dress Code</p>
      <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(2rem,7vw,3.5rem)", color: TEXT_DARK, lineHeight: 1.2, marginBottom: 16 }}>Gecenin Renkleri</p>
      <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "clamp(0.95rem,3vw,1.1rem)", color: TEXT_MUTED, marginBottom: 30, maxWidth: 400, margin: "0 auto 30px" }}>{dressKod}</p>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: 30 }}>
        {renkler.map((r, i) => <SwatchDisk key={i} renk={r} />)}
      </div>
      <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 12, fontStyle: "italic", color: TEXT_MUTED, maxWidth: 300, margin: "0 auto", lineHeight: 1.8 }}>
        Sizleri bu uyumun bir parçası olarak görmekten mutluluk duyarız.
      </p>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ANA BİLEŞEN
═══════════════════════════════════════════ */
export default function VintageNisanSablon({ davetiye, previewModu }: SablonProps) {
  const [sealVar, setSealVar]       = useState(!previewModu);
  const [sealFading, setSealFading] = useState(false);
  const [isimlerGorunur, setIsimlerGorunur] = useState(false);
  const [videoFinal, setVideoFinal]         = useState(false);
  const [aktifPolaroid, setAktifPolaroid]   = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tarihObj  = davetiye.tarih ? new Date(davetiye.tarih) : null;
  const tarihStr  = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : null;
  const tarihKisa = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase() : null;
  const saatStr   = tarihObj ? tarihObj.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : null;
  const gunStr    = tarihObj ? tarihObj.toLocaleDateString("tr-TR", { weekday: "long" }) : null;

  const calc = () => {
    if (!tarihObj) return { gun: 0, saat: 0, dakika: 0, saniye: 0 };
    const f = tarihObj.getTime() - Date.now();
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
  }, [tarihObj]);

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

  const isim1 = davetiye.kisi1 || davetiye.baslik.split(/[&ve]/i)[0]?.trim() || davetiye.baslik;
  const isim2 = davetiye.kisi2 || davetiye.baslik.split(/[&ve]/i)[1]?.trim() || null;

  const onSealClick = () => {
    const v = videoRef.current;
    setSealFading(true);
    if (v) v.play().catch(() => {});
    setTimeout(() => setSealVar(false), 1200);
  };

  return (
    <>
      <style>{`
        @keyframes sealFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes sealTap {
          0%   { transform: scale(1); }
          50%  { transform: scale(0.92); opacity: 0.8; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes isimFadeUp {
          0%   { opacity: 0; filter: blur(4px); transform: translateY(15px); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; transform: translateY(0); }
          50%     { opacity: 0.8; transform: translateY(6px); }
        }
        button.bottom-24 { transition: opacity 0.5s ease, transform 0.5s ease; }
        body.video-oyniyor button.bottom-24 { opacity:0!important; pointer-events:none!important; transform:translateY(8px); }
        .vns-video { width:100%; height:100%; object-fit:cover; }
        @media (min-width:768px) { .vns-video { object-fit:contain; } }
      `}</style>

      {davetiye.muzik && videoFinal && <MuzikCalar muzikUrl={davetiye.muzik} renk={GOLD_DARK} />}

      {/* ══════════════════════════════════
          MÜHÜR OVERLAY — Zarif Zarf
      ══════════════════════════════════ */}
      {sealVar && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 45,
          background: PEARL,
          opacity: sealFading ? 0 : 1,
          transition: "opacity 1.2s ease",
          pointerEvents: sealFading ? "none" : "auto",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "40px 24px",
        }}>
          
          <div style={{ padding: "40px", border: `1px solid ${ALABASTER}`, borderRadius: "4px", background: "#FFFFFF", boxShadow: "0 25px 50px rgba(0,0,0,0.03)", width: "100%", maxWidth: "400px" }}>
            <LeafOrnament />
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 30 }}>
              Nişan Davetiyesi
            </p>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.5rem,8vw,4rem)", color: TEXT_DARK, lineHeight: 1.1 }}>
              {isim1}
            </p>
            {isim2 && (
              <>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.5rem,5vw,2rem)", color: GOLD_DARK, margin: "10px 0" }}>&</p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.5rem,8vw,4rem)", color: TEXT_DARK, lineHeight: 1.1, marginBottom: 40 }}>
                  {isim2}
                </p>
              </>
            )}
            
            <div style={{ marginTop: 20 }}>
              <WaxSeal size={110} onClick={onSealClick} />
            </div>
            
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, fontStyle: "italic", color: TEXT_MUTED, letterSpacing: "0.1em", marginTop: 24, opacity: 0.7 }}>
              Zarfı açmak için mühüre dokunun
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          SAYFA — Zarafet Odaklı Tasarım
      ══════════════════════════════════ */}
      <div style={{ background: PEARL, color: TEXT_DARK }}>

        {/* ── VİDEO HERO ── */}
        {!previewModu && (
          <section style={{ position: "relative", height: "100svh", overflow: "hidden", background: CHAMPAGNE }}>
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
            {/* Soft Overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: isimlerGorunur
                ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 40%)",
              transition: "background 2s ease",
            }} />

            {isimlerGorunur && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
                padding: "40px 24px 12vh",
                pointerEvents: "none", textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(3.5rem,12vw,6rem)", color: "#FFFFFF", lineHeight: 1, textShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "isimFadeUp 1.5s ease 0.2s both" }}>
                  {isim1}
                </p>
                {isim2 && (
                  <>
                    <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.8rem,6vw,2.5rem)", color: GOLD, margin: "8px 0", animation: "fadeUp 1.2s ease 0.6s both" }}>&</p>
                    <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(3.5rem,12vw,6rem)", color: "#FFFFFF", lineHeight: 1, textShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "isimFadeUp 1.5s ease 0.8s both" }}>
                      {isim2}
                    </p>
                  </>
                )}
                
                <div style={{ width: "120px", height: "1px", background: "rgba(255,255,255,0.4)", margin: "30px auto 20px", animation: "fadeUp 1s ease 1.2s both" }} />
                
                {(tarihStr || saatStr) && (
                  <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "1rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", animation: "fadeUp 1s ease 1.4s both" }}>
                    {tarihStr} {saatStr && `| ${saatStr}`}
                  </p>
                )}
              </div>
            )}

            {videoFinal && (
              <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: "1px", height: 40, background: "rgba(255,255,255,0.5)", animation: "scrollPulse 2s infinite" }} />
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════
            ETKİNLİK DETAYLARI
        ══════════════════════════════════ */}
        <section style={{ padding: "120px 24px", textAlign: "center" }}>
          <LeafOrnament />
          <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: GOLD_DARK, textTransform: "uppercase", marginBottom: 20 }}>Davet</p>
          <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.5rem,4vw,2.2rem)", color: TEXT_DARK, lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 60px" }}>
            Hayatımızı birleştirdiğimiz bu özel ve anlamlı günde, mutluluğumuzu sizinle paylaşmaktan onur duyarız.
          </p>

          <FineArtDivider />

          <div style={{ margin: "50px 0" }}>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.5rem,8vw,4rem)", color: TEXT_DARK, lineHeight: 1 }}>
              {tarihStr ?? "—"}
            </p>
            {gunStr && <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "1rem", color: TEXT_MUTED, marginTop: 12, letterSpacing: "0.1em" }}>{gunStr}</p>}
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(30px,8vw,80px)", flexWrap: "wrap", marginBottom: 60 }}>
            {saatStr && (
              <div>
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.2em", color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 12 }}>Saat</p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "2rem", color: TEXT_DARK }}>{saatStr}</p>
              </div>
            )}
            {saatStr && davetiye.mekan && (
              <div style={{ width: 1, height: 60, background: ALABASTER, alignSelf: "center" }} />
            )}
            {davetiye.mekan && (
              <div style={{ maxWidth: 260 }}>
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.2em", color: TEXT_MUTED, textTransform: "uppercase", marginBottom: 12 }}>Mekan</p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "1.4rem", color: TEXT_DARK, lineHeight: 1.4 }}>{davetiye.mekan}</p>
              </div>
            )}
          </div>

          {davetiye.mekan && (
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "10px", background: "#FFF", border: `1px solid ${ALABASTER}`, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}>
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="300" style={{ border: 0, display: "block", filter: "grayscale(0.4) contrast(1.1)" }} loading="lazy" allowFullScreen />
            </div>
          )}
        </section>

        {/* ══════════════════════════════════
            POLAROİD (FİNE ART GALERİ)
        ══════════════════════════════════ */}
        {davetiye.albumAktif && (
          <section style={{ padding: "100px 24px", textAlign: "center", background: CHAMPAGNE, borderTop: `1px solid ${ALABASTER}`, borderBottom: `1px solid ${ALABASTER}` }}>
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: GOLD_DARK, textTransform: "uppercase", marginBottom: 12 }}>Bizim Hikayemiz</p>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(2.2rem,7vw,3.5rem)", color: TEXT_DARK, marginBottom: 50 }}>En Güzel Anlar</p>
            
            <div style={{ display: "flex", justifyContent: "center", minHeight: 420 }}>
              <div style={{ position: "relative", width: 340, height: 380 }}>
                {[
                  { top: 40, left: -20, rotate: -6, z: 1, src: davetiye.polaroid1, idx: 1 },
                  { top: 0,  left: 50,  rotate: 2,  z: 2, src: davetiye.polaroid2, idx: 2 },
                  { top: 60, left: 120, rotate: 8,  z: 3, src: davetiye.polaroid3, idx: 3 },
                ].map(p => (
                  <div key={p.idx}
                    onMouseEnter={() => setAktifPolaroid(p.idx)}
                    onMouseLeave={() => setAktifPolaroid(null)}
                    onTouchStart={() => setAktifPolaroid(p.idx)}
                    style={{ position: "absolute", top: p.top, left: p.left, zIndex: aktifPolaroid === p.idx ? 10 : p.z }}>
                    <Polaroid rotate={p.rotate} isActive={aktifPolaroid === p.idx} src={p.src ?? undefined} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════
            GERİ SAYIM
        ══════════════════════════════════ */}
        <section style={{ padding: "100px 24px", textAlign: "center" }}>
          <FineArtDivider width={80} />
          <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: TEXT_MUTED, textTransform: "uppercase", marginTop: 30, marginBottom: 40 }}>Büyük Güne Kalan Süre</p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(15px,4vw,40px)", flexWrap: "wrap" }}>
            {[{ val: kalan.gun, lbl: "GÜN" }, { val: kalan.saat, lbl: "SAAT" }, { val: kalan.dakika, lbl: "DAKİKA" }, { val: kalan.saniye, lbl: "SANİYE" }].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.5rem,8vw,4rem)", color: TEXT_DARK, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {String(item.val).padStart(2, "0")}
                </p>
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.2em", color: GOLD_DARK, marginTop: 12 }}>{item.lbl}</p>
              </div>
            ))}
          </div>
        </section>

        {davetiye.dressKod && <DressCodeSection dressKod={davetiye.dressKod} dressKodRenkler={davetiye.dressKodRenkler} />}

        {/* ══════════════════════════════════
            RSVP (KATILIM BİLDİRİMİ)
        ══════════════════════════════════ */}
        <section style={{ padding: "100px 16px 120px", background: CHAMPAGNE, borderTop: `1px solid ${ALABASTER}` }}>
          <div style={{ maxWidth: 460, margin: "0 auto", background: "#FFFFFF", padding: "60px 40px", border: `1px solid ${ALABASTER}`, boxShadow: "0 30px 60px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: GOLD_DARK, textTransform: "uppercase", marginBottom: 12 }}>LCV</p>
              <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "2rem", color: TEXT_DARK }}>Katılım Durumu</p>
            </div>
            <RsvpFormGarden davetiyeId={davetiye.id} />
          </div>
        </section>

        {/* ══════════════════════════════════
            FOOTER
        ══════════════════════════════════ */}
        <footer style={{ padding: "80px 24px", textAlign: "center", background: TEXT_DARK, color: PEARL }}>
          <LeafOrnament />
          <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.5rem,8vw,4rem)", lineHeight: 1, marginTop: 30 }}>
            {isim1} <span style={{ color: GOLD, fontStyle: "italic", margin: "0 10px" }}>&</span> {isim2}
          </p>
          <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "0.9rem", color: "rgba(252,251,249,0.5)", marginTop: 40, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Sizi aramızda görmekten mutluluk duyacağız
          </p>
        </footer>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   RSVP FORMU
═══════════════════════════════════════════ */
function RsvpFormGarden({ davetiyeId }: { davetiyeId: string }) {
  const [adim, setAdim] = useState<"form"|"tamam">("form");
  const [form, setForm] = useState({ ad: "", kisiSayisi: "1", katilim: "", sarkiDilegi: "" });
  const [secilenDiyet, setSecilenDiyet] = useState<string[]>([]);
  const toggleDiyet = (k: string) => setSecilenDiyet(p => p.includes(k) ? p.filter(d => d !== k) : [...p, k]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [ekBilgiAcik, setEkBilgiAcik] = useState(false);

  const fieldStyle: React.CSSProperties = { width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${ALABASTER}`, padding: "12px 0", fontSize: 15, fontFamily: "var(--font-lora),serif", color: TEXT_DARK, outline: "none", boxSizing: "border-box", appearance: "none" as const, transition: "border-color 0.3s ease" };
  const labelStyle: React.CSSProperties = { fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.2em", color: TEXT_MUTED, textTransform: "uppercase", display: "block", marginBottom: 4, marginTop: 24 };

  const gonder = async () => {
    if (!form.ad.trim()) { setHata("Lütfen adınızı girin."); return; }
    if (!form.katilim)   { setHata("Lütfen katılım durumunu seçin."); return; }
    setYukleniyor(true); setHata("");
    try {
      const res = await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ davetiyeId, ad: form.ad, katilim: form.katilim === "evet", kisiSayisi: Number(form.kisiSayisi), diyet: secilenDiyet.length > 0 ? secilenDiyet.join(",") : undefined, sarkiOnerisi: form.sarkiDilegi.trim() || undefined }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); setHata(d.hata || "Bir hata oluştu."); return; }
      setAdim("tamam");
    } catch { setHata("Bir hata oluştu."); }
    finally { setYukleniyor(false); }
  };

  if (adim === "tamam") return (
    <div style={{ textAlign: "center", padding: "30px 0" }}>
      <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "2rem", color: TEXT_DARK, marginBottom: 16 }}>{form.katilim === "evet" ? "Teşekkür Ederiz" : "Anlıyoruz..."}</p>
      <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6 }}>{form.katilim === "evet" ? "Katılım bilginiz sevgiyle iletildi. O gün görüşmek dileğiyle!" : "Durumunuz iletildi. Kalplerimiz bir."}</p>
    </div>
  );

  return (
    <div style={{ textAlign: "left" }}>
      <label style={labelStyle}>Adınız Soyadınız</label>
      <input type="text" value={form.ad} onChange={e => setForm({ ...form, ad: e.target.value })} placeholder="örn. Selin Kaya" style={fieldStyle} />
      
      <label style={labelStyle}>Kişi Sayısı</label>
      <select value={form.kisiSayisi} onChange={e => setForm({ ...form, kisiSayisi: e.target.value })} style={fieldStyle}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Kişi</option>)}</select>
      
      <label style={labelStyle}>Katılım Durumu</label>
      <select value={form.katilim} onChange={e => setForm({ ...form, katilim: e.target.value })} style={fieldStyle}>
        <option value="">Lütfen seçiniz</option>
        <option value="evet">Zevkle katılacağım</option>
        <option value="hayir">Maalesef katılamayacağım</option>
      </select>

      <div style={{ marginTop: 30, borderTop: `1px solid ${ALABASTER}`, paddingTop: 10 }}>
        <button type="button" onClick={() => setEkBilgiAcik(!ekBilgiAcik)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-lora),serif", color: TEXT_DARK }}>
          <span style={{ fontSize: 13, letterSpacing: "0.05em" }}>Ek Bilgi / Not Ekle</span>
          <span style={{ fontSize: 16, color: GOLD_DARK, transform: ekBilgiAcik ? "rotate(45deg)" : "none", transition: "transform 0.3s" }}>+</span>
        </button>
        {ekBilgiAcik && (
          <div style={{ paddingBottom: 10, animation: "fadeUp 0.4s ease" }}>
            {form.katilim === "evet" && (
              <div style={{ marginTop: 10 }}>
                <label style={labelStyle}>Diyet Tercihleri <span style={{ textTransform: "none", letterSpacing: 0 }}>(isteğe bağlı)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {[{ k: "vegan", l: "Vegan" }, { k: "vejetaryen", l: "Vejetaryen" }, { k: "glutensiz", l: "Glutensiz" }].map(opt => (
                    <button key={opt.k} type="button" onClick={() => toggleDiyet(opt.k)} style={{ padding: "8px 16px", borderRadius: 0, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-lora),serif", border: `1px solid ${secilenDiyet.includes(opt.k) ? GOLD_DARK : ALABASTER}`, color: secilenDiyet.includes(opt.k) ? "#FFF" : TEXT_MUTED, background: secilenDiyet.includes(opt.k) ? GOLD_DARK : "transparent", transition: "all 0.2s" }}>{opt.l}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <label style={labelStyle}>Şarkı Dileğiniz <span style={{ textTransform: "none", letterSpacing: 0 }}>(isteğe bağlı)</span></label>
              <input type="text" value={form.sarkiDilegi} onChange={e => setForm({ ...form, sarkiDilegi: e.target.value })} placeholder="Dans pistindeki favori şarkınız?" maxLength={200} style={fieldStyle} />
            </div>
          </div>
        )}
      </div>

      {hata && <p style={{ color: "#9E3C3C", fontSize: 13, fontFamily: "var(--font-lora),serif", marginTop: 16, textAlign: "center" }}>{hata}</p>}
      
      <button onClick={gonder} disabled={yukleniyor} style={{ width: "100%", marginTop: 40, padding: "16px", background: TEXT_DARK, color: PEARL, border: "none", fontFamily: "var(--font-lora),serif", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", cursor: yukleniyor ? "not-allowed" : "pointer", opacity: yukleniyor ? 0.7 : 1, transition: "background 0.3s ease" }}>
        {yukleniyor ? "GÖNDERİLİYOR..." : "YANITI İLET"}
      </button>
    </div>
  );
}
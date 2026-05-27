"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect, useRef } from "react";
import MuzikCalar from "@/components/MuzikCalar";

/* ════════════════ FINE ART & BOTANİKAL PALET ════════════════ */
// Renkler tamamen video ve mühürden çekildi
const PAPER       = "#F9F8F5"; // Mühürün krem tonu
const PAPER_DARK  = "#F0EBE1";
const WISTERIA    = "#9A7E9F"; // Mor salkım tonu
const IVY_GREEN   = "#4A5D4E"; // Sarmaşık yeşili (Metinler için ana renk)
const IVY_LIGHT   = "#7B8E7D";
const GOLDEN_SUN  = "#D4AF37"; // Güneş ışığı
const BLUSH       = "#D9A0A8"; // Çelenkteki pembe çiçekler

/* ════════════════ YARDIMCI BİLEŞENLER ════════════════ */

/* Zarif Botanik Ayırıcı */
function EtherealDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "40px auto", width: "100%", maxWidth: 200 }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${IVY_LIGHT}50)` }} />
      <div style={{ width: 6, height: 6, borderRadius: "50%", border: `1px solid ${WISTERIA}`, background: "transparent" }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${IVY_LIGHT}50)` }} />
    </div>
  );
}

/* Wax Seal (Gönderilen Beyaz Mühür) */
function WaxSeal({ size = 180, onClick }: { size?: number; onClick?: () => void }) {
  const [tapped, setTapped] = useState(false);
  const handle = () => { if (tapped) return; setTapped(true); onClick?.(); };
  return (
    <div onClick={handle} style={{
      width: size, height: size,
      cursor: onClick ? "pointer" : "default",
      animation: tapped ? "sealTap 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards" : "sealFloat 5s ease-in-out infinite",
      filter: "drop-shadow(0 20px 40px rgba(74, 93, 78, 0.15))", // Sarmaşık yeşili tonunda çok hafif gölge
      margin: "0 auto",
      position: "relative",
      zIndex: 10
    }}>
      {/* Kullanıcının yüklediği mühür resmi (wax-seal.jpg) */}
      <img src="/wax-seal.jpg" alt="Mühür" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} draggable={false} />
    </div>
  );
}

/* Polaroid (Cam Efektli Fine Art Albüm) */
function Polaroid({ rotate = 0, isActive = false, src }: { rotate?: number; isActive?: boolean; src?: string }) {
  const [imgErr, setImgErr] = useState(false);
  const valid = src && (src.startsWith("http://") || src.startsWith("https://"));
  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      padding: "12px 12px 40px",
      borderRadius: "4px",
      border: `1px solid rgba(255,255,255,0.6)`,
      transform: isActive ? `rotate(${rotate}deg) scale(1.08)` : `rotate(${rotate}deg) scale(1)`,
      boxShadow: isActive ? "0 30px 60px rgba(74, 93, 78, 0.15)" : "0 15px 35px rgba(0,0,0,0.06)",
      width: 260, flexShrink: 0,
      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      cursor: "pointer",
    }}>
      <div style={{ width: "100%", height: 300, overflow: "hidden", background: PAPER_DARK, borderRadius: "2px" }}>
        {valid && !imgErr ? (
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setImgErr(true)} />
        ) : (
          <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color: IVY_LIGHT, fontFamily: "var(--font-playfair),serif", fontStyle: "italic"}}>
            En Güzel An
          </div>
        )}
      </div>
    </div>
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
    setTimeout(() => setSealVar(false), 1400); // Daha yavaş ve zarif geçiş
  };

  return (
    <>
      <style>{`
        @keyframes sealFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes sealTap {
          0%   { transform: scale(1); filter: drop-shadow(0 20px 40px rgba(74, 93, 78, 0.15)); }
          40%  { transform: scale(0.95); opacity: 1; filter: drop-shadow(0 5px 10px rgba(74, 93, 78, 0.1)); }
          100% { transform: scale(1.15); opacity: 0; filter: drop-shadow(0 0 0 transparent); }
        }
        @keyframes fadeUpEthereal {
          from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes letterSpaceIn {
          from { opacity: 0; letter-spacing: 0.8em; }
          to   { opacity: 1; letter-spacing: 0.4em; }
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.4; transform: scaleY(1); transform-origin: top; }
          50%     { opacity: 0.9; transform: scaleY(1.5); transform-origin: top; }
        }
        /* Özel doku (Noise effect) - Fine Art Hissi */
        .fine-art-grain {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none; z-index: 50; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        body.video-oyniyor button.bottom-24 { opacity:0!important; pointer-events:none!important; transform:translateY(8px); }
        .vns-video { width:100%; height:100%; object-fit:cover; }
        @media (min-width:768px) { .vns-video { object-fit:contain; } }
      `}</style>

      <div className="fine-art-grain" />

      {davetiye.muzik && videoFinal && <MuzikCalar muzikUrl={davetiye.muzik} renk={WISTERIA} />}

      {/* ══════════════════════════════════
          MÜHÜR OVERLAY — Yüksek Kalite Krem Zarf
      ══════════════════════════════════ */}
      {sealVar && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 45,
          background: PAPER,
          backgroundImage: "radial-gradient(circle at center, #FFFFFF 0%, #F4F1EA 100%)",
          opacity: sealFading ? 0 : 1,
          transition: "opacity 1.4s ease-in-out",
          pointerEvents: sealFading ? "none" : "auto",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "40px 24px",
        }}>
          
          <div style={{ animation: "fadeUpEthereal 1.5s ease-out" }}>
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.4em", color: IVY_LIGHT, textTransform: "uppercase", marginBottom: 36 }}>
              Lütfen Zarfı Açınız
            </p>
            
            <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.8rem,10vw,4.5rem)", color: IVY_GREEN, lineHeight: 1 }}>
              {isim1}
            </p>
            {isim2 && (
              <>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.6rem,5vw,2.2rem)", color: WISTERIA, margin: "12px 0" }}>ile</p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.8rem,10vw,4.5rem)", color: IVY_GREEN, lineHeight: 1, marginBottom: 50 }}>
                  {isim2}
                </p>
              </>
            )}
            
            <WaxSeal size={150} onClick={onSealClick} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════
          SAYFA — Ethereal Botanical Tasarım
      ══════════════════════════════════ */}
      <div style={{ background: PAPER, color: IVY_GREEN, overflowX: "hidden" }}>

        {/* ── VİDEO HERO ── */}
        {!previewModu && (
          <section style={{ position: "relative", height: "100svh", overflow: "hidden", background: IVY_GREEN }}>
            <video
              ref={videoRef}
              src="/background.mp4" // Kullanıcının gönderdiği muazzam video
              playsInline
              preload="auto"
              className="vns-video"
              style={{ position: "absolute", inset: 0 }}
              onTimeUpdate={() => {
                const v = videoRef.current;
                if (!v || isimlerGorunur || !v.duration) return;
                // Kapı açılıp bahçe görünmeye başladığında (yaklaşık 5.5 - 6. saniye) metin belirmeli
                if (v.currentTime >= 5.5) setIsimlerGorunur(true);
              }}
              onEnded={() => { setVideoFinal(true); }}
            />
            
            {/* Alt kısıma çok zarif, belli belirsiz bir gölge (yazı okunsun diye, videoyu kapatmadan) */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: isimlerGorunur
                ? "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 30%, transparent 60%)"
                : "linear-gradient(to top, rgba(0,0,0,0) 0%, transparent 100%)",
              transition: "background 2.5s ease-in-out",
            }} />

            {/* Davetiye bilgileri — Videonun Alt Kısmında */}
            {isimlerGorunur && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end",
                padding: "24px 24px 10svh",
                pointerEvents: "none", textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.4em", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.5)", marginBottom: 16, animation: "letterSpaceIn 2s ease-out both" }}>
                  Nişan Töreni
                </p>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(3.5rem,13vw,6.5rem)", color: "#FFFFFF", lineHeight: 0.9, textShadow: "0 4px 25px rgba(0,0,0,0.6)", animation: "fadeUpEthereal 2s ease-out 0.5s both" }}>
                    {isim1}
                  </p>
                  {isim2 && (
                    <>
                      <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(2rem,6vw,3rem)", color: BLUSH, margin: "2px 0", textShadow: "0 2px 15px rgba(0,0,0,0.5)", animation: "fadeUpEthereal 2s ease-out 1s both" }}>&</p>
                      <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(3.5rem,13vw,6.5rem)", color: "#FFFFFF", lineHeight: 0.9, textShadow: "0 4px 25px rgba(0,0,0,0.6)", animation: "fadeUpEthereal 2s ease-out 1.5s both" }}>
                        {isim2}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Scroll İpucu */}
            {videoFinal && (
              <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", animation: "fadeUpEthereal 2s ease-out 1s both" }}>
                <div style={{ width: 1, height: 50, background: "rgba(255,255,255,0.6)", animation: "scrollPulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite" }} />
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════
            ETKİNLİK DETAYLARI — Ferah & Okunaklı
        ══════════════════════════════════ */}
        <section style={{ padding: "140px 24px", textAlign: "center", position: "relative" }}>
          {/* Arka planda çok silik mor salkım renk dokunuşu */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "500px", background: `linear-gradient(to bottom, ${WISTERIA}08, transparent)`, pointerEvents: "none" }} />
          
          <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.4em", color: IVY_LIGHT, textTransform: "uppercase", marginBottom: 24 }}>Davetlisiniz</p>
          <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(1.6rem,5vw,2.4rem)", color: IVY_GREEN, lineHeight: 1.6, maxWidth: "650px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            Güneşin çiçekleri açtırdığı gibi, sevgimizin yeşerdiği bu özel günü sizlerle paylaşmaktan sonsuz mutluluk duyacağız.
          </p>

          <EtherealDivider />

          <div style={{ margin: "60px 0" }}>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(2.8rem,9vw,4.5rem)", color: IVY_GREEN, lineHeight: 1 }}>
              {tarihStr ?? "—"}
            </p>
            {gunStr && <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "1.1rem", color: WISTERIA, marginTop: 16, letterSpacing: "0.15em", fontStyle: "italic" }}>{gunStr}</p>}
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(40px,10vw,100px)", flexWrap: "wrap", marginBottom: 80 }}>
            {saatStr && (
              <div>
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: IVY_LIGHT, textTransform: "uppercase", marginBottom: 12 }}>Saat</p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "2.2rem", color: IVY_GREEN }}>{saatStr}</p>
              </div>
            )}
            {davetiye.mekan && (
              <div style={{ maxWidth: 300 }}>
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: IVY_LIGHT, textTransform: "uppercase", marginBottom: 12 }}>Mekan</p>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "1.6rem", color: IVY_GREEN, lineHeight: 1.4 }}>{davetiye.mekan}</p>
              </div>
            )}
          </div>

          {davetiye.mekan && (
            <div style={{ maxWidth: 700, margin: "0 auto", padding: "8px", background: "#FFFFFF", borderRadius: "8px", boxShadow: "0 30px 60px rgba(74, 93, 78, 0.08)" }}>
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="350" style={{ border: 0, borderRadius: "4px", display: "block", filter: "contrast(1.05) sepia(0.1)" }} loading="lazy" allowFullScreen />
            </div>
          )}
        </section>

        {/* ══════════════════════════════════
            POLAROİD (FİNE ART ALBÜM)
        ══════════════════════════════════ */}
        {davetiye.albumAktif && (
          <section style={{ padding: "120px 24px", textAlign: "center", background: PAPER_DARK, position: "relative" }}>
            <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.4em", color: WISTERIA, textTransform: "uppercase", marginBottom: 16 }}>Birlikte Geçen Zaman</p>
            <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "clamp(2.4rem,8vw,3.8rem)", color: IVY_GREEN, marginBottom: 70 }}>Güzel Anılarımız</p>
            
            <div style={{ display: "flex", justifyContent: "center", minHeight: 450 }}>
              <div style={{ position: "relative", width: 360, height: 400 }}>
                {[
                  { top: 50, left: -30, rotate: -8, z: 1, src: davetiye.polaroid1, idx: 1 },
                  { top: 0,  left: 50,  rotate: 3,  z: 2, src: davetiye.polaroid2, idx: 2 },
                  { top: 70, left: 130, rotate: 10, z: 3, src: davetiye.polaroid3, idx: 3 },
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
        <section style={{ padding: "120px 24px", textAlign: "center", background: PAPER }}>
          <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.3em", color: IVY_LIGHT, textTransform: "uppercase", marginBottom: 50 }}>Kavuşmaya Kalan Süre</p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px,5vw,60px)", flexWrap: "wrap" }}>
            {[{ val: kalan.gun, lbl: "GÜN" }, { val: kalan.saat, lbl: "SAAT" }, { val: kalan.dakika, lbl: "DAK" }, { val: kalan.saniye, lbl: "SAN" }].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(3rem,10vw,5rem)", color: IVY_GREEN, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {String(item.val).padStart(2, "0")}
                </p>
                <div style={{ width: "30px", height: "1px", background: WISTERIA, margin: "16px 0 12px" }} />
                <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.2em", color: IVY_LIGHT }}>{item.lbl}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            RSVP (GLASSMORPHISM KART)
        ══════════════════════════════════ */}
        <section style={{ padding: "100px 16px 140px", position: "relative", overflow: "hidden" }}>
          {/* Arka planda soft renk geçişleri */}
          <div style={{ position: "absolute", inset: 0, background: PAPER_DARK, zIndex: 0 }} />
          <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: `radial-gradient(circle, ${WISTERIA}20 0%, transparent 70%)`, filter: "blur(60px)", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "50%", background: `radial-gradient(circle, ${IVY_LIGHT}20 0%, transparent 70%)`, filter: "blur(60px)", zIndex: 0 }} />

          <div style={{ 
            position: "relative", zIndex: 1, 
            maxWidth: 500, margin: "0 auto", 
            background: "rgba(255, 255, 255, 0.6)", 
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            padding: "60px 40px", 
            borderRadius: "16px", 
            border: `1px solid rgba(255,255,255,0.8)`, 
            boxShadow: "0 40px 80px rgba(74, 93, 78, 0.1)" 
          }}>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 10, letterSpacing: "0.4em", color: WISTERIA, textTransform: "uppercase", marginBottom: 16 }}>LCV</p>
              <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "2.4rem", color: IVY_GREEN }}>Lütfen Bildiriniz</p>
            </div>
            <RsvpFormGarden davetiyeId={davetiye.id} />
          </div>
        </section>

        {/* ══════════════════════════════════
            FOOTER
        ══════════════════════════════════ */}
        <footer style={{ padding: "100px 24px", textAlign: "center", background: IVY_GREEN, color: PAPER }}>
          <p style={{ fontFamily: "var(--font-playfair),serif", fontSize: "clamp(3rem,10vw,5rem)", lineHeight: 1 }}>
            {isim1} <span style={{ color: BLUSH, fontStyle: "italic", margin: "0 15px" }}>&</span> {isim2}
          </p>
          <EtherealDivider />
          <p style={{ fontFamily: "var(--font-lora),serif", fontSize: "1rem", color: "rgba(249,248,245,0.7)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Sizi aramızda görmekten mutluluk duyacağız.
          </p>
        </footer>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   RSVP FORMU (İNCELTİLMİŞ ŞIKLIK)
═══════════════════════════════════════════ */
function RsvpFormGarden({ davetiyeId }: { davetiyeId: string }) {
  const [adim, setAdim] = useState<"form"|"tamam">("form");
  const [form, setForm] = useState({ ad: "", kisiSayisi: "1", katilim: "", sarkiDilegi: "" });
  const [secilenDiyet, setSecilenDiyet] = useState<string[]>([]);
  const toggleDiyet = (k: string) => setSecilenDiyet(p => p.includes(k) ? p.filter(d => d !== k) : [...p, k]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [ekBilgiAcik, setEkBilgiAcik] = useState(false);

  // Minimal form alanları stili
  const fieldStyle: React.CSSProperties = { width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${IVY_LIGHT}50`, padding: "14px 0", fontSize: 16, fontFamily: "var(--font-lora),serif", color: IVY_GREEN, outline: "none", boxSizing: "border-box", appearance: "none" as const, transition: "border-color 0.4s ease" };
  const labelStyle: React.CSSProperties = { fontFamily: "var(--font-lora),serif", fontSize: 9, letterSpacing: "0.25em", color: IVY_LIGHT, textTransform: "uppercase", display: "block", marginBottom: 4, marginTop: 28 };

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
    <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeUpEthereal 0.6s ease" }}>
      <p style={{ fontFamily: "var(--font-playfair),serif", fontStyle: "italic", fontSize: "2.4rem", color: IVY_GREEN, marginBottom: 20 }}>{form.katilim === "evet" ? "Teşekkür Ederiz" : "Anlıyoruz..."}</p>
      <p style={{ fontFamily: "var(--font-lora),serif", fontSize: 15, color: IVY_LIGHT, lineHeight: 1.8 }}>{form.katilim === "evet" ? "Katılım bilginiz sevgiyle iletildi. O büyülü günde görüşmek dileğiyle!" : "Durumunuz iletildi. Kalplerimiz bir."}</p>
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

      <div style={{ marginTop: 40, borderTop: `1px solid ${IVY_LIGHT}30`, paddingTop: 10 }}>
        <button type="button" onClick={() => setEkBilgiAcik(!ekBilgiAcik)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-lora),serif", color: IVY_GREEN }}>
          <span style={{ fontSize: 14, letterSpacing: "0.05em" }}>Ek Bilgi / Not Ekle</span>
          <span style={{ fontSize: 20, color: WISTERIA, transform: ekBilgiAcik ? "rotate(45deg)" : "none", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>+</span>
        </button>
        {ekBilgiAcik && (
          <div style={{ paddingBottom: 20, animation: "fadeUpEthereal 0.5s ease" }}>
            {form.katilim === "evet" && (
              <div style={{ marginTop: 10 }}>
                <label style={labelStyle}>Diyet Tercihleri <span style={{ textTransform: "none", letterSpacing: 0 }}>(isteğe bağlı)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                  {[{ k: "vegan", l: "Vegan" }, { k: "vejetaryen", l: "Vejetaryen" }, { k: "glutensiz", l: "Glutensiz" }].map(opt => (
                    <button key={opt.k} type="button" onClick={() => toggleDiyet(opt.k)} style={{ padding: "10px 20px", borderRadius: "30px", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-lora),serif", border: `1px solid ${secilenDiyet.includes(opt.k) ? IVY_GREEN : IVY_LIGHT + "50"}`, color: secilenDiyet.includes(opt.k) ? PAPER : IVY_GREEN, background: secilenDiyet.includes(opt.k) ? IVY_GREEN : "transparent", transition: "all 0.3s ease" }}>{opt.l}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 30 }}>
              <label style={labelStyle}>Şarkı Dileğiniz <span style={{ textTransform: "none", letterSpacing: 0 }}>(isteğe bağlı)</span></label>
              <input type="text" value={form.sarkiDilegi} onChange={e => setForm({ ...form, sarkiDilegi: e.target.value })} placeholder="Dans pistindeki favori şarkınız?" maxLength={200} style={fieldStyle} />
            </div>
          </div>
        )}
      </div>

      {hata && <p style={{ color: "#A85C6A", fontSize: 13, fontFamily: "var(--font-lora),serif", marginTop: 20, textAlign: "center" }}>{hata}</p>}
      
      <button onClick={gonder} disabled={yukleniyor} style={{ width: "100%", marginTop: 40, padding: "20px", background: IVY_GREEN, color: PAPER, border: "none", borderRadius: "4px", fontFamily: "var(--font-lora),serif", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", cursor: yukleniyor ? "not-allowed" : "pointer", opacity: yukleniyor ? 0.8 : 1, transition: "background 0.4s ease", boxShadow: "0 10px 20px rgba(74, 93, 78, 0.2)" }}>
        {yukleniyor ? "GÖNDERİLİYOR..." : "YANITI İLET"}
      </button>
    </div>
  );
}
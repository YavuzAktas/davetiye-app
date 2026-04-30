"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect } from "react";
import MuzikCalar from "@/components/MuzikCalar";

/* ─── Renk Paleti — Lacivert & Şampanya ─── */
const BG      = "#0D1F3C";
const BG_DARK = "#071228";
const BG_MED  = "#152C52";
const GOLD    = "#D4AA70";
const CREAM   = "#F8F3EE";
const CREAM2  = "#FFFDF9";

/* ─── Altın yatay süs çizgisi ─── */
function GoldDivider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"8px 0" }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${GOLD}70)` }}/>
      <span style={{ color:GOLD, fontSize:9, letterSpacing:5 }}>◆</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${GOLD}70)` }}/>
    </div>
  );
}

/* ─── Düğün Yüzüğü Mühür — saf SVG, resim gerekmez ─── */
function WeddingRingsSeal({ size = 220, onClick }: { size?: number; onClick?: () => void }) {
  const ring = Math.round(size * 0.055);
  const s = size;
  return (
    <div onClick={onClick} style={{
      width: s, height: s, borderRadius: "50%", overflow: "hidden",
      cursor: onClick ? "pointer" : "default", flexShrink: 0,
      boxShadow: `
        0 0 0 ${ring}px ${BG},
        0 0 0 ${ring + 2}px rgba(212,170,112,0.2),
        0 20px 70px rgba(0,6,20,0.75)
      `,
    }}>
      <div style={{
        width: "100%", height: "100%",
        background: `radial-gradient(circle at 38% 34%, #1E3A6E 0%, ${BG} 50%, ${BG_DARK} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {/* Dış dekoratif halka */}
        <div style={{
          position:"absolute", inset: "8%", borderRadius:"50%",
          border:`1px solid rgba(212,170,112,0.2)`,
        }}/>
        <div style={{
          position:"absolute", inset: "13%", borderRadius:"50%",
          border:`0.5px solid rgba(212,170,112,0.1)`,
        }}/>

        <svg viewBox="0 0 200 200" style={{ width:"72%", height:"72%" }} fill="none">
          {/* İki alyans */}
          <circle cx="80" cy="112" r="38" stroke={GOLD} strokeWidth="7" fill="none" opacity="0.9"/>
          <circle cx="120" cy="112" r="38" stroke={GOLD} strokeWidth="7" fill="none" opacity="0.9"/>

          {/* İç parlaklık — sol yüzük */}
          <circle cx="80" cy="112" r="38" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none"/>
          {/* İç parlaklık — sağ yüzük */}
          <circle cx="120" cy="112" r="38" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none"/>

          {/* Elmas taşı */}
          <polygon points="100,44 116,62 100,78 84,62" fill={GOLD} opacity="0.88"/>
          <polygon points="100,44 116,62 100,54 84,62" fill="rgba(255,255,255,0.25)"/>
          <polygon points="100,78 116,62 100,68 84,62" fill="rgba(0,0,0,0.2)"/>

          {/* Küçük ✦ köşe süsleri */}
          <text x="42"  y="60"  textAnchor="middle" fontSize="9" fill={`${GOLD}55`}>✦</text>
          <text x="158" y="60"  textAnchor="middle" fontSize="9" fill={`${GOLD}55`}>✦</text>
          <text x="100" y="180" textAnchor="middle" fontSize="9" fill={`${GOLD}40`}>◆</text>
        </svg>
      </div>
    </div>
  );
}

/* ─── Polaroid kart ─── */
function Polaroid({ rotate=0, zIndex=0 }: { rotate?:number; zIndex?:number }) {
  return (
    <div style={{
      background:"#fff", borderRadius:3, padding:"10px 10px 32px",
      transform:`rotate(${rotate}deg)`, zIndex,
      boxShadow:"0 8px 32px rgba(0,0,0,0.4),0 2px 6px rgba(0,0,0,0.25)",
      width:170, flexShrink:0,
    }}>
      <div style={{
        width:"100%", height:190,
        background:`linear-gradient(135deg,${BG_MED} 0%,#1E3D72 100%)`,
        borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span style={{ fontSize:44, opacity:0.2 }}>📷</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ANA BİLEŞEN
───────────────────────────────────────── */
export default function DugunLuksSablon({ davetiye }: SablonProps) {
  const [acildi, setAcildi] = useState(false);
  const [animating, setAnimating] = useState(false);

  const tarihObj = davetiye.tarih ? new Date(davetiye.tarih) : null;
  const tarihStr = tarihObj
    ? tarihObj.toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })
    : null;
  const tarihKisa = tarihObj
    ? tarihObj.toLocaleDateString("tr-TR", { day:"2-digit", month:"long", year:"numeric" }).toUpperCase()
    : null;
  const saatStr = tarihObj
    ? tarihObj.toLocaleTimeString("tr-TR", { hour:"2-digit", minute:"2-digit" })
    : null;

  const calcKalan = () => {
    if (!tarihObj) return { gun:0, saat:0, dakika:0, saniye:0 };
    const f = tarihObj.getTime() - Date.now();
    if (f <= 0) return { gun:0, saat:0, dakika:0, saniye:0 };
    return {
      gun:    Math.floor(f / 86400000),
      saat:   Math.floor((f % 86400000) / 3600000),
      dakika: Math.floor((f % 3600000) / 60000),
      saniye: Math.floor((f % 60000) / 1000),
    };
  };
  const [kalan, setKalan] = useState(calcKalan);
  useEffect(() => {
    if (!tarihObj) return;
    const id = setInterval(() => setKalan(calcKalan()), 1000);
    return () => clearInterval(id);
  }, []);

  const isim1 = davetiye.kisi1 || davetiye.baslik.split(/[&ve]/i)[0]?.trim() || davetiye.baslik;
  const isim2 = davetiye.kisi2 || davetiye.baslik.split(/[&ve]/i)[1]?.trim() || null;
  const fullName = isim2 ? `${isim1} & ${isim2}` : isim1;

  const whatsapp = encodeURIComponent(
    `${davetiye.baslik} Düğün Davetiyesi\n` +
    (tarihStr ? `📅 ${tarihStr}\n` : "") +
    (davetiye.mekan ? `📍 ${davetiye.mekan}\n` : "") +
    `Davetiye: ${process.env.NEXT_PUBLIC_URL ?? ""}/davetiye/${davetiye.slug}`
  );

  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  /* ══ KAPALI DURUM ══ */
  if (!acildi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
        style={{ background:`radial-gradient(ellipse at 50% 45%,#1E3A6E 0%,${BG} 55%,${BG_DARK} 100%)` }}>

        {/* Yıldız dokusu */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:`radial-gradient(circle,rgba(212,170,112,0.06) 1px,transparent 1px)`,
          backgroundSize:"32px 32px",
        }}/>

        {/* İsimler — üst */}
        <p className="relative z-10 text-center px-8 mb-12" style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.6rem,8vw,4.2rem)",
          color: CREAM, lineHeight: 1.15, letterSpacing: 1,
        }}>
          {isim1}
          {isim2 && <><span style={{ color:GOLD }}> &amp; </span>{isim2}</>}
        </p>

        {/* Düğün Yüzüğü Mühür */}
        <div className="relative z-10 flex flex-col items-center"
          style={{ opacity:animating?0:1, transform:animating?"scale(0.7)":"scale(1)", transition:"all 0.55s ease" }}>
          <WeddingRingsSeal size={230} onClick={() => { setAnimating(true); setTimeout(()=>setAcildi(true),580); }}/>

          <div className="mt-10 text-center">
            {tarihKisa && (
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:13, letterSpacing:"0.35em", color:GOLD, marginBottom:12 }}>
                {tarihKisa}
              </p>
            )}
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:13, fontStyle:"italic", color:`${GOLD}70`, letterSpacing:"0.15em" }}>
              Mühüre dokun ◆
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ══ AÇIK DURUM ══ */
  return (
    <div style={{ background:BG, minHeight:"100vh", overflowX:"hidden" }}>

      {/* ─── NAV ─── */}
      <nav style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(7,18,40,0.92)", backdropFilter:"blur(14px)",
        borderBottom:`1px solid rgba(212,170,112,0.15)`,
      }}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"11px 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ color:GOLD, fontSize:15, cursor:"pointer" }} onClick={()=>scroll("biz")}>◆</span>
          <div style={{ display:"flex", gap:"clamp(10px,4vw,26px)" }}>
            {[
              { id:"biz",     label:"BİZ" },
              { id:"sayim",   label:"SAYIM" },
              { id:"katilim", label:"KATILIM" },
              { id:"mekan",   label:"MEKAN" },
              { id:"anilar",  label:"ALBÜM" },
            ].map(s=>(
              <button key={s.id} onClick={()=>scroll(s.id)} style={{
                background:"none", border:"none", cursor:"pointer",
                fontFamily:"var(--font-cormorant),serif",
                fontSize:11, letterSpacing:"0.22em",
                color:`${CREAM}80`, padding:"4px 0",
              }}>{s.label}</button>
            ))}
          </div>
          <div style={{ width:16 }}/>
        </div>
      </nav>

      {/* ════════════════════════════════════
          BÖLÜM 1 — BİZ (Hero — dikdörtgen çerçeve)
      ════════════════════════════════════ */}
      <section id="biz" style={{
        minHeight:"100svh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"60px 24px 80px", position:"relative",
        background:`radial-gradient(ellipse at 50% 30%,#1E3A6E 0%,${BG} 60%)`,
      }}>
        {/* Köşe süsleri */}
        {(["top-5 left-5","top-5 right-5","bottom-5 left-5","bottom-5 right-5"] as const).map((cls,i)=>(
          <span key={i} className={`absolute ${cls}`} style={{ color:`${GOLD}40`, fontSize:14 }}>◆</span>
        ))}

        {/* Dikdörtgen çerçeve */}
        <div style={{
          position:"relative", maxWidth:400, width:"100%",
          border:`1px solid ${GOLD}35`, borderRadius:6,
          padding:"56px 36px 48px", textAlign:"center",
          boxShadow:`inset 0 0 80px rgba(212,170,112,0.03)`,
        }}>
          {/* İç çerçeve */}
          <div style={{ position:"absolute", inset:8, border:`1px solid ${GOLD}14`,
            borderRadius:4, pointerEvents:"none" }}/>

          {/* Köşe elmasları */}
          {[{top:-7,left:-7},{top:-7,right:-7},{bottom:-7,left:-7},{bottom:-7,right:-7}].map((pos,i)=>(
            <div key={i} style={{
              position:"absolute", ...pos,
              width:14, height:14, transform:"rotate(45deg)",
              background:GOLD, opacity:0.65,
            }}/>
          ))}

          <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.38em",
            color:GOLD, textTransform:"uppercase", marginBottom:22 }}>Düğün Davetiyesi</p>

          <p style={{ fontFamily:"var(--font-dancing),cursive",
            fontSize:"clamp(3.8rem,13vw,6rem)", color:CREAM, lineHeight:1, marginBottom:4 }}>{isim1}</p>

          <p style={{ fontFamily:"var(--font-dancing),cursive",
            fontSize:"clamp(1.8rem,5vw,2.6rem)", color:GOLD, lineHeight:1.3, margin:"6px 0" }}>&amp;</p>

          {isim2 && (
            <p style={{ fontFamily:"var(--font-dancing),cursive",
              fontSize:"clamp(3.8rem,13vw,6rem)", color:CREAM, lineHeight:1, marginBottom:8 }}>{isim2}</p>
          )}

          <div style={{ margin:"20px auto", maxWidth:220 }}><GoldDivider/></div>

          <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:13, letterSpacing:"0.22em",
            color:`${CREAM}70`, marginBottom:10 }}>
            {tarihKisa}{tarihKisa && davetiye.mekan ? " · " : ""}{davetiye.mekan?.toUpperCase()}
          </p>

          {davetiye.mesaj && (
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:14, fontStyle:"italic",
              color:`${CREAM}55`, marginTop:8 }}>{davetiye.mesaj}</p>
          )}
        </div>

        {/* Aşağı ok */}
        <div style={{ marginTop:44, textAlign:"center" }}>
          <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.32em",
            color:`${GOLD}55`, marginBottom:10, textTransform:"uppercase" }}>Aşağı Kaydır</p>
          <div style={{
            width:28, height:28, border:`1px solid ${GOLD}30`, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto", color:`${GOLD}55`, fontSize:13,
            animation:"bounce 2s infinite",
          }}>↓</div>
        </div>

        {davetiye.muzik && (
          <div style={{ position:"fixed", bottom:24, right:24, zIndex:40 }}>
            <MuzikCalar muzikUrl={davetiye.muzik}/>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 2 — SAYIM
      ════════════════════════════════════ */}
      <section id="sayim" style={{ padding:"80px 24px", textAlign:"center", background:BG_MED }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.38em",
          color:GOLD, textTransform:"uppercase", marginBottom:14 }}>Düğüne Kalan Süre</p>

        <p style={{ fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.4rem,7vw,3.6rem)", color:CREAM, marginBottom:52 }}>
          {tarihObj && tarihObj > new Date() ? "Sayıyoruz..." : "Kutlama Zamanı! 🎊"}
        </p>

        <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start",
          gap:"clamp(8px,3vw,16px)", flexWrap:"wrap" }}>
          {[
            { val:kalan.gun,    lbl:"GÜN" },
            { val:kalan.saat,   lbl:"SAAT" },
            { val:kalan.dakika, lbl:"DAKİKA" },
            { val:kalan.saniye, lbl:"SANİYE" },
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"clamp(6px,2vw,14px)" }}>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontFamily:"var(--font-cormorant),serif",
                  fontSize:"clamp(3.2rem,10vw,5.2rem)", fontWeight:600,
                  color:CREAM, lineHeight:1, fontVariantNumeric:"tabular-nums", minWidth:"2ch" }}>
                  {String(item.val).padStart(2,"0")}
                </p>
                <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.22em",
                  color:GOLD, marginTop:8 }}>{item.lbl}</p>
              </div>
              {i < 3 && (
                <p style={{ fontFamily:"var(--font-cormorant),serif",
                  fontSize:"clamp(2rem,6vw,3.5rem)", color:`${GOLD}50`, lineHeight:1.1, marginTop:4 }}>:</p>
              )}
            </div>
          ))}
        </div>

        <div style={{ maxWidth:300, margin:"52px auto 0" }}>
          <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}30,transparent)` }}/>
        </div>
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 3 — KATILIM (RSVP)
      ════════════════════════════════════ */}
      <section id="katilim" style={{ padding:"80px 24px", background:BG_DARK }}>
        <div style={{ maxWidth:480, margin:"0 auto" }}>
          <div style={{
            background:CREAM2, borderRadius:16, padding:"40px 32px 44px",
            position:"relative", boxShadow:"0 24px 70px rgba(0,0,0,0.45)",
          }}>
            <span style={{ position:"absolute", top:18, left:22, color:GOLD, fontSize:13, opacity:0.55 }}>◆</span>
            <span style={{ position:"absolute", bottom:18, right:22, color:GOLD, fontSize:13, opacity:0.55 }}>◆</span>

            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.32em",
              color:"#6B5437", textAlign:"center", textTransform:"uppercase", marginBottom:10 }}>Katılım Bildirimi</p>

            <p style={{ fontFamily:"var(--font-dancing),cursive",
              fontSize:"clamp(2rem,7vw,3rem)", color:BG, textAlign:"center", lineHeight:1.1, marginBottom:24 }}>
              Gelecek misiniz?
            </p>

            <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}60,transparent)`, marginBottom:30 }}/>

            <RsvpFormKrem davetiyeId={davetiye.id} bg={BG} gold={GOLD} cream={CREAM}/>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 4 — MEKAN
      ════════════════════════════════════ */}
      <section id="mekan" style={{ padding:"80px 24px", textAlign:"center", background:BG_MED }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.38em",
          color:GOLD, textTransform:"uppercase", marginBottom:14 }}>Mekan</p>

        <p style={{ fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.4rem,7vw,3.8rem)", color:CREAM, marginBottom:44 }}>Nerede Buluşuyoruz?</p>

        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(24px,6vw,60px)", flexWrap:"wrap", marginBottom:40 }}>
          {[
            { emoji:"📍", lbl:"MEKAN",  val:davetiye.mekan ?? "Belirtilmedi" },
            { emoji:"🕐", lbl:"SAAT",   val:saatStr ?? "—" },
            { emoji:"📅", lbl:"TARİH",  val:tarihStr ?? "—" },
          ].map(col=>(
            <div key={col.lbl} style={{ textAlign:"center", minWidth:90 }}>
              <div style={{ fontSize:22, marginBottom:10 }}>{col.emoji}</div>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.25em",
                color:GOLD, marginBottom:8, textTransform:"uppercase" }}>{col.lbl}</p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:15, fontWeight:600, color:CREAM }}>
                {col.val}
              </p>
            </div>
          ))}
        </div>

        {davetiye.mekan && (
          <>
            <div style={{ maxWidth:560, margin:"0 auto 28px", borderRadius:12, overflow:"hidden",
              border:`1px solid ${GOLD}22`, boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&output=embed`}
                width="100%" height="260" style={{ border:0, display:"block" }}
                loading="lazy" allowFullScreen/>
            </div>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(davetiye.mekan)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                fontFamily:"var(--font-cormorant),serif", fontSize:13, letterSpacing:"0.22em",
                color:CREAM, border:`1px solid ${GOLD}38`, padding:"12px 28px", borderRadius:8,
                textDecoration:"none", textTransform:"uppercase",
              }}>📍 Yol Tarifi Al</a>
          </>
        )}
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 5 — ALBÜM (Polaroid)
      ════════════════════════════════════ */}
      <section id="anilar" style={{
        padding:"80px 24px", textAlign:"center",
        background:`linear-gradient(180deg,${BG} 0%,${BG_DARK} 100%)`,
      }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.38em",
          color:GOLD, textTransform:"uppercase", marginBottom:14 }}>Bizim Hikayemiz</p>

        <p style={{ fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.6rem,8vw,4rem)", color:CREAM, lineHeight:1.1, marginBottom:24 }}>
          En Güzel Anılar
        </p>

        <div style={{ maxWidth:200, margin:"0 auto 52px" }}><GoldDivider/></div>

        <div style={{ position:"relative", display:"flex", justifyContent:"center", minHeight:290, marginBottom:52 }}>
          <div style={{ position:"relative", width:280, height:280 }}>
            <div style={{ position:"absolute", top:20, left:-30 }}><Polaroid rotate={-9} zIndex={1}/></div>
            <div style={{ position:"absolute", top:28, left:45 }}><Polaroid rotate={5}  zIndex={2}/></div>
            <div style={{ position:"absolute", top:4,  left:90 }}><Polaroid rotate={-2} zIndex={3}/></div>
          </div>
        </div>

        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:18, fontStyle:"italic", color:`${CREAM}55` }}>
          Ömür boyu sürecek bir masalın başlangıcı... ◆
        </p>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        background:BG_DARK, borderTop:`1px solid ${GOLD}12`,
        padding:"40px 24px", textAlign:"center",
      }}>
        <p style={{ fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(1.8rem,5vw,2.6rem)", color:`${CREAM}65`, marginBottom:22 }}>{fullName}</p>

        <a href={`https://wa.me/?text=${whatsapp}`} target="_blank" rel="noopener noreferrer"
          style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"#25D366", color:"#fff", padding:"10px 22px", borderRadius:8,
            fontSize:13, fontFamily:"var(--font-cormorant),serif",
            textDecoration:"none", letterSpacing:"0.1em", marginBottom:24,
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Paylaş
        </a>

        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.2em", color:`${GOLD}35` }}>
          bekleriz.com ile oluşturuldu ◆
        </p>
      </footer>

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}`}</style>
    </div>
  );
}

/* ─── RSVP Formu ─── */
function RsvpFormKrem({ davetiyeId, bg, gold, cream }: { davetiyeId:string; bg:string; gold:string; cream:string }) {
  const [adim, setAdim] = useState<"form"|"tamam">("form");
  const [form, setForm] = useState({ ad:"", kisiSayisi:"1", katilim:"" });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const fieldStyle: React.CSSProperties = {
    width:"100%", background:"transparent", border:"none",
    borderBottom:`1px solid ${gold}50`, padding:"10px 0", fontSize:14,
    fontFamily:"var(--font-cormorant),serif", color:bg, outline:"none",
    boxSizing:"border-box", appearance:"none" as const,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.28em",
    color:"#7A6040", textTransform:"uppercase", display:"block", marginBottom:4, marginTop:20,
  };

  const gonder = async () => {
    if (!form.ad.trim()) { setHata("Lütfen adınızı girin."); return; }
    if (!form.katilim)   { setHata("Lütfen katılım durumunu seçin."); return; }
    setYukleniyor(true); setHata("");
    try {
      const res = await fetch("/api/rsvp", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ davetiyeId, ad:form.ad, katilim:form.katilim==="evet", kisiSayisi:Number(form.kisiSayisi) }),
      });
      if (!res.ok) { setHata("Bir hata oluştu."); return; }
      setAdim("tamam");
    } catch { setHata("Bir hata oluştu."); }
    finally { setYukleniyor(false); }
  };

  if (adim === "tamam") {
    return (
      <div style={{ textAlign:"center", padding:"20px 0" }}>
        <p style={{ fontSize:40, marginBottom:12 }}>{form.katilim==="evet" ? "🎊" : "💙"}</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"2rem", color:bg, marginBottom:8 }}>
          {form.katilim==="evet" ? "Görüşmek üzere!" : "Anlıyoruz..."}
        </p>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:14, color:"#7A6040" }}>
          {form.katilim==="evet" ? "Katılım bilginiz iletildi. Sizi görmek için sabırsızlanıyoruz!" : "Katılım durumunuz iletildi."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <label style={labelStyle}>Adınız Soyadınız</label>
      <input type="text" value={form.ad} onChange={e=>setForm({...form,ad:e.target.value})}
        placeholder="örn. Selin Kaya" style={fieldStyle}/>

      <label style={labelStyle}>Kaç Kişi?</label>
      <select value={form.kisiSayisi} onChange={e=>setForm({...form,kisiSayisi:e.target.value})} style={fieldStyle}>
        <option value="">Seçiniz</option>
        {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} kişi</option>)}
      </select>

      <label style={labelStyle}>Katılım Durumu</label>
      <select value={form.katilim} onChange={e=>setForm({...form,katilim:e.target.value})} style={fieldStyle}>
        <option value="">Seçiniz</option>
        <option value="evet">Katılıyorum ✓</option>
        <option value="hayir">Katılamıyorum</option>
      </select>

      {hata && <p style={{ color:"#C0392B", fontSize:12, fontFamily:"var(--font-cormorant),serif", marginTop:12 }}>{hata}</p>}

      <button onClick={gonder} disabled={yukleniyor} style={{
        width:"100%", marginTop:30, padding:"14px",
        background:bg, color:cream, border:"none", borderRadius:8,
        fontFamily:"var(--font-cormorant),serif", fontSize:13, letterSpacing:"0.32em",
        textTransform:"uppercase", cursor:yukleniyor?"not-allowed":"pointer", opacity:yukleniyor?0.7:1,
      }}>
        {yukleniyor ? "Gönderiliyor..." : "BİLDİR"}
      </button>

      {/* KVKK Bildirimi */}
      <p style={{ marginTop:16, fontSize:9.5, lineHeight:1.7,
        fontFamily:"var(--font-cormorant),serif",
        color:"rgba(100,110,130,0.65)", textAlign:"center" }}>
        Girdiğiniz bilgiler yalnızca katılım bildirimini davet sahibine iletmek amacıyla
        işlenmekte ve etkinlik tarihinden itibaren 1 yıl içinde silinmektedir.{" "}
        <a href="/kvkk" target="_blank" rel="noopener noreferrer"
          style={{ color:"rgba(100,110,130,0.85)", textDecoration:"underline" }}>
          KVKK Aydınlatma Metni
        </a>
      </p>
    </div>
  );
}

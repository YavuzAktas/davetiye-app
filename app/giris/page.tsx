"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const BG    = "#06010F";
const GOLD  = "#D4A84B";
const CREAM = "#F9F3E8";
const PL    = "#3D0D7A";
const PLM   = "#5A1AAA";

/* ── Dekoratif davetiye kartı (arka planda float eder) ── */
function FloatingInvite({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute",
      width: 148, height: 208,
      borderRadius: 14,
      background: `linear-gradient(150deg, ${PL} 0%, #110228 100%)`,
      border: `1px solid ${GOLD}22`,
      boxShadow: `0 24px 64px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.03)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 9,
      ...style,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:20, height:0.5, background:`${GOLD}40` }}/>
        <span style={{ color:`${GOLD}80`, fontSize:8 }}>✦</span>
        <div style={{ width:20, height:0.5, background:`${GOLD}40` }}/>
      </div>
      <div style={{ fontFamily:"var(--font-dancing),cursive", fontSize:22, color:CREAM, textAlign:"center", lineHeight:1 }}>Davetim</div>
      <div style={{ width:"55%", height:0.5, background:`${GOLD}30` }}/>
      <div style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7.5, letterSpacing:"0.22em", color:`${GOLD}70`, textTransform:"uppercase" }}>Davetiye</div>
      <div style={{ width:28, height:28, borderRadius:"50%", border:`1px solid ${GOLD}35`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ color:`${GOLD}60`, fontSize:10 }}>✦</span>
      </div>
    </div>
  );
}

function GirisIcerigi() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 35% 25%, ${PLM}55 0%, ${PL}28 30%, ${BG} 65%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "24px",
    }}>

      {/* Dot grid */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(circle, ${GOLD}0D 1px, transparent 1px)`,
        backgroundSize:"30px 30px",
      }}/>

      {/* Blob 1 */}
      <div className="animate-blob-1" style={{
        position:"absolute", top:"-18%", left:"-8%",
        width:640, height:640, borderRadius:"50%",
        background:`radial-gradient(circle, ${PLM}45 0%, transparent 68%)`,
        filter:"blur(72px)", pointerEvents:"none",
      }}/>

      {/* Blob 2 */}
      <div className="animate-blob-2" style={{
        position:"absolute", bottom:"-18%", right:"-6%",
        width:560, height:560, borderRadius:"50%",
        background:`radial-gradient(circle, #1A0355 0%, transparent 70%)`,
        filter:"blur(88px)", pointerEvents:"none",
      }}/>

      {/* Dönen altın halkalar */}
      {[580, 780, 1000].map((size, i) => (
        <div key={i} className={i % 2 === 0 ? "animate-spin-slow" : "animate-spin-slow"}
          style={{
            position:"absolute", top:"50%", left:"50%",
            width:size, height:size, borderRadius:"50%",
            border:`1px solid ${GOLD}${["06","04","02"][i]}`,
            transform:"translate(-50%,-50%)",
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
            pointerEvents:"none",
          }}/>
      ))}

      {/* Float eden davetiye kartları */}
      <FloatingInvite style={{ top:"8%",  left:"4%",  transform:"rotate(-14deg)", opacity:0.22, filter:"blur(1.5px)" }}/>
      <FloatingInvite style={{ bottom:"9%", left:"6%",  transform:"rotate(9deg)",  opacity:0.16, filter:"blur(2px)"   }}/>
      <FloatingInvite style={{ top:"12%", right:"5%", transform:"rotate(13deg)",  opacity:0.20, filter:"blur(1px)"   }}/>
      <FloatingInvite style={{ bottom:"10%",right:"4%",transform:"rotate(-7deg)", opacity:0.14, filter:"blur(2.5px)" }}/>

      {/* Işıltı noktaları */}
      {[
        { top:"21%", left:"24%",  s:5 },
        { top:"68%", left:"17%",  s:3 },
        { top:"38%", right:"21%", s:4 },
        { top:"74%", right:"23%", s:3 },
        { top:"82%", left:"42%",  s:4 },
        { top:"14%", right:"38%", s:5 },
        { top:"52%", left:"8%",   s:3 },
      ].map((p, i) => (
        <div key={i} className="animate-float" style={{
          position:"absolute", ...p,
          width:p.s, height:p.s, borderRadius:"50%",
          background:GOLD, opacity:0.3,
          animationDelay:`${i * 0.65}s`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* ── Ana Kart ── */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:420,
        background:"rgba(10, 2, 24, 0.78)",
        backdropFilter:"blur(28px)",
        WebkitBackdropFilter:"blur(28px)",
        borderRadius:26,
        border:`1px solid ${GOLD}28`,
        boxShadow:`0 0 0 1px rgba(255,255,255,0.035), 0 48px 120px rgba(0,0,0,0.65), 0 0 100px ${PLM}30`,
        padding:"52px 44px",
        display:"flex", flexDirection:"column", alignItems:"center",
      }}>

        {/* Üst süsleme */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:30 }}>
          <div style={{ width:36, height:0.5, background:`linear-gradient(to right,transparent,${GOLD}55)` }}/>
          <span style={{ color:GOLD, fontSize:11, letterSpacing:"0.1em" }}>✦</span>
          <div style={{ width:36, height:0.5, background:`linear-gradient(to left,transparent,${GOLD}55)` }}/>
        </div>

        {/* Marka adı */}
        <div style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:58, color:CREAM, lineHeight:0.88,
          textAlign:"center", marginBottom:10,
          textShadow:`0 0 60px ${PLM}80`,
        }}>
          Davetim
        </div>

        <div style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:9.5, letterSpacing:"0.42em",
          color:GOLD, textTransform:"uppercase",
          marginBottom:38,
        }}>
          Dijital Davetiye
        </div>

        {/* Ayraç */}
        <div style={{
          width:"100%", height:1,
          background:`linear-gradient(to right,transparent,${GOLD}35,transparent)`,
          marginBottom:36,
        }}/>

        {/* Karşılama */}
        <div style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:28, fontStyle:"italic",
          color:CREAM, textAlign:"center", marginBottom:10,
        }}>
          Hoş Geldiniz
        </div>
        <div style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:13.5, color:`${CREAM}50`,
          textAlign:"center", marginBottom:38,
          lineHeight:1.65, letterSpacing:"0.035em",
        }}>
          Davetiyenizi oluşturmaya başlamak için<br/>hesabınıza giriş yapın
        </div>

        {/* Google butonu */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
          style={{
            width:"100%",
            display:"flex", alignItems:"center", justifyContent:"center", gap:13,
            padding:"15px 24px",
            borderRadius:14,
            background:"rgba(255,255,255,0.055)",
            border:`1px solid ${GOLD}35`,
            color:CREAM,
            fontSize:14, fontWeight:600,
            letterSpacing:"0.05em",
            cursor:"pointer",
            transition:"all 0.22s ease",
            outline:"none",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.background = "rgba(255,255,255,0.10)";
            el.style.borderColor = `${GOLD}65`;
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.35), 0 0 24px ${GOLD}18`;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.background = "rgba(255,255,255,0.055)";
            el.style.borderColor = `${GOLD}35`;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google ile Giriş Yap
        </button>

        {/* Alt ayraç */}
        <div style={{
          width:"100%", height:1,
          background:`linear-gradient(to right,transparent,${GOLD}20,transparent)`,
          margin:"34px 0 26px",
        }}/>

        {/* Şartlar + ana sayfaya dön */}
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:11, color:`${CREAM}32`,
          textAlign:"center", letterSpacing:"0.04em", lineHeight:1.75,
        }}>
          Giriş yaparak{" "}
          <a href="/kullanim-sartlari" style={{ color:`${GOLD}55`, textDecoration:"underline", textUnderlineOffset:3 }}>
            kullanım şartlarını
          </a>{" "}
          kabul etmiş olursunuz.
        </p>

        <Link href="/" style={{
          marginTop:18,
          fontFamily:"var(--font-cormorant),serif",
          fontSize:11, color:`${CREAM}28`,
          letterSpacing:"0.1em", textDecoration:"none",
          transition:"color 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = `${CREAM}60`)}
          onMouseLeave={e => (e.currentTarget.style.color = `${CREAM}28`)}
        >
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

export default function GirisSayfasi() {
  return (
    <Suspense>
      <GirisIcerigi />
    </Suspense>
  );
}

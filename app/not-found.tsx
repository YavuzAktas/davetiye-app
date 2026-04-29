import Link from "next/link";

const GOLD  = "#C4A05A";
const BG    = "#0D0118";
const CREAM = "#F5ECD8";
const DARK  = "#1a0a08";

function CornerMark({ pos }: { pos: "tl"|"tr"|"bl"|"br" }) {
  const top    = pos.startsWith("t") ? -8 : undefined;
  const bottom = pos.startsWith("b") ? -8 : undefined;
  const left   = pos.endsWith("l")   ? -8 : undefined;
  const right  = pos.endsWith("r")   ? -8 : undefined;
  return (
    <div style={{
      position:"absolute", top, bottom, left, right,
      width:16, height:16,
      borderTop:   pos.startsWith("t") ? `1.5px solid ${GOLD}` : "none",
      borderBottom:pos.startsWith("b") ? `1.5px solid ${GOLD}` : "none",
      borderLeft:  pos.endsWith("l")   ? `1.5px solid ${GOLD}` : "none",
      borderRight: pos.endsWith("r")   ? `1.5px solid ${GOLD}` : "none",
    }}/>
  );
}

function GoldDivider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%", margin:"20px 0" }}>
      <div style={{ flex:1, height:0.75, background:`linear-gradient(to right, transparent, ${GOLD}60)` }}/>
      <span style={{ color:GOLD, fontSize:9, letterSpacing:"0.1em" }}>✦</span>
      <div style={{ flex:1, height:0.75, background:`linear-gradient(to left, transparent, ${GOLD}60)` }}/>
    </div>
  );
}

export default function NotFound() {
  return (
    <div style={{
      minHeight:"calc(100vh - 64px)",
      background:`radial-gradient(ellipse at 40% 30%, #2D0A5E 0%, ${BG} 60%, #030008 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden", padding:"32px 16px",
    }}>

      {/* Dot grid */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(circle, ${GOLD}10 1px, transparent 1px)`,
        backgroundSize:"28px 28px",
      }}/>

      {/* Blob sol */}
      <div className="animate-blob-1" style={{
        position:"absolute", top:"-20%", left:"-12%",
        width:520, height:520, borderRadius:"50%",
        background:"radial-gradient(circle, #3D0D7A38 0%, transparent 65%)",
        filter:"blur(64px)", pointerEvents:"none",
      }}/>

      {/* Blob sağ */}
      <div className="animate-blob-2" style={{
        position:"absolute", bottom:"-18%", right:"-10%",
        width:440, height:440, borderRadius:"50%",
        background:"radial-gradient(circle, #1A035530 0%, transparent 65%)",
        filter:"blur(80px)", pointerEvents:"none",
      }}/>

      {/* ── Davetiye Kartı ── */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:440,
        background:CREAM,
        borderRadius:4,
        padding:"52px 48px",
        boxShadow:`0 0 0 1px ${GOLD}30, 0 48px 120px rgba(0,0,0,0.7), 0 0 0 8px ${GOLD}08`,
        display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center",
      }}>

        {/* Köşe süsler */}
        <CornerMark pos="tl"/><CornerMark pos="tr"/>
        <CornerMark pos="bl"/><CornerMark pos="br"/>

        {/* Üst küçük etiket */}
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:9, letterSpacing:"0.38em",
          color:`${DARK}55`, textTransform:"uppercase", marginBottom:20,
        }}>
          Davetim · Dijital Davetiye
        </p>

        {/* Üst altın çizgi */}
        <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%", marginBottom:24 }}>
          <div style={{ flex:1, height:0.75, background:`linear-gradient(to right,transparent,${GOLD}80)` }}/>
          <span style={{ color:GOLD, fontSize:14 }}>✦</span>
          <div style={{ flex:1, height:0.75, background:`linear-gradient(to left,transparent,${GOLD}80)` }}/>
        </div>

        {/* Hitap */}
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:13, letterSpacing:"0.18em",
          color:`${DARK}70`, textTransform:"uppercase", marginBottom:16,
        }}>
          Sayın Misafirimiz
        </p>

        {/* 404 */}
        <div style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(5rem,16vw,7.5rem)",
          color:DARK, lineHeight:0.9,
          marginBottom:12,
        }}>
          404
        </div>

        <GoldDivider/>

        {/* Ana mesaj */}
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:20, fontStyle:"italic",
          color:DARK, lineHeight:1.4, marginBottom:12,
        }}>
          Aradığınız sayfa bu davete<br/>katılamayacağını bildiriyor.
        </p>

        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:13, color:`${DARK}60`,
          lineHeight:1.8, marginBottom:4, letterSpacing:"0.02em",
        }}>
          Sayfa kaybolmuş, silinmiş ya da hiç var olmamış olabilir.<br/>
          Sizi doğru yere götürmekten memnuniyet duyarız.
        </p>

        <GoldDivider/>

        {/* RSVP etiketi */}
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:9, letterSpacing:"0.38em",
          color:`${DARK}45`, textTransform:"uppercase", marginBottom:18,
        }}>
          Lütfen Cevap Veriniz
        </p>

        {/* Butonlar */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%" }}>
          <Link href="/" style={{
            display:"block", padding:"13px 24px",
            background:DARK, borderRadius:3,
            fontFamily:"var(--font-cormorant),serif",
            fontSize:12, letterSpacing:"0.28em",
            color:CREAM, textDecoration:"none",
            textTransform:"uppercase", textAlign:"center",
            transition:"opacity 0.18s",
          }}>
            Ana Sayfaya Dön
          </Link>
          <Link href="/sablonlar" style={{
            display:"block", padding:"12px 24px",
            background:"transparent",
            border:`1px solid ${GOLD}50`,
            borderRadius:3,
            fontFamily:"var(--font-cormorant),serif",
            fontSize:12, letterSpacing:"0.28em",
            color:`${DARK}80`, textDecoration:"none",
            textTransform:"uppercase", textAlign:"center",
          }}>
            Şablonlara Bak
          </Link>
        </div>

        {/* Alt imza */}
        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:16, color:`${GOLD}70`,
          marginTop:28, letterSpacing:"0.04em",
        }}>
          Davetim
        </p>

      </div>
    </div>
  );
}

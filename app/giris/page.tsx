"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

/* ── Sol panel — davetiye kartı önizlemeleri ── */
const CARDS = [
  { bg: "linear-gradient(150deg,#3B0A14 0%,#1a0308 100%)", gold: "#C4A05A", label: "Lüks Nişan",   rot: "-6deg",  x: -24, y: 0   },
  { bg: "linear-gradient(150deg,#0D1F3C 0%,#071228 100%)", gold: "#D4AA70", label: "Lüks Düğün",   rot:  "3deg",  x:  12, y: 40  },
  { bg: "linear-gradient(150deg,#140828 0%,#0A0414 100%)", gold: "#D4A84B", label: "Lüks Doğum",   rot:  "12deg", x:  48, y: 80  },
];

function InviteStack() {
  return (
    <div style={{ position:"relative", width:220, height:300, margin:"0 auto" }}>
      {CARDS.map((c, i) => (
        <div key={i} style={{
          position:"absolute", inset:0,
          transform:`rotate(${c.rot}) translate(${c.x}px,${c.y}px)`,
          transformOrigin:"center center",
          transition:"transform 0.3s",
        }}>
          <div style={{
            width:200, height:280,
            borderRadius:18,
            background: c.bg,
            border:`1px solid ${c.gold}30`,
            boxShadow:`0 20px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.04)`,
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:10,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:0.5, background:`${c.gold}50` }}/>
              <span style={{ color:c.gold, fontSize:10 }}>✦</span>
              <div style={{ width:28, height:0.5, background:`${c.gold}50` }}/>
            </div>
            <div style={{ fontFamily:"var(--font-dancing),cursive", fontSize:28, color:"#F9F3E8", textAlign:"center" }}>Davetim</div>
            <div style={{ width:"60%", height:0.5, background:`${c.gold}35` }}/>
            <div style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.25em", color:`${c.gold}80`, textTransform:"uppercase" }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GirisIcerigi() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div style={{ minHeight:"100vh", display:"flex" }}>

      {/* ── Sol Panel ── */}
      <div className="hidden lg:flex" style={{
        flex:"0 0 52%",
        background:"linear-gradient(145deg, #4C1D95 0%, #6D28D9 45%, #BE185D 100%)",
        position:"relative",
        overflow:"hidden",
        padding:"48px 56px",
        flexDirection:"column",
        justifyContent:"space-between",
      }}>

        {/* Dot texture */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.08) 1px,transparent 1px)",
          backgroundSize:"24px 24px",
        }}/>

        {/* Blob */}
        <div style={{
          position:"absolute", bottom:"-15%", right:"-10%",
          width:480, height:480, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 65%)",
          pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", top:"-10%", left:"-8%",
          width:360, height:360, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 65%)",
          pointerEvents:"none",
        }}/>

        {/* Logo */}
        <div style={{ position:"relative", zIndex:2 }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:"rgba(255,255,255,0.2)",
              border:"1px solid rgba(255,255,255,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:16 }}>D</span>
            </div>
            <span style={{ fontFamily:"var(--font-dancing),cursive", fontSize:26, color:"#fff" }}>Davetim</span>
          </Link>
        </div>

        {/* Orta içerik */}
        <div style={{ position:"relative", zIndex:2, flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:40 }}>
          <div>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.32em", color:"rgba(255,255,255,0.55)", textTransform:"uppercase", marginBottom:14 }}>
              Dijital Davetiye Platformu
            </p>
            <h2 style={{ fontFamily:"var(--font-dancing),cursive", fontSize:54, color:"#fff", lineHeight:1.05, marginBottom:18 }}>
              Özel anlarınızı<br/>unutulmaz kılın
            </h2>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:16, color:"rgba(255,255,255,0.65)", lineHeight:1.7, maxWidth:360 }}>
              Düğün, nişan, doğum günü ve daha fazlası için dakikalar içinde şık dijital davetiyeler oluşturun.
            </p>
          </div>

          {/* Kart önizlemesi */}
          <InviteStack />

          {/* Özellikler */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { icon:"✦", text:"Lüks şablonlar, sıfır tasarım bilgisi" },
              { icon:"✦", text:"WhatsApp ile tek tıkla paylaşım" },
              { icon:"✦", text:"Canlı RSVP takibi ve misafir listesi" },
            ].map((f,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:9 }}>{f.icon}</span>
                <span style={{ fontFamily:"var(--font-cormorant),serif", fontSize:14, color:"rgba(255,255,255,0.7)", letterSpacing:"0.02em" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alt */}
        <div style={{ position:"relative", zIndex:2 }}>
          <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:12, color:"rgba(255,255,255,0.35)", letterSpacing:"0.06em" }}>
            500+ davetiye · Türkiye genelinde
          </p>
        </div>
      </div>

      {/* ── Sağ Panel ── */}
      <div style={{
        flex:1,
        background:"#fff",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"48px 40px",
        position:"relative",
      }}>

        {/* Sağ üst — anasayfa */}
        <div style={{ position:"absolute", top:24, right:28 }}>
          <Link href="/" style={{
            display:"flex", alignItems:"center", gap:6,
            fontSize:13, color:"#9CA3AF", textDecoration:"none",
            fontWeight:500, transition:"color 0.15s",
          }}>
            ← Anasayfa
          </Link>
        </div>

        {/* Mobilde logo */}
        <div className="flex lg:hidden" style={{ marginBottom:32, textAlign:"center", flexDirection:"column", alignItems:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:9 }}>
            <div style={{
              width:32, height:32, borderRadius:9,
              background:"linear-gradient(135deg,#7C3AED,#DB2777)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>D</span>
            </div>
            <span style={{ fontFamily:"var(--font-dancing),cursive", fontSize:24, color:"#111827" }}>Davetim</span>
          </div>
        </div>

        {/* Form alanı */}
        <div style={{ width:"100%", maxWidth:360 }}>
          <h1 style={{ fontSize:28, fontWeight:700, color:"#111827", marginBottom:8, letterSpacing:"-0.02em" }}>
            Tekrar hoş geldiniz
          </h1>
          <p style={{ fontSize:15, color:"#6B7280", marginBottom:36, lineHeight:1.6 }}>
            Hesabınıza giriş yaparak davetiyelerinize ulaşın.
          </p>

          {/* Google butonu */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            style={{
              width:"100%",
              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              padding:"13px 20px",
              borderRadius:12,
              background:"#fff",
              border:"1.5px solid #E5E7EB",
              color:"#374151",
              fontSize:15, fontWeight:600,
              cursor:"pointer",
              boxShadow:"0 1px 3px rgba(0,0,0,0.07)",
              transition:"all 0.18s ease",
              outline:"none",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = "#D1D5DB";
              el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = "#E5E7EB";
              el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)";
              el.style.transform = "translateY(0)";
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

          {/* Ayraç */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"28px 0" }}>
            <div style={{ flex:1, height:1, background:"#F3F4F6" }}/>
            <span style={{ fontSize:12, color:"#D1D5DB", fontWeight:500 }}>Güvenli giriş</span>
            <div style={{ flex:1, height:1, background:"#F3F4F6" }}/>
          </div>

          {/* Özellik rozetleri */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
            {["🔒 SSL Korumalı","⚡ Anında Giriş","🎉 Ücretsiz Başla"].map(t=>(
              <span key={t} style={{
                fontSize:11, fontWeight:500,
                background:"#F9FAFB", border:"1px solid #F3F4F6",
                borderRadius:20, padding:"4px 10px", color:"#6B7280",
              }}>{t}</span>
            ))}
          </div>

          {/* Şartlar */}
          <p style={{ fontSize:12, color:"#9CA3AF", lineHeight:1.7 }}>
            Giriş yaparak{" "}
            <a href="/kullanim-sartlari" style={{ color:"#7C3AED", textDecoration:"none", fontWeight:500 }}>
              kullanım şartlarını
            </a>{" "}
            ve{" "}
            <a href="/gizlilik" style={{ color:"#7C3AED", textDecoration:"none", fontWeight:500 }}>
              gizlilik politikasını
            </a>{" "}
            kabul etmiş olursunuz.
          </p>
        </div>
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

"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

/* ─── Plan verileri ─────────────────────────────────────── */
const PLAN: Record<string, { isim: string; fiyat: string; ozellikler: string[] }> = {
  standart: {
    isim: "Standart",
    fiyat: "₺299",
    ozellikler: ["5 aktif davetiye", "200 davetli limiti", "Tüm premium şablonlar", "QR kod oluşturma"],
  },
  premium: {
    isim: "Premium",
    fiyat: "₺599",
    ozellikler: ["Sınırsız davetiye", "Sınırsız davetli", "Müzik & animasyon ekleme", "Öncelikli destek"],
  },
};

/* ─── Confetti parçacıkları ─────────────────────────────── */
const COLORS = ["#a855f7","#ec4899","#f59e0b","#34d399","#60a5fa","#f97316","#e879f9","#fb923c"];
const PIECES = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  left: `${5 + (i * 1.9) % 90}%`,
  delay: `${(i * 0.07).toFixed(2)}s`,
  dur: `${(1.8 + (i % 5) * 0.3).toFixed(1)}s`,
  size: 5 + (i % 4) * 3,
  isRect: i % 3 !== 2,
  rotStart: (i * 37) % 360,
}));

/* ─── Checkmark SVG animasyonlu ────────────────────────── */
function CheckRing() {
  return (
    <div className="relative" style={{ width: 120, height: 120 }}>
      {/* Dış glow halkası */}
      <div style={{
        position: "absolute", inset: -16,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)",
        animation: "pulse-glow 2s ease-in-out infinite",
      }}/>
      {/* Dönen gradient halka */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "conic-gradient(from 0deg, #a855f7, #ec4899, #a855f7)",
        animation: "spin 4s linear infinite",
        padding: 3,
      }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#0a0118" }}/>
      </div>
      {/* İç daire */}
      <div style={{
        position: "absolute", inset: 4, borderRadius: "50%",
        background: "linear-gradient(135deg, #1e0a3c 0%, #0f0118 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M10 25L20 35L38 14"
            stroke="url(#ck-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48"
            strokeDashoffset="48"
            style={{ animation: "draw-check 0.7s 0.4s cubic-bezier(.4,0,.2,1) forwards" }}
          />
          <defs>
            <linearGradient id="ck-grad" x1="10" y1="24" x2="38" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc"/>
              <stop offset="1" stopColor="#f472b6"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

/* ─── Ana içerik ────────────────────────────────────────── */
function BasariliIcerigi() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") ?? "standart";
  const plan   = PLAN[planId] ?? PLAN.standart;

  const [visible, setVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    update(); // JWT'yi yenile — plan bilgisi oturuma yansısın
    const t = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setShowConfetti(false), 4000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(var(--r0)) scale(1); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(100vh) rotate(var(--r1)) scale(0.6); opacity: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badge-pop {
          0%   { opacity: 0; transform: scale(0.5); }
          70%  { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(40px, -30px) scale(1.1); }
          66%      { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>

      {/* ── Confetti ── */}
      {showConfetti && (
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:60, overflow:"hidden" }}>
          {PIECES.map(p => (
            <div key={p.id} style={{
              position: "absolute",
              top: "-10px",
              left: p.left,
              width: p.isRect ? p.size : p.size,
              height: p.isRect ? p.size * 0.45 : p.size,
              borderRadius: p.isRect ? 2 : "50%",
              background: p.color,
              "--r0": `${p.rotStart}deg`,
              "--r1": `${p.rotStart + 540}deg`,
              animationName: "confetti-fall",
              animationDuration: p.dur,
              animationDelay: p.delay,
              animationTimingFunction: "cubic-bezier(.25,.46,.45,.94)",
              animationFillMode: "both",
            } as React.CSSProperties}/>
          ))}
        </div>
      )}

      {/* ── Arka plan ── */}
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #06000f 0%, #0d0120 50%, #080014 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "48px 20px", position: "relative", overflow: "hidden",
      }}>
        {/* Blob'lar */}
        <div style={{
          position:"absolute", top:"10%", left:"15%", width:500, height:500,
          borderRadius:"50%", background:"radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 65%)",
          filter:"blur(60px)", animation:"orb-drift 12s ease-in-out infinite", pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", bottom:"15%", right:"10%", width:400, height:400,
          borderRadius:"50%", background:"radial-gradient(circle, rgba(219,39,119,0.18) 0%, transparent 65%)",
          filter:"blur(60px)", animation:"orb-drift 15s ease-in-out infinite reverse", pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", inset:0, opacity:0.03, pointerEvents:"none",
          backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize:"32px 32px",
        }}/>

        {/* ── Kart ── */}
        <div style={{
          position:"relative", zIndex:2, width:"100%", maxWidth:480,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>

          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:10, textDecoration:"none" }}>
              <div style={{
                width:36, height:36, borderRadius:10,
                background:"linear-gradient(135deg,#7C3AED,#DB2777)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <span style={{ color:"#fff", fontWeight:700, fontSize:16 }}>D</span>
              </div>
              <span style={{ fontFamily:"var(--font-dancing),cursive", fontSize:26, color:"#fff" }}>Bekleriz</span>
            </Link>
          </div>

          {/* Ana panel */}
          <div style={{
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:28,
            backdropFilter:"blur(24px)",
            padding:"44px 36px 36px",
            boxShadow:"0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>

            {/* Check ikonu */}
            <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
              <CheckRing />
            </div>

            {/* Başlık */}
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <p style={{
                fontFamily:"var(--font-cormorant),serif",
                fontSize:11, letterSpacing:"0.28em",
                color:"rgba(168,85,247,0.8)", textTransform:"uppercase",
                marginBottom:10,
                animation:"float-up 0.6s 0.6s both",
              }}>
                Ödeme Onaylandı
              </p>
              <h1 style={{
                fontFamily:"var(--font-dancing),cursive",
                fontSize:54, color:"#fff", lineHeight:1.1,
                marginBottom:10,
                animation:"float-up 0.6s 0.8s both",
              }}>
                Tebrikler!
              </h1>
              <p style={{
                fontSize:15, color:"rgba(255,255,255,0.5)", lineHeight:1.6,
                animation:"float-up 0.6s 1s both",
              }}>
                <span style={{
                  background:"linear-gradient(135deg,#c084fc,#f472b6)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                  fontWeight:700,
                }}>
                  {plan.isim} Plan
                </span>
                {"'ınız aktif edildi."}
              </p>
            </div>

            {/* Özellikler */}
            <div style={{
              background:"rgba(168,85,247,0.08)",
              border:"1px solid rgba(168,85,247,0.2)",
              borderRadius:18, padding:"20px 24px", marginBottom:28,
              animation:"float-up 0.6s 1.1s both",
            }}>
              <p style={{
                fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase",
                color:"rgba(196,132,252,0.7)", marginBottom:16, fontWeight:600,
              }}>
                Kilidini Açtıklarınız
              </p>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                {plan.ozellikler.map((o, i) => (
                  <li key={o} style={{
                    display:"flex", alignItems:"center", gap:12,
                    animation:`float-up 0.5s ${1.2 + i * 0.1}s both`,
                  }}>
                    <span style={{
                      width:22, height:22, borderRadius:"50%", flexShrink:0,
                      background:"linear-gradient(135deg,rgba(168,85,247,0.35),rgba(244,114,182,0.35))",
                      border:"1px solid rgba(196,132,252,0.4)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, color:"#c084fc",
                    }}>✓</span>
                    <span style={{ fontSize:14, color:"rgba(255,255,255,0.8)" }}>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sipariş özeti */}
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"14px 18px",
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:14, marginBottom:28,
              animation:"float-up 0.6s 1.6s both",
            }}>
              <div>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:4 }}>Sipariş tutarı</p>
                <p style={{ fontSize:20, fontWeight:700, color:"#fff" }}>{plan.fiyat}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:4 }}>Durum</p>
                <span style={{
                  display:"inline-flex", alignItems:"center", gap:6,
                  background:"rgba(52,211,153,0.15)", border:"1px solid rgba(52,211,153,0.35)",
                  color:"#34d399", fontSize:11, fontWeight:600,
                  padding:"3px 10px", borderRadius:999,
                }}>
                  <span style={{
                    width:6, height:6, borderRadius:"50%", background:"#34d399",
                    boxShadow:"0 0 6px #34d399",
                  }}/>
                  Onaylandı
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/dashboard" style={{
              display:"block", textAlign:"center",
              padding:"16px 24px", borderRadius:18,
              background:"linear-gradient(135deg,#7C3AED 0%,#9333EA 50%,#DB2777 100%)",
              color:"#fff", fontWeight:700, fontSize:15,
              textDecoration:"none",
              boxShadow:"0 8px 32px rgba(124,58,237,0.45)",
              transition:"opacity 0.2s, transform 0.2s",
              animation:"float-up 0.6s 1.8s both",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              Dashboard&apos;a Geç →
            </Link>

            <p style={{
              textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.25)",
              marginTop:18,
              animation:"float-up 0.6s 2s both",
            }}>
              Ödeme belgesi için{" "}
              <a href="mailto:destek@bekleriz.com" style={{ color:"rgba(196,132,252,0.6)", textDecoration:"none" }}>
                destek@bekleriz.com
              </a>
            </p>
          </div>

          {/* Alt rozet */}
          <div style={{
            textAlign:"center", marginTop:24,
            display:"flex", justifyContent:"center", gap:20,
            animation:"float-up 0.6s 2.1s both",
          }}>
            {["🔒 SSL Şifreli","✅ iyzico","💳 Güvenli Ödeme"].map(r => (
              <span key={r} style={{ fontSize:11, color:"rgba(255,255,255,0.25)" }}>{r}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function OdemeBasarili() {
  return (
    <Suspense>
      <BasariliIcerigi />
    </Suspense>
  );
}

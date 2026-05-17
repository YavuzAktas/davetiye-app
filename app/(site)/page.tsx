"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ── Hooks ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function useCounter(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return value;
}

function StatCard({ hedef, suffix, tur, inView }: { hedef: number; suffix: string; tur: string; inView: boolean }) {
  const value = useCounter(hedef, inView);
  return (
    <div className="text-center group">
      <p className="text-5xl md:text-7xl font-bold text-white tabular-nums group-hover:scale-110 transition-transform">
        {value}{suffix}
      </p>
      <p className="text-purple-400 text-xs mt-3 tracking-[0.2em] uppercase">{tur}</p>
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── HOW IT WORKS sub-components ── */
function TypingField() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting">("typing");
  const target = "Mehmet";

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < target.length) {
        t = setTimeout(() => setText(target.slice(0, text.length + 1)), 130);
      } else {
        t = setTimeout(() => setPhase("hold"), 1500);
      }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("deleting"), 600);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), 80);
      } else {
        t = setTimeout(() => setPhase("typing"), 500);
      }
    }
    return () => clearTimeout(t);
  }, [text, phase]);

  return (
    <div className="border border-gray-200 rounded-lg px-2.5 py-1.5 flex items-center min-h-[26px]">
      <span className="text-xs text-gray-800">{text}</span>
      <span className="inline-block w-px h-3.5 bg-gray-500 ml-px animate-pulse" />
    </div>
  );
}

function ChatMsg({ text, type, delay }: { text: string; type: "in" | "out"; delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex ${type === "out" ? "justify-end" : "justify-start"}`}
      style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.35s, transform 0.35s" }}
    >
      <div className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
        type === "in"
          ? "bg-white border border-gray-100 text-gray-700 rounded-bl-sm"
          : "bg-[#d9fdd3] text-gray-800 rounded-br-sm"
      }`}>
        {text}
      </div>
    </div>
  );
}

function ChatCard({ delay }: { delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex justify-end"
      style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.35s, transform 0.35s" }}
    >
      <div className="max-w-[80%] rounded-2xl rounded-br-sm overflow-hidden border border-gray-200 shadow-sm">
        <div className="h-14 bg-gradient-to-b from-amber-800 to-amber-900 flex items-center justify-center px-3">
          <p className="text-white text-sm" style={{ fontFamily: "var(--font-dancing), cursive" }}>Ayşe & Mehmet</p>
        </div>
        <div className="bg-[#d9fdd3] px-2.5 py-1.5">
          <p className="text-[10px] font-semibold text-gray-700">Düğün Davetiyesi 💍</p>
          <p className="text-[9px] text-gray-400">bekleriz.com/davetiye/ayse-mehmet</p>
        </div>
      </div>
    </div>
  );
}

/* ── Phone mockup sub-components ── */
const SABLONLAR_MINI = [
  {
    id: "nisan",
    bg: "radial-gradient(ellipse at 50% 40%,#5C1020 0%,#3B0A14 55%,#270610 100%)",
    dotColor: "rgba(196,160,90,0.06)",
    gold: "#C4A05A",
    cream: "#F5E8D8",
    isim1: "Aylin",
    isim2: "Yavuz",
    tarih: "6 HAZİRAN 2026",
    seal: "rose" as const,
    bgSeal: "#3B0A14",
  },
  {
    id: "dugun",
    bg: "radial-gradient(ellipse at 50% 40%,#1E3A6E 0%,#0D1F3C 55%,#071228 100%)",
    dotColor: "rgba(212,170,112,0.06)",
    gold: "#D4AA70",
    cream: "#F8F3EE",
    isim1: "Ayşe",
    isim2: "Mehmet",
    tarih: "12 EYLÜL 2026",
    seal: "rings" as const,
    bgSeal: "#0D1F3C",
  },
  {
    id: "dogumgunu",
    bg: "radial-gradient(ellipse at 50% 40%,#2A0F4A 0%,#140828 55%,#0A0414 100%)",
    dotColor: "rgba(212,168,75,0.06)",
    gold: "#D4A84B",
    cream: "#F9F3E8",
    isim1: "Elif",
    isim2: null,
    tarih: "18 AĞUSTOS 2026",
    seal: "cake" as const,
    bgSeal: "#140828",
  },
] as const;

type MiniSablon = typeof SABLONLAR_MINI[number];

function MiniRoseSeal({ gold, bgColor }: { gold: string; bgColor: string }) {
  return (
    <svg viewBox="0 0 200 200" style={{ width:"100%", height:"100%" }} fill="none">
      <circle cx="100" cy="100" r="100" fill={bgColor}/>
      <circle cx="100" cy="100" r="88" stroke={`${gold}22`} strokeWidth="1.5"/>
      <circle cx="100" cy="100" r="78" stroke={`${gold}10`} strokeWidth="0.8" strokeDasharray="3 5"/>
      {[0,60,120,180,240,300].map((a,i) => (
        <ellipse key={i} cx="100" cy="54" rx="14" ry="22"
          fill="rgba(200,80,80,0.28)" stroke="rgba(240,160,140,0.3)" strokeWidth="0.8"
          transform={`rotate(${a} 100 100)`}/>
      ))}
      {[30,90,150,210,270,330].map((a,i) => (
        <ellipse key={i} cx="100" cy="63" rx="11" ry="17"
          fill="rgba(210,90,90,0.36)" transform={`rotate(${a} 100 100)`}/>
      ))}
      {[15,75,135,195,255,315].map((a,i) => (
        <ellipse key={i} cx="100" cy="73" rx="8" ry="12"
          fill="rgba(220,100,100,0.44)" transform={`rotate(${a} 100 100)`}/>
      ))}
      <circle cx="100" cy="100" r="12" fill="rgba(215,95,95,0.6)"/>
      <circle cx="100" cy="100" r="7"  fill="rgba(235,115,115,0.7)"/>
      <circle cx="100" cy="100" r="3"  fill="rgba(248,145,135,0.8)"/>
    </svg>
  );
}

function MiniRingsSeal({ gold, bgColor }: { gold: string; bgColor: string }) {
  return (
    <svg viewBox="0 0 200 200" style={{ width:"100%", height:"100%" }} fill="none">
      <circle cx="100" cy="100" r="100" fill={bgColor}/>
      <circle cx="100" cy="100" r="88" stroke={`${gold}22`} strokeWidth="1.5"/>
      <circle cx="100" cy="100" r="78" stroke={`${gold}10`} strokeWidth="0.8" strokeDasharray="3 5"/>
      <circle cx="80"  cy="112" r="38" stroke={gold} strokeWidth="7" fill="none" opacity="0.9"/>
      <circle cx="120" cy="112" r="38" stroke={gold} strokeWidth="7" fill="none" opacity="0.9"/>
      <circle cx="80"  cy="112" r="38" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none"/>
      <circle cx="120" cy="112" r="38" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none"/>
      <polygon points="100,44 116,62 100,78 84,62" fill={gold} opacity="0.88"/>
      <polygon points="100,44 116,62 100,54 84,62" fill="rgba(255,255,255,0.25)"/>
      <polygon points="100,78 116,62 100,68 84,62" fill="rgba(0,0,0,0.2)"/>
      <text x="42"  y="60"  textAnchor="middle" fontSize="9" fill={`${gold}55`}>✦</text>
      <text x="158" y="60"  textAnchor="middle" fontSize="9" fill={`${gold}55`}>✦</text>
    </svg>
  );
}

function MiniCakeSeal({ gold, bgColor }: { gold: string; bgColor: string }) {
  const PL = "#5A2090";
  return (
    <svg viewBox="0 0 200 200" style={{ width:"100%", height:"100%" }} fill="none">
      <circle cx="100" cy="100" r="100" fill={bgColor}/>
      <circle cx="100" cy="100" r="88" stroke={`${gold}22`} strokeWidth="1.5"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => {
        const rad = (a * Math.PI) / 180;
        return <circle key={i} cx={100+77*Math.cos(rad)} cy={100+77*Math.sin(rad)}
          r={i%3===0?2.2:1.2} fill={gold} opacity={i%3===0?0.45:0.2}/>;
      })}
      <ellipse cx="100" cy="164" rx="58" ry="7" fill={gold} opacity="0.15"/>
      <rect x="44" y="126" width="112" height="38" rx="7" fill={PL} opacity="0.75"/>
      <rect x="44" y="118" width="112" height="11" rx="5" fill={gold} opacity="0.55"/>
      <rect x="60" y="92"  width="80"  height="28" rx="5" fill={PL} opacity="0.6"/>
      <rect x="60" y="86"  width="80"  height="9"  rx="4" fill={gold} opacity="0.45"/>
      <rect x="76" y="68"  width="48"  height="18" rx="4" fill={PL} opacity="0.5"/>
      <rect x="76" y="65"  width="48"  height="6"  rx="3" fill={gold} opacity="0.4"/>
      <rect x="97" y="50"  width="6"   height="17" rx="3" fill={gold} opacity="0.7"/>
      <ellipse cx="100" cy="48" rx="5" ry="7" fill="rgba(255,200,50,0.75)"/>
    </svg>
  );
}

function PhoneScreen({ sablon }: { sablon: MiniSablon }) {
  return (
    <div style={{
      width:"100%", height:"100%",
      background: sablon.bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"12px 8px", position:"relative", overflow:"hidden",
    }}>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(circle,${sablon.dotColor} 1px,transparent 1px)`,
        backgroundSize:"18px 18px",
      }} />
      <p style={{
        fontFamily:"var(--font-dancing),cursive",
        fontSize:"15px", color:sablon.cream, lineHeight:1.2,
        textAlign:"center", marginBottom:5, position:"relative", zIndex:1,
      }}>
        {sablon.isim1}
        {sablon.isim2 && (
          <><br/><span style={{ color:sablon.gold, fontSize:"10px" }}>&amp;</span><br/>{sablon.isim2}</>
        )}
      </p>
      <div style={{ display:"flex", alignItems:"center", gap:4, width:"65%", marginBottom:5, position:"relative", zIndex:1 }}>
        <div style={{ flex:1, height:0.5, background:`linear-gradient(to right,transparent,${sablon.gold}80)` }}/>
        <span style={{ color:sablon.gold, fontSize:5, letterSpacing:3 }}>✦</span>
        <div style={{ flex:1, height:0.5, background:`linear-gradient(to left,transparent,${sablon.gold}80)` }}/>
      </div>
      <div style={{
        width:72, height:72, position:"relative", zIndex:1,
        boxShadow:`0 0 0 3px ${sablon.bgSeal},0 0 0 4.5px ${sablon.gold}22,0 8px 20px rgba(0,0,0,0.5)`,
        borderRadius:"50%",
      }}>
        {sablon.seal === "rose"  && <MiniRoseSeal  gold={sablon.gold} bgColor={sablon.bgSeal}/>}
        {sablon.seal === "rings" && <MiniRingsSeal gold={sablon.gold} bgColor={sablon.bgSeal}/>}
        {sablon.seal === "cake"  && <MiniCakeSeal  gold={sablon.gold} bgColor={sablon.bgSeal}/>}
      </div>
      <p style={{
        fontFamily:"var(--font-cormorant),serif",
        fontSize:"6.5px", letterSpacing:"0.28em",
        color:sablon.gold, marginTop:6,
        position:"relative", zIndex:1, textAlign:"center",
      }}>{sablon.tarih}</p>
      <p style={{
        fontFamily:"var(--font-cormorant),serif",
        fontSize:"5.5px", fontStyle:"italic", letterSpacing:"0.15em",
        color:`${sablon.gold}60`, marginTop:2,
        position:"relative", zIndex:1,
      }}>Mühüre dokun ✦</p>
    </div>
  );
}

function PhoneMockupKart() {
  const [aktif, setAktif] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setAktif(p => (p + 1) % SABLONLAR_MINI.length); setFade(true); }, 280);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-72 flex items-center justify-center relative overflow-hidden"
      style={{ background:"linear-gradient(135deg,#f7f3ff 0%,#fff0f6 100%)" }}>
      {/* Sol telefon */}
      <div className="absolute left-0 top-7 w-[96px] h-[172px] bg-gray-900 rounded-[18px] border-[3px] border-gray-700 -rotate-12 opacity-45 overflow-hidden shadow-xl" style={{ zIndex:1 }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:36, height:14, background:"#111", borderRadius:"0 0 10px 10px", zIndex:10 }}/>
        <PhoneScreen sablon={SABLONLAR_MINI[1]}/>
      </div>
      {/* Sağ telefon */}
      <div className="absolute right-0 top-7 w-[96px] h-[172px] bg-gray-900 rounded-[18px] border-[3px] border-gray-700 rotate-12 opacity-45 overflow-hidden shadow-xl" style={{ zIndex:1 }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:36, height:14, background:"#111", borderRadius:"0 0 10px 10px", zIndex:10 }}/>
        <PhoneScreen sablon={SABLONLAR_MINI[2]}/>
      </div>
      {/* Orta telefon — döngülü */}
      <div className="relative w-36 h-[236px] bg-gray-900 rounded-[28px] border-[3px] border-gray-700 overflow-hidden shadow-2xl" style={{ zIndex:2 }}>
        <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:52, height:18, background:"#111", borderRadius:"0 0 14px 14px", zIndex:10 }}/>
        <div style={{ position:"absolute", inset:0, opacity:fade?1:0, transition:"opacity 0.28s ease" }}>
          <PhoneScreen sablon={SABLONLAR_MINI[aktif]}/>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 50%)" }}/>
      </div>
      {/* Sayfa göstergesi */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex:3 }}>
        {SABLONLAR_MINI.map((s, i) => (
          <div key={s.id} style={{
            width:i===aktif?14:5, height:5, borderRadius:3,
            background:i===aktif?SABLONLAR_MINI[aktif].gold:"rgba(0,0,0,0.18)",
            transition:"all 0.3s",
          }}/>
        ))}
      </div>
    </div>
  );
}

const MARQUEE = [
  "⚡ Dakikalar içinde hazır",
  "📱 WhatsApp ile paylaş",
  "✅ RSVP takibi",
  "🗺️ Konum entegrasyonu",
  "⏱️ Canlı geri sayım",
  "🎨 Renk & font seçimi",
  "🎵 Arka plan müziği",
  "💌 Dijital davetiye",
];

const HERO_GUVEN_MADDELERI = [
  "Önizle, sonra öde",
  "Tek seferlik ödeme",
  "Kart bilgileri saklanmaz",
];

const HIZLI_BASLANGIC_LINKLERI = [
  { href: "/dugun-davetiyesi", label: "Düğün" },
  { href: "/nisan-davetiyesi", label: "Nişan" },
  { href: "/sablonlar?tur=dogum-gunu", label: "Doğum günü" },
  { href: "/online-davetiye", label: "Online davetiye" },
];

const STARS = [
  { top: "18%", left: "8%" },
  { top: "35%", right: "12%" },
  { top: "65%", left: "15%" },
  { bottom: "28%", right: "8%" },
  { top: "50%", left: "4%" },
  { top: "80%", right: "22%" },
];

export default function Anasayfa() {
  const [statsRef, statsInView] = useInView(0.3);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080112]">

        {/* Animated blobs */}
        <div className="absolute top-1/4 -left-60 w-[600px] h-[600px] rounded-full bg-purple-700 opacity-25 blur-[120px] animate-blob-1 pointer-events-none" />
        <div className="absolute bottom-1/4 -right-60 w-[500px] h-[500px] rounded-full bg-pink-700 opacity-20 blur-[100px] animate-blob-2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-violet-900 opacity-15 blur-[80px] pointer-events-none" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Rotating rings */}
        <div className="absolute top-16 right-24 w-36 h-36 border border-purple-500/15 rounded-full animate-spin-slow hidden lg:block" />
        <div className="absolute bottom-28 left-20 w-20 h-20 border border-pink-500/15 rounded-full hidden lg:block" style={{ animation: "spin-slow 15s linear infinite reverse" }} />
        <div className="absolute top-1/2 right-8 w-48 h-48 border border-white/5 rounded-full animate-spin-slow hidden xl:block" style={{ animationDuration: "30s" }} />

        {/* Star dots */}
        {STARS.map((s, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse pointer-events-none"
            style={{ ...s, animationDelay: `${i * 0.5}s`, animationDuration: "3s" }} />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium px-4 py-2 rounded-full mb-10 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Online davetiye ve RSVP takip platformu
              </div>

              <h1 className="text-white mb-8">
                <span className="block text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                  Davetiyeni hazırla,
                </span>
                <span
                  className="block text-5xl sm:text-6xl md:text-7xl leading-[1.2] bg-gradient-to-r from-purple-400 via-pink-400 to-rose-300 bg-clip-text text-transparent animate-gradient"
                  style={{ fontFamily: "var(--font-dancing), cursive" }}
                >
                  link olarak paylaş
                </span>
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                Düğün, nişan, doğum günü ve özel etkinlikler için dakikalar içinde şık dijital davetiye oluştur.
                Önizlemeni gör, seçtiğin özellikleri net fiyatla onayla, WhatsApp ile misafirlerine gönder.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-5">
                <Link
                  href="/sablonlar"
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-2xl shadow-purple-900/50 hover:-translate-y-0.5 hover:shadow-purple-500/40 transition-all text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Şablon Seç ve Başla
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/sablonlar"
                  className="border border-white/15 text-white/80 px-8 py-4 rounded-2xl text-base font-medium hover:bg-white/8 hover:border-white/25 transition-all text-center backdrop-blur-sm"
                >
                  Örnekleri Gör
                </Link>
              </div>

              <div className="mb-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {HERO_GUVEN_MADDELERI.map(madde => (
                  <span
                    key={madde}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold text-white/65 backdrop-blur-sm"
                  >
                    ✓ {madde}
                  </span>
                ))}
              </div>

              <div className="mb-10 flex flex-wrap justify-center gap-2 lg:justify-start">
                {HIZLI_BASLANGIC_LINKLERI.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-purple-300/15 bg-purple-300/[0.07] px-3.5 py-2 text-xs font-bold text-purple-100/75 transition hover:border-purple-300/35 hover:bg-purple-300/[0.12] hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["💍", "🎂", "💑", "⭐"].map((e, i) => (
                    <div key={i} className="w-9 h-9 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-sm shadow-sm">
                      {e}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="text-white font-semibold">3 dakikada</span> taslak oluştur, ödeme sonrası yayına al
                </p>
              </div>
            </div>

            {/* Right — Floating card mockup */}
            <div className="relative hidden lg:flex items-center justify-center min-h-[480px]">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/15 to-pink-600/15 blur-3xl" />

              {/* Main card */}
              <div className="relative animate-float">
                <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-7 w-80 shadow-2xl">
                  <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-6" />
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">💍</div>
                    <p className="text-purple-300 text-[10px] tracking-[0.25em] uppercase mb-2">Düğün Davetiyesi</p>
                    <h3 className="text-white text-2xl" style={{ fontFamily: "var(--font-dancing), cursive" }}>
                      Ayşe & Mehmet
                    </h3>
                    <div className="w-8 h-px bg-white/20 mx-auto my-3" />
                    <p className="text-gray-400 text-xs italic">&ldquo;Mutluluğumuzu sizinle paylaşmak istiyoruz&rdquo;</p>
                  </div>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3.5 py-2.5">
                      <span>📅</span>
                      <span className="text-xs text-gray-300">12 Eylül 2026, Cumartesi</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3.5 py-2.5">
                      <span>📍</span>
                      <span className="text-xs text-gray-300">Çırağan Palace, İstanbul</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-purple-600 text-white text-xs py-2.5 rounded-xl font-medium">✓ Katılıyorum</button>
                    <button className="bg-white/8 text-gray-400 text-xs py-2.5 rounded-xl">✗ Katılamam</button>
                  </div>
                  <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/70">Güvenli ödeme</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-emerald-50/55">
                      Kart bilgileri iyzico altyapısında işlenir, Bekleriz tarafından saklanmaz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-4 -right-6 bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-lg shadow-emerald-900/30 animate-float-delay">
                +3 RSVP 🎉
              </div>
              <div className="absolute bottom-12 -left-8 bg-white/8 backdrop-blur-sm border border-white/15 text-white text-xs px-4 py-3 rounded-2xl shadow-xl">
                <p className="text-gray-500 text-[10px] mb-0.5">Görüntülenme</p>
                <p className="font-bold text-base">248 kişi</p>
              </div>

              {/* Mini card */}
              <div className="absolute -bottom-4 -right-8 bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 w-52 animate-float-slow">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-lg">🎂</span>
                  <span className="text-xs text-gray-300 font-medium">Doğum Günü Partisi</span>
                </div>
                <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full w-4/5 mb-1" />
                <p className="text-[10px] text-gray-600">18 Ağustos 2026</p>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-[10px] tracking-[0.2em] uppercase">Keşfet</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════ */}
      <div className="bg-white border-y border-gray-100 py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 text-gray-400 text-sm font-medium">
              {item}
              <span className="text-purple-200 text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BENTO FEATURES
      ══════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-[#080112] relative overflow-hidden">
        {/* Ambient center glow */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07] blur-[140px]" style={{ background: "radial-gradient(ellipse, #7c3aed 0%, #be185d 60%, transparent 100%)" }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Section>
            <div className="text-center mb-16">
              <span className="text-purple-400/70 text-[11px] font-bold tracking-[0.32em] uppercase">Özellikler</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
                Her şey hazır,
                <span className="block" style={{ background: "linear-gradient(90deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  sen sadece başla
                </span>
              </h2>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-auto md:auto-rows-[210px]">

            {/* 1 · Hızlı Oluştur — col-span-2 */}
            <Section className="md:col-span-2">
              <div className="h-full bg-[#0f0820] border border-purple-500/[0.14] rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500 cursor-default min-h-[210px]">
                <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-purple-600 opacity-[0.1] blur-3xl group-hover:opacity-[0.2] transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-purple-500/12 border border-purple-400/20 rounded-xl flex items-center justify-center mb-5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Dakikalar içinde hazır</h3>
                  <p className="text-purple-200/40 text-sm leading-relaxed max-w-xs">Şablon seç, bilgilerini gir, davetiyeni paylaş. Bu kadar.</p>
                </div>
                {/* Step trail — desktop only */}
                <div className="hidden md:flex absolute bottom-8 right-8 items-center gap-3">
                  {["Şablon", "Düzenle", "Paylaş"].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`text-[10px] font-semibold tracking-wide ${i === 2 ? "text-purple-300/80" : "text-purple-400/40"}`}>{s}</span>
                      {i < 2 && <div className="w-5 h-px bg-purple-500/20" />}
                    </div>
                  ))}
                </div>
                {/* Decorative lines — desktop only */}
                <div className="hidden md:block absolute left-8 bottom-8 space-y-1.5 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="w-20 h-1 bg-purple-400 rounded-full" />
                  <div className="w-12 h-1 bg-purple-600 rounded-full" />
                  <div className="w-16 h-1 bg-purple-800 rounded-full" />
                </div>
              </div>
            </Section>

            {/* 2 · RSVP Takibi — row-span-2 */}
            <Section className="md:row-span-2">
              <div className="h-full bg-[#0a1a10] border border-emerald-500/[0.14] rounded-3xl p-7 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 cursor-default min-h-[440px]">
                <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-emerald-500 opacity-[0.06] blur-3xl group-hover:opacity-[0.13] transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-400/18 rounded-xl flex items-center justify-center mb-4">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-bold mb-1">RSVP Takibi</h3>
                  <p className="text-gray-600 text-xs mb-6">Kim geliyor, kim gelemiyor?</p>
                  <div className="space-y-2.5">
                    {[
                      { isim: "Ayşe K.", durum: true },
                      { isim: "Mehmet T.", durum: true },
                      { isim: "Fatma Y.", durum: false },
                      { isim: "Can A.", durum: true },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-white/[0.025] border border-white/[0.04] rounded-xl px-3 py-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${r.durum ? "bg-emerald-400" : "bg-rose-400"}`} />
                        <span className="flex-1 text-[11px] text-gray-400">{r.isim}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wide ${r.durum ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {r.durum ? "GELİYOR" : "GELEMİYOR"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/[0.05]">
                    <div className="flex justify-between text-[10px] mb-2.5">
                      <span className="text-gray-600">Katılım oranı</span>
                      <span className="font-bold text-emerald-400">%75</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* 3 · WhatsApp */}
            <Section>
              <div className="h-full bg-[#091510] border border-emerald-600/[0.14] rounded-3xl p-7 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 cursor-default min-h-[210px]">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-emerald-500 opacity-[0.06] blur-3xl group-hover:opacity-[0.14] transition-opacity" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/18 rounded-xl flex items-center justify-center mb-4">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#4ade80">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.523 5.827L.057 23.057a.562.562 0 00.7.686l5.367-1.408A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 01-5.006-1.368l-.357-.211-3.705.972.987-3.607-.233-.371A9.818 9.818 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182S21.818 6.577 21.818 12 17.423 21.818 12 21.818z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-bold">WhatsApp'tan paylaş</h3>
                  <p className="text-emerald-400/45 text-xs mt-1.5">Tek tıkla tüm listene gönder</p>
                </div>
                <div className="absolute bottom-6 left-7 right-7">
                  <div className="bg-emerald-500/[0.08] border border-emerald-500/[0.14] rounded-xl px-3 py-2 flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-emerald-300/60 text-[10px] font-medium">Davetiye linki hazır</span>
                    <div className="ml-auto">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* 4 · Konum */}
            <Section>
              <div className="h-full bg-[#0a0f1e] border border-blue-500/[0.14] rounded-3xl p-7 relative overflow-hidden group hover:border-blue-500/28 transition-all duration-500 cursor-default min-h-[210px]">
                <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-blue-500 opacity-[0.06] blur-3xl group-hover:opacity-[0.14] transition-opacity" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/18 rounded-xl flex items-center justify-center mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-bold">Konum entegrasyonu</h3>
                  <p className="text-blue-300/45 text-xs mt-1.5">Google Maps otomatik bağlanır</p>
                </div>
                {/* Mini map dots */}
                <div className="absolute bottom-7 right-7 grid grid-cols-5 gap-[3px] opacity-15 group-hover:opacity-35 transition-opacity duration-500">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-[3px] ${i === 7 ? "bg-blue-400" : i === 6 || i === 8 || i === 12 ? "bg-blue-700" : "bg-blue-950"}`} />
                  ))}
                </div>
              </div>
            </Section>

            {/* 5 · Şarkı Dilekleri — col-span-2 */}
            <Section className="md:col-span-2">
              <div className="h-full bg-[#120a1c] border border-rose-500/[0.14] rounded-3xl p-8 relative overflow-hidden group hover:border-rose-500/28 transition-all duration-500 cursor-default min-h-[210px]">
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-rose-600 opacity-[0.07] blur-3xl group-hover:opacity-[0.14] transition-opacity duration-700" />
                <div className="absolute top-0 right-0 w-2/5 h-full flex items-center justify-end pr-8 opacity-[0.03] select-none group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                  <span className="text-[90px] text-rose-100 leading-none">♪</span>
                </div>
                <div className="relative z-10 flex items-start gap-6">
                  <div className="flex-1">
                    <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/18 rounded-xl flex items-center justify-center mb-4">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Şarkı dilekleri</h3>
                    <p className="text-gray-600 text-xs leading-relaxed max-w-[200px]">Misafirler RSVP'den şarkı diler, hepsi panelinizde toplanır.</p>
                  </div>
                  <div className="flex-shrink-0 space-y-2 w-44 mt-1">
                    {[
                      { isim: "Hepsi Geçer", sanatci: "Sezen Aksu" },
                      { isim: "Yüksek Kalite", sanatci: "Teoman" },
                      { isim: "Seni Beklerken", sanatci: "Athena" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-white/[0.025] border border-white/[0.04] hover:border-rose-400/18 rounded-xl px-3 py-2 transition-colors">
                        <div className={`w-5 h-5 rounded-md flex-shrink-0 ${i === 0 ? "bg-gradient-to-br from-purple-500 to-pink-600" : i === 1 ? "bg-gradient-to-br from-blue-500 to-cyan-500" : "bg-gradient-to-br from-orange-400 to-amber-500"}`} />
                        <div className="min-w-0">
                          <p className="text-[10px] text-white font-medium leading-tight truncate">{s.isim}</p>
                          <p className="text-[9px] text-gray-600 truncate">{s.sanatci}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* 6 · Anlık Bildirim */}
            <Section>
              <div className="h-full bg-[#100b1e] border border-violet-500/[0.14] rounded-3xl p-7 relative overflow-hidden group hover:border-violet-500/30 transition-all duration-500 cursor-default min-h-[210px]">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violet-600 opacity-[0.07] blur-3xl group-hover:opacity-[0.16] transition-opacity" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/18 rounded-xl flex items-center justify-center mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-bold">Anlık bildirim</h3>
                  <p className="text-violet-300/45 text-xs mt-1.5">Katılım cevabı gelince haberdar ol</p>
                </div>
                <div className="absolute bottom-6 left-7 right-7">
                  <div className="bg-violet-500/[0.07] border border-violet-500/[0.13] rounded-xl px-3 py-2 flex items-center gap-2.5">
                    <div className="w-4 h-4 bg-violet-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    </div>
                    <span className="text-[9px] text-violet-300/55 leading-tight">Yeni RSVP: <span className="text-violet-200/80">Ayşe Kaya geliyorum</span></span>
                  </div>
                </div>
              </div>
            </Section>

            {/* 7 · Dijital Anı Defteri — full width */}
            <Section className="md:col-span-3">
              <div className="h-full bg-[#110d06] border border-amber-500/[0.14] rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/24 transition-all duration-500 cursor-default flex flex-col md:flex-row md:items-center gap-8 min-h-[210px]">
                <div className="absolute inset-0 opacity-[0.018] pointer-events-none" style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 32px, rgba(251,191,36,1) 32px, rgba(251,191,36,1) 33px)",
                }} />
                <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-amber-600/[0.06] to-transparent" />
                <div className="relative z-10 flex-shrink-0 md:w-64">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-400/18 rounded-xl flex items-center justify-center mb-4">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                      <path d="M8 10h8M8 14h5" />
                    </svg>
                  </div>
                  <h3 className="text-white text-2xl font-bold">Dijital Anı Defteri</h3>
                  <p className="text-amber-200/35 text-sm mt-2 leading-relaxed">Misafirler mesaj bırakır — etkinlikten kalıcı bir hatıra</p>
                </div>
                <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {[
                    { mesaj: "Harika bir etkinlikti, çok mutlu olduk!", isim: "Ayşe & Mehmet" },
                    { mesaj: "Ömür boyu mutluluklar diliyoruz!", isim: "Fatma H." },
                    { mesaj: "Unutulmaz bir geceydi, teşekkürler.", isim: "Can A." },
                  ].map((a, i) => (
                    <div key={i} className="bg-amber-500/[0.05] border border-amber-400/[0.08] hover:border-amber-400/[0.15] rounded-2xl px-4 py-3 transition-colors">
                      <p className="text-gray-300/80 text-[11px] leading-relaxed">&ldquo;{a.mesaj}&rdquo;</p>
                      <p className="text-amber-400/45 text-[9px] mt-2 font-semibold tracking-wide">— {a.isim}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* 8 · Canlı Etkinlik Albümü — col-span-2 */}
            <Section className="md:col-span-2">
              <div className="h-full bg-[#0a0c18] border border-indigo-500/[0.14] rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/24 transition-all duration-500 cursor-default min-h-[210px]">
                <div className="absolute -top-20 -right-28 w-96 h-96 rounded-full bg-indigo-500 opacity-[0.04] blur-3xl group-hover:opacity-[0.09] transition-opacity duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
                  <div className="flex-shrink-0 md:w-52">
                    <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/18 rounded-xl flex items-center justify-center mb-4">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Canlı Etkinlik Albümü</h3>
                    <p className="text-gray-600 text-xs leading-relaxed mb-4">Misafirler anları paylaşır — hepsi tek albümde</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-gray-600">Canlı güncellenir</span>
                    </div>
                  </div>
                  {/* Fotoğraf mozaiği */}
                  <div className="flex-1 flex gap-2 h-36 md:h-auto md:self-stretch md:py-1">
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex-[2] rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 opacity-50 group-hover:opacity-85 transition-all duration-700" />
                      <div className="flex-[1] rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-50 group-hover:opacity-85 transition-all duration-700 delay-75" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1 pt-5">
                      <div className="flex-[1] rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 opacity-50 group-hover:opacity-85 transition-all duration-700 delay-100" />
                      <div className="flex-[2] rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 opacity-50 group-hover:opacity-85 transition-all duration-700 delay-150" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex-[1] rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 opacity-50 group-hover:opacity-85 transition-all duration-700 delay-200" />
                      <div className="flex-[2] rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-600 opacity-50 group-hover:opacity-85 transition-all duration-700 delay-[250ms]" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1 pt-3">
                      <div className="flex-[2] rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-50 group-hover:opacity-85 transition-all duration-700 delay-300" />
                      <div className="flex-[1] rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center group-hover:border-white/[0.14] transition-all duration-700 delay-[350ms]">
                        <span className="text-white/30 text-[10px] font-bold group-hover:text-white/55 transition-colors">+24</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* 9 · Geri Sayım */}
            <Section>
              <div className="h-full bg-[#0e0920] border border-purple-500/[0.18] rounded-3xl p-7 relative overflow-hidden group hover:border-purple-500/36 transition-all duration-500 cursor-default min-h-[210px]">
                <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
                  backgroundImage: "radial-gradient(circle, #a855f7 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }} />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-500 opacity-[0.09] blur-3xl group-hover:opacity-[0.2] transition-opacity" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/18 rounded-xl flex items-center justify-center mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-bold mb-1">Geri sayım sayacı</h3>
                  <p className="text-purple-300/40 text-xs mb-5">Etkinliğe kaç gün kaldığı anlık görünsün</p>
                </div>
                <div className="absolute bottom-6 left-7 right-7 grid grid-cols-4 gap-1.5">
                  {[{ n: "12", l: "GÜN" }, { n: "08", l: "SAAT" }, { n: "45", l: "DK" }, { n: "30", l: "SN" }].map((t, i) => (
                    <div key={i} className="text-center bg-purple-500/[0.09] border border-purple-500/[0.14] rounded-xl py-2">
                      <p className="text-xl font-bold text-white tabular-nums leading-none">{t.n}</p>
                      <p className="text-[7px] text-purple-400/45 tracking-widest mt-1">{t.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <Section>
            <div className="text-center mb-16">
              <span className="text-purple-500 text-xs font-bold tracking-[0.25em] uppercase">Nasıl Çalışır</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">3 adımda davetiye hazır</h2>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Kart 1: Telefon mockup */}
            <Section>
              <div className="rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <PhoneMockupKart />
                <div className="bg-white px-6 py-5">
                  <p className="font-bold text-gray-900 mb-1">1 – Şablon Seç</p>
                  <p className="text-sm text-gray-400">Etkinliğine uygun tasarımı seç, dakikalar içinde başla.</p>
                </div>
              </div>
            </Section>

            {/* Kart 2: Editör mockup */}
            <Section>
              <div className="rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-72 bg-gray-50 relative overflow-hidden">
                  {/* Davetiye önizleme */}
                  <div className="absolute inset-x-4 top-4 h-[108px] bg-linear-to-b from-[#3d1f08] to-[#7a4f1a] rounded-2xl shadow-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-yellow-200/50 text-[7px] tracking-widest uppercase mb-1">DÜĞÜN DAVETİYESİ</p>
                      <p className="text-white text-lg" style={{ fontFamily: "var(--font-dancing), cursive" }}>Ayşe & Mehmet</p>
                    </div>
                  </div>
                  {/* Düzenle rozeti */}
                  <div className="absolute top-4 right-4 bg-gray-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-lg z-10">
                    Düzenle
                  </div>
                  {/* Form paneli */}
                  <div className="absolute inset-x-4 bottom-4 bg-white rounded-2xl border border-gray-200 shadow-lg p-3">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-bold text-gray-800">İsimler</p>
                      <p className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Bileşen</p>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <p className="text-[10px] text-gray-500">İsim 1</p>
                      </div>
                      <div className="border border-blue-300 bg-blue-50/40 rounded-lg px-2.5 py-1.5">
                        <p className="text-xs text-gray-800">Ayşe</p>
                      </div>
                      <p className="text-[9px] text-gray-300 mt-0.5 px-0.5">Gelinin veya damadın adını girin</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <p className="text-[10px] text-gray-500">İsim 2</p>
                      </div>
                      <TypingField />
                      <p className="text-[9px] text-gray-300 mt-0.5 px-0.5">Gelinin veya damadın adını girin</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-6 py-5">
                  <p className="font-bold text-gray-900 mb-1">2 – Özelleştir & Yayınla</p>
                  <p className="text-sm text-gray-400">Tarih, mekan, isim ve müziği düzenle, tek tıkla yayınla.</p>
                </div>
              </div>
            </Section>

            {/* Kart 3: Chat arayüzü */}
            <Section>
              <div className="rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-72 bg-gray-50 flex flex-col justify-end gap-1.5 p-3 relative overflow-hidden">
                  {/* Chat başlığı */}
                  <div className="absolute top-0 inset-x-0 h-9 bg-white border-b border-gray-100 flex items-center justify-center shadow-sm">
                    <p className="text-[10px] text-gray-500 font-medium">Düğün Davetiyesi 💌</p>
                  </div>
                  <ChatMsg text="Düğün tarihin belli mi? 👀" type="in" delay={300} />
                  <ChatMsg text="Evet! Bir dakika, daveti göndereyim" type="out" delay={900} />
                  <ChatCard delay={1500} />
                  <ChatMsg text="Vay be, çok güzel! 😍 Kim yaptı?" type="in" delay={2300} />
                  <ChatMsg text="Bekleriz'den aldım ❤️" type="out" delay={3000} />
                </div>
                <div className="bg-white px-6 py-5">
                  <p className="font-bold text-gray-900 mb-1">3 – Her Yerde Paylaş</p>
                  <p className="text-sm text-gray-400">WhatsApp, link veya QR koduyla misafirlerine gönder.</p>
                </div>
              </div>
            </Section>

          </div>

          <Section>
            <div className="text-center mt-12">
              <Link
                href="/sablonlar"
                className="group inline-flex items-center gap-2.5 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
              >
                Hemen Dene
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-[#080112] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-purple-800 opacity-20 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-900 opacity-15 blur-[60px]" />
        <div className="max-w-5xl mx-auto relative">
          <Section>
            <div className="text-center mb-20">
              <span className="text-purple-400 text-xs font-bold tracking-[0.25em] uppercase">Rakamlarla Bekleriz</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">Binlerce anıya ortak olduk</h2>
            </div>
          </Section>
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCard hedef={500} suffix="+" tur="Davetiye oluşturuldu" inView={statsInView} />
            <StatCard hedef={98} suffix="%" tur="Memnuniyet oranı" inView={statsInView} />
            <StatCard hedef={3} suffix=" dk" tur="Oluşturma süresi" inView={statsInView} />
            <StatCard hedef={30} suffix="+" tur="Hazır şablon" inView={statsInView} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <Section>
            <div className="text-center mb-16">
              <span className="text-purple-500 text-xs font-bold tracking-[0.25em] uppercase">Yorumlar</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">Onlar çok sevdi</h2>
            </div>
          </Section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { isim: "Ayşe K.", etkinlik: "Düğün", yorum: "Davetiyemizi 10 dakikada hazırladık! Misafirlerimiz çok beğendi, hepsi WhatsApp'tan açtı. Kesinlikle tavsiye ederim.", avatar: "A", renk: "from-purple-500 to-pink-500", offset: "" },
              { isim: "Mehmet T.", etkinlik: "Sünnet", yorum: "RSVP takibi inanılmaz kolaylık sağladı. Kaç kişinin geleceğini önceden bilmek çok güzeldi.", avatar: "M", renk: "from-blue-500 to-indigo-500", offset: "md:mt-8" },
              { isim: "Fatma Y.", etkinlik: "Doğum Günü", yorum: "Kağıt davetiye bastırmak yerine bunu kullandım. Hem ucuz hem çok şık oldu.", avatar: "F", renk: "from-amber-500 to-orange-500", offset: "" },
            ].map((y, i) => (
              <Section key={i} className={y.offset}>
                <div className="group bg-gray-50 hover:bg-white border border-transparent hover:border-purple-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden cursor-default h-full">
                  <div className="absolute top-4 right-5 text-8xl text-purple-100/60 font-serif leading-none select-none pointer-events-none">&ldquo;</div>
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className="text-amber-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-8 relative z-10">&ldquo;{y.yorum}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 bg-gradient-to-br ${y.renk} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                      {y.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{y.isim}</p>
                      <p className="text-xs text-gray-400">{y.etkinlik} davetiyesi</p>
                    </div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════ */}
      <section className="py-28 px-4" style={{ background: "linear-gradient(180deg, #faf8ff 0%, #fff 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <Section>
            <div className="text-center mb-14">
              <span className="text-purple-500 text-xs font-bold tracking-[0.25em] uppercase">Fiyatlar</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-3">Davetiye bazlı fiyat</h2>
              <p className="text-gray-400 text-lg">Plan yok, abonelik yok. Sadece seçtiğin özellikler için öde.</p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { plan: "Temel", fiyat: "₺199", alt: "davetiye başına", ozellikler: ["Dijital davetiye", "Paylaşım linki", "RSVP takibi"], populer: false },
              { plan: "Popüler ekler", fiyat: "+₺149", alt: "özelliğe göre", ozellikler: ["Müzik", "Albüm & Anı", "Canlı duvar"], populer: true },
              { plan: "Organizasyon", fiyat: "+₺199", alt: "isteğe bağlı", ozellikler: ["Oturma planı", "Lüks şablon", "Sesli anı"], populer: false },
            ].map((item, i) => (
              <Section key={i}>
                <div className={`relative rounded-3xl p-7 h-full flex flex-col transition-all duration-300 ${item.populer ? "bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-200 scale-105" : "bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1"}`}>
                  {item.populer && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wide shadow-lg">
                      ✦ EN POPÜLER
                    </span>
                  )}
                  <div className="mb-6">
                    <p className={`font-medium text-sm mb-3 ${item.populer ? "text-purple-200" : "text-gray-400"}`}>{item.plan}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${item.populer ? "text-white" : "text-gray-900"}`}>{item.fiyat}</span>
                      <span className={`text-sm ${item.populer ? "text-purple-300" : "text-gray-400"}`}>{item.alt}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {item.ozellikler.map((o) => (
                      <li key={o} className={`text-sm flex items-center gap-2.5 ${item.populer ? "text-purple-100" : "text-gray-600"}`}>
                        <span className={`text-base ${item.populer ? "text-pink-300" : "text-purple-500"}`}>✓</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/fiyatlar"
                    className={`block text-center py-3 rounded-2xl text-sm font-semibold transition-colors ${item.populer ? "bg-white text-purple-700 hover:bg-purple-50" : "border-2 border-gray-100 text-gray-700 hover:border-purple-200 hover:bg-purple-50"}`}
                  >
                    Başla
                  </Link>
                </div>
              </Section>
            ))}
          </div>

          <div className="text-center">
            <Link href="/fiyatlar" className="text-purple-500 text-sm font-medium hover:text-purple-700 transition-colors">
              Detaylı fiyat karşılaştırması →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-600 to-pink-600 animate-gradient" />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Section>
            <div className="text-6xl mb-8">🎉</div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              İlk davetiyeni{" "}
              <span style={{ fontFamily: "var(--font-dancing), cursive" }} className="text-pink-200">
                hemen oluştur
              </span>
            </h2>
            <p className="text-purple-200/80 text-lg mb-12">
              2 dakikada başla. Ücretsiz. Kredi kartı gerekmez.
            </p>
            <Link
              href="/sablonlar"
              className="group inline-flex items-center gap-3 bg-white text-purple-700 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-purple-50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/30 hover:-translate-y-1"
            >
              Hemen Dene
              <span className="text-xl group-hover:translate-x-1.5 transition-transform inline-block">→</span>
            </Link>
          </Section>
        </div>
      </section>

    </div>
  );
}

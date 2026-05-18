"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

/* ─── Kart görselleri ─── */
function Visual1() {
  const sablonlar = [
    { emoji: "💒", renk: "#7c3aed", secili: true  },
    { emoji: "💍", renk: "#C4A05A", secili: false },
    { emoji: "🎂", renk: "#ec4899", secili: false },
    { emoji: "⭐", renk: "#2563eb", secili: false },
    { emoji: "🕯️", renk: "#9333ea", secili: false },
    { emoji: "🏢", renk: "#0891b2", secili: false },
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {sablonlar.map((s, i) => (
        <div key={i} className="rounded-xl p-2.5 flex flex-col items-center gap-1 transition-all"
          style={{
            background: s.secili ? `${s.renk}18` : "rgba(255,255,255,0.04)",
            border: `1px solid ${s.secili ? s.renk + "50" : "rgba(255,255,255,0.07)"}`,
            boxShadow: s.secili ? `0 0 16px ${s.renk}20` : "none",
          }}>
          <span style={{ fontSize: 18 }}>{s.emoji}</span>
          {s.secili && (
            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ background: s.renk }}>
              <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 8 8">
                <path d="M1.5 4l1.5 1.5 3.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Visual2() {
  return (
    <div className="space-y-2">
      {[
        { label: "Ad Soyad",  value: "Ayşe & Mehmet",  done: true  },
        { label: "Tarih",     value: "15 Haziran 2025", done: true  },
        { label: "Mekan",     value: "Grand Ballroom",  done: false },
      ].map((f, i) => (
        <div key={i} className="flex items-center gap-2.5 rounded-xl px-3 py-2"
          style={{
            background: !f.done ? "rgba(217,119,6,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${!f.done ? "rgba(217,119,6,0.4)" : "rgba(255,255,255,0.07)"}`,
          }}>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginBottom: 2 }}>{f.label}</p>
            <p style={{ fontSize: 11, fontWeight: 500, color: !f.done ? "#fbbf24" : "rgba(255,255,255,0.65)" }}>
              {f.value}{!f.done && <span className="animate-pulse">|</span>}
            </p>
          </div>
          {f.done && (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function Visual3() {
  return (
    <div className="space-y-2">
      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white"
        style={{ background: "#25D366", boxShadow: "0 4px 14px rgba(37,211,102,0.35)" }}>
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp&apos;ta Paylaş
      </button>
      <div className="flex items-center gap-1.5 rounded-xl px-3 py-2"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.1-1.1m-.757-4.9a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          bekleriz.com/davetiye/ayse-mehmet
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        {[
          { n: "3.2k", l: "Görüntülenme", c: "#7c3aed" },
          { n: "248",  l: "RSVP",         c: "#059669" },
          { n: "%84",  l: "Katılım",      c: "#d97706" },
        ].map(s => (
          <div key={s.l} className="text-center rounded-xl py-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: s.c }}>{s.n}</p>
            <p style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Adımlar tanımı ─── */
const ADIMLAR = [
  {
    num: "01",
    icon: "🎨",
    renk: "#7c3aed",
    baslik: "Şablon Seç",
    aciklama: "30+ hazır tasarım arasından etkinliğine uygun olanı bul. Dakikalar içinde başlarsın.",
    Visual: Visual1,
  },
  {
    num: "02",
    icon: "✏️",
    renk: "#d97706",
    baslik: "Özelleştir & Yayınla",
    aciklama: "İsim, tarih ve mekanı gir. Ödeme sonrası davetiye anında yayına alınır.",
    Visual: Visual2,
  },
  {
    num: "03",
    icon: "📨",
    renk: "#059669",
    baslik: "Her Yerde Paylaş",
    aciklama: "WhatsApp, QR kod veya link ile gönder. RSVP'leri tek panelden takip et.",
    Visual: Visual3,
  },
];

/* ─── Bağlantı oku ─── */
function Ok({ renk1, renk2 }: { renk1: string; renk2: string }) {
  return (
    <div className="hidden md:flex items-center justify-center px-2" style={{ paddingTop: 24 }}>
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
        <defs>
          <linearGradient id={`g-${renk1}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={renk1} stopOpacity="0.6" />
            <stop offset="100%" stopColor={renk2} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M0 12 H32 M24 4 L32 12 L24 20" stroke={`url(#g-${renk1})`} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── Ana bileşen ─── */
export default function NasilCalisir() {
  const [ref, visible] = useInView();

  return (
    <section style={{ background: "#030009", padding: "112px 16px 128px", position: "relative", overflow: "hidden" }}>
      {/* Arka plan ızgara */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.022,
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      {/* Üst mor parıltı */}
      <div style={{
        position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase",
            background: "linear-gradient(90deg,#7c3aed,#ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "block", marginBottom: 20,
          }}>
            Nasıl Çalışır
          </span>
          <h2 style={{
            fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.12, letterSpacing: "-0.025em", margin: "0 0 18px",
          }}>
            3 adımda davetiye hazır
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.35)", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
            Seç, özelleştir, paylaş — karmaşık araçlara gerek yok.
          </p>
        </div>

        {/* Kartlar */}
        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr) ",
            gap: 0,
            alignItems: "start",
          }}
          className="nc2-grid"
        >
          {ADIMLAR.map((adim, i) => (
            <div key={adim.num} className="nc2-row-item" style={{ display: "contents" }}>
              {/* Kart */}
              <div
                style={{
                  position: "relative",
                  borderRadius: 28,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "32px 28px 28px",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(32px)",
                  transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
                  boxShadow: `0 1px 0 inset rgba(255,255,255,0.06)`,
                }}
              >
                {/* Üst renkli çizgi */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${adim.renk}, ${adim.renk}55)`,
                }} />

                {/* Dev arka plan numara */}
                <div style={{
                  position: "absolute", bottom: -8, right: 12,
                  fontSize: 120, fontWeight: 900, lineHeight: 1,
                  color: "transparent",
                  WebkitTextStroke: `1.5px rgba(255,255,255,0.055)`,
                  pointerEvents: "none", userSelect: "none",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {adim.num}
                </div>

                {/* İkon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: `${adim.renk}18`,
                  border: `1px solid ${adim.renk}35`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, marginBottom: 20,
                  boxShadow: `0 0 20px ${adim.renk}25`,
                }}>
                  {adim.icon}
                </div>

                {/* Metin */}
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
                  {adim.baslik}
                </h3>
                <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.75, marginBottom: 24 }}>
                  {adim.aciklama}
                </p>

                {/* Mini görsel */}
                <div style={{
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "14px",
                  position: "relative", zIndex: 1,
                }}>
                  <adim.Visual />
                </div>
              </div>

              {/* Ok bağlantısı (iki kart arasında) */}
              {i < 2 && <Ok renk1={adim.renk} renk2={ADIMLAR[i + 1].renk} />}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 72 }}>
          <Link
            href="/sablonlar"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "linear-gradient(135deg,#7c3aed,#db2777)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "15px 36px", borderRadius: 16, textDecoration: "none",
              boxShadow: "0 8px 40px rgba(124,58,237,0.4)",
            }}
          >
            Hemen Dene
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .nc2-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
        @media (min-width: 768px) {
          .nc2-grid {
            grid-template-columns: 1fr auto 1fr auto 1fr !important;
            gap: 0 12px !important;
            align-items: center !important;
          }
        }
      `}</style>
    </section>
  );
}

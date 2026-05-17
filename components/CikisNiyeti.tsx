"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SK = "bekleriz_cikis_gosterildi";

const HARIC = ["/giris", "/dashboard", "/odeme", "/sablonlar", "/gizlilik", "/kullanim", "/kvkk", "/iletisim"];

const KATEGORILER = ["💒 Düğün", "💍 Nişan", "🎂 Doğum Günü", "⭐ Sünnet", "🕯️ Kına"];

export default function CikisNiyeti() {
  const [goster,  setGoster]  = useState(false);
  const [anim,    setAnim]    = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (HARIC.some(p => pathname.startsWith(p))) return;
    try { if (sessionStorage.getItem(SK)) return; } catch { return; }

    const tetikle = (e: MouseEvent) => {
      if (e.clientY > 8) return;
      try { sessionStorage.setItem(SK, "1"); } catch {}
      document.removeEventListener("mouseleave", tetikle);
      setGoster(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
    };

    document.addEventListener("mouseleave", tetikle);
    return () => document.removeEventListener("mouseleave", tetikle);
  }, [pathname]);

  const kapat = () => {
    setAnim(false);
    setTimeout(() => setGoster(false), 420);
  };

  if (!goster) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4"
      style={{
        background: `rgba(5,0,14,${anim ? 0.75 : 0})`,
        backdropFilter: anim ? "blur(6px)" : "blur(0px)",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
      }}
      onClick={kapat}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(160deg,#120924 0%,#0a0518 55%,#0d0620 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 0 1px rgba(139,92,246,0.12), 0 30px 80px rgba(109,40,217,0.22), 0 4px 24px rgba(0,0,0,0.7)",
          transform: anim ? "scale(1) translateY(0)" : "scale(0.9) translateY(24px)",
          opacity:   anim ? 1 : 0,
          transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Üst aksan */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent 0%,#8b5cf6 40%,#ec4899 80%,transparent 100%)" }} />

        {/* Sağ üst arka glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)" }} />

        <div className="px-8 pt-9 pb-8 text-center relative z-10">

          {/* İkon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg,rgba(139,92,246,0.18),rgba(236,72,153,0.14))",
              border: "1px solid rgba(139,92,246,0.2)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.15)",
            }}
          >
            💌
          </div>

          {/* Başlık */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
            Davetiyeni hazırlama<br />
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              fırsatını kaçırma!
            </span>
          </h2>

          <p className="text-white/35 text-sm leading-relaxed mb-7 max-w-xs mx-auto">
            3 dakikada dijital davetiyeni hazırla, WhatsApp&apos;tan paylaş.
            Misafirlerinin RSVP&apos;sini tek panelden takip et.
          </p>

          {/* İstatistikler */}
          <div className="flex justify-center gap-6 mb-7">
            {[
              { n: "3 dk",  l: "Oluşturma"  },
              { n: "500+",  l: "Davetiye"    },
              { n: "%98",   l: "Memnuniyet" },
            ].map(s => (
              <div key={s.l}>
                <p className="text-lg font-bold text-white tabular-nums">{s.n}</p>
                <p className="text-[10px] text-white/25 mt-0.5 tracking-wide uppercase">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Kategori etiketleri */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-8">
            {KATEGORILER.map(k => (
              <span
                key={k}
                className="text-[11px] text-white/40 rounded-full px-3 py-1"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
              >
                {k}
              </span>
            ))}
          </div>

          {/* Ana CTA */}
          <Link
            href="/sablonlar"
            onClick={kapat}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold text-white mb-3 hover:-translate-y-0.5 hover:shadow-2xl transition-all"
            style={{
              background: "linear-gradient(135deg,#7c3aed 0%,#db2777 100%)",
              boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
            }}
          >
            Şablonları Gör
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* İkincil */}
          <button
            onClick={kapat}
            className="text-xs text-white/18 hover:text-white/35 transition-colors"
          >
            Hayır, teşekkürler
          </button>
        </div>

        {/* Kapatma */}
        <button
          onClick={kapat}
          aria-label="Kapat"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

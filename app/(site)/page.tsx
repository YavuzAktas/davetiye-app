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

const MARQUEE = [
  "⚡ Dakikalar içinde hazır",
  "📱 WhatsApp ile paylaş",
  "✅ RSVP takibi",
  "🗺️ Konum entegrasyonu",
  "⏱️ Canlı geri sayım",
  "🎨 Özel tasarım",
  "🎵 Arka plan müziği",
  "💌 Dijital davetiye",
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
                Türkiye&apos;nin dijital davetiye platformu
              </div>

              <h1 className="text-white mb-8">
                <span className="block text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                  Güzel anlar için
                </span>
                <span
                  className="block text-5xl sm:text-6xl md:text-7xl leading-[1.2] bg-gradient-to-r from-purple-400 via-pink-400 to-rose-300 bg-clip-text text-transparent animate-gradient"
                  style={{ fontFamily: "var(--font-dancing), cursive" }}
                >
                  güzel davetiyeler
                </span>
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                Düğün, nişan, doğum günü için dakikalar içinde özel davetiye oluştur.
                WhatsApp ile tek tıkla paylaş, RSVP&apos;leri takip et.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
                <Link
                  href="/sablonlar"
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-2xl shadow-purple-900/50 hover:-translate-y-0.5 hover:shadow-purple-500/40 transition-all text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Ücretsiz Başla
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                  href="/sablonlar"
                  className="border border-white/15 text-white/80 px-8 py-4 rounded-2xl text-base font-medium hover:bg-white/8 hover:border-white/25 transition-all text-center backdrop-blur-sm"
                >
                  Şablonlara Bak
                </Link>
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
                  <span className="text-white font-semibold">500+</span> kişi kullanıyor
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
      <section className="py-28 px-4" style={{ background: "linear-gradient(180deg, #faf8ff 0%, #fff 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <Section>
            <div className="text-center mb-16">
              <span className="text-purple-500 text-xs font-bold tracking-[0.25em] uppercase">Özellikler</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 leading-tight">
                Her şey hazır,
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-300 mt-1">
                sen sadece başla
              </h2>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[190px]">

            {/* Büyük — Hızlı Oluştur */}
            <Section className="md:col-span-2">
              <div className="h-full bg-[#0f0118] rounded-3xl p-8 relative overflow-hidden group hover:scale-[1.015] transition-all duration-300 cursor-default min-h-[190px]">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-purple-600 opacity-20 blur-3xl group-hover:opacity-35 transition-opacity" />
                <div className="absolute top-6 right-6 text-6xl opacity-10 group-hover:opacity-20 transition-opacity select-none">⚡</div>
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-xl mb-5">⚡</div>
                  <h3 className="text-white text-2xl font-bold mb-2">Dakikalar içinde hazır</h3>
                  <p className="text-purple-300/70 text-sm">Şablon seç, bilgilerini gir, davetiyeni paylaş. Bu kadar.</p>
                </div>
                {/* Mini mockup lines */}
                <div className="absolute bottom-6 right-6 space-y-1.5">
                  <div className="w-24 h-1.5 bg-white/10 rounded" />
                  <div className="w-16 h-1.5 bg-purple-500/30 rounded" />
                  <div className="w-20 h-1.5 bg-white/5 rounded" />
                </div>
              </div>
            </Section>

            {/* Tall — RSVP (spans 2 rows) */}
            <Section className="md:row-span-2">
              <div className="h-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-100/50 hover:scale-[1.015] transition-all duration-300 cursor-default min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative z-10">
                  <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-xl mb-5">✅</div>
                  <h3 className="text-gray-900 text-xl font-bold mb-2">RSVP Takibi</h3>
                  <p className="text-gray-400 text-sm mb-8">Kim geliyor, kim gelemiyor? Anlık katılım listesi.</p>
                  <div className="space-y-3">
                    {[
                      { isim: "Ayşe K.", durum: true },
                      { isim: "Mehmet T.", durum: true },
                      { isim: "Fatma Y.", durum: false },
                      { isim: "Can A.", durum: true },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-3 group/row">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.durum ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className="flex-1 text-xs text-gray-600">{r.isim}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.durum ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                          {r.durum ? "Katılıyor" : "Katılamıyor"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400">Katılım oranı</span>
                      <span className="font-bold text-emerald-600">%75</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* WhatsApp */}
            <Section>
              <div className="h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-7 relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 cursor-default min-h-[190px]">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white opacity-5 rounded-full group-hover:opacity-10 transition-opacity" />
                <div className="absolute bottom-4 right-4 text-5xl opacity-10 select-none">📱</div>
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-white text-xl font-bold">WhatsApp ile paylaş</h3>
                <p className="text-green-100/80 text-sm mt-1.5">Tek tıkla tüm listene gönder</p>
              </div>
            </Section>

            {/* Harita */}
            <Section>
              <div className="h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-7 relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 cursor-default min-h-[190px]">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-5 rounded-full group-hover:opacity-10 transition-opacity" />
                <div className="absolute bottom-4 right-4 text-5xl opacity-10 select-none">🗺️</div>
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-white text-xl font-bold">Konum entegrasyonu</h3>
                <p className="text-blue-100/80 text-sm mt-1.5">Google Maps otomatik bağlanır</p>
              </div>
            </Section>

            {/* Geri sayım — tam genişlik */}
            <Section className="md:col-span-3">
              <div className="h-full bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 rounded-3xl p-8 relative overflow-hidden group hover:scale-[1.008] transition-all duration-300 cursor-default flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="absolute inset-0 opacity-[0.07]" style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }} />
                <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-pink-500/20 to-transparent" />
                <div className="relative z-10 flex-1">
                  <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center text-xl mb-5">⏱️</div>
                  <h3 className="text-white text-2xl font-bold">Canlı geri sayım sayacı</h3>
                  <p className="text-purple-200/80 text-sm mt-2">Etkinliğe kaç gün kaldığını misafirlerin anlık görsün</p>
                </div>
                <div className="relative z-10 flex gap-3">
                  {[{ n: "12", l: "GÜN" }, { n: "08", l: "SAAT" }, { n: "45", l: "DAKİKA" }, { n: "30", l: "SANİYE" }].map((t, i) => (
                    <div key={i} className="text-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3 min-w-[60px]">
                      <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">{t.n}</p>
                      <p className="text-purple-200/70 text-[9px] tracking-widest mt-1">{t.l}</p>
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
                <div className="h-72 bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                  {/* Yan telefonlar */}
                  <div className="absolute left-2 top-8 w-[104px] h-[184px] bg-linear-to-b from-[#1a0a3e] to-[#350d6b] rounded-[20px] border-[3px] border-gray-600 -rotate-12 opacity-50 overflow-hidden shadow-lg" />
                  <div className="absolute right-2 top-8 w-[104px] h-[184px] bg-linear-to-b from-[#0a1f3e] to-[#0d4a7a] rounded-[20px] border-[3px] border-gray-600 rotate-12 opacity-50 overflow-hidden shadow-lg" />
                  {/* Orta telefon */}
                  <div className="relative z-10 w-36 h-60 bg-gray-900 rounded-[28px] border-[3px] border-gray-700 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-5 bg-gray-900 rounded-b-2xl z-20" />
                    <div className="absolute inset-0 bg-linear-to-b from-[#3d1f08] via-[#7a4f1a] to-[#3d1f08] flex flex-col items-center justify-center text-center p-3 pt-6">
                      <p className="text-yellow-200/50 text-[7px] tracking-[0.3em] uppercase mb-1.5">DÜĞÜN DAVETİYESİ</p>
                      <div className="w-8 h-px bg-yellow-500/40 mb-2" />
                      <p className="text-white text-[22px] leading-tight font-bold" style={{ fontFamily: "var(--font-dancing), cursive" }}>Ayşe</p>
                      <p className="text-yellow-400/50 text-[10px] my-0.5">&</p>
                      <p className="text-white text-[22px] leading-tight font-bold" style={{ fontFamily: "var(--font-dancing), cursive" }}>Mehmet</p>
                      <div className="w-8 h-px bg-yellow-500/40 mt-2 mb-2.5" />
                      <p className="text-yellow-200/70 text-[8px]">12 Eylül 2026</p>
                      <p className="text-yellow-200/40 text-[7px]">Çırağan Palace</p>
                      <div className="mt-3.5 bg-yellow-700/40 text-yellow-100 text-[8px] px-3 py-1 rounded-lg">✓ Katılıyorum</div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                  </div>
                </div>
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
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-3">Ücretsiz başla</h2>
              <p className="text-gray-400 text-lg">İhtiyacına göre yükselt. Kredi kartı gerekmez.</p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { plan: "Ücretsiz", fiyat: "₺0", alt: "/ay", ozellikler: ["1 davetiye", "Temel şablonlar", "RSVP takibi"], populer: false },
              { plan: "Standart", fiyat: "₺299", alt: "/ay", ozellikler: ["5 davetiye", "Tüm şablonlar", "WhatsApp paylaşım", "QR kod"], populer: true },
              { plan: "Premium", fiyat: "₺599", alt: "/ay", ozellikler: ["Sınırsız davetiye", "Özel tasarım", "Müzik ekleme", "Öncelikli destek"], populer: false },
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

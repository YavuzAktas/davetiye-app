"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SABLONLAR, KATEGORILER, type Sablon } from "@/lib/sablonlar";

function useInView(threshold = 0.1) {
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

const EMOJILER: Record<string, string> = {
  hepsi: "✦", dugun: "💍", nisan: "💑", dogumgunu: "🎂",
  sunnet: "⭐", kina: "🌿", kurumsal: "🎯", diger: "🎉",
};

const POPULER = new Set(["klasik-dugun", "romantik-nisan", "eglenceli-dogumgunu", "altin-dugun"]);
const YENI = new Set(["modern-dugun", "mor-nisan", "bebek-partisi"]);

const BASLIKLAR: Record<string, string> = {
  dugun: "Ayşe & Mehmet", nisan: "Fatma & Ali",
  dogumgunu: "Can'ın Doğum Günü", sunnet: "Ahmet'in Sünnet Töreni",
  kina: "Zeynep'in Kına Gecesi", kurumsal: "Yıl Sonu Etkinliği", diger: "Özel Davetiye",
};

const TARIHLER: Record<string, string> = {
  dugun: "12 Eylül 2026", nisan: "5 Haziran 2026",
  dogumgunu: "20 Temmuz 2026", sunnet: "15 Ağustos 2026",
  kina: "11 Eylül 2026", kurumsal: "1 Ekim 2026", diger: "25 Aralık 2026",
};

const STAR_POSITIONS = [
  { top: "18%", left: "6%" }, { top: "42%", right: "9%" },
  { top: "68%", left: "13%" }, { bottom: "22%", right: "6%" },
  { top: "55%", left: "3%" }, { top: "28%", right: "18%" },
];

export default function SablonlarSayfasi() {
  const [aktifKategori, setAktifKategori] = useState("hepsi");
  const [goster, setGoster] = useState(true);
  const [statsRef, statsVisible] = useInView(0.2);
  const router = useRouter();

  const filtrelenmis = useMemo(
    () => aktifKategori === "hepsi" ? SABLONLAR : SABLONLAR.filter(s => s.kategori === aktifKategori),
    [aktifKategori]
  );

  const sayilar = useMemo(() => {
    const map: Record<string, number> = { hepsi: SABLONLAR.length };
    SABLONLAR.forEach(s => { map[s.kategori] = (map[s.kategori] ?? 0) + 1; });
    return map;
  }, []);

  const handleKategori = (id: string) => {
    if (id === aktifKategori) return;
    setGoster(false);
    setTimeout(() => { setAktifKategori(id); setGoster(true); }, 180);
  };

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-[#080112]">

        {/* Animated blobs */}
        <div className="absolute top-1/4 -left-48 w-140 h-140 rounded-full bg-purple-700 opacity-25 blur-[120px] animate-blob-1 pointer-events-none" />
        <div className="absolute bottom-0 -right-40 w-112.5 h-112.5 rounded-full bg-pink-700 opacity-20 blur-[100px] animate-blob-2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-50 rounded-full bg-violet-900 opacity-15 blur-[80px] pointer-events-none" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Rotating rings */}
        <div className="absolute top-12 right-24 w-36 h-36 border border-purple-500/15 rounded-full animate-spin-slow hidden lg:block" />
        <div className="absolute bottom-24 left-20 border border-pink-500/15 rounded-full hidden lg:block"
          style={{ width: "88px", height: "88px", animation: "spin-slow 15s linear infinite reverse" }} />
        <div className="absolute top-1/2 right-8 w-52 h-52 border border-white/5 rounded-full hidden xl:block animate-spin-slow"
          style={{ animationDuration: "30s" }} />

        {/* Star dots */}
        {STAR_POSITIONS.map((s, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse pointer-events-none"
            style={{ ...s, animationDelay: `${i * 0.5}s`, animationDuration: "3s" }} />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text + Filters */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium px-4 py-2 rounded-full mb-10 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {SABLONLAR.length}+ hazır şablon
              </div>

              <h1 className="text-white mb-6">
                <span className="block text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                  Mükemmel
                </span>
                <span
                  className="block text-5xl sm:text-6xl md:text-7xl leading-[1.2] bg-linear-to-r from-purple-400 via-pink-400 to-rose-300 bg-clip-text text-transparent animate-gradient"
                  style={{ fontFamily: "var(--font-dancing), cursive" }}
                >
                  davetiyeni bul
                </span>
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                Şablonu seç, özelleştir, paylaş. Dakikalar içinde hazır.
              </p>

              {/* Category filters */}
              <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                {KATEGORILER.map(kat => {
                  const aktif = aktifKategori === kat.id;
                  return (
                    <button
                      key={kat.id}
                      onClick={() => handleKategori(kat.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        aktif
                          ? "bg-white text-gray-900 shadow-lg shadow-black/25"
                          : "bg-white/6 text-white/50 border border-white/10 hover:bg-white/12 hover:text-white/80"
                      }`}
                    >
                      <span className="text-base leading-none">{EMOJILER[kat.id]}</span>
                      <span>{kat.isim}</span>
                      <span className={`text-[11px] font-bold tabular-nums ${aktif ? "text-purple-500" : "text-white/20"}`}>
                        {sayilar[kat.id] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right — Floating mockup */}
            <div className="relative hidden lg:flex items-center justify-center min-h-120">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-purple-600/15 to-pink-600/15 blur-3xl" />

              {/* Main card */}
              <div className="relative animate-float">
                <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-7 w-80 shadow-2xl">
                  <div className="h-0.5 bg-linear-to-r from-purple-400 to-pink-400 rounded-full mb-6" />
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
                +12 RSVP 🎉
              </div>
              <div className="absolute bottom-14 -left-8 bg-white/8 backdrop-blur-sm border border-white/15 text-white text-xs px-4 py-3 rounded-2xl shadow-xl">
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
                <p className="text-[10px] text-gray-600">20 Temmuz 2026</p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════
          GRID
      ══════════════════════════════════════════ */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-400">
              <span className="text-gray-900 font-bold">{filtrelenmis.length}</span> şablon listeleniyor
            </p>
            <span className="text-xs text-gray-300 italic hidden sm:block">
              Ücretsiz başla · İstediğin zaman özelleştir
            </span>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity duration-200 ${goster ? "opacity-100" : "opacity-0"}`}
          >
            {filtrelenmis.map((sablon, idx) => (
              <SablonKart
                key={sablon.id}
                sablon={sablon}
                populer={POPULER.has(sablon.id)}
                yeni={YENI.has(sablon.id)}
                baslik={BASLIKLAR[sablon.kategori] ?? "Davetiye"}
                tarih={TARIHLER[sablon.kategori] ?? "2026"}
                kategoriIsim={KATEGORILER.find(k => k.id === sablon.kategori)?.isim ?? "Davetiye"}
                emoji={EMOJILER[sablon.kategori] ?? "🎉"}
                onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
                delay={Math.min(idx * 40, 400)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="bg-[#080112] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-75 rounded-full bg-purple-800 opacity-20 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-900 opacity-15 blur-[60px]" />

        <div ref={statsRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-20 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: "500+", l: "Davetiye Oluşturuldu", icon: "💌" },
              { n: "%98", l: "Memnuniyet Oranı", icon: "⭐" },
              { n: "3 dk", l: "Oluşturma Süresi", icon: "⚡" },
              { n: `${SABLONLAR.length}+`, l: "Hazır Şablon", icon: "🎨" },
            ].map(({ n, l, icon }, i) => (
              <div
                key={l}
                className={`group transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
                <p className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">{n}</p>
                <p className="text-purple-400 text-xs tracking-[0.2em] uppercase">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-800 via-purple-600 to-pink-600 animate-gradient" />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="absolute top-0 right-0 w-125 h-125 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-8">✨</div>
          <p className="text-white/60 text-sm mb-3 tracking-[0.2em] uppercase">İstediğin şablonu bulamadın mı?</p>
          <h3
            className="text-4xl md:text-5xl text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-dancing), cursive" }}
          >
            Her şablon tamamen özelleştirilebilir
          </h3>
          <p className="text-white/60 text-base mb-12">
            Renk, font ve içerik açısından tamamen senin kontrolünde
          </p>
          <button
            onClick={() => router.push("/olustur?sablon=klasik-dugun")}
            className="group inline-flex items-center gap-3 bg-white text-purple-700 px-10 py-5 rounded-2xl text-base font-bold hover:bg-purple-50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/30 hover:-translate-y-1"
          >
            Hemen Oluştur
            <span className="text-lg group-hover:translate-x-1.5 transition-transform inline-block">→</span>
          </button>
        </div>
      </section>

    </div>
  );
}

/* ─── Şablon Kartı ─── */
interface KartProps {
  sablon: Sablon;
  populer: boolean;
  yeni: boolean;
  baslik: string;
  tarih: string;
  kategoriIsim: string;
  emoji: string;
  onClick: () => void;
  delay: number;
}

function SablonKart({ sablon, populer, yeni, baslik, tarih, kategoriIsim, emoji, onClick, delay }: KartProps) {
  const [ref, visible] = useInView(0.05);

  return (
    <div
      ref={ref}
      className={`group cursor-pointer transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 group-hover:border-transparent group-hover:shadow-2xl group-hover:shadow-black/10 group-hover:-translate-y-2 transition-all duration-300">

        {/* Preview area */}
        <div
          className="relative h-64 overflow-hidden flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${sablon.renk}18 0%, ${sablon.renk}08 100%)` }}
        >
          {/* Dot texture */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${sablon.renk}25 1px, transparent 0)`,
            backgroundSize: "18px 18px",
          }} />

          {/* Decorative rings */}
          <div
            className="absolute -top-10 -right-10 w-36 h-36 rounded-full border-2 opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ borderColor: sablon.renk }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full border opacity-10 group-hover:opacity-15 transition-opacity"
            style={{ borderColor: sablon.renk }}
          />

          {/* Mini invitation card */}
          <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-gray-50 p-4 w-44 group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300">
            <div className="h-0.5 rounded-full mb-3" style={{ backgroundColor: sablon.renk }} />
            <div className="text-center mb-3">
              <span className="text-2xl block mb-1.5">{emoji}</span>
              <p className="text-[8px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: sablon.renk }}>
                {kategoriIsim}
              </p>
              <p className="font-semibold text-gray-800 leading-tight"
                style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "15px" }}>
                {baslik}
              </p>
              <div className="w-5 h-px mx-auto mt-2 mb-1.5" style={{ backgroundColor: sablon.renk + "60" }} />
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-[9px]">📅</span>
                <span className="text-[9px] text-gray-400 truncate">{tarih}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px]">📍</span>
                <span className="text-[9px] text-gray-400">Çırağan Palace</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="py-1 rounded-lg text-center text-[8px] font-bold text-white" style={{ backgroundColor: sablon.renk }}>
                ✓ Evet
              </div>
              <div className="py-1 rounded-lg text-center text-[8px] text-gray-400 bg-gray-100">
                ✗ Hayır
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-5"
            style={{ background: `linear-gradient(to top, ${sablon.renk}cc 0%, transparent 60%)` }}
          >
            <div
              className="bg-white font-semibold text-sm px-5 py-2.5 rounded-2xl shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
              style={{ color: sablon.renk }}
            >
              Bu Şablonu Seç →
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {populer && (
              <div className="bg-linear-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                ✦ Popüler
              </div>
            )}
            {yeni && (
              <div className="bg-linear-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                ✦ Yeni
              </div>
            )}
          </div>
        </div>

        {/* Bottom info */}
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{sablon.isim}</p>
            {sablon.aciklama && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{sablon.aciklama}</p>
            )}
          </div>
          <div className="w-4 h-4 rounded-full shrink-0 ml-3 ring-2 ring-white shadow-sm" style={{ backgroundColor: sablon.renk }} />
        </div>
      </div>
    </div>
  );
}

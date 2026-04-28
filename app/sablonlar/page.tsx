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
          GRID
      ══════════════════════════════════════════ */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14">

          {/* Başlık + Filtreler */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-purple-500 font-semibold tracking-[0.2em] uppercase mb-1">Şablonlar</p>
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-gray-900 font-bold">{filtrelenmis.length}</span> şablon listeleniyor
                </h1>
              </div>
              <span className="text-xs text-gray-300 italic hidden sm:block">
                Ücretsiz başla · İstediğin zaman özelleştir
              </span>
            </div>

            {/* Kategori filtreleri */}
            <div className="flex gap-2 flex-wrap">
              {KATEGORILER.map(kat => {
                const aktif = aktifKategori === kat.id;
                return (
                  <button
                    key={kat.id}
                    onClick={() => handleKategori(kat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      aktif
                        ? "bg-gray-900 text-white shadow-lg"
                        : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <span className="text-base leading-none">{EMOJILER[kat.id]}</span>
                    <span>{kat.isim}</span>
                    <span className={`text-[11px] font-bold tabular-nums ${aktif ? "text-purple-400" : "text-gray-300"}`}>
                      {sayilar[kat.id] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
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

"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── scroll animasyonu için ─── */
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

/* ─── Nişan Lüks önizleme — kapak sahnesi ─── */
function NisanOnizleme() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: "radial-gradient(ellipse at 50% 45%, #5C1020 0%, #3B0A14 55%, #270610 100%)" }}
    >
      {/* Nokta dokusu */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(196,160,90,0.06) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }} />

      {/* İsimler */}
      <p className="relative z-10 text-center px-4 mb-6" style={{
        fontFamily: "var(--font-dancing), cursive",
        fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
        color: "#F5E8D8",
        lineHeight: 1.2,
      }}>
        Aylin <span style={{ color: "#C4A05A" }}>&amp;</span> Yavuz
      </p>

      {/* Gül Mühür */}
      <div className="relative z-10" style={{
        width: 130, height: 130,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: `
          0 0 0 7px #3B0A14,
          0 0 0 9px rgba(196,160,90,0.2),
          0 12px 40px rgba(10,0,6,0.7)
        `,
      }}>
        <img
          src="/rose-seal.png"
          alt="Gül Mühür"
          className="w-full h-full object-cover block"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
          }}
        />
        {/* CSS yedek */}
        <div className="w-full h-full items-center justify-center hidden" style={{
          background: "radial-gradient(circle at 38% 32%, #A01C2E 0%, #7A1220 35%, #3E0810 100%)",
        }}>
          <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
            {[0,60,120,180,240,300].map(a=>(
              <ellipse key={a} cx="100" cy="52" rx="14" ry="22"
                fill="rgba(200,80,80,0.3)" transform={`rotate(${a} 100 100)`}/>
            ))}
            {[30,90,150,210,270,330].map(a=>(
              <ellipse key={a} cx="100" cy="64" rx="10" ry="16"
                fill="rgba(215,95,95,0.4)" transform={`rotate(${a} 100 100)`}/>
            ))}
            <circle cx="100" cy="100" r="11" fill="rgba(225,105,105,0.65)"/>
            <circle cx="100" cy="100" r="5" fill="rgba(245,140,130,0.8)"/>
          </svg>
        </div>
      </div>

      {/* Tarih */}
      <p className="relative z-10 mt-6 text-center" style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 11, letterSpacing: "0.32em",
        color: "#C4A05A",
      }}>
        06 HAZİRAN 2026
      </p>

      <p className="relative z-10 mt-3" style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 11, fontStyle: "italic",
        color: "rgba(196,160,90,0.55)", letterSpacing: "0.12em",
      }}>
        Mühüre dokun ✦
      </p>
    </div>
  );
}

export default function SablonlarSayfasi() {
  const router = useRouter();
  const [cardRef, cardVisible] = useInView(0.1);
  const [statsRef, statsVisible] = useInView(0.2);

  const OZELLIKLER = [
    { icon: "🌹", baslik: "Gül Mühür", aciklama: "Gerçekçi balmumu mühür kapak animasyonu" },
    { icon: "⏱️", baslik: "Geri Sayım", aciklama: "Nişana kalan süreyi canlı sayar" },
    { icon: "💌", baslik: "RSVP Formu", aciklama: "Misafirler katılım bildirebilir" },
    { icon: "📍", baslik: "Konum & Harita", aciklama: "Google Maps entegrasyonu" },
    { icon: "🎵", baslik: "Arkaplan Müziği", aciklama: "Davetiye açıldığında çalar" },
    { icon: "📷", baslik: "Anılar Bölümü", aciklama: "Polaroid tarzı fotoğraf galerisi" },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ══ ANA KART ALANI ══ */}
      <div className="bg-gray-50 py-14 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Başlık */}
          <div className="text-center mb-12">
            <p className="text-xs text-purple-500 font-semibold tracking-[0.22em] uppercase mb-2">Şablonlar</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Nişan Davetiyeniz</h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Lüks bordo & altın temalı, gül mühürlü dijital nişan davetiyesi. Dakikalar içinde oluşturun, herkesle paylaşın.
            </p>
          </div>

          {/* Şablon kartı */}
          <div
            ref={cardRef}
            className={`transition-all duration-700 ${cardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-black/5 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2">

                {/* Sol — önizleme */}
                <div className="h-96 sm:h-auto relative" style={{ minHeight: 380 }}>
                  <NisanOnizleme />
                </div>

                {/* Sağ — bilgi & CTA */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    {/* Badge */}
                    <div className="flex gap-2 mb-5">
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(122,18,32,0.1)", color: "#7A1220" }}>
                        💍 Nişan
                      </span>
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700">
                        ✦ Lüks
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Lüks Nişan</h2>
                    <p className="text-sm text-gray-400 mb-6">
                      Bordo & altın, gül mühürlü — gerçek bir davetiye hissi veren dijital deneyim.
                    </p>

                    {/* Özellikler */}
                    <div className="grid grid-cols-2 gap-2.5 mb-8">
                      {OZELLIKLER.map(o => (
                        <div key={o.baslik} className="flex items-start gap-2">
                          <span className="text-base mt-0.5 shrink-0">{o.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-gray-700">{o.baslik}</p>
                            <p className="text-[11px] text-gray-400 leading-tight">{o.aciklama}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => router.push("/olustur?sablon=nisan-luks")}
                    className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #7A1220, #4E0A14)" }}
                  >
                    Davetiyeni Oluştur →
                  </button>
                  <p className="text-center text-xs text-gray-300 mt-3">Ücretsiz başla · Kredi kartı gerekmez</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ İSTATİSTİKLER ══ */}
      <section className="bg-[#080112] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full bg-purple-800 opacity-20 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-900 opacity-15 blur-[60px]" />

        <div ref={statsRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-20 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: "500+", l: "Davetiye Gönderildi", icon: "💌" },
              { n: "%98",  l: "Memnuniyet Oranı",   icon: "⭐" },
              { n: "3 dk", l: "Oluşturma Süresi",   icon: "⚡" },
              { n: "∞",    l: "Paylaşım İmkânı",    icon: "🔗" },
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

      {/* ══ CTA ══ */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-800 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-8">✨</div>
          <p className="text-white/60 text-sm mb-3 tracking-[0.2em] uppercase">Hemen başla</p>
          <h3
            className="text-4xl md:text-5xl text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-dancing), cursive" }}
          >
            Nişanınıza özel davetiye
          </h3>
          <p className="text-white/60 text-base mb-12">
            İsimler, tarih, mekan ve mesajı girmeniz yeterli — dakikalar içinde hazır.
          </p>
          <button
            onClick={() => router.push("/olustur?sablon=nisan-luks")}
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

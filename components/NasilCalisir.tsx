"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* ─── Panel 1: Şablon seçimi ─── */
function Panel1() {
  const [secili, setSecili] = useState(1);
  const sablonlar = [
    { isim: "Klasik Düğün",  emoji: "💒", renk: "#7c3aed" },
    { isim: "Lüks Nişan",    emoji: "💍", renk: "#C4A05A" },
    { isim: "Doğum Günü",    emoji: "🎂", renk: "#ec4899" },
    { isim: "Kına Gecesi",   emoji: "🕯️", renk: "#9333ea" },
    { isim: "Sünnet",        emoji: "⭐", renk: "#2563eb" },
    { isim: "Kurumsal",      emoji: "🏢", renk: "#0891b2" },
  ];
  return (
    <div className="p-6 space-y-4">
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" }}>
        30+ hazır şablon
      </p>
      <div className="grid grid-cols-2 gap-2">
        {sablonlar.map((s, i) => (
          <button
            key={i}
            onClick={() => setSecili(i)}
            className="relative text-left rounded-2xl p-3.5 transition-all duration-300"
            style={{
              background: secili === i ? `${s.renk}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${secili === i ? s.renk + "55" : "rgba(255,255,255,0.07)"}`,
              boxShadow: secili === i ? `0 0 24px ${s.renk}22` : "none",
            }}
          >
            <span className="text-xl block mb-1">{s.emoji}</span>
            <p style={{ fontSize: 11, fontWeight: 600, color: secili === i ? s.renk : "rgba(255,255,255,0.4)" }}>
              {s.isim}
            </p>
            {secili === i && (
              <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: s.renk }}>
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                  <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
        Bir şablon seçmek için tıkla
      </p>
    </div>
  );
}

/* ─── Panel 2: Özelleştir ─── */
function Panel2() {
  const [mekan, setMekan] = useState("Grand Ballroom");
  return (
    <div className="p-6 space-y-3">
      {/* Canlı önizleme */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: "linear-gradient(135deg, #3d1f08 0%, #7a4f1a 100%)",
        padding: "18px 22px",
      }}>
        <p style={{ color: "rgba(255,220,130,0.45)", fontSize: 8.5, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>
          DÜĞÜN DAVETİYESİ
        </p>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#fff", letterSpacing: "0.02em" }}>
          Ayşe & Mehmet
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,220,130,0.55)", marginTop: 5 }}>
          15 Haziran 2025 · {mekan || "…"}
        </p>
      </div>

      {/* Form alanları */}
      <div className="space-y-2">
        {[
          { label: "İsim 1",    value: "Ayşe",         done: true,  active: false },
          { label: "İsim 2",    value: "Mehmet",        done: true,  active: false },
          { label: "Tarih",     value: "15 Haziran 2025", done: true, active: false },
        ].map((f, i) => (
          <div key={i} className="rounded-xl px-3 py-2.5 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginBottom: 2 }}>{f.label}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{f.value}</p>
            </div>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#059669">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ))}

        {/* Aktif alan */}
        <div className="rounded-xl px-3 py-2.5"
          style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.45)" }}>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginBottom: 2 }}>Mekan</p>
          <input
            value={mekan}
            onChange={e => setMekan(e.target.value)}
            className="w-full bg-transparent outline-none"
            style={{ fontSize: 12, color: "#fbbf24", fontWeight: 500 }}
            placeholder="Mekanı yaz..."
          />
        </div>
      </div>

      <button className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#d97706,#b45309)", boxShadow: "0 4px 20px rgba(217,119,6,0.35)" }}>
        ⚡ Ödeme Yap & Yayınla
      </button>
    </div>
  );
}

/* ─── Panel 3: Paylaş ─── */
function Panel3() {
  const [kopyalandi, setKopyalandi] = useState(false);

  function kopyala() {
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  }

  return (
    <div className="p-6 space-y-4">
      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { n: "3.2k", l: "Görüntülenme", c: "#7c3aed" },
          { n: "248",  l: "RSVP",          c: "#059669" },
          { n: "%84",  l: "Katılım",        c: "#d97706" },
        ].map(s => (
          <div key={s.l} className="text-center rounded-xl py-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: s.c }}>{s.n}</p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 3 }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Link */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl px-3 py-2.5 flex items-center overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", whiteSpace: "nowrap" }}>
            bekleriz.com/davetiye/ayse-mehmet
          </p>
        </div>
        <button onClick={kopyala}
          className="px-3.5 rounded-xl text-xs font-bold shrink-0 transition-all duration-300"
          style={{
            background: kopyalandi ? "rgba(5,150,105,0.2)" : "rgba(255,255,255,0.08)",
            border: `1px solid ${kopyalandi ? "rgba(5,150,105,0.5)" : "rgba(255,255,255,0.12)"}`,
            color: kopyalandi ? "#34d399" : "rgba(255,255,255,0.6)",
          }}>
          {kopyalandi ? "✓" : "Kopyala"}
        </button>
      </div>

      {/* Paylaşım butonları */}
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#25D366", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </button>
        <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Link Kopyala
        </button>
      </div>

      {/* QR */}
      <div className="flex items-center gap-4 rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-14 h-14 rounded-xl p-2 shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="w-full h-full grid grid-cols-4 gap-px">
            {[1,1,1,1, 1,0,0,1, 1,0,0,1, 1,1,1,1].map((v, i) => (
              <div key={i} className="rounded-[1px]"
                style={{ background: v ? "rgba(255,255,255,0.75)" : "transparent" }} />
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 3 }}>QR Kod</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>İndir ve davetiyene ekle</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Ana bileşen ─── */
const ADIMLAR = [
  {
    num: "01",
    baslik: "Şablon Seç",
    aciklama: "30+ hazır tasarım arasından etkinliğine en uygun olanı seç. Düğün, nişan, doğum günü ve daha fazlası — seçmek dakikalar alır.",
    renk: "#7c3aed",
    Panel: Panel1,
  },
  {
    num: "02",
    baslik: "Özelleştir & Yayınla",
    aciklama: "İsim, tarih, mekan ve müziği düzenle. Ödeme sonrası tek tıkla anında yayına al; davetiye linkin hemen hazır olur.",
    renk: "#d97706",
    Panel: Panel2,
  },
  {
    num: "03",
    baslik: "Her Yerde Paylaş",
    aciklama: "WhatsApp, QR kod veya link ile misafirlerine ulaş. RSVP yanıtlarını, katılım oranını ve görüntülenmeleri canlı takip et.",
    renk: "#059669",
    Panel: Panel3,
  },
];

export default function NasilCalisir() {
  const [aktif, setAktif] = useState(0);
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const stepRefs = [ref0, ref1, ref2];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = stepRefs.findIndex(r => r.current === entry.target);
            if (idx !== -1) setAktif(idx);
          }
        });
      },
      { threshold: 0.55 }
    );
    stepRefs.forEach(r => { if (r.current) obs.observe(r.current); });
    return () => obs.disconnect();
  }, []);

  const aktifAdim = ADIMLAR[aktif];

  return (
    <section style={{ background: "#03000a", padding: "120px 16px 140px" }}>
      {/* Nokta ızgara desen */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: 96 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase",
            color: "#7c3aed", display: "block", marginBottom: 18,
          }}>
            Nasıl Çalışır
          </span>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.12, letterSpacing: "-0.02em", margin: 0,
          }}>
            3 adımda davetiye hazır
          </h2>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.32)", marginTop: 18,
            maxWidth: 420, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7,
          }}>
            Karmaşık araçlara gerek yok. Seç, özelleştir, paylaş.
          </p>
        </div>

        {/* İki kolonlu layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 80px",
          alignItems: "start",
        }}
          className="nc-grid"
        >
          {/* ─── Sol: Adımlar ─── */}
          <div style={{ position: "relative" }}>

            {/* Dikey bağlantı çizgisi */}
            <div style={{
              position: "absolute", left: 19, top: 24, bottom: 24, width: 2, borderRadius: 2,
              background: "linear-gradient(to bottom, #7c3aed 0%, #d97706 50%, #059669 100%)",
              opacity: 0.35,
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {ADIMLAR.map((adim, i) => {
                const aktifmi = aktif === i;
                return (
                  <div
                    key={i}
                    ref={stepRefs[i]}
                    style={{ paddingLeft: 60, paddingBottom: i < 2 ? 72 : 0, position: "relative" }}
                  >
                    {/* Numara rozeti */}
                    <div style={{
                      position: "absolute", left: 0, top: 0,
                      width: 40, height: 40, borderRadius: 12,
                      background: aktifmi ? adim.renk : "rgba(255,255,255,0.05)",
                      border: `1.5px solid ${aktifmi ? adim.renk : "rgba(255,255,255,0.1)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800,
                      color: aktifmi ? "#fff" : "rgba(255,255,255,0.25)",
                      transition: "all 0.45s ease",
                      boxShadow: aktifmi ? `0 0 28px ${adim.renk}55, 0 0 8px ${adim.renk}30` : "none",
                    }}>
                      {adim.num}
                    </div>

                    {/* İçerik */}
                    <div style={{
                      opacity: aktifmi ? 1 : 0.35,
                      transition: "opacity 0.45s ease",
                    }}>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        marginBottom: 10, marginTop: 8,
                      }}>
                        <h3 style={{
                          fontSize: 22, fontWeight: 700, color: "#fff",
                          margin: 0, lineHeight: 1.2,
                        }}>
                          {adim.baslik}
                        </h3>
                        {aktifmi && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                            color: adim.renk, background: `${adim.renk}18`,
                            border: `1px solid ${adim.renk}35`,
                            padding: "2px 8px", borderRadius: 999,
                          }}>
                            AKTİF
                          </span>
                        )}
                      </div>
                      <p style={{
                        fontSize: 15, color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.75, margin: 0,
                      }}>
                        {adim.aciklama}
                      </p>

                      {/* Mobil panel */}
                      <div className="nc-mobile-panel" style={{ marginTop: 20 }}>
                        <div style={{
                          borderRadius: 24,
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${adim.renk}30`,
                          overflow: "hidden",
                          boxShadow: `0 0 40px ${adim.renk}15`,
                        }}>
                          <div style={{ height: 2, background: `linear-gradient(90deg,${adim.renk},${adim.renk}40)` }} />
                          <adim.Panel />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Sağ: Sticky panel ─── */}
          <div className="nc-sticky-panel" style={{ position: "sticky", top: 100 }}>
            <div style={{
              borderRadius: 28,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${aktifAdim.renk}30`,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              overflow: "hidden",
              boxShadow: `0 0 80px ${aktifAdim.renk}18, 0 32px 64px rgba(0,0,0,0.5)`,
              transition: "border-color 0.5s ease, box-shadow 0.5s ease",
            }}>
              {/* Üst aksan çizgisi */}
              <div style={{
                height: 2,
                background: `linear-gradient(90deg, ${aktifAdim.renk}, ${aktifAdim.renk}50)`,
                transition: "background 0.5s ease",
              }} />

              {/* Panel içerikleri */}
              {ADIMLAR.map((adim, i) => (
                <div key={i} style={{ display: aktif === i ? "block" : "none" }}>
                  <adim.Panel />
                </div>
              ))}
            </div>

            {/* Adım göstergesi */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
              {ADIMLAR.map((adim, i) => (
                <div key={i} style={{
                  width: aktif === i ? 24 : 6,
                  height: 6, borderRadius: 3,
                  background: aktif === i ? adim.renk : "rgba(255,255,255,0.12)",
                  transition: "all 0.4s ease",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <Link
            href="/sablonlar"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "linear-gradient(135deg, #7c3aed, #db2777)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              padding: "15px 36px", borderRadius: 16, textDecoration: "none",
              boxShadow: "0 8px 40px rgba(124,58,237,0.45)",
              transition: "all 0.2s ease",
            }}
          >
            Hemen Dene
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .nc-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .nc-sticky-panel { display: none !important; }
          .nc-mobile-panel { display: block !important; }
        }
        @media (min-width: 768px) {
          .nc-mobile-panel { display: none !important; }
          .nc-sticky-panel { display: block !important; }
        }
      `}</style>
    </section>
  );
}

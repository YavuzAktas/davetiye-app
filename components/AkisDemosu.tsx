"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SAHNE_SURESI = 4800; // ms her sahne

/* ── Sahne 1: Şablon seçimi ── */
function SahneSecilenSablon({ aktif }: { aktif: boolean }) {
  const [secili, setSecili] = useState(0);
  const sablonlar = [
    { emoji: "💒", isim: "Düğün Lüks",     renk: "#9333ea" },
    { emoji: "💍", isim: "Nişan Klasik",   renk: "#C4A05A" },
    { emoji: "🎂", isim: "Doğum Günü",     renk: "#ec4899" },
    { emoji: "⭐", isim: "Sünnet",          renk: "#2563eb" },
    { emoji: "🕯️", isim: "Kına Gecesi",    renk: "#7c3aed" },
    { emoji: "💼", isim: "Kurumsal",        renk: "#0891b2" },
  ];

  useEffect(() => {
    if (!aktif) return;
    setSecili(0);
    const t1 = setTimeout(() => setSecili(1), 900);
    const t2 = setTimeout(() => setSecili(0), 1900);
    const t3 = setTimeout(() => setSecili(2), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [aktif]);

  return (
    <div className="px-3 py-3">
      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 8, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        Şablon Galerisi — 34 şablon
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {sablonlar.map((s, i) => (
          <div key={i}
            className="rounded-xl p-2 flex flex-col items-center gap-1 cursor-pointer transition-all duration-300"
            style={{
              background: secili === i ? `${s.renk}18` : "rgba(255,255,255,0.04)",
              border: `1px solid ${secili === i ? s.renk + "60" : "rgba(255,255,255,0.07)"}`,
              transform: secili === i ? "scale(1.04)" : "scale(1)",
              boxShadow: secili === i ? `0 0 14px ${s.renk}25` : "none",
            }}>
            <span style={{ fontSize: 16 }}>{s.emoji}</span>
            <span style={{ fontSize: 7.5, color: secili === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.2 }}>
              {s.isim}
            </span>
            {secili === i && (
              <div className="w-3 h-3 rounded-full flex items-center justify-center"
                style={{ background: s.renk }}>
                <svg className="w-1.5 h-1.5 text-white" fill="none" viewBox="0 0 8 8">
                  <path d="M1.5 4l1.5 1.5 3.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sahne 2: Form doldurma ── */
function SahneFormDoldur({ aktif }: { aktif: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!aktif) { setStep(0); return; }
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(() => setStep(3), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [aktif]);

  const alanlar = [
    { label: "Çiftlerin İsimleri", val: "Ayşe & Mehmet", icon: "💑" },
    { label: "Tarih & Saat",        val: "12 Eylül 2026, 19:00", icon: "📅" },
    { label: "Mekan",               val: "Çırağan Palace, İstanbul", icon: "📍" },
  ];

  return (
    <div className="px-3 py-3 space-y-2">
      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 8, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        Bilgileri Gir
      </p>
      {alanlar.map((a, i) => (
        <div key={i} className="rounded-xl px-3 py-2 transition-all duration-500"
          style={{
            background: step > i ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${step > i ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"}`,
          }}>
          <p style={{ fontSize: 8.5, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{a.label}</p>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 11 }}>{a.icon}</span>
            <p style={{ fontSize: 10.5, fontWeight: 600, color: step > i ? "rgba(255,255,255,0.75)" : "transparent", transition: "color 0.4s" }}>
              {a.val}{step === i + 1 && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>
      ))}
      {step === 3 && (
        <div className="mt-2 rounded-xl px-3 py-2 flex items-center justify-center gap-2 transition-all"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)" }}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa" }}>Hazır! Ödemeye Geç</span>
        </div>
      )}
    </div>
  );
}

/* ── Sahne 3: Davetiye önizleme ── */
function SahneOnizleme({ aktif }: { aktif: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!aktif) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, [aktif]);

  return (
    <div className="px-3 py-2 flex flex-col items-center">
      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 8, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        Canlı Önizleme
      </p>
      <div className="w-full rounded-2xl overflow-hidden transition-all duration-700"
        style={{
          background: "linear-gradient(135deg, #111827 0%, #4c0519 100%)",
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.93)",
          padding: "18px 14px",
        }}>
        <p style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", textAlign: "center", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
          Düğün Davetiyesi
        </p>
        <p className="text-center" style={{ fontSize: 22, fontFamily: "var(--font-dancing), cursive", color: "#fff", marginBottom: 6 }}>
          Ayşe & Mehmet
        </p>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)", margin: "6px 0 10px" }} />
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.6, marginBottom: 10 }}>
          Mutluluğumuzu sizinle paylaşmak istiyoruz.
        </p>
        <div className="space-y-1.5 mb-3">
          {[["📅", "12 Eylül 2026"], ["📍", "Çırağan, İstanbul"]].map(([icon, val]) => (
            <div key={val} className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ fontSize: 10 }}>{icon}</span>
              <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.6)" }}>{val}</span>
            </div>
          ))}
        </div>
        <button className="w-full rounded-xl py-2 text-white font-bold"
          style={{ fontSize: 10, background: "rgba(124,58,237,0.5)", border: "1px solid rgba(124,58,237,0.5)" }}>
          ✓ Katılıyorum
        </button>
      </div>
    </div>
  );
}

/* ── Sahne 4: RSVP akışı ── */
function SahneRsvp({ aktif }: { aktif: boolean }) {
  const [gelen, setGelen] = useState(0);
  const rsvplar = [
    { isim: "Aylin Kaya",   durum: "Katılıyor", kisi: "2 kişi",  renk: "#10b981" },
    { isim: "Bora Şahin",   durum: "Katılıyor", kisi: "3 kişi",  renk: "#10b981" },
    { isim: "Ceren Yıldız", durum: "Katılamıyor", kisi: "—",     renk: "#f43f5e" },
    { isim: "Deniz Ak",     durum: "Katılıyor", kisi: "4 kişi",  renk: "#10b981" },
  ];

  useEffect(() => {
    if (!aktif) { setGelen(0); return; }
    const timers = rsvplar.map((_, i) =>
      setTimeout(() => setGelen(i + 1), i * 900 + 400)
    );
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif]);

  const toplamKisi = 9;
  const yuzde = Math.round((gelen / rsvplar.length) * 100);

  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between mb-2">
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em", textTransform: "uppercase" }}>RSVP Paneli</p>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
          {gelen} yanıt
        </span>
      </div>
      <div className="mb-3">
        <div className="h-1.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${yuzde}%`, background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
        </div>
        <div className="flex justify-between">
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>Katılım oranı %{yuzde}</span>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>{toplamKisi} kişi</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {rsvplar.map((r, i) => (
          <div key={i}
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 transition-all duration-400"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              opacity: gelen > i ? 1 : 0.15,
              transform: gelen > i ? "translateX(0)" : "translateX(-8px)",
            }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.renk }} />
            <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{r.isim}</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{r.kisi}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sahne config ── */
const SAHNELER = [
  {
    id: "secim",
    baslik: "Şablonunu seç",
    aciklama: "34+ hazır tasarım. Düğün, nişan, doğum günü — etkinliğine uygun olanı bul.",
    renk: "#7c3aed",
    Icerik: SahneSecilenSablon,
  },
  {
    id: "form",
    baslik: "Bilgilerini gir",
    aciklama: "İsim, tarih, mekan. Ödeme tamamlanır tamamlanmaz yayına alınır.",
    renk: "#d97706",
    Icerik: SahneFormDoldur,
  },
  {
    id: "onizleme",
    baslik: "Canlı önizle",
    aciklama: "Davetiyeni ödeme yapmadan tam olarak gör. Hiç sürpriz yok.",
    renk: "#0891b2",
    Icerik: SahneOnizleme,
  },
  {
    id: "rsvp",
    baslik: "Paylaş, takip et",
    aciklama: "WhatsApp'tan link gönder. Kim geliyor, kaç kişi — panelde canlı gör.",
    renk: "#059669",
    Icerik: SahneRsvp,
  },
];

export default function AkisDemosu() {
  const [aktifSahne, setAktifSahne] = useState(0);
  const [ilerleme, setIlerleme] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIlerleme(0);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / SAHNE_SURESI * 100, 100);
      setIlerleme(progress);
      if (elapsed >= SAHNE_SURESI) {
        setAktifSahne(prev => (prev + 1) % SAHNELER.length);
      }
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [aktifSahne]);

  const sahne = SAHNELER[aktifSahne];

  return (
    <section style={{ background: "#030009", padding: "96px 16px 112px", position: "relative", overflow: "hidden" }}>
      {/* Arka plan parıltı */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 400, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${sahne.renk}12 0%, transparent 70%)`,
        pointerEvents: "none", transition: "background 1s ease",
      }} />

      <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>

        {/* Başlık */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase",
            background: "linear-gradient(90deg,#7c3aed,#ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            display: "block", marginBottom: 16,
          }}>
            Canlı Demo
          </span>
          <h2 style={{
            fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: "#fff",
            lineHeight: 1.14, margin: "0 0 14px",
          }}>
            Oluşturmak böyle görünüyor
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
            Gerçek akış — şablon seçiminden RSVP takibine kadar.
          </p>
        </div>

        {/* Ana grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}
          className="demo-grid">

          {/* Sol: Metin + sahne listesi */}
          <div>
            {/* Aktif sahne açıklaması */}
            <div style={{
              background: `${sahne.renk}12`,
              border: `1px solid ${sahne.renk}35`,
              borderRadius: 20, padding: "24px 28px", marginBottom: 32,
              transition: "all 0.5s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: sahne.renk, boxShadow: `0 0 10px ${sahne.renk}`,
                }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: sahne.renk }}>
                  Adım {aktifSahne + 1} / {SAHNELER.length}
                </span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.2 }}>
                {sahne.baslik}
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                {sahne.aciklama}
              </p>
            </div>

            {/* Sahne noktaları */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SAHNELER.map((s, i) => (
                <button key={s.id} onClick={() => setAktifSahne(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 14, cursor: "pointer",
                    background: aktifSahne === i ? `${s.renk}14` : "transparent",
                    border: `1px solid ${aktifSahne === i ? s.renk + "40" : "transparent"}`,
                    transition: "all 0.3s ease", textAlign: "left",
                  }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: aktifSahne === i ? s.renk : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{ fontSize: 12, color: aktifSahne === i ? "#fff" : "rgba(255,255,255,0.35)", fontWeight: 700 }}>
                      {i + 1}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: aktifSahne === i ? "#fff" : "rgba(255,255,255,0.35)",
                    transition: "color 0.3s ease",
                  }}>
                    {s.baslik}
                  </span>
                  {aktifSahne === i && (
                    <div style={{ marginLeft: "auto", width: 40, height: 3, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, background: s.renk, width: `${ilerleme}%`, transition: "width 0.05s linear" }} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: 36 }}>
              <Link href="/sablonlar"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "#fff", fontSize: 13, fontWeight: 700,
                  padding: "12px 24px", borderRadius: 14,
                  textDecoration: "none",
                  boxShadow: "0 8px 28px rgba(109,40,217,0.35)",
                  transition: "opacity 0.2s",
                }}>
                Davetiyeni Oluştur
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Sağ: Telefon mockup */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 240 }}>
              {/* Telefon çerçevesi */}
              <div style={{
                background: "#1a1a1a",
                padding: "13px 9px",
                borderRadius: 38,
                boxShadow: "0 0 0 1px #333, 0 28px 70px rgba(0,0,0,0.65), inset 0 0 0 1px #444",
                position: "relative",
              }}>
                {/* Notch */}
                <div style={{
                  position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                  width: 72, height: 24, background: "#1a1a1a", borderRadius: "0 0 14px 14px", zIndex: 20,
                }} />

                {/* Ekran */}
                <div style={{
                  borderRadius: 24, overflow: "hidden", height: 460,
                  background: "#0a0a14", position: "relative",
                }}>
                  {/* Durum barı */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 14px 8px",
                  }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>9:41</span>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {[3, 4, 5].map(w => (
                        <div key={w} style={{ width: 3, height: w, borderRadius: 1, background: "rgba(255,255,255,0.4)" }} />
                      ))}
                      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginLeft: 3 }}>⚡</span>
                    </div>
                  </div>

                  {/* Uygulama header */}
                  <div style={{ padding: "0 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>B</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Bekleriz</span>
                    </div>
                  </div>

                  {/* Sahne içeriği */}
                  <div style={{ flex: 1, transition: "opacity 0.4s ease", overflow: "hidden" }}>
                    {SAHNELER.map((s, i) => (
                      <div key={s.id} style={{
                        position: "absolute", inset: "66px 0 0 0",
                        opacity: aktifSahne === i ? 1 : 0,
                        transition: "opacity 0.5s ease",
                        pointerEvents: aktifSahne === i ? "auto" : "none",
                      }}>
                        <s.Icerik aktif={aktifSahne === i} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Glow */}
              <div style={{
                position: "absolute", inset: -20, borderRadius: 50,
                background: `radial-gradient(ellipse, ${sahne.renk}18 0%, transparent 70%)`,
                zIndex: -1, transition: "background 1s ease",
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobil için grid düzeni */}
      <style>{`
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

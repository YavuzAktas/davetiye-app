"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect } from "react";
import Link from "next/link";
import MuzikCalar from "@/components/MuzikCalar";

/* ── Küçük yardımcılar ── */
function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-2">
      <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to right, transparent, #C9A96E)" }} />
      <span style={{ color: "#C9A96E", fontSize: "10px", letterSpacing: "4px" }}>◆ ◆ ◆</span>
      <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to left, transparent, #C9A96E)" }} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-[0.35em] uppercase mb-6" style={{
      fontFamily: "var(--font-cormorant), serif",
      color: "#C9A96E",
    }}>
      {children}
    </p>
  );
}

export default function NisanLuksSablon({ davetiye, rsvpBileseni }: SablonProps) {
  const [acildi, setAcildi] = useState(false);
  const [animating, setAnimating] = useState(false);

  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const gunStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", { weekday: "long" })
    : null;
  const saatStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : null;

  const fark = davetiye.tarih ? new Date(davetiye.tarih).getTime() - Date.now() : -1;
  const [geriSayim, setGeriSayim] = useState({
    gun: Math.max(0, Math.floor(fark / 86400000)),
    saat: Math.max(0, Math.floor((fark % 86400000) / 3600000)),
    dakika: Math.max(0, Math.floor((fark % 3600000) / 60000)),
    saniye: Math.max(0, Math.floor((fark % 60000) / 1000)),
  });

  useEffect(() => {
    if (!davetiye.tarih || fark <= 0) return;
    const id = setInterval(() => {
      const f = new Date(davetiye.tarih!).getTime() - Date.now();
      if (f <= 0) return clearInterval(id);
      setGeriSayim({
        gun: Math.floor(f / 86400000),
        saat: Math.floor((f % 86400000) / 3600000),
        dakika: Math.floor((f % 3600000) / 60000),
        saniye: Math.floor((f % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, [davetiye.tarih]);

  const isim1 = davetiye.kisi1 || davetiye.baslik.split(/[&ve]/i)[0]?.trim() || davetiye.baslik;
  const isim2 = davetiye.kisi2 || davetiye.baslik.split(/[&ve]/i)[1]?.trim() || null;

  const whatsappMetin = encodeURIComponent(
    `${davetiye.baslik} Nişan Davetiyesi\n` +
    (tarihStr ? `📅 ${tarihStr}\n` : "") +
    (davetiye.mekan ? `📍 ${davetiye.mekan}\n` : "") +
    `Davetiye: ${process.env.NEXT_PUBLIC_URL ?? ""}/davetiye/${davetiye.slug}`
  );

  /* ════════════════════════
     KAPALI DURUM — Zarf
  ════════════════════════ */
  if (!acildi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
        style={{ background: "linear-gradient(160deg, #FDF6ED 0%, #F9EDE3 40%, #F5E8EE 100%)" }}>

        {/* Arkaplan — altın nokta deseni */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, #C9A96E 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Köşe süsleri */}
        {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-16 h-16 opacity-20`}>
            <svg viewBox="0 0 64 64" fill="none">
              <path d={i === 0 ? "M2 62 L2 2 L62 2" : i === 1 ? "M62 62 L62 2 L2 2" : i === 2 ? "M2 2 L2 62 L62 62" : "M62 2 L62 62 L2 62"}
                stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        ))}

        {/* Yüzük ikonu — üstte */}
        <div className="mb-8 relative z-10">
          <div className="text-5xl animate-pulse" style={{ animationDuration: "3s" }}>💍</div>
        </div>

        {/* İsimler */}
        <div className="text-center relative z-10 px-6 mb-8">
          <p className="text-6xl sm:text-7xl md:text-8xl leading-tight"
            style={{ fontFamily: "var(--font-dancing), cursive", color: "#5C3D2E" }}>
            {isim1}
          </p>
          {isim2 && (
            <>
              <div className="flex items-center justify-center gap-4 my-3">
                <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #C9A96E)" }} />
                <span style={{ color: "#C9A96E", fontFamily: "var(--font-cormorant), serif", fontSize: "28px" }}>&</span>
                <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #C9A96E)" }} />
              </div>
              <p className="text-6xl sm:text-7xl md:text-8xl leading-tight"
                style={{ fontFamily: "var(--font-dancing), cursive", color: "#5C3D2E" }}>
                {isim2}
              </p>
            </>
          )}
          {tarihStr && (
            <p className="mt-5 text-sm tracking-[0.25em] uppercase"
              style={{ fontFamily: "var(--font-cormorant), serif", color: "#B8956A" }}>
              {tarihStr}
            </p>
          )}
        </div>

        {/* Mühür butonu */}
        <button
          onClick={() => { setAnimating(true); setTimeout(() => setAcildi(true), 700); }}
          className="relative z-10 group mt-2"
          aria-label="Daveti Aç"
        >
          <div className={`transition-all duration-700 ${animating ? "scale-0 opacity-0" : "hover:scale-105"}`}>
            {/* Dış çerçeve */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="74" fill="none" stroke="#C9A96E" strokeWidth="0.8" strokeDasharray="4 8" strokeLinecap="round" />
              </svg>
              {/* İç disk */}
              <div className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl relative"
                style={{ background: "radial-gradient(circle at 35% 35%, #D4B896, #9A6E4A, #6B3F20)" }}>
                <div className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
                <span className="text-3xl mb-1 relative z-10">💑</span>
                <span className="text-[9px] tracking-[0.2em] uppercase relative z-10" style={{
                  color: "rgba(255,240,210,0.7)",
                  fontFamily: "var(--font-cormorant), serif",
                }}>
                  {davetiye.etkinlikTur === "nisan" ? "Nişan" : "Davetiye"}
                </span>
              </div>
            </div>
          </div>
        </button>

        <p className="mt-6 text-xs tracking-[0.2em] uppercase relative z-10"
          style={{ color: "#B8956A", fontFamily: "var(--font-cormorant), serif" }}>
          Daveti açmak için dokun
        </p>
      </div>
    );
  }

  /* ════════════════════════
     AÇIK DURUM — Davetiye
  ════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: "#FDF6ED" }}>
      {davetiye.muzik && <MuzikCalar muzikUrl={davetiye.muzik} />}

      {/* ── Navigasyon ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ backgroundColor: "rgba(253, 246, 237, 0.88)", borderBottom: "1px solid rgba(201,169,110,0.2)" }}>
        <div className="max-w-2xl mx-auto px-4 h-11 flex items-center justify-center gap-6 sm:gap-10">
          {[
            { href: "#hero", label: "Biz" },
            { href: "#detaylar", label: "Detaylar" },
            ...(fark > 0 ? [{ href: "#sayim", label: "Sayım" }] : []),
            { href: "#katilim", label: "RSVP" },
            ...(davetiye.mekan ? [{ href: "#mekan", label: "Mekan" }] : []),
          ].map(item => (
            <a key={item.href} href={item.href}
              className="text-xs tracking-[0.2em] uppercase transition-colors hover:opacity-100 opacity-50"
              style={{ fontFamily: "var(--font-cormorant), serif", color: "#5C3D2E" }}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ══ BÖLÜM 1 — HERO ══ */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 pt-12 relative overflow-hidden">
        {/* Arka plan gradient */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 20%, #FDEEE4 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, #F5E8EE 0%, transparent 60%), #FDF6ED",
        }} />

        {/* Dekoratif çerçeve çizgisi */}
        <div className="absolute inset-6 sm:inset-12 rounded-none opacity-15 pointer-events-none"
          style={{ border: "1px solid #C9A96E" }} />
        <div className="absolute inset-8 sm:inset-14 rounded-none opacity-8 pointer-events-none"
          style={{ border: "1px solid #C9A96E" }} />

        <div className="relative z-10 text-center max-w-lg w-full">

          {/* Üst etiket */}
          <SectionLabel>Nişan Davetiyesi</SectionLabel>

          {/* Yüzük süsü */}
          <div className="text-4xl mb-6">💍</div>

          {/* İsimler — büyük, zarif */}
          <div className="mb-3">
            <h1 className="text-7xl sm:text-8xl md:text-9xl leading-none"
              style={{ fontFamily: "var(--font-dancing), cursive", color: "#3D2314" }}>
              {isim1}
            </h1>
          </div>

          {isim2 && (
            <>
              <div className="flex items-center justify-center gap-5 my-4">
                <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to right, transparent, #C9A96E)" }} />
                <p className="text-4xl sm:text-5xl" style={{ fontFamily: "var(--font-cormorant), serif", color: "#C9A96E" }}>
                  &amp;
                </p>
                <div className="h-px flex-1 max-w-20" style={{ background: "linear-gradient(to left, transparent, #C9A96E)" }} />
              </div>
              <div className="mb-3">
                <h1 className="text-7xl sm:text-8xl md:text-9xl leading-none"
                  style={{ fontFamily: "var(--font-dancing), cursive", color: "#3D2314" }}>
                  {isim2}
                </h1>
              </div>
            </>
          )}

          <Ornament />

          {/* Tarih + Mekan kısa */}
          <div className="mt-5 space-y-1.5">
            {tarihStr && (
              <p className="text-lg tracking-[0.15em]"
                style={{ fontFamily: "var(--font-cormorant), serif", color: "#8B6350" }}>
                {gunStr?.toUpperCase()} · {tarihStr}
              </p>
            )}
            {saatStr && (
              <p className="text-base tracking-widest"
                style={{ fontFamily: "var(--font-cormorant), serif", color: "#B8956A" }}>
                Saat {saatStr}
              </p>
            )}
            {davetiye.mekan && (
              <p className="text-base tracking-widest"
                style={{ fontFamily: "var(--font-cormorant), serif", color: "#B8956A" }}>
                {davetiye.mekan}
              </p>
            )}
          </div>

          {/* Mesaj */}
          {davetiye.mesaj && (
            <div className="mt-8 mx-auto max-w-sm px-4 py-5 relative"
              style={{ borderTop: "1px solid rgba(201,169,110,0.3)", borderBottom: "1px solid rgba(201,169,110,0.3)" }}>
              <p className="text-base italic leading-relaxed"
                style={{ fontFamily: "var(--font-cormorant), serif", color: "#7A5444" }}>
                &ldquo;{davetiye.mesaj}&rdquo;
              </p>
            </div>
          )}

          {/* Aşağı kaydır */}
          <div className="mt-14 flex flex-col items-center gap-2 opacity-40">
            <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #C9A96E, transparent)" }} />
            <p className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-cormorant), serif", color: "#C9A96E" }}>
              Kaydır
            </p>
          </div>
        </div>
      </section>

      {/* ══ BÖLÜM 2 — DETAYLAR ══ */}
      <section id="detaylar" className="py-24 px-6 relative" style={{ background: "linear-gradient(180deg, #F9EDE3 0%, #FDF6ED 100%)" }}>
        <div className="max-w-lg mx-auto">

          {/* Süslü çerçeveli kart */}
          <div className="relative p-8 sm:p-12" style={{ border: "1px solid rgba(201,169,110,0.4)" }}>
            {/* Köşe süsleri */}
            {["-top-2 -left-2", "-top-2 -right-2", "-bottom-2 -left-2", "-bottom-2 -right-2"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-5 h-5`} style={{ color: "#C9A96E", fontSize: "18px", lineHeight: 1 }}>
                ✦
              </div>
            ))}

            <div className="text-center mb-10">
              <SectionLabel>Etkinlik Detayları</SectionLabel>
              <p className="text-3xl sm:text-4xl"
                style={{ fontFamily: "var(--font-dancing), cursive", color: "#3D2314" }}>
                {isim1}{isim2 ? ` & ${isim2}` : ""} Nişanına
              </p>
              <p className="mt-1 text-base" style={{ fontFamily: "var(--font-cormorant), serif", color: "#9A7055" }}>
                davet edildiniz
              </p>
            </div>

            <Ornament />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Tarih */}
              {tarihStr && (
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)" }}>
                    📅
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#C9A96E", fontFamily: "var(--font-cormorant), serif" }}>
                    Tarih &amp; Saat
                  </p>
                  <p className="text-xl font-medium" style={{ fontFamily: "var(--font-cormorant), serif", color: "#3D2314" }}>
                    {gunStr}
                  </p>
                  <p className="text-base" style={{ fontFamily: "var(--font-cormorant), serif", color: "#7A5444" }}>
                    {tarihStr}
                  </p>
                  {saatStr && (
                    <p className="text-base" style={{ fontFamily: "var(--font-cormorant), serif", color: "#9A7055" }}>
                      Saat {saatStr}
                    </p>
                  )}
                </div>
              )}

              {/* Mekan */}
              {davetiye.mekan && (
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)" }}>
                    📍
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#C9A96E", fontFamily: "var(--font-cormorant), serif" }}>
                    Mekan
                  </p>
                  <p className="text-xl" style={{ fontFamily: "var(--font-cormorant), serif", color: "#3D2314" }}>
                    {davetiye.mekan}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(davetiye.mekan)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-70"
                    style={{ color: "#C9A96E", fontFamily: "var(--font-cormorant), serif", borderBottom: "1px solid rgba(201,169,110,0.4)", paddingBottom: "1px" }}>
                    Haritada Gör
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ BÖLÜM 3 — GERİ SAYIM ══ */}
      {davetiye.tarih && fark > 0 && (
        <section id="sayim" className="py-24 px-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2C1810 0%, #4A2818 50%, #3D1F12 100%)" }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "radial-gradient(circle, #C9A96E 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)" }} />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <SectionLabel>Nişana Kalan Süre</SectionLabel>
            <p className="text-3xl sm:text-4xl mb-12" style={{ fontFamily: "var(--font-dancing), cursive", color: "rgba(253,246,237,0.9)" }}>
              Mutlu güne sayılıyor...
            </p>

            <div className="flex justify-center gap-4 sm:gap-8">
              {[
                { deger: geriSayim.gun,    etiket: "GÜN"    },
                { deger: geriSayim.saat,   etiket: "SAAT"   },
                { deger: geriSayim.dakika, etiket: "DAKİKA" },
                { deger: geriSayim.saniye, etiket: "SANİYE" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2"
                    style={{ border: "1px solid rgba(201,169,110,0.3)", background: "rgba(201,169,110,0.08)" }}>
                    <p className="text-3xl sm:text-4xl font-light tabular-nums"
                      style={{ fontFamily: "var(--font-cormorant), serif", color: "#E8D5B0" }}>
                      {String(item.deger).padStart(2, "0")}
                    </p>
                  </div>
                  <p className="text-[9px] tracking-[0.25em]" style={{ color: "rgba(201,169,110,0.6)" }}>
                    {item.etiket}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ BÖLÜM 4 — RSVP ══ */}
      <section id="katilim" className="py-24 px-6" style={{ background: "#FDF6ED" }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Katılım Bildirimi</SectionLabel>
            <h2 className="text-4xl sm:text-5xl mb-2"
              style={{ fontFamily: "var(--font-dancing), cursive", color: "#3D2314" }}>
              Gelecek misiniz?
            </h2>
            <p className="text-base" style={{ fontFamily: "var(--font-cormorant), serif", color: "#9A7055" }}>
              Lütfen katılım durumunuzu bildirin
            </p>
          </div>
          <div className="p-1" style={{ border: "1px solid rgba(201,169,110,0.25)" }}>
            {rsvpBileseni}
          </div>
        </div>
      </section>

      {/* ══ BÖLÜM 5 — HARİTA ══ */}
      {davetiye.mekan && (
        <section id="mekan" className="py-24 px-6" style={{ background: "linear-gradient(180deg, #F9EDE3 0%, #FDF6ED 100%)" }}>
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <SectionLabel>Nerede Buluşuyoruz?</SectionLabel>
              <h2 className="text-4xl sm:text-5xl"
                style={{ fontFamily: "var(--font-dancing), cursive", color: "#3D2314" }}>
                {davetiye.mekan}
              </h2>
            </div>

            <div className="overflow-hidden shadow-xl" style={{ border: "1px solid rgba(201,169,110,0.3)" }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&output=embed`}
                width="100%" height="280"
                style={{ border: 0, display: "block" }}
                loading="lazy"
              />
            </div>

            <div className="mt-4 text-center">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(davetiye.mekan)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm tracking-[0.15em] uppercase transition-all hover:opacity-80"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  color: "#5C3D2E",
                  border: "1px solid rgba(201,169,110,0.5)",
                  background: "rgba(201,169,110,0.08)",
                }}>
                📍 Yol Tarifi Al
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ══ FOOTER ══ */}
      <section className="py-16 px-6 text-center" style={{ background: "#2C1810" }}>
        <div className="max-w-sm mx-auto">
          <div className="text-3xl mb-4">💑</div>
          <p className="text-xl mb-1" style={{ fontFamily: "var(--font-dancing), cursive", color: "rgba(232,213,176,0.9)" }}>
            {isim1}{isim2 ? ` & ${isim2}` : ""}
          </p>
          <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "rgba(201,169,110,0.5)", fontFamily: "var(--font-cormorant), serif" }}>
            Nişan
          </p>

          <a
            href={`https://wa.me/?text=${whatsappMetin}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium rounded-full transition-all hover:opacity-90 mb-8"
            style={{ background: "#25D366", color: "#fff" }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Daveti Paylaş
          </a>

          <div className="h-px mb-6" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)" }} />

          <p className="text-xs" style={{ color: "rgba(201,169,110,0.3)", fontFamily: "var(--font-cormorant), serif", letterSpacing: "0.1em" }}>
            <Link href="/" className="hover:opacity-60 transition-opacity">davetim.com</Link> ile oluşturuldu
          </p>
        </div>
      </section>
    </div>
  );
}

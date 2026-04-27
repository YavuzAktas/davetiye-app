"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function NisanLuksSablon({ davetiye, rsvpBileseni }: SablonProps) {
  const [acildi, setAcildi] = useState(false);
  const [muhurAnimasyon, setMuhurAnimasyon] = useState(false);

  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const saatStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  const simdi = new Date();
  const fark = davetiye.tarih ? new Date(davetiye.tarih).getTime() - simdi.getTime() : -1;
  const [geriSayim, setGeriSayim] = useState({
    gun: Math.max(0, Math.floor(fark / (1000 * 60 * 60 * 24))),
    saat: Math.max(0, Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
    dakika: Math.max(0, Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60))),
    saniye: Math.max(0, Math.floor((fark % (1000 * 60)) / 1000)),
  });

  useEffect(() => {
    if (!davetiye.tarih) return;
    const interval = setInterval(() => {
      const simdi = new Date();
      const fark = new Date(davetiye.tarih!).getTime() - simdi.getTime();
      if (fark <= 0) { clearInterval(interval); return; }
      setGeriSayim({
        gun: Math.floor(fark / (1000 * 60 * 60 * 24)),
        saat: Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        dakika: Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60)),
        saniye: Math.floor((fark % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [davetiye.tarih]);

  const handleMuhur = () => {
    setMuhurAnimasyon(true);
    setTimeout(() => setAcildi(true), 800);
  };

  const whatsappMetin = encodeURIComponent(
    davetiye.baslik + "\n" +
    (tarihStr ? tarihStr + "\n" : "") +
    (davetiye.mekan ? davetiye.mekan + "\n" : "") +
    "Davetiye: " + process.env.NEXT_PUBLIC_URL + "/davetiye/" + davetiye.slug
  );

  const isim1 = davetiye.kisi1 || davetiye.baslik.split(/[&ve]/i)[0]?.trim() || davetiye.baslik;
  const isim2 = davetiye.kisi2 || davetiye.baslik.split(/[&ve]/i)[1]?.trim() || null;

  if (!acildi) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #e8e0f0 0%, #f5e6e8 50%, #e0e8e8 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                transform: `rotate(${i * 18}deg)`,
                opacity: 0.3,
              }}
            >
              ✦
            </div>
          ))}
        </div>

        <div className="text-center mb-12 relative z-10">
          <p className="text-5xl md:text-6xl text-gray-600 mb-2" style={{ fontFamily: "var(--font-dancing), cursive" }}>
            {isim1 ?? davetiye.baslik}
          </p>
          {isim2 && (
            <>
              <p className="text-2xl text-gray-400 my-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>&</p>
              <p className="text-5xl md:text-6xl text-gray-600" style={{ fontFamily: "var(--font-dancing), cursive" }}>
                {isim2}
              </p>
            </>
          )}
        </div>

        <button onClick={handleMuhur} className="relative z-10 group">
          <div className={`relative transition-all duration-700 ${muhurAnimasyon ? "scale-150 opacity-0" : "hover:scale-105"}`}>
            <div className="w-52 h-52 rounded-full flex items-center justify-center cursor-pointer shadow-2xl" style={{ background: "radial-gradient(circle at 30% 30%, #9b7fa8, #6b4f7a, #4a2f5a)", boxShadow: "0 20px 60px rgba(107, 79, 122, 0.5), inset 0 2px 4px rgba(255,255,255,0.2)" }}>
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #9b7fa8, #6b4f7a, #4a2f5a)", clipPath: "polygon(50% 0%, 61% 5%, 72% 3%, 80% 10%, 90% 10%, 95% 20%, 100% 30%, 98% 40%, 100% 50%, 98% 60%, 100% 70%, 95% 80%, 90% 90%, 80% 90%, 72% 97%, 61% 95%, 50% 100%, 39% 95%, 28% 97%, 20% 90%, 10% 90%, 5% 80%, 0% 70%, 2% 60%, 0% 50%, 2% 40%, 0% 30%, 5% 20%, 10% 10%, 20% 10%, 28% 3%, 39% 5%)" }} />
              <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center relative z-10" style={{ background: "radial-gradient(circle at 40% 40%, #8b6f9a, #5a3f6a)", border: "2px solid rgba(255,255,255,0.15)" }}>
                <div className="text-5xl mb-1">🌿</div>
                <div className="text-xs tracking-widest uppercase text-purple-200 opacity-70" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {davetiye.etkinlikTur === "nisan" ? "Nişan" : "Davetiye"}
                </div>
              </div>
            </div>
          </div>
        </button>

        <div className="text-center mt-10 relative z-10">
          {tarihStr && <p className="text-gray-500 tracking-widest uppercase text-sm mb-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>{tarihStr}</p>}
          <p className="text-gray-400 text-sm animate-pulse">Mühüre dokun ✦</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f0eaf5 0%, #fdf8f8 40%, #ffffff 100%)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-center gap-8">
          {["Biz", "Sayım", "Katılım", "Mekan"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs tracking-widest uppercase text-gray-500 hover:text-gray-800 transition-colors"
              style={{ fontFamily: "var(--font-cormorant), serif", letterSpacing: "0.15em" }}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      <div className="pt-12">
        <section id="biz" className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #9b7fa8 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="text-center relative z-10 max-w-lg">
            <p className="text-xs tracking-widest uppercase text-purple-400 mb-8" style={{ fontFamily: "var(--font-cormorant), serif", letterSpacing: "0.3em" }}>
              {davetiye.etkinlikTur === "nisan" ? "Nişan Davetiyesi" : "Davetiye"}
            </p>
            <div className="mb-6">
              <p className="text-6xl md:text-7xl text-gray-700 leading-tight" style={{ fontFamily: "var(--font-dancing), cursive" }}>{isim1 ?? davetiye.baslik}</p>
              {isim2 && (
                <>
                  <p className="text-3xl text-gray-400 my-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>&</p>
                  <p className="text-6xl md:text-7xl text-gray-700 leading-tight" style={{ fontFamily: "var(--font-dancing), cursive" }}>{isim2}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 justify-center mb-6">
              <div className="h-px bg-gray-300 w-16" />
              <span className="text-purple-400 text-lg">✦</span>
              <div className="h-px bg-gray-300 w-16" />
            </div>
            {tarihStr && <p className="text-gray-500 tracking-widest text-sm mb-2" style={{ fontFamily: "var(--font-cormorant), serif" }}>{tarihStr.toUpperCase()} {davetiye.mekan && ` · ${davetiye.mekan.toUpperCase()}`}</p>}
            {davetiye.mesaj && <p className="text-gray-400 italic text-base mt-4 max-w-xs mx-auto leading-relaxed" style={{ fontFamily: "var(--font-cormorant), serif" }}>{davetiye.mesaj}</p>}
            <p className="text-gray-300 text-xs mt-10 animate-bounce">AŞAĞI KAYDIR ↓</p>
          </div>
        </section>

        {davetiye.tarih && fark > 0 && (
          <section id="sayım" className="py-24 px-4 text-center bg-white">
            <p className="text-xs tracking-widest uppercase text-purple-400 mb-10" style={{ fontFamily: "var(--font-cormorant), serif", letterSpacing: "0.3em" }}>{davetiye.etkinlikTur === "nisan" ? "Nişana" : "Etkinliğe"} Kalan Süre</p>
            <div className="flex justify-center gap-6 md:gap-12">
              {[
                { deger: geriSayim.gun, etiket: "GÜN" },
                { deger: geriSayim.saat, etiket: "SAAT" },
                { deger: geriSayim.dakika, etiket: "DAKİKA" },
                { deger: geriSayim.saniye, etiket: "SANİYE" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-5xl md:text-7xl font-light text-gray-700 tabular-nums" style={{ fontFamily: "var(--font-cormorant), serif" }}>{String(item.deger).padStart(2, "0")}</p>
                  <p className="text-xs text-gray-400 mt-2 tracking-widest">{item.etiket}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="katılım" className="py-24 px-4 max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest uppercase text-purple-400 mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>Katılım Bildirimi</p>
            <h2 className="text-4xl text-gray-700" style={{ fontFamily: "var(--font-dancing), cursive" }}>Gelecek misiniz?</h2>
          </div>
          {rsvpBileseni}
        </section>

        {davetiye.mekan && (
          <section id="mekan" className="py-24 px-4 bg-gray-50">
            <div className="max-w-lg mx-auto text-center">
              <p className="text-xs tracking-widest uppercase text-purple-400 mb-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>Nerede Buluşuyoruz?</p>
              <h2 className="text-4xl text-gray-700 mb-8" style={{ fontFamily: "var(--font-dancing), cursive" }}>Mekan</h2>
              <div className="flex justify-center gap-10 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">📍</div>
                  <p className="text-gray-700 font-medium" style={{ fontFamily: "var(--font-cormorant), serif" }}>{davetiye.mekan}</p>
                </div>
              </div>
              <a
                href={`http://maps.google.com/?q=${encodeURIComponent(davetiye.mekan)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 px-6 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors mb-8"
              >
                📅 HARİTADA GÖR
              </a>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-64">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        )}

        <section className="py-16 px-4 text-center bg-white">
          <a
            href={"https://wa.me/?text=" + whatsappMetin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3.5 rounded-full font-medium hover:bg-green-600 transition-colors mb-8"
          >
            Davetiyeyi Paylaş
          </a>
          <p className="text-xs text-gray-300">
            <Link href="/" className="hover:text-gray-400">davetim.com</Link> ile oluşturuldu
          </p>
        </section>
      </div>
    </div>
  );
}
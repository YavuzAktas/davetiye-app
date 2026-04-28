"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

/* ───────────────────────────────────────────
   BÖLÜM ÖNİZLEMELERİ (mini CSS versiyonları)
─────────────────────────────────────────── */

function PreviewKapak() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 45%, #5C1020 0%, #3B0A14 55%, #270610 100%)" }}>
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle, rgba(196,160,90,0.055) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }} />
      <p className="relative z-10 text-center mb-5" style={{
        fontFamily: "var(--font-dancing), cursive",
        fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
        color: "#F5E8D8", lineHeight: 1.2,
      }}>
        Aylin <span style={{ color: "#C4A05A" }}>&amp;</span> Yavuz
      </p>
      {/* Gül mühür */}
      <div className="relative z-10" style={{
        width: 90, height: 90, borderRadius: "50%", overflow: "hidden",
        boxShadow: "0 0 0 5px #3B0A14, 0 0 0 7px rgba(196,160,90,0.2), 0 10px 30px rgba(10,0,6,0.7)",
      }}>
        <img src="/rose-seal.png" alt="" className="w-full h-full object-cover block"
          onError={e => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex";
          }} />
        <div className="w-full h-full items-center justify-center hidden" style={{
          background: "radial-gradient(circle at 38% 32%, #A01C2E 0%, #7A1220 40%, #3E0810 100%)",
        }}>
          <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
            {[0,60,120,180,240,300].map(a => <ellipse key={a} cx="100" cy="52" rx="14" ry="22" fill="rgba(200,80,80,0.3)" transform={`rotate(${a} 100 100)`}/>)}
            {[30,90,150,210,270,330].map(a => <ellipse key={a} cx="100" cy="64" rx="10" ry="16" fill="rgba(215,95,95,0.4)" transform={`rotate(${a} 100 100)`}/>)}
            <circle cx="100" cy="100" r="12" fill="rgba(225,105,105,0.65)"/>
            <circle cx="100" cy="100" r="5" fill="rgba(245,140,130,0.8)"/>
          </svg>
        </div>
      </div>
      <p className="relative z-10 mt-5" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.3em", color:"#C4A05A" }}>
        06 HAZİRAN 2026
      </p>
      <p className="relative z-10 mt-2" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, fontStyle:"italic", color:"rgba(196,160,90,0.5)" }}>
        Mühüre dokun ✦
      </p>
    </div>
  );
}

function PreviewHero() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 relative"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #5C1020 0%, #3B0A14 60%)" }}>
      {/* Köşe süsleri */}
      {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((c,i) => (
        <span key={i} className={`absolute ${c} text-xs`} style={{ color:"rgba(196,160,90,0.4)" }}>✦</span>
      ))}
      {/* Kemer çerçeve */}
      <div className="w-full max-w-45 text-center py-5 px-4" style={{
        borderRadius: "70px 70px 10px 10px",
        border: "1px solid rgba(196,160,90,0.3)",
      }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.3em", color:"#C4A05A", marginBottom:10 }}>
          NİŞAN DAVETİYESİ
        </p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:"#F5E8D8", lineHeight:1 }}>Aylin</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(0.85rem,3vw,1rem)", color:"#C4A05A", lineHeight:1.4 }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:"#F5E8D8", lineHeight:1, marginBottom:8 }}>Yavuz</p>
        <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(196,160,90,0.5),transparent)", margin:"8px 0" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.15em", color:"rgba(245,232,216,0.6)" }}>
          06 HAZİRAN 2026 · İSTANBUL
        </p>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, fontStyle:"italic", color:"rgba(245,232,216,0.4)", marginTop:4 }}>
          Bizi bu özel günde yanınızda<br/>görmek isteriz
        </p>
      </div>
      <div className="mt-4 text-center">
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.25em", color:"rgba(196,160,90,0.45)" }}>AŞAĞI KAYDIR</p>
        <p style={{ color:"rgba(196,160,90,0.45)", fontSize:10, marginTop:3 }}>↓</p>
      </div>
    </div>
  );
}

function PreviewSayim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center"
      style={{ background:"#4E1020" }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:"#C4A05A", marginBottom:10 }}>
        NİŞANA KALAN SÜRE
      </p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.2rem,4vw,1.6rem)", color:"#F5E8D8", marginBottom:20 }}>
        Sayıyoruz...
      </p>
      <div className="flex items-start gap-2 justify-center">
        {[{v:"43",l:"GÜN"},{v:"07",l:"SAAT"},{v:"42",l:"DAKİKA"},{v:"39",l:"SANİYE"}].map((item,i) => (
          <div key={i} className="flex items-start gap-1.5">
            <div className="text-center">
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"clamp(1.5rem,5vw,2rem)", fontWeight:600, color:"#F5E8D8", lineHeight:1 }}>{item.v}</p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.15em", color:"#C4A05A", marginTop:4 }}>{item.l}</p>
            </div>
            {i < 3 && <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"1.2rem", color:"rgba(196,160,90,0.4)", lineHeight:1.1, marginTop:2 }}>:</p>}
          </div>
        ))}
      </div>
      <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(196,160,90,0.25),transparent)", width:"80%", maxWidth:200, marginTop:20 }}/>
    </div>
  );
}

function PreviewKatilim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4"
      style={{ background:"#270610" }}>
      <div className="w-full max-w-50 relative rounded-xl p-5"
        style={{ background:"#FAF0E4", boxShadow:"0 8px 30px rgba(0,0,0,0.4)" }}>
        <span className="absolute top-2 left-3 text-xs" style={{ color:"#C4A05A", opacity:0.5 }}>✦</span>
        <span className="absolute bottom-2 right-3 text-xs" style={{ color:"#C4A05A", opacity:0.5 }}>✦</span>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.28em", color:"#8B5A4A", textAlign:"center", marginBottom:6 }}>
          KATILIM BİLDİRİMİ
        </p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.3rem)", color:"#3B0A14", textAlign:"center", marginBottom:10 }}>
          Gelecek misiniz?
        </p>
        <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(196,160,90,0.5),transparent)", marginBottom:12 }}/>
        {["ADINIZ SOYADINIZ","KAÇ KİŞİ?","KATILIM DURUMU"].map(lbl => (
          <div key={lbl} style={{ marginBottom:10 }}>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.22em", color:"#8B6550", marginBottom:3 }}>{lbl}</p>
            <div style={{ height:1, background:"rgba(196,160,90,0.35)" }}/>
          </div>
        ))}
        <div style={{
          marginTop:14, padding:"7px", background:"#3B0A14",
          borderRadius:6, textAlign:"center",
          fontFamily:"var(--font-cormorant),serif",
          fontSize:8, letterSpacing:"0.28em", color:"#F5E8D8",
        }}>BİLDİR</div>
      </div>
    </div>
  );
}

function PreviewMekan() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center"
      style={{ background:"#4E1020" }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:"#C4A05A", marginBottom:8 }}>MEKAN</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.4rem)", color:"#F5E8D8", marginBottom:16 }}>Nerede Buluşuyoruz?</p>
      <div className="flex gap-6 justify-center mb-4">
        {[{e:"📍",l:"MEKAN",v:"Çırağan Sarayı"},{e:"🕐",l:"SAAT",v:"18:00"},{e:"📅",l:"TARİH",v:"06 Haz"}].map(col => (
          <div key={col.l} className="text-center">
            <p style={{ fontSize:14, marginBottom:5 }}>{col.e}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.2em", color:"#C4A05A", marginBottom:4 }}>{col.l}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, fontWeight:600, color:"#F5E8D8" }}>{col.v}</p>
          </div>
        ))}
      </div>
      {/* Harita placeholder */}
      <div style={{
        width:"85%", maxWidth:180, height:60, borderRadius:8,
        background:"rgba(255,255,255,0.06)", border:"1px solid rgba(196,160,90,0.2)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, color:"rgba(196,160,90,0.5)", fontStyle:"italic" }}>📍 Harita görünümü</p>
      </div>
    </div>
  );
}

function PreviewAnilar() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center"
      style={{ background:"linear-gradient(180deg,#3B0A14 0%,#270610 100%)" }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:"#C4A05A", marginBottom:8 }}>
        BİZİM HİKAYEMİZ
      </p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.4rem)", color:"#F5E8D8", marginBottom:16 }}>
        En Güzel Anılar
      </p>
      <div style={{ height:1, background:"linear-gradient(to right,transparent,rgba(196,160,90,0.4),transparent)", width:120, marginBottom:18 }}/>
      {/* Polaroidler */}
      <div style={{ position:"relative", width:160, height:120 }}>
        {[{ t:8, l:-16, r:-7 }, { t:14, l:20, r:4 }, { t:2, l:46, r:-2 }].map((p,i) => (
          <div key={i} style={{
            position:"absolute", top:p.t, left:p.l,
            background:"#fff", borderRadius:2,
            padding:"5px 5px 18px",
            transform:`rotate(${p.r}deg)`,
            boxShadow:"0 4px 14px rgba(0,0,0,0.4)",
            width:80,
          }}>
            <div style={{ width:"100%", height:72, background:`linear-gradient(135deg,#4E1020,#6B1828)`, borderRadius:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:20, opacity:0.2 }}>📷</span>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:10, fontStyle:"italic", color:"rgba(245,232,216,0.4)", marginTop:18 }}>
        Sonsuz bir yolculuğun ilk adımları... ✦
      </p>
    </div>
  );
}

/* ─── Bölüm tanımları ─── */
const BOLUMLER = [
  {
    id: "kapak",
    label: "Kapak",
    icon: "🌹",
    preview: <PreviewKapak />,
    baslik: "Gül Mühürlü Kapak",
    aciklama: "Davetiye kapalı gelir — ortadaki gül mühürüne dokunulunca açılır. İlk izlenim unutulmaz.",
    etiket: "Açılış animasyonu",
  },
  {
    id: "davetiye",
    label: "Davetiye",
    icon: "💍",
    preview: <PreviewHero />,
    baslik: "Kemer Çerçeveli Hero",
    aciklama: "İsimler büyük el yazısıyla, altın çizgili kemer çerçeve içinde gösterilir. Tarih ve mekan altında yer alır.",
    etiket: "Ana bölüm",
  },
  {
    id: "sayim",
    label: "Sayım",
    icon: "⏱️",
    preview: <PreviewSayim />,
    baslik: "Canlı Geri Sayım",
    aciklama: "Nişana kaç gün, saat, dakika ve saniye kaldığını gerçek zamanlı olarak gösterir.",
    etiket: "Otomatik güncellenir",
  },
  {
    id: "katilim",
    label: "Katılım",
    icon: "💌",
    preview: <PreviewKatilim />,
    baslik: "RSVP Formu",
    aciklama: "Misafirler katılıp katılmadıklarını ve kaç kişi olduklarını bildirebilir. Yanıtlar panelinde görünür.",
    etiket: "Veri toplanır",
  },
  {
    id: "mekan",
    label: "Mekan",
    icon: "📍",
    preview: <PreviewMekan />,
    baslik: "Konum & Harita",
    aciklama: "Mekan adı, saat ve tarih üç sütunda gösterilir. Altında Google Harita ve yol tarifi butonu yer alır.",
    etiket: "Google Maps",
  },
  {
    id: "anilar",
    label: "Anılar",
    icon: "📷",
    preview: <PreviewAnilar />,
    baslik: "Polaroid Fotoğraf Galerisi",
    aciklama: "Çiftin fotoğrafları polaroid tarzında, üst üste binmiş şekilde sergilenir.",
    etiket: "Fotoğraf galerisi",
  },
] as const;

/* ─── Telefon Mockup ─── */
function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 260 }}>
      {/* Çerçeve */}
      <div className="relative rounded-[38px] overflow-hidden shadow-2xl shadow-black/40"
        style={{
          background: "#1a1a1a",
          padding: "14px 10px",
          boxShadow: "0 0 0 1px #333, 0 30px 80px rgba(0,0,0,0.5), inset 0 0 0 1px #444",
        }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width: 80, height: 26, background: "#1a1a1a", borderRadius: "0 0 16px 16px" }} />
        {/* Ekran */}
        <div className="rounded-[28px] overflow-hidden relative" style={{ height: 500, background: "#000" }}>
          {children}
        </div>
      </div>
      {/* Yan butonlar */}
      <div className="absolute right-0 top-24 w-1 h-10 rounded-l bg-gray-700" style={{ right: -1 }} />
      <div className="absolute left-0 top-20 w-1 h-8 rounded-r bg-gray-700" style={{ left: -1 }} />
      <div className="absolute left-0 top-32 w-1 h-8 rounded-r bg-gray-700" style={{ left: -1 }} />
    </div>
  );
}

/* ─── Ana Sayfa ─── */
export default function SablonlarSayfasi() {
  const router = useRouter();
  const [aktif, setAktif] = useState<typeof BOLUMLER[number]["id"]>("kapak");
  const [gecis, setGecis] = useState(true);
  const [statsRef, statsVisible] = useInView(0.2);

  const aktifBolum = BOLUMLER.find(b => b.id === aktif)!;

  const handleTab = (id: typeof aktif) => {
    if (id === aktif) return;
    setGecis(false);
    setTimeout(() => { setAktif(id); setGecis(true); }, 180);
  };

  return (
    <div className="overflow-x-hidden">

      {/* ══ BAŞLIK ══ */}
      <div className="bg-gray-50 pt-12 pb-4 px-4 text-center">
        <p className="text-xs text-purple-500 font-semibold tracking-[0.22em] uppercase mb-2">Şablonlar</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Lüks Nişan Davetiyesi</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Bordo & altın temalı, gül mühürlü dijital davetiye. Aşağıdan her bölümü inceleyin.
        </p>
      </div>

      {/* ══ BÖLÜM SEKMELERİ ══ */}
      <div className="bg-gray-50 px-4 pb-0 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide">
            {BOLUMLER.map(b => (
              <button key={b.id} onClick={() => handleTab(b.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  aktif === b.id
                    ? "text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                }`}
                style={aktif === b.id ? { background: "linear-gradient(135deg,#7A1220,#4E0A14)" } : {}}>
                <span>{b.icon}</span>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ ÖNİZLEME + AÇIKLAMA ══ */}
      <div className="bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Telefon mockup */}
            <div className="shrink-0">
              <TelefonMockup>
                <div className={`w-full h-full transition-opacity duration-180 ${gecis ? "opacity-100" : "opacity-0"}`}>
                  {aktifBolum.preview}
                </div>
              </TelefonMockup>
            </div>

            {/* Sağ — açıklama */}
            <div className="flex-1 max-w-lg">
              {/* Aktif bölüm açıklaması */}
              <div className={`transition-all duration-200 ${gecis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4"
                  style={{ background: "rgba(122,18,32,0.1)", color: "#7A1220" }}>
                  {aktifBolum.icon} {aktifBolum.etiket}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{aktifBolum.baslik}</h2>
                <p className="text-gray-500 text-base leading-relaxed mb-8">{aktifBolum.aciklama}</p>
              </div>

              {/* Tüm bölümler liste */}
              <div className="space-y-2">
                {BOLUMLER.map(b => (
                  <button key={b.id} onClick={() => handleTab(b.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                      aktif === b.id
                        ? "bg-white shadow-md border border-gray-100"
                        : "hover:bg-white/60"
                    }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${
                      aktif === b.id ? "scale-110" : ""
                    }`}
                      style={{ background: aktif === b.id ? "rgba(122,18,32,0.08)" : "rgba(0,0,0,0.04)" }}>
                      {b.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${aktif === b.id ? "text-gray-900" : "text-gray-500"}`}>
                        {b.label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{b.baslik}</p>
                    </div>
                    {aktif === b.id && (
                      <div className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background:"#7A1220" }} />
                    )}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/olustur?sablon=nisan-luks")}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background:"linear-gradient(135deg,#7A1220,#4E0A14)" }}>
                  Davetiyeni Oluştur →
                </button>
                <a href="/davetiye/ornek-nisan" target="_blank"
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-center">
                  Canlı Önizle ↗
                </a>
              </div>
              <p className="text-center text-xs text-gray-300 mt-3">Ücretsiz başla · Kredi kartı gerekmez</p>
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
              { n:"500+", l:"Davetiye Gönderildi", icon:"💌" },
              { n:"%98",  l:"Memnuniyet Oranı",   icon:"⭐" },
              { n:"3 dk", l:"Oluşturma Süresi",   icon:"⚡" },
              { n:"∞",    l:"Paylaşım İmkânı",    icon:"🔗" },
            ].map(({ n, l, icon }, i) => (
              <div key={l}
                className={`group transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay:`${i * 120}ms` }}>
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
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"28px 28px",
        }}/>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"/>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-8">✨</div>
          <p className="text-white/60 text-sm mb-3 tracking-[0.2em] uppercase">Hemen başla</p>
          <h3 className="text-4xl md:text-5xl text-white mb-4 leading-tight"
            style={{ fontFamily:"var(--font-dancing),cursive" }}>
            Nişanınıza özel davetiye
          </h3>
          <p className="text-white/60 text-base mb-12">
            İsimler, tarih, mekan ve mesajı girmeniz yeterli — dakikalar içinde hazır.
          </p>
          <button
            onClick={() => router.push("/olustur?sablon=nisan-luks")}
            className="group inline-flex items-center gap-3 bg-white text-purple-700 px-10 py-5 rounded-2xl text-base font-bold hover:bg-purple-50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/30 hover:-translate-y-1">
            Hemen Oluştur
            <span className="text-lg group-hover:translate-x-1.5 transition-transform inline-block">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

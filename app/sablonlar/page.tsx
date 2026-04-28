"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SABLONLAR, KATEGORILER, Sablon } from "@/lib/sablonlar";

/* ─── Sabitler ─── */
const DEMO_URLS: Record<string, string> = {
  "nisan-luks": "/davetiye/ornek-nisan",
  "dugun-luks": "/davetiye/ornek-dugun",
};

const PREMIUM = new Set(["nisan-luks", "dugun-luks"]);

const KAT_EMOJI: Record<string, string> = {
  dugun: "💍", nisan: "💌", dogumgunu: "🎂",
  sunnet: "⭐", kina: "🕯️", kurumsal: "💼", diger: "🎉",
};

/* ══════════════════════════════════════
   MİNİ ÖNIZLEME BİLEŞENLERİ
══════════════════════════════════════ */

/* Nişan Lüks — bordo & altın */
function NisanLuksMini() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:"radial-gradient(ellipse at 50% 40%,#5C1020 0%,#3B0A14 55%,#270610 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:"radial-gradient(circle,rgba(196,160,90,0.055) 1px,transparent 1px)",
        backgroundSize:"20px 20px",
      }}/>
      <p className="relative z-10 text-center mb-4" style={{
        fontFamily:"var(--font-dancing),cursive", fontSize:"1.25rem", color:"#F5E8D8", lineHeight:1.2,
      }}>
        Aylin <span style={{ color:"#C4A05A" }}>&amp;</span> Yavuz
      </p>
      {/* Mühür */}
      <div className="relative z-10" style={{
        width:72, height:72, borderRadius:"50%", overflow:"hidden",
        boxShadow:"0 0 0 4px #3B0A14,0 0 0 6px rgba(196,160,90,0.25),0 8px 24px rgba(10,0,6,0.7)",
      }}>
        <img src="/rose-seal.png" alt="" className="w-full h-full object-cover block"
          onError={e=>{(e.currentTarget as HTMLImageElement).style.display="none";(e.currentTarget.nextElementSibling as HTMLElement).style.display="flex";}}/>
        <div className="w-full h-full items-center justify-center hidden"
          style={{ background:"radial-gradient(circle at 38% 32%,#A01C2E 0%,#7A1220 40%,#3E0810 100%)" }}>
          <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
            {[0,60,120,180,240,300].map(a=><ellipse key={a} cx="100" cy="52" rx="13" ry="21" fill="rgba(200,80,80,0.3)" transform={`rotate(${a} 100 100)`}/>)}
            <circle cx="100" cy="100" r="11" fill="rgba(225,105,105,0.65)"/>
            <circle cx="100" cy="100" r="5"  fill="rgba(245,140,130,0.8)"/>
          </svg>
        </div>
      </div>
      <p className="relative z-10 mt-4" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.3em", color:"#C4A05A" }}>
        06 HAZİRAN 2026
      </p>
      <p className="relative z-10 mt-1.5" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, fontStyle:"italic", color:"rgba(196,160,90,0.5)" }}>
        Mühüre dokun ✦
      </p>
    </div>
  );
}

/* Düğün Lüks — lacivert & şampanya */
function DugunLuksMini() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:"radial-gradient(ellipse at 50% 40%,#1E3A6E 0%,#0D1F3C 55%,#071228 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:"radial-gradient(circle,rgba(212,170,112,0.06) 1px,transparent 1px)",
        backgroundSize:"20px 20px",
      }}/>
      <p className="relative z-10 text-center mb-4" style={{
        fontFamily:"var(--font-dancing),cursive", fontSize:"1.25rem", color:"#F8F3EE", lineHeight:1.2,
      }}>
        Selin <span style={{ color:"#D4AA70" }}>&amp;</span> Mert
      </p>
      {/* Yüzük mühür */}
      <div className="relative z-10" style={{
        width:72, height:72, borderRadius:"50%", overflow:"hidden",
        boxShadow:"0 0 0 4px #0D1F3C,0 0 0 6px rgba(212,170,112,0.25),0 8px 24px rgba(0,6,20,0.7)",
      }}>
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
          background:"radial-gradient(circle at 38% 34%,#1E3A6E 0%,#0D1F3C 50%,#071228 100%)" }}>
          <svg viewBox="0 0 200 200" style={{ width:"82%", height:"82%" }} fill="none">
            <circle cx="80" cy="112" r="35" stroke="#D4AA70" strokeWidth="7" fill="none" opacity="0.9"/>
            <circle cx="120" cy="112" r="35" stroke="#D4AA70" strokeWidth="7" fill="none" opacity="0.9"/>
            <polygon points="100,48 113,63 100,76 87,63" fill="#D4AA70" opacity="0.88"/>
            <polygon points="100,48 113,63 100,57 87,63" fill="rgba(255,255,255,0.22)"/>
          </svg>
        </div>
      </div>
      <p className="relative z-10 mt-4" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.3em", color:"#D4AA70" }}>
        12 EYLÜL 2026
      </p>
      <p className="relative z-10 mt-1.5" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, fontStyle:"italic", color:"rgba(212,170,112,0.5)" }}>
        Mühüre dokun ◆
      </p>
    </div>
  );
}

/* Standart şablon — renkli hafif kart */
function KlasikMini({ sablon }: { sablon: Sablon }) {
  const emoji = KAT_EMOJI[sablon.kategori] ?? "✨";
  const renk = sablon.renk;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`linear-gradient(145deg,#fff 0%,${renk}18 100%)` }}>
      {/* Üst aksant şerit */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:renk }}/>
      {/* Nokta dokusu */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:`radial-gradient(circle,${renk}18 1px,transparent 1px)`,
        backgroundSize:"18px 18px",
      }}/>
      {/* Dekoratif çerçeve */}
      <div style={{
        position:"absolute", inset:"14px",
        border:`1px solid ${renk}22`, borderRadius:4,
      }}/>
      {/* İçerik */}
      <div className="relative z-10 flex flex-col items-center gap-3 px-5 text-center">
        <span style={{ fontSize:32 }}>{emoji}</span>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"1.3rem", color:"#1a1a1a", lineHeight:1.2 }}>
          Ad <span style={{ color:renk }}>&amp;</span> Soyad
        </p>
        <div style={{ width:36, height:1, background:renk, opacity:0.7 }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.12em", color:"#999" }}>
          GÜN · AY · YIL
        </p>
        <div style={{
          marginTop:2, padding:"4px 14px", borderRadius:20,
          border:`1px solid ${renk}35`, color:renk,
          fontSize:10, letterSpacing:"0.06em", fontWeight:700,
        }}>
          {sablon.isim}
        </div>
      </div>
    </div>
  );
}

function MiniOnizleme({ sablon }: { sablon: Sablon }) {
  if (sablon.id === "nisan-luks") return <NisanLuksMini/>;
  if (sablon.id === "dugun-luks") return <DugunLuksMini/>;
  return <KlasikMini sablon={sablon}/>;
}

/* ══════════════════════════════════════
   ŞABLON KARTI
══════════════════════════════════════ */
function SablonKarti({ sablon, onOlustur }: { sablon: Sablon; onOlustur: (id:string)=>void }) {
  const [hover, setHover] = useState(false);
  const isPremium = PREMIUM.has(sablon.id);
  const demoUrl = DEMO_URLS[sablon.id];

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 transition-all duration-300"
      style={{
        boxShadow: hover
          ? `0 16px 40px rgba(0,0,0,0.12), 0 4px 12px ${sablon.renk}22`
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Premium rozeti */}
      {isPremium && (
        <div className="absolute top-3 left-3 z-20">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background:"linear-gradient(135deg,#7A1220,#C4A05A)" }}>
            ✦ PRİMİUM
          </span>
        </div>
      )}

      {/* Önizleme alanı */}
      <div className="relative overflow-hidden" style={{ height:220 }}>
        <MiniOnizleme sablon={sablon}/>

        {/* Hover overlay — butonlar */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-200 ${hover?"opacity-100":"opacity-0"}`}
          style={{ background:"rgba(0,0,0,0.45)", backdropFilter:"blur(2px)" }}>
          <button onClick={()=>onOlustur(sablon.id)}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 w-40"
            style={{ background:sablon.renk }}>
            Oluştur
          </button>
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-white/20 hover:bg-white/30 transition-all text-center w-40">
              Canlı Önizle ↗
            </a>
          )}
        </div>
      </div>

      {/* Bilgi alanı */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 leading-tight">{sablon.isim}</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
            style={{ background:`${sablon.renk}14`, color:sablon.renk }}>
            {KAT_EMOJI[sablon.kategori]} {sablon.kategori.charAt(0).toUpperCase() + sablon.kategori.slice(1)}
          </span>
        </div>
        {sablon.aciklama && (
          <p className="text-xs text-gray-400 leading-relaxed mb-3">{sablon.aciklama}</p>
        )}
        {/* Renk göstergesi + Oluştur butonu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full border border-white shadow-sm shrink-0" style={{ background:sablon.renk }}/>
            <div className="w-3 h-3 rounded-full border border-white/80" style={{ background:sablon.yaziRengi }}/>
          </div>
          <button onClick={()=>onOlustur(sablon.id)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 text-white"
            style={{ background:sablon.renk }}>
            Oluştur →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════ */
export default function SablonlarSayfasi() {
  const router = useRouter();
  const [aktifKat, setAktifKat] = useState("hepsi");

  const filtrelenmis = useMemo(() => {
    const liste = aktifKat === "hepsi"
      ? SABLONLAR
      : SABLONLAR.filter(s => s.kategori === aktifKat);

    // Premium şablonlar üste
    return [...liste].sort((a, b) => {
      const aP = PREMIUM.has(a.id) ? 0 : 1;
      const bP = PREMIUM.has(b.id) ? 0 : 1;
      return aP - bP;
    });
  }, [aktifKat]);

  const handleOlustur = (sablonId: string) => {
    router.push(`/olustur?sablon=${sablonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Başlık ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-10 text-center">
        <p className="text-xs text-purple-500 font-semibold tracking-[0.22em] uppercase mb-2">Şablonlar</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Dijital Davetiye Şablonları</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {SABLONLAR.length} farklı şablon. Filtreleyip beğendiğinizi seçin, dakikalar içinde hazır.
        </p>
      </div>

      {/* ── Filtre Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
          {KATEGORILER.map(kat => {
            const sayi = kat.id === "hepsi"
              ? SABLONLAR.length
              : SABLONLAR.filter(s=>s.kategori===kat.id).length;
            return (
              <button key={kat.id} onClick={()=>setAktifKat(kat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  aktifKat === kat.id
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {kat.id !== "hepsi" && <span>{KAT_EMOJI[kat.id]}</span>}
                {kat.isim}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  aktifKat === kat.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                }`}>{sayi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Şablon Grid ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filtrelenmis.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium">Bu kategoride şablon bulunamadı.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-5">
              <span className="font-semibold text-gray-700">{filtrelenmis.length}</span> şablon gösteriliyor
              {aktifKat !== "hepsi" && <> · <button onClick={()=>setAktifKat("hepsi")} className="text-purple-500 hover:underline">Tümünü gör</button></>}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtrelenmis.map(sablon => (
                <SablonKarti key={sablon.id} sablon={sablon} onOlustur={handleOlustur}/>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="bg-gray-900 px-4 py-16 text-center mt-8">
        <p className="text-white/50 text-xs tracking-[0.2em] uppercase mb-3">Hemen başla</p>
        <h2 className="text-2xl font-bold text-white mb-2">Kendi davetiyeni oluştur</h2>
        <p className="text-white/40 text-sm mb-8">Birkaç dakika içinde hazır. Kredi kartı gerekmez.</p>
        <button onClick={()=>router.push("/olustur?sablon=nisan-luks")}
          className="bg-white text-gray-900 px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-colors">
          Ücretsiz Başla →
        </button>
      </div>
    </div>
  );
}

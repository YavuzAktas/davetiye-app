"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Timer, Music, ClipboardCheck } from "lucide-react";
import { SABLONLAR, KATEGORILER, Sablon } from "@/lib/sablonlar";
import { SABLON_ETIKETLER, ETIKET_STILI } from "@/lib/sablon-meta";

/* ─── Sabitler ─── */
const DEMO_URLS: Record<string, string> = {
  "nisan-luks":      "/davetiye/ornek-nisan",
  "dugun-luks":      "/davetiye/ornek-dugun",
  "dogumgunu-luks":  "/davetiye/ornek-dogumgunu",
  "vintage-nisan":   "/davetiye/ornek-vintage-nisan",
};
const PREMIUM = new Set(["nisan-luks", "dugun-luks", "dogumgunu-luks", "vintage-nisan"]);
const KAT_EMOJI: Record<string, string> = {
  dugun:"💍", nisan:"💌", dogumgunu:"🎂", sunnet:"⭐", kina:"🕯️", kurumsal:"💼", diger:"🎉",
};
const SEO_LINKLER = [
  { href: "/dijital-davetiye", label: "Dijital davetiye" },
  { href: "/online-davetiye", label: "Online davetiye" },
  { href: "/whatsapp-davetiye", label: "WhatsApp davetiye" },
  { href: "/dugun-davetiyesi", label: "Düğün davetiyesi" },
  { href: "/nisan-davetiyesi", label: "Nişan davetiyesi" },
  { href: "/ucretsiz-davetiye", label: "Ücretsiz davetiye" },
];
const SABLON_SECIM_IPUCLARI = [
  {
    baslik: "Etkinliğe göre başla",
    aciklama: "Düğün, nişan, kına, doğum günü veya kurumsal etkinlik için hazır koleksiyonlardan ilerle.",
  },
  {
    baslik: "Paylaşım kanalını düşün",
    aciklama: "WhatsApp ile davetiye göndereceksen okunaklı başlık, net tarih ve hızlı açılan sayfa tercih et.",
  },
  {
    baslik: "Özellik ihtiyacını seç",
    aciklama: "Konum, katılım bildirimi, geri sayım, müzik ve fotoğraf alanlarını davet akışına göre değerlendir.",
  },
  {
    baslik: "Son düzenlemeyi unutma",
    aciklama: "Yayınlamadan önce isim, tarih, mekan, saat ve iletişim bilgilerini misafir gözüyle kontrol et.",
  },
];

/* ══════════════════════════════════════════════
   TELEFON MOCKUP
══════════════════════════════════════════════ */
function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 260 }}>
      <div className="relative overflow-hidden"
        style={{ background:"#1a1a1a", padding:"14px 10px", borderRadius:38,
          boxShadow:"0 0 0 1px #333,0 30px 80px rgba(0,0,0,0.6),inset 0 0 0 1px #444" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width:80, height:26, background:"#1a1a1a", borderRadius:"0 0 16px 16px" }}/>
        <div style={{ borderRadius:24, overflow:"hidden", height:500, background:"#000" }}>
          {children}
        </div>
      </div>
      <div className="absolute right-0 top-24 h-10 rounded-l bg-gray-700" style={{ right:-1, width:1 }}/>
      <div className="absolute left-0 top-20 h-8 rounded-r bg-gray-700" style={{ left:-1, width:1 }}/>
      <div className="absolute left-0 top-32 h-8 rounded-r bg-gray-700" style={{ left:-1, width:1 }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PREMIUM ÖNİZLEMELER — Nişan Lüks
══════════════════════════════════════════════ */
const N = { BG:"#3B0A14", BG_MED:"#4E1020", BG_DARK:"#270610", GOLD:"#C4A05A", CREAM:"#F5E8D8" };

function NisanKapak() {
  const [sealFailed, setSealFailed] = useState(false);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse at 50% 45%,#5C1020 0%,${N.BG} 55%,${N.BG_DARK} 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,rgba(196,160,90,0.055) 1px,transparent 1px)`, backgroundSize:"22px 22px" }}/>
      <p className="relative z-10 text-center mb-6" style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2.2rem)", color:N.CREAM, lineHeight:1.2 }}>
        Aylin <span style={{ color:N.GOLD }}>&amp;</span> Yavuz
      </p>
      <div className="relative z-10" style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 6px ${N.BG},0 0 0 8px rgba(196,160,90,0.2),0 12px 36px rgba(10,0,6,0.7)` }}>
        {!sealFailed ? (
          <Image src="/rose-seal.png" alt="" fill className="object-cover" onError={() => setSealFailed(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background:`radial-gradient(circle at 38% 32%,#A01C2E 0%,#7A1220 40%,#3E0810 100%)` }}>
            <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
              {[0,60,120,180,240,300].map(a=><ellipse key={a} cx="100" cy="52" rx="14" ry="22" fill="rgba(200,80,80,0.3)" transform={`rotate(${a} 100 100)`}/>)}
              <circle cx="100" cy="100" r="12" fill="rgba(225,105,105,0.65)"/><circle cx="100" cy="100" r="5" fill="rgba(245,140,130,0.8)"/>
            </svg>
          </div>
        )}
      </div>
      <p className="relative z-10 mt-6" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:12, letterSpacing:"0.3em", color:N.GOLD }}>06 HAZİRAN 2026</p>
      <p className="relative z-10 mt-2" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, fontStyle:"italic", color:`${N.GOLD}55` }}>Mühüre dokun ✦</p>
    </div>
  );
}
function NisanHero() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 relative"
      style={{ background:`radial-gradient(ellipse at 50% 30%,#5C1020 0%,${N.BG} 60%)` }}>
      {["top-4 left-4","top-4 right-4","bottom-4 left-4","bottom-4 right-4"].map((c,i)=>(
        <span key={i} className={`absolute ${c}`} style={{ color:`${N.GOLD}40`, fontSize:12 }}>✦</span>
      ))}
      <div className="w-full text-center py-6 px-5" style={{ borderRadius:"80px 80px 12px 12px", border:`1px solid ${N.GOLD}30` }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.3em", color:N.GOLD, marginBottom:12 }}>NİŞAN DAVETİYESİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.8rem,6vw,2.5rem)", color:N.CREAM, lineHeight:1 }}>Aylin</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,3vw,1.3rem)", color:N.GOLD, lineHeight:1.4 }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.8rem,6vw,2.5rem)", color:N.CREAM, lineHeight:1, marginBottom:10 }}>Yavuz</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${N.GOLD}50,transparent)`, margin:"10px 0" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.12em", color:`${N.CREAM}60` }}>06 HAZİRAN 2026 · İSTANBUL</p>
      </div>
    </div>
  );
}
function NisanSayim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center" style={{ background:N.BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.35em", color:N.GOLD, marginBottom:12 }}>NİŞANA KALAN SÜRE</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2rem)", color:N.CREAM, marginBottom:28 }}>Sayıyoruz...</p>
      <div className="flex items-start gap-3 justify-center">
        {[{v:"43",l:"GÜN"},{v:"07",l:"SAAT"},{v:"42",l:"DAK"},{v:"39",l:"SAN"}].map((item,i)=>(
          <div key={i} className="flex items-start gap-2">
            <div className="text-center">
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"clamp(1.8rem,6vw,2.6rem)", fontWeight:600, color:N.CREAM, lineHeight:1 }}>{item.v}</p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.15em", color:N.GOLD, marginTop:5 }}>{item.l}</p>
            </div>
            {i<3 && <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"1.5rem", color:`${N.GOLD}40`, lineHeight:1.1, marginTop:2 }}>:</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
function NisanKatilim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5" style={{ background:N.BG_DARK }}>
      <div className="w-full relative rounded-2xl p-6" style={{ background:"#FAF0E4", boxShadow:"0 12px 40px rgba(0,0,0,0.4)" }}>
        <span className="absolute top-3 left-4" style={{ color:N.GOLD, fontSize:12, opacity:0.5 }}>✦</span>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.28em", color:"#8B5A4A", textAlign:"center", marginBottom:8 }}>KATILIM BİLDİRİMİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.3rem,5vw,1.8rem)", color:N.BG, textAlign:"center", marginBottom:12 }}>Gelecek misiniz?</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${N.GOLD}50,transparent)`, marginBottom:16 }}/>
        {["ADINIZ SOYADINIZ","KAÇ KİŞİ?","KATILIM DURUMU"].map(lbl=>(
          <div key={lbl} style={{ marginBottom:12 }}>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.22em", color:"#8B6550", marginBottom:4 }}>{lbl}</p>
            <div style={{ height:1, background:`rgba(196,160,90,0.35)` }}/>
          </div>
        ))}
        <div style={{ marginTop:16, padding:"9px", background:N.BG, borderRadius:8, textAlign:"center", fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.28em", color:"#F5E8D8" }}>BİLDİR</div>
      </div>
    </div>
  );
}
function NisanMekan() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center" style={{ background:N.BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.35em", color:N.GOLD, marginBottom:10 }}>MEKAN</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.3rem,5vw,1.8rem)", color:N.CREAM, marginBottom:20 }}>Nerede Buluşuyoruz?</p>
      <div className="flex gap-8 justify-center mb-5">
        {[{e:"📍",l:"MEKAN",v:"Çırağan Sarayı"},{e:"🕐",l:"SAAT",v:"18:00"},{e:"📅",l:"TARİH",v:"06 Haz 2026"}].map(col=>(
          <div key={col.l} className="text-center">
            <p style={{ fontSize:18, marginBottom:6 }}>{col.e}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.2em", color:N.GOLD, marginBottom:4 }}>{col.l}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, fontWeight:600, color:N.CREAM }}>{col.v}</p>
          </div>
        ))}
      </div>
      <div style={{ width:"85%", height:80, borderRadius:10, background:"rgba(255,255,255,0.06)", border:`1px solid ${N.GOLD}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, color:`${N.GOLD}50`, fontStyle:"italic" }}>📍 Harita görünümü</p>
      </div>
    </div>
  );
}
function NisanAnilar() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center"
      style={{ background:`linear-gradient(180deg,${N.BG} 0%,${N.BG_DARK} 100%)` }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.35em", color:N.GOLD, marginBottom:10 }}>BİZİM HİKAYEMİZ</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.4rem,5vw,2rem)", color:N.CREAM, marginBottom:18 }}>En Güzel Anılar</p>
      <div style={{ height:1, background:`linear-gradient(to right,transparent,${N.GOLD}40,transparent)`, width:140, marginBottom:24 }}/>
      <div style={{ position:"relative", width:210, height:180 }}>
        {[{t:10,l:-24,r:-9},{t:18,l:28,r:5},{t:2,l:68,r:-3}].map((p,i)=>(
          <div key={i} style={{ position:"absolute", top:p.t, left:p.l, background:"#fff", borderRadius:3, padding:"7px 7px 22px", transform:`rotate(${p.r}deg)`, boxShadow:"0 6px 20px rgba(0,0,0,0.45)", width:116 }}>
            <div style={{ width:"100%", height:96, background:`linear-gradient(135deg,${N.BG_MED},#6B1828)`, borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:26, opacity:0.2 }}>📷</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PREMIUM ÖNİZLEMELER — Düğün Lüks
══════════════════════════════════════════════ */
const D = { BG:"#0D1F3C", BG_MED:"#152C52", BG_DARK:"#071228", GOLD:"#D4AA70", CREAM:"#F8F3EE" };

function DugunKapak() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse at 50% 45%,#1E3A6E 0%,${D.BG} 55%,${D.BG_DARK} 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,rgba(212,170,112,0.06) 1px,transparent 1px)`, backgroundSize:"22px 22px" }}/>
      <p className="relative z-10 text-center mb-6" style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2.2rem)", color:D.CREAM, lineHeight:1.2 }}>
        Selin <span style={{ color:D.GOLD }}>&amp;</span> Mert
      </p>
      <div className="relative z-10" style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 6px ${D.BG},0 0 0 8px rgba(212,170,112,0.2),0 12px 36px rgba(0,6,20,0.7)` }}>
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
          background:`radial-gradient(circle at 38% 34%,#1E3A6E 0%,${D.BG} 50%,${D.BG_DARK} 100%)` }}>
          <svg viewBox="0 0 200 200" style={{ width:"80%", height:"80%" }} fill="none">
            <circle cx="80" cy="112" r="36" stroke={D.GOLD} strokeWidth="7" fill="none" opacity="0.9"/>
            <circle cx="120" cy="112" r="36" stroke={D.GOLD} strokeWidth="7" fill="none" opacity="0.9"/>
            <polygon points="100,46 114,63 100,77 86,63" fill={D.GOLD} opacity="0.88"/>
            <polygon points="100,46 114,63 100,57 86,63" fill="rgba(255,255,255,0.22)"/>
          </svg>
        </div>
      </div>
      <p className="relative z-10 mt-6" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:12, letterSpacing:"0.3em", color:D.GOLD }}>12 EYLÜL 2026</p>
      <p className="relative z-10 mt-2" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, fontStyle:"italic", color:`${D.GOLD}55` }}>Mühüre dokun ◆</p>
    </div>
  );
}
function DugunHero() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 relative"
      style={{ background:`radial-gradient(ellipse at 50% 30%,#1E3A6E 0%,${D.BG} 60%)` }}>
      {["top-4 left-4","top-4 right-4","bottom-4 left-4","bottom-4 right-4"].map((c,i)=>(
        <span key={i} className={`absolute ${c}`} style={{ color:`${D.GOLD}40`, fontSize:12 }}>◆</span>
      ))}
      <div className="w-full text-center py-6 px-5" style={{ border:`1px solid ${D.GOLD}30`, borderRadius:4, position:"relative" }}>
        {[{top:-6,left:-6},{top:-6,right:-6},{bottom:-6,left:-6},{bottom:-6,right:-6}].map((pos,i)=>(
          <div key={i} style={{ position:"absolute",...pos, width:12, height:12, transform:"rotate(45deg)", background:D.GOLD, opacity:0.65 }}/>
        ))}
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.3em", color:D.GOLD, marginBottom:12 }}>DÜĞÜN DAVETİYESİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.8rem,6vw,2.5rem)", color:D.CREAM, lineHeight:1 }}>Selin</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,3vw,1.3rem)", color:D.GOLD, lineHeight:1.4 }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.8rem,6vw,2.5rem)", color:D.CREAM, lineHeight:1, marginBottom:10 }}>Mert</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${D.GOLD}50,transparent)`, margin:"10px 0" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.12em", color:`${D.CREAM}60` }}>12 EYLÜL 2026 · İSTANBUL</p>
      </div>
    </div>
  );
}
function DugunSayim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center" style={{ background:D.BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.35em", color:D.GOLD, marginBottom:12 }}>DÜĞÜNE KALAN SÜRE</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2rem)", color:D.CREAM, marginBottom:28 }}>Sayıyoruz...</p>
      <div className="flex items-start gap-3 justify-center">
        {[{v:"136",l:"GÜN"},{v:"14",l:"SAAT"},{v:"28",l:"DAK"},{v:"51",l:"SAN"}].map((item,i)=>(
          <div key={i} className="flex items-start gap-2">
            <div className="text-center">
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"clamp(1.8rem,6vw,2.6rem)", fontWeight:600, color:D.CREAM, lineHeight:1 }}>{item.v}</p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.15em", color:D.GOLD, marginTop:5 }}>{item.l}</p>
            </div>
            {i<3 && <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"1.5rem", color:`${D.GOLD}40`, lineHeight:1.1, marginTop:2 }}>:</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
function DugunMekan() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center" style={{ background:D.BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.35em", color:D.GOLD, marginBottom:10 }}>MEKAN</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.3rem,5vw,1.8rem)", color:D.CREAM, marginBottom:20 }}>Nerede Buluşuyoruz?</p>
      <div className="flex gap-8 justify-center mb-5">
        {[{e:"📍",l:"MEKAN",v:"Four Seasons"},{e:"🕐",l:"SAAT",v:"19:00"},{e:"📅",l:"TARİH",v:"12 Eyl 2026"}].map(col=>(
          <div key={col.l} className="text-center">
            <p style={{ fontSize:18, marginBottom:6 }}>{col.e}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.2em", color:D.GOLD, marginBottom:4 }}>{col.l}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, fontWeight:600, color:D.CREAM }}>{col.v}</p>
          </div>
        ))}
      </div>
      <div style={{ width:"85%", height:80, borderRadius:10, background:"rgba(255,255,255,0.06)", border:`1px solid ${D.GOLD}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, color:`${D.GOLD}50`, fontStyle:"italic" }}>📍 Harita görünümü</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PREMIUM ÖNİZLEMELER — Doğum Günü Lüks
══════════════════════════════════════════════ */
const G = { BG:"#140828", BG_MED:"#1E0C38", BG_DARK:"#0A0414", GOLD:"#D4A84B", CREAM:"#F9F3E8", PL:"#5A2090" };

function DGKapak() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse at 50% 45%,${G.PL} 0%,${G.BG} 55%,${G.BG_DARK} 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,rgba(212,168,75,0.05) 1px,transparent 1px)`, backgroundSize:"22px 22px" }}/>
      <p className="relative z-10 text-center mb-6" style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2.2rem)", color:G.CREAM, lineHeight:1.2 }}>Zeynep</p>
      <div className="relative z-10" style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 6px ${G.BG},0 0 0 8px rgba(212,168,75,0.2),0 12px 36px rgba(10,0,20,0.7)` }}>
        <svg viewBox="0 0 200 200" style={{ width:"100%", height:"100%" }} fill="none">
          <circle cx="100" cy="100" r="100" fill={G.BG_DARK}/><circle cx="100" cy="100" r="96" stroke={`${G.GOLD}22`} strokeWidth="1"/>
          <rect x="44" y="126" width="112" height="38" rx="7" fill={G.PL} opacity="0.75"/><rect x="44" y="118" width="112" height="11" rx="5" fill={G.GOLD} opacity="0.55"/>
          <rect x="62" y="90" width="76" height="30" rx="6" fill={G.PL} opacity="0.9"/><rect x="62" y="83" width="76" height="10" rx="5" fill={G.GOLD} opacity="0.65"/>
          {[80,100,120].map((x,i)=>(
            <g key={i}>
              <rect x={x-3.5} y={i===1?62:67} width="7" height={i===1?24:19} rx="2" fill={`${G.CREAM}CC`}/>
              <ellipse cx={x} cy={i===1?58:63} rx="5" ry="7" fill="#FFD060" opacity="0.9"/>
              <ellipse cx={x} cy={i===1?60:65} rx="2.5" ry="4" fill="#fff" opacity="0.4"/>
            </g>
          ))}
        </svg>
      </div>
      <p className="relative z-10 mt-6" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:12, letterSpacing:"0.3em", color:G.GOLD }}>15 AĞUSTOS 2026</p>
      <p className="relative z-10 mt-2" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, fontStyle:"italic", color:`${G.GOLD}55` }}>Mühüre dokun ★</p>
    </div>
  );
}
function DGHero() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 relative"
      style={{ background:`radial-gradient(ellipse at 50% 30%,${G.PL} 0%,${G.BG} 60%)` }}>
      {["top-4 left-4","top-4 right-4","bottom-4 left-4","bottom-4 right-4"].map((c,i)=>(
        <span key={i} className={`absolute ${c}`} style={{ color:`${G.GOLD}40`, fontSize:13 }}>★</span>
      ))}
      <div className="w-full text-center py-6 px-5" style={{ border:`1px solid ${G.GOLD}30`, borderRadius:6, position:"relative" }}>
        {[{top:-8,left:-8},{top:-8,right:-8},{bottom:-8,left:-8},{bottom:-8,right:-8}].map((pos,i)=>(
          <div key={i} style={{ position:"absolute",...pos, width:3, height:16, background:G.GOLD, opacity:0.5 }}/>
        ))}
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.3em", color:G.GOLD, marginBottom:12 }}>DOĞUM GÜNÜ DAVETİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.8rem,6vw,2.5rem)", color:G.CREAM, lineHeight:1.1, marginBottom:10 }}>Zeynep</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${G.GOLD}50,transparent)`, margin:"10px 0" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.12em", color:`${G.CREAM}60` }}>15 AĞUSTOS 2026 · İSTANBUL</p>
      </div>
    </div>
  );
}
function DGSayim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center" style={{ background:G.BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.35em", color:G.GOLD, marginBottom:12 }}>PARTİYE KALAN SÜRE</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2rem)", color:G.CREAM, marginBottom:28 }}>Sayıyoruz...</p>
      <div className="flex items-start gap-3 justify-center">
        {[{v:"108",l:"GÜN"},{v:"08",l:"SAAT"},{v:"42",l:"DAK"},{v:"17",l:"SAN"}].map((item,i)=>(
          <div key={i} className="flex items-start gap-2">
            <div className="text-center">
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"clamp(1.8rem,6vw,2.6rem)", fontWeight:600, color:G.CREAM, lineHeight:1 }}>{item.v}</p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.15em", color:G.GOLD, marginTop:5 }}>{item.l}</p>
            </div>
            {i<3 && <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"1.5rem", color:`${G.GOLD}40`, lineHeight:1.1, marginTop:2 }}>:</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
function DGMekan() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center" style={{ background:G.BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.35em", color:G.GOLD, marginBottom:10 }}>MEKAN</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.3rem,5vw,1.8rem)", color:G.CREAM, marginBottom:20 }}>Nerede Buluşuyoruz?</p>
      <div className="flex gap-8 justify-center mb-5">
        {[{e:"📍",l:"MEKAN",v:"Çırağan Palace"},{e:"🕐",l:"SAAT",v:"20:00"},{e:"📅",l:"TARİH",v:"15 Ağu 2026"}].map(col=>(
          <div key={col.l} className="text-center">
            <p style={{ fontSize:18, marginBottom:6 }}>{col.e}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.2em", color:G.GOLD, marginBottom:4 }}>{col.l}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, fontWeight:600, color:G.CREAM }}>{col.v}</p>
          </div>
        ))}
      </div>
      <div style={{ width:"85%", height:80, borderRadius:10, background:"rgba(255,255,255,0.04)", border:`1px solid ${G.GOLD}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, color:`${G.GOLD}50`, fontStyle:"italic" }}>📍 Harita görünümü</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PREMIUM ÖNİZLEMELER — Vintage Nişan
══════════════════════════════════════════════ */
const V = {
  BG:"#FAF7EE", BG_SOFT:"#F0E8D8", BG_CARD:"#FEFCF8",
  DUSK:"#110820", SHADOW:"#1C1030",
  GOLD:"#C9A840", GOLD_LT:"#E8D070",
  WARM:"#2A1808", WARM_MD:"#6B3E18",
  LILAC:"#7A52A0", LILAC_LT:"#CCB0E8",
  PETAL:"#C07888", PETAL_LT:"#E0AABC",
};

function VintageKapak() {
  const [sealFailed, setSealFailed] = useState(false);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background:`radial-gradient(ellipse 80% 70% at 50% 50%, #FFFDF9 0%, #F2EAE0 100%)` }}>
      <div style={{ position:"absolute", top:0, left:0, width:120, height:120, borderRadius:"50%", background:`radial-gradient(${V.GOLD}12, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:0, right:0, width:100, height:100, borderRadius:"50%", background:`radial-gradient(${V.PETAL}0C, transparent 65%)`, pointerEvents:"none" }} />

      {/* "Nişan Davetiyesi" — çizgili başlık */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, zIndex:1 }}>
        <div style={{ width:36, height:"0.5px", background:`linear-gradient(to left,${V.GOLD}55,transparent)` }}/>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.42em", color:V.GOLD, textTransform:"uppercase" }}>Nişan Davetiyesi</p>
        <div style={{ width:36, height:"0.5px", background:`linear-gradient(to right,${V.GOLD}55,transparent)` }}/>
      </div>

      {/* İsimler */}
      <div style={{ textAlign:"center", zIndex:1, marginBottom:12 }}>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:V.WARM, lineHeight:1.1 }}>Selin</p>
        <p style={{ fontFamily:"var(--font-lora),serif", fontStyle:"italic", fontSize:"clamp(0.75rem,2.8vw,1rem)", color:`${V.GOLD}CC`, lineHeight:1, margin:"3px 0" }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:V.WARM, lineHeight:1.1 }}>Emre</p>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:7, letterSpacing:"0.20em", color:`${V.WARM_MD}80`, textTransform:"uppercase", marginTop:7 }}>Kaya &amp; Demir Aileleri</p>
      </div>

      {/* Gerçek wax-seal.png */}
      <div style={{ width:90, height:90, zIndex:1, filter:"drop-shadow(0 6px 20px rgba(42,24,8,0.18))" }}>
        {!sealFailed ? (
          <img src="/wax-seal.png" alt="" style={{ width:"100%", height:"100%", objectFit:"contain" }}
            onError={() => setSealFailed(true)} />
        ) : (
          <div style={{ width:"100%", height:"100%", borderRadius:"50%",
            background:`radial-gradient(circle at 38% 35%, ${V.GOLD_LT}cc, ${V.GOLD})`,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="20" height="18" viewBox="0 0 32 28" fill="none">
              <path d="M16 24 C16 18 10 12 6 8 C10 6 16 10 16 16 C16 10 22 6 26 8 C22 12 16 18 16 24Z" fill="rgba(255,253,249,0.9)"/>
            </svg>
          </div>
        )}
      </div>

      {/* Mühüre Dokun — line flanked */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12, zIndex:1 }}>
        <div style={{ width:28, height:"0.5px", background:`linear-gradient(to left,${V.GOLD}70,transparent)` }}/>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:9, fontStyle:"italic", fontWeight:700, color:V.GOLD, letterSpacing:"0.22em" }}>Mühüre Dokun</p>
        <div style={{ width:28, height:"0.5px", background:`linear-gradient(to right,${V.GOLD}70,transparent)` }}/>
      </div>

      <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.16em", color:`${V.WARM}45`, marginTop:8, zIndex:1 }}>12 TEMMUZ 2026</p>
    </div>
  );
}

function VintageHero() {
  return (
    <div className="w-full h-full relative overflow-hidden select-none" style={{ background:"#060010" }}>
      {/* Video placeholder — koyu degrade arka plan */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,#0d0020 0%,#1a0535 40%,#0a0018 100%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 40%, transparent 100%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 65% 55% at 50% 48%, rgba(80,30,120,0.22) 0%, transparent 70%)", pointerEvents:"none" }}/>

      {/* İsimler + tarih — video üstünde, ortada */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"0 20px", zIndex:1 }}>
        <div style={{ display:"inline-block", background:"rgba(0,0,0,0.38)", backdropFilter:"blur(6px)", padding:"4px 14px 4px 16px", borderRadius:20, marginBottom:14 }}>
          <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.42em", color:"rgba(255,255,255,0.95)", textTransform:"uppercase" }}>Nişan Davetiyesi</p>
        </div>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(2rem,7vw,2.8rem)", color:"#FFFFFF", lineHeight:0.92, textShadow:"0 2px 30px rgba(0,0,0,0.95)" }}>Selin</p>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1rem,3.5vw,1.4rem)", color:V.PETAL_LT, lineHeight:1.2, textShadow:"0 1px 12px rgba(0,0,0,0.9)" }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(2rem,7vw,2.8rem)", color:"#FFFFFF", lineHeight:0.92, marginBottom:12, textShadow:"0 2px 30px rgba(0,0,0,0.95)" }}>Emre</p>
        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, margin:"8px 0", width:"80%" }}>
          <div style={{ flex:1, height:"0.5px", background:`linear-gradient(to right,transparent,${V.PETAL_LT}55)` }}/>
          <div style={{ width:5, height:5, borderRadius:"50%", background:V.PETAL_LT, opacity:0.65 }}/>
          <div style={{ flex:1, height:"0.5px", background:`linear-gradient(to left,transparent,${V.PETAL_LT}55)` }}/>
        </div>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:9, color:"rgba(255,255,255,0.72)", letterSpacing:"0.1em" }}>12 Temmuz 2026 · Swissôtel</p>
      </div>

      {/* Scroll chevronları — alt kısımda */}
      <div style={{ position:"absolute", bottom:16, left:0, right:0, display:"flex", flexDirection:"column", alignItems:"center", gap:0, zIndex:1 }}>
        <p style={{ fontFamily:"var(--font-lora),serif", fontStyle:"italic", fontWeight:700, fontSize:9, letterSpacing:"0.28em", color:V.GOLD, marginBottom:4, textShadow:"0 1px 10px rgba(0,0,0,0.9)" }}>kaydır</p>
        {[0,1,2].map(i=>(
          <svg key={i} width="20" height="12" viewBox="0 0 28 16" fill="none" style={{ display:"block", opacity: 1 - i*0.25 }}>
            <path d="M2 2L14 13L26 2" stroke={V.GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ))}
      </div>
    </div>
  );
}

function VintageDetaylar() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background:V.SHADOW }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(90,50,140,0.14) 0%, transparent 70%)", pointerEvents:"none" }}/>
      {/* Wisteria silüet */}
      <div style={{ position:"absolute", top:0, left:0, opacity:0.1 }}>
        <svg width="50" height="110" viewBox="0 0 140 280" fill="none">
          <path d="M40 0 C42 30 36 62 40 94 C44 124 38 154 40 184 C42 214 38 248 40 280" stroke="#5A8A62" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="96" cy="17" rx="5" ry="9" fill="#B490D8" opacity="0.8"/>
          <ellipse cx="88" cy="25" rx="4.5" ry="8" fill="#CCB0E8" opacity="0.7"/>
          <ellipse cx="103" cy="26" rx="4" ry="7.5" fill="#9E72C4" opacity="0.6"/>
        </svg>
      </div>
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 20px" }}>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.44em", color:`${V.GOLD}80`, textTransform:"uppercase", marginBottom:14 }}>Etkinlik Detayları</p>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1.6rem,5.5vw,2.4rem)", color:V.GOLD_LT, lineHeight:1, marginBottom:14 }}>12 Temmuz 2026</p>
        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, margin:"10px auto", maxWidth:140 }}>
          <div style={{ flex:1, height:"0.5px", background:`linear-gradient(to right,transparent,${V.GOLD}55)` }}/>
          <div style={{ width:5, height:5, borderRadius:"50%", border:`1px solid ${V.GOLD}60`, background:"transparent" }}/>
          <div style={{ flex:1, height:"0.5px", background:`linear-gradient(to left,transparent,${V.GOLD}55)` }}/>
        </div>
        {/* Saat / Mekan */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:20, marginTop:12 }}>
          <div style={{ textAlign:"center" }}>
            <p style={{ fontFamily:"var(--font-lora),serif", fontSize:7, letterSpacing:"0.34em", color:`${V.GOLD}65`, textTransform:"uppercase", marginBottom:6 }}>Saat</p>
            <p style={{ fontFamily:"var(--font-playfair),serif", fontSize:"clamp(1.4rem,4.5vw,2rem)", color:"#FEFCF8", lineHeight:1 }}>18:30</p>
          </div>
          <div style={{ width:1, alignSelf:"stretch", minHeight:40, background:`${V.GOLD}22` }}/>
          <div style={{ textAlign:"center", maxWidth:100 }}>
            <p style={{ fontFamily:"var(--font-lora),serif", fontSize:7, letterSpacing:"0.34em", color:`${V.GOLD}65`, textTransform:"uppercase", marginBottom:6 }}>Mekan</p>
            <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(0.85rem,3vw,1.1rem)", color:"#FEFCF8", lineHeight:1.2 }}>Swissôtel İstanbul</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VintageSayim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5 text-center relative overflow-hidden select-none"
      style={{ background:V.DUSK }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 65% 55% at 50% 50%, rgba(80,40,130,0.16) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1 }}>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.44em", color:`${V.GOLD}75`, textTransform:"uppercase", marginBottom:10 }}>Nişana Kalan Süre</p>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1.2rem,4vw,1.6rem)", color:"#FEFCF8", marginBottom:22 }}>Sayıyoruz...</p>
        <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:"clamp(6px,2.5vw,12px)" }}>
          {[{v:"55",l:"GÜN"},{v:"12",l:"SAAT"},{v:"38",l:"DAK"},{v:"07",l:"SAN"}].map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"clamp(4px,1.5vw,10px)" }}>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontFamily:"var(--font-playfair),serif", fontSize:"clamp(1.6rem,5vw,2.2rem)", fontWeight:600, color:V.GOLD_LT, lineHeight:1, textShadow:`0 0 24px ${V.GOLD}55` }}>{item.v}</p>
                <p style={{ fontFamily:"var(--font-lora),serif", fontSize:7, letterSpacing:"0.16em", color:`${V.GOLD}70`, marginTop:4 }}>{item.l}</p>
              </div>
              {i<3 && <p style={{ fontFamily:"var(--font-playfair),serif", fontSize:"1.2rem", color:`${V.GOLD}50`, lineHeight:1.1, marginTop:2 }}>:</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VintageKatilim() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 relative" style={{ background:V.BG }}>
      <div className="w-full rounded-2xl p-5" style={{ background:V.BG_CARD, boxShadow:`0 8px 32px rgba(42,24,8,0.08)`, border:`1px solid ${V.GOLD}20` }}>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.36em", color:V.GOLD, textAlign:"center", marginBottom:6, textTransform:"uppercase" }}>Katılım Bildirimi</p>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1.1rem,4vw,1.5rem)", color:V.WARM, textAlign:"center", marginBottom:12 }}>Gelecek misiniz?</p>
        <div style={{ height:"0.5px", background:`linear-gradient(to right,transparent,${V.GOLD}45,transparent)`, marginBottom:12 }}/>
        {["Adınız Soyadınız","🎵 Şarkı dileğiniz","💬 Not"].map(lbl=>(
          <div key={lbl} style={{ marginBottom:10 }}>
            <p style={{ fontFamily:"var(--font-lora),serif", fontSize:7, letterSpacing:"0.2em", color:`${V.WARM_MD}80`, marginBottom:5 }}>{lbl}</p>
            <div style={{ height:"0.5px", background:`${V.GOLD}30` }}/>
          </div>
        ))}
        <div style={{ marginTop:14, padding:"8px", background:`linear-gradient(135deg,${V.GOLD},${V.GOLD}cc)`, borderRadius:8, textAlign:"center", fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.28em", color:"#FEFCF8" }}>BİLDİR</div>
      </div>
    </div>
  );
}

function VintageMekan() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center relative overflow-hidden select-none"
      style={{ background:V.SHADOW }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(90,50,140,0.12) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:1, width:"100%" }}>
        <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.4em", color:`${V.GOLD}80`, marginBottom:6, textTransform:"uppercase" }}>Konum</p>
        <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1.1rem,4vw,1.5rem)", color:"#FEFCF8", marginBottom:14 }}>Swissôtel İstanbul</p>
        <div style={{ height:"0.5px", background:`linear-gradient(to right,transparent,${V.GOLD}40,transparent)`, marginBottom:14 }}/>
        {/* Harita placeholder */}
        <div style={{ width:"90%", margin:"0 auto", height:72, borderRadius:10, background:"rgba(201,168,64,0.06)", border:`1px solid ${V.GOLD}22`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <p style={{ fontFamily:"var(--font-lora),serif", fontSize:9, color:`${V.GOLD}45`, fontStyle:"italic" }}>📍 Harita görünümü</p>
        </div>
      </div>
    </div>
  );
}

function VintageAnilar() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center relative overflow-hidden select-none"
      style={{ background:V.BG_SOFT }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 40% at 50% 100%, rgba(201,168,64,0.07) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <p style={{ fontFamily:"var(--font-lora),serif", fontSize:8, letterSpacing:"0.4em", color:V.LILAC, textTransform:"uppercase", marginBottom:8, zIndex:1 }}>Bizim Hikayemiz</p>
      <p style={{ fontFamily:"var(--font-playfair),serif", fontStyle:"italic", fontSize:"clamp(1.1rem,4vw,1.6rem)", color:V.WARM, marginBottom:18, zIndex:1 }}>En Güzel Anlar</p>
      {/* Polaroid kartlar */}
      <div style={{ position:"relative", width:210, height:150, zIndex:1 }}>
        {[{t:20,l:-10,r:-9},{t:8,l:52,r:-2},{t:18,l:112,r:7}].map((p,i)=>(
          <div key={i} style={{ position:"absolute", top:p.t, left:p.l, background:V.BG_CARD, borderRadius:3, padding:"5px 5px 18px", transform:`rotate(${p.r}deg)`, boxShadow:`0 6px 20px rgba(42,24,8,0.18)`, width:100 }}>
            <div style={{ width:"100%", height:78, background:`linear-gradient(135deg,${V.BG_SOFT},${V.BG})`, borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:20, opacity:0.22 }}>📷</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STANDART ÖNİZLEME — kart içi telefon için
══════════════════════════════════════════════ */
function StdKapak({ sablon }: { sablon: Sablon }) {
  const r = sablon.renk;
  const emoji = KAT_EMOJI[sablon.kategori] ?? "✨";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`linear-gradient(145deg,#fff 0%,${r}12 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,${r}14 1px,transparent 1px)`, backgroundSize:"20px 20px" }}/>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:r }}/>
      <div style={{ position:"absolute", inset:16, border:`1px solid ${r}20`, borderRadius:4 }}/>
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
        <span style={{ fontSize:42 }}>{emoji}</span>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"1.8rem", color:"#1a1a1a", lineHeight:1.15 }}>
          Ad <span style={{ color:r }}>&amp;</span> Soyad
        </p>
        <div style={{ width:44, height:1.5, background:r, borderRadius:2 }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:12, letterSpacing:"0.14em", color:"#999" }}>GÜN · AY · YIL</p>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:12, color:"#bbb" }}>Mekan Adı</p>
        <div style={{ padding:"5px 18px", borderRadius:20, border:`1px solid ${r}35`, color:r, fontSize:11, fontWeight:700, letterSpacing:"0.06em" }}>{sablon.isim}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BÖLÜM TANIMLARI
══════════════════════════════════════════════ */
const VINTAGE_BOLUMLER = [
  { id:"kapak",    icon:"🌿", label:"Kapak",    etiket:"Açılış", baslik:"Altın Mühürlü Kapak",    aciklama:"Altın balmumu mühürüne dokunulunca açılan krem & botanik kapak.",  node:<VintageKapak/> },
  { id:"video",    icon:"🎬", label:"Video",    etiket:"Hero",   baslik:"Sinematik Video Hero",   aciklama:"Tam ekran arka plan videosu üzerinde isimler ve tarih bilgisi.",    node:<VintageHero/> },
  { id:"detaylar", icon:"✨", label:"Detaylar", etiket:"Gece",   baslik:"Gece Lüks Etkinlik",     aciklama:"Koyu zemin üzerinde altın tonlu saat, mekan ve Google Harita.",     node:<VintageDetaylar/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",             aciklama:"Nişana kalan süreyi saniye saniye altın tonlarında gösterir.",      node:<VintageSayim/> },
  { id:"katilim",  icon:"💌", label:"Katılım",  etiket:"RSVP",   baslik:"Vintage Katılım Formu",  aciklama:"Krem kart içinde altın vurgulu RSVP formu.",                       node:<VintageKatilim/> },
  { id:"anilar",   icon:"📷", label:"Anılar",   etiket:"Galeri", baslik:"Polaroid Galeri",        aciklama:"Fotoğraflar polaroid tarzında üst üste, krem zemin üzerinde.",     node:<VintageAnilar/> },
] as const;

const NISAN_BOLUMLER = [
  { id:"kapak",    icon:"🌹", label:"Kapak",    etiket:"Açılış", baslik:"Gül Mühürlü Kapak",    aciklama:"Mühüre dokunulunca açılan bordo & altın kapak.",     node:<NisanKapak/> },
  { id:"davetiye", icon:"💍", label:"Davetiye", etiket:"Hero",   baslik:"Kemer Çerçeveli Hero",  aciklama:"İsimler el yazısıyla kemer çerçeve içinde gösterilir.", node:<NisanHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",            aciklama:"Nişana kaç gün kaldığını saniye saniye gösterir.",     node:<NisanSayim/> },
  { id:"katilim",  icon:"💌", label:"Katılım",  etiket:"RSVP",   baslik:"Katılım Formu",         aciklama:"Misafirler kişi sayısını ve katılım durumunu bildirir.", node:<NisanKatilim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",        aciklama:"Mekan, saat ve tarih. Google Maps bağlantılı harita.",  node:<NisanMekan/> },
  { id:"anilar",   icon:"📷", label:"Anılar",   etiket:"Galeri", baslik:"Polaroid Galeri",       aciklama:"Fotoğraflar polaroid tarzında, üst üste binmiş şekilde.", node:<NisanAnilar/> },
] as const;

const DUGUN_BOLUMLER = [
  { id:"kapak",    icon:"💍", label:"Kapak",    etiket:"Açılış", baslik:"Yüzük Mühürlü Kapak",  aciklama:"Yüzük mühürüne dokunulunca açılan lacivert kapak.",  node:<DugunKapak/> },
  { id:"davetiye", icon:"🌟", label:"Davetiye", etiket:"Hero",   baslik:"Elmas Köşeli Hero",     aciklama:"Altın elmas köşeli çerçeve içinde isimler.",           node:<DugunHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",            aciklama:"Düğüne kaç gün kaldığını saniye saniye gösterir.",     node:<DugunSayim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",        aciklama:"Mekan, saat ve tarih. Google Maps bağlantılı harita.",  node:<DugunMekan/> },
] as const;

const DOGUMGUNU_BOLUMLER = [
  { id:"kapak",    icon:"🎂", label:"Kapak",    etiket:"Açılış", baslik:"Pasta Mühürlü Kapak",   aciklama:"Altın pasta mühürüne dokunulunca açılan derin mor kapak.", node:<DGKapak/> },
  { id:"davetiye", icon:"✨", label:"Davetiye", etiket:"Hero",   baslik:"Yıldız Köşeli Hero",    aciklama:"İsim büyük el yazısıyla yıldız köşeli çerçeve içinde.", node:<DGHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",            aciklama:"Partiye kaç gün kaldığını saniye saniye gösterir.",     node:<DGSayim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",        aciklama:"Mekan, saat ve tarih. Google Maps bağlantılı harita.",   node:<DGMekan/> },
] as const;

type Bolum = { id:string; icon:string; label:string; etiket:string; baslik:string; aciklama:string; node:React.ReactNode };

/* ══════════════════════════════════════════════
   PREMIUM OZELLIKLER — icon + başlık + açıklama
══════════════════════════════════════════════ */
const PREMIUM_OZELLIKLER: Record<string, { icon: string; baslik: string; aciklama: string }[]> = {
  "vintage-nisan": [
    { icon: "🌿", baslik: "Botanik Mum Mühürü",    aciklama: "Dokunulunca açılan mum mühürlü kapak animasyonu" },
    { icon: "🎬", baslik: "Video Açılış Sahnesi",  aciklama: "Mühür açılışına eşlik eden video; isimleri overlay'de sunar" },
    { icon: "🎵", baslik: "Arka Plan Müziği",       aciklama: "Video bitiminde otomatik başlayan altın müzik çalar" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",       aciklama: "Nişana kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",    aciklama: "Google Maps bağlantılı mekan kartı" },
    { icon: "📷", baslik: "Polaroid Galeri",        aciklama: "3 fotoğraf vintage polaroid çerçevesinde sergilenir" },
    { icon: "👗", baslik: "Dress Code Bölümü",      aciklama: "Renk paletiyle kıyafet kodu sahnesi" },
    { icon: "✅", baslik: "RSVP + Şarkı Dileği",   aciklama: "Katılım bildirimi ve müzik isteği formu" },
  ],
  "nisan-luks": [
    { icon: "🌹", baslik: "Gül Mühürlü Kapak",   aciklama: "Dokunulunca açılan zarif kapak animasyonu" },
    { icon: "💛", baslik: "Altın & Bordo Tema",   aciklama: "El işi özel renk paleti ve tipografi" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",     aciklama: "Nişana kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",  aciklama: "Google Maps bağlantılı mekan kartı" },
    { icon: "📷", baslik: "Polaroid Galeri",      aciklama: "Fotoğraflar vintage polaroid tarzında" },
    { icon: "✅", baslik: "RSVP + Şarkı Dileği", aciklama: "Kişi sayısı, katılım ve müzik isteği" },
  ],
  "dugun-luks": [
    { icon: "💍", baslik: "Yüzük Mühürlü Kapak", aciklama: "Yüzük ikonlu özel açılış animasyonu" },
    { icon: "✨", baslik: "Lacivert & Altın Tema", aciklama: "Elmas köşeli çerçeve, ince altın detaylar" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",     aciklama: "Düğüne kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",  aciklama: "Google Maps bağlantılı mekan kartı" },
  ],
  "dogumgunu-luks": [
    { icon: "🎂", baslik: "Pasta Mühürlü Kapak", aciklama: "Pasta ikonlu dokunmatik açılış animasyonu" },
    { icon: "⭐", baslik: "Mor & Altın Tema",     aciklama: "Yıldız köşeli çerçeve, doğum günü atmosferi" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",     aciklama: "Partiye kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",  aciklama: "Google Maps bağlantılı mekan kartı" },
  ],
};

/* ══════════════════════════════════════════════
   PREMIUM KART — Showcase (yeniden tasarım)
══════════════════════════════════════════════ */
function PremiumKart({ sablon }: { sablon: Sablon }) {
  const router   = useRouter();
  const demoUrl  = DEMO_URLS[sablon.id];
  const ozellikler = PREMIUM_OZELLIKLER[sablon.id] ?? [];

  const darkBg       = sablon.id === "vintage-nisan" ? "#110820" : sablon.id === "nisan-luks" ? "#120308" : sablon.id === "dugun-luks" ? "#050d1a" : "#080315";
  const accent       = sablon.id === "vintage-nisan" ? "#C9A840" : sablon.id === "nisan-luks" ? "#C4A05A" : sablon.id === "dugun-luks" ? "#D4AA70" : "#D4A84B";
  const glowRgb      = sablon.id === "vintage-nisan" ? "201,168,64" : sablon.id === "nisan-luks" ? "196,160,90" : sablon.id === "dugun-luks" ? "212,170,112" : "212,168,75";
  const goldGradient = "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)";
  const goldShadow   = `0 4px 24px rgba(${glowRgb},0.45)`;

  /* iframe ölçekleme: TelefonMockup iç ekran 240×500px (260 - 2×10px padding, height:500)
     transform+negatif margin: layout boyutunu görsel boyuta eşitler → iOS Safari'de de çalışır
     (zoom iOS Safari'de iframe viewport'unu etkilemez) */
  const PHONE_W = 240;
  const PHONE_H = 500;
  const RENDER_W = 390;
  const iframeScale = PHONE_W / RENDER_W;
  const iframeH = Math.round(PHONE_H / iframeScale);
  const iframeMR = Math.round(RENDER_W * (1 - iframeScale));  // negatif margin-right
  const iframeMB = Math.round(iframeH * (1 - iframeScale));   // negatif margin-bottom

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{
        opacity: 1, y: 0,
        boxShadow: [
          `0 0 0 1px rgba(${glowRgb},0.12), 0 24px 80px rgba(0,0,0,0.6)`,
          `0 0 0 1.5px rgba(${glowRgb},0.55), 0 24px 80px rgba(0,0,0,0.6), 0 0 48px rgba(${glowRgb},0.16)`,
          `0 0 0 1px rgba(${glowRgb},0.12), 0 24px 80px rgba(0,0,0,0.6)`,
        ],
      }}
      transition={{ opacity: { duration: 0.4 }, y: { duration: 0.4 }, boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 } }}
      style={{ background: darkBg, borderRadius: 28, overflow: "hidden" }}
    >
      {/* Altın üst şerit */}
      <div style={{ height: 2, background: goldGradient }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 sm:px-8 pt-6 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <motion.span
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full"
              style={{ background: `rgba(${glowRgb},0.12)`, color: accent, border: `1px solid rgba(${glowRgb},0.28)`, letterSpacing: "0.15em" }}
            >
              ✦ PREMIUM
            </motion.span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
              {KAT_EMOJI[sablon.kategori]} {sablon.kategori.charAt(0).toUpperCase() + sablon.kategori.slice(1)}
            </span>
            {(SABLON_ETIKETLER[sablon.id] ?? []).filter(t => t !== "Lüks").map(etiket => {
              const s = ETIKET_STILI[etiket];
              return (
                <span key={etiket} className="text-[11px] px-2.5 py-0.5 rounded-full"
                  style={{ background: `${s.bg}20`, color: s.color, border: `1px solid ${s.border}55` }}>
                  {etiket}
                </span>
              );
            })}
          </div>
          <h2 className="font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", letterSpacing: "-0.01em" }}>
            {sablon.isim}
          </h2>
          {sablon.aciklama && (
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.32)" }}>{sablon.aciklama}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold tabular-nums"
            style={{ background: goldGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            +₺100
          </p>
          <p className="text-[9px] font-bold tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>TEK SEFERLİK</p>
        </div>
      </div>

      {/* Gövde */}
      <div className="flex flex-col lg:flex-row gap-6 p-5 sm:p-8">

        {/* Sol: Telefon mockup — gerçek iframe */}
        <div className="shrink-0 mx-auto lg:mx-0">
          <TelefonMockup>
            {demoUrl ? (
              <iframe
                src={demoUrl}
                title={sablon.isim}
                allow="autoplay"
                style={{
                  display: "block",
                  width: RENDER_W,
                  height: iframeH,
                  border: "none",
                  transform: `scale(${iframeScale})`,
                  transformOrigin: "0 0",
                  marginRight: `-${iframeMR}px`,
                  marginBottom: `-${iframeMB}px`,
                }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: darkBg }}>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>Önizleme yok</p>
              </div>
            )}
          </TelefonMockup>
        </div>

        {/* Sağ: Özellikler + CTA */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {ozellikler.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.18)" }}>
                Premium&apos;da Neler Var
              </p>
              <div className="space-y-2">
                {ozellikler.map((oz, i) => (
                  <motion.div
                    key={oz.baslik}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.055)" }}
                  >
                    <span className="text-base shrink-0 leading-none">{oz.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white leading-tight">{oz.baslik}</p>
                      <p className="text-[10px] leading-snug mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{oz.aciklama}</p>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.65 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-2.5 mt-auto pt-1">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 8px 36px rgba(${glowRgb},0.55)` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
              className="flex-1 py-4 rounded-2xl text-sm font-bold"
              style={{ background: goldGradient, color: "#1a0a00", boxShadow: goldShadow }}
            >
              Bu Şablonla Başla →
            </motion.button>
            {demoUrl && (
              <motion.a
                whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.09)" } as any}
                whileTap={{ scale: 0.97 }}
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 rounded-2xl text-sm font-semibold text-center flex items-center justify-center gap-1.5"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Canlı Önizle ↗
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   STANDART KART — Unified Luxury / Glassmorphism
══════════════════════════════════════════════ */
const STD_OZELLIKLER = [
  { Icon: ClipboardCheck, label: "RSVP" },
  { Icon: MapPin,         label: "Harita" },
  { Icon: Timer,          label: "Geri Sayım" },
  { Icon: Music,          label: "Müzik" },
] as const;

function StdKompaktKart({ sablon, index }: { sablon: Sablon; index: number }) {
  const router = useRouter();
  const r = sablon.renk;
  const emoji = KAT_EMOJI[sablon.kategori] ?? "✨";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.07, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -4,
        boxShadow: `0 16px 40px rgba(0,0,0,0.1), 0 0 0 1px ${r}30`,
      }}
      onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
      className="flex flex-col cursor-pointer"
      style={{
        background: "#ffffff",
        borderRadius: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      {/* ── Telefon Önizlemesi ── */}
      <div className="relative overflow-hidden shrink-0" style={{ height: 218 }}>
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% -15%, ${r}14 0%, transparent 65%)` }} />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div style={{ transform: "scale(0.56)", transformOrigin: "center center", width: 260, flexShrink: 0 }}>
            <TelefonMockup><StdKapak sablon={sablon} /></TelefonMockup>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"
          style={{ height: 64, background: "linear-gradient(to top, #ffffff, transparent)" }} />
      </div>

      {/* ── Bilgi Paneli ── */}
      <div className="flex flex-col px-5 pt-3 pb-5 gap-3.5">

        {/* Kategori + Etiketler */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: `${r}12`, color: r, border: `1px solid ${r}28` }}>
            {emoji} {sablon.kategori}
          </span>
          {(SABLON_ETIKETLER[sablon.id] ?? []).slice(0, 2).map(etiket => {
            const s = ETIKET_STILI[etiket];
            return (
              <span key={etiket} className="text-[9px] font-bold tracking-wide px-2 py-1 rounded-full"
                style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                {etiket}
              </span>
            );
          })}
        </div>

        {/* İsim */}
        <div>
          <h3 className="font-bold leading-tight text-gray-800"
            style={{
              fontFamily: "var(--font-cormorant), 'Georgia', serif",
              fontSize: "clamp(1.2rem, 2.2vw, 1.45rem)",
              letterSpacing: "-0.01em",
            }}>
            {sablon.isim}
          </h3>
          {sablon.aciklama && (
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              {sablon.aciklama}
            </p>
          )}
        </div>

        {/* Özellik mini-kartları */}
        <div className="grid grid-cols-2 gap-1.5">
          {STD_OZELLIKLER.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-gray-50 border border-gray-100">
              <Icon size={12} strokeWidth={1.75} style={{ color: `${r}cc`, flexShrink: 0 }} />
              <span className="text-[10px] font-medium text-gray-500">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA — Önizle + Oluştur */}
        <div className="flex gap-2">
          <Link
            href={`/sablonlar/${sablon.id}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center px-4 py-3 rounded-2xl text-xs font-semibold transition-colors shrink-0"
            style={{ border: `1.5px solid ${r}35`, color: r, background: `${r}06` }}
          >
            Önizle
          </Link>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 6px 24px ${r}35` }}
            whileTap={{ scale: 0.97 }}
            onClick={e => { e.stopPropagation(); router.push(`/olustur?sablon=${sablon.id}`); }}
            className="flex-1 py-3 rounded-2xl text-xs font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${r} 0%, ${r}cc 100%)`,
              boxShadow: `0 4px 16px ${r}25`,
              letterSpacing: "0.01em",
            }}
          >
            Bu Şablonla Oluştur →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════ */
export default function SablonlarSayfasi() {
  const [aktifKat, setAktifKat] = useState("hepsi");

  const goruntulenenPremium = useMemo(() =>
    aktifKat === "hepsi"
      ? SABLONLAR.filter(s => PREMIUM.has(s.id))
      : SABLONLAR.filter(s => PREMIUM.has(s.id) && s.kategori === aktifKat),
    [aktifKat]);

  const goruntulenenStandart = useMemo(() => {
    const std = SABLONLAR.filter(s => !PREMIUM.has(s.id));
    return aktifKat === "hepsi" ? std : std.filter(s => s.kategori === aktifKat);
  }, [aktifKat]);

  const toplamSonuc = goruntulenenPremium.length + goruntulenenStandart.length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ════════════ HERO ════════════ */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-175 h-96 rounded-full bg-purple-100/60 blur-[100px] pointer-events-none"/>
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-pink-100/40 blur-[80px] pointer-events-none"/>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-purple-50 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"/>
            <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-purple-600">Şablon Galerisi</span>
          </motion.div>

          {/* Başlık */}
          <motion.h1
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
            className="font-bold text-gray-900 mb-5 leading-[1.08]"
            style={{ fontSize:"clamp(2.4rem,6vw,4rem)" }}>
            Her Anın
            <br/>
            <span className="bg-linear-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Özel Davetiyesi
            </span>
          </motion.h1>

          {/* Alt başlık */}
          <motion.p
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.18 }}
            className="text-base text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            {SABLONLAR.length} şablon arasından seçin. Her bölümü anında önizleyin,
            dakikalar içinde davetiyenizi oluşturun ve paylaşın.
          </motion.p>

          {/* İstatistikler */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.26 }}
            className="flex items-center justify-center gap-10 flex-wrap">
            {[
              { val:`${SABLONLAR.length}`, label:"Şablon" },
              { val:"4", label:"Lüks Tasarım" },
              { val:"7", label:"Kategori" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-0.5 tabular-nums">{stat.val}</p>
                <p className="text-xs font-medium text-gray-400 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ════════════ FİLTRE BAR — sticky ════════════ */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {KATEGORILER.map(kat => {
            const sayi = kat.id === "hepsi" ? SABLONLAR.length : SABLONLAR.filter(s => s.kategori === kat.id).length;
            const isActive = aktifKat === kat.id;
            return (
              <motion.button key={kat.id}
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                onClick={() => setAktifKat(kat.id)}
                className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                style={{
                  background: isActive ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#f3f4f6",
                  color: isActive ? "#fff" : "#6b7280",
                  border: isActive ? "1px solid transparent" : "1px solid #e5e7eb",
                  boxShadow: isActive ? "0 4px 16px rgba(109,40,217,0.25)" : "none",
                }}>
                {kat.id !== "hepsi" && <span>{KAT_EMOJI[kat.id]}</span>}
                {kat.isim}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: isActive ? "rgba(255,255,255,0.2)" : "#e5e7eb", color: isActive ? "#fff" : "#9ca3af" }}>
                  {sayi}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ════════════ İÇERİK ════════════ */}
      <div className="max-w-5xl mx-auto px-4 py-12">

        {toplamSonuc === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-28">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-semibold mb-3 text-gray-500">Bu kategoride şablon bulunamadı.</p>
            <button onClick={() => setAktifKat("hepsi")} className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              Tüm şablonlara bak →
            </button>
          </motion.div>
        ) : (
          <>
            {/* ── PREMIUM KOLEKSİYON ── */}
            <AnimatePresence>
              {goruntulenenPremium.length > 0 && (
                <motion.section key="premium-section" className="mb-16"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                  {/* Bölüm başlığı */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1" style={{ background:"linear-gradient(to right,transparent,rgba(196,160,90,0.4))" }}/>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span style={{ color:"#C4A05A", fontSize:12 }}>✦</span>
                      <span className="text-[11px] font-bold tracking-[0.24em] uppercase" style={{ color:"#9A7A45" }}>
                        Lüks Koleksiyon
                      </span>
                      <span style={{ color:"#C4A05A", fontSize:12 }}>✦</span>
                    </div>
                    <div className="h-px flex-1" style={{ background:"linear-gradient(to left,transparent,rgba(196,160,90,0.4))" }}/>
                  </div>

                  <div className="space-y-5">
                    {goruntulenenPremium.map(s => <PremiumKart key={s.id} sablon={s} />)}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ── STANDART ŞABLONLAR ── */}
            {goruntulenenStandart.length > 0 && (
              <section>
                {/* Bölüm başlığı */}
                {goruntulenenPremium.length > 0 && (
                  <div className="flex items-center gap-4 mb-10">
                    <div className="h-px flex-1 bg-linear-to-r from-transparent via-gray-200 to-transparent" />
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-gray-300 text-[9px]">◆</span>
                      <span className="text-[10px] font-bold tracking-[0.26em] uppercase text-gray-400">
                        Klasik Koleksiyon
                      </span>
                      <span className="text-gray-300 text-[9px]">◆</span>
                    </div>
                    <div className="h-px flex-1 bg-linear-to-l from-transparent via-gray-200 to-transparent" />
                  </div>
                )}

                {/* Şablon sayısı */}
                <div className="flex items-center justify-end mb-6 px-1">
                  <span className="text-[11px] text-gray-400 tracking-wide">
                    {goruntulenenStandart.length} şablon
                    {aktifKat !== "hepsi" && (
                      <button onClick={() => setAktifKat("hepsi")} className="ml-2 text-purple-600 hover:text-purple-700 transition-colors">
                        Tümünü gör →
                      </button>
                    )}
                  </span>
                </div>

                {/* 3 sütunlu grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={aktifKat}
                    initial={{ opacity:0, y:12 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0 }}
                    transition={{ duration:0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goruntulenenStandart.map((s, i) => (
                      <StdKompaktKart key={s.id} sablon={s} index={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </section>
            )}
          </>
        )}
      </div>

      {/* ── Özellik Banner ── */}
      <section className="border-t border-gray-100 px-4 py-12 sm:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-600/70 mb-2">Ek Özellikler</p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Her davetiyeye anı özelliği eklenebilir</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Misafirleriniz QR kodla fotoğraf, yazılı anı ve sesli mesaj bırakabilir. Siz de tümünü tek PDF'e derleyebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: "📸", title: "Fotoğraf Albümü",   desc: "Misafirler yükler, siz onaylarsınız" },
              { icon: "💌", title: "Anı Defteri",        desc: "Yazılı dilekler ve anılar" },
              { icon: "🎙", title: "Sesli Anı",          desc: "Ses kaydıyla tebrik mesajı" },
              { icon: "📖", title: "Anı Kitabı PDF",     desc: "Tek tıkla premium PDF" },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-4 text-center hover:border-purple-100 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-xl mx-auto mb-2.5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <p className="text-xs font-bold text-gray-800 mb-1">{f.title}</p>
                <p className="text-[11px] text-gray-400 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/fiyatlar"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 hover:-translate-y-0.5 transition-all shadow-sm shadow-purple-200"
            >
              Özellikleri ve fiyatları gör
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 px-4 py-16 bg-white">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-purple-600">
              Şablon seçimi
            </p>
            <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
              Online davetiye şablonunu etkinliğine göre seç
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-gray-500 leading-7">
              Bekleriz&apos;de düğün davetiyesi, nişan davetiyesi, doğum günü davetiyesi ve özel etkinlikler için
              dijital davetiye şablonları bulunur. Şablonu seçtikten sonra bilgilerini düzenleyebilir, davetiye
              linkini WhatsApp veya sosyal medya üzerinden paylaşabilirsin.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SEO_LINKLER.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {SABLON_SECIM_IPUCLARI.map((ipucu) => (
              <div
                key={ipucu.baslik}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <h3 className="text-sm font-semibold text-gray-800">{ipucu.baslik}</h3>
                <p className="mt-2 text-xs text-gray-500 leading-6">
                  {ipucu.aciklama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

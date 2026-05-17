"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Timer, Music, ClipboardCheck } from "lucide-react";
import { SABLONLAR, KATEGORILER, Sablon } from "@/lib/sablonlar";

/* ─── Sabitler ─── */
const DEMO_URLS: Record<string, string> = {
  "nisan-luks":      "/davetiye/ornek-nisan",
  "dugun-luks":      "/davetiye/ornek-dugun",
  "dogumgunu-luks":  "/davetiye/ornek-dogumgunu",
};
const PREMIUM = new Set(["nisan-luks", "dugun-luks", "dogumgunu-luks"]);
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
  const router = useRouter();
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.plan ?? "free";
  const kilitli = userPlan === "free";
  const demoUrl = DEMO_URLS[sablon.id];
  const ozellikler = PREMIUM_OZELLIKLER[sablon.id] ?? [];

  const bolumler = useMemo((): Bolum[] => {
    if (sablon.id === "nisan-luks")     return [...NISAN_BOLUMLER];
    if (sablon.id === "dugun-luks")     return [...DUGUN_BOLUMLER];
    if (sablon.id === "dogumgunu-luks") return [...DOGUMGUNU_BOLUMLER];
    return [];
  }, [sablon.id]);

  const [aktifId, setAktifId] = useState(bolumler[0]?.id ?? "");
  const scrollRef = useRef<HTMLDivElement>(null);
  const aktif = bolumler.find(b => b.id === aktifId) ?? bolumler[0];

  const handleTab = (id: string) => {
    const idx = bolumler.findIndex(b => b.id === id);
    setAktifId(id);
    scrollRef.current?.scrollTo({ top: idx * 500, behavior: "smooth" });
  };

  /* Scroll: aktif bölümü güncelle */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const b = bolumler[Math.min(Math.round(el.scrollTop / 500), bolumler.length - 1)];
      if (b) setAktifId(b.id);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [bolumler]);

  /* Açılışta kısa nudge: içeriğin kaydırılabilir olduğunu gösterir */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.scrollTo({ top: 72, behavior: "smooth" });
      setTimeout(() => el.scrollTo({ top: 0, behavior: "smooth" }), 750);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (bolumler.length === 0) return null;

  const darkBg  = sablon.id === "nisan-luks" ? "#120308" : sablon.id === "dugun-luks" ? "#050d1a" : "#080315";
  const accent  = sablon.id === "nisan-luks" ? "#C4A05A" : sablon.id === "dugun-luks" ? "#D4AA70" : "#D4A84B";
  const glowRgb = sablon.id === "nisan-luks" ? "196,160,90" : sablon.id === "dugun-luks" ? "212,170,112" : "212,168,75";
  const goldGradient = "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)";
  const goldShadow   = `0 4px 24px rgba(${glowRgb},0.45)`;

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
      transition={{
        opacity: { duration: 0.4 }, y: { duration: 0.4 },
        boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
      }}
      style={{ background: darkBg, borderRadius: 28, overflow: "hidden" }}
    >
      {/* ─── Altın üst şerit ─── */}
      <div style={{ height: 2, background: goldGradient }} />

      {/* ─── Header ─── */}
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
          </div>
          <h2 className="font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", letterSpacing: "-0.01em" }}>
            {sablon.isim}
          </h2>
          {sablon.aciklama && (
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.32)" }}>{sablon.aciklama}</p>
          )}
        </div>
        {/* Fiyat — sağ üst */}
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold tabular-nums"
            style={{ background: goldGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            +₺100
          </p>
          <p className="text-[9px] font-bold tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>TEK SEFERLİK</p>
        </div>
      </div>

      {/* ─── Gövde ─── */}
      <div className="flex flex-col lg:flex-row gap-6 p-5 sm:p-8">

        {/* Sol: Bölüm tab'ları + Telefon — 260px sabit genişlik, mobilde ortalı */}
        <div className="shrink-0 flex flex-col gap-3 mx-auto lg:mx-0" style={{ width: 260 }}>
          {/* Pill tab'lar — tam okunabilir, yatay kaydırılabilir */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide" style={{ height: 34 }}>
            {bolumler.map(b => (
              <button
                key={b.id}
                onClick={() => handleTab(b.id)}
                className="flex items-center gap-1.5 px-3 rounded-full font-semibold whitespace-nowrap shrink-0 transition-all duration-200"
                style={{
                  fontSize: 10,
                  height: 30,
                  background: aktifId === b.id ? `rgba(${glowRgb},0.16)` : "rgba(255,255,255,0.05)",
                  color: aktifId === b.id ? accent : "rgba(255,255,255,0.4)",
                  border: aktifId === b.id ? `1px solid rgba(${glowRgb},0.38)` : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {b.icon} {b.label}
              </button>
            ))}
          </div>

          {/* Telefon + kaydır göstergesi */}
          <div className="relative">
            <TelefonMockup>
              <div ref={scrollRef} className="phone-scroll" style={{ height: "100%", overflowY: "auto" }}>
                {bolumler.map(b => (
                  <div key={b.id} style={{ height: 500, flexShrink: 0 }}>{b.node}</div>
                ))}
              </div>
            </TelefonMockup>

            {/* Kaydır göstergesi — telefon ekranının altına sabit overlay */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: 14,
                left: 10,
                right: 10,
                height: 110,
                borderRadius: "0 0 24px 24px",
                zIndex: 20,
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0) 100%)",
              }}
            >
              <div className="flex flex-col items-center justify-end h-full pb-4 gap-1.5">
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </motion.div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, letterSpacing: "0.18em", fontWeight: 700 }}>
                  KAYDIR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ: İçerik paneli */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Aktif bölüm detay kartı */}
          {aktif && (
            <AnimatePresence mode="wait">
              <motion.div
                key={aktif.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-4"
                style={{ background: `rgba(${glowRgb},0.05)`, border: `1px solid rgba(${glowRgb},0.13)` }}
              >
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-2"
                  style={{ background: `rgba(${glowRgb},0.14)`, color: accent }}>
                  {aktif.icon} {aktif.etiket}
                </span>
                <h3 className="text-sm font-bold text-white mb-1">{aktif.baslik}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{aktif.aciklama}</p>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Premium neler dahil — satır listesi */}
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
                    {/* Onay işareti */}
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
            {kilitli ? (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 8px 36px rgba(${glowRgb},0.55)` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/fiyatlar")}
                className="flex-1 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: goldGradient, color: "#1a0a00", boxShadow: goldShadow }}
              >
                <span>⭐</span> Fiyatları Gör — lüks şablon +₺100
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 8px 36px rgba(${glowRgb},0.55)` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
                className="flex-1 py-4 rounded-2xl text-sm font-bold"
                style={{ background: goldGradient, color: "#1a0a00", boxShadow: goldShadow }}
              >
                Bu Şablonla Başla →
              </motion.button>
            )}
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
        y: -5,
        boxShadow: `0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px ${r}35, inset 0 1px 0 rgba(255,255,255,0.07)`,
      }}
      onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
      className="flex flex-col cursor-pointer"
      style={{
        background: "#0d0b18",
        borderRadius: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
        overflow: "hidden",
      }}
    >
      {/* ── Telefon Önizlemesi ── */}
      <div className="relative overflow-hidden shrink-0" style={{ height: 218 }}>
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% -15%, ${r}1a 0%, transparent 65%)` }} />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div style={{ transform: "scale(0.56)", transformOrigin: "center center", width: 260, flexShrink: 0 }}>
            <TelefonMockup><StdKapak sablon={sablon} /></TelefonMockup>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"
          style={{ height: 64, background: "linear-gradient(to top, #0d0b18, transparent)" }} />
      </div>

      {/* ── Bilgi Paneli ── */}
      <div className="flex flex-col px-5 pt-3 pb-5 gap-4">

        {/* Kategori rozeti */}
        <span className="self-start text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
          style={{ background: `${r}18`, color: r, border: `1px solid ${r}28` }}>
          {emoji} {sablon.kategori}
        </span>

        {/* Cormorant Garamond isim — premium dili, düşük opaklık */}
        <div>
          <h3 className="font-bold leading-tight"
            style={{
              fontFamily: "var(--font-cormorant), 'Georgia', serif",
              fontSize: "clamp(1.2rem, 2.2vw, 1.45rem)",
              color: "rgba(255,255,255,0.78)",
              letterSpacing: "-0.01em",
            }}>
            {sablon.isim}
          </h3>
          {sablon.aciklama && (
            <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.28)" }}>
              {sablon.aciklama}
            </p>
          )}
        </div>

        {/* Özellik mini-kartları — 2×2 glassmorphism */}
        <div className="grid grid-cols-2 gap-1.5">
          {STD_OZELLIKLER.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-2.5 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Icon size={12} strokeWidth={1.75} style={{ color: `${r}aa`, flexShrink: 0 }} />
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.42)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA — template rengi gradient, gold değil */}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: `0 6px 24px ${r}40` }}
          whileTap={{ scale: 0.97 }}
          onClick={e => { e.stopPropagation(); router.push(`/olustur?sablon=${sablon.id}`); }}
          className="w-full py-3 rounded-2xl text-xs font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${r}dd 0%, ${r}99 100%)`,
            boxShadow: `0 4px 16px ${r}2a`,
            letterSpacing: "0.01em",
          }}
        >
          Bu Şablonla Başla →
        </motion.button>
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
    <div className="min-h-screen" style={{ background:"#05040f" }}>

      {/* ════════════ HERO ════════════ */}
      <div className="relative overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,#0f0118 0%,#0d0826 40%,#060f20 100%)" }}/>
        <div className="absolute inset-0" style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full" style={{ background:"radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)" }}/>
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full" style={{ background:"radial-gradient(circle,rgba(29,78,216,0.1),transparent 70%)" }}/>
        <div className="absolute bottom-0 inset-x-0 h-32" style={{ background:"linear-gradient(to bottom,transparent,#05040f)" }}/>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.22)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ boxShadow:"0 0 6px rgba(167,139,250,0.8)" }}/>
            <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-purple-300">Şablon Galerisi</span>
          </motion.div>

          {/* Başlık */}
          <motion.h1
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
            className="font-bold text-white mb-5 leading-[1.08]"
            style={{ fontSize:"clamp(2.4rem,6vw,4rem)" }}>
            Her Anın
            <br/>
            <span style={{ background:"linear-gradient(90deg,#a78bfa 0%,#60a5fa 50%,#a78bfa 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundSize:"200%" }}>
              Özel Davetiyesi
            </span>
          </motion.h1>

          {/* Alt başlık */}
          <motion.p
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.18 }}
            className="text-base max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color:"rgba(255,255,255,0.42)" }}>
            {SABLONLAR.length} şablon arasından seçin. Her bölümü anında önizleyin,
            dakikalar içinde davetiyenizi oluşturun ve paylaşın.
          </motion.p>

          {/* İstatistikler */}
          <motion.div
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.26 }}
            className="flex items-center justify-center gap-10 flex-wrap">
            {[
              { val:`${SABLONLAR.length}`, label:"Şablon" },
              { val:"3", label:"Lüks Tasarım" },
              { val:"7", label:"Kategori" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white mb-0.5" style={{ fontVariantNumeric:"tabular-nums" }}>{stat.val}</p>
                <p className="text-xs font-medium" style={{ color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em" }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ════════════ FİLTRE BAR — sticky glassmorphism ════════════ */}
      <div className="sticky top-16 z-30"
        style={{ background:"rgba(5,4,15,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
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
                  background: isActive ? "linear-gradient(135deg,#6d28d9,#1d4ed8)" : "rgba(255,255,255,0.05)",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                  border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isActive ? "0 4px 16px rgba(109,40,217,0.4)" : "none",
                }}>
                {kat.id !== "hepsi" && <span>{KAT_EMOJI[kat.id]}</span>}
                {kat.isim}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}>
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
            <p className="font-semibold mb-3" style={{ color:"rgba(255,255,255,0.5)" }}>Bu kategoride şablon bulunamadı.</p>
            <button onClick={() => setAktifKat("hepsi")} className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
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
                    <div className="h-px flex-1"
                      style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.1))" }} />
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 9 }}>◆</span>
                      <span className="text-[10px] font-bold tracking-[0.26em] uppercase"
                        style={{ color: "rgba(255,255,255,0.28)" }}>
                        Klasik Koleksiyon
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 9 }}>◆</span>
                    </div>
                    <div className="h-px flex-1"
                      style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.1))" }} />
                  </div>
                )}

                {/* Şablon sayısı */}
                <div className="flex items-center justify-end mb-6 px-1">
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
                    {goruntulenenStandart.length} şablon
                    {aktifKat !== "hepsi" && (
                      <button onClick={() => setAktifKat("hepsi")} className="ml-2 text-purple-400 hover:text-purple-300 transition-colors">
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

      <section className="border-t border-white/8 px-4 py-16" style={{ background: "#080712" }}>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#a78bfa" }}>
              Şablon seçimi
            </p>
            <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
              Online davetiye şablonunu etkinliğine göre seç
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7" style={{ color: "rgba(255,255,255,0.62)" }}>
              Bekleriz&apos;de düğün davetiyesi, nişan davetiyesi, doğum günü davetiyesi ve özel etkinlikler için
              dijital davetiye şablonları bulunur. Şablonu seçtikten sonra bilgilerini düzenleyebilir, davetiye
              linkini WhatsApp veya sosyal medya üzerinden paylaşabilirsin.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SEO_LINKLER.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/72 transition hover:border-purple-300/50 hover:bg-purple-400/10 hover:text-white"
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
                className="rounded-lg border border-white/10 bg-white/3 p-4"
              >
                <h3 className="text-sm font-semibold text-white">{ipucu.baslik}</h3>
                <p className="mt-2 text-xs leading-6" style={{ color: "rgba(255,255,255,0.58)" }}>
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

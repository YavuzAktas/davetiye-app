"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { SABLONLAR, KATEGORILER, Sablon } from "@/lib/sablonlar";

/* ─── Sabitler ─── */
const DEMO_URLS: Record<string, string> = {
  "nisan-luks":      "/davetiye/ornek-nisan",
  "dugun-luks":      "/davetiye/ornek-dugun",
  "dogumgunu-luks":  "/davetiye/ornek-dogumgunu",
};
const PREMIUM = new Set(["nisan-luks", "dugun-luks", "dogumgunu-luks"]);
const KAT_EMOJI: Record<string, string> = {
  dugun:"💍", nisan:"💌", dogumgunu:"🎂",
  sunnet:"⭐", kina:"🕯️", kurumsal:"💼", diger:"🎉",
};

/* ══════════════════════════════════════════════
   TELEFON MOCKUP
══════════════════════════════════════════════ */
function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width:260 }}>
      <div className="relative rounded-[38px] overflow-hidden"
        style={{ background:"#1a1a1a", padding:"14px 10px",
          boxShadow:"0 0 0 1px #333,0 30px 80px rgba(0,0,0,0.5),inset 0 0 0 1px #444" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width:80, height:26, background:"#1a1a1a", borderRadius:"0 0 16px 16px" }}/>
        <div className="rounded-3xl overflow-hidden" style={{ height:500, background:"#000" }}>
          {children}
        </div>
      </div>
      <div className="absolute right-0 top-24 w-1 h-10 rounded-l bg-gray-700" style={{ right:-1 }}/>
      <div className="absolute left-0 top-20 w-1 h-8 rounded-r bg-gray-700" style={{ left:-1 }}/>
      <div className="absolute left-0 top-32 w-1 h-8 rounded-r bg-gray-700" style={{ left:-1 }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PREMİUM ÖNİZLEMELER — Nişan Lüks
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
      <div className="relative z-10" style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden", position:"relative",
        boxShadow:`0 0 0 6px ${N.BG},0 0 0 8px rgba(196,160,90,0.2),0 12px 36px rgba(10,0,6,0.7)` }}>
        {!sealFailed ? (
          <Image src="/rose-seal.png" alt="" fill className="object-cover" onError={() => setSealFailed(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background:`radial-gradient(circle at 38% 32%,#A01C2E 0%,#7A1220 40%,#3E0810 100%)` }}>
            <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
              {[0,60,120,180,240,300].map(a=><ellipse key={a} cx="100" cy="52" rx="14" ry="22" fill="rgba(200,80,80,0.3)" transform={`rotate(${a} 100 100)`}/>)}
              <circle cx="100" cy="100" r="12" fill="rgba(225,105,105,0.65)"/>
              <circle cx="100" cy="100" r="5"  fill="rgba(245,140,130,0.8)"/>
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
   PREMİUM ÖNİZLEMELER — Düğün Lüks
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
   PREMİUM ÖNİZLEMELER — Doğum Günü Lüks
══════════════════════════════════════════════ */
const G = { BG:"#140828", BG_MED:"#1E0C38", BG_DARK:"#0A0414", GOLD:"#D4A84B", CREAM:"#F9F3E8", PL:"#5A2090" };

function DGKapak() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse at 50% 45%,${G.PL} 0%,${G.BG} 55%,${G.BG_DARK} 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,rgba(212,168,75,0.05) 1px,transparent 1px)`, backgroundSize:"22px 22px" }}/>
      <p className="relative z-10 text-center mb-6" style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2.2rem)", color:G.CREAM, lineHeight:1.2 }}>
        Zeynep
      </p>
      <div className="relative z-10" style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 6px ${G.BG},0 0 0 8px rgba(212,168,75,0.2),0 12px 36px rgba(10,0,20,0.7)` }}>
        <svg viewBox="0 0 200 200" style={{ width:"100%", height:"100%" }} fill="none">
          <circle cx="100" cy="100" r="100" fill={G.BG_DARK}/>
          <circle cx="100" cy="100" r="96" stroke={`${G.GOLD}22`} strokeWidth="1"/>
          <rect x="44" y="126" width="112" height="38" rx="7" fill={G.PL} opacity="0.75"/>
          <rect x="44" y="118" width="112" height="11" rx="5" fill={G.GOLD} opacity="0.55"/>
          <rect x="62" y="90" width="76" height="30" rx="6" fill={G.PL} opacity="0.9"/>
          <rect x="62" y="83" width="76" height="10" rx="5" fill={G.GOLD} opacity="0.65"/>
          {[80, 100, 120].map((x, i) => (
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
          <div key={i} style={{ position:"absolute",...pos,
            width:3, height:16, background:G.GOLD, opacity:0.5, transform:"rotate(0deg)" }}/>
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
   BÖLÜM TANIMLARI
══════════════════════════════════════════════ */
const NISAN_BOLUMLER = [
  { id:"kapak",    icon:"🌹", label:"Kapak",    etiket:"Açılış", baslik:"Gül Mühürlü Kapak",     aciklama:"Mühüre dokunulunca açılan bordo & altın kapak. İlk izlenim unutulmaz.",                        node:<NisanKapak/> },
  { id:"davetiye", icon:"💍", label:"Davetiye", etiket:"Hero",   baslik:"Kemer Çerçeveli Hero",   aciklama:"İsimler büyük el yazısıyla kemer çerçeve içinde. Tarih ve mekan altında.",                   node:<NisanHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",             aciklama:"Nişana kaç gün kaldığını saniye saniye gösterir.",                                           node:<NisanSayim/> },
  { id:"katilim",  icon:"💌", label:"Katılım",  etiket:"RSVP",   baslik:"Katılım Formu",          aciklama:"Misafirler kişi sayısını ve katılım durumunu bildirir.",                                     node:<NisanKatilim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",         aciklama:"Mekan, saat ve tarih üç sütunda. Google Maps bağlantılı harita.",                            node:<NisanMekan/> },
  { id:"anilar",   icon:"📷", label:"Anılar",   etiket:"Galeri", baslik:"Polaroid Galeri",        aciklama:"Fotoğraflar polaroid tarzında, üst üste binmiş şekilde.",                                    node:<NisanAnilar/> },
] as const;

const DUGUN_BOLUMLER = [
  { id:"kapak",    icon:"💍", label:"Kapak",    etiket:"Açılış", baslik:"Yüzük Mühürlü Kapak",   aciklama:"Düğün yüzükleri mühürüne dokunulunca açılan lacivert kapak.",                                node:<DugunKapak/> },
  { id:"davetiye", icon:"🌟", label:"Davetiye", etiket:"Hero",   baslik:"Elmas Köşeli Hero",      aciklama:"İsimler büyük el yazısıyla köşelerinde altın elmas motifi olan çerçeve içinde.",             node:<DugunHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",             aciklama:"Düğüne kaç gün kaldığını saniye saniye gösterir.",                                           node:<DugunSayim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",         aciklama:"Mekan, saat ve tarih üç sütunda. Google Maps bağlantılı harita.",                            node:<DugunMekan/> },
] as const;

const DOGUMGUNU_BOLUMLER = [
  { id:"kapak",    icon:"🎂", label:"Kapak",    etiket:"Açılış", baslik:"Pasta Mühürlü Kapak",    aciklama:"Altın pasta mühürüne dokunulunca açılan derin mor & şampanya altın kapak.",                  node:<DGKapak/> },
  { id:"davetiye", icon:"✨", label:"Davetiye", etiket:"Hero",   baslik:"Yıldız Köşeli Hero",     aciklama:"İsim büyük el yazısıyla yıldız köşeli çerçeve içinde, zarif tipografi.",                    node:<DGHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",             aciklama:"Partiye kaç gün kaldığını saniye saniye gösterir.",                                          node:<DGSayim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",         aciklama:"Mekan, saat ve tarih üç sütunda. Google Maps bağlantılı harita.",                            node:<DGMekan/> },
] as const;

type Bolum = { id:string; icon:string; label:string; etiket:string; baslik:string; aciklama:string; node:React.ReactNode };

/* ══════════════════════════════════════════════
   PREMİUM KART — koyu tema, tam önizleme
══════════════════════════════════════════════ */
function PremiumKart({ sablon }: { sablon: Sablon }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.plan ?? "free";
  const kilitli = userPlan === "free";
  const demoUrl = DEMO_URLS[sablon.id];

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.min(Math.round(el.scrollTop / 500), bolumler.length - 1);
      const b = bolumler[idx];
      if (b) setAktifId(b.id);
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [bolumler]);

  if (bolumler.length === 0) return null;

  const darkBg = sablon.id === "nisan-luks" ? "#2A0810"
    : sablon.id === "dugun-luks" ? "#081628"
    : "#0E0520";
  const accentColor = sablon.id === "nisan-luks" ? "#C4A05A"
    : sablon.id === "dugun-luks" ? "#D4AA70"
    : "#D4A84B";
  const midBg = sablon.id === "nisan-luks" ? "#3B0A14"
    : sablon.id === "dugun-luks" ? "#0D1F3C"
    : "#140828";

  return (
    <div className="rounded-3xl overflow-hidden" style={{
      background: darkBg,
      boxShadow: `0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)`
    }}>
      {/* ── Kart başlığı ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4"
        style={{ borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background:`${accentColor}20`, color:accentColor, border:`1px solid ${accentColor}30` }}>
            ✦ PRİMİUM
          </span>
          <h2 className="text-lg font-bold text-white truncate">{sablon.isim}</h2>
          {sablon.aciklama && (
            <span className="hidden md:inline text-sm truncate" style={{ color:"rgba(255,255,255,0.35)" }}>
              — {sablon.aciklama}
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ml-2"
          style={{ background:`${accentColor}15`, color:accentColor }}>
          {KAT_EMOJI[sablon.kategori]} {sablon.kategori.charAt(0).toUpperCase()+sablon.kategori.slice(1)}
        </span>
      </div>

      {/* ── Gövde ── */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 p-6">

        {/* Sol — telefon */}
        <div className="shrink-0">
          <TelefonMockup>
            <div ref={scrollRef} className="phone-scroll" style={{ height:"100%", overflowY:"auto" }}>
              {bolumler.map(b => (
                <div key={b.id} style={{ height:500, flexShrink:0 }}>{b.node}</div>
              ))}
            </div>
          </TelefonMockup>
        </div>

        {/* Sağ — bilgi paneli */}
        <div className="flex-1 max-w-lg w-full flex flex-col gap-4">

          {/* Aktif bölüm bilgisi */}
          {aktif && (
            <div className="rounded-2xl p-5" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-3"
                style={{ background:`${accentColor}20`, color:accentColor }}>
                {aktif.icon} {aktif.etiket}
              </span>
              <h3 className="text-lg font-bold text-white mb-1.5">{aktif.baslik}</h3>
              <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>{aktif.aciklama}</p>
            </div>
          )}

          {/* Bölüm listesi */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color:"rgba(255,255,255,0.3)" }}>
              Tüm Bölümler — kaydır veya seç
            </p>
            {bolumler.map(b => (
              <button key={b.id} onClick={() => handleTab(b.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  background: aktifId === b.id ? `${midBg}cc` : "transparent",
                  border: aktifId === b.id ? `1px solid rgba(255,255,255,0.1)` : "1px solid transparent",
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-colors"
                  style={{ background: aktifId === b.id ? `${accentColor}20` : "rgba(255,255,255,0.05)" }}>
                  {b.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold transition-colors"
                    style={{ color: aktifId === b.id ? "#fff" : "rgba(255,255,255,0.4)" }}>
                    {b.label}
                  </p>
                  <p className="text-xs truncate" style={{ color:"rgba(255,255,255,0.25)" }}>{b.baslik}</p>
                </div>
                {aktifId === b.id && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:accentColor }} />
                )}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {kilitli ? (
              <button onClick={() => router.push("/fiyatlar")}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{ background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`, color:darkBg }}>
                <span>👑</span> Standart&apos;a Geç — Oluştur
              </button>
            ) : (
              <button onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                style={{ background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`, color:darkBg }}>
                Bu Şablonla Oluştur →
              </button>
            )}
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all text-center hover:bg-white/10"
                style={{ background:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.65)", border:"1px solid rgba(255,255,255,0.1)" }}>
                Canlı Önizle ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STANDART KOMPAKT KART — grid için
══════════════════════════════════════════════ */
function StdKompaktKart({ sablon }: { sablon: Sablon }) {
  const router = useRouter();
  const r = sablon.renk;
  const emoji = KAT_EMOJI[sablon.kategori] ?? "✨";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col">
      {/* Önizleme */}
      <div className="relative h-44 overflow-hidden" style={{ background:`linear-gradient(145deg,${r}14 0%,${r}06 100%)` }}>
        <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,${r}10 1px,transparent 1px)`, backgroundSize:"18px 18px" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:r }}/>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span style={{ fontSize:32, marginBottom:6 }}>{emoji}</span>
          <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"1.35rem", color:"#1a1a1a", lineHeight:1.2 }}>
            Ad <span style={{ color:r }}>&amp;</span> Soyad
          </p>
          <div style={{ width:28, height:1.5, background:r, borderRadius:2, margin:"6px 0" }}/>
          <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.14em", color:"#aaa" }}>
            GÜN · AY · YIL
          </p>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background:`${r}15` }}>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background:r }}>
            Önizle
          </span>
        </div>
      </div>

      {/* Bilgi */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{sablon.isim}</h3>
          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background:`${r}12`, color:r }}>
            {emoji}
          </span>
        </div>
        {sablon.aciklama && (
          <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">{sablon.aciklama}</p>
        )}
        <div className="flex gap-1 flex-wrap mb-4">
          {["📋 Davetiye", "📍 Harita", "💌 RSVP"].map(f => (
            <span key={f} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">{f}</span>
          ))}
        </div>
        <button
          onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
          className="mt-auto w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
          style={{ background:r }}>
          Bu Şablonu Seç →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════ */
export default function SablonlarSayfasi() {
  const [aktifKat, setAktifKat] = useState("hepsi");

  const goruntulenenPremium = useMemo(() => {
    if (aktifKat === "hepsi") return SABLONLAR.filter(s => PREMIUM.has(s.id));
    return SABLONLAR.filter(s => PREMIUM.has(s.id) && s.kategori === aktifKat);
  }, [aktifKat]);

  const goruntulenenStandart = useMemo(() => {
    const standart = SABLONLAR.filter(s => !PREMIUM.has(s.id));
    if (aktifKat === "hepsi") return standart;
    return standart.filter(s => s.kategori === aktifKat);
  }, [aktifKat]);

  const toplamSonuc = goruntulenenPremium.length + goruntulenenStandart.length;

  return (
    <div className="min-h-screen" style={{ background:"#f7f6fb" }}>

      {/* ── Hero / Başlık ── */}
      <div className="relative overflow-hidden px-4 pt-14 pb-16 text-center"
        style={{ background:"linear-gradient(135deg,#0f0118 0%,#1a0a2e 40%,#0d1a38 100%)" }}>
        <div className="absolute inset-0" style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"24px 24px" }}/>
        <div className="absolute -top-32 -left-16 w-80 h-80 rounded-full opacity-[0.08] blur-3xl" style={{ background:"#7c3aed" }}/>
        <div className="absolute -top-32 -right-16 w-80 h-80 rounded-full opacity-[0.08] blur-3xl" style={{ background:"#1d4ed8" }}/>
        <div className="relative">
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-purple-400 mb-4 px-4 py-1.5 rounded-full"
            style={{ background:"rgba(124,58,237,0.15)", border:"1px solid rgba(124,58,237,0.25)" }}>
            Şablon Galerisi
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Her Anın Özel Davetiyesi
          </h1>
          <p className="text-white/45 text-base max-w-md mx-auto mb-8">
            {SABLONLAR.length} şablon arasından seçin. Her bölümü anında önizleyin, dakikalar içinde davetiyenizi oluşturun.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
              Ücretsiz şablonlar mevcut
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>
              3 lüks premium şablon
            </div>
          </div>
        </div>
      </div>

      {/* ── Filtre Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {KATEGORILER.map(kat => {
            const sayi = kat.id === "hepsi" ? SABLONLAR.length : SABLONLAR.filter(s => s.kategori === kat.id).length;
            return (
              <button key={kat.id} onClick={() => setAktifKat(kat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  aktifKat === kat.id ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {kat.id !== "hepsi" && <span>{KAT_EMOJI[kat.id]}</span>}
                {kat.isim}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${aktifKat === kat.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {sayi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="max-w-5xl mx-auto px-4 py-10">

        {toplamSonuc === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium">Bu kategoride şablon bulunamadı.</p>
          </div>
        ) : (
          <>
            {/* Lüks Koleksiyon */}
            {goruntulenenPremium.length > 0 && (
              <section className="mb-14">
                <div className="flex items-center gap-4 mb-7">
                  <div className="h-px flex-1" style={{ background:"linear-gradient(to right,transparent,rgba(212,168,75,0.3))" }}/>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span style={{ color:"#D4A84B", fontSize:12 }}>✦</span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color:"#B8860B" }}>Lüks Koleksiyon</span>
                    <span style={{ color:"#D4A84B", fontSize:12 }}>✦</span>
                  </div>
                  <div className="h-px flex-1" style={{ background:"linear-gradient(to left,transparent,rgba(212,168,75,0.3))" }}/>
                </div>
                <div className="space-y-6">
                  {goruntulenenPremium.map(sablon => (
                    <PremiumKart key={sablon.id} sablon={sablon} />
                  ))}
                </div>
              </section>
            )}

            {/* Standart Şablonlar */}
            {goruntulenenStandart.length > 0 && (
              <section>
                {goruntulenenPremium.length > 0 && (
                  <div className="flex items-center gap-4 mb-7">
                    <div className="h-px flex-1 bg-gray-200"/>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 px-3 shrink-0">
                      Tüm Şablonlar
                    </span>
                    <div className="h-px flex-1 bg-gray-200"/>
                  </div>
                )}
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold text-gray-700">{goruntulenenStandart.length}</span> şablon
                    {aktifKat !== "hepsi" && (
                      <> · <button onClick={() => setAktifKat("hepsi")} className="text-purple-500 hover:underline ml-1">Tümünü gör</button></>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-400 hidden sm:block">
                    Her şablonda: Kapak · Davetiye · Harita · RSVP
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goruntulenenStandart.map(sablon => (
                    <StdKompaktKart key={sablon.id} sablon={sablon} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

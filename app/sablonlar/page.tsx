"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
   PREMIUM ÖNIZLEMELER — Nişan Lüks
══════════════════════════════════════════════ */
const N = { BG:"#3B0A14", BG_MED:"#4E1020", BG_DARK:"#270610", GOLD:"#C4A05A", CREAM:"#F5E8D8" };

function NisanKapak() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse at 50% 45%,#5C1020 0%,${N.BG} 55%,${N.BG_DARK} 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,rgba(196,160,90,0.055) 1px,transparent 1px)`, backgroundSize:"22px 22px" }}/>
      <p className="relative z-10 text-center mb-6" style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.5rem,5vw,2.2rem)", color:N.CREAM, lineHeight:1.2 }}>
        Aylin <span style={{ color:N.GOLD }}>&amp;</span> Yavuz
      </p>
      <div className="relative z-10" style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 6px ${N.BG},0 0 0 8px rgba(196,160,90,0.2),0 12px 36px rgba(10,0,6,0.7)` }}>
        <img src="/rose-seal.png" alt="" className="w-full h-full object-cover block"
          onError={e=>{(e.currentTarget as HTMLImageElement).style.display="none";(e.currentTarget.nextElementSibling as HTMLElement).style.display="flex";}}/>
        <div className="w-full h-full items-center justify-center hidden"
          style={{ background:`radial-gradient(circle at 38% 32%,#A01C2E 0%,#7A1220 40%,#3E0810 100%)` }}>
          <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
            {[0,60,120,180,240,300].map(a=><ellipse key={a} cx="100" cy="52" rx="14" ry="22" fill="rgba(200,80,80,0.3)" transform={`rotate(${a} 100 100)`}/>)}
            <circle cx="100" cy="100" r="12" fill="rgba(225,105,105,0.65)"/>
            <circle cx="100" cy="100" r="5"  fill="rgba(245,140,130,0.8)"/>
          </svg>
        </div>
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
   PREMIUM ÖNIZLEMELER — Düğün Lüks
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
   PREMIUM ÖNIZLEMELER — Doğum Günü Lüks
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
      {/* Pasta mühür (küçük) */}
      <div className="relative z-10" style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 6px ${G.BG},0 0 0 8px rgba(212,168,75,0.2),0 12px 36px rgba(10,0,20,0.7)` }}>
        <svg viewBox="0 0 200 200" style={{ width:"100%", height:"100%" }} fill="none">
          <circle cx="100" cy="100" r="100" fill={G.BG_DARK}/>
          <circle cx="100" cy="100" r="96" stroke={`${G.GOLD}22`} strokeWidth="1"/>
          {/* Alt kat */}
          <rect x="44" y="126" width="112" height="38" rx="7" fill={G.PL} opacity="0.75"/>
          <rect x="44" y="118" width="112" height="11" rx="5" fill={G.GOLD} opacity="0.55"/>
          {/* Üst kat */}
          <rect x="62" y="90" width="76" height="30" rx="6" fill={G.PL} opacity="0.9"/>
          <rect x="62" y="83" width="76" height="10" rx="5" fill={G.GOLD} opacity="0.65"/>
          {/* Mumlar */}
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
   STANDART ŞABLON ÖNİZLEMELERİ
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
        <div style={{ padding:"5px 18px", borderRadius:20, border:`1px solid ${r}35`, color:r, fontSize:11, fontWeight:700, letterSpacing:"0.06em" }}>
          {sablon.isim}
        </div>
      </div>
    </div>
  );
}
function StdDavetiye({ sablon }: { sablon: Sablon }) {
  const r = sablon.renk;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 relative"
      style={{ background:`linear-gradient(160deg,${r}10 0%,white 60%)` }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:r }}/>
      <div className="w-full text-center py-7 px-5" style={{ border:`1.5px solid ${r}25`, borderRadius:8 }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.3em", color:r, marginBottom:14, textTransform:"uppercase" }}>
          {sablon.isim}
        </p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"2rem", color:"#1a1a1a", lineHeight:1 }}>Ad Soyad</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"1.3rem", color:r, lineHeight:1.5 }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"2rem", color:"#1a1a1a", lineHeight:1, marginBottom:14 }}>Ad Soyad</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${r}50,transparent)`, margin:"12px 0" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.1em", color:"#888" }}>GÜN · AY · YIL · MEKAN</p>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, fontStyle:"italic", color:"#bbb", marginTop:8 }}>Özel mesajınız burada yer alır.</p>
      </div>
    </div>
  );
}
function StdMekan({ sablon }: { sablon: Sablon }) {
  const r = sablon.renk;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center"
      style={{ background:`linear-gradient(160deg,${r}08 0%,white 100%)` }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.3em", color:r, marginBottom:10, textTransform:"uppercase" }}>Mekan</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"1.8rem", color:"#1a1a1a", marginBottom:24 }}>Nerede Buluşuyoruz?</p>
      <div className="flex gap-8 justify-center mb-6">
        {[{e:"📍",l:"MEKAN",v:"Venue"},{e:"🕐",l:"SAAT",v:"18:00"},{e:"📅",l:"TARİH",v:"Tarih"}].map(col=>(
          <div key={col.l} className="text-center">
            <p style={{ fontSize:20, marginBottom:6 }}>{col.e}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.2em", color:r, marginBottom:4 }}>{col.l}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, fontWeight:600, color:"#333" }}>{col.v}</p>
          </div>
        ))}
      </div>
      <div style={{ width:"85%", height:80, borderRadius:10, background:`${r}08`, border:`1px solid ${r}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontSize:11, color:`${r}60`, fontStyle:"italic" }}>📍 Harita görünümü</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BÖLÜM TANIMLARI
══════════════════════════════════════════════ */
const NISAN_BOLUMLER = [
  { id:"kapak",    icon:"🌹", label:"Kapak",    etiket:"Açılış", baslik:"Gül Mühürlü Kapak", aciklama:"Mühüre dokunulunca açılan bordo & altın kapak. İlk izlenim unutulmaz.", node:<NisanKapak/> },
  { id:"davetiye", icon:"💍", label:"Davetiye", etiket:"Hero",   baslik:"Kemer Çerçeveli Hero", aciklama:"İsimler büyük el yazısıyla kemer çerçeve içinde. Tarih ve mekan altında.", node:<NisanHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",         aciklama:"Nişana kaç gün kaldığını saniye saniye gösterir.", node:<NisanSayim/> },
  { id:"katilim",  icon:"💌", label:"Katılım",  etiket:"RSVP",   baslik:"Katılım Formu",      aciklama:"Misafirler kişi sayısını ve katılım durumunu bildirir.", node:<NisanKatilim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",      aciklama:"Mekan, saat ve tarih üç sütunda. Google Maps bağlantılı harita.", node:<NisanMekan/> },
  { id:"anilar",   icon:"📷", label:"Anılar",   etiket:"Galeri", baslik:"Polaroid Galeri",    aciklama:"Fotoğraflar polaroid tarzında, üst üste binmiş şekilde.", node:<NisanAnilar/> },
] as const;

const DUGUN_BOLUMLER = [
  { id:"kapak",    icon:"💍", label:"Kapak",    etiket:"Açılış", baslik:"Yüzük Mühürlü Kapak", aciklama:"Düğün yüzükleri mühürüne dokunulunca açılan lacivert kapak.", node:<DugunKapak/> },
  { id:"davetiye", icon:"🌟", label:"Davetiye", etiket:"Hero",   baslik:"Elmas Köşeli Hero",   aciklama:"İsimler büyük el yazısıyla köşelerinde altın elmas motifi olan çerçeve içinde.", node:<DugunHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",          aciklama:"Düğüne kaç gün kaldığını saniye saniye gösterir.", node:<DugunSayim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",       aciklama:"Mekan, saat ve tarih üç sütunda. Google Maps bağlantılı harita.", node:<DugunMekan/> },
] as const;

const DOGUMGUNU_BOLUMLER = [
  { id:"kapak",    icon:"🎂", label:"Kapak",    etiket:"Açılış", baslik:"Pasta Mühürlü Kapak", aciklama:"Altın pasta mühürüne dokunulunca açılan derin mor & şampanya altın kapak.", node:<DGKapak/> },
  { id:"davetiye", icon:"✨", label:"Davetiye", etiket:"Hero",   baslik:"Yıldız Köşeli Hero",  aciklama:"İsim büyük el yazısıyla yıldız köşeli çerçeve içinde, zarif tipografi.", node:<DGHero/> },
  { id:"sayim",    icon:"⏱️", label:"Sayım",    etiket:"Canlı",  baslik:"Geri Sayım",          aciklama:"Partiye kaç gün kaldığını saniye saniye gösterir.", node:<DGSayim/> },
  { id:"mekan",    icon:"📍", label:"Mekan",    etiket:"Harita", baslik:"Konum & Harita",       aciklama:"Mekan, saat ve tarih üç sütunda. Google Maps bağlantılı harita.", node:<DGMekan/> },
] as const;

type Bolum = { id:string; icon:string; label:string; etiket:string; baslik:string; aciklama:string; node:React.ReactNode };

function getStdBolumler(sablon: Sablon): Bolum[] {
  return [
    { id:"kapak",    icon:KAT_EMOJI[sablon.kategori]??"✨", label:"Kapak",    etiket:"Tasarım", baslik:"Davetiye Kapağı",      aciklama:`${sablon.aciklama ?? sablon.isim} temalı davetiye kapağı.`, node:<StdKapak sablon={sablon}/> },
    { id:"davetiye", icon:"✉️",                              label:"Davetiye", etiket:"İçerik",  baslik:"Davetiye İçeriği",     aciklama:"İsimler, tarih, mekan ve kişisel mesajınız zarif tipografi ile gösterilir.", node:<StdDavetiye sablon={sablon}/> },
    { id:"mekan",    icon:"📍",                              label:"Mekan",    etiket:"Harita",  baslik:"Konum & Harita",       aciklama:"Mekan adı, saat ve tarih. Google Maps entegrasyonu ile yol tarifi.", node:<StdMekan sablon={sablon}/> },
  ];
}

/* ══════════════════════════════════════════════
   ŞABLON SATIRI (tek şablon kartı)
══════════════════════════════════════════════ */
function SablonSatiri({ sablon }: { sablon: Sablon }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.plan ?? "free";
  const isPremium = PREMIUM.has(sablon.id);
  const kilitli = isPremium && userPlan === "free";
  const demoUrl = DEMO_URLS[sablon.id];

  const bolumler: readonly Bolum[] | Bolum[] =
    sablon.id === "nisan-luks"     ? NISAN_BOLUMLER :
    sablon.id === "dugun-luks"     ? DUGUN_BOLUMLER :
    sablon.id === "dogumgunu-luks" ? DOGUMGUNU_BOLUMLER :
    getStdBolumler(sablon);

  const [aktifId, setAktifId] = useState(bolumler[0].id);
  const [gecis, setGecis] = useState(true);

  const aktif = (bolumler as Bolum[]).find(b=>b.id===aktifId) ?? bolumler[0];

  const handleTab = (id: string) => {
    if (id === aktifId) return;
    setGecis(false);
    setTimeout(()=>{ setAktifId(id); setGecis(true); }, 160);
  };

  const renk = isPremium
    ? sablon.id === "nisan-luks" ? "#7A1220"
    : sablon.id === "dugun-luks" ? "#0D1F3C"
    : "#140828"
    : sablon.renk;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Kart Başlığı ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          {isPremium && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background:`linear-gradient(135deg,${renk},${sablon.id==="nisan-luks"?"#C4A05A":"#D4A84B"})` }}>
              ✦ PRİMİUM
            </span>
          )}
          <h2 className="text-lg font-bold text-gray-900">{sablon.isim}</h2>
          {sablon.aciklama && (
            <span className="hidden sm:inline text-sm text-gray-400">— {sablon.aciklama}</span>
          )}
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background:`${renk}12`, color:renk }}>
          {KAT_EMOJI[sablon.kategori]} {sablon.kategori.charAt(0).toUpperCase()+sablon.kategori.slice(1)}
        </span>
      </div>

      {/* ── Gövde: Telefon + Bilgi ── */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 p-6">
        {/* Sol — Bölüm Sekmeleri + Telefon */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="flex gap-1.5 mb-4 flex-wrap justify-center">
            {(bolumler as Bolum[]).map(b=>(
              <button key={b.id} onClick={()=>handleTab(b.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  aktifId===b.id ? "text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                style={aktifId===b.id ? { background:renk } : {}}>
                <span>{b.icon}</span> {b.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <TelefonMockup>
              <div className={`w-full h-full transition-opacity duration-150 ${gecis?"opacity-100":"opacity-0"}`}>
                {(aktif as Bolum).node}
              </div>
            </TelefonMockup>
            {kilitli && (
              <div className="absolute inset-0 rounded-[38px] flex flex-col items-center justify-center gap-3"
                style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(2px)" }}>
                <span className="text-4xl">👑</span>
                <p className="text-white text-xs font-bold text-center px-4 leading-snug">Ücretli Plan<br/>Gerekli</p>
              </div>
            )}
          </div>
        </div>

        {/* Sağ — Açıklama + Bölüm Listesi + CTA */}
        <div className="flex-1 max-w-lg w-full">
          {/* Aktif bölüm açıklaması */}
          <div className={`transition-all duration-200 mb-6 ${gecis?"opacity-100 translate-y-0":"opacity-0 translate-y-2"}`}>
            <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4"
              style={{ background:`${renk}12`, color:renk }}>
              {(aktif as Bolum).icon} {(aktif as Bolum).etiket}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{(aktif as Bolum).baslik}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{(aktif as Bolum).aciklama}</p>
          </div>

          {/* Bölüm listesi */}
          <div className="space-y-1.5 mb-8">
            {(bolumler as Bolum[]).map(b=>(
              <button key={b.id} onClick={()=>handleTab(b.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  aktifId===b.id ? "bg-gray-50 shadow-sm border border-gray-100" : "hover:bg-gray-50"
                }`}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                  style={{ background:aktifId===b.id?`${renk}12`:"transparent" }}>
                  {b.icon}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${aktifId===b.id?"text-gray-900":"text-gray-400"}`}>{b.label}</p>
                  <p className="text-xs text-gray-400 truncate">{b.baslik}</p>
                </div>
                {aktifId===b.id && <div className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background:renk }}/>}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            {kilitli ? (
              <button onClick={()=>router.push("/fiyatlar")}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{ background:"linear-gradient(135deg,#B45309,#D97706)" }}>
                <span>👑</span> Planı Yükselt — Oluştur
              </button>
            ) : (
              <button onClick={()=>router.push(`/olustur?sablon=${sablon.id}`)}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                style={{ background:renk }}>
                Davetiyeni Oluştur →
              </button>
            )}
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all text-center">
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
   ANA SAYFA
══════════════════════════════════════════════ */
export default function SablonlarSayfasi() {
  const [aktifKat, setAktifKat] = useState("hepsi");

  const filtrelenmis = useMemo(() => {
    const liste = aktifKat === "hepsi" ? SABLONLAR : SABLONLAR.filter(s=>s.kategori===aktifKat);
    return [...liste].sort((a,b) => {
      const aP = PREMIUM.has(a.id) ? 0 : 1;
      const bP = PREMIUM.has(b.id) ? 0 : 1;
      return aP - bP;
    });
  }, [aktifKat]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Başlık ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-10 text-center">
        <p className="text-xs text-purple-500 font-semibold tracking-[0.22em] uppercase mb-2">Şablonlar</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Dijital Davetiye Şablonları</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          {SABLONLAR.length} şablon. Her bölümü önizleyin, beğendiğinizi seçin.
        </p>
      </div>

      {/* ── Filtre Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
          {KATEGORILER.map(kat=>{
            const sayi = kat.id==="hepsi" ? SABLONLAR.length : SABLONLAR.filter(s=>s.kategori===kat.id).length;
            return (
              <button key={kat.id} onClick={()=>setAktifKat(kat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  aktifKat===kat.id ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {kat.id!=="hepsi" && <span>{KAT_EMOJI[kat.id]}</span>}
                {kat.isim}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${aktifKat===kat.id?"bg-white/20 text-white":"bg-gray-200 text-gray-500"}`}>{sayi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Şablon Listesi ── */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {filtrelenmis.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium">Bu kategoride şablon bulunamadı.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-700">{filtrelenmis.length}</span> şablon gösteriliyor
              {aktifKat!=="hepsi" && <> · <button onClick={()=>setAktifKat("hepsi")} className="text-purple-500 hover:underline ml-1">Tümünü gör</button></>}
            </p>
            {filtrelenmis.map(sablon=>(
              <SablonSatiri key={sablon.id} sablon={sablon}/>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

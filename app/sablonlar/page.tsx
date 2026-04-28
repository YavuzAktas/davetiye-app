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

/* ══════════════════════════════════════════════
   NİŞAN LÜKS — bordo & altın
══════════════════════════════════════════════ */
const NISAN = {
  id: "nisan-luks",
  isim: "Lüks Nişan",
  etiket: "Nişan",
  aciklamaKisa: "Bordo & altın, gül mühürlü",
  renk: "#7A1220",
  renkAdi: "Bordo",
  ornekUrl: "/davetiye/ornek-nisan",
  olusturUrl: "/olustur?sablon=nisan-luks",
  BG: "#3B0A14", BG_MED: "#4E1020", BG_DARK: "#270610",
  GOLD: "#C4A05A", CREAM: "#F5E8D8",
  bolumler: [
    {
      id:"kapak", label:"Kapak", icon:"🌹", etiket:"Açılış animasyonu",
      baslik:"Gül Mühürlü Kapak",
      aciklama:"Davetiye kapalı gelir — ortadaki gül mühürüne dokunulunca açılır. İlk izlenim unutulmaz.",
    },
    {
      id:"davetiye", label:"Davetiye", icon:"💍", etiket:"Ana bölüm",
      baslik:"Kemer Çerçeveli Hero",
      aciklama:"İsimler büyük el yazısıyla, altın çizgili kemer çerçeve içinde gösterilir. Tarih ve mekan altında yer alır.",
    },
    {
      id:"sayim", label:"Sayım", icon:"⏱️", etiket:"Otomatik güncellenir",
      baslik:"Canlı Geri Sayım",
      aciklama:"Nişana kaç gün, saat, dakika ve saniye kaldığını gerçek zamanlı olarak gösterir.",
    },
    {
      id:"katilim", label:"Katılım", icon:"💌", etiket:"Veri toplanır",
      baslik:"RSVP Formu",
      aciklama:"Misafirler katılıp katılmadıklarını ve kaç kişi olduklarını bildirebilir. Panelde görünür.",
    },
    {
      id:"mekan", label:"Mekan", icon:"📍", etiket:"Google Maps",
      baslik:"Konum & Harita",
      aciklama:"Mekan adı, saat ve tarih üç sütunda gösterilir. Altında Google Harita ve yol tarifi butonu yer alır.",
    },
    {
      id:"anilar", label:"Anılar", icon:"📷", etiket:"Fotoğraf galerisi",
      baslik:"Polaroid Fotoğraf Galerisi",
      aciklama:"Çiftin fotoğrafları polaroid tarzında, üst üste binmiş şekilde sergilenir.",
    },
  ],
};

const DUGUN = {
  id: "dugun-luks",
  isim: "Lüks Düğün",
  etiket: "Düğün",
  aciklamaKisa: "Lacivert & altın, yüzük mühürlü",
  renk: "#0D1F3C",
  renkAdi: "Lacivert",
  ornekUrl: "/davetiye/ornek-dugun",
  olusturUrl: "/olustur?sablon=dugun-luks",
  BG: "#0D1F3C", BG_MED: "#152C52", BG_DARK: "#071228",
  GOLD: "#D4AA70", CREAM: "#F8F3EE",
  bolumler: [
    {
      id:"kapak", label:"Kapak", icon:"💍", etiket:"Açılış animasyonu",
      baslik:"Yüzük Mühürlü Kapak",
      aciklama:"Davetiye kapalı gelir — ortadaki düğün yüzükleri mühürüne dokunulunca açılır. Çarpıcı ilk izlenim.",
    },
    {
      id:"davetiye", label:"Davetiye", icon:"🌟", etiket:"Ana bölüm",
      baslik:"Elmas Köşeli Hero",
      aciklama:"İsimler büyük el yazısıyla, köşelerinde altın elmas motifi olan dikdörtgen çerçeve içinde gösterilir.",
    },
    {
      id:"sayim", label:"Sayım", icon:"⏱️", etiket:"Otomatik güncellenir",
      baslik:"Canlı Geri Sayım",
      aciklama:"Düğüne kaç gün, saat, dakika ve saniye kaldığını gerçek zamanlı olarak gösterir.",
    },
    {
      id:"katilim", label:"Katılım", icon:"💌", etiket:"Veri toplanır",
      baslik:"RSVP Formu",
      aciklama:"Misafirler katılıp katılmadıklarını ve kaç kişi olduklarını bildirebilir. Panelde görünür.",
    },
    {
      id:"mekan", label:"Mekan", icon:"📍", etiket:"Google Maps",
      baslik:"Konum & Harita",
      aciklama:"Mekan adı, saat ve tarih üç sütunda gösterilir. Altında Google Harita ve yol tarifi butonu yer alır.",
    },
    {
      id:"anilar", label:"Albüm", icon:"📷", etiket:"Fotoğraf galerisi",
      baslik:"Polaroid Albüm",
      aciklama:"Çiftin fotoğrafları polaroid tarzında, üst üste binmiş şekilde lacivert zeminde sergilenir.",
    },
  ],
};

type SablonConfig = typeof NISAN;

/* ──────────────────────────────────────────
   ÖNIZLEME BİLEŞENLERİ
────────────────────────────────────────── */

/* Nişan Kapak */
function NisanKapak() {
  const { BG, BG_DARK, GOLD, CREAM } = NISAN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse at 50% 45%,#5C1020 0%,${BG} 55%,${BG_DARK} 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,rgba(196,160,90,0.055) 1px,transparent 1px)`, backgroundSize:"22px 22px" }}/>
      <p className="relative z-10 text-center mb-5" style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.1rem,4vw,1.5rem)", color:CREAM, lineHeight:1.2 }}>
        Aylin <span style={{ color:GOLD }}>&amp;</span> Yavuz
      </p>
      <div className="relative z-10" style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 5px ${BG},0 0 0 7px rgba(196,160,90,0.2),0 10px 30px rgba(10,0,6,0.7)` }}>
        <img src="/rose-seal.png" alt="" className="w-full h-full object-cover block"
          onError={e=>{(e.currentTarget as HTMLImageElement).style.display="none";(e.currentTarget.nextElementSibling as HTMLElement).style.display="flex";}}/>
        <div className="w-full h-full items-center justify-center hidden"
          style={{ background:`radial-gradient(circle at 38% 32%,#A01C2E 0%,#7A1220 40%,#3E0810 100%)` }}>
          <svg viewBox="0 0 200 200" className="w-3/4 h-3/4" fill="none">
            {[0,60,120,180,240,300].map(a=><ellipse key={a} cx="100" cy="52" rx="14" ry="22" fill="rgba(200,80,80,0.3)" transform={`rotate(${a} 100 100)`}/>)}
            <circle cx="100" cy="100" r="12" fill="rgba(225,105,105,0.65)"/>
            <circle cx="100" cy="100" r="5" fill="rgba(245,140,130,0.8)"/>
          </svg>
        </div>
      </div>
      <p className="relative z-10 mt-5" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.3em", color:GOLD }}>06 HAZİRAN 2026</p>
      <p className="relative z-10 mt-2" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, fontStyle:"italic", color:`${GOLD}55` }}>Mühüre dokun ✦</p>
    </div>
  );
}

/* Nişan Hero */
function NisanHero() {
  const { BG, GOLD, CREAM } = NISAN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 relative"
      style={{ background:`radial-gradient(ellipse at 50% 30%,#5C1020 0%,${BG} 60%)` }}>
      {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((c,i)=>(
        <span key={i} className={`absolute ${c} text-xs`} style={{ color:`${GOLD}40` }}>✦</span>
      ))}
      <div className="w-full max-w-45 text-center py-5 px-4" style={{ borderRadius:"70px 70px 10px 10px", border:`1px solid ${GOLD}30` }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.3em", color:GOLD, marginBottom:10 }}>NİŞAN DAVETİYESİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:CREAM, lineHeight:1 }}>Aylin</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(0.85rem,3vw,1rem)", color:GOLD, lineHeight:1.4 }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:CREAM, lineHeight:1, marginBottom:8 }}>Yavuz</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}50,transparent)`, margin:"8px 0" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.15em", color:`${CREAM}60` }}>06 HAZİRAN 2026 · İSTANBUL</p>
      </div>
    </div>
  );
}

/* Nişan Sayım */
function NisanSayim() {
  const { BG_MED, GOLD, CREAM } = NISAN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center" style={{ background:BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:GOLD, marginBottom:10 }}>NİŞANA KALAN SÜRE</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.2rem,4vw,1.6rem)", color:CREAM, marginBottom:20 }}>Sayıyoruz...</p>
      <div className="flex items-start gap-2 justify-center">
        {[{v:"43",l:"GÜN"},{v:"07",l:"SAAT"},{v:"42",l:"DAK"},{v:"39",l:"SAN"}].map((item,i)=>(
          <div key={i} className="flex items-start gap-1.5">
            <div className="text-center">
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"clamp(1.5rem,5vw,2rem)", fontWeight:600, color:CREAM, lineHeight:1 }}>{item.v}</p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.15em", color:GOLD, marginTop:4 }}>{item.l}</p>
            </div>
            {i<3 && <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"1.2rem", color:`${GOLD}40`, lineHeight:1.1, marginTop:2 }}>:</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Nişan Katılım */
function NisanKatilim() {
  const { BG_DARK, BG, GOLD } = NISAN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4" style={{ background:BG_DARK }}>
      <div className="w-full max-w-50 relative rounded-xl p-5" style={{ background:"#FAF0E4", boxShadow:"0 8px 30px rgba(0,0,0,0.4)" }}>
        <span className="absolute top-2 left-3 text-xs" style={{ color:GOLD, opacity:0.5 }}>✦</span>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.28em", color:"#8B5A4A", textAlign:"center", marginBottom:6 }}>KATILIM BİLDİRİMİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.3rem)", color:BG, textAlign:"center", marginBottom:10 }}>Gelecek misiniz?</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}50,transparent)`, marginBottom:12 }}/>
        {["ADINIZ SOYADINIZ","KAÇ KİŞİ?","KATILIM"].map(lbl=>(
          <div key={lbl} style={{ marginBottom:10 }}>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.22em", color:"#8B6550", marginBottom:3 }}>{lbl}</p>
            <div style={{ height:1, background:`${GOLD}40` }}/>
          </div>
        ))}
        <div style={{ marginTop:14, padding:"7px", background:BG, borderRadius:6, textAlign:"center", fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.28em", color:"#F5E8D8" }}>BİLDİR</div>
      </div>
    </div>
  );
}

/* Nişan Mekan */
function NisanMekan() {
  const { BG_MED, GOLD, CREAM } = NISAN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center" style={{ background:BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:GOLD, marginBottom:8 }}>MEKAN</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.4rem)", color:CREAM, marginBottom:16 }}>Nerede Buluşuyoruz?</p>
      <div className="flex gap-5 justify-center mb-4">
        {[{e:"📍",l:"MEKAN",v:"Çırağan"},{e:"🕐",l:"SAAT",v:"18:00"},{e:"📅",l:"TARİH",v:"06 Haz"}].map(col=>(
          <div key={col.l} className="text-center">
            <p style={{ fontSize:13, marginBottom:4 }}>{col.e}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.2em", color:GOLD, marginBottom:3 }}>{col.l}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, fontWeight:600, color:CREAM }}>{col.v}</p>
          </div>
        ))}
      </div>
      <div style={{ width:"85%", maxWidth:180, height:55, borderRadius:8, background:"rgba(255,255,255,0.06)", border:`1px solid ${GOLD}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, color:`${GOLD}50`, fontStyle:"italic" }}>📍 Harita görünümü</p>
      </div>
    </div>
  );
}

/* Nişan Anılar */
function NisanAnilar() {
  const { BG, BG_DARK, BG_MED, GOLD, CREAM } = NISAN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center"
      style={{ background:`linear-gradient(180deg,${BG} 0%,${BG_DARK} 100%)` }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:GOLD, marginBottom:8 }}>BİZİM HİKAYEMİZ</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.4rem)", color:CREAM, marginBottom:14 }}>En Güzel Anılar</p>
      <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}40,transparent)`, width:120, marginBottom:16 }}/>
      <div style={{ position:"relative", width:160, height:110 }}>
        {[{t:6,l:-14,r:-7},{t:12,l:18,r:4},{t:0,l:44,r:-2}].map((p,i)=>(
          <div key={i} style={{ position:"absolute", top:p.t, left:p.l, background:"#fff", borderRadius:2, padding:"4px 4px 16px", transform:`rotate(${p.r}deg)`, boxShadow:"0 4px 14px rgba(0,0,0,0.4)", width:76 }}>
            <div style={{ width:"100%", height:66, background:`linear-gradient(135deg,${BG_MED},#6B1828)`, borderRadius:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:18, opacity:0.2 }}>📷</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Düğün Kapak */
function DugunKapak() {
  const { BG, BG_DARK, GOLD, CREAM } = DUGUN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background:`radial-gradient(ellipse at 50% 45%,#1E3A6E 0%,${BG} 55%,${BG_DARK} 100%)` }}>
      <div className="absolute inset-0" style={{ backgroundImage:`radial-gradient(circle,rgba(212,170,112,0.06) 1px,transparent 1px)`, backgroundSize:"24px 24px" }}/>
      <p className="relative z-10 text-center mb-5" style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.1rem,4vw,1.5rem)", color:CREAM, lineHeight:1.2 }}>
        Selin <span style={{ color:GOLD }}>&amp;</span> Mert
      </p>
      {/* Yüzük mühür */}
      <div className="relative z-10" style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden",
        boxShadow:`0 0 0 5px ${BG},0 0 0 7px rgba(212,170,112,0.2),0 10px 30px rgba(0,6,20,0.7)` }}>
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
          background:`radial-gradient(circle at 38% 34%,#1E3A6E 0%,${BG} 50%,${BG_DARK} 100%)` }}>
          <svg viewBox="0 0 200 200" style={{ width:"75%", height:"75%" }} fill="none">
            <circle cx="80" cy="112" r="36" stroke={GOLD} strokeWidth="7" fill="none" opacity="0.9"/>
            <circle cx="120" cy="112" r="36" stroke={GOLD} strokeWidth="7" fill="none" opacity="0.9"/>
            <polygon points="100,46 114,62 100,76 86,62" fill={GOLD} opacity="0.88"/>
            <polygon points="100,46 114,62 100,56 86,62" fill="rgba(255,255,255,0.25)"/>
          </svg>
        </div>
      </div>
      <p className="relative z-10 mt-5" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.3em", color:GOLD }}>12 EYLÜL 2026</p>
      <p className="relative z-10 mt-2" style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, fontStyle:"italic", color:`${GOLD}55` }}>Mühüre dokun ◆</p>
    </div>
  );
}

/* Düğün Hero */
function DugunHero() {
  const { BG, GOLD, CREAM } = DUGUN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 relative"
      style={{ background:`radial-gradient(ellipse at 50% 30%,#1E3A6E 0%,${BG} 60%)` }}>
      {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((c,i)=>(
        <span key={i} className={`absolute ${c} text-xs`} style={{ color:`${GOLD}40` }}>◆</span>
      ))}
      <div className="w-full max-w-45 text-center py-5 px-4" style={{ border:`1px solid ${GOLD}30`, borderRadius:4, position:"relative" }}>
        {/* Köşe elmasları */}
        {[{top:-5,left:-5},{top:-5,right:-5},{bottom:-5,left:-5},{bottom:-5,right:-5}].map((pos,i)=>(
          <div key={i} style={{ position:"absolute", ...pos, width:10, height:10, transform:"rotate(45deg)", background:GOLD, opacity:0.6 }}/>
        ))}
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.3em", color:GOLD, marginBottom:10 }}>DÜĞÜN DAVETİYESİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:CREAM, lineHeight:1 }}>Selin</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(0.85rem,3vw,1rem)", color:GOLD, lineHeight:1.4 }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.4rem,5vw,1.9rem)", color:CREAM, lineHeight:1, marginBottom:8 }}>Mert</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}50,transparent)`, margin:"8px 0" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.15em", color:`${CREAM}60` }}>12 EYLÜL 2026 · İSTANBUL</p>
      </div>
    </div>
  );
}

/* Düğün Sayım */
function DugunSayim() {
  const { BG_MED, GOLD, CREAM } = DUGUN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center" style={{ background:BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:GOLD, marginBottom:10 }}>DÜĞÜNE KALAN SÜRE</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1.2rem,4vw,1.6rem)", color:CREAM, marginBottom:20 }}>Sayıyoruz...</p>
      <div className="flex items-start gap-2 justify-center">
        {[{v:"136",l:"GÜN"},{v:"14",l:"SAAT"},{v:"28",l:"DAK"},{v:"51",l:"SAN"}].map((item,i)=>(
          <div key={i} className="flex items-start gap-1.5">
            <div className="text-center">
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"clamp(1.5rem,5vw,2rem)", fontWeight:600, color:CREAM, lineHeight:1 }}>{item.v}</p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.15em", color:GOLD, marginTop:4 }}>{item.l}</p>
            </div>
            {i<3 && <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:"1.2rem", color:`${GOLD}40`, lineHeight:1.1, marginTop:2 }}>:</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Düğün Katılım */
function DugunKatilim() {
  const { BG_DARK, BG, GOLD } = DUGUN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4" style={{ background:BG_DARK }}>
      <div className="w-full max-w-50 relative rounded-xl p-5" style={{ background:"#FFFDF9", boxShadow:"0 8px 30px rgba(0,0,0,0.4)" }}>
        <span className="absolute top-2 left-3 text-xs" style={{ color:GOLD, opacity:0.5 }}>◆</span>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.28em", color:"#7A6040", textAlign:"center", marginBottom:6 }}>KATILIM BİLDİRİMİ</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.3rem)", color:BG, textAlign:"center", marginBottom:10 }}>Gelecek misiniz?</p>
        <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}50,transparent)`, marginBottom:12 }}/>
        {["ADINIZ SOYADINIZ","KAÇ KİŞİ?","KATILIM"].map(lbl=>(
          <div key={lbl} style={{ marginBottom:10 }}>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.22em", color:"#7A6040", marginBottom:3 }}>{lbl}</p>
            <div style={{ height:1, background:`${GOLD}40` }}/>
          </div>
        ))}
        <div style={{ marginTop:14, padding:"7px", background:BG, borderRadius:6, textAlign:"center", fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.28em", color:"#F8F3EE" }}>BİLDİR</div>
      </div>
    </div>
  );
}

/* Düğün Mekan */
function DugunMekan() {
  const { BG_MED, GOLD, CREAM } = DUGUN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center" style={{ background:BG_MED }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:GOLD, marginBottom:8 }}>MEKAN</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.4rem)", color:CREAM, marginBottom:16 }}>Nerede Buluşuyoruz?</p>
      <div className="flex gap-5 justify-center mb-4">
        {[{e:"📍",l:"MEKAN",v:"Four Seasons"},{e:"🕐",l:"SAAT",v:"19:00"},{e:"📅",l:"TARİH",v:"12 Eyl"}].map(col=>(
          <div key={col.l} className="text-center">
            <p style={{ fontSize:13, marginBottom:4 }}>{col.e}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:7, letterSpacing:"0.2em", color:GOLD, marginBottom:3 }}>{col.l}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, fontWeight:600, color:CREAM }}>{col.v}</p>
          </div>
        ))}
      </div>
      <div style={{ width:"85%", maxWidth:180, height:55, borderRadius:8, background:"rgba(255,255,255,0.06)", border:`1px solid ${GOLD}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, color:`${GOLD}50`, fontStyle:"italic" }}>📍 Harita görünümü</p>
      </div>
    </div>
  );
}

/* Düğün Albüm */
function DugunAnilar() {
  const { BG, BG_DARK, BG_MED, GOLD, CREAM } = DUGUN;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center"
      style={{ background:`linear-gradient(180deg,${BG} 0%,${BG_DARK} 100%)` }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:8, letterSpacing:"0.35em", color:GOLD, marginBottom:8 }}>BİZİM HİKAYEMİZ</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:"clamp(1rem,4vw,1.4rem)", color:CREAM, marginBottom:14 }}>En Güzel Anılar</p>
      <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}40,transparent)`, width:120, marginBottom:16 }}/>
      <div style={{ position:"relative", width:160, height:110 }}>
        {[{t:6,l:-14,r:-7},{t:12,l:18,r:4},{t:0,l:44,r:-2}].map((p,i)=>(
          <div key={i} style={{ position:"absolute", top:p.t, left:p.l, background:"#fff", borderRadius:2, padding:"4px 4px 16px", transform:`rotate(${p.r}deg)`, boxShadow:"0 4px 14px rgba(0,0,0,0.4)", width:76 }}>
            <div style={{ width:"100%", height:66, background:`linear-gradient(135deg,${BG_MED},#1E3D72)`, borderRadius:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:18, opacity:0.2 }}>📷</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const NISAN_PREVIEWS: Record<string, React.ReactNode> = {
  kapak: <NisanKapak/>, davetiye: <NisanHero/>, sayim: <NisanSayim/>,
  katilim: <NisanKatilim/>, mekan: <NisanMekan/>, anilar: <NisanAnilar/>,
};

const DUGUN_PREVIEWS: Record<string, React.ReactNode> = {
  kapak: <DugunKapak/>, davetiye: <DugunHero/>, sayim: <DugunSayim/>,
  katilim: <DugunKatilim/>, mekan: <DugunMekan/>, anilar: <DugunAnilar/>,
};

/* ─── Telefon Mockup ─── */
function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width:260 }}>
      <div className="relative rounded-[38px] overflow-hidden shadow-2xl shadow-black/40"
        style={{ background:"#1a1a1a", padding:"14px 10px",
          boxShadow:"0 0 0 1px #333,0 30px 80px rgba(0,0,0,0.5),inset 0 0 0 1px #444" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width:80, height:26, background:"#1a1a1a", borderRadius:"0 0 16px 16px" }}/>
        <div className="rounded-3xl overflow-hidden relative" style={{ height:500, background:"#000" }}>
          {children}
        </div>
      </div>
      <div className="absolute right-0 top-24 w-1 h-10 rounded-l bg-gray-700" style={{ right:-1 }}/>
      <div className="absolute left-0 top-20 w-1 h-8 rounded-r bg-gray-700" style={{ left:-1 }}/>
      <div className="absolute left-0 top-32 w-1 h-8 rounded-r bg-gray-700" style={{ left:-1 }}/>
    </div>
  );
}

/* ─── Ana Sayfa ─── */
export default function SablonlarSayfasi() {
  const router = useRouter();
  const [secilenSablon, setSecilenSablon] = useState<"nisan-luks"|"dugun-luks">("nisan-luks");
  const [aktifBolum, setAktifBolum] = useState("kapak");
  const [gecis, setGecis] = useState(true);
  const [statsRef, statsVisible] = useInView(0.2);

  const sablon: SablonConfig = secilenSablon === "nisan-luks" ? NISAN : DUGUN;
  const previews = secilenSablon === "nisan-luks" ? NISAN_PREVIEWS : DUGUN_PREVIEWS;
  const bolumBilgi = sablon.bolumler.find(b=>b.id===aktifBolum) ?? sablon.bolumler[0];

  const handleSablon = (id: "nisan-luks"|"dugun-luks") => {
    if (id === secilenSablon) return;
    setGecis(false);
    setTimeout(() => { setSecilenSablon(id); setAktifBolum("kapak"); setGecis(true); }, 180);
  };

  const handleBolum = (id: string) => {
    if (id === aktifBolum) return;
    setGecis(false);
    setTimeout(() => { setAktifBolum(id); setGecis(true); }, 180);
  };

  return (
    <div className="overflow-x-hidden">

      {/* ══ BAŞLIK ══ */}
      <div className="bg-gray-50 pt-12 pb-6 px-4 text-center">
        <p className="text-xs text-purple-500 font-semibold tracking-[0.22em] uppercase mb-2">Şablonlar</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Lüks Dijital Davetiyeler</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Her etkinliğe özel tasarlanmış şablonlar. Aşağıdan birini seçin ve bölümleri inceleyin.
        </p>
      </div>

      {/* ══ ŞABLON SEÇİCİ ══ */}
      <div className="bg-gray-50 px-4 pb-2">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {([NISAN, DUGUN] as SablonConfig[]).map(s => (
              <button key={s.id} onClick={() => handleSablon(s.id as "nisan-luks"|"dugun-luks")}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                  secilenSablon === s.id
                    ? "border-transparent shadow-lg scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                style={secilenSablon === s.id ? { background: s.renk, boxShadow:`0 8px 30px ${s.renk}40` } : {}}>
                <p className={`text-xs font-bold mb-1 ${secilenSablon === s.id ? "text-white/70" : "text-gray-400"}`}>
                  {s.etiket}
                </p>
                <p className={`text-sm font-bold ${secilenSablon === s.id ? "text-white" : "text-gray-800"}`}>
                  {s.isim}
                </p>
                <p className={`text-xs mt-1 ${secilenSablon === s.id ? "text-white/60" : "text-gray-400"}`}>
                  {s.aciklamaKisa}
                </p>
                {secilenSablon === s.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BÖLÜM SEKMELERİ ══ */}
      <div className="bg-gray-50 px-4 pb-0 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide">
            {sablon.bolumler.map(b=>(
              <button key={b.id} onClick={()=>handleBolum(b.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  aktifBolum===b.id ? "text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                }`}
                style={aktifBolum===b.id ? { background:sablon.renk } : {}}>
                <span>{b.icon}</span> {b.label}
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
                <div className={`w-full h-full transition-opacity duration-180 ${gecis?"opacity-100":"opacity-0"}`}>
                  {previews[aktifBolum] ?? previews["kapak"]}
                </div>
              </TelefonMockup>
            </div>

            {/* Sağ — açıklama */}
            <div className="flex-1 max-w-lg">
              <div className={`transition-all duration-200 ${gecis?"opacity-100 translate-y-0":"opacity-0 translate-y-2"}`}>
                <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4"
                  style={{ background:`${sablon.renk}15`, color:sablon.renk }}>
                  {bolumBilgi.icon} {bolumBilgi.etiket}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{bolumBilgi.baslik}</h2>
                <p className="text-gray-500 text-base leading-relaxed mb-8">{bolumBilgi.aciklama}</p>
              </div>

              {/* Bölümler listesi */}
              <div className="space-y-2">
                {sablon.bolumler.map(b=>(
                  <button key={b.id} onClick={()=>handleBolum(b.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                      aktifBolum===b.id ? "bg-white shadow-md border border-gray-100" : "hover:bg-white/60"
                    }`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all ${aktifBolum===b.id?"scale-110":""}`}
                      style={{ background:aktifBolum===b.id?`${sablon.renk}12`:"rgba(0,0,0,0.04)" }}>
                      {b.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${aktifBolum===b.id?"text-gray-900":"text-gray-500"}`}>{b.label}</p>
                      <p className="text-xs text-gray-400 truncate">{b.baslik}</p>
                    </div>
                    {aktifBolum===b.id && <div className="ml-auto w-2 h-2 rounded-full shrink-0" style={{ background:sablon.renk }}/>}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={()=>router.push(sablon.olusturUrl)}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background:sablon.renk }}>
                  Davetiyeni Oluştur →
                </button>
                <a href={sablon.ornekUrl} target="_blank"
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full bg-purple-800 opacity-20 blur-[80px]"/>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-900 opacity-15 blur-[60px]"/>
        <div ref={statsRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-20 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n:"500+", l:"Davetiye Gönderildi", icon:"💌" },
              { n:"%98",  l:"Memnuniyet Oranı",   icon:"⭐" },
              { n:"3 dk", l:"Oluşturma Süresi",   icon:"⚡" },
              { n:"∞",    l:"Paylaşım İmkânı",    icon:"🔗" },
            ].map(({ n, l, icon }, i) => (
              <div key={l} className={`group transition-all duration-700 ${statsVisible?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}
                style={{ transitionDelay:`${i*120}ms` }}>
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
        <div className="absolute inset-0 bg-linear-to-br from-purple-800 via-purple-600 to-pink-600"/>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize:"28px 28px" }}/>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"/>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-8">✨</div>
          <p className="text-white/60 text-sm mb-3 tracking-[0.2em] uppercase">Hemen başla</p>
          <h3 className="text-4xl md:text-5xl text-white mb-4 leading-tight" style={{ fontFamily:"var(--font-dancing),cursive" }}>
            Etkinliğinize özel davetiye
          </h3>
          <p className="text-white/60 text-base mb-12">
            İsimler, tarih, mekan ve mesajı girmeniz yeterli — dakikalar içinde hazır.
          </p>
          <button onClick={()=>router.push(sablon.olusturUrl)}
            className="group inline-flex items-center gap-3 bg-white text-purple-700 px-10 py-5 rounded-2xl text-base font-bold hover:bg-purple-50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/30 hover:-translate-y-1">
            Hemen Oluştur
            <span className="text-lg group-hover:translate-x-1.5 transition-transform inline-block">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

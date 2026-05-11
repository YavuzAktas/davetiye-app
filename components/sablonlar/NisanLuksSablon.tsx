"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import MuzikCalar from "@/components/MuzikCalar";

/* ─── Renkler ─── */
const BG      = "#3B0A14";
const BG_DARK = "#270610";
const BG_MED  = "#4E1020";
const GOLD    = "#C4A05A";
const CREAM   = "#F5E8D8";
const CREAM2  = "#FAF0E4";

/* ─── Altın yatay süs çizgisi ─── */
function GoldDivider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"8px 0" }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${GOLD}70)` }}/>
      <span style={{ color:GOLD, fontSize:9, letterSpacing:5 }}>✦</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${GOLD}70)` }}/>
    </div>
  );
}

/* ─── Gül Mühür ─── */
function RoseSeal({ size = 220, onClick }: { size?: number; onClick?: () => void }) {
  const [tapped, setTapped] = useState(false);

  const handleClick = () => {
    if (tapped) return;
    setTapped(true);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: size, height: size,
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0, position: "relative",
        animation: tapped
          ? "sealTap 0.4s ease forwards"
          : "sealIdle 5s ease-in-out infinite",
      }}
    >
      <Image src="/rose-seal.png" alt="Gül Mühür" fill className="object-contain" />
    </div>
  );
}

/* ─── Polaroid kart ─── */
function Polaroid({ rotate=0, isActive=false, src }: { rotate?:number; isActive?:boolean; src?:string }) {
  return (
    <div style={{
      background:"#fff",
      borderRadius:4,
      padding:"10px 10px 36px",
      transform: isActive ? `rotate(${rotate}deg) scale(1.12)` : `rotate(${rotate}deg) scale(1)`,
      boxShadow: isActive 
        ? "0 25px 50px rgba(0,0,0,0.5), 0 8px 15px rgba(0,0,0,0.3)"
        : "0 12px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
      width:170, flexShrink:0,
      transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease",
      cursor: "pointer"
    }}>
      <div style={{
        width:"100%", height:190,
        background:`linear-gradient(135deg, #6B1828 0%, #470D1A 100%)`,
        borderRadius:2,
        display:"flex", alignItems:"center", justifyContent:"center",
        overflow: "hidden"
      }}>
        {src ? (
          <img src={src} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="Anı" />
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.12)">
            <path d="M4 6h3.5l1.5-2h6l1.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-1.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ANA BİLEŞEN
───────────────────────────────────────── */
export default function NisanLuksSablon({ davetiye }: SablonProps) {
  const [acildi, setAcildi] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [aktifPolaroid, setAktifPolaroid] = useState<number | null>(null);

  /* Tarih bilgileri */
  const tarihObj = davetiye.tarih ? new Date(davetiye.tarih) : null;
  const tarihStr = tarihObj
    ? tarihObj.toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" })
    : null;
  const tarihKisa = tarihObj
    ? tarihObj.toLocaleDateString("tr-TR", { day:"2-digit", month:"long", year:"numeric" }).toUpperCase()
    : null;
  const saatStr = tarihObj
    ? tarihObj.toLocaleTimeString("tr-TR", { hour:"2-digit", minute:"2-digit" })
    : null;

  /* Geri sayım */
  const calc = () => {
    if (!tarihObj) return { gun:0, saat:0, dakika:0, saniye:0 };
    const f = tarihObj.getTime() - Date.now();
    if (f <= 0) return { gun:0, saat:0, dakika:0, saniye:0 };
    return {
      gun:    Math.floor(f / 86400000),
      saat:   Math.floor((f % 86400000) / 3600000),
      dakika: Math.floor((f % 3600000) / 60000),
      saniye: Math.floor((f % 60000) / 1000),
    };
  };
  const [kalan, setKalan] = useState(calc);
  useEffect(() => {
    if (!tarihObj) return;
    const id = setInterval(() => setKalan(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  /* İsimler */
  const isim1 = davetiye.kisi1 || davetiye.baslik.split(/[&ve]/i)[0]?.trim() || davetiye.baslik;
  const isim2 = davetiye.kisi2 || davetiye.baslik.split(/[&ve]/i)[1]?.trim() || null;

  return (
    <>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}
        @keyframes sealIdle{
          0%,100%{transform:rotate(-1.5deg) translateY(0) scale(1)}
          50%{transform:rotate(1.5deg) translateY(-6px) scale(1.02)}
        }
        @keyframes sealTap{
          0%{transform:scale(1) rotate(0deg)}
          30%{transform:scale(0.88) rotate(-2deg)}
          65%{transform:scale(1.07) rotate(1deg)}
          100%{transform:scale(1) rotate(0deg)}
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      {davetiye.muzik && <MuzikCalar muzikUrl={davetiye.muzik} renk={GOLD} />}

      {/* ══ KAPALI DURUM ══ */}
      {!acildi && (
      <div className="min-h-screen flex flex-col relative overflow-hidden select-none"
        style={{ background:`radial-gradient(ellipse at 50% 45%,#5C1020 0%,${BG} 55%,${BG_DARK} 100%)` }}>

        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:`radial-gradient(circle,rgba(196,160,90,0.05) 1px,transparent 1px)`,
          backgroundSize:"30px 30px",
        }}/>

        {/* Orta Alan: İsimler, Mühür ve Tarih */}
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-8">
          <p className="relative z-10 text-center px-8 mb-10" style={{
            fontFamily:"var(--font-dancing),cursive",
            fontSize:"clamp(2.8rem,9vw,4.5rem)",
            color: CREAM,
            lineHeight: 1.15,
            letterSpacing: 1,
            textShadow: "0 2px 10px rgba(0,0,0,0.2)"
          }}>
            {isim1}
            {isim2 && <><span style={{ color:GOLD }}> & </span>{isim2}</>}
          </p>

          <div className="relative z-10 flex flex-col items-center"
            style={{ opacity: animating ? 0 : 1, transition:"opacity 0.55s ease" }}>
            <RoseSeal size={240} onClick={() => { document.dispatchEvent(new CustomEvent("muzik-baslat")); setAnimating(true); setTimeout(() => setAcildi(true), 580); }} />

            <div className="mt-10 text-center">
              {tarihKisa && (
                <p style={{
                  fontFamily:"var(--font-cormorant),serif",
                  fontSize:15, letterSpacing:"0.4em",
                  color:GOLD, marginBottom:12, fontWeight: 600,
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                }}>{tarihKisa}</p>
              )}
              <p style={{
                fontFamily:"var(--font-cormorant),serif",
                fontSize:13, fontStyle:"italic",
                color:`${GOLD}70`, letterSpacing:"0.15em",
              }}>Mühüre dokun ✦</p>
            </div>
          </div>
        </div>


      </div>
      )}

      {/* ══ AÇIK DURUM ══ */}
      {acildi && (
      <div style={{ background:BG, minHeight:"100vh", overflowX:"hidden" }}>

      {/* ════════════════════════════════════
          BÖLÜM 1 — BİZ (Hero kemer)
      ════════════════════════════════════ */}
      <section id="biz" style={{
        minHeight:"100svh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"60px 24px 80px", position:"relative",
        background:`radial-gradient(ellipse at 50% 30%,#5C1020 0%,${BG} 60%)`,
      }}>
        {(["top-5 left-5","top-5 right-5","bottom-5 left-5","bottom-5 right-5"] as const).map((cls,i) => (
          <span key={i} className={`absolute ${cls}`} style={{ color:`${GOLD}50`, fontSize:14 }}>✦</span>
        ))}

        <div style={{
          position:"relative", maxWidth:400, width:"100%",
          borderRadius:"130px 130px 18px 18px",
          border:`1px solid ${GOLD}38`,
          padding:"56px 36px 48px",
          textAlign:"center",
          boxShadow:`inset 0 0 80px rgba(196,160,90,0.03)`,
        }}>
          <div style={{
            position:"absolute", inset:9,
            borderRadius:"123px 123px 12px 12px",
            border:`1px solid ${GOLD}18`,
            pointerEvents:"none",
          }}/>

          <p style={{
            fontFamily:"var(--font-cormorant),serif",
            fontSize:11, letterSpacing:"0.38em",
            color:GOLD, textTransform:"uppercase", marginBottom:22,
          }}>Nişan Davetiyesi</p>

          <p style={{
            fontFamily:"var(--font-dancing),cursive",
            fontSize:"clamp(3.8rem,13vw,6rem)",
            color:CREAM, lineHeight:1, marginBottom:4,
          }}>{isim1}</p>

          <p style={{
            fontFamily:"var(--font-dancing),cursive",
            fontSize:"clamp(1.8rem,5vw,2.6rem)",
            color:GOLD, lineHeight:1.3, margin:"6px 0",
          }}>&</p>

          {isim2 && (
            <p style={{
              fontFamily:"var(--font-dancing),cursive",
              fontSize:"clamp(3.8rem,13vw,6rem)",
              color:CREAM, lineHeight:1, marginBottom:8,
            }}>{isim2}</p>
          )}

          <div style={{ margin:"20px auto", maxWidth:220 }}>
            <GoldDivider/>
          </div>

          <p style={{
            fontFamily:"var(--font-cormorant),serif",
            fontSize:13, letterSpacing:"0.22em",
            color:`${CREAM}70`, marginBottom:10,
          }}>
            {tarihKisa}{tarihKisa && davetiye.mekan ? " · " : ""}{davetiye.mekan?.toUpperCase()}
          </p>

          <p style={{
            fontFamily:"var(--font-cormorant),serif",
            fontSize:14, fontStyle:"italic",
            color:`${CREAM}55`, marginTop:8,
          }}>Bizi bu özel günde yanınızda görmek isteriz</p>
        </div>

        <div style={{ marginTop:44, textAlign:"center" }}>
          <p style={{
            fontFamily:"var(--font-cormorant),serif",
            fontSize:10, letterSpacing:"0.32em",
            color:`${GOLD}55`, marginBottom:10,
            textTransform:"uppercase",
          }}>Aşağı Kaydır</p>
          <div style={{
            width:28, height:28,
            border:`1px solid ${GOLD}30`, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto", color:`${GOLD}55`, fontSize:13,
            animation:"bounce 2s infinite",
          }}>↓</div>
        </div>
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 2 — ANILAR (Polaroid)
      ════════════════════════════════════ */}
      {davetiye.albumAktif && <section id="anilar" style={{
        padding:"80px 24px", textAlign:"center", background:BG
      }}>
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:11, letterSpacing:"0.38em",
          color:GOLD, textTransform:"uppercase", marginBottom:14,
        }}>Bizim Hikayemiz</p>

        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.6rem,8vw,4rem)",
          color:CREAM, lineHeight:1.1, marginBottom:24,
        }}>En Güzel Anılar</p>

        <div style={{ maxWidth:200, margin:"0 auto 52px" }}>
          <GoldDivider/>
        </div>

        {/* Polaroidler */}
        <div style={{ display:"flex", justifyContent:"center", minHeight:340, marginBottom:40 }}>
          <div style={{ position:"relative", width:280, height:280 }}>
            {/* Sol Polaroid */}
            <div 
              onMouseEnter={() => setAktifPolaroid(1)}
              onMouseLeave={() => setAktifPolaroid(null)}
              onTouchStart={() => setAktifPolaroid(1)}
              style={{ position:"absolute", top:45, left: -5, zIndex: aktifPolaroid === 1 ? 10 : 1, animation:"fadeUp 0.8s ease backwards 0s" }}
            >
              <div style={{ animation: "float 6s ease-in-out infinite 0s" }}>
                <Polaroid rotate={-8} isActive={aktifPolaroid === 1} />
              </div>
            </div>
            {/* Orta Polaroid */}
            <div 
              onMouseEnter={() => setAktifPolaroid(2)}
              onMouseLeave={() => setAktifPolaroid(null)}
              onTouchStart={() => setAktifPolaroid(2)}
              style={{ position:"absolute", top:20, left: 45, zIndex: aktifPolaroid === 2 ? 10 : 2, animation:"fadeUp 0.8s ease backwards 0.2s" }}
            >
              <div style={{ animation: "float 6.5s ease-in-out infinite 0.5s" }}>
                <Polaroid rotate={-2} isActive={aktifPolaroid === 2} />
              </div>
            </div>
            {/* Sağ Polaroid */}
            <div 
              onMouseEnter={() => setAktifPolaroid(3)}
              onMouseLeave={() => setAktifPolaroid(null)}
              onTouchStart={() => setAktifPolaroid(3)}
              style={{ position:"absolute", top:40, left: 95, zIndex: aktifPolaroid === 3 ? 10 : 3, animation:"fadeUp 0.8s ease backwards 0.4s" }}
            >
              <div style={{ animation: "float 7s ease-in-out infinite 1s" }}>
                <Polaroid rotate={5} isActive={aktifPolaroid === 3} />
              </div>
            </div>
          </div>
        </div>

        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:18, fontStyle:"italic",
          color:`${CREAM}55`,
        }}>Sonsuz bir yolculuğun ilk adımları... ✦</p>
      </section>}

      {/* ════════════════════════════════════
          BÖLÜM 3 — SAYIM (Geri Sayım)
      ════════════════════════════════════ */}
      <section id="sayim" style={{ padding:"80px 24px", textAlign:"center", background:BG_MED }}>
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:11, letterSpacing:"0.38em",
          color:GOLD, textTransform:"uppercase", marginBottom:14,
        }}>Nişana Kalan Süre</p>

        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.4rem,7vw,3.6rem)",
          color:CREAM, marginBottom:52,
        }}>
          {tarihObj && tarihObj > new Date() ? "Sayıyoruz..." : "Kutlama Zamanı! 🎊"}
        </p>

        <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:"clamp(8px,3vw,16px)", flexWrap:"wrap" }}>
          {[
            { val: kalan.gun,    lbl:"GÜN" },
            { val: kalan.saat,   lbl:"SAAT" },
            { val: kalan.dakika, lbl:"DAKİKA" },
            { val: kalan.saniye, lbl:"SANİYE" },
          ].map((item, i) => (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"clamp(6px,2vw,14px)" }}>
              <div style={{ textAlign:"center" }}>
                <p style={{
                  fontFamily:"var(--font-cormorant),serif",
                  fontSize:"clamp(3.2rem,10vw,5.2rem)",
                  fontWeight:600,
                  color:CREAM, lineHeight:1,
                  fontVariantNumeric:"tabular-nums",
                  minWidth:"2ch",
                }}>{String(item.val).padStart(2,"0")}</p>
                <p style={{
                  fontFamily:"var(--font-cormorant),serif",
                  fontSize:10, letterSpacing:"0.22em",
                  color:GOLD, marginTop:8,
                }}>{item.lbl}</p>
              </div>
              {i < 3 && (
                <p style={{
                  fontFamily:"var(--font-cormorant),serif",
                  fontSize:"clamp(2rem,6vw,3.5rem)",
                  color:`${GOLD}50`, lineHeight:1.1,
                  marginTop:4,
                }}>:</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 4 — KATILIM (RSVP)
      ════════════════════════════════════ */}
      <section id="katilim" style={{ padding:"80px 24px", background:BG_DARK }}>
        <div style={{ maxWidth:480, margin:"0 auto" }}>
          <div style={{
            background:CREAM2,
            borderRadius:16,
            padding:"40px 32px 44px",
            position:"relative",
            boxShadow:"0 24px 70px rgba(0,0,0,0.45)",
          }}>
            <span style={{ position:"absolute", top:18, left:22, color:GOLD, fontSize:13, opacity:0.55 }}>✦</span>
            <span style={{ position:"absolute", bottom:18, right:22, color:GOLD, fontSize:13, opacity:0.55 }}>✦</span>

            <p style={{
              fontFamily:"var(--font-cormorant),serif",
              fontSize:11, letterSpacing:"0.32em",
              color:"#8B5A4A", textAlign:"center",
              textTransform:"uppercase", marginBottom:10,
            }}>Katılım Bildirimi</p>

            <p style={{
              fontFamily:"var(--font-dancing),cursive",
              fontSize:"clamp(2rem,7vw,3rem)",
              color:BG, textAlign:"center", lineHeight:1.1, marginBottom:24,
            }}>Gelecek misiniz?</p>

            <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}60,transparent)`, marginBottom:30 }}/>

            <RsvpFormKrem davetiyeId={davetiye.id} spotifyAktif={davetiye.spotifyAktif}/>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 5 — MEKAN
      ════════════════════════════════════ */}
      <section id="mekan" style={{ padding:"80px 24px", textAlign:"center", background:BG }}>
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:11, letterSpacing:"0.38em",
          color:GOLD, textTransform:"uppercase", marginBottom:14,
        }}>Mekan</p>

        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.4rem,7vw,3.8rem)",
          color:CREAM, marginBottom:44,
        }}>Nerede Buluşuyoruz?</p>

        <div style={{
          display:"flex", justifyContent:"center",
          gap:"clamp(24px,6vw,60px)", flexWrap:"wrap", marginBottom:40,
        }}>
          {[
            { emoji:"📍", lbl:"MEKAN",  val:davetiye.mekan ?? "Belirtilmedi" },
            { emoji:"🕐", lbl:"SAAT",   val:saatStr ?? "—" },
            { emoji:"📅", lbl:"TARİH",  val:tarihStr ?? "—" },
          ].map(col => (
            <div key={col.lbl} style={{ textAlign:"center", minWidth:90 }}>
              <div style={{ fontSize:22, marginBottom:10 }}>{col.emoji}</div>
              <p style={{
                fontFamily:"var(--font-cormorant),serif",
                fontSize:10, letterSpacing:"0.25em",
                color:GOLD, marginBottom:8, textTransform:"uppercase",
              }}>{col.lbl}</p>
              <p style={{
                fontFamily:"var(--font-cormorant),serif",
                fontSize:15, fontWeight:600,
                color:CREAM,
              }}>{col.val}</p>
            </div>
          ))}
        </div>

        {davetiye.mekan && (
          <div style={{
            maxWidth:560, margin:"0 auto 28px",
            borderRadius:12, overflow:"hidden",
            border:`1px solid ${GOLD}22`,
            boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
          }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%" height="260"
              style={{ border:0, display:"block" }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        background:BG_DARK,
        padding:"20px 24px 80px",
        textAlign:"center",
      }}>
        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.4rem,7vw,3.6rem)",
          color:CREAM,
        }}>Sizi çok seviyoruz 💛</p>
      </footer>

    </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   RSVP FORMU — krem kart içi
───────────────────────────────────────── */
type SarkiSonuc = { id:string; uri:string; isim:string; sanatci:string; kapak:string|null };

function RsvpFormKrem({ davetiyeId, spotifyAktif=false }: { davetiyeId: string; spotifyAktif?: boolean }) {
  const [adim, setAdim] = useState<"form"|"tamam">("form");
  const [form, setForm] = useState({ ad:"", kisiSayisi:"1", katilim:"" });
  const [secilenDiyet, setSecilenDiyet] = useState<string[]>([]);
  const toggleDiyet = (k: string) => setSecilenDiyet(p => p.includes(k) ? p.filter(d => d !== k) : [...p, k]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [sarkiSorgu, setSarkiSorgu] = useState("");
  const [sarkiSonuclar, setSarkiSonuclar] = useState<SarkiSonuc[]>([]);
  const [seciliSarki, setSeciliSarki] = useState<SarkiSonuc|null>(null);
  const [sarkiAraniyor, setSarkiAraniyor] = useState(false);
  const araTimerRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    if (!spotifyAktif || sarkiSorgu.length < 2) { setSarkiSonuclar([]); return; }
    if (araTimerRef.current) clearTimeout(araTimerRef.current);
    araTimerRef.current = setTimeout(async () => {
      setSarkiAraniyor(true);
      try {
        const res = await fetch(`/api/sarki/ara?q=${encodeURIComponent(sarkiSorgu)}`);
        if (res.ok) setSarkiSonuclar(await res.json());
      } finally { setSarkiAraniyor(false); }
    }, 400);
    return () => { if (araTimerRef.current) clearTimeout(araTimerRef.current); };
  }, [sarkiSorgu, spotifyAktif]);

  const fieldStyle: React.CSSProperties = {
    width:"100%", background:"transparent",
    border:"none", borderBottom:`1px solid ${GOLD}50`,
    padding:"10px 0", fontSize:14,
    fontFamily:"var(--font-cormorant),serif",
    color:BG, outline:"none", boxSizing:"border-box",
    appearance:"none" as const,
  };
  const labelStyle: React.CSSProperties = {
    fontFamily:"var(--font-cormorant),serif",
    fontSize:10, letterSpacing:"0.28em",
    color:"#8B6550", textTransform:"uppercase",
    display:"block", marginBottom:4, marginTop:20,
  };

  const gonder = async () => {
    if (!form.ad.trim()) { setHata("Lütfen adınızı girin."); return; }
    if (!form.katilim)   { setHata("Lütfen katılım durumunu seçin."); return; }
    setYukleniyor(true); setHata("");
    try {
      const res = await fetch("/api/rsvp", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          davetiyeId,
          ad: form.ad,
          katilim: form.katilim === "evet",
          kisiSayisi: Number(form.kisiSayisi),
          diyet: secilenDiyet.length > 0 ? secilenDiyet.join(",") : undefined,
          sarkiOnerisi: seciliSarki ? `${seciliSarki.isim} - ${seciliSarki.sanatci}` : sarkiSorgu.trim() || undefined,
          spotifyTrackId: seciliSarki?.id,
        }),
      });
      if (!res.ok) { const d = await res.json().catch(()=>({})); setHata(d.hata || "Bir hata oluştu."); return; }
      setAdim("tamam");
    } catch { setHata("Bir hata oluştu."); }
    finally { setYukleniyor(false); }
  };

  if (adim === "tamam") {
    return (
      <div style={{ textAlign:"center", padding:"20px 0" }}>
        <p style={{ fontSize:40, marginBottom:12 }}>
          {form.katilim === "evet" ? "🎊" : "💙"}
        </p>
        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"2rem", color:BG, marginBottom:8,
        }}>
          {form.katilim === "evet" ? "Görüşmek üzere!" : "Anlıyoruz..."}
        </p>
        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:14, color:"#8B6550",
        }}>
          {form.katilim === "evet"
            ? "Katılım bilginiz iletildi. Sizi görmek için sabırsızlanıyoruz!"
            : "Katılım durumunuz iletildi."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <label style={labelStyle}>ADINIZ SOYADINIZ</label>
      <input type="text" value={form.ad}
        onChange={e => setForm({...form, ad:e.target.value})}
        placeholder="örn. Selin Kaya" style={fieldStyle}/>

      <label style={labelStyle}>KAÇ KİŞİ?</label>
      <select value={form.kisiSayisi}
        onChange={e => setForm({...form, kisiSayisi:e.target.value})}
        style={fieldStyle}>
        {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} kişi</option>)}
      </select>

      <label style={labelStyle}>KATILIM DURUMU</label>
      <select value={form.katilim}
        onChange={e => setForm({...form, katilim:e.target.value})}
        style={fieldStyle}>
        <option value="">Seçiniz</option>
        <option value="evet">Katılıyorum ✓</option>
        <option value="hayir">Katılamıyorum</option>
      </select>

      {form.katilim === "evet" && (
        <div style={{ marginTop:20 }}>
          <label style={labelStyle}>Diyet Tercihleri <span style={{ textTransform:"none", letterSpacing:0, fontSize:10, color:"#8B6550" }}>(isteğe bağlı)</span></label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>
            {[{ k:"vegan", l:"🌱 Vegan" },{ k:"vejetaryen", l:"🥗 Vejetaryen" },{ k:"glutensiz", l:"🌾 Glutensiz" },{ k:"laktozsuz", l:"🥛 Laktozsuz" }].map(opt => (
              <button key={opt.k} type="button" onClick={() => toggleDiyet(opt.k)} style={{
                padding:"6px 12px", borderRadius:6, fontSize:11, cursor:"pointer",
                fontFamily:"var(--font-cormorant),serif",
                border:`1.5px solid ${secilenDiyet.includes(opt.k) ? GOLD : GOLD+"40"}`,
                color: secilenDiyet.includes(opt.k) ? BG : "#8B6550",
                background: secilenDiyet.includes(opt.k) ? GOLD+"22" : "transparent",
                transition:"all 0.15s",
              }}>{opt.l}</button>
            ))}
          </div>
        </div>
      )}

      {spotifyAktif && (
        <div style={{ marginTop:20 }}>
          <label style={labelStyle}>🎵 Dans etmek istediğin şarkı?</label>
          {seciliSarki ? (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:`1px solid ${GOLD}50` }}>
              {seciliSarki.kapak && <img src={seciliSarki.kapak} alt="" style={{ width:36, height:36, borderRadius:4, objectFit:"cover" }}/>}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:13, color:BG, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{seciliSarki.isim}</p>
                <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, color:"#8B6550", margin:0 }}>{seciliSarki.sanatci}</p>
              </div>
              <button type="button" onClick={() => { setSeciliSarki(null); setSarkiSorgu(""); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#8B6550", fontSize:18, padding:0 }}>×</button>
            </div>
          ) : (
            <div style={{ position:"relative" }}>
              <input type="text" value={sarkiSorgu} onChange={e => { setSarkiSorgu(e.target.value); setSeciliSarki(null); }}
                placeholder="Şarkı veya sanatçı adı..." maxLength={200} style={fieldStyle}/>
              {sarkiAraniyor && <span style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", fontSize:11, color:"#8B6550" }}>...</span>}
              {sarkiSonuclar.length > 0 && (
                <div style={{ position:"absolute", zIndex:30, left:0, right:0, top:"100%", background:CREAM, border:`1px solid ${GOLD}40`, borderRadius:8, boxShadow:"0 8px 24px rgba(0,0,0,0.15)", overflow:"hidden" }}>
                  {sarkiSonuclar.map(s => (
                    <button key={s.id} type="button" onClick={() => { setSeciliSarki(s); setSarkiSorgu(""); setSarkiSonuclar([]); }}
                      style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 12px", background:"none", border:"none", borderBottom:`1px solid ${GOLD}20`, cursor:"pointer", textAlign:"left" }}>
                      {s.kapak && <img src={s.kapak} alt="" style={{ width:32, height:32, borderRadius:4, objectFit:"cover", flexShrink:0 }}/>}
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:13, color:BG, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.isim}</p>
                        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, color:"#8B6550", margin:0 }}>{s.sanatci}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {hata && (
        <p style={{ color:"#C0392B", fontSize:12,
          fontFamily:"var(--font-cormorant),serif", marginTop:12 }}>{hata}</p>
      )}

      <button onClick={gonder} disabled={yukleniyor} style={{
        width:"100%", marginTop:30, padding:"14px",
        background:BG, color:CREAM, border:"none", borderRadius:8,
        fontFamily:"var(--font-cormorant),serif",
        fontSize:13, letterSpacing:"0.32em",
        textTransform:"uppercase",
        cursor: yukleniyor ? "not-allowed" : "pointer",
        opacity: yukleniyor ? 0.7 : 1,
      }}>
        {yukleniyor ? "GÖNDERİLİYOR..." : "BİLDİR"}
      </button>

      {/* KVKK Bildirimi */}
      <p style={{ marginTop:16, fontSize:9.5, lineHeight:1.7,
        fontFamily:"var(--font-cormorant),serif",
        color:"rgba(139,90,74,0.65)", textAlign:"center" }}>
        Girdiğiniz bilgiler yalnızca katılım bildirimini davet sahibine iletmek amacıyla
        işlenmekte ve etkinlik tarihinden itibaren 1 yıl içinde silinmektedir.
      </p>
    </div>
  );
}
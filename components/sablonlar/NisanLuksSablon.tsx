"use client";

import { SablonProps } from "@/lib/sablon-tipleri";
import { useState, useEffect } from "react";
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
  const [imgFailed, setImgFailed] = useState(false);
  const ring = Math.round(size * 0.055);

  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size,
        borderRadius: "50%",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0,
        /* ring halkası: bordeaux rengi ring → görsel white-bg kenarını maskeler */
        boxShadow: `
          0 0 0 ${ring}px ${BG},
          0 0 0 ${ring + 2}px rgba(196,160,90,0.18),
          0 20px 70px rgba(10,0,6,0.7)
        `,
      }}
    >
      {!imgFailed ? (
        <img
          src="/rose-seal.png"
          alt="Gül Mühür"
          onError={() => setImgFailed(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
        />
      ) : (
        /* CSS yedek gül */
        <div style={{
          width:"100%", height:"100%",
          background:`radial-gradient(circle at 38% 32%,
            #A01C2E 0%,#7A1220 30%,#5C0D18 60%,#3E0810 100%)`,
          position:"relative",
        }}>
          <div style={{
            position:"absolute", top:"10%", left:"15%",
            width:"45%", height:"40%", borderRadius:"50%",
            background:"radial-gradient(ellipse,rgba(255,255,255,0.14) 0%,transparent 70%)",
          }}/>
          <svg viewBox="0 0 200 200" style={{ position:"absolute",inset:"8%",width:"84%",height:"84%" }} fill="none">
            <circle cx="100" cy="100" r="88" stroke="rgba(220,150,130,0.2)" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="78" stroke="rgba(220,150,130,0.12)" strokeWidth="0.8"/>
            {[0,60,120,180,240,300].map(a=>(
              <ellipse key={a} cx="100" cy="54" rx="14" ry="22"
                fill="rgba(200,80,80,0.28)" stroke="rgba(240,160,140,0.3)" strokeWidth="0.8"
                transform={`rotate(${a} 100 100)`}/>
            ))}
            {[30,90,150,210,270,330].map(a=>(
              <ellipse key={a} cx="100" cy="63" rx="11" ry="17"
                fill="rgba(210,90,90,0.36)"
                transform={`rotate(${a} 100 100)`}/>
            ))}
            {[15,75,135,195,255,315].map(a=>(
              <ellipse key={a} cx="100" cy="73" rx="8" ry="12"
                fill="rgba(220,100,100,0.44)"
                transform={`rotate(${a} 100 100)`}/>
            ))}
            <circle cx="100" cy="100" r="12" fill="rgba(215,95,95,0.6)"/>
            <circle cx="100" cy="100" r="7"  fill="rgba(235,115,115,0.7)"/>
            <circle cx="100" cy="100" r="3"  fill="rgba(248,145,135,0.8)"/>
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Polaroid kart ─── */
function Polaroid({ rotate=0, zIndex=0 }: { rotate?:number; zIndex?:number }) {
  return (
    <div style={{
      background:"#fff",
      borderRadius:3,
      padding:"10px 10px 32px",
      transform:`rotate(${rotate}deg)`,
      zIndex,
      boxShadow:"0 8px 32px rgba(0,0,0,0.45),0 2px 6px rgba(0,0,0,0.3)",
      width:170, flexShrink:0,
    }}>
      <div style={{
        width:"100%", height:190,
        background:`linear-gradient(135deg,${BG_MED} 0%,#6B1828 100%)`,
        borderRadius:2,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span style={{ fontSize:44, opacity:0.25 }}>📷</span>
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
  const fullName = isim2 ? `${isim1} & ${isim2}` : isim1;

  const whatsapp = encodeURIComponent(
    `${davetiye.baslik} Nişan Davetiyesi\n` +
    (tarihStr ? `📅 ${tarihStr}\n` : "") +
    (davetiye.mekan ? `📍 ${davetiye.mekan}\n` : "") +
    `Davetiye: ${process.env.NEXT_PUBLIC_URL ?? ""}/davetiye/${davetiye.slug}`
  );

  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  /* ══ KAPALI DURUM ══ */
  if (!acildi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
        style={{ background:`radial-gradient(ellipse at 50% 45%,#5C1020 0%,${BG} 55%,${BG_DARK} 100%)` }}>

        {/* Nokta dokusu */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:`radial-gradient(circle,rgba(196,160,90,0.05) 1px,transparent 1px)`,
          backgroundSize:"30px 30px",
        }}/>

        {/* İsimler — üst */}
        <p className="relative z-10 text-center px-8 mb-12" style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(2.6rem,8vw,4.2rem)",
          color: CREAM,
          lineHeight: 1.15,
          letterSpacing: 1,
        }}>
          {isim1}
          {isim2 && <><span style={{ color:GOLD }}> &amp; </span>{isim2}</>}
        </p>

        {/* Gül Mühür */}
        <div className="relative z-10 flex flex-col items-center"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "scale(0.7)" : "scale(1)", transition:"all 0.55s ease" }}>
          <RoseSeal size={230} onClick={() => { setAnimating(true); setTimeout(() => setAcildi(true), 580); }} />

          <div className="mt-10 text-center">
            {tarihKisa && (
              <p style={{
                fontFamily:"var(--font-cormorant),serif",
                fontSize:13, letterSpacing:"0.35em",
                color:GOLD, marginBottom:12,
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
    );
  }

  /* ══ AÇIK DURUM ══ */
  return (
    <div style={{ background:BG, minHeight:"100vh", overflowX:"hidden" }}>

      {/* ─── NAV ─── */}
      <nav style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(32,4,12,0.9)",
        backdropFilter:"blur(14px)",
        borderBottom:`1px solid rgba(196,160,90,0.18)`,
      }}>
        <div style={{
          maxWidth:640, margin:"0 auto",
          padding:"11px 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <span style={{ color:GOLD, fontSize:15, cursor:"pointer" }} onClick={() => scroll("biz")}>♥</span>
          <div style={{ display:"flex", gap:"clamp(10px,4vw,26px)" }}>
            {[
              { id:"biz",      label:"BİZ" },
              { id:"sayim",    label:"SAYIM" },
              { id:"katilim",  label:"KATILIM" },
              { id:"mekan",    label:"MEKAN" },
              { id:"anilar",   label:"ANILAR" },
            ].map(s => (
              <button key={s.id} onClick={() => scroll(s.id)} style={{
                background:"none", border:"none", cursor:"pointer",
                fontFamily:"var(--font-cormorant),serif",
                fontSize:11, letterSpacing:"0.22em",
                color:`${CREAM}80`, padding:"4px 0",
              }}>{s.label}</button>
            ))}
          </div>
          <div style={{ width:16 }}/>
        </div>
      </nav>

      {/* ════════════════════════════════════
          BÖLÜM 1 — BİZ (Hero kemer)
      ════════════════════════════════════ */}
      <section id="biz" style={{
        minHeight:"100svh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"60px 24px 80px", position:"relative",
        background:`radial-gradient(ellipse at 50% 30%,#5C1020 0%,${BG} 60%)`,
      }}>
        {/* Köşe süsleri */}
        {(["top-5 left-5","top-5 right-5","bottom-5 left-5","bottom-5 right-5"] as const).map((cls,i) => (
          <span key={i} className={`absolute ${cls}`} style={{ color:`${GOLD}50`, fontSize:14 }}>✦</span>
        ))}

        {/* Kemer çerçeve */}
        <div style={{
          position:"relative", maxWidth:400, width:"100%",
          borderRadius:"130px 130px 18px 18px",
          border:`1px solid ${GOLD}38`,
          padding:"56px 36px 48px",
          textAlign:"center",
          boxShadow:`inset 0 0 80px rgba(196,160,90,0.03)`,
        }}>
          {/* İkinci iç çerçeve */}
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
          }}>&amp;</p>

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

          {davetiye.mesaj && (
            <p style={{
              fontFamily:"var(--font-cormorant),serif",
              fontSize:14, fontStyle:"italic",
              color:`${CREAM}55`, marginTop:8,
            }}>{davetiye.mesaj}</p>
          )}
        </div>

        {/* Aşağı ok */}
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

        {/* Müzik butonu */}
        {davetiye.muzik && (
          <div style={{ position:"fixed", bottom:24, right:24, zIndex:40 }}>
            <MuzikCalar muzikUrl={davetiye.muzik}/>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 2 — SAYIM (Geri Sayım)
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

        {/* Sayım rakamları */}
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

        <div style={{ maxWidth:300, margin:"52px auto 0" }}>
          <div style={{ height:1, background:`linear-gradient(to right,transparent,${GOLD}30,transparent)` }}/>
        </div>
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 3 — KATILIM (RSVP)
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

            <RsvpFormKrem davetiyeId={davetiye.id}/>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 4 — MEKAN
      ════════════════════════════════════ */}
      <section id="mekan" style={{ padding:"80px 24px", textAlign:"center", background:BG_MED }}>
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

        {/* 3 sütun */}
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

        {/* Harita */}
        {davetiye.mekan && (
          <>
            <div style={{
              maxWidth:560, margin:"0 auto 28px",
              borderRadius:12, overflow:"hidden",
              border:`1px solid ${GOLD}22`,
              boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
            }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(davetiye.mekan)}&output=embed`}
                width="100%" height="260"
                style={{ border:0, display:"block" }}
                loading="lazy"
                allowFullScreen
              />
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(davetiye.mekan)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:8,
                fontFamily:"var(--font-cormorant),serif",
                fontSize:13, letterSpacing:"0.22em",
                color:CREAM, border:`1px solid ${GOLD}38`,
                padding:"12px 28px", borderRadius:8,
                textDecoration:"none", textTransform:"uppercase",
              }}
            >📍 Yol Tarifi Al</a>
          </>
        )}
      </section>

      {/* ════════════════════════════════════
          BÖLÜM 5 — ANILAR (Polaroid)
      ════════════════════════════════════ */}
      <section id="anilar" style={{
        padding:"80px 24px", textAlign:"center",
        background:`linear-gradient(180deg,${BG} 0%,${BG_DARK} 100%)`,
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
        <div style={{ position:"relative", display:"flex", justifyContent:"center", minHeight:290, marginBottom:52 }}>
          <div style={{ position:"relative", width:280, height:280 }}>
            <div style={{ position:"absolute", top:20, left:-30 }}>
              <Polaroid rotate={-9} zIndex={1}/>
            </div>
            <div style={{ position:"absolute", top:28, left:45 }}>
              <Polaroid rotate={5} zIndex={2}/>
            </div>
            <div style={{ position:"absolute", top:4, left:90 }}>
              <Polaroid rotate={-2} zIndex={3}/>
            </div>
          </div>
        </div>

        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:18, fontStyle:"italic",
          color:`${CREAM}55`,
        }}>Sonsuz bir yolculuğun ilk adımları... ✦</p>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        background:BG_DARK,
        borderTop:`1px solid ${GOLD}12`,
        padding:"40px 24px",
        textAlign:"center",
      }}>
        <p style={{
          fontFamily:"var(--font-dancing),cursive",
          fontSize:"clamp(1.8rem,5vw,2.6rem)",
          color:`${CREAM}65`, marginBottom:22,
        }}>{fullName}</p>

        <a
          href={`https://wa.me/?text=${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"#25D366", color:"#fff",
            padding:"10px 22px", borderRadius:8,
            fontSize:13,
            fontFamily:"var(--font-cormorant),serif",
            textDecoration:"none", letterSpacing:"0.1em",
            marginBottom:24,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Paylaş
        </a>

        <p style={{
          fontFamily:"var(--font-cormorant),serif",
          fontSize:11, letterSpacing:"0.2em",
          color:`${GOLD}35`,
        }}>davetim.com ile oluşturuldu ✦</p>
      </footer>

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   RSVP FORMU — krem kart içi
───────────────────────────────────────── */
function RsvpFormKrem({ davetiyeId }: { davetiyeId: string }) {
  const [adim, setAdim] = useState<"form"|"tamam">("form");
  const [form, setForm] = useState({ ad:"", kisiSayisi:"1", katilim:"" });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

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
    if (!form.ad.trim())  { setHata("Lütfen adınızı girin."); return; }
    if (!form.katilim)    { setHata("Lütfen katılım durumunu seçin."); return; }
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
        }),
      });
      if (!res.ok) { setHata("Bir hata oluştu."); return; }
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
      <label style={labelStyle}>Adınız Soyadınız</label>
      <input type="text" value={form.ad}
        onChange={e => setForm({...form, ad:e.target.value})}
        placeholder="örn. Selin Kaya" style={fieldStyle}/>

      <label style={labelStyle}>Kaç Kişi?</label>
      <select value={form.kisiSayisi}
        onChange={e => setForm({...form, kisiSayisi:e.target.value})}
        style={fieldStyle}>
        <option value="">Seçiniz</option>
        {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} kişi</option>)}
      </select>

      <label style={labelStyle}>Katılım Durumu</label>
      <select value={form.katilim}
        onChange={e => setForm({...form, katilim:e.target.value})}
        style={fieldStyle}>
        <option value="">Seçiniz</option>
        <option value="evet">Katılıyorum ✓</option>
        <option value="hayir">Katılamıyorum</option>
      </select>

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
        {yukleniyor ? "Gönderiliyor..." : "BİLDİR"}
      </button>

      {/* KVKK Bildirimi */}
      <p style={{ marginTop:16, fontSize:9.5, lineHeight:1.7,
        fontFamily:"var(--font-cormorant),serif",
        color:"rgba(139,90,74,0.65)", textAlign:"center" }}>
        Girdiğiniz bilgiler yalnızca katılım bildirimini davet sahibine iletmek amacıyla
        işlenmekte ve etkinlik tarihinden itibaren 1 yıl içinde silinmektedir.{" "}
        <a href="/kvkk" target="_blank" rel="noopener noreferrer"
          style={{ color:"rgba(139,90,74,0.85)", textDecoration:"underline" }}>
          KVKK Aydınlatma Metni
        </a>
      </p>
    </div>
  );
}

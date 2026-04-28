"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SABLONLAR } from "@/lib/sablonlar";
import MuzikSecici from "@/components/MuzikSecici";

const FONTLAR = [
  { id: "font-sans",  isim: "Modern",  style: "system-ui" },
  { id: "font-serif", isim: "Klasik",  style: "Georgia, serif" },
  { id: "font-mono",  isim: "Teknik",  style: "monospace" },
];

/* ─────────────────────────────────────
   NİŞAN LÜKS RENK PALETİ
───────────────────────────────────── */
const BG      = "#3B0A14";
const BG_DARK = "#270610";
const BG_MED  = "#4E1020";
const GOLD    = "#C4A05A";
const CREAM   = "#F5E8D8";

/* Telefon ekranı iç genişliği: 220 - 2×8 padding = 204px
   Önizleme doğal genişliği (iPhone): 390px
   Ölçek: 204 / 390 ≈ 0.523 */
const NAT_W = 390;
const SCALE = 204 / NAT_W;

interface OnizlemeProps {
  kisi1: string;
  kisi2: string;
  tarih: string;
  saat:  string;
  mekan: string;
  mesaj: string;
}

function calcKalan(tarih: string, saat: string) {
  if (!tarih) return null;
  const d = new Date(`${tarih}T${saat || "12:00"}`);
  const f = d.getTime() - Date.now();
  if (f <= 0) return { gun:0, saat:0, dakika:0, saniye:0 };
  return {
    gun:    Math.floor(f / 86400000),
    saat:   Math.floor((f % 86400000) / 3600000),
    dakika: Math.floor((f % 3600000) / 60000),
    saniye: Math.floor((f % 60000) / 1000),
  };
}

/* ── Altın çizgi ── */
function GoldDivider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"8px 0" }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(to right,transparent,${GOLD}70)` }}/>
      <span style={{ color:GOLD, fontSize:9, letterSpacing:5 }}>✦</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(to left,transparent,${GOLD}70)` }}/>
    </div>
  );
}

/* ── Gül mühür ── */
function RoseSeal({ size }: { size: number }) {
  const [failed, setFailed] = useState(false);
  const ring = Math.round(size * 0.055);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", overflow:"hidden",
      boxShadow:`0 0 0 ${ring}px ${BG},0 0 0 ${ring+2}px rgba(196,160,90,0.18),0 20px 70px rgba(10,0,6,0.7)`,
    }}>
      {!failed ? (
        <img src="/rose-seal.png" alt="" onError={() => setFailed(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
      ) : (
        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
          background:`radial-gradient(circle at 38% 32%,#A01C2E 0%,#7A1220 40%,#3E0810 100%)` }}>
          <svg viewBox="0 0 200 200" style={{ width:"75%", height:"75%" }} fill="none">
            {[0,60,120,180,240,300].map(a=><ellipse key={a} cx="100" cy="54" rx="14" ry="22" fill="rgba(200,80,80,0.28)" transform={`rotate(${a} 100 100)`}/>)}
            {[30,90,150,210,270,330].map(a=><ellipse key={a} cx="100" cy="63" rx="11" ry="17" fill="rgba(210,90,90,0.36)" transform={`rotate(${a} 100 100)`}/>)}
            <circle cx="100" cy="100" r="12" fill="rgba(215,95,95,0.6)"/>
            <circle cx="100" cy="100" r="7"  fill="rgba(235,115,115,0.7)"/>
            <circle cx="100" cy="100" r="3"  fill="rgba(248,145,135,0.8)"/>
          </svg>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   390px GENİŞLİKTE ÖNIZLEME BÖLÜMLERİ
   Bunlar NisanLuksSablon ile birebir aynı stillerde
   ama form state'inden veri alıyor → anlık güncellenir
══════════════════════════════════════════════════ */

/* Kapak — kapalı durum */
function PreviewKapak({ kisi1, kisi2, tarih, saat }: OnizlemeProps) {
  const ad1 = kisi1 || "Aylin";
  const ad2 = kisi2 || "Yavuz";
  const tarihStr = tarih
    ? new Date(`${tarih}T${saat||"12:00"}`).toLocaleDateString("tr-TR",{ day:"2-digit", month:"long", year:"numeric" }).toUpperCase()
    : "GÜN · AY · YIL";
  return (
    <div style={{
      width:NAT_W, height:844,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden",
      background:`radial-gradient(ellipse at 50% 45%,#5C1020 0%,${BG} 55%,${BG_DARK} 100%)`,
    }}>
      <div style={{ position:"absolute", inset:0,
        backgroundImage:`radial-gradient(circle,rgba(196,160,90,0.055) 1px,transparent 1px)`,
        backgroundSize:"30px 30px", pointerEvents:"none" }}/>
      <p style={{
        position:"relative", zIndex:10, textAlign:"center",
        marginBottom:48, padding:"0 32px",
        fontFamily:"var(--font-dancing),cursive",
        fontSize:54, color:CREAM, lineHeight:1.15, letterSpacing:1,
      }}>
        {ad1}{ad2 && <><span style={{ color:GOLD }}> &amp; </span>{ad2}</>}
      </p>
      <div style={{ position:"relative", zIndex:10 }}>
        <RoseSeal size={220}/>
      </div>
      <p style={{ position:"relative", zIndex:10, marginTop:48,
        fontFamily:"var(--font-cormorant),serif",
        fontSize:13, letterSpacing:"0.35em", color:GOLD }}>
        {tarihStr}
      </p>
      <p style={{ position:"relative", zIndex:10, marginTop:12,
        fontFamily:"var(--font-cormorant),serif",
        fontSize:13, fontStyle:"italic", letterSpacing:"0.15em", color:`${GOLD}70` }}>
        Mühüre dokun ✦
      </p>
    </div>
  );
}

/* Biz bölümü — açık, kemer hero */
function PreviewBiz({ kisi1, kisi2, tarih, saat, mekan, mesaj }: OnizlemeProps) {
  const ad1 = kisi1 || "Aylin";
  const ad2 = kisi2 || "Yavuz";
  const tarihKisa = tarih
    ? new Date(`${tarih}T${saat||"12:00"}`).toLocaleDateString("tr-TR",{ day:"2-digit", month:"long", year:"numeric" }).toUpperCase()
    : null;
  return (
    <div style={{
      width:NAT_W, minHeight:844,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"80px 24px", position:"relative",
      background:`radial-gradient(ellipse at 50% 30%,#5C1020 0%,${BG} 60%)`,
    }}>
      {/* Nav simülasyonu */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:46,
        background:"rgba(32,4,12,0.9)", borderBottom:`1px solid rgba(196,160,90,0.18)`,
        display:"flex", alignItems:"center", justifyContent:"center", gap:26, zIndex:10,
      }}>
        <span style={{ color:GOLD, fontSize:15 }}>♥</span>
        {["BİZ","SAYIM","KATILIM","MEKAN","ANILAR"].map(l=>(
          <span key={l} style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.22em", color:`${CREAM}70` }}>{l}</span>
        ))}
      </div>
      {/* Köşe süsleri */}
      {[{ top:60, left:20 },{ top:60, right:20 },{ bottom:20, left:20 },{ bottom:20, right:20 }].map((pos,i)=>(
        <span key={i} style={{ position:"absolute", color:`${GOLD}50`, fontSize:14, ...pos }}>✦</span>
      ))}
      {/* Kemer çerçeve */}
      <div style={{
        position:"relative", maxWidth:330, width:"100%",
        borderRadius:"130px 130px 18px 18px",
        border:`1px solid ${GOLD}38`,
        padding:"56px 36px 48px", textAlign:"center",
        boxShadow:`inset 0 0 80px rgba(196,160,90,0.03)`,
      }}>
        <div style={{ position:"absolute", inset:9, borderRadius:"123px 123px 12px 12px",
          border:`1px solid ${GOLD}18`, pointerEvents:"none" }}/>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.38em",
          color:GOLD, textTransform:"uppercase", marginBottom:22 }}>Nişan Davetiyesi</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:60, color:CREAM, lineHeight:1, marginBottom:4 }}>{ad1}</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:30, color:GOLD, lineHeight:1.3, margin:"6px 0" }}>&amp;</p>
        <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:60, color:CREAM, lineHeight:1, marginBottom:8 }}>{ad2}</p>
        <div style={{ margin:"20px auto", maxWidth:220 }}><GoldDivider/></div>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:13, letterSpacing:"0.22em", color:`${CREAM}70`, marginBottom:10 }}>
          {tarihKisa}{tarihKisa && mekan ? " · " : ""}{mekan ? mekan.split(",")[0].toUpperCase() : ""}
        </p>
        {mesaj && (
          <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:14, fontStyle:"italic", color:`${CREAM}55`, marginTop:8 }}>
            {mesaj.length > 60 ? mesaj.slice(0,60)+"…" : mesaj}
          </p>
        )}
      </div>
    </div>
  );
}

/* Sayım bölümü */
function PreviewSayim({ tarih, saat }: OnizlemeProps) {
  const [kalan, setKalan] = useState(calcKalan(tarih, saat));
  useEffect(() => {
    setKalan(calcKalan(tarih, saat));
    const id = setInterval(()=>setKalan(calcKalan(tarih,saat)), 1000);
    return () => clearInterval(id);
  }, [tarih, saat]);

  return (
    <div style={{
      width:NAT_W, minHeight:844,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"80px 24px", textAlign:"center", background:BG_MED,
    }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.38em",
        color:GOLD, textTransform:"uppercase", marginBottom:14 }}>Nişana Kalan Süre</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:36, color:CREAM, marginBottom:52 }}>
        {kalan ? "Sayıyoruz..." : "Tarih girilmedi"}
      </p>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
        {[
          { val:kalan?.gun    ?? 0, lbl:"GÜN" },
          { val:kalan?.saat   ?? 0, lbl:"SAAT" },
          { val:kalan?.dakika ?? 0, lbl:"DAKİKA" },
          { val:kalan?.saniye ?? 0, lbl:"SANİYE" },
        ].map((item,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:52, fontWeight:600,
                color:CREAM, lineHeight:1, fontVariantNumeric:"tabular-nums", minWidth:"2ch" }}>
                {String(item.val).padStart(2,"0")}
              </p>
              <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.22em",
                color:GOLD, marginTop:8 }}>{item.lbl}</p>
            </div>
            {i<3 && <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:35,
              color:`${GOLD}50`, lineHeight:1.1, marginTop:4 }}>:</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Mekan bölümü */
function PreviewMekan({ tarih, saat, mekan }: OnizlemeProps) {
  const tarihStr = tarih
    ? new Date(`${tarih}T${saat||"12:00"}`).toLocaleDateString("tr-TR",{ day:"2-digit", month:"short", year:"numeric" })
    : "—";
  return (
    <div style={{
      width:NAT_W, minHeight:844,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"80px 24px", textAlign:"center", background:BG_MED,
    }}>
      <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.38em",
        color:GOLD, textTransform:"uppercase", marginBottom:14 }}>Mekan</p>
      <p style={{ fontFamily:"var(--font-dancing),cursive", fontSize:38, color:CREAM, marginBottom:44 }}>
        Nerede Buluşuyoruz?
      </p>
      <div style={{ display:"flex", justifyContent:"center", gap:60, flexWrap:"wrap", marginBottom:40 }}>
        {[
          { emoji:"📍", lbl:"MEKAN",  val:mekan ? mekan.split(",")[0] : "—" },
          { emoji:"🕐", lbl:"SAAT",   val:saat || "—" },
          { emoji:"📅", lbl:"TARİH",  val:tarihStr },
        ].map(col=>(
          <div key={col.lbl} style={{ textAlign:"center", minWidth:90 }}>
            <div style={{ fontSize:22, marginBottom:10 }}>{col.emoji}</div>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:10, letterSpacing:"0.25em",
              color:GOLD, marginBottom:8, textTransform:"uppercase" }}>{col.lbl}</p>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:15, fontWeight:600, color:CREAM }}>{col.val}</p>
          </div>
        ))}
      </div>
      <div style={{
        width:"80%", maxWidth:280, height:100, borderRadius:12,
        background:"rgba(255,255,255,0.05)", border:`1px solid ${GOLD}20`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:12, color:`${GOLD}50`, fontStyle:"italic" }}>
          📍 Harita görünümü
        </p>
      </div>
    </div>
  );
}

const ONIZLEME_SEKMELERI = [
  { id:"kapak",    label:"Kapak",    icon:"🌹" },
  { id:"davetiye", label:"Davetiye", icon:"💍" },
  { id:"sayim",    label:"Sayım",    icon:"⏱️" },
  { id:"mekan",    label:"Mekan",    icon:"📍" },
] as const;

type OnizlemeSekme = typeof ONIZLEME_SEKMELERI[number]["id"];

/* ─────────────────────────────────────
   TELEFON MOCKUP
───────────────────────────────────── */
function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width:220 }}>
      <div className="relative rounded-[34px] overflow-hidden"
        style={{ background:"#181818", padding:"12px 8px",
          boxShadow:"0 0 0 1px #333,0 24px 60px rgba(0,0,0,0.5),inset 0 0 0 1px #444" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width:64, height:20, background:"#181818", borderRadius:"0 0 12px 12px" }}/>
        <div className="rounded-3xl overflow-hidden" style={{ height:420, background:"#000" }}>
          {children}
        </div>
      </div>
      <div className="absolute right-0 top-20 w-1 h-8 rounded-l bg-gray-700" style={{ right:-1 }}/>
      <div className="absolute left-0 top-16 w-1 h-7 rounded-r bg-gray-700" style={{ left:-1 }}/>
      <div className="absolute left-0 top-28 w-1 h-7 rounded-r bg-gray-700" style={{ left:-1 }}/>
    </div>
  );
}

/* ─────────────────────────────────────
   ANA BİLEŞEN
───────────────────────────────────── */
function OlusturIcerigi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sablonId = searchParams.get("sablon") || "klasik-dugun";
  const sablon = SABLONLAR.find(s=>s.id===sablonId) || SABLONLAR[0];
  const isNisanLuks = sablonId === "nisan-luks";
  const nisanVeyaDugun = sablon.kategori === "nisan" || sablon.kategori === "dugun";

  const [form, setForm] = useState({
    baslik:"", etkinlikTur:sablon.kategori,
    tarih:"", saat:"", mekan:"", mesaj:"",
    font:"font-sans", renk:sablon.renk,
    kisi1:"", kisi2:"", muzik:"",
  });
  const [yukleniyor, setYukleniyor]       = useState(false);
  const [hata, setHata]                   = useState("");
  const [aktifTab, setAktifTab]           = useState<"icerik"|"tasarim">("icerik");
  const [onizlemeSekme, setOnizlemeSekme] = useState<OnizlemeSekme>("kapak");
  const [gecis, setGecis]                 = useState(true);

  const handleSekme = (id: OnizlemeSekme) => {
    if (id === onizlemeSekme) return;
    setGecis(false);
    setTimeout(() => { setOnizlemeSekme(id); setGecis(true); }, 160);
  };

  const handleSubmit = async () => {
    if (!form.tarih || !form.mekan) { setHata("Lütfen tarih ve mekan alanlarını doldurun."); return; }
    if (nisanVeyaDugun && (!form.kisi1 || !form.kisi2)) { setHata("Lütfen iki kişinin adını girin."); return; }
    if (!nisanVeyaDugun && !form.baslik) { setHata("Lütfen davetiye başlığını girin."); return; }
    setYukleniyor(true); setHata("");
    const gonderilecekBaslik = nisanVeyaDugun ? `${form.kisi1} & ${form.kisi2}` : form.baslik;
    try {
      const res = await fetch("/api/davetiye/olustur", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...form, baslik:gonderilecekBaslik, sablon:sablonId }),
      });
      const data = await res.json();
      if (!res.ok) { setHata(data.hata || "Bir hata oluştu."); return; }
      if (data.limitAsimi) { setHata(data.hata); setTimeout(()=>router.push("/fiyatlar"),2000); return; }
      window.open(`/davetiye/${data.slug}`, "_blank");
    } catch { setHata("Bir hata oluştu, tekrar deneyin."); }
    finally { setYukleniyor(false); }
  };

  const onizlemeProps: OnizlemeProps = {
    kisi1:form.kisi1, kisi2:form.kisi2,
    tarih:form.tarih, saat:form.saat,
    mekan:form.mekan, mesaj:form.mesaj,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Üst Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">Davetiye Oluştur</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 truncate">
              Şablon: <span className="font-medium text-purple-600">{sablon.isim}</span>
            </p>
          </div>
          <button onClick={handleSubmit} disabled={yukleniyor}
            className="shrink-0 bg-purple-600 text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-sm shadow-purple-200">
            <span className="hidden sm:inline">{yukleniyor ? "Oluşturuluyor..." : "Davetiyemi Oluştur →"}</span>
            <span className="sm:hidden">{yukleniyor ? "..." : "Oluştur →"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Sol — Form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {[{ id:"icerik", isim:"İçerik", emoji:"✏️" },{ id:"tasarim", isim:"Tasarım", emoji:"🎨" }].map(tab=>(
                  <button key={tab.id} onClick={()=>setAktifTab(tab.id as "icerik"|"tasarim")}
                    className={`flex-1 py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      aktifTab===tab.id
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    <span>{tab.emoji}</span> {tab.isim}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {aktifTab === "icerik" && (
                  <div className="space-y-5">
                    {nisanVeyaDugun ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          İsimler <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="1. Kişi (Örn: Aylin)"
                            value={form.kisi1} onChange={e=>setForm({...form,kisi1:e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"/>
                          <input type="text" placeholder="2. Kişi (Örn: Yavuz)"
                            value={form.kisi2} onChange={e=>setForm({...form,kisi2:e.target.value})}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"/>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Davetiye Başlığı <span className="text-red-400">*</span>
                        </label>
                        <input type="text" placeholder="Örn: Can'ın Doğum Günü Partisi"
                          value={form.baslik} onChange={e=>setForm({...form,baslik:e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900"/>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarih *</label>
                        <input type="date" value={form.tarih} onChange={e=>setForm({...form,tarih:e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Saat</label>
                        <input type="time" value={form.saat} onChange={e=>setForm({...form,saat:e.target.value})}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mekan *</label>
                      <input type="text" placeholder="Mekan adı veya adresi"
                        value={form.mekan} onChange={e=>setForm({...form,mekan:e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"/>
                      {form.mekan && (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.mekan)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 mt-1.5 inline-flex items-center gap-1">
                          🗺️ Google Maps&apos;te kontrol et
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesaj</label>
                      <textarea rows={3} placeholder="Özel bir mesaj..."
                        value={form.mesaj} onChange={e=>setForm({...form,mesaj:e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white resize-none"/>
                    </div>
                  </div>
                )}

                {aktifTab === "tasarim" && (
                  <div className="space-y-7">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Arka Plan Müziği</label>
                      <MuzikSecici secili={form.muzik} onChange={dosya=>setForm({...form,muzik:dosya})}/>
                    </div>
                    {!isNisanLuks && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Tema Rengi</label>
                          <div className="flex gap-2.5 flex-wrap">
                            {["#7C3AED","#DB2777","#0891B2","#059669","#D97706","#DC2626","#1D4ED8","#111827"].map(renk=>(
                              <button key={renk} onClick={()=>setForm({...form,renk})}
                                className="w-10 h-10 rounded-full transition-all hover:scale-110 border-2"
                                style={{ backgroundColor:renk, borderColor:form.renk===renk?"white":"transparent",
                                  boxShadow:form.renk===renk?`0 0 0 3px ${renk}`:"none" }}>
                                {form.renk===renk && <span className="text-white text-sm">✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Yazı Stili</label>
                          <div className="grid grid-cols-3 gap-3">
                            {FONTLAR.map(font=>(
                              <button key={font.id} onClick={()=>setForm({...form,font:font.id})}
                                className={`p-4 rounded-xl border-2 transition-all ${form.font===font.id?"border-purple-500 bg-purple-50":"border-gray-100 bg-white"}`}>
                                <span className="text-2xl block mb-1" style={{ fontFamily:font.style }}>Aa</span>
                                <span className="text-xs text-gray-500">{font.isim}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {isNisanLuks && (
                      <div className="text-center py-6 text-gray-400 text-sm">
                        <p className="text-2xl mb-2">🌹</p>
                        <p className="font-medium text-gray-600">Bordo &amp; Altın Tasarım</p>
                        <p className="text-xs mt-1 text-gray-400">Bu şablonun rengi sabittir.<br/>Müzik seçimi için yukarıya bakın.</p>
                      </div>
                    )}
                  </div>
                )}

                {hata && <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">⚠️ {hata}</div>}

                <button onClick={handleSubmit} disabled={yukleniyor}
                  className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 mt-6">
                  {yukleniyor ? "Oluşturuluyor..." : "Davetiyemi Oluştur"}
                </button>
              </div>
            </div>
          </div>

          {/* ── Sağ — Canlı Önizleme ── */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-30">

              {/* Başlık + sekme düğmeleri */}
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Canlı Önizleme</p>
                <div className="flex gap-1">
                  {ONIZLEME_SEKMELERI.map(s=>(
                    <button key={s.id} onClick={()=>handleSekme(s.id)} title={s.label}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        onizlemeSekme===s.id
                          ? "text-white shadow-sm"
                          : "text-gray-400 hover:text-gray-600 bg-white border border-gray-100"
                      }`}
                      style={onizlemeSekme===s.id ? { background:"linear-gradient(135deg,#7A1220,#4E0A14)" } : {}}>
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telefon */}
              <TelefonMockup>
                {/* Fade wrapper */}
                <div className={`transition-opacity duration-150 ${gecis?"opacity-100":"opacity-0"}`}
                  style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden" }}>
                  {/* Gerçek davetiye bölümleri — 390px genişlikte, scale ile küçültülmüş */}
                  <div style={{
                    width:NAT_W,
                    transform:`scale(${SCALE})`,
                    transformOrigin:"top left",
                    position:"absolute", top:0, left:0,
                  }}>
                    {onizlemeSekme==="kapak"    && <PreviewKapak    {...onizlemeProps}/>}
                    {onizlemeSekme==="davetiye" && <PreviewBiz      {...onizlemeProps}/>}
                    {onizlemeSekme==="sayim"    && <PreviewSayim    {...onizlemeProps}/>}
                    {onizlemeSekme==="mekan"    && <PreviewMekan    {...onizlemeProps}/>}
                  </div>
                </div>
              </TelefonMockup>

              {/* Aktif sekme etiketi */}
              <p className="text-center text-xs text-gray-400 mt-3">
                {ONIZLEME_SEKMELERI.find(s=>s.id===onizlemeSekme)?.label} bölümü gösteriliyor
              </p>

              {/* İpucu */}
              <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Sol taraftaki alanlara yazdıkça önizleme{" "}
                  <span className="font-semibold text-gray-600">anında güncellenir</span>.
                  Üstteki ikonlarla bölümler arasında geçiş yapın.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OlusturSayfasi() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Yükleniyor...</div>}>
      <OlusturIcerigi/>
    </Suspense>
  );
}

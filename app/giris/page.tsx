"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

/* ── Sol panel davetiye kartları ── */
const CARDS = [
  { bg:"linear-gradient(150deg,#3B0A14 0%,#1a0308 100%)", gold:"#C4A05A", label:"Lüks Nişan",  rot:"-6deg",  x:-24, y:0  },
  { bg:"linear-gradient(150deg,#0D1F3C 0%,#071228 100%)", gold:"#D4AA70", label:"Lüks Düğün",  rot: "3deg",  x: 12, y:40 },
  { bg:"linear-gradient(150deg,#140828 0%,#0A0414 100%)", gold:"#D4A84B", label:"Lüks Doğum",  rot:"12deg",  x: 48, y:80 },
];

function InviteStack() {
  return (
    <div style={{ position:"relative", width:220, height:300, margin:"0 auto" }}>
      {CARDS.map((c,i) => (
        <div key={i} style={{ position:"absolute", inset:0, transform:`rotate(${c.rot}) translate(${c.x}px,${c.y}px)`, transformOrigin:"center center" }}>
          <div style={{ width:200, height:280, borderRadius:18, background:c.bg, border:`1px solid ${c.gold}30`,
            boxShadow:"0 20px 60px rgba(0,0,0,0.28),0 0 0 1px rgba(255,255,255,0.04)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:0.5, background:`${c.gold}50` }}/>
              <span style={{ color:c.gold, fontSize:10 }}>✦</span>
              <div style={{ width:28, height:0.5, background:`${c.gold}50` }}/>
            </div>
            <div style={{ fontFamily:"var(--font-dancing),cursive", fontSize:28, color:"#F9F3E8", textAlign:"center" }}>Bekleriz</div>
            <div style={{ width:"60%", height:0.5, background:`${c.gold}35` }}/>
            <div style={{ fontFamily:"var(--font-cormorant),serif", fontSize:9, letterSpacing:"0.25em", color:`${c.gold}80`, textTransform:"uppercase" }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── KVKK Checkbox ── */
function KvkkCheckbox({ id, checked, onChange, children }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 shrink-0">
        <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only"/>
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
          checked ? "bg-purple-600 border-purple-600" : "border-gray-300 group-hover:border-purple-400"
        }`}>
          {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
        </div>
      </div>
      <span className="text-xs text-gray-500 leading-relaxed">{children}</span>
    </label>
  );
}

function GirisIcerigi() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const callbackUrl  = searchParams.get("callbackUrl") || "/dashboard";

  const [tab,     setTab]     = useState<"google"|"email">("google");
  const [mod,     setMod]     = useState<"giris"|"kayit">("giris");
  const [yukleme, setYukleme] = useState(false);
  const [hata,    setHata]    = useState("");

  /* Giriş formu */
  const [girisEmail,  setGirisEmail]  = useState("");
  const [girisSifre,  setGirisSifre]  = useState("");

  /* Kayıt formu */
  const [kayitAd,     setKayitAd]     = useState("");
  const [kayitEmail,  setKayitEmail]  = useState("");
  const [kayitSifre,  setKayitSifre]  = useState("");
  const [kayitSifre2, setKayitSifre2] = useState("");
  const [kullanim,    setKullanim]    = useState(false);

  async function handleGiris(e: React.FormEvent) {
    e.preventDefault();
    setHata(""); setYukleme(true);
    const res = await signIn("credentials", { email: girisEmail, password: girisSifre, redirect: false, callbackUrl });
    setYukleme(false);
    if (res?.error) setHata("E-posta veya şifre hatalı.");
    else router.push(callbackUrl);
  }

  async function handleKayit(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    if (kayitSifre !== kayitSifre2) { setHata("Şifreler eşleşmiyor."); return; }
    if (!kullanim) { setHata("Kullanım şartlarını kabul etmeniz zorunludur."); return; }
    setYukleme(true);
    const res = await fetch("/api/auth/kayit", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ ad:kayitAd, email:kayitEmail, sifre:kayitSifre, kullanim }),
    });
    const veri = await res.json();
    if (!res.ok) { setHata(veri.hata); setYukleme(false); return; }
    /* Kayıt başarılı — otomatik giriş */
    const login = await signIn("credentials", { email:kayitEmail, password:kayitSifre, redirect:false, callbackUrl });
    setYukleme(false);
    if (login?.error) { setHata("Kayıt başarılı ancak giriş yapılamadı. Lütfen giriş yapın."); setMod("giris"); }
    else router.push(callbackUrl);
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all";

  return (
    <div style={{ minHeight:"100vh", display:"flex" }}>

      {/* ── Sol Panel ── */}
      <div className="hidden lg:flex" style={{
        flex:"0 0 52%", position:"relative", overflow:"hidden",
        padding:"48px 56px", flexDirection:"column", justifyContent:"space-between",
        background:"linear-gradient(145deg,#4C1D95 0%,#6D28D9 45%,#BE185D 100%)",
      }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.08) 1px,transparent 1px)",
          backgroundSize:"24px 24px" }}/>
        <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:480, height:480, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 65%)", filter:"blur(48px)", pointerEvents:"none" }}/>

        {/* Logo */}
        <div style={{ position:"relative", zIndex:2 }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:16 }}>D</span>
            </div>
            <span style={{ fontFamily:"var(--font-dancing),cursive", fontSize:26, color:"#fff" }}>Bekleriz</span>
          </Link>
        </div>

        {/* Orta */}
        <div style={{ position:"relative", zIndex:2, flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:36 }}>
          <div>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:11, letterSpacing:"0.32em", color:"rgba(255,255,255,0.55)", textTransform:"uppercase", marginBottom:12 }}>
              Dijital Davetiye Platformu
            </p>
            <h2 style={{ fontFamily:"var(--font-dancing),cursive", fontSize:52, color:"#fff", lineHeight:1.05, marginBottom:16 }}>
              Özel anlarınızı<br/>unutulmaz kılın
            </h2>
            <p style={{ fontFamily:"var(--font-cormorant),serif", fontSize:16, color:"rgba(255,255,255,0.65)", lineHeight:1.7, maxWidth:340 }}>
              Düğün, nişan, doğum günü için dakikalar içinde şık dijital davetiyeler oluşturun.
            </p>
          </div>
          <InviteStack/>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {["Lüks şablonlar, sıfır tasarım bilgisi","WhatsApp ile tek tıkla paylaşım","Canlı RSVP takibi ve misafir listesi"].map((f,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ color:"rgba(255,255,255,0.45)", fontSize:9 }}>✦</span>
                <span style={{ fontFamily:"var(--font-cormorant),serif", fontSize:14, color:"rgba(255,255,255,0.7)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position:"relative", zIndex:2, fontFamily:"var(--font-cormorant),serif", fontSize:12, color:"rgba(255,255,255,0.35)", letterSpacing:"0.06em" }}>
          500+ davetiye · Türkiye genelinde
        </p>
      </div>

      {/* ── Sağ Panel ── */}
      <div style={{ flex:1, background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 32px" }}>

        {/* Mobilde logo */}
        <div className="flex lg:hidden mb-8 flex-col items-center">
          <div style={{ display:"inline-flex", alignItems:"center", gap:9 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,#7C3AED,#DB2777)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontWeight:700, fontSize:14 }}>D</span>
            </div>
            <span style={{ fontFamily:"var(--font-dancing),cursive", fontSize:24, color:"#111827" }}>Bekleriz</span>
          </div>
        </div>

        <div style={{ width:"100%", maxWidth:380 }}>

          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
            {mod === "giris" ? "Tekrar hoş geldiniz" : "Hesap oluştur"}
          </h1>
          <p className="text-sm text-gray-400 mb-7">
            {mod === "giris" ? "Hesabınıza giriş yapın" : "Birkaç saniyede başlayın"}
          </p>

          {/* Yöntem tabları */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            {[{id:"google" as const, label:"Google ile"},{id:"email" as const, label:"E-posta ile"}].map(t=>(
              <button key={t.id} onClick={()=>{setTab(t.id);setHata("");}}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab===t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Google */}
          {tab === "google" && (
            <div className="space-y-4">
              <button onClick={()=>signIn("google",{callbackUrl})}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl border-1.5 border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-gray-300 hover:shadow-md transition-all"
                style={{ border:"1.5px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.07)" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.07)";e.currentTarget.style.transform="translateY(0)";}}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile {mod === "giris" ? "Giriş Yap" : "Kayıt Ol"}
              </button>

              {/* Google KVKK notu */}
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Google hesabınızla giriş yaparak{" "}
                <Link href="/kullanim-sartlari" className="text-purple-500 hover:underline">kullanım şartlarını</Link>
                {", "}
                <Link href="/gizlilik" className="text-purple-500 hover:underline">gizlilik politikasını</Link>
                {" ve "}
                <Link href="/kvkk" className="text-purple-600 font-semibold hover:underline">KVKK aydınlatma metnini</Link>
                {" "}okuduğunuzu ve kabul ettiğinizi onaylarsınız.
              </p>
            </div>
          )}

          {/* E-posta */}
          {tab === "email" && (
            <div>
              {/* Giriş/Kayıt toggle */}
              <div className="flex gap-4 mb-5 border-b border-gray-100 pb-4">
                {[{id:"giris" as const,l:"Giriş Yap"},{id:"kayit" as const,l:"Kayıt Ol"}].map(m=>(
                  <button key={m.id} onClick={()=>{setMod(m.id);setHata("");}}
                    className={`text-sm font-semibold pb-1 border-b-2 transition-all ${
                      mod===m.id ? "text-purple-600 border-purple-600" : "text-gray-400 border-transparent hover:text-gray-600"
                    }`}>
                    {m.l}
                  </button>
                ))}
              </div>

              {hata && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-4">
                  <span>⚠</span> {hata}
                </div>
              )}

              {/* Giriş formu */}
              {mod === "giris" && (
                <form onSubmit={handleGiris} className="space-y-3">
                  <input type="email" required placeholder="E-posta adresiniz" value={girisEmail}
                    onChange={e=>setGirisEmail(e.target.value)} className={inputCls}/>
                  <div>
                    <input type="password" required placeholder="Şifreniz" value={girisSifre}
                      onChange={e=>setGirisSifre(e.target.value)} className={inputCls}/>
                    <div className="text-right mt-1">
                      <Link href="/sifre-sifirla" className="text-xs text-purple-500 hover:underline">
                        Şifremi unuttum
                      </Link>
                    </div>
                  </div>
                  <button type="submit" disabled={yukleme}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60"
                    style={{ background:"linear-gradient(135deg,#7C3AED,#EC4899)" }}>
                    {yukleme ? "Giriş yapılıyor…" : "Giriş Yap"}
                  </button>
                  <p className="text-xs text-gray-400 text-center leading-relaxed pt-1">
                    Giriş yaparak{" "}
                    <Link href="/kullanim-sartlari" className="text-purple-500 hover:underline">kullanım şartlarını</Link>
                    {" ve "}
                    <Link href="/kvkk" className="text-purple-600 font-semibold hover:underline">KVKK metnini</Link>
                    {" "}kabul edersiniz.
                  </p>
                </form>
              )}

              {/* Kayıt formu */}
              {mod === "kayit" && (
                <form onSubmit={handleKayit} className="space-y-3">
                  <input type="text" required placeholder="Ad Soyad" value={kayitAd}
                    onChange={e=>setKayitAd(e.target.value)} className={inputCls}/>
                  <input type="email" required placeholder="E-posta adresiniz" value={kayitEmail}
                    onChange={e=>setKayitEmail(e.target.value)} className={inputCls}/>
                  <input type="password" required minLength={8} placeholder="Şifre (min. 8 karakter)" value={kayitSifre}
                    onChange={e=>setKayitSifre(e.target.value)} className={inputCls}/>
                  <input type="password" required placeholder="Şifre tekrar" value={kayitSifre2}
                    onChange={e=>setKayitSifre2(e.target.value)} className={inputCls}/>

                  {/* Kullanım Şartları onayı */}
                  <div className="space-y-3 pt-2 pb-1">
                    <KvkkCheckbox id="kullanim" checked={kullanim} onChange={setKullanim}>
                      <Link href="/kullanim-sartlari" target="_blank" className="text-purple-500 hover:underline">
                        Kullanım Şartları
                      </Link>
                      {" ve "}
                      <Link href="/gizlilik" target="_blank" className="text-purple-500 hover:underline">
                        Gizlilik Politikası
                      </Link>
                      {"'nı okudum ve kabul ediyorum. (Zorunlu)"}
                    </KvkkCheckbox>
                  </div>

                  <button type="submit" disabled={yukleme}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60"
                    style={{ background:"linear-gradient(135deg,#7C3AED,#EC4899)" }}>
                    {yukleme ? "Hesap oluşturuluyor…" : "Hesap Oluştur"}
                  </button>

                  <p className="text-[10px] text-gray-400 leading-relaxed text-center pt-1">
                    Kişisel verileriniz KVKK m.5/2-c (sözleşme kurulması) kapsamında işlenmektedir.{" "}
                    <Link href="/kvkk" target="_blank" className="text-purple-600 font-semibold hover:underline">
                      KVKK Aydınlatma Metni
                    </Link>
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GirisSayfasi() {
  return (
    <Suspense>
      <GirisIcerigi/>
    </Suspense>
  );
}

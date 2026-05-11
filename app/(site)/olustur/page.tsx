"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SABLONLAR } from "@/lib/sablonlar";
import { PREMIUM_SABLON_IDS, planOzellikVar } from "@/lib/planlar";
import Link from "next/link";
import { getSablonTipi } from "@/lib/sablon-registry";
import { KlasikSablon, NisanLuksSablon, DugunLuksSablon, DogumGunuLuksSablon } from "@/components/sablonlar";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import SpotifyMuzikSecici from "@/components/SpotifyMuzikSecici";

const FONTLAR = [
  { id: "font-sans",  isim: "Modern",   ornek: "Aa" },
  { id: "font-serif", isim: "Klasik",   ornek: "Aa" },
  { id: "font-mono",  isim: "Teknik",   ornek: "Aa" },
];

const NAT_W = 390;
const SCALE = 204 / NAT_W;

type DressRenkler = [string,string,string,string,string];
const DRESS_KOD_PRESETLER: { isim: string; renkler: DressRenkler }[] = [
  { isim: "Şık & Zarif",     renkler: ["#6B1A2B","#1A6B45","#C4A05A","#1A1A1A","#F5EDD8"] },
  { isim: "Resmi & Klasik",  renkler: ["#1B3A5C","#8B5E3C","#C4A05A","#2E2E2E","#F5EDD8"] },
  { isim: "Siyah Kravat",    renkler: ["#1A1A1A","#1A1A1A","#D4AA70","#3D3D3D","#F8F4EC"] },
  { isim: "Beyaz Kıyafet",   renkler: ["#F4F0EA","#E0D4C0","#C8B89A","#A89880","#6B5A48"] },
  { isim: "Bohem & Çiçekli", renkler: ["#8B5A2B","#E8C99A","#7A9B7A","#C47A4A","#F2E8D8"] },
  { isim: "Pastel & Soft",   renkler: ["#B5C4D6","#F2D1B3","#C8A8C8","#A8C4B8","#F5EAE0"] },
];

const INPUT      = "w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 transition-colors";
const DATE_INPUT = "w-full border-2 border-gray-200 rounded-xl px-3 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-colors";

/* ── iOS toggle ── */
function Toggle({ acik, onChange, disabled }: { acik: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={e => { e.stopPropagation(); if (!disabled) onChange(); }}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${acik ? "bg-purple-600" : "bg-gray-200"} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      aria-pressed={acik}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${acik ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

/* ── Özellik kartı ── */
function OzellikKarti({
  icon, baslik, aciklama, misafirGorur,
  locked, planEtiketi,
  acik, onToggle,
  children,
}: {
  icon: string; baslik: string; aciklama: string; misafirGorur?: string;
  locked?: boolean; lockedMsg?: string; planEtiketi?: string;
  acik: boolean; onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
      locked ? "border-gray-100 opacity-80" :
      acik ? "border-purple-200 shadow-sm shadow-purple-50" : "border-gray-100 shadow-sm"
    }`}>
      <div className="flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50/70 active:bg-gray-100 transition-colors"
        onClick={() => !locked && onToggle()}>
        <span className="text-xl mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{baslik}</p>
            {planEtiketi && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                locked
                  ? "bg-amber-100 text-amber-700"
                  : "bg-purple-100 text-purple-700"
              }`}>{planEtiketi}</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{aciklama}</p>
          {misafirGorur && acik && !locked && (
            <p className="text-xs text-purple-600 mt-1.5 font-medium">👁 {misafirGorur}</p>
          )}
        </div>
        <div className="shrink-0 mt-0.5">
          {locked ? (
            <Link href="/fiyatlar" onClick={e => e.stopPropagation()}
              className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap">
              Yükselt →
            </Link>
          ) : (
            <Toggle acik={acik} onChange={onToggle} />
          )}
        </div>
      </div>
      {acik && !locked && children && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 bg-gray-50/30">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Telefon mockup ── */
function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 220 }}>
      <div className="relative rounded-[34px] overflow-hidden"
        style={{ background: "#181818", padding: "12px 8px",
          boxShadow: "0 0 0 1px #333,0 24px 60px rgba(0,0,0,0.5),inset 0 0 0 1px #444" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width: 64, height: 20, background: "#181818", borderRadius: "0 0 12px 12px" }}/>
        <div className="rounded-3xl overflow-hidden" style={{ height: 420, background: "#000" }}>
          {children}
        </div>
      </div>
      <div className="absolute right-0 top-20 w-1 h-8 rounded-l bg-gray-700" style={{ right: -1 }}/>
      <div className="absolute left-0 top-16 w-1 h-7 rounded-r bg-gray-700" style={{ left: -1 }}/>
      <div className="absolute left-0 top-28 w-1 h-7 rounded-r bg-gray-700" style={{ left: -1 }}/>
    </div>
  );
}

/* ────────────────────────────────────────── */

function OlusturIcerigi() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { data: session } = useSession();

  const sablonId       = searchParams.get("sablon") || "klasik-dugun";
  const sablon         = SABLONLAR.find(s => s.id === sablonId) || SABLONLAR[0];
  const sablonTipi     = getSablonTipi(sablonId);
  const isNisanLuks    = sablonId === "nisan-luks";
  const isDugunLuks    = sablonId === "dugun-luks";
  const isLuks         = isNisanLuks || isDugunLuks || sablonId === "dogumgunu-luks";
  const nisanVeyaDugun = sablon.kategori === "nisan" || sablon.kategori === "dugun";

  const isPremiumSablon = PREMIUM_SABLON_IDS.has(sablonId);
  const kullaniciBilinen = session !== undefined;
  const userPlan  = (session?.user as any)?.plan ?? "free";
  const premiumEngel = isPremiumSablon && userPlan === "free";

  const [form, setForm] = useState({
    baslik: "", etkinlikTur: sablon.kategori,
    tarih: "", saat: "", mekan: "", mesaj: "",
    font: "font-sans", renk: sablon.renk,
    kisi1: "", kisi2: "", muzik: "",
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata]             = useState("");
  const [tutorialAcik, setTutorialAcik] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("olustur-tutorial-goruldu")) setTutorialAcik(true);
  }, []);

  function tutorialKapat() {
    localStorage.setItem("olustur-tutorial-goruldu", "1");
    setTutorialAcik(false);
  }

  const [notAcik,        setNotAcik]        = useState(false);
  const [muzikAcik,      setMuzikAcik]      = useState(false);
  const [spotifyAcik,    setSpotifyAcik]    = useState(false);
  const [aniAcik,        setAniAcik]        = useState(false);
  const [sesliAniAcik,   setSesliAniAcik]   = useState(false);
  const [canliDuvarAcik, setCanliDuvarAcik] = useState(false);
  const [dressKodAcik,   setDressKodAcik]   = useState(false);
  const [dressKodMetin,  setDressKodMetin]  = useState("");
  const [dressRenkler,   setDressRenkler]   = useState<DressRenkler>(["#6B1A2B","#1A6B45","#C4A05A","#1A1A1A","#F5EDD8"]);

  const hasPolaroid        = isNisanLuks;
  const hasSesliOzellikler = isNisanLuks;
  const hasDressKod        = nisanVeyaDugun;

  const [polaroidler,        setPolaroidler]        = useState<[string|null,string|null,string|null]>([null,null,null]);
  const [polaroidYukleniyor, setPolaroidYukleniyor] = useState<[boolean,boolean,boolean]>([false,false,false]);
  const [polaroidAcik,       setPolaroidAcik]       = useState(false);

  async function gorselSikistir(file: File, maxPx = 1400, quality = 0.85): Promise<File> {
    return new Promise((resolve) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const { naturalWidth: w, naturalHeight: h } = img;
        const scale = Math.min(1, maxPx / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          blob => resolve(blob ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }) : file),
          "image/jpeg", quality
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  async function polaroidSec(index: 0|1|2, file: File) {
    setPolaroidYukleniyor(prev => { const n = [...prev] as typeof prev; n[index] = true; return n; });
    try {
      const sikistirilmis = await gorselSikistir(file);
      const fd = new FormData();
      fd.append("dosya", sikistirilmis);
      const res  = await fetch("/api/upload-temp", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) setPolaroidler(prev => { const n = [...prev] as typeof prev; n[index] = json.url; return n; });
    } finally {
      setPolaroidYukleniyor(prev => { const n = [...prev] as typeof prev; n[index] = false; return n; });
    }
  }

  const muzikAktif      = planOzellikVar(userPlan, "muzik");
  const aniAktif        = planOzellikVar(userPlan, "album");
  const sesliAniAktif   = planOzellikVar(userPlan, "sesliAni");
  const canliDuvarAktif = planOzellikVar(userPlan, "canliDuvar");

  type SpPlaylist = { id: string; isim: string; kapak: string | null; sarki: number };
  const [spPlaylists,  setSpPlaylists]  = useState<SpPlaylist[] | null>(null);
  const [spBagli,      setSpBagli]      = useState<boolean | null>(null);
  const [spYukleniyor, setSpYukleniyor] = useState(false);
  const [spMod,        setSpMod]        = useState<"yeni" | "mevcut">("yeni");
  const [spSeciliId,   setSpSeciliId]   = useState<string | null>(null);

  useEffect(() => {
    if (!spotifyAcik || !muzikAktif || spPlaylists !== null) return;
    setSpYukleniyor(true);
    fetch("/api/dashboard/spotify/playlists")
      .then(r => r.json())
      .then(d => { setSpBagli(d.bagli ?? false); setSpPlaylists(d.playlists ?? []); })
      .catch(() => setSpBagli(false))
      .finally(() => setSpYukleniyor(false));
  }, [spotifyAcik, muzikAktif, spPlaylists]);

  const handleSubmit = async () => {
    if (!form.tarih || !form.mekan)               { setHata("Lütfen tarih ve mekan alanlarını doldurun."); return; }
    if (nisanVeyaDugun && (!form.kisi1 || !form.kisi2)) { setHata("Lütfen iki kişinin adını girin."); return; }
    if (!nisanVeyaDugun && !form.baslik)           { setHata("Lütfen davetiye başlığını girin."); return; }
    setYukleniyor(true); setHata("");
    const gonderilecekBaslik = nisanVeyaDugun ? `${form.kisi1} & ${form.kisi2}` : form.baslik;
    try {
      const res = await fetch("/api/davetiye/olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          baslik:            gonderilecekBaslik,
          sablon:            sablonId,
          mesaj:             notAcik ? form.mesaj : null,
          muzik:             muzikAcik ? form.muzik : null,
          spotifyAktif:      spotifyAcik,
          spotifyPlaylistId: spotifyAcik && spMod === "mevcut" ? spSeciliId : null,
          polaroid1:         polaroidler[0],
          polaroid2:         polaroidler[1],
          polaroid3:         polaroidler[2],
          albumAktif:        aniAcik,
          sesliAniAktif:     sesliAniAcik,
          canliDuvarAktif:   canliDuvarAcik,
          dressKod:          dressKodAcik && dressKodMetin.trim() ? dressKodMetin.trim() : null,
          dressKodRenkler:   dressKodAcik && dressKodMetin.trim() ? JSON.stringify(dressRenkler) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHata(data.hata || "Bir hata oluştu.");
        if (data.upsell) setTimeout(() => router.push("/fiyatlar"), 2000);
        return;
      }
      router.push(`/dashboard/davetiye/${data.slug}?yeni=1`);
    } catch { setHata("Bir hata oluştu, tekrar deneyin."); }
    finally { setYukleniyor(false); }
  };

  const previewVeri: DavetiyeVeri = {
    id: "preview", slug: "preview",
    baslik: nisanVeyaDugun
      ? `${form.kisi1 || "Kişi 1"} & ${form.kisi2 || "Kişi 2"}`
      : form.baslik || "Davetiye Başlığı",
    etkinlikTur:    sablon.kategori,
    tarih:          form.tarih ? new Date(`${form.tarih}T${form.saat || "12:00"}`) : null,
    mekan:          form.mekan || null,
    mesaj:          notAcik ? (form.mesaj || null) : null,
    sablon:         sablonId,
    ozelRenk:       form.renk || null,
    font:           form.font || null,
    muzik:          null,
    goruntulenme:   0,
    user:           { name: null, email: null },
    kisi1:          form.kisi1 || null,
    kisi2:          form.kisi2 || null,
    spotifyAktif:   spotifyAcik,
    albumAktif:     aniAcik,
    polaroid1:      polaroidler[0],
    polaroid2:      polaroidler[1],
    polaroid3:      polaroidler[2],
    sesliAniAktif:  sesliAniAcik,
    canliDuvarAktif: canliDuvarAcik,
    dressKod:       dressKodAcik && dressKodMetin.trim() ? dressKodMetin.trim() : null,
    dressKodRenkler: dressKodAcik && dressKodMetin.trim() ? JSON.stringify(dressRenkler) : null,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {tutorialAcik && <TutorialModal onKapat={tutorialKapat} />}

      {/* ── Üst Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-3">
            <Link href="/sablonlar" className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <p className="text-xs text-gray-400">Şablon</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">{sablon.isim}</p>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={yukleniyor}
            className="shrink-0 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-purple-200 flex items-center gap-2">
            {yukleniyor ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Oluşturuluyor</>
            ) : (
              <>Davetiye Oluştur →</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

          {/* ── Sol — Form ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Premium engel */}
            {premiumEngel && kullaniciBilinen && (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 text-center">
                <div className="text-4xl mb-3">👑</div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Lüks Şablon</h2>
                <p className="text-gray-500 text-sm mb-1">
                  <span className="font-semibold text-gray-700">{sablon.isim}</span> yalnızca ücretli planlarda kullanılabilir.
                </p>
                <p className="text-gray-400 text-xs mb-5">Ücretsiz planda temel şablonlardan davetiye oluşturabilirsiniz.</p>
                <div className="flex flex-col gap-2.5">
                  <button onClick={() => router.push("/fiyatlar")}
                    className="bg-amber-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-amber-600 transition-colors text-sm">
                    Planları Gör →
                  </button>
                  <button onClick={() => router.push("/sablonlar")}
                    className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm">
                    Temel Şablonlara Dön
                  </button>
                </div>
              </div>
            )}

            {!premiumEngel && (
              <>
                {/* ── 1. Temel Bilgiler ── */}
                <div>
                  <SectionHeader step={1} baslik="Temel Bilgiler" aciklama="Davetiyenizde görünecek zorunlu bilgiler" />
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">

                    {nisanVeyaDugun ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          İsimler <span className="text-red-400 font-normal text-xs">zorunlu</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <input type="text" placeholder="1. kişi (örn. Ayşe)"
                            value={form.kisi1} onChange={e => setForm({ ...form, kisi1: e.target.value })}
                            className={INPUT} />
                          <input type="text" placeholder="2. kişi (örn. Mehmet)"
                            value={form.kisi2} onChange={e => setForm({ ...form, kisi2: e.target.value })}
                            className={INPUT} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Davetiyede büyük harfle "Ayşe &amp; Mehmet" şeklinde görünür.</p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Başlık <span className="text-red-400 font-normal text-xs">zorunlu</span>
                        </label>
                        <input type="text" placeholder="Örn: Can'ın 30. Doğum Günü"
                          value={form.baslik} onChange={e => setForm({ ...form, baslik: e.target.value })}
                          className={INPUT} />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Tarih <span className="text-red-400 font-normal text-xs">zorunlu</span>
                        </label>
                        <input type="date" value={form.tarih}
                          onChange={e => setForm({ ...form, tarih: e.target.value })}
                          className={DATE_INPUT} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Saat</label>
                        <input type="time" value={form.saat}
                          onChange={e => setForm({ ...form, saat: e.target.value })}
                          className={DATE_INPUT} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Mekan <span className="text-red-400 font-normal text-xs">zorunlu</span>
                      </label>
                      <input type="text" placeholder="Mekan adı veya adres"
                        value={form.mekan} onChange={e => setForm({ ...form, mekan: e.target.value })}
                        className={INPUT} />
                      {form.mekan && (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.mekan)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 mt-1 inline-flex items-center gap-1 hover:underline">
                          🗺️ Google Maps&apos;te kontrol et
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── 2. Görünüm (sadece klasik şablonlar) ── */}
                {!isLuks && (
                  <div>
                    <SectionHeader step={2} baslik="Görünüm" aciklama="Renk ve yazı stili seçimi" />
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Tema Rengi</label>
                        <div className="flex gap-2.5 flex-wrap">
                          {["#7C3AED","#DB2777","#0891B2","#059669","#D97706","#DC2626","#1D4ED8","#111827"].map(renk => (
                            <button key={renk} type="button" onClick={() => setForm({ ...form, renk })}
                              className="w-10 h-10 rounded-full transition-all active:scale-95 border-4"
                              style={{
                                backgroundColor: renk,
                                borderColor: form.renk === renk ? "white" : "transparent",
                                boxShadow: form.renk === renk ? `0 0 0 3px ${renk}` : "none",
                              }} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Yazı Stili</label>
                        <div className="grid grid-cols-3 gap-2">
                          {FONTLAR.map(font => (
                            <button key={font.id} type="button" onClick={() => setForm({ ...form, font: font.id })}
                              className={`p-3 rounded-xl border-2 transition-all active:scale-95 ${
                                form.font === font.id ? "border-purple-500 bg-purple-50" : "border-gray-100 hover:border-gray-200"
                              }`}>
                              <span className="text-xl block mb-1" style={{
                                fontFamily: font.id === "font-sans" ? "system-ui" : font.id === "font-serif" ? "Georgia,serif" : "monospace"
                              }}>{font.ornek}</span>
                              <span className="text-xs text-gray-500">{font.isim}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 3. Özellikler ── */}
                <div>
                  <SectionHeader
                    step={isLuks ? 2 : 3}
                    baslik="Özellikler Ekle"
                    aciklama="Aşağıdaki özellikler isteğe bağlıdır — istediğinizi açın"
                  />
                  <div className="space-y-2.5">

                    {/* 📝 Kişisel Not */}
                    <OzellikKarti
                      icon="📝" baslik="Kişisel Not"
                      aciklama="Davetiyenin en altında misafirlere özel bir mesaj göster"
                      misafirGorur="Davetiyenin alt kısmında kişisel mesajınız görünür"
                      acik={notAcik} onToggle={() => setNotAcik(!notAcik)}
                    >
                      <textarea
                        placeholder="Örn: Bu özel günü sizinle paylaşmaktan büyük mutluluk duyuyoruz..."
                        value={form.mesaj}
                        onChange={e => setForm({ ...form, mesaj: e.target.value })}
                        rows={3}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white resize-none"
                      />
                    </OzellikKarti>

                    {/* 🖼️ Polaroid Fotoğrafları */}
                    {hasPolaroid && (
                      <OzellikKarti
                        icon="🖼️" baslik="Polaroid Fotoğrafları"
                        aciklama="Sizinle ilgili 3 fotoğraf, davetiyede Polaroid kart efektiyle gösterilir"
                        misafirGorur="En Güzel Anılar bölümünde 3 fotoğrafınız sallanarak belirir"
                        acik={polaroidAcik} onToggle={() => setPolaroidAcik(!polaroidAcik)}
                      >
                        <div className="grid grid-cols-3 gap-2.5">
                          {([0, 1, 2] as const).map(i => (
                            <label key={i} className="relative cursor-pointer group">
                              <div className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                                polaroidler[i] ? "border-purple-300 bg-purple-50/40" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                              }`}>
                                {polaroidYukleniyor[i] ? (
                                  <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
                                ) : polaroidler[i] ? (
                                  <>
                                    <img src={polaroidler[i]!} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                      <span className="text-white text-xs font-semibold">Değiştir</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center gap-1 text-gray-400">
                                    <span className="text-xl">📷</span>
                                    <span className="text-xs">{i + 1}. foto</span>
                                  </div>
                                )}
                              </div>
                              <input type="file" accept="image/*" className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) polaroidSec(i, f); }} />
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Boş bırakılan kartta varsayılan görsel görünür. Max boyut sınırı yoktur.</p>
                      </OzellikKarti>
                    )}

                    {/* 👗 Dress Code */}
                    {hasDressKod && (
                      <OzellikKarti
                        icon="👗" baslik="Kıyafet Kodu"
                        aciklama="Davetiyede özel bir Dress Code bölümü açılır, renk paleti gösterilir"
                        misafirGorur="Davetiyede 'Gecenin Renkleri' başlıklı bir bölüm belirir"
                        acik={dressKodAcik} onToggle={() => setDressKodAcik(!dressKodAcik)}
                      >
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {DRESS_KOD_PRESETLER.map(p => (
                              <button key={p.isim} type="button"
                                onClick={() => { setDressKodMetin(p.isim); setDressRenkler(p.renkler); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                  dressKodMetin === p.isim
                                    ? "border-purple-400 bg-purple-50 text-purple-700"
                                    : "border-gray-200 text-gray-600 hover:border-purple-300"
                                }`}>
                                <span className="flex gap-0.5">
                                  {p.renkler.slice(0,5).map((r, ri) => (
                                    <span key={ri} className="w-2.5 h-2.5 rounded-full" style={{ background: r }} />
                                  ))}
                                </span>
                                {p.isim}
                              </button>
                            ))}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Kıyafet kodu metni</label>
                            <input type="text" placeholder="örn. Şık & Zarif, Bohem, Siyah Kravat"
                              value={dressKodMetin} maxLength={60}
                              onChange={e => setDressKodMetin(e.target.value)}
                              className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-2 block">Renk paleti (özelleştir)</label>
                            <div className="flex gap-3">
                              {([0,1,2,3,4] as const).map(i => (
                                <label key={i} className="flex flex-col items-center gap-1 cursor-pointer">
                                  <div className="w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden"
                                    style={{ background: dressRenkler[i] }}>
                                    <input type="color" value={dressRenkler[i]}
                                      onChange={e => {
                                        const n = [...dressRenkler] as DressRenkler;
                                        n[i] = e.target.value; setDressRenkler(n);
                                      }}
                                      className="opacity-0 w-full h-full cursor-pointer" />
                                  </div>
                                  <span className="text-[10px] text-gray-400">{i+1}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </OzellikKarti>
                    )}

                    {/* 🎵 Arka Plan Müziği */}
                    <OzellikKarti
                      icon="🎵" baslik="Arka Plan Müziği"
                      aciklama="Davetiye açıldığında seçtiğiniz şarkı otomatik çalmaya başlar"
                      misafirGorur="Misafir davetiyeyi açtığı anda müzik başlar (durdurabiliyor)"
                      planEtiketi={!muzikAktif ? "Standart+" : undefined}
                      locked={!muzikAktif}
                      lockedMsg="Standart Plan →"
                      acik={muzikAcik} onToggle={() => setMuzikAcik(!muzikAcik)}
                    >
                      <SpotifyMuzikSecici secili={form.muzik} onChange={deger => setForm({ ...form, muzik: deger })} />
                    </OzellikKarti>

                    {/* 🎧 Spotify Şarkı İsteği */}
                    <OzellikKarti
                      icon="🎧" baslik="Spotify Şarkı İsteği"
                      aciklama="RSVP formunda misafirler çalma listesine şarkı önerebilir"
                      misafirGorur="RSVP formunda 'Dans etmek istediğin şarkı?' sorusu görünür"
                      planEtiketi={!muzikAktif ? "Standart+" : undefined}
                      locked={!muzikAktif}
                      lockedMsg="Standart Plan →"
                      acik={spotifyAcik} onToggle={() => setSpotifyAcik(!spotifyAcik)}
                    >
                      {spYukleniyor ? (
                        <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
                          <span className="w-4 h-4 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
                          Spotify kontrol ediliyor...
                        </div>
                      ) : spBagli === false ? (
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 items-start">
                          <span className="text-xl shrink-0">⚠️</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Spotify hesabı bağlı değil</p>
                            <a href="/dashboard/ayarlar" target="_blank"
                              className="text-xs font-semibold text-[#1DB954] hover:underline">
                              Ayarlardan Spotify&apos;ı bağla →
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex rounded-xl overflow-hidden border border-gray-200 text-xs font-semibold">
                            {(["yeni", "mevcut"] as const).map(mod => (
                              <button key={mod} type="button"
                                onClick={() => { setSpMod(mod); if (mod === "yeni") setSpSeciliId(null); }}
                                className={`flex-1 py-2 transition-colors ${spMod === mod ? "bg-[#1DB954] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                                {mod === "yeni" ? "✨ Yeni Playlist Oluştur" : "📋 Mevcut Playlist'ten Seç"}
                              </button>
                            ))}
                          </div>
                          {spMod === "yeni" ? (
                            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex gap-2 items-center">
                              <span className="text-[#1DB954]">✓</span>
                              <p className="text-xs text-gray-600">Davetiye oluşturulunca Spotify&apos;da otomatik playlist açılır.</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {(spPlaylists ?? []).length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-3">Henüz playlist yok.</p>
                              ) : (spPlaylists ?? []).map(pl => (
                                <button key={pl.id} type="button"
                                  onClick={() => setSpSeciliId(pl.id)}
                                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                                    spSeciliId === pl.id ? "border-[#1DB954] bg-green-50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                  }`}>
                                  {pl.kapak
                                    ? <img src={pl.kapak} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                                    : <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">🎵</div>
                                  }
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{pl.isim}</p>
                                    <p className="text-xs text-gray-400">{pl.sarki} şarkı</p>
                                  </div>
                                  {spSeciliId === pl.id && <span className="text-[#1DB954] shrink-0 font-bold">✓</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </OzellikKarti>

                    {/* 📖 Fotoğraf & Anı Albümü */}
                    <OzellikKarti
                      icon="📖" baslik="Fotoğraf & Anı Albümü"
                      aciklama="Misafirler etkinlik boyunca fotoğraf yükleyebilir ve anı yazabilir"
                      misafirGorur="Davetiyede bir albüm butonu belirir; yükledikleri fotoğraflar dashboard'da sana gelir"
                      planEtiketi={!aniAktif ? "Premium" : undefined}
                      locked={!aniAktif}
                      lockedMsg="Premium →"
                      acik={aniAcik} onToggle={() => setAniAcik(!aniAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Albüm aktif. Misafirler fotoğraf yükleyip anı yazabilir. Yüklenenler Dashboard → Albüm&apos;den onaylanabilir.</p>
                      </div>
                    </OzellikKarti>

                    {/* 🎙️ Sesli Anı */}
                    {hasSesliOzellikler && (
                      <OzellikKarti
                        icon="🎙️" baslik="Sesli Anı"
                        aciklama="Misafirler tarayıcıdan 30 saniyeye kadar sesli mesaj kaydedebilir"
                        misafirGorur="Davetiyede bir mikrofon butonu belirir; kayıtlar onayınızla yayınlanır"
                        planEtiketi={!sesliAniAktif ? "Premium" : undefined}
                        locked={!sesliAniAktif}
                        lockedMsg="Premium →"
                        acik={sesliAniAcik} onToggle={() => setSesliAniAcik(!sesliAniAcik)}
                      >
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                          <span className="text-base shrink-0">✅</span>
                          <p className="text-xs text-gray-600 leading-relaxed">Sesli Anı aktif. Dashboard → Sesli Anılar'dan kayıtları dinleyip onaylayabilirsiniz.</p>
                        </div>
                      </OzellikKarti>
                    )}

                    {/* 📸 Canlı Fotoğraf Duvarı */}
                    {hasSesliOzellikler && (
                      <OzellikKarti
                        icon="📸" baslik="Canlı Fotoğraf Duvarı"
                        aciklama="Misafirlerin yüklediği fotoğraflar büyük ekranda anında yayınlanır"
                        misafirGorur="Salonunuzdaki ekrana davetiye.link/duvar açılırsa fotoğraflar canlı akar"
                        planEtiketi={!canliDuvarAktif ? "Premium" : undefined}
                        locked={!canliDuvarAktif}
                        lockedMsg="Premium →"
                        acik={canliDuvarAcik} onToggle={() => setCanliDuvarAcik(!canliDuvarAcik)}
                      >
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                          <span className="text-base shrink-0">✅</span>
                          <p className="text-xs text-gray-600 leading-relaxed">Canlı Duvar aktif. Misafir fotoğrafları otomatik onaylanır ve anında duvarda görünür.</p>
                        </div>
                      </OzellikKarti>
                    )}
                  </div>
                </div>

                {/* Hata + Oluştur */}
                {hata && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>⚠️</span> {hata}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={yukleniyor}
                  className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 active:scale-[0.99] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-200">
                  {yukleniyor ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Oluşturuluyor...</>
                  ) : (
                    "Davetiyemi Oluştur →"
                  )}
                </button>

                <div className="h-2" />
              </>
            )}
          </div>

          {/* ── Sağ — Canlı Önizleme ── */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Canlı Önizleme</p>
              </div>
              <TelefonMockup>
                {/* zoom ile full-size render, scrollbar gizli ama scrollable */}
                <div style={{
                  zoom: SCALE,
                  width: NAT_W,
                  height: `${Math.ceil(420 / SCALE)}px`,
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollbarWidth: "none",
                } as React.CSSProperties} className="[&::-webkit-scrollbar]:hidden">
                  {sablonTipi === "nisan-luks"     && <NisanLuksSablon     davetiye={previewVeri} rsvpBileseni={null} previewModu />}
                  {sablonTipi === "dugun-luks"     && <DugunLuksSablon     davetiye={previewVeri} rsvpBileseni={null} previewModu />}
                  {sablonTipi === "dogumgunu-luks" && <DogumGunuLuksSablon davetiye={previewVeri} rsvpBileseni={null} previewModu />}
                  {sablonTipi === "klasik"         && <KlasikSablon        davetiye={previewVeri} rsvpBileseni={null} />}
                </div>
              </TelefonMockup>
              <div className="mt-3 flex flex-col items-center gap-1">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="text-sm animate-bounce inline-block">↕</span>
                  Önizlemeyi fare tekerleğiyle kaydırın
                </p>
                <p className="text-[10px] text-gray-300">Değişiklikler anında yansır</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function TutorialModal({ onKapat }: { onKapat: () => void }) {
  const adimlar = [
    {
      numara: "1",
      renk: "bg-purple-600",
      bg: "bg-purple-50 border-purple-100",
      baslik: "Temel Bilgileri Doldurun",
      aciklama: "İsimler, tarih, saat ve mekan alanlarını girin. Bunlar davetiyenizde görünecek zorunlu bilgilerdir.",
    },
    {
      numara: "2",
      renk: "bg-amber-500",
      bg: "bg-amber-50 border-amber-100",
      baslik: "İstediğiniz Özellikleri Açın",
      aciklama: "Müzik, kıyafet kodu, polaroid fotoğrafları ve daha fazlasını sağdaki toggle ile açıp kapatabilirsiniz. Her özelliğin açıklamasını okuyarak karar verin.",
    },
    {
      numara: "📱",
      renk: "bg-green-600",
      bg: "bg-green-50 border-green-100",
      baslik: "Canlı Önizlemeyi Kaydırın",
      aciklama: "Sağdaki telefon ekranında davetiyenizi gerçek zamanlı görüntüleyin. Fare tekerleğiyle kaydırarak tüm bölümleri inceleyebilirsiniz.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onKapat} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 z-10">

        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-lg font-bold text-gray-900">Davetiye Oluşturucu</h2>
          <p className="text-xs text-gray-400 mt-1">Nasıl çalışır? Hızlıca öğrenelim.</p>
        </div>

        <div className="space-y-3 mb-5">
          {adimlar.map(a => (
            <div key={a.baslik} className={`flex gap-3 p-3.5 rounded-2xl border ${a.bg}`}>
              <div className={`w-9 h-9 rounded-full ${a.renk} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                {a.numara}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{a.baslik}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.aciklama}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onKapat}
          className="w-full bg-purple-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-purple-700 active:scale-[0.99] transition-all shadow-md shadow-purple-200">
          Hadi Başlayalım →
        </button>

        <p className="text-center text-[10px] text-gray-400 mt-2.5">
          Bu rehber bir daha gösterilmeyecek
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ step, baslik, aciklama }: { step: number; baslik: string; aciklama: string }) {
  return (
    <div className="flex items-start gap-3 mb-3 px-1">
      <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {step}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{baslik}</p>
        <p className="text-xs text-gray-400">{aciklama}</p>
      </div>
    </div>
  );
}

export default function OlusturSayfasi() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="w-5 h-5 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
          Yükleniyor...
        </div>
      </div>
    }>
      <OlusturIcerigi/>
    </Suspense>
  );
}

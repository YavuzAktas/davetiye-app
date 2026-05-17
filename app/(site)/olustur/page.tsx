"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SABLONLAR } from "@/lib/sablonlar";
import Link from "next/link";
import { getSablonTipi } from "@/lib/sablon-registry";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import MuzikSecici from "@/components/MuzikSecici";
import { davetiyeFiyatiHesapla, tutarMetni, type DavetiyeFiyatSonucu } from "@/lib/davetiye-fiyatlandirma";

const FONTLAR = [
  { id: "font-sans",  isim: "Modern",   ornek: "Aa" },
  { id: "font-serif", isim: "Klasik",   ornek: "Aa" },
  { id: "font-mono",  isim: "Teknik",   ornek: "Aa" },
];

const NAT_W = 390;
const SCALE = 204 / NAT_W;

const KlasikSablon = dynamic(() => import("@/components/sablonlar/KlasikSablon"));
const NisanLuksSablon = dynamic(() => import("@/components/sablonlar/NisanLuksSablon"));
const DugunLuksSablon = dynamic(() => import("@/components/sablonlar/DugunLuksSablon"));
const DogumGunuLuksSablon = dynamic(() => import("@/components/sablonlar/DogumGunuLuksSablon"));

type DressRenkler = [string,string,string,string,string];
type ZorunluAlan = "kisi1" | "kisi2" | "baslik" | "tarih" | "mekan";

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
const INPUT_HATA = "border-red-300 bg-red-50/50 focus:ring-red-100 focus:border-red-400";

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

  const [form, setForm] = useState({
    baslik: "", etkinlikTur: sablon.kategori,
    tarih: "", saat: "", mekan: "", mesaj: "",
    font: "font-sans", renk: sablon.renk,
    kisi1: "", kisi2: "", muzik: "",
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata]             = useState("");
  const [alanHatalari, setAlanHatalari] = useState<Partial<Record<ZorunluAlan, string>>>({});
  const [tutorialAcik, setTutorialAcik] = useState(false);
  const [mobilOnizlemeAcik, setMobilOnizlemeAcik] = useState(false);
  const alanRefleri = useRef<Partial<Record<ZorunluAlan, HTMLInputElement | null>>>({});

  useEffect(() => {
    if (!localStorage.getItem("olustur-tutorial-goruldu")) setTutorialAcik(true);
  }, []);

  function tutorialKapat() {
    localStorage.setItem("olustur-tutorial-goruldu", "1");
    setTutorialAcik(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobilOnizlemeAcik ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobilOnizlemeAcik]);

  const [notAcik,        setNotAcik]        = useState(false);
  const [muzikAcik,      setMuzikAcik]      = useState(false);
  const [aniAcik,        setAniAcik]        = useState(false);
  const [sesliAniAcik,   setSesliAniAcik]   = useState(false);
  const [canliDuvarAcik, setCanliDuvarAcik] = useState(false);
  const [oturmaPlanAcik, setOturmaPlanAcik] = useState(false);
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

  const fiyat = davetiyeFiyatiHesapla({
    sablon: sablonId,
    muzik: muzikAcik ? form.muzik : null,
    albumAktif: aniAcik,
    sesliAniAktif: sesliAniAcik,
    canliDuvarAktif: canliDuvarAcik,
    oturmaPlanAktif: oturmaPlanAcik,
  });

  const alanRefi = (alan: ZorunluAlan) => (el: HTMLInputElement | null) => {
    alanRefleri.current[alan] = el;
  };

  const zorunluAlanClass = (alan: ZorunluAlan, temelClass = INPUT) =>
    `${temelClass} ${alanHatalari[alan] ? INPUT_HATA : ""}`;

  const alanHatasi = (alan: ZorunluAlan) =>
    alanHatalari[alan] ? (
      <p className="mt-1.5 text-xs font-medium text-red-500">{alanHatalari[alan]}</p>
    ) : null;

  const formAlaniGuncelle = (alan: keyof typeof form, deger: string) => {
    setForm(prev => ({ ...prev, [alan]: deger }));
    if (["kisi1", "kisi2", "baslik", "tarih", "mekan"].includes(alan)) {
      setAlanHatalari(prev => ({ ...prev, [alan]: undefined }));
      setHata("");
    }
  };

  const ilkHataliAlanaGit = (hatalar: Partial<Record<ZorunluAlan, string>>) => {
    const siraliAlanlar: ZorunluAlan[] = nisanVeyaDugun
      ? ["kisi1", "kisi2", "tarih", "mekan"]
      : ["baslik", "tarih", "mekan"];
    const ilkAlan = siraliAlanlar.find(alan => hatalar[alan]);
    if (!ilkAlan) return;

    requestAnimationFrame(() => {
      const hedef = alanRefleri.current[ilkAlan];
      hedef?.scrollIntoView({ behavior: "smooth", block: "center" });
      hedef?.focus({ preventScroll: true });
    });
  };

  const handleSubmit = async () => {
    if (!session) {
      router.push("/giris");
      return;
    }

    const yeniHatalar: Partial<Record<ZorunluAlan, string>> = {};

    if (nisanVeyaDugun) {
      if (!form.kisi1.trim()) yeniHatalar.kisi1 = "1. kişinin adını girin.";
      if (!form.kisi2.trim()) yeniHatalar.kisi2 = "2. kişinin adını girin.";
    } else if (!form.baslik.trim()) {
      yeniHatalar.baslik = "Davetiye başlığını girin.";
    }
    if (!form.tarih) yeniHatalar.tarih = "Etkinlik tarihini seçin.";
    if (!form.mekan.trim()) yeniHatalar.mekan = "Mekan adı veya adres girin.";

    if (Object.keys(yeniHatalar).length > 0) {
      setAlanHatalari(yeniHatalar);
      setHata("Lütfen işaretli zorunlu alanları tamamlayın.");
      ilkHataliAlanaGit(yeniHatalar);
      return;
    }

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
          polaroid1:         polaroidler[0],
          polaroid2:         polaroidler[1],
          polaroid3:         polaroidler[2],
          albumAktif:        aniAcik,
          sesliAniAktif:     sesliAniAcik,
          canliDuvarAktif:   canliDuvarAcik,
          oturmaPlanAktif:   oturmaPlanAcik,
          dressKod:          dressKodAcik && dressKodMetin.trim() ? dressKodMetin.trim() : null,
          dressKodRenkler:   dressKodAcik && dressKodMetin.trim() ? JSON.stringify(dressRenkler) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHata(data.hata || "Bir hata oluştu.");
        return;
      }
      router.push(`/dashboard/davetiye/${data.slug}?yeni=1&odeme=bekliyor`);
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
    muzik:          muzikAcik ? (form.muzik || null) : null,
    goruntulenme:   0,
    user:           { name: null, email: null },
    kisi1:          form.kisi1 || null,
    kisi2:          form.kisi2 || null,
    albumAktif:     polaroidAcik,
    polaroid1:      polaroidAcik ? polaroidler[0] : null,
    polaroid2:      polaroidAcik ? polaroidler[1] : null,
    polaroid3:      polaroidAcik ? polaroidler[2] : null,
    sesliAniAktif:  sesliAniAcik,
    canliDuvarAktif: canliDuvarAcik,
    dressKod:       dressKodAcik && dressKodMetin.trim() ? dressKodMetin.trim() : null,
    dressKodRenkler: dressKodAcik && dressKodMetin.trim() ? JSON.stringify(dressRenkler) : null,
  };

  const onizlemeIcerigi = (
    <>
      {sablonTipi === "nisan-luks"     && <NisanLuksSablon     davetiye={previewVeri} rsvpBileseni={null} previewModu />}
      {sablonTipi === "dugun-luks"     && <DugunLuksSablon     davetiye={previewVeri} rsvpBileseni={null} previewModu />}
      {sablonTipi === "dogumgunu-luks" && <DogumGunuLuksSablon davetiye={previewVeri} rsvpBileseni={null} previewModu />}
      {sablonTipi === "klasik"         && <KlasikSablon        davetiye={previewVeri} rsvpBileseni={null} />}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {tutorialAcik && <TutorialModal onKapat={tutorialKapat} />}
      {mobilOnizlemeAcik && (
        <MobilOnizlemeModal onKapat={() => setMobilOnizlemeAcik(false)}>
          {onizlemeIcerigi}
        </MobilOnizlemeModal>
      )}

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
              <>Ödeme Adımına Geç →</>
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMobilOnizlemeAcik(true)}
        className="lg:hidden fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-gray-900/25 active:scale-95"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Önizle
      </button>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-5 pb-24 sm:pt-8 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

          {/* ── Sol — Form ── */}
          <div className="lg:col-span-3 space-y-5">

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
                            ref={alanRefi("kisi1")}
                            value={form.kisi1} onChange={e => formAlaniGuncelle("kisi1", e.target.value)}
                            aria-invalid={!!alanHatalari.kisi1}
                            className={zorunluAlanClass("kisi1")} />
                          <input type="text" placeholder="2. kişi (örn. Mehmet)"
                            ref={alanRefi("kisi2")}
                            value={form.kisi2} onChange={e => formAlaniGuncelle("kisi2", e.target.value)}
                            aria-invalid={!!alanHatalari.kisi2}
                            className={zorunluAlanClass("kisi2")} />
                        </div>
                        {(alanHatalari.kisi1 || alanHatalari.kisi2) && (
                          <div className="grid grid-cols-2 gap-2.5">
                            {alanHatasi("kisi1") ?? <span />}
                            {alanHatasi("kisi2") ?? <span />}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">Davetiyede büyük harfle "Ayşe &amp; Mehmet" şeklinde görünür.</p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Başlık <span className="text-red-400 font-normal text-xs">zorunlu</span>
                        </label>
                        <input type="text" placeholder="Örn: Can'ın 30. Doğum Günü"
                          ref={alanRefi("baslik")}
                          value={form.baslik} onChange={e => formAlaniGuncelle("baslik", e.target.value)}
                          aria-invalid={!!alanHatalari.baslik}
                          className={zorunluAlanClass("baslik")} />
                        {alanHatasi("baslik")}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Tarih <span className="text-red-400 font-normal text-xs">zorunlu</span>
                        </label>
                        <input type="date" value={form.tarih}
                          ref={alanRefi("tarih")}
                          onChange={e => formAlaniGuncelle("tarih", e.target.value)}
                          aria-invalid={!!alanHatalari.tarih}
                          className={zorunluAlanClass("tarih", DATE_INPUT)} />
                        {alanHatasi("tarih")}
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
                        ref={alanRefi("mekan")}
                        value={form.mekan} onChange={e => formAlaniGuncelle("mekan", e.target.value)}
                        aria-invalid={!!alanHatalari.mekan}
                        className={zorunluAlanClass("mekan")} />
                      {alanHatasi("mekan")}
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
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-xs text-amber-800 leading-relaxed">
                        <span className="font-semibold">Üçüncü kişi verileri: </span>
                        Davetiyeye başkasına veya çocuğa ait ad, fotoğraf ya da mesaj ekliyorsanız,
                        bu paylaşım için gerekli yetkiye sahip olduğunuzdan ve ilgili kişileri
                        bilgilendirdiğinizden emin olun.
                      </p>
                    </div>

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
                      aciklama="Seçtiğiniz şarkı için davetiyede bir çalma butonu gösterilir"
                      misafirGorur="Misafir davetiyeye dokunduğunda müzik başlar; istediği zaman durdurabilir"
                      planEtiketi="Ek ücret"
                      acik={muzikAcik} onToggle={() => setMuzikAcik(!muzikAcik)}
                    >
                      <MuzikSecici secili={form.muzik || null} onChange={url => setForm({ ...form, muzik: url ?? "" })} />
                    </OzellikKarti>

                    {/* 📖 Fotoğraf & Anı Albümü */}
                    <OzellikKarti
                      icon="📖" baslik="Fotoğraf & Anı Albümü"
                      aciklama="Misafirler etkinlik boyunca fotoğraf yükleyebilir ve anı yazabilir"
                      misafirGorur="Davetiyede bir albüm butonu belirir; yükledikleri fotoğraflar dashboard'da sana gelir"
                      planEtiketi="Ek ücret"
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
                        planEtiketi="Ek ücret"
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
                        aciklama="Misafirlerin yüklediği fotoğraflar onayınızdan sonra duvarda yayınlanır"
                        misafirGorur="Salonunuzdaki ekrana davetiye.link/duvar açılırsa onaylanan fotoğraflar canlı akar"
                        planEtiketi="Ek ücret"
                        acik={canliDuvarAcik} onToggle={() => setCanliDuvarAcik(!canliDuvarAcik)}
                      >
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                          <span className="text-base shrink-0">✅</span>
                          <p className="text-xs text-gray-600 leading-relaxed">Canlı Duvar aktif. Misafir fotoğrafları dashboard üzerinden onayladıktan sonra duvarda görünür.</p>
                        </div>
                      </OzellikKarti>
                    )}

                    {/* 🪑 Oturma Planı */}
                    <OzellikKarti
                      icon="🪑" baslik="Oturma Planı"
                      aciklama="Katılacak misafirleri masalara atayabileceğiniz yönetim ekranı açılır"
                      misafirGorur="Bu özellik sadece davetiye sahibinin panelinde görünür"
                      planEtiketi="Ek ücret"
                      acik={oturmaPlanAcik} onToggle={() => setOturmaPlanAcik(!oturmaPlanAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Oturma Planı aktif. Ödeme sonrası Dashboard → Oturma Planı bölümünden masa düzeninizi hazırlayabilirsiniz.</p>
                      </div>
                    </OzellikKarti>
                  </div>
                </div>

                <FiyatOzeti fiyat={fiyat} />

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
                    "Taslağı Oluştur ve Ödeme Adımına Geç →"
                  )}
                </button>

                <div className="h-2" />
              </>
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
                  {onizlemeIcerigi}
                </div>
              </TelefonMockup>
              <div className="mt-5">
                <FiyatOzeti fiyat={fiyat} kompakt />
              </div>
              <div className="mt-3 flex flex-col items-center gap-1">
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

function MobilOnizlemeModal({ children, onKapat }: { children: React.ReactNode; onKapat: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={onKapat} />
      <div className="absolute inset-x-0 bottom-0 max-h-[94dvh] rounded-t-[2rem] bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">Canlı Önizleme</p>
            <p className="mt-0.5 text-xs text-white/45">Davetiyen misafir ekranında böyle görünür</p>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 active:scale-95"
            aria-label="Önizlemeyi kapat"
          >
            x
          </button>
        </div>
        <div className="max-h-[calc(94dvh-73px)] overflow-y-auto px-4 py-5">
          <TelefonMockup>
            <div style={{
              zoom: SCALE,
              width: NAT_W,
              height: `${Math.ceil(420 / SCALE)}px`,
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
            } as React.CSSProperties} className="[&::-webkit-scrollbar]:hidden">
              {children}
            </div>
          </TelefonMockup>
          <p className="mt-4 text-center text-[11px] text-white/35">
            Alanları düzenledikçe bu önizleme anında güncellenir.
          </p>
        </div>
      </div>
    </div>
  );
}

function FiyatOzeti({ fiyat, kompakt = false }: { fiyat: DavetiyeFiyatSonucu; kompakt?: boolean }) {
  return (
    <div className={`rounded-2xl border border-purple-100 bg-white shadow-sm shadow-purple-50 ${kompakt ? "p-4" : "p-5"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">Fiyat Özeti</p>
          <p className="mt-1 text-sm text-gray-500">
            Seçtiğiniz davetiye ve özelliklere göre hesaplanır.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Toplam</p>
          <p className="text-2xl font-black text-gray-950">{tutarMetni(fiyat.toplamTutar)}</p>
        </div>
      </div>

      <div className={`mt-4 ${kompakt ? "space-y-2" : "space-y-2.5"}`}>
        {fiyat.kalemler.map(kalem => (
          <div key={kalem.kod} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
            <span className="text-xs font-medium text-gray-600">{kalem.ad}</span>
            <span className="text-xs font-bold text-gray-900">{tutarMetni(kalem.tutar)}</span>
          </div>
        ))}
      </div>

      {!kompakt && (
        <p className="mt-3 text-xs leading-relaxed text-gray-400">
          Ödeme tamamlanana kadar davetiye taslak olarak saklanır; ödeme sonrası yayına alınır.
        </p>
      )}
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

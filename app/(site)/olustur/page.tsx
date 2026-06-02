"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { SABLONLAR } from "@/lib/sablonlar";
import { clearSablonSecimi } from "@/components/SablonGeriDonusBanner";
import Link from "next/link";
import Image from "next/image";
import PageLoader from "@/components/PageLoader";
import { getSablonTipi } from "@/lib/sablon-registry";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import MuzikSecici from "@/components/MuzikSecici";
import { davetiyeFiyatiHesapla, tutarMetni, type DavetiyeFiyatSonucu } from "@/lib/davetiye-fiyatlandirma";
import { type RsvpSoru, type RsvpSoruId, VARSAYILAN_RSVP_SORULAR, SORU_META, soruGetir } from "@/lib/rsvp-sorular";

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
const VintageNisanSablon = dynamic(() => import("@/components/sablonlar/VintageNisanSablon"));

type DressRenkler = [string,string,string,string,string];
type ZorunluAlan = "kisi1" | "kisi1Soyad" | "kisi2" | "kisi2Soyad" | "baslik" | "tarih" | "mekan";

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
  locked, lockedMsg, planEtiketi,
  acik, onToggle,
  children,
  fiyatHref = "/fiyatlar",
}: {
  icon: string; baslik: string; aciklama: string; misafirGorur?: string;
  locked?: boolean; lockedMsg?: string; planEtiketi?: string;
  acik: boolean; onToggle: () => void;
  fiyatHref?: string;
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
                  : planEtiketi === "Dahil"
                    ? "bg-green-100 text-green-700"
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
            lockedMsg ? (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg whitespace-nowrap">
                {lockedMsg}
              </span>
            ) : (
              <Link href={fiyatHref} onClick={e => e.stopPropagation()}
                className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap">
                Yükselt →
              </Link>
            )
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
  const aktivasyonKodu = searchParams.get("aktivasyon") || "";
  const sablon         = SABLONLAR.find(s => s.id === sablonId) || SABLONLAR[0];
  const fiyatHref      = `/fiyatlar?sablon=${encodeURIComponent(sablon.id)}`;
  const sablonTipi     = getSablonTipi(sablonId);
  const isNisanLuks    = sablonId === "nisan-luks";
  const isVintageNisan = sablonId === "vintage-nisan";
  const isDugunLuks    = sablonId === "dugun-luks";
  const isLuks         = isNisanLuks || isVintageNisan || isDugunLuks || sablonId === "dogumgunu-luks";
  const nisanVeyaDugun = sablon.kategori === "nisan" || sablon.kategori === "dugun";

  const [form, setForm] = useState({
    baslik: "", etkinlikTur: sablon.kategori,
    tarih: "", saat: "", mekan: "", mesaj: "",
    font: "font-sans", renk: sablon.renk,
    muzik: "",
  });
  const [kisi1Ad,     setKisi1Ad]     = useState("");
  const [kisi1Soyad,  setKisi1Soyad]  = useState("");
  const [kisi2Ad,     setKisi2Ad]     = useState("");
  const [kisi2Soyad,  setKisi2Soyad]  = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata]             = useState("");
  const [alanHatalari, setAlanHatalari] = useState<Partial<Record<ZorunluAlan, string>>>({});
  const [tutorialAcik, setTutorialAcik] = useState(false);
  const [girisModalAcik, setGirisModalAcik] = useState(false);
  const [mobilOnizlemeAcik, setMobilOnizlemeAcik] = useState(false);
  const alanRefleri = useRef<Partial<Record<ZorunluAlan, HTMLInputElement | null>>>({});

  const TASLAK_KEY = `bekleriz_taslak_${sablonId}`;

  useEffect(() => {
    if (!localStorage.getItem("olustur-tutorial-goruldu")) setTutorialAcik(true);
  }, []);

  // Giriş sonrası kaydedilen taslağı geri yükle
  useEffect(() => {
    try {
      const s = sessionStorage.getItem(TASLAK_KEY);
      if (!s) return;
      const t = JSON.parse(s);
      sessionStorage.removeItem(TASLAK_KEY);
      if (t.form)                setForm(t.form);
      if (t.kisi1Ad)             setKisi1Ad(t.kisi1Ad);
      if (t.kisi1Soyad)          setKisi1Soyad(t.kisi1Soyad);
      if (t.kisi2Ad)             setKisi2Ad(t.kisi2Ad);
      if (t.kisi2Soyad)          setKisi2Soyad(t.kisi2Soyad);
      if (t.notAcik        != null) setNotAcik(t.notAcik);
      if (t.muzikAcik      != null) setMuzikAcik(t.muzikAcik);
      if (t.albumAcik      != null) setAlbumAcik(t.albumAcik);
      if (t.aniDefteriAcik != null) setAniDefteriAcik(t.aniDefteriAcik);
      if (t.sesliAniAcik   != null) setSesliAniAcik(t.sesliAniAcik);
      if (t.canliDuvarAcik  != null) setCanliDuvarAcik(t.canliDuvarAcik);
      if (t.oturmaPlanAcik  != null) setOturmaPlanAcik(t.oturmaPlanAcik);
      if (t.aniKitabiAcik   != null) setAniKitabiAcik(t.aniKitabiAcik);
      if (t.checkInAcik     != null) setCheckInAcik(t.checkInAcik);
      if (t.dressKodAcik      != null) setDressKodAcik(t.dressKodAcik);
      if (t.dressKodMetin)            setDressKodMetin(t.dressKodMetin);
      if (t.rsvpSorularAcik   != null) setRsvpSorularAcik(t.rsvpSorularAcik);
      if (t.rsvpSorularConfig)         setRsvpSorularConfig(t.rsvpSorularConfig);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function tutorialKapat() {
    localStorage.setItem("olustur-tutorial-goruldu", "1");
    setTutorialAcik(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobilOnizlemeAcik ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobilOnizlemeAcik]);

  useEffect(() => {
    if (!aktivasyonKodu) return;
    fetch(`/api/partner/aktivasyon/${aktivasyonKodu}/kapsam`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.dahilKodlar) setDahilKodlar(data.dahilKodlar); })
      .catch(() => {});
  }, [aktivasyonKodu]);

  const [notAcik,         setNotAcik]         = useState(false);
  const [muzikAcik,       setMuzikAcik]       = useState(false);
  const [albumAcik,       setAlbumAcik]       = useState(false);
  const [aniDefteriAcik,  setAniDefteriAcik]  = useState(false);
  const [sesliAniAcik,    setSesliAniAcik]    = useState(false);
  const [canliDuvarAcik,  setCanliDuvarAcik]  = useState(false);
  const [oturmaPlanAcik,  setOturmaPlanAcik]  = useState(false);
  const [aniKitabiAcik,   setAniKitabiAcik]   = useState(false);
  const [checkInAcik,     setCheckInAcik]     = useState(false);
  const [dahilKodlar,    setDahilKodlar]    = useState<string[]>([]);
  const [dressKodAcik,   setDressKodAcik]   = useState(false);
  const [dressKodMetin,  setDressKodMetin]  = useState("");
  const [dressRenkler,   setDressRenkler]   = useState<DressRenkler>(["#6B1A2B","#1A6B45","#C4A05A","#1A1A1A","#F5EDD8"]);
  const [rsvpSorularAcik,   setRsvpSorularAcik]   = useState(false);
  const [rsvpSorularConfig, setRsvpSorularConfig] = useState<RsvpSoru[]>(VARSAYILAN_RSVP_SORULAR);

  useEffect(() => {
    if (!aktivasyonKodu || dahilKodlar.length === 0) return;
    const dahil = (kod: string) => dahilKodlar.includes(kod);

    if (!dahil("muzik")) {
      setMuzikAcik(false);
      setForm(prev => prev.muzik ? { ...prev, muzik: "" } : prev);
    }
    if (!dahil("album-foto")) setAlbumAcik(false);
    if (!dahil("ani-defteri")) setAniDefteriAcik(false);
    if (!dahil("canli-duvar")) setCanliDuvarAcik(false);
    if (!dahil("sesli-ani")) setSesliAniAcik(false);
    if (!dahil("ani-kitabi-pdf")) setAniKitabiAcik(false);
    if (!dahil("qr-check-in")) setCheckInAcik(false);
    if (!dahil("oturma-plani")) setOturmaPlanAcik(false);
  }, [aktivasyonKodu, dahilKodlar]);

  function rsvpSoruToggle(id: RsvpSoruId) {
    setRsvpSorularConfig(prev => prev.map(s => s.id === id ? { ...s, aktif: !s.aktif } : s));
  }
  function rsvpOzelSoruGuncelle(soru: string) {
    setRsvpSorularConfig(prev => prev.map(s => s.id === "ozel" ? { ...s, soru } : s));
  }
  function rsvpMaxKisiGuncelle(val: number) {
    setRsvpSorularConfig(prev => prev.map(s => s.id === "kisiSayisi" ? { ...s, maxKisi: val } : s));
  }

  const hasPolaroid        = isNisanLuks || isVintageNisan;
  const hasSesliOzellikler = isNisanLuks || isVintageNisan;
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
    albumAktif: albumAcik,
    aniDefteriAktif: aniDefteriAcik,
    sesliAniAktif: sesliAniAcik,
    canliDuvarAktif: canliDuvarAcik,
    oturmaPlanAktif: oturmaPlanAcik,
    aniKitabiAktif:  aniKitabiAcik,
    checkInAktif:    checkInAcik,
  });

  const isDahil = (kod: string) => aktivasyonKodu ? dahilKodlar.includes(kod) : false;
  const dahilTutar = aktivasyonKodu && dahilKodlar.length > 0
    ? fiyat.kalemler.filter(k => dahilKodlar.includes(k.kod)).reduce((s, k) => s + k.tutar, 0)
    : 0;
  const odenecekTutar = fiyat.toplamTutar - dahilTutar;
  const aktivasyonKapsamiHazir = !aktivasyonKodu || dahilKodlar.length > 0;
  const paketDisiKalemler = aktivasyonKodu && aktivasyonKapsamiHazir
    ? fiyat.kalemler.filter(k => !dahilKodlar.includes(k.kod))
    : [];
  const aktivasyonPaketDisiVar = paketDisiKalemler.length > 0;
  const paketDisiOzellikKilitli = (kod: string) =>
    !!aktivasyonKodu && aktivasyonKapsamiHazir && !dahilKodlar.includes(kod);
  const paketEtiketi = (kod: string) =>
    isDahil(kod) ? "Dahil" : aktivasyonKodu ? "Pakette yok" : "Ek ücret";
  const olusturmaEngelli =
    yukleniyor || (!!aktivasyonKodu && (!aktivasyonKapsamiHazir || aktivasyonPaketDisiVar));

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
    if (["baslik", "tarih", "mekan"].includes(alan)) {
      setAlanHatalari(prev => ({ ...prev, [alan]: undefined }));
      setHata("");
    }
  };

  const ilkHataliAlanaGit = (hatalar: Partial<Record<ZorunluAlan, string>>) => {
    const siraliAlanlar: ZorunluAlan[] = nisanVeyaDugun
      ? ["kisi1", "kisi1Soyad", "kisi2", "kisi2Soyad", "tarih", "mekan"]
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
      try {
        sessionStorage.setItem(TASLAK_KEY, JSON.stringify({
          form, kisi1Ad, kisi1Soyad, kisi2Ad, kisi2Soyad,
          notAcik, muzikAcik, albumAcik, aniDefteriAcik,
          sesliAniAcik, canliDuvarAcik, oturmaPlanAcik, aniKitabiAcik,
          dressKodAcik, dressKodMetin,
          rsvpSorularAcik, rsvpSorularConfig,
        }));
      } catch {}
      setGirisModalAcik(true);
      return;
    }

    const yeniHatalar: Partial<Record<ZorunluAlan, string>> = {};

    if (nisanVeyaDugun) {
      if (!kisi1Ad.trim())    yeniHatalar.kisi1      = "1. kişinin adını girin.";
      if (!kisi1Soyad.trim()) yeniHatalar.kisi1Soyad = "1. kişinin soyadını girin.";
      if (!kisi2Ad.trim())    yeniHatalar.kisi2      = "2. kişinin adını girin.";
      if (!kisi2Soyad.trim()) yeniHatalar.kisi2Soyad = "2. kişinin soyadını girin.";
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

    if (aktivasyonKodu && !aktivasyonKapsamiHazir) {
      setHata("Aktivasyon paketi yükleniyor. Lütfen birkaç saniye sonra tekrar deneyin.");
      return;
    }

    if (aktivasyonPaketDisiVar) {
      setHata("Bu aktivasyon paketinde olmayan özellikleri kapatıp devam edin.");
      return;
    }

    setYukleniyor(true); setHata("");
    const kisi1 = `${kisi1Ad.trim()} ${kisi1Soyad.trim()}`.trim();
    const kisi2 = `${kisi2Ad.trim()} ${kisi2Soyad.trim()}`.trim();
    // Başlıkta soyadlar yer almaz — yalnızca ad(lar) kullanılır
    const gonderilecekBaslik = nisanVeyaDugun ? `${kisi1Ad.trim()} & ${kisi2Ad.trim()}` : form.baslik;
    try {
      const res = await fetch("/api/davetiye/olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          baslik:            gonderilecekBaslik,
          sablon:            sablonId,
          kisi1:             nisanVeyaDugun ? kisi1 : null,
          kisi2:             nisanVeyaDugun ? kisi2 : null,
          mesaj:             notAcik ? form.mesaj : null,
          muzik:             muzikAcik ? form.muzik : null,
          polaroid1:         polaroidler[0],
          polaroid2:         polaroidler[1],
          polaroid3:         polaroidler[2],
          albumAktif:        albumAcik,
          aniDefteriAktif:   aniDefteriAcik,
          sesliAniAktif:     sesliAniAcik,
          canliDuvarAktif:   canliDuvarAcik,
          oturmaPlanAktif:   oturmaPlanAcik,
          aniKitabiAktif:    aniKitabiAcik,
          checkInAktif:      checkInAcik,
          dressKod:          dressKodAcik && dressKodMetin.trim() ? dressKodMetin.trim() : null,
          dressKodRenkler:   dressKodAcik && dressKodMetin.trim() ? JSON.stringify(dressRenkler) : null,
          rsvpSorular:       rsvpSorularAcik ? rsvpSorularConfig : null,
          aktivasyonKodu:    aktivasyonKodu || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHata(data.hata || "Bir hata oluştu.");
        return;
      }
      clearSablonSecimi();
      if (data.activated) {
        router.push(`/dashboard/davetiye/${data.slug}?yeni=1`);
      } else {
        router.push(`/odeme/${data.slug}`);
      }
    } catch { setHata("Bir hata oluştu, tekrar deneyin."); }
    finally { setYukleniyor(false); }
  };

  const kisi1Preview = `${kisi1Ad || "Kişi 1"} ${kisi1Soyad || ""}`.trim();
  const kisi2Preview = `${kisi2Ad || "Kişi 2"} ${kisi2Soyad || ""}`.trim();

  const previewVeri: DavetiyeVeri = {
    id: "preview", slug: "preview",
    baslik: nisanVeyaDugun
      ? `${kisi1Ad || "Kişi 1"} & ${kisi2Ad || "Kişi 2"}`
      : form.baslik || "Davetiye Başlığı",
    etkinlikTur:     sablon.kategori,
    tarih:           form.tarih ? new Date(`${form.tarih}T${form.saat || "12:00"}`) : null,
    mekan:           form.mekan || null,
    mesaj:           notAcik ? (form.mesaj || null) : null,
    sablon:          sablonId,
    ozelRenk:        form.renk || null,
    font:            form.font || null,
    muzik:           muzikAcik ? (form.muzik || null) : null,
    goruntulenme:    0,
    user:            { name: null, email: null },
    kisi1:           nisanVeyaDugun ? kisi1Preview : null,
    kisi2:           nisanVeyaDugun ? kisi2Preview : null,
    albumAktif:      polaroidAcik,
    polaroid1:       polaroidAcik ? polaroidler[0] : null,
    polaroid2:       polaroidAcik ? polaroidler[1] : null,
    polaroid3:       polaroidAcik ? polaroidler[2] : null,
    aniDefteriAktif: aniDefteriAcik,
    sesliAniAktif:   sesliAniAcik,
    canliDuvarAktif: canliDuvarAcik,
    dressKod:        dressKodAcik && dressKodMetin.trim() ? dressKodMetin.trim() : null,
    dressKodRenkler: dressKodAcik && dressKodMetin.trim() ? JSON.stringify(dressRenkler) : null,
  };

  const onizlemeIcerigi = (
    <>
      {sablonTipi === "vintage-nisan"  && <VintageNisanSablon  davetiye={previewVeri} rsvpBileseni={null} previewModu />}
      {sablonTipi === "nisan-luks"     && <NisanLuksSablon     davetiye={previewVeri} rsvpBileseni={null} previewModu />}
      {sablonTipi === "dugun-luks"     && <DugunLuksSablon     davetiye={previewVeri} rsvpBileseni={null} previewModu />}
      {sablonTipi === "dogumgunu-luks" && <DogumGunuLuksSablon davetiye={previewVeri} rsvpBileseni={null} previewModu />}
      {sablonTipi === "klasik"         && <KlasikSablon        davetiye={previewVeri} rsvpBileseni={null} />}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {tutorialAcik && <TutorialModal onKapat={tutorialKapat} />}
      {girisModalAcik && (
        <GirisGerekliModal
          sablonId={sablonId}
          onKapat={() => setGirisModalAcik(false)}
        />
      )}
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

          {/* Adım göstergesi */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {[
              { no: 1, label: "Şablon", done: true },
              { no: 2, label: "Bilgiler", done: false, aktif: true },
              { no: 3, label: aktivasyonKodu ? "Yayınla" : "Ödeme", done: false },
            ].map((adim, i) => (
              <div key={adim.no} className="flex items-center gap-1.5">
                {i > 0 && <div className="w-5 h-px bg-gray-200" />}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  adim.done ? "bg-green-50 text-green-600" :
                  adim.aktif ? "bg-purple-100 text-purple-700" :
                  "text-gray-400"
                }`}>
                  {adim.done ? "✓" : <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold border-current">{adim.no}</span>}
                  <span>{adim.label}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={olusturmaEngelli}
            className="shrink-0 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-purple-200 flex items-center gap-2">
            {yukleniyor ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Oluşturuluyor</>
            ) : aktivasyonKodu ? (
              <>Davetiyeni Oluştur →</>
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

            {aktivasyonKodu && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                <span className="text-xl shrink-0">🎁</span>
                <div>
                  <p className="text-sm font-semibold text-green-700">Partner aktivasyon koduyla oluşturuyorsunuz</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    {dahilKodlar.length > 0
                      ? `Pakete dahil özelliklerle davetiyeniz ücretsiz yayınlanır. Paket dışı özellikler bu aktivasyonla seçilemez.`
                      : "Dahil özellikler yükleniyor…"}
                  </p>
                </div>
              </div>
            )}

            {aktivasyonPaketDisiVar && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                <span className="text-xl shrink-0">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Paket dışı seçim var</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Bu aktivasyon paketinde {paketDisiKalemler.map(k => k.ad).join(", ")} bulunmuyor.
                    Devam etmek için bu seçimleri kapatın veya pakete dahil bir şablon/özellik seçin.
                  </p>
                </div>
              </div>
            )}

            <>
                {/* ── 1. Temel Bilgiler ── */}
                <div>
                  <SectionHeader step={1} baslik="Temel Bilgiler" aciklama="Davetiyenizde görünecek zorunlu bilgiler" />
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">

                    {nisanVeyaDugun ? (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          İsimler <span className="text-red-400 font-normal text-xs">zorunlu</span>
                        </label>
                        {/* 1. Kişi */}
                        <div>
                          <p className="text-xs text-gray-400 mb-1.5">1. Kişi</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <input type="text" placeholder="Ad (örn. Ayşe)"
                                ref={alanRefi("kisi1")}
                                value={kisi1Ad}
                                onChange={e => { setKisi1Ad(e.target.value); setAlanHatalari(p => ({ ...p, kisi1: undefined })); setHata(""); }}
                                aria-invalid={!!alanHatalari.kisi1}
                                className={zorunluAlanClass("kisi1")} />
                              {alanHatasi("kisi1")}
                            </div>
                            <div>
                              <input type="text" placeholder="Soyad (örn. Yılmaz)"
                                ref={alanRefi("kisi1Soyad")}
                                value={kisi1Soyad}
                                onChange={e => { setKisi1Soyad(e.target.value); setAlanHatalari(p => ({ ...p, kisi1Soyad: undefined })); setHata(""); }}
                                aria-invalid={!!alanHatalari.kisi1Soyad}
                                className={zorunluAlanClass("kisi1Soyad")} />
                              {alanHatasi("kisi1Soyad")}
                            </div>
                          </div>
                        </div>
                        {/* 2. Kişi */}
                        <div>
                          <p className="text-xs text-gray-400 mb-1.5">2. Kişi</p>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <input type="text" placeholder="Ad (örn. Mehmet)"
                                ref={alanRefi("kisi2")}
                                value={kisi2Ad}
                                onChange={e => { setKisi2Ad(e.target.value); setAlanHatalari(p => ({ ...p, kisi2: undefined })); setHata(""); }}
                                aria-invalid={!!alanHatalari.kisi2}
                                className={zorunluAlanClass("kisi2")} />
                              {alanHatasi("kisi2")}
                            </div>
                            <div>
                              <input type="text" placeholder="Soyad (örn. Demir)"
                                ref={alanRefi("kisi2Soyad")}
                                value={kisi2Soyad}
                                onChange={e => { setKisi2Soyad(e.target.value); setAlanHatalari(p => ({ ...p, kisi2Soyad: undefined })); setHata(""); }}
                                aria-invalid={!!alanHatalari.kisi2Soyad}
                                className={zorunluAlanClass("kisi2Soyad")} />
                              {alanHatasi("kisi2Soyad")}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">Davetiyede "Ayşe Yılmaz &amp; Mehmet Demir" şeklinde görünür.</p>
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

                    {/* 📋 RSVP Soruları */}
                    <OzellikKarti
                      icon="📋" baslik="Katılım Formu Soruları"
                      aciklama="Misafirlerden ekstra bilgi toplayın: yemek tercihi, servis, çocuk sayısı ve daha fazlası"
                      misafirGorur="Seçtiğiniz sorular RSVP formunda görünür"
                      acik={rsvpSorularAcik} onToggle={() => setRsvpSorularAcik(!rsvpSorularAcik)}
                    >
                      <div className="space-y-2">
                        {VARSAYILAN_RSVP_SORULAR.map(({ id }) => {
                          const meta  = SORU_META[id];
                          const soru  = rsvpSorularConfig.find(s => s.id === id)!;
                          return (
                            <div key={id}>
                              <div className="flex items-center justify-between gap-3 py-2.5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-base shrink-0">{meta.icon}</span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-700 leading-tight">{meta.label}</p>
                                    <p className="text-xs text-gray-400 leading-snug">{meta.aciklama}</p>
                                  </div>
                                </div>
                                <Toggle acik={soru.aktif} onChange={() => rsvpSoruToggle(id)} />
                              </div>
                              {id === "kisiSayisi" && soru.aktif && (
                                <div className="flex items-center gap-3 mb-2 mt-1">
                                  <span className="text-xs text-gray-500">Maks kişi:</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => rsvpMaxKisiGuncelle(Math.max(2, (soruGetir(rsvpSorularConfig, "kisiSayisi").maxKisi ?? 2) - 1))}
                                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-base flex items-center justify-center transition-colors"
                                    >−</button>
                                    <span className="text-sm font-bold text-gray-800 w-6 text-center tabular-nums">
                                      {soruGetir(rsvpSorularConfig, "kisiSayisi").maxKisi ?? 2}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => rsvpMaxKisiGuncelle(Math.min(20, (soruGetir(rsvpSorularConfig, "kisiSayisi").maxKisi ?? 2) + 1))}
                                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-base flex items-center justify-center transition-colors"
                                    >+</button>
                                  </div>
                                  <span className="text-xs text-gray-400">(2–20)</span>
                                </div>
                              )}
                              {id === "ozel" && soru.aktif && (
                                <input
                                  type="text"
                                  placeholder="Soru metninizi yazın (örn. Masa tercihiniz?)"
                                  value={soru.soru ?? ""}
                                  maxLength={200}
                                  onChange={e => rsvpOzelSoruGuncelle(e.target.value)}
                                  className="w-full border-2 border-purple-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white mb-2"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </OzellikKarti>

                    {/* 🎵 Arka Plan Müziği */}
                    <OzellikKarti
                      icon="🎵" baslik="Arka Plan Müziği"
                      aciklama="Seçtiğiniz şarkı için davetiyede bir çalma butonu gösterilir"
                      misafirGorur="Misafir davetiyeye dokunduğunda müzik başlar; istediği zaman durdurabilir"
                      planEtiketi={paketEtiketi("muzik")}
                      locked={paketDisiOzellikKilitli("muzik")}
                      lockedMsg="Pakette yok"
                      acik={muzikAcik} onToggle={() => setMuzikAcik(!muzikAcik)}
                    >
                      <MuzikSecici secili={form.muzik || null} onChange={url => setForm({ ...form, muzik: url ?? "" })} />
                    </OzellikKarti>

                    {/* 📸 Fotoğraf Albümü */}
                    <OzellikKarti
                      icon="📸" baslik="Fotoğraf Albümü"
                      aciklama="Misafirler etkinlik boyunca fotoğraf yükler, sen onaylarsın"
                      misafirGorur="Davetiyede 📸 Fotoğraflar sekmesi belirir"
                      planEtiketi={paketEtiketi("album-foto")}
                      locked={paketDisiOzellikKilitli("album-foto")}
                      lockedMsg="Pakette yok"
                      acik={albumAcik} onToggle={() => setAlbumAcik(!albumAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Albüm aktif. Misafirler fotoğraf yükleyebilir. Yüklenenler Dashboard → Albüm&apos;den onaylanabilir.</p>
                      </div>
                    </OzellikKarti>

                    {/* 💌 Anı Defteri */}
                    <OzellikKarti
                      icon="💌" baslik="Anı Defteri"
                      aciklama="Misafirler etkinlik için yazılı iyi dilek ve anı bırakır"
                      misafirGorur="Davetiyede 💌 Anı Defteri sekmesi belirir"
                      planEtiketi={paketEtiketi("ani-defteri")}
                      locked={paketDisiOzellikKilitli("ani-defteri")}
                      lockedMsg="Pakette yok"
                      acik={aniDefteriAcik} onToggle={() => setAniDefteriAcik(!aniDefteriAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Anı Defteri aktif. Dashboard → Anı Defteri&apos;nden yazıları onaylayabilirsiniz.</p>
                      </div>
                    </OzellikKarti>

                    {/* 📺 Canlı Fotoğraf Duvarı */}
                    <OzellikKarti
                      icon="📺" baslik="Canlı Fotoğraf Duvarı"
                      aciklama="Misafir fotoğrafları salonunuzdaki ekranda canlı akış olarak görünür"
                      misafirGorur="Fotoğraf yükleyen misafirler canlı duvarda görebilir"
                      planEtiketi={paketEtiketi("canli-duvar")}
                      locked={paketDisiOzellikKilitli("canli-duvar")}
                      lockedMsg="Pakette yok"
                      acik={canliDuvarAcik} onToggle={() => setCanliDuvarAcik(!canliDuvarAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Canlı Duvar aktif. Misafirlerin yüklediği fotoğraflar ekranınızda otomatik akar.</p>
                      </div>
                    </OzellikKarti>

                    {/* 🎙️ Sesli Anı */}
                    {hasSesliOzellikler && (
                      <OzellikKarti
                        icon="🎙️" baslik="Sesli Anı"
                        aciklama="Misafirler tarayıcıdan 30 saniyeye kadar sesli mesaj kaydedebilir"
                        misafirGorur="Davetiyede bir mikrofon butonu belirir; kayıtlar onayınızla yayınlanır"
                        planEtiketi={paketEtiketi("sesli-ani")}
                        locked={paketDisiOzellikKilitli("sesli-ani")}
                        lockedMsg="Pakette yok"
                        acik={sesliAniAcik} onToggle={() => setSesliAniAcik(!sesliAniAcik)}
                      >
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                          <span className="text-base shrink-0">✅</span>
                          <p className="text-xs text-gray-600 leading-relaxed">Sesli Anı aktif. Dashboard → Sesli Anılar'dan kayıtları dinleyip onaylayabilirsiniz.</p>
                        </div>
                      </OzellikKarti>
                    )}

                    {/* 📖 Anı Kitabı PDF */}
                    <OzellikKarti
                      icon="📖" baslik="Anı Kitabı PDF"
                      aciklama="Onaylı fotoğraf, yazılı anı ve sesli mesajları tek bir premium PDF'e derle"
                      misafirGorur="Bu özellik sadece davetiye sahibi için geçerlidir"
                      planEtiketi={paketEtiketi("ani-kitabi-pdf")}
                      locked={paketDisiOzellikKilitli("ani-kitabi-pdf")}
                      lockedMsg="Pakette yok"
                      acik={aniKitabiAcik} onToggle={() => setAniKitabiAcik(!aniKitabiAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Anı Kitabı aktif. Etkinlik sonrası Dashboard → Albüm sayfasından tek tıkla PDF indirebilirsiniz.</p>
                      </div>
                    </OzellikKarti>

                    {/* 📲 QR Check-in */}
                    <OzellikKarti
                      icon="📲" baslik="QR Check-in"
                      aciklama="Etkinlik girişinde her davetlinin kişiye özel QR kodunu okutarak katılımı saniyeler içinde kaydet"
                      misafirGorur="Bu özellik sadece davetiye sahibinin panelinde görünür"
                      planEtiketi={paketEtiketi("qr-check-in")}
                      locked={paketDisiOzellikKilitli("qr-check-in")}
                      lockedMsg="Pakette yok"
                      acik={checkInAcik} onToggle={() => setCheckInAcik(!checkInAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">QR Check-in aktif. Etkinlik günü Dashboard → QR Check-in sayfasından kamerayı aç ve davetlileri tara.</p>
                      </div>
                    </OzellikKarti>

                    {/* 🪑 Oturma Planı */}
                    <OzellikKarti
                      icon="🪑" baslik="Oturma Planı"
                      aciklama="Katılacak misafirleri masalara atayabileceğiniz yönetim ekranı açılır"
                      misafirGorur="Bu özellik sadece davetiye sahibinin panelinde görünür"
                      planEtiketi={paketEtiketi("oturma-plani")}
                      locked={paketDisiOzellikKilitli("oturma-plani")}
                      lockedMsg="Pakette yok"
                      acik={oturmaPlanAcik} onToggle={() => setOturmaPlanAcik(!oturmaPlanAcik)}
                    >
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                        <span className="text-base shrink-0">✅</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Oturma Planı aktif. Ödeme sonrası Dashboard → Oturma Planı bölümünden masa düzeninizi hazırlayabilirsiniz.</p>
                      </div>
                    </OzellikKarti>
                  </div>
                </div>

                <FiyatOzeti fiyat={fiyat} fiyatHref={fiyatHref} dahilKodlar={dahilKodlar} />

                {/* Hata + Oluştur */}
                {hata && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>⚠️</span> {hata}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={olusturmaEngelli}
                  className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 active:scale-[0.99] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-200">
                  {yukleniyor ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Oluşturuluyor...</>
                  ) : aktivasyonKodu ? (
                    "Davetiyeni Oluştur →"
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
                <FiyatOzeti fiyat={fiyat} fiyatHref={fiyatHref} kompakt dahilKodlar={dahilKodlar} />
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

function GirisGerekliModal({ sablonId, onKapat }: { sablonId: string; onKapat: () => void }) {
  const callbackUrl = `/olustur?sablon=${encodeURIComponent(sablonId)}`;
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center px-4"
      style={{ background: "rgba(5,0,14,0.78)", backdropFilter: "blur(7px)" }}
      onClick={onKapat}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl"
        style={{
          background: "linear-gradient(160deg,#120924 0%,#0a0518 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 0 1px rgba(139,92,246,0.12), 0 30px 80px rgba(0,0,0,0.7)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Üst aksan */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#8b5cf6 40%,#ec4899 80%,transparent)" }} />

        <div className="px-7 pt-8 pb-7 text-center">
          {/* İkon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg,rgba(139,92,246,0.18),rgba(236,72,153,0.14))",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            💾
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Taslağın kaydedildi!</h2>
          <p className="text-white/40 text-sm leading-relaxed mb-7">
            Devam etmek için giriş yap. Davetiyene kaldığın yerden devam edeceksin.
          </p>

          {/* Google ile Giriş */}
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl text-sm font-semibold mb-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "white", color: "#1f1f1f", boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google ile Giriş Yap
          </button>

          {/* Ayraç */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-[11px] text-white/20 font-medium">veya</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* E-posta ile giriş / kayıt */}
          <a
            href={`/giris?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold mb-5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            E-posta ile Giriş / Kayıt Ol
          </a>

          <button onClick={onKapat} className="text-xs text-white/20 hover:text-white/40 transition-colors">
            Geri dön, düzenlemeye devam et
          </button>
        </div>

        {/* Kapatma */}
        <button
          onClick={onKapat}
          aria-label="Kapat"
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white/25 hover:text-white/50 transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
      <div className="absolute inset-x-0 bottom-0 max-h-[94dvh] rounded-t-4xl bg-gray-950 shadow-2xl">
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

function FiyatOzeti({
  fiyat,
  fiyatHref,
  kompakt = false,
  dahilKodlar = [],
}: {
  fiyat: DavetiyeFiyatSonucu;
  fiyatHref: string;
  kompakt?: boolean;
  dahilKodlar?: string[];
}) {
  const dahilTutar = dahilKodlar.length > 0
    ? fiyat.kalemler.filter(k => dahilKodlar.includes(k.kod)).reduce((s, k) => s + k.tutar, 0)
    : 0;
  const odenecekTutar = fiyat.toplamTutar - dahilTutar;
  const partnerAktivasyonu = dahilKodlar.length > 0;

  return (
    <div className={`rounded-2xl border border-purple-100 bg-white shadow-sm shadow-purple-50 ${kompakt ? "p-4" : "p-5"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">Fiyat Özeti</p>
          {dahilTutar > 0 ? (
            <p className="mt-1 text-sm text-green-600 font-medium">
              🎁 {tutarMetni(dahilTutar)} partner tarafından karşılanır
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Seçtiğiniz davetiye ve özelliklere göre hesaplanır.
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            {partnerAktivasyonu ? (odenecekTutar > 0 ? "Pakette Yok" : "Ödenecek") : "Toplam"}
          </p>
          {dahilTutar > 0 && (
            <p className="text-xs line-through text-gray-400">{tutarMetni(fiyat.toplamTutar)}</p>
          )}
          <p className="text-2xl font-black text-gray-950">{tutarMetni(odenecekTutar)}</p>
        </div>
      </div>

      <div className={`mt-4 ${kompakt ? "space-y-2" : "space-y-2.5"}`}>
        {fiyat.kalemler.map(kalem => {
          const dahil = dahilKodlar.includes(kalem.kod);
          return (
            <div key={kalem.kod} className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${dahil ? "bg-green-50" : "bg-gray-50"}`}>
              <span className="text-xs font-medium text-gray-600">
                {kalem.ad}
                {dahil && <span className="ml-1.5 text-[10px] font-bold text-green-600">✓ Dahil</span>}
              </span>
              <span className={`text-xs font-bold ${dahil ? "text-green-600" : "text-gray-900"}`}>
                {dahil ? "Ücretsiz" : partnerAktivasyonu ? "Pakette yok" : tutarMetni(kalem.tutar)}
              </span>
            </div>
          );
        })}
      </div>

      {!kompakt && (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-xs leading-relaxed text-gray-400">
            {partnerAktivasyonu && odenecekTutar > 0
              ? "Bu aktivasyon paketinde olmayan seçimleri kapattığınızda davetiye ücretsiz yayına alınır."
              : odenecekTutar === 0
                ? "Aktivasyon kapsamında tüm seçimler ücretsiz; davetiye anında yayına alınır."
                : "Ödeme tamamlanana kadar davetiye taslak olarak saklanır; ödeme sonrası yayına alınır."}
          </p>
          <Link href={fiyatHref} className="text-xs font-bold text-purple-600 hover:text-purple-700">
            Fiyatları detaylı gör →
          </Link>
        </div>
      )}

      {/* Güvenli ödeme logoları */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col items-center gap-1.5">
        <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-gray-300">Güvenli ödeme altyapısı</p>
        <div className="relative h-5 w-52" style={{ filter: "invert(1)", opacity: 0.28 }}>
          <Image
            src="/logo_band_white@3x.png"
            alt="iyzico, Mastercard, Visa, AmEx, Troy"
            fill
            sizes="208px"
            className="object-contain"
          />
        </div>
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
    <Suspense fallback={<PageLoader />}>
      <OlusturIcerigi/>
    </Suspense>
  );
}

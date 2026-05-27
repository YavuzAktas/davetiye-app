"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

/* ─── Tipler ─── */
type Sekme = "foto" | "ani" | "sesli";
type KayitDurum = "bekliyor" | "kayit" | "gozden" | "gonderiliyor" | "tamam" | "hata";
type FotoDurum = "bekliyor" | "sikistiriliyor" | "yukleniyor" | "tamam" | "hata";

interface AlbumFoto  { id: string; yukleyenAd: string; dosyaUrl: string; createdAt: string; }
interface AniYazisi  { id: string; yazarAd: string;   icerik: string;   createdAt: string; }
interface SesliAni   { id: string; adSoyad: string;   dosyaUrl: string; sure: number; createdAt: string; }

interface Props {
  slug: string;
  renk?: string;
  albumAktif:      boolean;
  canliDuvarAktif: boolean;
  sesliAniAktif:   boolean;
}

export default function EtkilesimButonu({
  slug,
  renk = "#7C3AED",
  albumAktif,
  canliDuvarAktif,
  sesliAniAktif,
}: Props) {
  /* Hangi sekmeler aktif? */
  const sekmeler: Sekme[] = [];
  if (albumAktif || canliDuvarAktif) sekmeler.push("foto");
  if (albumAktif)                    sekmeler.push("ani");
  if (sesliAniAktif)                 sekmeler.push("sesli");

  const [acik, setAcik]           = useState(false);
  const [sekme, setSekme]         = useState<Sekme>(sekmeler[0] ?? "foto");
  const [lightbox, setLightbox]   = useState<AlbumFoto | null>(null);

  /* ─ Fotoğraf state ─ */
  const [fotolar,           setFotolar]           = useState<AlbumFoto[]>([]);
  const [fotoListeYuk,      setFotoListeYuk]      = useState(false);
  const [fotoListeYuklendi, setFotoListeYuklendi] = useState(false);
  const [fotoAd,            setFotoAd]            = useState("");
  const [seciliDosyalar,    setSeciliDosyalar]    = useState<File[]>([]);
  const [onizlemeler,       setOnizlemeler]       = useState<string[]>([]);
  const [fotoDurumlar,      setFotoDurumlar]      = useState<FotoDurum[]>([]);
  const [fotoYukleniyor,    setFotoYukleniyor]    = useState(false);
  const [yuklenenSayisi,    setYuklenenSayisi]    = useState(0);
  const [fotoBasari,        setFotoBasari]        = useState(false);
  const [fotoHata,          setFotoHata]          = useState("");
  const dosyaInputRef = useRef<HTMLInputElement>(null);

  /* ─ Anı state ─ */
  const [anilar,          setAnilar]          = useState<AniYazisi[]>([]);
  const [aniListeYuk,     setAniListeYuk]     = useState(false);
  const [aniListeYuklendi, setAniListeYuklendi] = useState(false);
  const [aniAd,           setAniAd]           = useState("");
  const [aniIcerik,       setAniIcerik]       = useState("");
  const [aniYukleniyor,   setAniYukleniyor]   = useState(false);
  const [aniBasari,       setAniBasari]       = useState(false);
  const [aniHata,         setAniHata]         = useState("");

  /* ─ Sesli anı state ─ */
  const [sesliAnilar,     setSesliAnilar]     = useState<SesliAni[]>([]);
  const [sesliListeYuk,   setSesliListeYuk]   = useState(false);
  const [sesliListeYuklendi, setSesliListeYuklendi] = useState(false);
  const [kayitDurum,      setKayitDurum]      = useState<KayitDurum>("bekliyor");
  const [sesliAd,         setSesliAd]         = useState("");
  const [kalan,           setKalan]           = useState(30);
  const [sure,            setSure]            = useState(0);
  const [sesBlob,         setSesBlob]         = useState<Blob | null>(null);
  const [sesBlobUrl,      setSesBlobUrl]      = useState<string | null>(null);
  const [sesHata,         setSesHata]         = useState("");
  const [izinReddedildi,  setIzinReddedildi]  = useState(false);
  const recorderRef   = useRef<MediaRecorder | null>(null);
  const chunksRef     = useRef<Blob[]>([]);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef   = useRef<string>("");

  if (sekmeler.length === 0) return null;

  /* ─ Veri çek ─ */
  useEffect(() => {
    if (!acik) return;
    if (sekme === "foto")  fetchFotolar();
    if (sekme === "ani")   fetchAnilar();
    if (sekme === "sesli") fetchSesliAnilar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acik, sekme]);

  async function fetchFotolar(force = false) {
    if (fotoListeYuk || (fotoListeYuklendi && !force)) return;
    setFotoListeYuk(true);
    try {
      const r = await fetch(`/api/davetiye/${slug}/album`);
      if (r.ok) {
        setFotolar(await r.json());
        setFotoListeYuklendi(true);
      }
    }
    finally { setFotoListeYuk(false); }
  }
  async function fetchAnilar(force = false) {
    if (aniListeYuk || (aniListeYuklendi && !force)) return;
    setAniListeYuk(true);
    try {
      const r = await fetch(`/api/davetiye/${slug}/ani`);
      if (r.ok) {
        setAnilar(await r.json());
        setAniListeYuklendi(true);
      }
    }
    finally { setAniListeYuk(false); }
  }
  async function fetchSesliAnilar(force = false) {
    if (sesliListeYuk || (sesliListeYuklendi && !force)) return;
    setSesliListeYuk(true);
    try {
      const r = await fetch(`/api/davetiye/${slug}/sesli-ani`);
      if (r.ok) {
        setSesliAnilar(await r.json());
        setSesliListeYuklendi(true);
      }
    }
    finally { setSesliListeYuk(false); }
  }

  /* ─ Fotoğraf yükle ─ */
  function dosyaSec(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    onizlemeler.forEach(u => URL.revokeObjectURL(u));
    setOnizlemeler(files.map(f => URL.createObjectURL(f)));
    setSeciliDosyalar(files);
    setFotoDurumlar(files.map(() => "bekliyor"));
    setFotoHata("");
  }

  function dosyaCikar(index: number) {
    URL.revokeObjectURL(onizlemeler[index]);
    setSeciliDosyalar(prev => prev.filter((_, i) => i !== index));
    setOnizlemeler(prev => prev.filter((_, i) => i !== index));
    setFotoDurumlar(prev => prev.filter((_, i) => i !== index));
  }

  async function fotoYukle(e: React.FormEvent) {
    e.preventDefault();
    if (!seciliDosyalar.length || !fotoAd.trim()) return;
    setFotoYukleniyor(true); setFotoHata(""); setYuklenenSayisi(0);
    setFotoDurumlar(seciliDosyalar.map(() => "bekliyor"));

    let hataSayisi = 0;
    let ilkHata = "";

    const gorevler = seciliDosyalar.map((dosya, i) => async () => {
      setFotoDurumlar(prev => { const n = [...prev]; n[i] = "sikistiriliyor"; return n; });
      try {
        const sikis = await imageCompression(dosya, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
        setFotoDurumlar(prev => { const n = [...prev]; n[i] = "yukleniyor"; return n; });
        const form = new FormData();
        form.append("ad", fotoAd.trim());
        form.append("dosya", sikis, dosya.name);
        const res  = await fetch(`/api/davetiye/${slug}/album`, { method: "POST", body: form });
        const json = await res.json();
        if (!res.ok) throw new Error(json.hata ?? "Yükleme başarısız");
        setFotoDurumlar(prev => { const n = [...prev]; n[i] = "tamam"; return n; });
        setYuklenenSayisi(n => n + 1);
      } catch (err: unknown) {
        setFotoDurumlar(prev => { const n = [...prev]; n[i] = "hata"; return n; });
        hataSayisi++;
        if (!ilkHata) ilkHata = (err as Error).message;
      }
    });

    /* Aynı anda max 3 yükleme — tarayıcının donmaması için */
    let idx = 0;
    async function worker() {
      while (idx < gorevler.length) { await gorevler[idx++](); }
    }
    await Promise.all([worker(), worker(), worker()]);

    const basarili = seciliDosyalar.length - hataSayisi;
    if (hataSayisi === 0) {
      setFotoBasari(true);
      setFotoAd(""); setSeciliDosyalar([]); setOnizlemeler([]); setFotoDurumlar([]);
      if (dosyaInputRef.current) dosyaInputRef.current.value = "";
      fetchFotolar(true);
      setTimeout(() => setFotoBasari(false), 4000);
    } else {
      setFotoHata(basarili > 0
        ? `${basarili} fotoğraf yüklendi, ${hataSayisi} başarısız: ${ilkHata}`
        : ilkHata
      );
      if (basarili > 0) fetchFotolar(true);
    }
    setFotoYukleniyor(false);
  }

  /* ─ Anı gönder ─ */
  async function aniGonder(e: React.FormEvent) {
    e.preventDefault();
    if (!aniAd.trim() || !aniIcerik.trim()) return;
    setAniYukleniyor(true); setAniHata("");
    try {
      const res  = await fetch(`/api/davetiye/${slug}/ani`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad: aniAd.trim(), icerik: aniIcerik.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setAniHata(json.hata); return; }
      setAniBasari(true); setAniAd(""); setAniIcerik("");
      fetchAnilar(true);
      setTimeout(() => setAniBasari(false), 4000);
    } catch { setAniHata("Gönderilemedi, tekrar dene."); }
    finally { setAniYukleniyor(false); }
  }

  /* ─ Ses kayıt ─ */
  async function kaydiBaslat() {
    if (!sesliAd.trim() || sesliAd.trim().length < 2) {
      setSesHata("Lütfen adınızı girin (en az 2 karakter)."); return;
    }
    setSesHata("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setSesHata("Tarayıcınız mikrofon erişimini desteklemiyor."); return;
    }
    if (!window.MediaRecorder) {
      setSesHata("Tarayıcınız ses kaydını desteklemiyor. Chrome veya Firefox kullanın."); return;
    }

    /* Permissions API ile önce mevcut durumu kontrol et */
    try {
      const perm = await navigator.permissions.query({ name: "microphone" as PermissionName });
      if (perm.state === "denied") {
        setSesHata("Mikrofon erişimi engellenmiş. Chrome'da: adres çubuğu → kilit ikonu → Site ayarları → Mikrofon → İzin ver → sayfayı yenile.");
        setIzinReddedildi(true);
        return;
      }
    } catch { /* Permissions API desteklenmiyorsa getUserMedia'ya bırak */ }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: unknown) {
      const name = (err as { name?: string }).name ?? "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setSesHata("Mikrofon izni reddedildi. Adres çubuğu → kilit ikonu → Site ayarları → Mikrofon → İzin ver → sayfayı yenile.");
        setIzinReddedildi(true);
      }
      else if (name === "NotFoundError")
        setSesHata("Mikrofon bulunamadı.");
      else if (name === "NotReadableError")
        setSesHata("Mikrofon başka bir uygulama tarafından kullanılıyor.");
      else
        setSesHata(`Mikrofona erişilemedi: ${name || "Bilinmeyen hata"}.`);
      return;
    }
    try {
      /* Tarayıcının desteklediği ilk MIME tipini seç */
      const tercihSirasi = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/mp4",
      ];
      const mimeType = tercihSirasi.find(t => MediaRecorder.isTypeSupported(t)) ?? "";
      mimeTypeRef.current = mimeType;

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      /* 250 ms'lik dilimler → stop öncesi veri garantisi */
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current || "audio/webm" });
        setSesBlob(blob);
        setSesBlobUrl(URL.createObjectURL(blob));
        setKayitDurum("gozden");
      };
      recorder.start(250);
      setKayitDurum("kayit");
      setKalan(30); setSure(0);
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setSure(elapsed);
        setKalan(p => {
          if (p <= 1) { kaydiDurdur(); return 0; }
          return p - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      stream.getTracks().forEach(t => t.stop());
      setSesHata(`Kayıt başlatılamadı: ${(err as { name?: string }).name ?? "Bilinmeyen hata"}.`);
      setKayitDurum("hata");
    }
  }

  function kaydiDurdur() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }

  async function sesliGonder() {
    if (!sesBlob) return;
    setKayitDurum("gonderiliyor");
    const form = new FormData();
    form.append("adSoyad", sesliAd.trim());
    form.append("dosya", sesBlob, "ani.webm");
    form.append("sure", String(sure));
    const res = await fetch(`/api/davetiye/${slug}/sesli-ani`, { method: "POST", body: form });
    if (res.ok) {
      setKayitDurum("tamam");
      fetchSesliAnilar(true);
    } else {
      const d = await res.json().catch(() => ({}));
      setSesHata(d.hata ?? "Bir hata oluştu."); setKayitDurum("hata");
    }
  }

  function sesliYenidenBasla() {
    if (sesBlobUrl) URL.revokeObjectURL(sesBlobUrl);
    setSesBlob(null); setSesBlobUrl(null);
    setSure(0); setKalan(30); setSesHata(""); setIzinReddedildi(false);
    setKayitDurum("bekliyor");
  }

  /* ─ QR deep-link: ?panel=ani|foto|sesli paneli otomatik aç ─ */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("panel") as Sekme | null;
    if (!p || !sekmeler.includes(p)) return;
    setSekme(p);
    const t = setTimeout(() => setAcik(true), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─ Klavye & scroll ─ */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (lightbox) setLightbox(null); else setAcik(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  useEffect(() => {
    document.body.style.overflow = acik ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [acik]);

  /* ─ Sekme etiketi ─ */
  const sekmeEtiket: Record<Sekme, { emoji: string; isim: string }> = {
    foto:  { emoji: "📸", isim: canliDuvarAktif ? "Canlı Duvar" : "Fotoğraflar" },
    ani:   { emoji: "💌", isim: "Anı Defteri" },
    sesli: { emoji: "🎙️", isim: "Sesli Anı" },
  };

  /* ─ Floating button etiketi ─ */
  const butonEtiket = sekmeler.map(s => sekmeEtiket[s].emoji).join(" ");

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setAcik(true)}
        className="fixed bottom-24 right-5 z-40 flex items-center gap-2 text-white rounded-full transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
        style={{
          padding: "9px 12px",
          background: `linear-gradient(135deg, ${renk}f2, ${renk}b8)`,
          boxShadow: `0 4px 18px ${renk}44, 0 1px 3px rgba(0,0,0,0.22)`,
          border: `1px solid rgba(255,255,255,0.15)`,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{butonEtiket}</span>
        <span className="hidden sm:block" style={{ width: 1, height: 13, background: "rgba(255,255,255,0.28)", flexShrink: 0 }} />
        <span className="hidden sm:block" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase" }}>
          {sekmeler.length === 1 ? sekmeEtiket[sekmeler[0]].isim : "Anı & Katılım"}
        </span>
      </button>

      {/* Backdrop */}
      {acik && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setAcik(false)} />
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl">×</button>
          <div className="relative max-w-[95vw] max-h-[85dvh] w-full h-full" onClick={e => e.stopPropagation()}>
            <Image src={lightbox.dosyaUrl} alt={lightbox.yukleyenAd} fill className="object-contain" sizes="95vw" />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white/80 text-sm font-medium">{lightbox.yukleyenAd}</p>
          </div>
        </div>
      )}

      {/* Slide-up panel */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] bg-white rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300"
        style={{ transform: acik ? "translateY(0)" : "translateY(110%)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">
            {sekmeler.length === 1 ? sekmeEtiket[sekmeler[0]].isim : "Anı & Katılım"}
          </h2>
          <button onClick={() => setAcik(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-lg">×</button>
        </div>

        {/* Sekmeler — sadece birden fazlaysa göster */}
        {sekmeler.length > 1 && (
          <div className="flex border-b border-gray-100 shrink-0 px-5">
            {sekmeler.map(s => (
              <button
                key={s}
                onClick={() => setSekme(s)}
                className="flex items-center gap-1.5 py-3 px-4 text-sm font-semibold border-b-2 transition-colors"
                style={{ borderColor: sekme === s ? renk : "transparent", color: sekme === s ? renk : "#9ca3af" }}
              >
                {sekmeEtiket[s].emoji} {sekmeEtiket[s].isim}
              </button>
            ))}
          </div>
        )}

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto">

          {/* ── FOTOĞRAF ── */}
          {sekme === "foto" && (
            <div className="p-5 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-700 mb-3">
                  {canliDuvarAktif ? "Canlı Duvar için fotoğraf paylaş" : "Etkinlikten fotoğraf paylaş"}
                </p>
                {fotoBasari ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <p className="text-2xl mb-1">✅</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      Yüklendi! Onay sonrası görünecek.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={fotoYukle} className="space-y-3">
                    <input type="text" placeholder="Adın" value={fotoAd}
                      onChange={e => setFotoAd(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                      maxLength={40} required />
                    {onizlemeler.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {onizlemeler.map((url, i) => {
                          const durum = fotoDurumlar[i] ?? "bekliyor";
                          return (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <Image src={url} alt={`seçili ${i + 1}`} fill className="object-cover" />
                              {/* X butonu — yükleme başlamadan görünür */}
                              {!fotoYukleniyor && (
                                <button
                                  type="button"
                                  onClick={() => dosyaCikar(i)}
                                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-xs leading-none transition-colors"
                                >
                                  ×
                                </button>
                              )}
                              {/* Yükleme durumu overlay */}
                              {fotoYukleniyor && (
                                <div className="absolute inset-0 flex items-center justify-center" style={{
                                  background: durum === "tamam" ? "rgba(16,185,129,0.45)"
                                    : durum === "hata"   ? "rgba(239,68,68,0.45)"
                                    : "rgba(0,0,0,0.40)",
                                }}>
                                  {durum === "tamam" && <span className="text-white text-lg font-bold">✓</span>}
                                  {durum === "hata"  && <span className="text-white text-lg font-bold">✗</span>}
                                  {(durum === "bekliyor" || durum === "sikistiriliyor" || durum === "yukleniyor") && (
                                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {/* Yeni seç tile'ı — yükleme başlamadan görünür */}
                        {!fotoYukleniyor && (
                          <button
                            type="button"
                            onClick={() => dosyaInputRef.current?.click()}
                            className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 flex flex-col items-center justify-center text-gray-400 gap-1 transition-colors"
                          >
                            <span className="text-xl leading-none">+</span>
                            <span className="text-[10px]">değiştir</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => dosyaInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-colors"
                      >
                        <p className="text-3xl mb-1">🖼️</p>
                        <p className="text-sm text-gray-500">Fotoğraf seç</p>
                        <p className="text-xs text-gray-400 mt-0.5">Birden fazla seçebilirsin · max 4 MB/adet</p>
                      </div>
                    )}
                    <input ref={dosyaInputRef} type="file" accept="image/*" multiple className="hidden" onChange={dosyaSec} />
                    <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
                        Adınız ve yüklediğiniz fotoğraf davet sahibine iletilir; davet sahibi onaylarsa
                        fotoğrafınız davetiye sayfasında görünür.{" "}
                        Silme talepleri için{" "}
                        <a href="mailto:kvkk@bekleriz.com" className="underline underline-offset-2 hover:text-gray-600">
                          kvkk@bekleriz.com
                        </a>{" "}
                        adresine yazabilirsiniz.
                      </p>
                    </div>
                    {fotoHata && <p className="text-xs text-red-500">{fotoHata}</p>}
                    <button type="submit" disabled={fotoYukleniyor || !seciliDosyalar.length || !fotoAd.trim()}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)` }}>
                      {fotoYukleniyor
                        ? `${yuklenenSayisi}/${seciliDosyalar.length} yükleniyor...`
                        : seciliDosyalar.length > 1
                          ? `${seciliDosyalar.length} Fotoğrafı Gönder`
                          : "Fotoğrafı Gönder"}
                    </button>
                  </form>
                )}
              </div>

              {/* Galeri */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  {canliDuvarAktif ? "Canlı fotoğraf duvarı" : "Etkinlik albümü"}
                  {fotolar.length > 0 && <span className="ml-2 text-gray-400 font-normal">({fotolar.length})</span>}
                </p>
                {fotoListeYuk ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                ) : fotolar.length === 0 ? (
                  <div className="text-center py-10 text-gray-300">
                    <p className="text-4xl mb-2">🌅</p>
                    <p className="text-sm">Henüz fotoğraf yok</p>
                    <p className="text-xs mt-1">İlk fotoğrafı sen paylaş!</p>
                  </div>
                ) : (
                  <div className="columns-2 gap-2">
                    {fotolar.map(foto => (
                      <div key={foto.id} className="mb-2 rounded-xl overflow-hidden break-inside-avoid cursor-zoom-in group" onClick={() => setLightbox(foto)}>
                        <div className="relative w-full" style={{ aspectRatio: "1" }}>
                          <Image src={foto.dosyaUrl} alt={foto.yukleyenAd} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="bg-gray-50 px-2.5 py-1.5">
                          <p className="text-xs font-medium text-gray-600">{foto.yukleyenAd}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ANI DEFTERİ ── */}
          {sekme === "ani" && (
            <div className="p-5 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-700 mb-3">İyi dileklerini bırak 💌</p>
                {aniBasari ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <p className="text-2xl mb-1">💌</p>
                    <p className="text-sm font-semibold text-emerald-700">Anın alındı! Onay sonrası görünecek.</p>
                  </div>
                ) : (
                  <form onSubmit={aniGonder} className="space-y-3">
                    <input type="text" placeholder="Adın" value={aniAd}
                      onChange={e => setAniAd(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                      maxLength={40} required />
                    <textarea placeholder="İyi dileklerini, anılarını veya söylemek istediklerini yaz..." value={aniIcerik}
                      onChange={e => setAniIcerik(e.target.value)}
                      rows={4} maxLength={600}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white resize-none" required />
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-400">{aniIcerik.length}/600</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
                        Adınız ve yazdığınız anı davet sahibine iletilir; onaylanırsa anı defterinde görünür.
                        Silme talepleri için{" "}
                        <a href="mailto:kvkk@bekleriz.com" className="underline underline-offset-2 hover:text-gray-600">
                          kvkk@bekleriz.com
                        </a>{" "}
                        adresine yazabilirsiniz.
                      </p>
                    </div>
                    {aniHata && <p className="text-xs text-red-500">{aniHata}</p>}
                    <button type="submit" disabled={aniYukleniyor || !aniAd.trim() || !aniIcerik.trim()}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)` }}>
                      {aniYukleniyor ? "Gönderiliyor..." : "Anımı Gönder"}
                    </button>
                  </form>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Anı defteri
                  {anilar.length > 0 && <span className="ml-2 text-gray-400 font-normal">({anilar.length})</span>}
                </p>
                {aniListeYuk ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                ) : anilar.length === 0 ? (
                  <div className="text-center py-10 text-gray-300">
                    <p className="text-4xl mb-2">📖</p>
                    <p className="text-sm">Henüz anı yazılmamış</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {anilar.map(ani => (
                      <div key={ani.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                            style={{ background: `linear-gradient(135deg, ${renk}, ${renk}99)` }}>
                            {ani.yazarAd[0].toUpperCase()}
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{ani.yazarAd}</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{ani.icerik}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SESLİ ANI ── */}
          {sekme === "sesli" && (
            <div className="p-5 space-y-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-700 mb-1">Sesli anı bırak 🎙️</p>
                <p className="text-xs text-gray-400 mb-4">En fazla 30 saniye</p>

                {kayitDurum === "bekliyor" && (
                  <div className="flex flex-col gap-3">
                    <input type="text" placeholder="Adınız Soyadınız" value={sesliAd}
                      onChange={e => setSesliAd(e.target.value)} maxLength={60}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white" />
                    <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
                        Adınız, ses kaydınız ve kayıt süreniz davet sahibinin moderasyonuna iletilir; onaylanırsa
                        davetiye sayfasında dinlenebilir. Mikrofon izni yalnızca kayıt oluşturmak için kullanılır.
                        Silme talepleri için{" "}
                        <a href="mailto:kvkk@bekleriz.com" className="underline underline-offset-2 hover:text-gray-600">
                          kvkk@bekleriz.com
                        </a>{" "}
                        adresine yazabilirsiniz.
                      </p>
                    </div>
                    {izinReddedildi ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex flex-col gap-2.5">
                        <p className="text-xs font-semibold text-amber-800">Mikrofon erişimi engellendi</p>
                        <ol className="text-xs text-amber-700 space-y-0.5 list-decimal list-inside leading-relaxed">
                          <li>Adres çubuğundaki <strong>kilit 🔒</strong> ikonuna tıkla</li>
                          <li><strong>Site ayarları</strong>'nı aç</li>
                          <li>Mikrofon → <strong>İzin ver</strong> olarak değiştir</li>
                          <li>Aşağıdaki butona tıkla</li>
                        </ol>
                        <button onClick={() => window.location.reload()}
                          className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors">
                          🔄 Sayfayı Yenile
                        </button>
                      </div>
                    ) : (
                      <>
                        {sesHata && <p className="text-xs text-red-500">{sesHata}</p>}
                        <button onClick={kaydiBaslat}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
                          style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)` }}>
                          🎙️ Kayıt Başlat
                        </button>
                      </>
                    )}
                  </div>
                )}

                {kayitDurum === "kayit" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                      <span className="text-2xl">🎙️</span>
                    </div>
                    <p className="text-rose-700 font-semibold text-sm">Kayıt ediliyor... {kalan}s</p>
                    <button onClick={kaydiDurdur}
                      className="bg-gray-700 hover:bg-gray-800 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors">
                      ⏹ Durdur
                    </button>
                  </div>
                )}

                {kayitDurum === "gozden" && sesBlobUrl && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-gray-600">Kaydınızı dinleyin:</p>
                    <audio src={sesBlobUrl} controls className="w-full rounded-lg" />
                    <div className="flex gap-3">
                      <button onClick={sesliYenidenBasla}
                        className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50">
                        🔄 Yeniden
                      </button>
                      <button onClick={sesliGonder}
                        className="flex-1 text-white rounded-xl py-2.5 text-sm font-bold"
                        style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)` }}>
                        Gönder ✉️
                      </button>
                    </div>
                  </div>
                )}

                {kayitDurum === "gonderiliyor" && (
                  <div className="flex justify-center py-4">
                    <div className="w-7 h-7 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                )}

                {kayitDurum === "tamam" && (
                  <div className="text-center py-4">
                    <p className="text-3xl mb-2">💌</p>
                    <p className="text-sm font-semibold text-emerald-700">Sesli anın iletildi! Onay sonrası yayınlanacak.</p>
                  </div>
                )}

                {kayitDurum === "hata" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-red-500">{sesHata}</p>
                    <button onClick={sesliYenidenBasla}
                      className="text-white py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)` }}>
                      Tekrar Dene
                    </button>
                  </div>
                )}
              </div>

              {/* Onaylı sesli anılar */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Sesli anılar
                  {sesliAnilar.length > 0 && <span className="ml-2 text-gray-400 font-normal">({sesliAnilar.length})</span>}
                </p>
                {sesliListeYuk ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                ) : sesliAnilar.length === 0 ? (
                  <div className="text-center py-8 text-gray-300">
                    <p className="text-4xl mb-2">🎙️</p>
                    <p className="text-sm">Henüz sesli anı yok</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {sesliAnilar.map(ani => (
                      <div key={ani.id} className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ background: `linear-gradient(135deg, ${renk}, ${renk}99)` }}>
                          {ani.adSoyad[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{ani.adSoyad}</p>
                          <audio src={ani.dosyaUrl} controls className="w-full mt-1" style={{ height: 32 }} />
                        </div>
                        <span className="text-gray-400 text-xs shrink-0">{ani.sure}s</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

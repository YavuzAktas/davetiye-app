"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

/* ─── Tipler ─── */
interface AlbumFoto {
  id: string;
  yukleyenAd: string;
  dosyaUrl: string;
  createdAt: string;
}

interface AniYazisi {
  id: string;
  yazarAd: string;
  icerik: string;
  createdAt: string;
}

/* ─── Props ─── */
interface Props {
  slug: string;
  renk?: string; // davetiye tema rengi
}

export default function AlbumButonu({ slug, renk = "#7C3AED" }: Props) {
  const [acik, setAcik] = useState(false);
  const [sekme, setSekme] = useState<"album" | "ani">("album");
  const [lightbox, setLightbox] = useState<AlbumFoto | null>(null);

  /* Fotoğraf state */
  const [fotolar, setFotolar] = useState<AlbumFoto[]>([]);
  const [fotoYukleniyor, setFotoYukleniyor] = useState(false);
  const [fotoListeYukleniyor, setFotoListeYukleniyor] = useState(false);
  const [fotoAd, setFotoAd] = useState("");
  const [seciliDosya, setSeciliDosya] = useState<File | null>(null);
  const [onizleme, setOnizleme] = useState<string | null>(null);
  const [fotoBasari, setFotoBasari] = useState(false);
  const [fotoHata, setFotoHata] = useState("");
  const dosyaInputRef = useRef<HTMLInputElement>(null);

  /* Anı state */
  const [anilar, setAnilar] = useState<AniYazisi[]>([]);
  const [aniYukleniyor, setAniYukleniyor] = useState(false);
  const [aniListeYukleniyor, setAniListeYukleniyor] = useState(false);
  const [aniAd, setAniAd] = useState("");
  const [aniIcerik, setAniIcerik] = useState("");
  const [aniBasari, setAniBasari] = useState(false);
  const [aniHata, setAniHata] = useState("");

  /* Veri çek */
  useEffect(() => {
    if (!acik) return;
    if (sekme === "album") fetchFotolar();
    else fetchAnilar();
  }, [acik, sekme]);

  async function fetchFotolar() {
    setFotoListeYukleniyor(true);
    try {
      const res = await fetch(`/api/davetiye/${slug}/album`);
      if (res.ok) setFotolar(await res.json());
    } finally {
      setFotoListeYukleniyor(false);
    }
  }

  async function fetchAnilar() {
    setAniListeYukleniyor(true);
    try {
      const res = await fetch(`/api/davetiye/${slug}/ani`);
      if (res.ok) setAnilar(await res.json());
    } finally {
      setAniListeYukleniyor(false);
    }
  }

  /* Dosya seçimi + önizleme */
  async function dosyaSec(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOnizleme(URL.createObjectURL(file));
    setSeciliDosya(file);
    setFotoHata("");
  }

  /* Fotoğraf yükle */
  async function fotoYukle(e: React.FormEvent) {
    e.preventDefault();
    if (!seciliDosya || !fotoAd.trim()) return;
    setFotoYukleniyor(true);
    setFotoHata("");
    try {
      const sikistirilmis = await imageCompression(seciliDosya, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const form = new FormData();
      form.append("ad", fotoAd.trim());
      form.append("dosya", sikistirilmis, seciliDosya.name);

      const res = await fetch(`/api/davetiye/${slug}/album`, { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) { setFotoHata(json.hata); return; }

      setFotoBasari(true);
      setFotoAd("");
      setSeciliDosya(null);
      setOnizleme(null);
      if (dosyaInputRef.current) dosyaInputRef.current.value = "";
      setTimeout(() => setFotoBasari(false), 4000);
    } catch {
      setFotoHata("Yükleme başarısız, tekrar dene.");
    } finally {
      setFotoYukleniyor(false);
    }
  }

  /* Anı gönder */
  async function aniGonder(e: React.FormEvent) {
    e.preventDefault();
    if (!aniAd.trim() || !aniIcerik.trim()) return;
    setAniYukleniyor(true);
    setAniHata("");
    try {
      const res = await fetch(`/api/davetiye/${slug}/ani`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad: aniAd.trim(), icerik: aniIcerik.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setAniHata(json.hata); return; }

      setAniBasari(true);
      setAniAd("");
      setAniIcerik("");
      setTimeout(() => setAniBasari(false), 4000);
    } catch {
      setAniHata("Gönderilemedi, tekrar dene.");
    } finally {
      setAniYukleniyor(false);
    }
  }

  /* ESC ile kapat — önce lightbox, sonra panel */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else setAcik(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  /* Body scroll kilitle */
  useEffect(() => {
    document.body.style.overflow = acik ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [acik]);

  return (
    <>
      {/* ── Floating action button ── */}
      <button
        onClick={() => setAcik(true)}
        className="fixed bottom-22 right-6 z-40 flex items-center gap-2 text-white text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
        style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)`, boxShadow: `0 8px 32px ${renk}55` }}
      >
        <span className="text-lg">📸</span>
        <span className="hidden sm:inline">Albüm & Anı</span>
      </button>

      {/* ── Backdrop ── */}
      {acik && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setAcik(false)}
        />
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors"
          >
            ×
          </button>
          <div
            className="relative max-w-[95vw] max-h-[85dvh] w-full h-full"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightbox.dosyaUrl}
              alt={lightbox.yukleyenAd}
              fill
              className="object-contain"
              sizes="95vw"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white/80 text-sm font-medium">{lightbox.yukleyenAd}</p>
            <p className="text-white/40 text-xs mt-0.5">
              {new Date(lightbox.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      )}

      {/* ── Slide-up panel ── */}
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
          <h2 className="text-base font-bold text-gray-900">Canlı Albüm & Anı Defteri</h2>
          <button onClick={() => setAcik(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-lg">×</button>
        </div>

        {/* Sekmeler */}
        <div className="flex border-b border-gray-100 shrink-0 px-5">
          {(["album", "ani"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSekme(s)}
              className="flex items-center gap-1.5 py-3 px-4 text-sm font-semibold border-b-2 transition-colors"
              style={{
                borderColor: sekme === s ? renk : "transparent",
                color: sekme === s ? renk : "#9ca3af",
              }}
            >
              {s === "album" ? "📸 Fotoğraflar" : "💌 Anı Defteri"}
            </button>
          ))}
        </div>

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto">

          {/* ── ALBÜM SEKMESİ ── */}
          {sekme === "album" && (
            <div className="p-5 space-y-6">

              {/* Yükleme formu */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-700 mb-3">Etkinlikten fotoğraf paylaş</p>
                {fotoBasari ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <p className="text-2xl mb-1">✅</p>
                    <p className="text-sm font-semibold text-emerald-700">Yüklendi! Onay sonrası görünecek.</p>
                  </div>
                ) : (
                  <form onSubmit={fotoYukle} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Adın"
                      value={fotoAd}
                      onChange={e => setFotoAd(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                      maxLength={40}
                      required
                    />

                    {/* Dosya seçici */}
                    <div
                      onClick={() => dosyaInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-colors"
                    >
                      {onizleme ? (
                        <div className="relative w-full h-40 rounded-lg overflow-hidden">
                          <Image src={onizleme} alt="önizleme" fill className="object-cover" />
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl mb-2">🖼️</p>
                          <p className="text-sm text-gray-500">Fotoğraf seç</p>
                          <p className="text-xs text-gray-400 mt-0.5">max 6 MB</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={dosyaInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={dosyaSec}
                    />

                    <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
                        Adınız ve yüklediğiniz fotoğraf davet sahibinin moderasyonuna iletilir; onaylanırsa
                        davetiye albümünde görünür. Silme talepleri için{" "}
                        <a href="mailto:kvkk@bekleriz.com" className="underline underline-offset-2 hover:text-gray-600">
                          kvkk@bekleriz.com
                        </a>{" "}
                        adresine yazabilir ya da{" "}
                        <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gray-600">
                          KVKK Aydınlatma Metni
                        </a>
                        'ni inceleyebilirsiniz.
                      </p>
                    </div>

                    {fotoHata && <p className="text-xs text-red-500">{fotoHata}</p>}
                    <button
                      type="submit"
                      disabled={fotoYukleniyor || !seciliDosya || !fotoAd.trim()}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)` }}
                    >
                      {fotoYukleniyor ? "Yükleniyor..." : "Fotoğrafı Gönder"}
                    </button>
                  </form>
                )}
              </div>

              {/* Onaylı fotoğraflar */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Etkinlik albümü
                  {fotolar.length > 0 && <span className="ml-2 text-gray-400 font-normal">({fotolar.length})</span>}
                </p>
                {fotoListeYukleniyor ? (
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
                      <div
                        key={foto.id}
                        className="mb-2 rounded-xl overflow-hidden break-inside-avoid cursor-zoom-in group"
                        onClick={() => setLightbox(foto)}
                      >
                        <div className="relative w-full" style={{ aspectRatio: "1" }}>
                          <Image src={foto.dosyaUrl} alt={foto.yukleyenAd} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="bg-gray-50 px-2.5 py-1.5">
                          <p className="text-xs font-medium text-gray-600">{foto.yukleyenAd}</p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(foto.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ANI DEFTERİ SEKMESİ ── */}
          {sekme === "ani" && (
            <div className="p-5 space-y-6">

              {/* Anı yazma formu */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-700 mb-3">İyi dileklerini bırak 💌</p>
                {aniBasari ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                    <p className="text-2xl mb-1">💌</p>
                    <p className="text-sm font-semibold text-emerald-700">Anın alındı! Onay sonrası görünecek.</p>
                  </div>
                ) : (
                  <form onSubmit={aniGonder} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Adın"
                      value={aniAd}
                      onChange={e => setAniAd(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                      maxLength={40}
                      required
                    />
                    <textarea
                      placeholder="İyi dileklerini, anılarını veya söylemek istediklerini yaz..."
                      value={aniIcerik}
                      onChange={e => setAniIcerik(e.target.value)}
                      rows={4}
                      maxLength={600}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white resize-none"
                      required
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-400">{aniIcerik.length}/600</span>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
                        Adınız ve yazdığınız anı davet sahibinin moderasyonuna iletilir; onaylanırsa
                        anı defterinde görünür. Silme talepleri için{" "}
                        <a href="mailto:kvkk@bekleriz.com" className="underline underline-offset-2 hover:text-gray-600">
                          kvkk@bekleriz.com
                        </a>{" "}
                        adresine yazabilirsiniz.
                      </p>
                    </div>
                    {aniHata && <p className="text-xs text-red-500">{aniHata}</p>}
                    <button
                      type="submit"
                      disabled={aniYukleniyor || !aniAd.trim() || !aniIcerik.trim()}
                      className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                      style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)` }}
                    >
                      {aniYukleniyor ? "Gönderiliyor..." : "Anımı Gönder"}
                    </button>
                  </form>
                )}
              </div>

              {/* Onaylı anılar */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Anı defteri
                  {anilar.length > 0 && <span className="ml-2 text-gray-400 font-normal">({anilar.length})</span>}
                </p>
                {aniListeYukleniyor ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                ) : anilar.length === 0 ? (
                  <div className="text-center py-10 text-gray-300">
                    <p className="text-4xl mb-2">📖</p>
                    <p className="text-sm">Henüz anı yazılmamış</p>
                    <p className="text-xs mt-1">İlk anıyı sen bırak!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {anilar.map(ani => (
                      <div key={ani.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                            style={{ background: `linear-gradient(135deg, ${renk}, ${renk}99)` }}
                          >
                            {ani.yazarAd[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{ani.yazarAd}</p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(ani.createdAt).toLocaleDateString("tr-TR", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          &ldquo;{ani.icerik}&rdquo;
                        </p>
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

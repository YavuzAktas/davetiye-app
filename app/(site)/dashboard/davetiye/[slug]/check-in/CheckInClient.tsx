"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CheckInSonuc = {
  durum: "giris_yapildi" | "zaten_girdi";
  davetli: {
    ad: string;
    grup: string;
    kisiLimiti: number | null;
    checkinAt: string | null;
    checkinKisiSayisi: number | null;
    rsvp: { katilim: boolean; kisiSayisi: number } | null;
  };
};

type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => {
  detect(source: CanvasImageSource): Promise<Array<{ rawValue: string }>>;
};

declare global {
  interface Window { BarcodeDetector?: BarcodeDetectorCtor }
}

export default function CheckInClient({
  slug,
  toplam,
  baslangicGiris,
}: {
  slug: string;
  toplam: number;
  baslangicGiris: number;
}) {
  const [kod, setKod] = useState("");
  const [girisYapan, setGirisYapan] = useState(baslangicGiris);
  const [sonuc, setSonuc] = useState<CheckInSonuc | null>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kameraAcik, setKameraAcik] = useState(false);
  const [kameraHata, setKameraHata] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const kameraIleGeldi = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkInYap = async (deger: string, kameradan = false) => {
    const temiz = deger.trim();
    if (!temiz) return;
    kameraIleGeldi.current = kameradan;
    setYukleniyor(true);
    setHata("");
    setSonuc(null);
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kod: temiz }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata || "Check-in yapılamadı.");
      setSonuc(data);
      if (data.durum === "giris_yapildi") setGirisYapan(prev => Math.min(toplam, prev + 1));
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Check-in yapılamadı.");
      if (kameradan) setKameraAcik(true);
    } finally {
      setYukleniyor(false);
    }
  };

  const checkInYapRef = useRef(checkInYap);
  useEffect(() => { checkInYapRef.current = checkInYap; });

  useEffect(() => {
    if (!kameraAcik) return;
    let iptal = false;
    let frame = 0;

    async function baslat() {
      if (!window.BarcodeDetector) {
        setKameraHata("Bu tarayıcı QR okumayı desteklemiyor. Kodu elle yapıştırabilirsiniz.");
        setKameraAcik(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const tara = async () => {
          if (iptal || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            const raw = codes[0]?.rawValue;
            if (raw) {
              setKameraAcik(false);
              await checkInYapRef.current(raw, true);
              return;
            }
          } catch {}
          frame = window.setTimeout(tara, 500);
        };
        tara();
      } catch {
        setKameraHata("Kamera açılamadı. Tarayıcı iznini kontrol edin.");
        setKameraAcik(false);
      }
    }

    baslat();
    return () => {
      iptal = true;
      if (frame) window.clearTimeout(frame);
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [kameraAcik]);

  const sonucTemizle = useCallback(() => {
    setSonuc(null);
    setHata("");
    if (kameraIleGeldi.current) {
      setKameraAcik(true);
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, []);

  const kameraKapat = () => {
    setKameraAcik(false);
    setKameraHata("");
  };

  const bekleyen = toplam - girisYapan;
  const oran = toplam ? Math.round((girisYapan / toplam) * 100) : 0;
  const cubukRenk = oran >= 90 ? "#ef4444" : oran >= 70 ? "#f59e0b" : "#22c55e";

  return (
    <div className="space-y-4">

      {/* ── Sayaç kartı ── */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6">
        <p className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase mb-5">Giriş Durumu</p>

        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-gray-900 tabular-nums leading-none">{girisYapan}</span>
              <span className="text-xl font-bold text-gray-200 tabular-nums">/ {toplam}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">kişi giriş yaptı</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black tabular-nums leading-none" style={{ color: cubukRenk }}>
              %{oran}
            </p>
            <p className="text-xs text-gray-400 mt-1.5">{bekleyen} bekleniyor</p>
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${oran}%`, backgroundColor: cubukRenk }}
          />
        </div>
      </div>

      {/* ── Tarayıcı kartı ── */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">

        {kameraAcik ? (
          /* Kamera aktif */
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full aspect-square object-cover bg-gray-900"
              muted
              playsInline
            />
            {/* Tarama çerçevesi */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Köşe işaretçileri */}
              <div className="w-56 h-56 relative">
                <div className="absolute top-0 left-0 w-9 h-9 border-t-[3px] border-l-[3px] border-white/90 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-9 h-9 border-t-[3px] border-r-[3px] border-white/90 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-9 h-9 border-b-[3px] border-l-[3px] border-white/90 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-9 h-9 border-b-[3px] border-r-[3px] border-white/90 rounded-br-xl" />
              </div>
            </div>
            {/* Alt kapat butonu */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <button
                onClick={kameraKapat}
                className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2.5 rounded-2xl hover:bg-black/70 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Kamerayı Kapat
              </button>
            </div>
          </div>
        ) : (
          /* Kamera kapalı — büyük tara butonu */
          <button
            onClick={() => { setKameraHata(""); setKameraAcik(true); }}
            className="w-full flex flex-col items-center gap-4 py-10 px-6 hover:bg-gray-50/70 transition-colors group"
          >
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-gray-900/10">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <path strokeLinecap="round" d="M14 14h3v3m0 0v3h3m-3-3h3" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">QR Kodu Tara</p>
              <p className="text-sm text-gray-400 mt-0.5">Kamerayı aç, QR koda tut</p>
            </div>
          </button>
        )}

        {/* Ayraç */}
        <div className="flex items-center gap-3 px-6">
          <div className="h-px bg-gray-100 flex-1" />
          <span className="text-xs text-gray-300 font-medium">veya</span>
          <div className="h-px bg-gray-100 flex-1" />
        </div>

        {/* Elle giriş */}
        <div className="p-5 pt-4 space-y-3">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={kod}
              onChange={e => setKod(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkInYap(kod)}
              placeholder="Kişisel linki veya kodu yapıştır"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-300"
            />
            <button
              onClick={() => checkInYap(kod)}
              disabled={!kod.trim() || yukleniyor}
              className="px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-30 transition-all active:scale-95 whitespace-nowrap"
            >
              {yukleniyor
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : "Giriş"
              }
            </button>
          </div>

          {kameraHata && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <span className="text-amber-500 text-sm shrink-0 mt-0.5">⚠</span>
              <p className="text-sm text-amber-700">{kameraHata}</p>
            </div>
          )}
          {hata && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              <p className="text-sm text-red-600">{hata}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sonuç kartı ── */}
      {sonuc && (() => {
        const basarili = sonuc.durum === "giris_yapildi";
        const kisiSayisi = sonuc.davetli.checkinKisiSayisi ?? sonuc.davetli.rsvp?.kisiSayisi ?? 1;
        const girisSaati = sonuc.davetli.checkinAt
          ? new Date(sonuc.davetli.checkinAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
          : null;

        return (
          <div className={`rounded-3xl border overflow-hidden ${
            basarili ? "border-emerald-100" : "border-amber-100"
          }`}>
            {/* Renk şeridi + ikon + ad */}
            <div className={`px-6 py-5 ${basarili ? "bg-emerald-50" : "bg-amber-50"}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  basarili ? "bg-emerald-100" : "bg-amber-100"
                }`}>
                  {basarili ? (
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  )}
                </div>
                <p className={`text-xs font-bold tracking-widest uppercase ${
                  basarili ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {basarili ? "Giriş Onaylandı" : "Daha Önce Giriş Yapmış"}
                </p>
              </div>

              <h2 className="text-2xl font-black text-gray-900 leading-tight">{sonuc.davetli.ad}</h2>
            </div>

            {/* Detaylar */}
            <div className="bg-white px-6 py-4 flex flex-wrap gap-2">
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl">
                {kisiSayisi} kişi
              </span>
              {sonuc.davetli.rsvp ? (
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
                  sonuc.davetli.rsvp.katilim
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}>
                  {sonuc.davetli.rsvp.katilim ? "RSVP ✓" : "RSVP ✗"}
                </span>
              ) : (
                <span className="text-xs font-semibold bg-gray-50 text-gray-400 px-3 py-1.5 rounded-xl">
                  RSVP yok
                </span>
              )}
              {girisSaati && (
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
                  basarili
                    ? "bg-gray-50 text-gray-500"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {basarili ? girisSaati : `${girisSaati}'de girmişti`}
                </span>
              )}
            </div>

            {/* Aksiyon */}
            <div className="px-5 pb-5">
              <button
                onClick={sonucTemizle}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                  basarili
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                }`}
              >
                {kameraIleGeldi.current ? "Sonraki Davetli → Kamera Açılıyor" : "Sonraki Davetli →"}
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

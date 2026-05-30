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
  interface Window {
    BarcodeDetector?: BarcodeDetectorCtor;
  }
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

  // Kamera effect'in stale closure sorunu yaşamaması için ref kullan.
  // Effect sadece kameraAcik değişince çalışır; checkInYap her render'da yeni
  // referans alsa da ref hep güncel kalır.
  const checkInYapRef = useRef(checkInYap);
  useEffect(() => { checkInYapRef.current = checkInYap; });

  useEffect(() => {
    if (!kameraAcik) return;
    let iptal = false;
    let frame = 0;

    async function baslat() {
      if (!window.BarcodeDetector) {
        setKameraHata("Bu tarayıcı kamera ile QR okumayı desteklemiyor. Kodu veya linki elle yapıştırabilirsiniz.");
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
        setKameraHata("Kamera açılamadı. Tarayıcı iznini kontrol edin veya kodu elle girin.");
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
  }, [kameraAcik]); // sadece kameraAcik — checkInYap ref üzerinden erişiliyor

  const sonucTemizle = useCallback(() => {
    setSonuc(null);
    setHata("");
    if (kameraIleGeldi.current) {
      setKameraAcik(true);
    } else {
      inputRef.current?.focus();
    }
  }, []);

  const bekleyen = toplam - girisYapan;
  const oran = toplam ? Math.round((girisYapan / toplam) * 100) : 0;

  return (
    <div className="space-y-4">

      {/* ── Sayaç ── */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Giriş Durumu</p>
        <div className="flex items-end gap-6 mb-4">
          <div>
            <p className="text-4xl font-black text-gray-900 tabular-nums leading-none">{girisYapan}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5">giriş yaptı</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-300 tabular-nums leading-none">{bekleyen}</p>
            <p className="text-xs text-gray-400 mt-1.5">bekleniyor</p>
          </div>
          <div className="ml-auto self-start">
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
              %{oran}
            </span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${oran}%`,
              backgroundColor: oran >= 90 ? "#ef4444" : oran >= 70 ? "#f59e0b" : "#22c55e",
            }}
          />
        </div>
      </div>

      {/* ── Tarama / Giriş ── */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-3">

        {/* Kamera butonu — birincil aksiyon */}
        <button
          onClick={() => { setKameraHata(""); setKameraAcik(v => !v); }}
          className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold transition-all ${
            kameraAcik
              ? "bg-gray-100 text-gray-600"
              : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h2v2h-2zm4 0h3v3h-3zm-4 4h3v3h-3zm4 2h3" />
          </svg>
          {kameraAcik ? "Kamerayı Kapat" : "QR Kodu Okut"}
        </button>

        {/* Kamera önizleme + tarama çerçevesi */}
        {kameraAcik && (
          <div className="relative rounded-2xl overflow-hidden bg-gray-900">
            <video
              ref={videoRef}
              className="w-full aspect-square object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 relative">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-white rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-white rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-white rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-white rounded-br-lg" />
              </div>
            </div>
            <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/60 font-medium">
              QR kodu çerçeveye getirin
            </p>
          </div>
        )}

        {/* Elle giriş */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={kod}
            onChange={e => setKod(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkInYap(kod)}
            placeholder="QR linkini veya /d/ kodunu yapıştır"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          <button
            onClick={() => checkInYap(kod)}
            disabled={!kod.trim() || yukleniyor}
            className="px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 transition-all active:scale-95 whitespace-nowrap"
          >
            {yukleniyor ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : "Giriş"}
          </button>
        </div>

        {kameraHata && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            {kameraHata}
          </p>
        )}
        {hata && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {hata}
          </p>
        )}
      </div>

      {/* ── Sonuç kartı ── */}
      {sonuc && (() => {
        const basarili = sonuc.durum === "giris_yapildi";
        const kisiSayisi = sonuc.davetli.checkinKisiSayisi ?? sonuc.davetli.rsvp?.kisiSayisi ?? 1;
        const girisSaati = sonuc.davetli.checkinAt
          ? new Date(sonuc.davetli.checkinAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
          : null;

        return (
          <div className={`border rounded-3xl p-5 ${
            basarili ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                basarili ? "bg-emerald-100" : "bg-amber-100"
              }`}>
                {basarili ? (
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${
                  basarili ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {basarili ? "Giriş Onaylandı" : "Daha Önce Giriş Yapmış"}
                </p>
                <h2 className="text-xl font-black text-gray-900 truncate">{sonuc.davetli.ad}</h2>

                <div className="mt-2.5 flex flex-wrap gap-2">
                  <span className="text-xs font-semibold bg-white/80 border border-white px-3 py-1.5 rounded-xl text-gray-700">
                    {kisiSayisi} kişi
                  </span>
                  {sonuc.davetli.rsvp ? (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
                      sonuc.davetli.rsvp.katilim ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                    }`}>
                      RSVP {sonuc.davetli.rsvp.katilim ? "✓ Katılıyor" : "✗ Katılamıyor"}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl">
                      RSVP yok
                    </span>
                  )}
                  {!basarili && girisSaati && (
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-xl">
                      {girisSaati}&apos;de girdi
                    </span>
                  )}
                  {basarili && girisSaati && (
                    <span className="text-xs font-semibold bg-white/80 border border-white text-gray-500 px-3 py-1.5 rounded-xl">
                      {girisSaati}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={sonucTemizle}
              className={`w-full mt-4 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                basarili
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-amber-200 text-amber-900 hover:bg-amber-300"
              }`}
            >
              {kameraIleGeldi.current ? "Sonraki Davetli → (Kamera Açılıyor)" : "Sonraki Davetli →"}
            </button>
          </div>
        );
      })()}
    </div>
  );
}

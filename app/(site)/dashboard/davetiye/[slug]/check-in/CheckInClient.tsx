"use client";

import { useEffect, useRef, useState } from "react";

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

  const checkInYap = async (deger = kod) => {
    const temiz = deger.trim();
    if (!temiz || yukleniyor) return;
    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kod: temiz }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata || "Check-in yapılamadı.");
      setSonuc(data);
      setKod("");
      if (data.durum === "giris_yapildi") setGirisYapan(prev => Math.min(toplam, prev + 1));
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Check-in yapılamadı.");
    } finally {
      setYukleniyor(false);
    }
  };

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
              await checkInYap(raw);
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
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };
  }, [kameraAcik]);

  const oran = toplam ? Math.round((girisYapan / toplam) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-100 rounded-3xl p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Giriş Durumu</p>
            <p className="text-2xl font-black text-gray-900">{girisYapan}/{toplam}</p>
          </div>
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">%{oran}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${oran}%` }} />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => { setKameraHata(""); setKameraAcik(v => !v); }}
            className="px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            {kameraAcik ? "Kamerayı Kapat" : "QR Okut"}
          </button>
          <input
            value={kod}
            onChange={e => setKod(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkInYap()}
            placeholder="QR linkini veya /d/ kodunu yapıştır"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <button
            onClick={() => checkInYap()}
            disabled={!kod.trim() || yukleniyor}
            className="px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            {yukleniyor ? "Kontrol..." : "Giriş Yap"}
          </button>
        </div>

        {kameraAcik && (
          <video ref={videoRef} className="w-full aspect-video rounded-2xl bg-gray-900 object-cover" muted playsInline />
        )}
        {kameraHata && <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">{kameraHata}</p>}
        {hata && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{hata}</p>}
      </div>

      {sonuc && (
        <div className={`border rounded-3xl p-5 ${
          sonuc.durum === "zaten_girdi" ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
        }`}>
          <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${
            sonuc.durum === "zaten_girdi" ? "text-amber-600" : "text-emerald-600"
          }`}>
            {sonuc.durum === "zaten_girdi" ? "Daha Önce Giriş Yapmış" : "Giriş Onaylandı"}
          </p>
          <h2 className="text-xl font-black text-gray-900">{sonuc.davetli.ad}</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="bg-white/80 border border-white px-3 py-1.5 rounded-xl text-gray-600">
              {sonuc.davetli.checkinKisiSayisi ?? sonuc.davetli.rsvp?.kisiSayisi ?? 1} kişi
            </span>
            <span className="bg-white/80 border border-white px-3 py-1.5 rounded-xl text-gray-600">
              RSVP: {sonuc.davetli.rsvp ? (sonuc.davetli.rsvp.katilim ? "Katılıyor" : "Katılamıyor") : "Yok"}
            </span>
            {sonuc.davetli.checkinAt && (
              <span className="bg-white/80 border border-white px-3 py-1.5 rounded-xl text-gray-600">
                {new Date(sonuc.davetli.checkinAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

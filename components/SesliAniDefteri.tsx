"use client";

import { useEffect, useRef, useState } from "react";

type Durum = "bekliyor" | "kayit" | "gozden" | "gonderiliyor" | "tamam" | "hata";

interface SesliAni {
  id: string;
  adSoyad: string;
  sure: number;
  createdAt: string;
  dosyaUrl: string;
}

export default function SesliAniDefteri({ slug }: { slug: string }) {
  const [durum, setDurum] = useState<Durum>("bekliyor");
  const [adSoyad, setAdSoyad] = useState("");
  const [kalan, setKalan] = useState(30);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [sure, setSure] = useState(0);
  const [hataMsg, setHataMsg] = useState("");
  const [anilar, setAnilar] = useState<SesliAni[]>([]);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`/api/davetiye/${slug}/sesli-ani`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAnilar(data); })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    return () => {
      if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    };
  }, [audioBlobUrl]);

  async function kaydiBaslat() {
    if (!adSoyad.trim() || adSoyad.trim().length < 2) {
      setHataMsg("Lütfen adınızı girin (en az 2 karakter).");
      return;
    }
    setHataMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const recorded = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recorded);
        setBlob(recorded);
        setAudioBlobUrl(url);
        setDurum("gozden");
      };

      recorder.start();
      setDurum("kayit");
      setKalan(30);
      setSure(0);

      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += 1;
        setSure(elapsed);
        setKalan((p) => {
          if (p <= 1) {
            kaydiDurdur();
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    } catch {
      setHataMsg("Mikrofon erişimi reddedildi.");
    }
  }

  function kaydiDurdur() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }

  async function gonder() {
    if (!blob) return;
    setDurum("gonderiliyor");
    const form = new FormData();
    form.append("adSoyad", adSoyad.trim());
    form.append("dosya", blob, "ani.webm");
    form.append("sure", String(sure));

    const res = await fetch(`/api/davetiye/${slug}/sesli-ani`, {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      setDurum("tamam");
    } else {
      const data = await res.json().catch(() => ({}));
      setHataMsg(data.hata ?? "Bir hata oluştu.");
      setDurum("hata");
    }
  }

  function yenidenBasla() {
    if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    setBlob(null);
    setAudioBlobUrl(null);
    setSure(0);
    setKalan(30);
    setHataMsg("");
    setDurum("bekliyor");
  }

  return (
    <section className="my-12 px-4">
      <div className="max-w-md mx-auto">
        <h3 className="text-center font-serif text-2xl text-rose-800 mb-2">Sesli Anı Defteri</h3>
        <p className="text-center text-rose-500 text-sm mb-6">
          Bize sesli bir mesaj bırakın — en fazla 30 saniye
        </p>

        {durum === "bekliyor" && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Adınız Soyadınız"
              value={adSoyad}
              onChange={(e) => setAdSoyad(e.target.value)}
              maxLength={60}
              className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            {hataMsg && <p className="text-red-500 text-xs">{hataMsg}</p>}
            <button
              onClick={kaydiBaslat}
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 font-medium transition-colors"
            >
              🎙️ Kayıt Başlat
            </button>
          </div>
        )}

        {durum === "kayit" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <span className="text-3xl">🎙️</span>
            </div>
            <p className="text-rose-700 font-medium">Kayıt ediliyor... {kalan}s</p>
            <button
              onClick={kaydiDurdur}
              className="bg-gray-700 hover:bg-gray-800 text-white rounded-xl px-6 py-2.5 font-medium transition-colors"
            >
              ⏹ Kaydı Durdur
            </button>
          </div>
        )}

        {durum === "gozden" && audioBlobUrl && (
          <div className="flex flex-col gap-4">
            <p className="text-center text-rose-700 text-sm font-medium">Kaydınızı dinleyin:</p>
            <audio src={audioBlobUrl} controls className="w-full rounded-lg" />
            <div className="flex gap-3">
              <button
                onClick={yenidenBasla}
                className="flex-1 border border-rose-300 text-rose-700 rounded-xl py-2.5 font-medium hover:bg-rose-50 transition-colors"
              >
                🔄 Yeniden Kaydet
              </button>
              <button
                onClick={gonder}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2.5 font-medium transition-colors"
              >
                Gönder ✉️
              </button>
            </div>
          </div>
        )}

        {durum === "gonderiliyor" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-8 h-8 border-4 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
            <p className="text-rose-600 text-sm">Gönderiliyor...</p>
          </div>
        )}

        {durum === "tamam" && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-5xl">💌</span>
            <p className="text-rose-700 font-medium">Sesli anınız iletildi!</p>
            <p className="text-rose-400 text-xs">Onaylandıktan sonra burada görünecek.</p>
          </div>
        )}

        {durum === "hata" && (
          <div className="flex flex-col gap-3">
            <p className="text-red-500 text-sm text-center">{hataMsg}</p>
            <button
              onClick={yenidenBasla}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2.5 font-medium transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {anilar.length > 0 && (
          <div className="mt-10">
            <h4 className="text-rose-700 font-serif text-lg mb-4 text-center">Gelen Sesli Anılar</h4>
            <div className="flex flex-col gap-3">
              {anilar.map((ani) => (
                <div key={ani.id} className="bg-rose-50 rounded-xl p-3 flex items-center gap-3">
                  <span className="text-2xl">🎙️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-rose-800 font-medium text-sm truncate">{ani.adSoyad}</p>
                    <audio src={ani.dosyaUrl} controls className="w-full mt-1" style={{ height: 32 }} />
                  </div>
                  <span className="text-rose-400 text-xs shrink-0">{ani.sure}s</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

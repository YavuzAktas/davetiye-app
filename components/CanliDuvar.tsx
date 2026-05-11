"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface DuvarFoto {
  id: string;
  yukleyenAd: string;
  dosyaUrl: string;
  createdAt: string;
}

type YuklemeDurum = "bos" | "yukleniyor" | "tamam" | "hata";

export default function CanliDuvar({ slug }: { slug: string }) {
  const [fotolar, setFotolar] = useState<DuvarFoto[]>([]);
  const [ad, setAd] = useState("");
  const [yuklemeDurum, setYuklemeDurum] = useState<YuklemeDurum>("bos");
  const [hataMsg, setHataMsg] = useState("");
  const [onizleme, setOnizleme] = useState<string | null>(null);
  const [onizlemeDosya, setOnizlemeDosya] = useState<File | null>(null);
  const dosyaRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fotolariYukle = useCallback(async () => {
    const res = await fetch(`/api/davetiye/${slug}/album`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setFotolar(data);
    }
  }, [slug]);

  useEffect(() => {
    fotolariYukle();
    pollRef.current = setInterval(fotolariYukle, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fotolariYukle]);

  function dosyaSec(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (onizleme) URL.revokeObjectURL(onizleme);
    setOnizlemeDosya(file);
    setOnizleme(URL.createObjectURL(file));
    setYuklemeDurum("bos");
    setHataMsg("");
  }

  async function gonder() {
    if (!ad.trim() || ad.trim().length < 2) {
      setHataMsg("Lütfen adınızı girin (en az 2 karakter).");
      return;
    }
    if (!onizlemeDosya) {
      setHataMsg("Lütfen bir fotoğraf seçin.");
      return;
    }
    setHataMsg("");
    setYuklemeDurum("yukleniyor");

    const form = new FormData();
    form.append("ad", ad.trim());
    form.append("dosya", onizlemeDosya);

    const res = await fetch(`/api/davetiye/${slug}/album`, {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      setYuklemeDurum("tamam");
      setAd("");
      setOnizlemeDosya(null);
      if (onizleme) URL.revokeObjectURL(onizleme);
      setOnizleme(null);
      if (dosyaRef.current) dosyaRef.current.value = "";
      fotolariYukle();
    } else {
      const data = await res.json().catch(() => ({}));
      setHataMsg(data.hata ?? "Bir hata oluştu.");
      setYuklemeDurum("hata");
    }
  }

  function iptal() {
    if (onizleme) URL.revokeObjectURL(onizleme);
    setOnizleme(null);
    setOnizlemeDosya(null);
    if (dosyaRef.current) dosyaRef.current.value = "";
    setYuklemeDurum("bos");
    setHataMsg("");
  }

  return (
    <section className="my-12 px-4">
      <div className="max-w-lg mx-auto">
        <h3 className="text-center font-serif text-2xl text-rose-800 mb-2">Canlı Fotoğraf Duvarı</h3>
        <p className="text-center text-rose-500 text-sm mb-6">
          Anı ölümsüzleştirin — fotoğrafınız anında duvara eklenir
        </p>

        {/* Upload form */}
        <div className="bg-rose-50 rounded-2xl p-4 mb-6">
          {!onizleme ? (
            <label className="flex flex-col items-center gap-2 cursor-pointer border-2 border-dashed border-rose-200 rounded-xl py-6 hover:border-rose-400 transition-colors">
              <span className="text-3xl">📸</span>
              <span className="text-rose-600 text-sm font-medium">Fotoğraf seç</span>
              <span className="text-rose-400 text-xs">JPG, PNG, WEBP — max 6 MB</span>
              <input
                ref={dosyaRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={dosyaSec}
              />
            </label>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                <Image src={onizleme} alt="Önizleme" fill className="object-contain" />
              </div>
              <input
                type="text"
                placeholder="Adınız Soyadınız"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                maxLength={60}
                className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              {hataMsg && <p className="text-red-500 text-xs">{hataMsg}</p>}
              {yuklemeDurum === "tamam" && (
                <p className="text-green-600 text-sm text-center">✅ Fotoğraf duvara eklendi!</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={iptal}
                  className="flex-1 border border-rose-300 text-rose-700 rounded-xl py-2.5 font-medium hover:bg-rose-100 transition-colors text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={gonder}
                  disabled={yuklemeDurum === "yukleniyor"}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded-xl py-2.5 font-medium transition-colors text-sm"
                >
                  {yuklemeDurum === "yukleniyor" ? "Yükleniyor..." : "Duvara Ekle 🖼️"}
                </button>
              </div>
            </div>
          )}

          {!onizleme && hataMsg && <p className="text-red-500 text-xs mt-2 text-center">{hataMsg}</p>}
        </div>

        {/* Photo wall grid */}
        {fotolar.length > 0 ? (
          <div className="columns-2 sm:columns-3 gap-2 space-y-2">
            {fotolar.map((foto) => (
              <div key={foto.id} className="break-inside-avoid rounded-xl overflow-hidden relative group">
                <Image
                  src={foto.dosyaUrl}
                  alt={foto.yukleyenAd}
                  width={300}
                  height={300}
                  className="w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{foto.yukleyenAd}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-rose-300 text-sm">Henüz fotoğraf yok — ilk siz ekleyin!</p>
        )}
      </div>
    </section>
  );
}

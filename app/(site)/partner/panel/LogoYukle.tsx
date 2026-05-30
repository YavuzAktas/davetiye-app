"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LogoYukle({ mevcutLogo }: { mevcutLogo: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const yukle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    setYukleniyor(true);
    setHata("");
    const form = new FormData();
    form.append("dosya", dosya);
    try {
      const res = await fetch("/api/partner/logo", { method: "POST", body: form });
      const d = await res.json();
      if (!res.ok) {
        setHata(d.hata ?? "Yükleme başarısız.");
      } else {
        router.refresh();
      }
    } catch {
      setHata("Sunucuya bağlanılamadı.");
    } finally {
      setYukleniyor(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={yukleniyor}
        className="relative shrink-0 group"
        title={mevcutLogo ? "Logoyu değiştir" : "Logo yükle"}
      >
        {mevcutLogo ? (
          <div className="relative w-12 h-12 rounded-2xl border border-gray-100 overflow-hidden bg-white">
            <Image src={mevcutLogo} alt="Partner logosu" fill className="object-contain p-1" unoptimized />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl flex items-center justify-center">
              {!yukleniyor && (
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity font-bold drop-shadow">✎</span>
              )}
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 group-hover:border-purple-300 group-hover:bg-purple-50 transition-colors flex items-center justify-center">
            <span className="text-gray-300 group-hover:text-purple-400 transition-colors text-xl">+</span>
          </div>
        )}
        {yukleniyor && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
          </div>
        )}
      </button>

      <div>
        <p className="text-[11px] font-semibold text-gray-500">
          {mevcutLogo ? "Logoyu Değiştir" : "Logo Yükle"}
        </p>
        <p className="text-[10px] text-gray-400">JPG, PNG veya WEBP · max 2 MB</p>
        {hata && <p className="text-[10px] text-red-500 mt-0.5">{hata}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={yukle}
      />
    </div>
  );
}

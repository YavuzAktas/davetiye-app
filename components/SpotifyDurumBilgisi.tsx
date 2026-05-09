"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Icerik() {
  const params = useSearchParams();
  const durum = params.get("spotify");
  const neden = params.get("neden");

  if (durum === "baglandi") {
    return (
      <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-lg">
        ✓ Spotify hesabın başarıyla bağlandı
      </div>
    );
  }

  if (durum === "hata") {
    return (
      <div className="fixed top-4 right-4 z-50 bg-red-500 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-lg max-w-xs">
        Spotify bağlantısı başarısız oldu{neden ? ` (${neden})` : ""}. Tekrar deneyin.
      </div>
    );
  }

  return null;
}

export default function SpotifyDurumBilgisi() {
  return (
    <Suspense fallback={null}>
      <Icerik />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Aksiyon = "onayla" | "reddet" | "askiya-al" | "aktifleştir";

export default function PartnerEylemleri({
  partnerId,
  durum,
}: {
  partnerId: string;
  durum: string;
}) {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState<Aksiyon | null>(null);

  const islem = async (action: Aksiyon) => {
    setYukleniyor(action);
    try {
      await fetch(`/api/admin/partner/${partnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setYukleniyor(null);
    }
  };

  if (durum === "beklemede") {
    return (
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => islem("onayla")}
          disabled={!!yukleniyor}
          className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 rounded-xl disabled:opacity-60"
        >
          {yukleniyor === "onayla" ? "…" : "Onayla"}
        </button>
        <button
          onClick={() => islem("reddet")}
          disabled={!!yukleniyor}
          className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors px-4 py-2 rounded-xl disabled:opacity-60"
        >
          {yukleniyor === "reddet" ? "…" : "Reddet"}
        </button>
      </div>
    );
  }

  if (durum === "aktif") {
    return (
      <button
        onClick={() => islem("askiya-al")}
        disabled={!!yukleniyor}
        className="text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors px-4 py-2 rounded-xl disabled:opacity-60 shrink-0"
      >
        {yukleniyor === "askiya-al" ? "…" : "Askıya Al"}
      </button>
    );
  }

  if (durum === "askida") {
    return (
      <button
        onClick={() => islem("aktifleştir")}
        disabled={!!yukleniyor}
        className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 transition-colors px-4 py-2 rounded-xl disabled:opacity-60 shrink-0"
      >
        {yukleniyor === "aktifleştir" ? "…" : "Aktifleştir"}
      </button>
    );
  }

  return null;
}

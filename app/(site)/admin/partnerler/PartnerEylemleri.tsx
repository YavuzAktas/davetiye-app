"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerEylemleri({
  partnerId,
  readonly = false,
}: {
  partnerId: string;
  readonly?: boolean;
}) {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState<"onayla" | "reddet" | null>(null);

  const islem = async (action: "onayla" | "reddet") => {
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

  if (readonly) return null;

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

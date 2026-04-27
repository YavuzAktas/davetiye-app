"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = async () => {
    await navigator.clipboard.writeText(text);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  return (
    <button
      onClick={kopyala}
      className="text-xs px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap"
    >
      {kopyalandi ? "Kopyalandı ✓" : "Kopyala"}
    </button>
  );
}
"use client";

import { useState } from "react";

interface Props {
  slug: string;
  renk: string;
  rgb: string;
}

export default function AniKitabiButon({ slug, renk, rgb }: Props) {
  const [durum, setDurum] = useState<"bos" | "yukleniyor" | "hata">("bos");
  const [hataMsg, setHataMsg] = useState("");

  async function indir() {
    if (durum === "yukleniyor") return;
    setDurum("yukleniyor");
    setHataMsg("");

    try {
      const res = await fetch(`/api/davetiye/${slug}/ani-kitabi`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.detay ?? json.hata ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `ani-kitabi-${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(href);
      setDurum("bos");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "PDF oluşturulamadı";
      setHataMsg(msg);
      setDurum("hata");
    }
  }

  return (
    <div className="shrink-0 flex flex-col items-end gap-1.5">
      <button
        onClick={indir}
        disabled={durum === "yukleniyor"}
        className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed"
        style={{
          background: durum === "yukleniyor"
            ? `rgba(${rgb}, 0.5)`
            : `linear-gradient(135deg, ${renk}, ${renk}cc)`,
          color: "#fff",
          boxShadow: durum === "yukleniyor" ? "none" : `0 4px 20px rgba(${rgb}, 0.3)`,
        }}
      >
        {durum === "yukleniyor" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Oluşturuluyor…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF İndir
          </>
        )}
      </button>

      {durum === "hata" && (
        <p className="text-xs text-red-500 max-w-48 text-right leading-snug">{hataMsg}</p>
      )}
    </div>
  );
}

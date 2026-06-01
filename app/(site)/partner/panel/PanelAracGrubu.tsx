"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type PanelAracGrubuProps = {
  id: string;
  baslik: string;
  aciklama: string;
  hedefler?: string[];
  varsayilanAcik?: boolean;
  children: ReactNode;
};

export default function PanelAracGrubu({
  id,
  baslik,
  aciklama,
  hedefler = [],
  varsayilanAcik = false,
  children,
}: PanelAracGrubuProps) {
  const [acik, setAcik] = useState(varsayilanAcik);

  useEffect(() => {
    function hedefeGoreAc() {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      const buGrubaAit = hash === id || hedefler.includes(hash);
      if (!buGrubaAit) return;

      setAcik(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    hedefeGoreAc();
    window.addEventListener("hashchange", hedefeGoreAc);
    return () => window.removeEventListener("hashchange", hedefeGoreAc);
  }, [hedefler, id]);

  return (
    <details
      id={id}
      open={acik}
      onToggle={event => setAcik(event.currentTarget.open)}
      className="group scroll-mt-24 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-purple-50/50 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-sm font-black text-gray-950">{baslik}</span>
          <span className="mt-1 block text-xs leading-relaxed text-gray-500">{aciklama}</span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-purple-100 bg-purple-50/50 text-lg font-black text-purple-400 transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="space-y-4 border-t border-purple-100/50 bg-purple-50/20 p-3 sm:p-4">
        {children}
      </div>
    </details>
  );
}

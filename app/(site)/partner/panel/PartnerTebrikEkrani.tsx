"use client";

import { useEffect, useState } from "react";

export default function PartnerTebrikEkrani({
  partnerId,
  firmaAdi,
}: {
  partnerId: string;
  firmaAdi: string;
}) {
  const STORAGE_KEY = `partner-tebrik-gosterildi-${partnerId}`;
  const [goster, setGoster] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setGoster(true);
    }
  }, [STORAGE_KEY]);

  function paneleGec() {
    localStorage.setItem(STORAGE_KEY, "1");
    setGoster(false);
  }

  if (!goster) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-2xl shadow-purple-100/60">
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-purple-600 to-pink-500" />

        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative px-8 pb-10 pt-10 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 text-4xl shadow-sm">
            🎉
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-purple-600/70">
            Partner Programı
          </p>

          <h1 className="mt-3 text-2xl font-black text-gray-900 sm:text-3xl">
            Tebrikler, onaylandınız!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            <strong className="font-black text-gray-800">{firmaAdi}</strong> artık resmi bir DavetRota
            partneri. Paneli keşfetmeye başlayabilirsiniz.
          </p>

          {/* Checklist items */}
          <div className="mt-6 space-y-2 text-left">
            {[
              "Marka görünümünüzü özelleştirin",
              "İlk aktivasyon linkini oluşturun",
              "Müşterilerinizi CRM'e ekleyin",
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white">
                  ✓
                </span>
                <p className="text-sm font-semibold text-gray-600">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={paneleGec}
            className="mt-8 w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-black text-white shadow-sm shadow-purple-200 transition-opacity hover:opacity-90"
          >
            Partner Paneline Geç →
          </button>

          <p className="mt-4 text-[11px] text-gray-400">
            Sorularınız için{" "}
            <a href="mailto:destek@davetrota.com" className="text-purple-500 hover:underline">
              destek@davetrota.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

type FotoSatir = {
  id: string;
  yukleyenAd: string;
  dosyaUrl: string;
  onaylandi: boolean;
  createdAt: string;
};

type AniSatir = {
  id: string;
  yazarAd: string;
  icerik: string;
  onaylandi: boolean;
  createdAt: string;
};

/* ── Fotoğraf satırı ── */
export function FotoSatirItem({
  foto,
  slug,
  renk,
}: {
  foto: FotoSatir;
  slug: string;
  renk: string;
}) {
  const [durum, setDurum] = useState<"idle" | "loading" | "silindi">("idle");
  const [onaylandi, setOnaylandi] = useState(foto.onaylandi);

  async function onayla() {
    setDurum("loading");
    await fetch(`/api/dashboard/davetiye/${slug}/album/${foto.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onaylandi: !onaylandi }),
    });
    setOnaylandi((p) => !p);
    setDurum("idle");
  }

  async function sil() {
    if (!confirm("Bu fotoğrafı silmek istediğine emin misin?")) return;
    setDurum("loading");
    await fetch(`/api/dashboard/davetiye/${slug}/album/${foto.id}`, {
      method: "DELETE",
    });
    setDurum("silindi");
  }

  if (durum === "silindi") return null;

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
        <Image src={foto.dosyaUrl} alt={foto.yukleyenAd} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: renk + "18", color: renk }}
          >
            {foto.yukleyenAd[0]?.toUpperCase()}
          </div>
          <span className="font-semibold text-gray-800 text-sm">{foto.yukleyenAd}</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              onaylandi ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            {onaylandi ? "Onaylı" : "Beklemede"}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          {new Intl.DateTimeFormat("tr-TR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(foto.createdAt))}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onayla}
          disabled={durum === "loading"}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
            onaylandi
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
              : "text-white hover:opacity-90"
          }`}
          style={!onaylandi ? { backgroundColor: renk } : {}}
        >
          {onaylandi ? "Geri Al" : "Onayla"}
        </button>
        <button
          onClick={sil}
          disabled={durum === "loading"}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
        >
          Sil
        </button>
      </div>
    </div>
  );
}

/* ── Anı satırı ── */
export function AniSatirItem({
  ani,
  slug,
  renk,
}: {
  ani: AniSatir;
  slug: string;
  renk: string;
}) {
  const [durum, setDurum] = useState<"idle" | "loading" | "silindi">("idle");
  const [onaylandi, setOnaylandi] = useState(ani.onaylandi);

  async function onayla() {
    setDurum("loading");
    await fetch(`/api/dashboard/davetiye/${slug}/ani/${ani.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onaylandi: !onaylandi }),
    });
    setOnaylandi((p) => !p);
    setDurum("idle");
  }

  async function sil() {
    if (!confirm("Bu anıyı silmek istediğine emin misin?")) return;
    setDurum("loading");
    await fetch(`/api/dashboard/davetiye/${slug}/ani/${ani.id}`, {
      method: "DELETE",
    });
    setDurum("silindi");
  }

  if (durum === "silindi") return null;

  return (
    <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: renk + "18", color: renk }}
        >
          {ani.yazarAd[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 text-sm">{ani.yazarAd}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                onaylandi ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {onaylandi ? "Onaylı" : "Beklemede"}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {new Intl.DateTimeFormat("tr-TR", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(ani.createdAt))}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onayla}
            disabled={durum === "loading"}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
              onaylandi
                ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                : "text-white hover:opacity-90"
            }`}
            style={!onaylandi ? { backgroundColor: renk } : {}}
          >
            {onaylandi ? "Geri Al" : "Onayla"}
          </button>
          <button
            onClick={sil}
            disabled={durum === "loading"}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
          >
            Sil
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
        {ani.icerik}
      </p>
    </div>
  );
}

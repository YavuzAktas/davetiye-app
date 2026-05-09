"use client";

import { useState } from "react";
import Image from "next/image";

type FotoItem = {
  id: string;
  yukleyenAd: string;
  dosyaUrl: string;
  onaylandi: boolean;
  createdAt: string;
};

type AniItem = {
  id: string;
  yazarAd: string;
  icerik: string;
  onaylandi: boolean;
  createdAt: string;
};

/* ────────────────────────────────────────────────── */
/* Fotoğraf Listesi                                   */
/* ────────────────────────────────────────────────── */
export function FotoListesi({
  baslangic,
  slug,
  renk,
}: {
  baslangic: FotoItem[];
  slug: string;
  renk: string;
}) {
  const [liste, setListe] = useState<FotoItem[]>(baslangic);
  const [lightbox, setLightbox] = useState<FotoItem | null>(null);

  const bekleyen = liste.filter((f) => !f.onaylandi);
  const onaylanan = liste.filter((f) => f.onaylandi);

  async function toggle(id: string, simdikiDurum: boolean) {
    const res = await fetch(`/api/dashboard/davetiye/${slug}/album/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onaylandi: !simdikiDurum }),
    });
    if (res.ok) {
      setListe((prev) =>
        prev.map((f) => (f.id === id ? { ...f, onaylandi: !simdikiDurum } : f))
      );
    }
  }

  async function sil(id: string) {
    if (!confirm("Bu fotoğrafı silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/dashboard/davetiye/${slug}/album/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setListe((prev) => prev.filter((f) => f.id !== id));
  }

  if (liste.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🖼️</div>
        <p className="text-gray-500 text-sm font-medium">Henüz fotoğraf yok</p>
        <p className="text-gray-300 text-xs mt-1">Misafirler davetiye sayfasından fotoğraf yükleyebilir</p>
      </div>
    );
  }

  return (
    <>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors"
          >
            ×
          </button>
          <div
            className="relative max-w-[95vw] max-h-[85dvh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.dosyaUrl}
              alt={lightbox.yukleyenAd}
              fill
              className="object-contain"
              sizes="95vw"
            />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white/80 text-sm font-medium">{lightbox.yukleyenAd}</p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {bekleyen.length > 0 && (
          <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase px-1">
            Onay Bekleyenler
          </p>
        )}
        {bekleyen.map((foto) => (
          <FotoKart
            key={foto.id}
            foto={foto}
            renk={renk}
            onToggle={() => toggle(foto.id, foto.onaylandi)}
            onSil={() => sil(foto.id)}
            onLightbox={() => setLightbox(foto)}
          />
        ))}

        {onaylanan.length > 0 && (
          <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase px-1 pt-2">
            Onaylananlar
          </p>
        )}
        {onaylanan.map((foto) => (
          <FotoKart
            key={foto.id}
            foto={foto}
            renk={renk}
            onToggle={() => toggle(foto.id, foto.onaylandi)}
            onSil={() => sil(foto.id)}
            onLightbox={() => setLightbox(foto)}
          />
        ))}
      </div>
    </>
  );
}

function FotoKart({
  foto,
  renk,
  onToggle,
  onSil,
  onLightbox,
}: {
  foto: FotoItem;
  renk: string;
  onToggle: () => void;
  onSil: () => void;
  onLightbox: () => void;
}) {
  const [yukleniyor, setYukleniyor] = useState(false);

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
      <div
        className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 cursor-zoom-in"
        onClick={onLightbox}
      >
        <Image
          src={foto.dosyaUrl}
          alt={foto.yukleyenAd}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
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
              foto.onaylandi ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            {foto.onaylandi ? "Onaylı" : "Beklemede"}
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
          onClick={async () => { setYukleniyor(true); await onToggle(); setYukleniyor(false); }}
          disabled={yukleniyor}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 ${
            foto.onaylandi ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "text-white hover:opacity-90"
          }`}
          style={!foto.onaylandi ? { backgroundColor: renk } : {}}
        >
          {yukleniyor ? "..." : foto.onaylandi ? "Geri Al" : "Onayla"}
        </button>
        <button
          onClick={onSil}
          disabled={yukleniyor}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
        >
          Sil
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────── */
/* Anı Listesi                                        */
/* ────────────────────────────────────────────────── */
export function AniListesi({
  baslangic,
  slug,
  renk,
}: {
  baslangic: AniItem[];
  slug: string;
  renk: string;
}) {
  const [liste, setListe] = useState<AniItem[]>(baslangic);

  const bekleyen = liste.filter((a) => !a.onaylandi);
  const onaylanan = liste.filter((a) => a.onaylandi);

  async function toggle(id: string, simdikiDurum: boolean) {
    const res = await fetch(`/api/dashboard/davetiye/${slug}/ani/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onaylandi: !simdikiDurum }),
    });
    if (res.ok) {
      setListe((prev) =>
        prev.map((a) => (a.id === id ? { ...a, onaylandi: !simdikiDurum } : a))
      );
    }
  }

  async function sil(id: string) {
    if (!confirm("Bu anıyı silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/dashboard/davetiye/${slug}/ani/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setListe((prev) => prev.filter((a) => a.id !== id));
  }

  if (liste.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">📖</div>
        <p className="text-gray-500 text-sm font-medium">Henüz anı yok</p>
        <p className="text-gray-300 text-xs mt-1">Misafirler davetiye sayfasından anı bırakabilir</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
      {bekleyen.length > 0 && (
        <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase px-1">
          Onay Bekleyenler
        </p>
      )}
      {bekleyen.map((ani) => (
        <AniKart
          key={ani.id}
          ani={ani}
          renk={renk}
          onToggle={() => toggle(ani.id, ani.onaylandi)}
          onSil={() => sil(ani.id)}
        />
      ))}

      {onaylanan.length > 0 && (
        <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase px-1 pt-2">
          Onaylananlar
        </p>
      )}
      {onaylanan.map((ani) => (
        <AniKart
          key={ani.id}
          ani={ani}
          renk={renk}
          onToggle={() => toggle(ani.id, ani.onaylandi)}
          onSil={() => sil(ani.id)}
        />
      ))}
    </div>
  );
}

function AniKart({
  ani,
  renk,
  onToggle,
  onSil,
}: {
  ani: AniItem;
  renk: string;
  onToggle: () => void;
  onSil: () => void;
}) {
  const [yukleniyor, setYukleniyor] = useState(false);

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
                ani.onaylandi ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {ani.onaylandi ? "Onaylı" : "Beklemede"}
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
            onClick={async () => { setYukleniyor(true); await onToggle(); setYukleniyor(false); }}
            disabled={yukleniyor}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 ${
              ani.onaylandi ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "text-white hover:opacity-90"
            }`}
            style={!ani.onaylandi ? { backgroundColor: renk } : {}}
          >
            {yukleniyor ? "..." : ani.onaylandi ? "Geri Al" : "Onayla"}
          </button>
          <button
            onClick={onSil}
            disabled={yukleniyor}
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

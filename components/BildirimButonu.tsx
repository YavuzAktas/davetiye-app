"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type Bildirim = {
  id: string;
  tip: string;
  baslik: string;
  mesaj: string;
  okundu: boolean;
  davetiyeSlug: string | null;
  createdAt: string;
};

const TIP_ICON: Record<string, string> = {
  rsvp:  "✅",
  album: "📸",
  ani:   "💌",
};

export default function BildirimButonu({ mediaQuery }: { mediaQuery?: string }) {
  const [okunmamis, setOkunmamis] = useState(0);
  const [bildirimler, setBildirimler] = useState<Bildirim[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [acik, setAcik] = useState(false);
  const [aktifGorunum, setAktifGorunum] = useState(!mediaQuery);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mediaQuery) return;
    const sorgu = window.matchMedia(mediaQuery);
    const guncelle = () => setAktifGorunum(sorgu.matches);
    guncelle();
    sorgu.addEventListener("change", guncelle);
    return () => sorgu.removeEventListener("change", guncelle);
  }, [mediaQuery]);

  const sayacCek = useCallback(async () => {
    try {
      const res = await fetch("/api/bildirimler?mod=sayac", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setOkunmamis(json.okunmamis);
    } catch { /* sessizce geç */ }
  }, []);

  const listeCek = useCallback(async () => {
    try {
      const res = await fetch("/api/bildirimler", { cache: "no-store" });
      if (!res.ok) return 0;
      const json = await res.json();
      setOkunmamis(json.okunmamis);
      setBildirimler(json.bildirimler);
      return Number(json.okunmamis) || 0;
    } catch {
      return 0;
    }
  }, []);

  /* Görünür butonda ilk yükleme + 60 saniyede bir hafif sayaç polling */
  useEffect(() => {
    if (!aktifGorunum) return;
    sayacCek();
    const t = setInterval(() => {
      if (document.visibilityState === "visible") sayacCek();
    }, 60_000);
    return () => clearInterval(t);
  }, [aktifGorunum, sayacCek]);

  /* Panel açılınca okundu işaretle */
  async function toggle() {
    const yeniAcik = !acik;
    setAcik(yeniAcik);
    if (!yeniAcik) return;

    // Önceki veri yoksa skeleton göster, varsa anında göster (stale-while-revalidate)
    if (bildirimler.length === 0) setYukleniyor(true);

    const guncelOkunmamis = await listeCek();
    setYukleniyor(false);

    if (guncelOkunmamis > 0) {
      setOkunmamis(0);
      setBildirimler(prev => prev.map(b => ({ ...b, okundu: true })));
      await fetch("/api/bildirimler", { method: "PATCH" });
    }
  }

  /* Dışına tıklayınca kapat */
  useEffect(() => {
    function dısarı(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    }
    if (acik) document.addEventListener("mousedown", dısarı);
    return () => document.removeEventListener("mousedown", dısarı);
  }, [acik]);

  /* ESC ile kapat */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setAcik(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Zil butonu */}
      <button
        onClick={toggle}
        aria-label="Bildirimler"
        className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {okunmamis > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
            {okunmamis > 99 ? "99+" : okunmamis}
          </span>
        )}
      </button>

      {/* Dropdown paneli */}
      {acik && (
        <div className="absolute right-0 top-11 w-80 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Başlık */}
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">Bildirimler</p>
            {bildirimler.length > 0 && (
              <button
                onClick={async () => {
                  setBildirimler([]);
                  setOkunmamis(0);
                  await fetch("/api/bildirimler", { method: "DELETE" });
                }}
                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
              >
                Tümünü sil
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-80 overflow-y-auto">
            {yukleniyor ? (
              <div className="p-3 space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3 px-1 py-2 animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2 pt-0.5">
                      <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : bildirimler.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-sm text-gray-400">Henüz bildirim yok</p>
              </div>
            ) : (
              bildirimler.map((b) => (
                <BildirimSatiri
                  key={b.id}
                  b={b}
                  onTikla={() => setAcik(false)}
                  onSil={async () => {
                    setBildirimler(prev => prev.filter(x => x.id !== b.id));
                    if (!b.okundu) setOkunmamis(prev => Math.max(0, prev - 1));
                    await fetch(`/api/bildirimler?id=${b.id}`, { method: "DELETE" });
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BildirimSatiri({ b, onTikla, onSil }: { b: Bildirim; onTikla: () => void; onSil: () => void }) {
  const icon = TIP_ICON[b.tip] ?? "🔔";
  const zaman = new Intl.RelativeTimeFormat("tr", { numeric: "auto" });

  function goreli(tarih: string) {
    const fark = (new Date(tarih).getTime() - Date.now()) / 1000;
    if (Math.abs(fark) < 60)  return "az önce";
    if (Math.abs(fark) < 3600) return zaman.format(Math.round(fark / 60), "minute");
    if (Math.abs(fark) < 86400) return zaman.format(Math.round(fark / 3600), "hour");
    return zaman.format(Math.round(fark / 86400), "day");
  }

  const icerik = b.davetiyeSlug
    ? (b.tip === "album"
        ? `/dashboard/davetiye/${b.davetiyeSlug}/album`
        : b.tip === "ani"
        ? `/dashboard/davetiye/${b.davetiyeSlug}/album`
        : `/dashboard/davetiye/${b.davetiyeSlug}`)
    : "/dashboard";

  return (
    <div className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 group ${!b.okundu ? "bg-purple-50/40" : ""}`}>
      <Link href={icerik} onClick={onTikla} className="flex items-start gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-base shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-snug ${!b.okundu ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
            {b.baslik}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{b.mesaj}</p>
          <p className="text-[10px] text-gray-300 mt-1">{goreli(b.createdAt)}</p>
        </div>
      </Link>
      <button
        onClick={(e) => { e.stopPropagation(); onSil(); }}
        className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"
        aria-label="Sil"
      >
        ×
      </button>
    </div>
  );
}

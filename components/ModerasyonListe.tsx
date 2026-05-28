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

type SesliAniItem = {
  id: string;
  adSoyad: string;
  dosyaUrl: string;
  sure: number;
  onaylandi: boolean;
  createdAt: string;
};

/* ────────────────────────────────────────────────── */
/* Ana sarmalayıcı — stat kartlar + her iki liste     */
/* ────────────────────────────────────────────────── */
export function ModerasyonIcerik({
  baslangicFotolar,
  baslangicAnilar,
  baslangicSesliAnilar = [],
  sesliAniAktif = false,
  slug,
  renk,
}: {
  baslangicFotolar: FotoItem[];
  baslangicAnilar: AniItem[];
  baslangicSesliAnilar?: SesliAniItem[];
  sesliAniAktif?: boolean;
  slug: string;
  renk: string;
}) {
  const [fotolar, setFotolar]         = useState<FotoItem[]>(baslangicFotolar);
  const [anilar, setAnilar]           = useState<AniItem[]>(baslangicAnilar);
  const [sesliAnilar, setSesliAnilar] = useState<SesliAniItem[]>(baslangicSesliAnilar);

  const bekleyenFoto    = fotolar.filter((f) => !f.onaylandi);
  const onaylananFoto   = fotolar.filter((f) => f.onaylandi);
  const bekleyenAni     = anilar.filter((a) => !a.onaylandi);
  const onaylananAni    = anilar.filter((a) => a.onaylandi);
  const bekleyenSesli   = sesliAnilar.filter((s) => !s.onaylandi);

  const toplamBekleyen = bekleyenFoto.length + bekleyenAni.length + bekleyenSesli.length;

  return (
    <div className="space-y-6">
      {/* Stat kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Bekleyen Fotoğraf", value: bekleyenFoto.length,  icon: "🕐", sub: "onay bekliyor" },
          { label: "Onaylı Fotoğraf",   value: onaylananFoto.length, icon: "✅", sub: "albümde görünür" },
          { label: "Bekleyen Anı",      value: bekleyenAni.length,   icon: "🕐", sub: "onay bekliyor" },
          { label: "Onaylı Anı",        value: onaylananAni.length,  icon: "💬", sub: "herkese açık" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ backgroundColor: renk + "20", transform: "translate(40%, -40%)" }}
            />
            <div className="text-2xl mb-3">{stat.icon}</div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">{stat.value}</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {toplamBekleyen > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
          <span className="text-xl">🔔</span>
          <p className="text-sm font-semibold text-amber-700">{toplamBekleyen} içerik onay bekliyor</p>
        </div>
      )}

      {/* Listeler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fotoğraflar */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Fotoğraflar</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-gray-900">{fotolar.length} toplam</span>
              {bekleyenFoto.length > 0 && (
                <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                  {bekleyenFoto.length} beklemede
                </span>
              )}
            </div>
          </div>
          <FotoListesi liste={fotolar} setListe={setFotolar} slug={slug} renk={renk} />
        </div>

        {/* Anı Defteri */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Anı Defteri</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-gray-900">{anilar.length} toplam</span>
              {bekleyenAni.length > 0 && (
                <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                  {bekleyenAni.length} beklemede
                </span>
              )}
            </div>
          </div>
          <AniListesi liste={anilar} setListe={setAnilar} slug={slug} renk={renk} />
        </div>

        {/* Sesli Anılar — özellik aktifse her zaman göster */}
        {(sesliAniAktif || sesliAnilar.length > 0) && (
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden lg:col-span-2">
            <div className="px-6 pt-6 pb-4 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Sesli Anılar</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-gray-900">{sesliAnilar.length} toplam</span>
                {bekleyenSesli.length > 0 && (
                  <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                    {bekleyenSesli.length} beklemede
                  </span>
                )}
              </div>
            </div>
            <SesliAniListesi liste={sesliAnilar} setListe={setSesliAnilar} slug={slug} renk={renk} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────── */
/* Fotoğraf Listesi                                   */
/* ────────────────────────────────────────────────── */
function FotoListesi({
  liste,
  setListe,
  slug,
  renk,
}: {
  liste: FotoItem[];
  setListe: React.Dispatch<React.SetStateAction<FotoItem[]>>;
  slug: string;
  renk: string;
}) {
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
    const res = await fetch(`/api/dashboard/davetiye/${slug}/album/${id}`, { method: "DELETE" });
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
          <div className="relative max-w-[95vw] max-h-[85dvh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox.dosyaUrl} alt={lightbox.yukleyenAd} fill className="object-contain" sizes="95vw" />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white/80 text-sm font-medium">{lightbox.yukleyenAd}</p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3 max-h-150 overflow-y-auto">
        {bekleyen.length > 0 && (
          <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase px-1">Onay Bekleyenler</p>
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
          <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase px-1 pt-2">Onaylananlar</p>
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
  foto, renk, onToggle, onSil, onLightbox,
}: {
  foto: FotoItem; renk: string;
  onToggle: () => void; onSil: () => void; onLightbox: () => void;
}) {
  const [yukleniyor, setYukleniyor] = useState(false);
  return (
    <div className="p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
      {/* Üst: thumbnail + bilgi */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 cursor-zoom-in" onClick={onLightbox}>
          <Image src={foto.dosyaUrl} alt={foto.yukleyenAd} fill className="object-cover hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: renk + "18", color: renk }}>
              {foto.yukleyenAd[0]?.toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800 text-sm truncate">{foto.yukleyenAd}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${foto.onaylandi ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
              {foto.onaylandi ? "Onaylı" : "Beklemede"}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(foto.createdAt))}
          </p>
        </div>
      </div>
      {/* Alt: butonlar — tam genişlik */}
      <div className="flex gap-2">
        <button
          onClick={async () => { setYukleniyor(true); await onToggle(); setYukleniyor(false); }}
          disabled={yukleniyor}
          className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all disabled:opacity-50 ${foto.onaylandi ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "text-white hover:opacity-90"}`}
          style={!foto.onaylandi ? { backgroundColor: renk } : {}}
        >
          {yukleniyor ? "..." : foto.onaylandi ? "Geri Al" : "Onayla"}
        </button>
        <button onClick={onSil} disabled={yukleniyor} className="flex-1 text-xs font-semibold py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
          Sil
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────── */
/* Anı Listesi                                        */
/* ────────────────────────────────────────────────── */
function AniListesi({
  liste,
  setListe,
  slug,
  renk,
}: {
  liste: AniItem[];
  setListe: React.Dispatch<React.SetStateAction<AniItem[]>>;
  slug: string;
  renk: string;
}) {
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
    const res = await fetch(`/api/dashboard/davetiye/${slug}/ani/${id}`, { method: "DELETE" });
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
    <div className="p-4 space-y-3 max-h-150 overflow-y-auto">
      {bekleyen.length > 0 && (
        <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase px-1">Onay Bekleyenler</p>
      )}
      {bekleyen.map((ani) => (
        <AniKart key={ani.id} ani={ani} renk={renk} onToggle={() => toggle(ani.id, ani.onaylandi)} onSil={() => sil(ani.id)} />
      ))}

      {onaylanan.length > 0 && (
        <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase px-1 pt-2">Onaylananlar</p>
      )}
      {onaylanan.map((ani) => (
        <AniKart key={ani.id} ani={ani} renk={renk} onToggle={() => toggle(ani.id, ani.onaylandi)} onSil={() => sil(ani.id)} />
      ))}
    </div>
  );
}

function AniKart({
  ani, renk, onToggle, onSil,
}: {
  ani: AniItem; renk: string; onToggle: () => void; onSil: () => void;
}) {
  const [yukleniyor, setYukleniyor] = useState(false);
  return (
    <div className="p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: renk + "18", color: renk }}>
          {ani.yazarAd[0]?.toUpperCase()}
        </div>
        <span className="font-semibold text-gray-800 text-sm truncate">{ani.yazarAd}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ani.onaylandi ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
          {ani.onaylandi ? "Onaylı" : "Beklemede"}
        </span>
        <span className="text-xs text-gray-400 ml-auto shrink-0">
          {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(ani.createdAt))}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3 mb-3">{ani.icerik}</p>
      <div className="flex gap-2">
        <button
          onClick={async () => { setYukleniyor(true); await onToggle(); setYukleniyor(false); }}
          disabled={yukleniyor}
          className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all disabled:opacity-50 ${ani.onaylandi ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "text-white hover:opacity-90"}`}
          style={!ani.onaylandi ? { backgroundColor: renk } : {}}
        >
          {yukleniyor ? "..." : ani.onaylandi ? "Geri Al" : "Onayla"}
        </button>
        <button onClick={onSil} disabled={yukleniyor} className="flex-1 text-xs font-semibold py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
          Sil
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────── */
/* Sesli Anı Listesi                                  */
/* ────────────────────────────────────────────────── */
function SesliAniListesi({
  liste,
  setListe,
  slug,
  renk,
}: {
  liste: SesliAniItem[];
  setListe: React.Dispatch<React.SetStateAction<SesliAniItem[]>>;
  slug: string;
  renk: string;
}) {
  const bekleyen  = liste.filter((s) => !s.onaylandi);
  const onaylanan = liste.filter((s) => s.onaylandi);

  async function toggle(id: string, simdikiDurum: boolean) {
    const res = await fetch(`/api/dashboard/davetiye/${slug}/sesli-ani/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onaylandi: !simdikiDurum }),
    });
    if (res.ok) setListe((prev) => prev.map((s) => (s.id === id ? { ...s, onaylandi: !simdikiDurum } : s)));
  }

  async function sil(id: string) {
    if (!confirm("Bu sesli anıyı silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/dashboard/davetiye/${slug}/sesli-ani/${id}`, { method: "DELETE" });
    if (res.ok) setListe((prev) => prev.filter((s) => s.id !== id));
  }

  if (liste.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🎙️</div>
        <p className="text-gray-500 text-sm font-medium">Henüz sesli anı yok</p>
        <p className="text-gray-300 text-xs mt-1">Misafirler davetiye sayfasından sesli anı bırakabilir</p>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-150 overflow-y-auto">
      {bekleyen.length > 0 && (
        <p className="text-[10px] font-bold text-amber-500 tracking-widest uppercase px-1 col-span-full">Onay Bekleyenler</p>
      )}
      {bekleyen.map((s) => (
        <SesliAniKart key={s.id} ani={s} renk={renk} onToggle={() => toggle(s.id, s.onaylandi)} onSil={() => sil(s.id)} />
      ))}
      {onaylanan.length > 0 && (
        <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase px-1 pt-2 col-span-full">Onaylananlar</p>
      )}
      {onaylanan.map((s) => (
        <SesliAniKart key={s.id} ani={s} renk={renk} onToggle={() => toggle(s.id, s.onaylandi)} onSil={() => sil(s.id)} />
      ))}
    </div>
  );
}

function SesliAniKart({
  ani, renk, onToggle, onSil,
}: {
  ani: SesliAniItem; renk: string; onToggle: () => void; onSil: () => void;
}) {
  const [yukleniyor, setYukleniyor] = useState(false);
  return (
    <div className="p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors bg-white">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: renk + "18", color: renk }}>
          {ani.adSoyad[0]?.toUpperCase()}
        </div>
        <span className="font-semibold text-gray-800 text-sm truncate flex-1">{ani.adSoyad}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ani.onaylandi ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
          {ani.onaylandi ? "Onaylı" : "Beklemede"}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <audio src={ani.dosyaUrl} controls className="flex-1 rounded-lg" style={{ height: 36 }} />
        <span className="text-xs text-gray-400 shrink-0">{ani.sure}s</span>
      </div>
      <p className="text-[10px] text-gray-400 mb-3">
        {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(ani.createdAt))}
      </p>
      <div className="flex gap-2">
        <button
          onClick={async () => { setYukleniyor(true); await onToggle(); setYukleniyor(false); }}
          disabled={yukleniyor}
          className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all disabled:opacity-50 ${ani.onaylandi ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "text-white hover:opacity-90"}`}
          style={!ani.onaylandi ? { backgroundColor: renk } : {}}
        >
          {yukleniyor ? "..." : ani.onaylandi ? "Geri Al" : "Onayla"}
        </button>
        <button onClick={onSil} disabled={yukleniyor} className="flex-1 text-xs font-semibold py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
          Sil
        </button>
      </div>
    </div>
  );
}

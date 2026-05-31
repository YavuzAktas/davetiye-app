"use client";

import { useState } from "react";

type Erisim = {
  id: string;
  rol: string;
  rolEtiketi: string;
  etiket: string | null;
  aktif: boolean;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

function tarih(t: string | null) {
  if (!t) return "-";
  return new Date(t).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export default function PersonelErisimPaneli({
  slug,
  baslangicErisimler,
}: {
  slug: string;
  baslangicErisimler: Erisim[];
}) {
  const [erisimler, setErisimler] = useState(baslangicErisimler);
  const [etiket, setEtiket] = useState("");
  const [gun, setGun] = useState(2);
  const [link, setLink] = useState("");
  const [hata, setHata] = useState("");
  const [kopyalandi, setKopyalandi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  const olustur = async () => {
    setYukleniyor(true);
    setHata("");
    setLink("");
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/personel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: "check-in", etiket, gun }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata || "Personel linki oluşturulamadı.");
      setLink(data.link);
      setErisimler(prev => [data.erisim, ...prev]);
      setEtiket("");
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Personel linki oluşturulamadı.");
    } finally {
      setYukleniyor(false);
    }
  };

  const iptalEt = async (id: string) => {
    setHata("");
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/personel/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Personel erişimi iptal edilemedi.");
      setErisimler(prev => prev.map(e => e.id === id ? { ...e, aktif: false, revokedAt: new Date().toISOString() } : e));
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Personel erişimi iptal edilemedi.");
    }
  };

  const kopyala = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">Personel Modu</p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">Sınırlı check-in erişimi oluştur</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Giriş ekibine sadece QR okutma yetkisi verin. Bu linkle davetli listesi, RSVP ekranı, ödeme veya davetiye ayarları açılmaz.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xs font-bold text-amber-800">Hukuki güvenlik</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Linki yalnızca görevli personele gönderin. Etkinlik sonrası iptal edin. Personel okutulan QR sonucunda yalnızca ilgili davetli adını görür.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
          <label className="block">
            <span className="text-xs font-bold text-gray-500">Erişim etiketi</span>
            <input
              value={etiket}
              onChange={e => setEtiket(e.target.value)}
              maxLength={80}
              placeholder="Örn. Kapı ekibi / Salon A"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-500">Süre</span>
            <select
              value={gun}
              onChange={e => setGun(Number(e.target.value))}
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            >
              <option value={1}>1 gün</option>
              <option value={2}>2 gün</option>
              <option value={3}>3 gün</option>
              <option value={7}>7 gün</option>
              <option value={14}>14 gün</option>
            </select>
          </label>
          <button
            type="button"
            onClick={olustur}
            disabled={yukleniyor}
            className="self-end rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
          >
            {yukleniyor ? "Oluşturuluyor..." : "Link Oluştur"}
          </button>
        </div>

        {link && (
          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-black text-emerald-900">Personel linki hazır</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-700">
              Bu link yalnızca şimdi gösterilir. Kaybetmeniz halinde yeni link oluşturun.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <div className="min-w-0 flex-1 truncate rounded-xl bg-white px-3 py-2 font-mono text-xs text-emerald-800">
                {link}
              </div>
              <button
                type="button"
                onClick={kopyala}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white"
              >
                {kopyalandi ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>
          </div>
        )}

        {hata && (
          <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {hata}
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Erişimler</p>
            <h2 className="mt-1 text-xl font-black text-gray-950">Personel linkleri</h2>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
            {erisimler.filter(e => e.aktif && !e.revokedAt).length} aktif
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {erisimler.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-8 text-center">
              <p className="text-sm font-semibold text-gray-700">Henüz personel linki yok</p>
              <p className="mt-1 text-xs text-gray-400">Etkinlik günü giriş ekibi için ilk linki oluşturun.</p>
            </div>
          )}

          {erisimler.map(erisim => {
            const aktif = erisim.aktif && !erisim.revokedAt && (!erisim.expiresAt || new Date(erisim.expiresAt) > new Date());
            return (
              <div key={erisim.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                        aktif ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"
                      }`}>
                        {aktif ? "Aktif" : "Kapalı"}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-gray-500">
                        {erisim.rolEtiketi}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-black text-gray-900">{erisim.etiket || "Etkinlik personeli"}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      Oluşturma: {tarih(erisim.createdAt)} · Bitiş: {tarih(erisim.expiresAt)} · Son kullanım: {tarih(erisim.lastUsedAt)}
                    </p>
                  </div>

                  {aktif && (
                    <button
                      type="button"
                      onClick={() => iptalEt(erisim.id)}
                      className="rounded-xl border border-red-100 bg-white px-4 py-2.5 text-xs font-black text-red-600 transition-colors hover:bg-red-50"
                    >
                      İptal Et
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

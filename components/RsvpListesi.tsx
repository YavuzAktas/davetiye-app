"use client";

import { useState } from "react";

const DIYET_EMOJI: Record<string, string> = {
  vegan: "🌱", vejetaryen: "🥗", glutensiz: "🌾", laktozsuz: "🥛",
};

type RsvpItem = {
  id: string;
  ad: string;
  email: string | null;
  mesaj: string | null;
  katilim: boolean;
  kisiSayisi: number;
  diyet: string | null;
};

type YuklenenAlan = { id: string; alan: "katilim" | "kisi" } | null;
type Parlayan = { id: string; tur: "yesil" | "kirmizi" } | null;

export default function RsvpListesi({
  baslangicRsvplar,
  slug,
  renk,
}: {
  baslangicRsvplar: RsvpItem[];
  slug: string;
  renk: string;
}) {
  const [rsvplar, setRsvplar] = useState<RsvpItem[]>(baslangicRsvplar);
  const [yukleniyor, setYukleniyor] = useState<YuklenenAlan>(null);
  const [parlayan, setParlayan] = useState<Parlayan>(null);

  const katilimlar = rsvplar.filter(r => r.katilim);
  const katilmayanlar = rsvplar.filter(r => !r.katilim);
  const katilimYuzde = rsvplar.length ? Math.round((katilimlar.length / rsvplar.length) * 100) : 0;

  const guncelle = async (
    id: string,
    alan: "katilim" | "kisi",
    veri: Record<string, unknown>,
    oncekiDeger: Partial<RsvpItem>,
    flashTur: "yesil" | "kirmizi",
  ) => {
    setYukleniyor({ id, alan });
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/rsvp/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(veri),
      });
      if (!res.ok) throw new Error();
      setParlayan({ id, tur: flashTur });
      setTimeout(() => setParlayan(null), 1200);
    } catch {
      setRsvplar(prev => prev.map(r => r.id === id ? { ...r, ...oncekiDeger } : r));
      setParlayan({ id, tur: "kirmizi" });
      setTimeout(() => setParlayan(null), 1200);
    } finally {
      setYukleniyor(null);
    }
  };

  const toggleKatilim = (rsvp: RsvpItem) => {
    const yeniDurum = !rsvp.katilim;
    setRsvplar(prev => prev.map(r => r.id === rsvp.id ? { ...r, katilim: yeniDurum } : r));
    guncelle(rsvp.id, "katilim", { katilim: yeniDurum }, { katilim: rsvp.katilim }, yeniDurum ? "yesil" : "kirmizi");
  };

  const kisiDegistir = (rsvp: RsvpItem, delta: number) => {
    const yeniSayi = Math.max(1, Math.min(20, rsvp.kisiSayisi + delta));
    if (yeniSayi === rsvp.kisiSayisi) return;
    setRsvplar(prev => prev.map(r => r.id === rsvp.id ? { ...r, kisiSayisi: yeniSayi } : r));
    guncelle(rsvp.id, "kisi", { kisiSayisi: yeniSayi }, { kisiSayisi: rsvp.kisiSayisi }, "yesil");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Katılım Bildirimleri</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-gray-900">{rsvplar.length} yanıt</span>
            {katilmayanlar.length > 0 && (
              <span className="text-xs text-gray-400">· {katilmayanlar.length} katılamıyor</span>
            )}
          </div>
        </div>
        {rsvplar.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${katilimYuzde}%`, backgroundColor: renk }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: renk }}>%{katilimYuzde}</span>
          </div>
        )}
      </div>

      {/* Liste */}
      {rsvplar.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📭</div>
          <p className="text-gray-500 text-sm font-medium">Henüz yanıt yok</p>
          <p className="text-gray-300 text-xs mt-1">Davetiyeyi paylaşınca bildirimler burada görünecek</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {rsvplar.map((rsvp) => {
            const satirYukleniyor = yukleniyor?.id === rsvp.id;
            const parlayanDurum = parlayan?.id === rsvp.id ? parlayan.tur : null;

            return (
              <div
                key={rsvp.id}
                className="px-4 sm:px-6 py-3.5 flex gap-3 transition-colors duration-500"
                style={{
                  backgroundColor: parlayanDurum === "yesil"
                    ? "#f0fdf4"
                    : parlayanDurum === "kirmizi"
                    ? "#fff1f2"
                    : undefined,
                }}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 transition-colors"
                  style={rsvp.katilim
                    ? { backgroundColor: renk + "18", color: renk }
                    : { backgroundColor: "#fef2f2", color: "#f87171" }
                  }
                >
                  {rsvp.ad[0]?.toUpperCase()}
                </div>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  {/* Üst: isim + katılım badge */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm truncate">{rsvp.ad}</p>
                    <button
                      onClick={() => !satirYukleniyor && toggleKatilim(rsvp)}
                      disabled={satirYukleniyor}
                      title="Tıkla — katılım durumunu değiştir"
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 transition-all disabled:opacity-60 ${
                        rsvp.katilim
                          ? "bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-500"
                          : "bg-red-50 text-red-500 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {satirYukleniyor && yukleniyor?.alan === "katilim"
                        ? "..."
                        : rsvp.katilim ? "✓ Katılıyor" : "✗ Katılmıyor"}
                    </button>
                  </div>

                  {/* Alt: ikincil bilgiler */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                    {rsvp.katilim && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => !satirYukleniyor && kisiDegistir(rsvp, -1)}
                          disabled={satirYukleniyor || rsvp.kisiSayisi <= 1}
                          className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="text-xs text-gray-500 font-medium tabular-nums w-11 text-center">
                          {satirYukleniyor && yukleniyor?.alan === "kisi"
                            ? "..."
                            : `${rsvp.kisiSayisi} kişi`}
                        </span>
                        <button
                          onClick={() => !satirYukleniyor && kisiDegistir(rsvp, 1)}
                          disabled={satirYukleniyor || rsvp.kisiSayisi >= 20}
                          className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    )}
                    {rsvp.katilim && rsvp.diyet && rsvp.diyet.split(",").map(d => (
                      <span key={d} className="text-[11px] bg-amber-50 border border-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-medium">
                        {DIYET_EMOJI[d] ?? "🍽️"} {d}
                      </span>
                    ))}
                    {rsvp.email && (
                      <span className="text-xs text-gray-400 truncate max-w-45">{rsvp.email}</span>
                    )}
                    {rsvp.mesaj && (
                      <span className="text-xs text-gray-400 italic truncate max-w-45">"{rsvp.mesaj}"</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

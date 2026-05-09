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
  const [degistiriliyor, setDegistiriliyor] = useState<string | null>(null);

  const katilimlar = rsvplar.filter(r => r.katilim);
  const katilmayanlar = rsvplar.filter(r => !r.katilim);
  const katilimYuzde = rsvplar.length ? Math.round((katilimlar.length / rsvplar.length) * 100) : 0;

  const toggleKatilim = async (rsvp: RsvpItem) => {
    setDegistiriliyor(rsvp.id);
    const yeniDurum = !rsvp.katilim;

    // Optimistik güncelleme
    setRsvplar(prev => prev.map(r => r.id === rsvp.id ? { ...r, katilim: yeniDurum } : r));

    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/rsvp/${rsvp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ katilim: yeniDurum }),
      });
      if (!res.ok) {
        // Geri al
        setRsvplar(prev => prev.map(r => r.id === rsvp.id ? { ...r, katilim: rsvp.katilim } : r));
      }
    } catch {
      setRsvplar(prev => prev.map(r => r.id === rsvp.id ? { ...r, katilim: rsvp.katilim } : r));
    } finally {
      setDegistiriliyor(null);
    }
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
            const yukleniyor = degistiriliyor === rsvp.id;
            return (
              <div key={rsvp.id} className="px-4 sm:px-6 py-3.5 flex gap-3 hover:bg-gray-50/50 transition-colors">
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
                  {/* Üst: isim + toggle badge */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm truncate">{rsvp.ad}</p>
                    <button
                      onClick={() => toggleKatilim(rsvp)}
                      disabled={yukleniyor}
                      title="Tıkla — katılım durumunu değiştir"
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 transition-all disabled:opacity-60 ${
                        rsvp.katilim
                          ? "bg-emerald-50 text-emerald-700 hover:bg-red-50 hover:text-red-500"
                          : "bg-red-50 text-red-500 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {yukleniyor ? "..." : rsvp.katilim ? "✓ Katılıyor" : "✗ Katılmıyor"}
                    </button>
                  </div>

                  {/* Alt: ikincil bilgiler */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    {rsvp.katilim && rsvp.kisiSayisi > 1 && (
                      <span className="text-xs text-gray-400 font-medium">{rsvp.kisiSayisi} kişi</span>
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

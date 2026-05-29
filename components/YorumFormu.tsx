"use client";

import { useState } from "react";

const ETKINLIK_TURLERI = ["Düğün", "Nişan", "Doğum Günü", "Sünnet", "Kına", "Mezuniyet", "Diğer"];

export default function YorumFormu({ onGonderildi }: { onGonderildi?: () => void }) {
  const [form, setForm] = useState({ ad: "", sehir: "", etkinlikTuru: "", yorum: "", puan: 5 });
  const [durum, setDurum] = useState<"idle" | "loading" | "ok" | "hata">("idle");
  const [hata, setHata] = useState("");

  const gonder = async () => {
    if (!form.ad || !form.etkinlikTuru || form.yorum.length < 20) {
      setHata("Lütfen tüm zorunlu alanları doldurun (yorum en az 20 karakter).");
      return;
    }
    setDurum("loading");
    setHata("");
    try {
      const r = await fetch("/api/yorum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) { const d = await r.json(); throw new Error(d.hata || "Hata"); }
      setDurum("ok");
      onGonderildi?.();
    } catch (e: unknown) {
      setHata(e instanceof Error ? e.message : "Bir hata oluştu");
      setDurum("hata");
    }
  };

  if (durum === "ok") {
    return (
      <div className="text-center py-6">
        <p className="text-4xl mb-3">🎉</p>
        <p className="font-semibold text-gray-800 mb-1">Teşekkürler!</p>
        <p className="text-sm text-gray-500">Yorumunuz incelendikten sonra yayına alınacak.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Adınız *</label>
          <input
            value={form.ad}
            onChange={e => setForm(p => ({ ...p, ad: e.target.value }))}
            placeholder="Ayşe K."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Şehir</label>
          <input
            value={form.sehir}
            onChange={e => setForm(p => ({ ...p, sehir: e.target.value }))}
            placeholder="İstanbul"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Etkinlik türü *</label>
        <div className="flex flex-wrap gap-2">
          {ETKINLIK_TURLERI.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setForm(p => ({ ...p, etkinlikTuru: t }))}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                form.etkinlikTuru === t
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-200 text-gray-500 hover:border-purple-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Puan</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, puan: p }))}
              className={`text-2xl transition-transform hover:scale-110 ${p <= form.puan ? "text-amber-400" : "text-gray-200"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">
          Deneyiminizi paylaşın * <span className="text-gray-400">({form.yorum.length}/500)</span>
        </label>
        <textarea
          value={form.yorum}
          onChange={e => setForm(p => ({ ...p, yorum: e.target.value.slice(0, 500) }))}
          placeholder="Davetiyemi çok beğendim çünkü..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
        />
      </div>

      {hata && <p className="text-xs text-red-500">{hata}</p>}

      <button
        onClick={gonder}
        disabled={durum === "loading"}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        {durum === "loading" ? "Gönderiliyor..." : "Yorumu Gönder"}
      </button>
      <p className="text-center text-xs text-gray-400">Yorumunuz yayına alınmadan önce incelenir.</p>
    </div>
  );
}

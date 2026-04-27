"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SABLONLAR } from "@/lib/sablonlar";

const FONTLAR = [
  { id: "font-sans", isim: "Modern", style: "system-ui" },
  { id: "font-serif", isim: "Klasik", style: "Georgia, serif" },
  { id: "font-mono", isim: "Teknik", style: "monospace" },
];

const RENKLER = [
  "#7C3AED", "#DB2777", "#0891B2", "#059669",
  "#D97706", "#DC2626", "#1D4ED8", "#111827",
];

function OlusturIcerigi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sablonId = searchParams.get("sablon") || "klasik-dugun";
  const sablon = SABLONLAR.find((s) => s.id === sablonId) || SABLONLAR[0];

  const [form, setForm] = useState({
    baslik: "",
    etkinlikTur: sablon.kategori,
    tarih: "",
    saat: "",
    mekan: "",
    mesaj: "",
    font: "font-sans",
    renk: sablon.renk,
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [aktifTab, setAktifTab] = useState<"icerik" | "tasarim">("icerik");

  const handleSubmit = async () => {
    if (!form.baslik || !form.tarih || !form.mekan) {
      setHata("Lütfen başlık, tarih ve mekan alanlarını doldurun.");
      return;
    }
    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch("/api/davetiye/olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sablon: sablonId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHata(data.hata || "Bir hata oluştu.");
        return;
      }
      router.push(`/davetiye/${data.slug}`);
    } catch {
      setHata("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  };

  const aktifFont =
    form.font === "font-serif" ? "Georgia, serif"
    : form.font === "font-mono" ? "monospace"
    : "system-ui";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Üst Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Davetiye Oluştur</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Şablon:{" "}
              <span className="font-medium text-purple-600">{sablon.isim}</span>
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={yukleniyor}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-sm shadow-purple-200"
          >
            {yukleniyor ? "Oluşturuluyor..." : "Davetiyemi Oluştur →"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Sol — Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              <div className="flex border-b border-gray-100">
                {[
                  { id: "icerik", isim: "İçerik", emoji: "✏️" },
                  { id: "tasarim", isim: "Tasarım", emoji: "🎨" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAktifTab(tab.id as "icerik" | "tasarim")}
                    className={`flex-1 py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      aktifTab === tab.id
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span>{tab.emoji}</span> {tab.isim}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {aktifTab === "icerik" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Davetiye Başlığı <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Ayşe & Mehmet'in Düğününe Davetlisiniz"
                        value={form.baslik}
                        onChange={(e) => setForm({ ...form, baslik: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Tarih <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.tarih}
                          onChange={(e) => setForm({ ...form, tarih: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Saat</label>
                        <input
                          type="time"
                          value={form.saat}
                          onChange={(e) => setForm({ ...form, saat: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mekan <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Çırağan Palace, İstanbul"
                        value={form.mekan}
                        onChange={(e) => setForm({ ...form, mekan: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      />
                      {form.mekan && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.mekan)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 mt-1.5 inline-flex items-center gap-1"
                        >
                          🗺️ Google Maps'te kontrol et
                        </a>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Davetiye Mesajı
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Misafirlerinize özel bir mesaj yazın..."
                        value={form.mesaj}
                        onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">{form.mesaj.length}/200 karakter</p>
                    </div>
                  </div>
                )}

                {aktifTab === "tasarim" && (
                  <div className="space-y-7">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tema Rengi
                      </label>
                      <div className="flex gap-2.5 flex-wrap mb-3">
                        {RENKLER.map((renk) => (
                          <button
                            key={renk}
                            onClick={() => setForm({ ...form, renk })}
                            className="w-10 h-10 rounded-full transition-all hover:scale-110 relative border-2"
                            style={{
                              backgroundColor: renk,
                              borderColor: form.renk === renk ? "white" : "transparent",
                              boxShadow: form.renk === renk ? `0 0 0 3px ${renk}` : "none",
                            }}
                          >
                            {form.renk === renk && (
                              <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <label className="text-xs text-gray-500 font-medium">Özel renk:</label>
                        <input
                          type="color"
                          value={form.renk}
                          onChange={(e) => setForm({ ...form, renk: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-xs font-mono text-gray-400">{form.renk}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Yazı Stili
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {FONTLAR.map((font) => (
                          <button
                            key={font.id}
                            onClick={() => setForm({ ...form, font: font.id })}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${
                              form.font === font.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                            }`}
                          >
                            <span
                              className="text-2xl block mb-1"
                              style={{ fontFamily: font.style }}
                            >
                              Aa
                            </span>
                            <span className="text-xs text-gray-500">{font.isim}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {hata && (
                  <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span>⚠️</span> {hata}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={yukleniyor}
                  className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 mt-6 shadow-sm shadow-purple-200"
                >
                  {yukleniyor ? "Oluşturuluyor..." : "Davetiyemi Oluştur"}
                </button>
              </div>
            </div>
          </div>

          {/* Sağ — Önizleme */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 text-center">
                Canlı Önizleme
              </p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: form.renk }} />
                <div className="p-6 bg-linear-to-b from-gray-50 to-white text-center">
                  <div className="text-3xl mb-2">
                    {sablon.kategori === "dugun" ? "💍"
                      : sablon.kategori === "nisan" ? "💑"
                      : sablon.kategori === "dogumgunu" ? "🎂"
                      : sablon.kategori === "sunnet" ? "⭐"
                      : sablon.kategori === "kina" ? "🌿"
                      : "🎉"}
                  </div>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: form.renk }}>
                    {sablon.isim}
                  </p>
                  <h2
                    className="text-lg font-bold text-gray-800 mb-1 leading-snug"
                    style={{ fontFamily: aktifFont }}
                  >
                    {form.baslik || "Davetiye Başlığı"}
                  </h2>
                  <div className="w-8 h-0.5 mx-auto my-3" style={{ backgroundColor: form.renk }} />

                  <div className="space-y-2 mb-4 text-left">
                    {form.tarih && (
                      <div className="bg-white rounded-xl p-2.5 flex items-center gap-2 border border-gray-100">
                        <span className="text-sm">📅</span>
                        <p className="text-xs text-gray-600">
                          {new Date(form.tarih).toLocaleDateString("tr-TR", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                          {form.saat && ` - ${form.saat}`}
                        </p>
                      </div>
                    )}
                    {form.mekan && (
                      <div className="bg-white rounded-xl p-2.5 flex items-center gap-2 border border-gray-100">
                        <span className="text-sm">📍</span>
                        <p className="text-xs text-gray-600 truncate">{form.mekan}</p>
                      </div>
                    )}
                    {form.mesaj && (
                      <div className="bg-white rounded-xl p-2.5 border border-gray-100">
                        <p className="text-xs text-gray-500 italic">"{form.mesaj}"</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className="py-2 rounded-xl text-center text-xs font-medium text-white"
                      style={{ backgroundColor: form.renk }}
                    >
                      ✓ Katılıyorum
                    </div>
                    <div className="py-2 rounded-xl text-center text-xs font-medium text-gray-500 bg-gray-100">
                      ✗ Katılamıyorum
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 border-t border-gray-50 text-center">
                  <p className="text-xs text-gray-300">davetim.com ile oluşturuldu</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OlusturSayfasi() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}>
      <OlusturIcerigi />
    </Suspense>
  );
}
"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SABLONLAR } from "@/lib/sablonlar";

const FONTLAR = [
  { id: "font-sans", isim: "Modern", ornek: "Aa" },
  { id: "font-serif", isim: "Klasik", ornek: "Aa" },
  { id: "font-mono", isim: "Teknik", ornek: "Aa" },
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Davetiyeni Oluştur</h1>
        <p className="text-gray-500 text-sm mt-1">
          Şablon: <span className="font-medium text-purple-600">{sablon.isim}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sol — Form */}
        <div>
          {/* Tab Seçimi */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setAktifTab("icerik")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                aktifTab === "icerik"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              İçerik
            </button>
            <button
              onClick={() => setAktifTab("tasarim")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                aktifTab === "tasarim"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tasarım
            </button>
          </div>

          {/* İçerik Tabı */}
          {aktifTab === "icerik" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Davetiye Başlığı *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Ayşe & Mehmet'in Düğününe Davetlisiniz"
                  value={form.baslik}
                  onChange={(e) => setForm({ ...form, baslik: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih *</label>
                  <input
                    type="date"
                    value={form.tarih}
                    onChange={(e) => setForm({ ...form, tarih: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                  <input
                    type="time"
                    value={form.saat}
                    onChange={(e) => setForm({ ...form, saat: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Mekan *</label>
  <input
    type="text"
    placeholder="Örn: Çırağan Palace, İstanbul"
    value={form.mekan}
    onChange={(e) => setForm({ ...form, mekan: e.target.value })}
    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  {form.mekan && (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.mekan)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-blue-500 mt-1 inline-block"
    >
      Google Maps'te kontrol et
    </a>
  )}
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Davetiye Mesajı
                </label>
                <textarea
                  rows={4}
                  placeholder="Misafirlerinize özel bir mesaj yazın..."
                  value={form.mesaj}
                  onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.mesaj.length}/200 karakter</p>
              </div>
            </div>
          )}

          {/* Tasarım Tabı */}
          {aktifTab === "tasarim" && (
            <div className="space-y-6">
              {/* Renk Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tema Rengi
                </label>
                <div className="flex gap-3 flex-wrap">
                  {RENKLER.map((renk) => (
                    <button
                      key={renk}
                      onClick={() => setForm({ ...form, renk })}
                      className="w-10 h-10 rounded-full transition-transform hover:scale-110 relative"
                      style={{ backgroundColor: renk }}
                    >
                      {form.renk === renk && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-lg">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <label className="text-xs text-gray-500">Özel renk:</label>
                  <input
                    type="color"
                    value={form.renk}
                    onChange={(e) => setForm({ ...form, renk: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  />
                  <span className="text-xs text-gray-400">{form.renk}</span>
                </div>
              </div>

              {/* Font Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Yazı Stili
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {FONTLAR.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setForm({ ...form, font: font.id })}
                      className={`p-4 rounded-xl border-2 text-center transition-colors ${
                        form.font === font.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <span
                        className={`text-2xl block mb-1 ${font.id}`}
                        style={{ fontFamily: font.id === "font-serif" ? "Georgia, serif" : font.id === "font-mono" ? "monospace" : "system-ui" }}
                      >
                        {font.ornek}
                      </span>
                      <span className="text-xs text-gray-500">{font.isim}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hata && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl mt-4">{hata}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={yukleniyor}
            className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 mt-6"
          >
            {yukleniyor ? "Oluşturuluyor..." : "Davetiyemi Oluştur"}
          </button>
        </div>

        {/* Sağ — Canlı Önizleme */}
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-gray-700 mb-3">Canlı Önizleme</p>
          <div
            className="rounded-2xl p-8 border border-gray-100 min-h-96 flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-50 to-white"
          >
            <div
              className="w-3 h-3 rounded-full mb-4"
              style={{ backgroundColor: form.renk }}
            />
            <div
              className="w-16 h-0.5 mb-4"
              style={{ backgroundColor: form.renk + "40" }}
            />
            <h2
              className="text-xl font-bold mb-2 text-gray-800"
              style={{
                fontFamily:
                  form.font === "font-serif"
                    ? "Georgia, serif"
                    : form.font === "font-mono"
                    ? "monospace"
                    : "system-ui",
              }}
            >
              {form.baslik || "Davetiye Başlığı"}
            </h2>
            {form.tarih && (
              <p className="text-gray-500 text-sm mb-1">
                {new Date(form.tarih).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {form.saat && ` - Saat ${form.saat}`}
              </p>
            )}
            {form.mekan && (
              <p className="text-gray-400 text-sm">📍 {form.mekan}</p>
            )}
            {form.mesaj && (
              <p className="text-gray-400 text-sm italic mt-3 max-w-xs">
                "{form.mesaj}"
              </p>
            )}
            <div className="mt-6 w-full max-w-xs">
              <div
                className="h-10 rounded-xl flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: form.renk }}
              >
                Katılıyorum
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
    <Suspense>
      <OlusturIcerigi />
    </Suspense>
  );
}
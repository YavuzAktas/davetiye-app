"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SABLONLAR } from "@/lib/sablonlar";

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
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Davetiyeni Oluştur
      </h1>
      <p className="text-gray-500 mb-10">
        Şablon:{" "}
        <span className="font-medium text-purple-600">{sablon.isim}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-5">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tarih *
              </label>
              <input
                type="date"
                value={form.tarih}
                onChange={(e) => setForm({ ...form, tarih: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saat
              </label>
              <input
                type="time"
                value={form.saat}
                onChange={(e) => setForm({ ...form, saat: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mekan *
            </label>
            <input
              type="text"
              placeholder="Örn: Çırağan Palace, İstanbul"
              value={form.mekan}
              onChange={(e) => setForm({ ...form, mekan: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
          </div>

          {hata && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">
              {hata}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={yukleniyor}
            className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {yukleniyor ? "Oluşturuluyor..." : "Davetiyemi Oluştur →"}
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Canlı Önizleme
          </p>
          <div
            className={`rounded-2xl bg-gradient-to-b ${sablon.arkaplan} p-8 border border-gray-100 min-h-64 flex flex-col items-center justify-center text-center`}
          >
            <div
              className="w-10 h-10 rounded-full mb-4"
              style={{ backgroundColor: sablon.renk }}
            />
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: sablon.yaziRengi }}
            >
              {form.baslik || "Davetiye Başlığı"}
            </h2>
            {form.tarih && (
              <p className="text-gray-500 text-sm mb-1">
                {new Date(form.tarih).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                {form.saat && `- Saat ${form.saat}`}
              </p>
            )}
            {form.mekan && (
              <p className="text-gray-500 text-sm mb-3">📍 {form.mekan}</p>
            )}
            {form.mesaj && (
              <p className="text-gray-400 text-sm italic mt-2 max-w-xs">
                &quot;{form.mesaj}&quot;
              </p>
            )}
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
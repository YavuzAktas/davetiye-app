"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SABLONLAR, KATEGORILER } from "@/lib/sablonlar";

export default function SablonlarSayfasi() {
  const [aktifKategori, setAktifKategori] = useState("hepsi");
  const router = useRouter();

  const filtrelenmis =
    aktifKategori === "hepsi"
      ? SABLONLAR
      : SABLONLAR.filter((s) => s.kategori === aktifKategori);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Şablonlar</h1>
      <p className="text-gray-500 mb-10">
        Davetiyeniz için bir şablon seçin, ardından özelleştirin.
      </p>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2 mb-10">
        {KATEGORILER.map((kat) => (
          <button
            key={kat.id}
            onClick={() => setAktifKategori(kat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              aktifKategori === kat.id
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {kat.isim}
          </button>
        ))}
      </div>

      {/* Şablon Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtrelenmis.map((sablon) => (
          <div
            key={sablon.id}
            className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
          >
            {/* Şablon Önizleme */}
            <div
              className={`h-48 bg-gradient-to-b ${sablon.arkaplan} flex flex-col items-center justify-center p-6 relative`}
            >
              <div
                className="w-8 h-8 rounded-full mb-3"
                style={{ backgroundColor: sablon.renk }}
              />
              <p
                className="text-lg font-semibold text-center"
                style={{ color: sablon.yaziRengi }}
              >
                Davetiye Başlığı
              </p>
              <p className="text-sm text-gray-400 mt-1">Tarih ve Mekan</p>
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
              >
                <span
                  className="text-white text-sm font-medium px-4 py-2 rounded-lg"
                  style={{ backgroundColor: sablon.renk }}
                >
                  Bu Şablonu Seç
                </span>
              </div>
            </div>

            {/* Şablon Bilgisi */}
            <div className="p-4">
              <p className="font-medium text-gray-800">{sablon.isim}</p>
              <p className="text-sm text-gray-400 capitalize mt-0.5">
                {KATEGORILER.find((k) => k.id === sablon.kategori)?.isim}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
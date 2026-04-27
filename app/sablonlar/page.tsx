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

  const emojiler: Record<string, string> = {
    dugun: "💍", nisan: "💑", dogumgunu: "🎂",
    sunnet: "⭐", kina: "🌿", kurumsal: "🎯", diger: "🎉",
  };

  const ornekTarihler: Record<string, string> = {
    dugun: "12 Eylül 2026, Cumartesi",
    nisan: "5 Haziran 2026, Cuma",
    dogumgunu: "20 Temmuz 2026, Pazartesi",
    sunnet: "15 Ağustos 2026, Cumartesi",
    kina: "11 Eylül 2026, Cuma",
    kurumsal: "1 Ekim 2026, Perşembe",
    diger: "25 Aralık 2026, Cuma",
  };

  const ornekBasliklar: Record<string, string> = {
    dugun: "Ayşe & Mehmet",
    nisan: "Fatma & Ali",
    dogumgunu: "Can'ın Doğum Günü",
    sunnet: "Ahmet'in Sünnet Töreni",
    kina: "Zeynep'in Kına Gecesi",
    kurumsal: "Yıl Sonu Etkinliği",
    diger: "Özel Davetiye",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Başlık */}
      <div className="bg-white border-b border-gray-100 px-4 py-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Şablonlar</h1>
          <p className="text-gray-500 text-lg">
            Davetiyeniz için bir şablon seçin, ardından özelleştirin.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Kategori Filtreleri */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {KATEGORILER.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setAktifKategori(kat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                aktifKategori === kat.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {kat.id === "hepsi" ? "Tümü" : kat.isim}
            </button>
          ))}
        </div>

        {/* Şablon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrelenmis.map((sablon) => (
            <div
              key={sablon.id}
              onClick={() => router.push(`/olustur?sablon=${sablon.id}`)}
              className="group cursor-pointer"
            >
              {/* Davetiye Önizleme Kartı */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-200">
                
                {/* Üst Renkli Band */}
                <div className="h-1.5" style={{ backgroundColor: sablon.renk }} />

                {/* Davetiye İçeriği */}
                <div className={`bg-gradient-to-b ${sablon.arkaplan} px-6 pt-6 pb-4`}>
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">{emojiler[sablon.kategori] ?? "🎉"}</div>
                    <p
                      className="text-xs font-semibold tracking-widest uppercase mb-1.5"
                      style={{ color: sablon.renk }}
                    >
                      {KATEGORILER.find((k) => k.id === sablon.kategori)?.isim ?? "Davetiye"}
                    </p>
                    <h3
                      className="text-lg font-bold text-gray-800 mb-1"
                      style={{ color: sablon.yaziRengi }}
                    >
                      {ornekBasliklar[sablon.kategori] ?? "Davetiye Başlığı"}
                    </h3>
                    <div className="w-8 h-0.5 mx-auto my-2" style={{ backgroundColor: sablon.renk }} />
                  </div>

                  {/* Mini Detaylar */}
                  <div className="space-y-2 mb-4">
                    <div className="bg-white bg-opacity-70 rounded-xl px-3 py-2 flex items-center gap-2">
                      <span className="text-sm">📅</span>
                      <p className="text-xs text-gray-600 truncate">
                        {ornekTarihler[sablon.kategori] ?? "Tarih"}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-70 rounded-xl px-3 py-2 flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <p className="text-xs text-gray-600 truncate">Çırağan Palace, İstanbul</p>
                    </div>
                  </div>

                  {/* RSVP Butonları */}
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className="py-2 rounded-xl text-center text-xs font-medium text-white"
                      style={{ backgroundColor: sablon.renk }}
                    >
                      ✓ Katılıyorum
                    </div>
                    <div className="py-2 rounded-xl text-center text-xs font-medium text-gray-500 bg-gray-100">
                      ✗ Katılamıyorum
                    </div>
                  </div>
                </div>

                {/* Alt Bilgi */}
                <div className="px-5 py-3.5 flex items-center justify-between border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{sablon.isim}</p>
                    {sablon.aciklama && (
                      <p className="text-xs text-gray-400 mt-0.5">{sablon.aciklama}</p>
                    )}
                  </div>
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: sablon.renk }}
                  >
                    Seç
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
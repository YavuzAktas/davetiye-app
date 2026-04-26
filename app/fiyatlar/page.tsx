"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLANLAR = [
  {
    id: "free",
    isim: "Ücretsiz",
    fiyat: 0,
    ozellikler: [
      "1 aktif davetiye",
      "50 davetli",
      "Temel şablonlar",
      "RSVP takibi",
    ],
    renk: "gray",
    buton: "Mevcut Plan",
  },
  {
    id: "standart",
    isim: "Standart",
    fiyat: 299,
    ozellikler: [
      "5 aktif davetiye",
      "200 davetli",
      "Tüm şablonlar",
      "RSVP takibi",
      "WhatsApp paylaşım",
      "QR kod",
    ],
    renk: "purple",
    buton: "Standart'a Geç",
    populer: true,
  },
  {
    id: "premium",
    isim: "Premium",
    fiyat: 599,
    ozellikler: [
      "Sınırsız davetiye",
      "Sınırsız davetli",
      "Özel tasarım",
      "Müzik ekleme",
      "Detaylı analitik",
      "Öncelikli destek",
    ],
    renk: "amber",
    buton: "Premium'a Geç",
  },
];

export default function FiyatlarSayfasi() {
  const { data: session } = useSession();
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState<string | null>(null);

  const handleOdeme = async (planId: string, fiyat: number) => {
    if (!session) {
      router.push("/giris");
      return;
    }

    if (planId === "free") return;

    setYukleniyor(planId);

    try {
      const res = await fetch("/api/odeme/baslat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, fiyat }),
      });

      const data = await res.json();

      if (data.checkoutFormContent) {
        const yeniSayfa = window.open("", "_blank");
        if (yeniSayfa) {
          yeniSayfa.document.write(data.checkoutFormContent);
          yeniSayfa.document.close();
        }
      } else {
        alert("Ödeme başlatılamadı, tekrar deneyin.");
      }
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setYukleniyor(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Planlar ve Fiyatlar
        </h1>
        <p className="text-gray-500 text-lg">
          İhtiyacınıza uygun planı seçin. İstediğiniz zaman yükseltin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANLAR.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl p-8 border-2 flex flex-col ${
              plan.populer
                ? "border-purple-500 shadow-lg shadow-purple-100 relative"
                : "border-gray-100"
            }`}
          >
            {plan.populer && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-purple-600 text-white text-xs font-medium px-4 py-1.5 rounded-full">
                  En Popüler
                </span>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {plan.isim}
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.fiyat === 0 ? "Ücretsiz" : `₺${plan.fiyat}`}
                </span>
                {plan.fiyat > 0 && (
                  <span className="text-gray-400 text-sm">/tek seferlik</span>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.ozellikler.map((ozellik) => (
                <li key={ozellik} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold">✓</span>
                  {ozellik}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleOdeme(plan.id, plan.fiyat)}
              disabled={plan.id === "free" || yukleniyor === plan.id}
              className={`w-full py-3 rounded-xl font-medium transition-colors disabled:opacity-50 ${
                plan.populer
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : plan.id === "free"
                  ? "bg-gray-100 text-gray-400 cursor-default"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {yukleniyor === plan.id ? "Yükleniyor..." : plan.buton}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-10">
        Tüm ödemeler iyzico güvencesiyle işlenir. SSL şifreli bağlantı.
      </p>
    </div>
  );
}
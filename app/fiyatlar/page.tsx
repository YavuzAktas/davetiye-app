"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLANLAR = [
  {
    id: "free",
    isim: "Ücretsiz",
    fiyat: 0,
    fiyatLabel: "₺0",
    aciklama: "Başlamak için ideal",
    ozellikler: [
      "1 aktif davetiye",
      "50 davetli",
      "Temel şablonlar",
      "RSVP takibi",
    ],
    populer: false,
    buton: "Mevcut Plan",
    butonStil: "border border-gray-200 text-gray-400 cursor-default",
  },
  {
    id: "standart",
    isim: "Standart",
    fiyat: 299,
    fiyatLabel: "₺299",
    aciklama: "Bireysel kullanım için",
    ozellikler: [
      "5 aktif davetiye",
      "200 davetli",
      "Tüm şablonlar",
      "RSVP takibi",
      "WhatsApp paylaşım",
      "QR kod",
    ],
    populer: true,
    buton: "Standart'a Geç",
    butonStil: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200",
  },
  {
    id: "premium",
    isim: "Premium",
    fiyat: 599,
    fiyatLabel: "₺599",
    aciklama: "Profesyonel kullanım",
    ozellikler: [
      "Sınırsız davetiye",
      "Sınırsız davetli",
      "Özel tasarım",
      "Müzik ekleme",
      "Detaylı analitik",
      "Öncelikli destek",
    ],
    populer: false,
    buton: "Premium'a Geç",
    butonStil: "bg-gray-900 text-white hover:bg-gray-800",
  },
];

const SSS = [
  {
    soru: "Ücretsiz plan ne kadar süre kullanılabilir?",
    cevap: "Ücretsiz plan süresiz kullanılabilir. Daha fazla özellik için istediğiniz zaman yükseltebilirsiniz.",
  },
  {
    soru: "Ödeme güvenli mi?",
    cevap: "Tüm ödemeler iyzico altyapısıyla SSL şifreli bağlantı üzerinden işlenir. Kart bilgileriniz güvende.",
  },
  {
    soru: "İptal edebilir miyim?",
    cevap: "Evet, istediğiniz zaman iptal edebilirsiniz. Tek seferlik ödeme olduğu için otomatik yenileme yoktur.",
  },
  {
    soru: "Fatura alabilir miyim?",
    cevap: "Evet, ödeme sonrası otomatik fatura e-posta adresinize gönderilir.",
  },
];

export default function FiyatlarSayfasi() {
  const { data: session } = useSession();
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState<string | null>(null);
  const [acikSss, setAcikSss] = useState<number | null>(null);

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
      }
    } catch {
      alert("Bir hata oluştu.");
    } finally {
      setYukleniyor(null);
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Fiyatlandırma
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Planlar ve Fiyatlar
          </h1>
          <p className="text-gray-500 text-lg">
            İhtiyacınıza uygun planı seçin. Kredi kartı gerekmez, istediğiniz zaman yükseltin.
          </p>
        </div>
      </section>

      {/* Planlar */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANLAR.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.populer
                  ? "bg-purple-600 text-white shadow-2xl shadow-purple-200 scale-105"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              {plan.populer && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                    En Popüler
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-sm font-medium mb-1 ${plan.populer ? "text-purple-200" : "text-gray-500"}`}>
                  {plan.isim}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold ${plan.populer ? "text-white" : "text-gray-900"}`}>
                    {plan.fiyatLabel}
                  </span>
                  {plan.fiyat > 0 && (
                    <span className={`text-sm ${plan.populer ? "text-purple-300" : "text-gray-400"}`}>
                      /tek seferlik
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.populer ? "text-purple-200" : "text-gray-400"}`}>
                  {plan.aciklama}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.ozellikler.map((ozellik) => (
                  <li key={ozellik} className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      plan.populer ? "bg-purple-500 text-white" : "bg-green-100 text-green-600"
                    }`}>
                      ✓
                    </span>
                    <span className={`text-sm ${plan.populer ? "text-purple-100" : "text-gray-600"}`}>
                      {ozellik}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleOdeme(plan.id, plan.fiyat)}
                disabled={plan.id === "free" || yukleniyor === plan.id}
                className={`w-full py-3.5 rounded-xl font-medium transition-all text-sm disabled:opacity-60 ${
                  plan.populer
                    ? "bg-white text-purple-600 hover:bg-purple-50"
                    : plan.butonStil
                }`}
              >
                {yukleniyor === plan.id ? "Yükleniyor..." : plan.buton}
              </button>
            </div>
          ))}
        </div>

        {/* Güven Rozetleri */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8 border-t border-gray-100">
          {[
            { emoji: "🔒", metin: "SSL Şifreli Ödeme" },
            { emoji: "✅", metin: "iyzico Güvencesi" },
            { emoji: "📄", metin: "Otomatik Fatura" },
            { emoji: "💬", metin: "7/24 Destek" },
          ].map((rozet) => (
            <div key={rozet.metin} className="flex items-center gap-2 text-gray-500 text-sm">
              <span>{rozet.emoji}</span>
              <span>{rozet.metin}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Karşılaştırma Tablosu */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Plan karşılaştırması
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 w-1/2">Özellik</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Ücretsiz</th>
                  <th className="px-6 py-4 text-sm font-semibold text-purple-600 text-center bg-purple-50">Standart</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ozellik: "Aktif davetiye", free: "1", standart: "5", premium: "Sınırsız" },
                  { ozellik: "Davetli sayısı", free: "50", standart: "200", premium: "Sınırsız" },
                  { ozellik: "Şablonlar", free: "Temel", standart: "Tümü", premium: "Tümü" },
                  { ozellik: "RSVP takibi", free: "✓", standart: "✓", premium: "✓" },
                  { ozellik: "WhatsApp paylaşım", free: "✓", standart: "✓", premium: "✓" },
                  { ozellik: "QR kod", free: "—", standart: "✓", premium: "✓" },
                  { ozellik: "Özel renk & font", free: "—", standart: "✓", premium: "✓" },
                  { ozellik: "Müzik ekleme", free: "—", standart: "—", premium: "✓" },
                  { ozellik: "Detaylı analitik", free: "—", standart: "—", premium: "✓" },
                  { ozellik: "Öncelikli destek", free: "—", standart: "—", premium: "✓" },
                ].map((satir, i) => (
                  <tr key={satir.ozellik} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-3.5 text-sm text-gray-700">{satir.ozellik}</td>
                    <td className="px-6 py-3.5 text-sm text-center text-gray-500">{satir.free}</td>
                    <td className="px-6 py-3.5 text-sm text-center text-purple-600 font-medium bg-purple-50">{satir.standart}</td>
                    <td className="px-6 py-3.5 text-sm text-center text-gray-700">{satir.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Sık sorulan sorular
        </h2>
        <div className="space-y-3">
          {SSS.map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setAcikSss(acikSss === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-gray-800 text-sm">{item.soru}</span>
                <span className="text-gray-400 ml-4">{acikSss === i ? "−" : "+"}</span>
              </button>
              {acikSss === i && (
                <div className="px-6 pb-4 border-t border-gray-50">
                  <p className="text-gray-500 text-sm leading-relaxed pt-3">{item.cevap}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
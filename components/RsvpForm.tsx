"use client";

import { useState } from "react";

interface Props {
  davetiyeId: string;
  renk: string;
}

type Adim = "secim" | "form" | "tamamlandi";

export default function RsvpForm({ davetiyeId, renk }: Props) {
  const [adim, setAdim] = useState<Adim>("secim");
  const [katilim, setKatilim] = useState<boolean | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [form, setForm] = useState({
    ad: "",
    email: "",
    telefon: "",
    kisiSayisi: 1,
    mesaj: "",
  });

  const handleSecim = (karar: boolean) => {
    setKatilim(karar);
    setAdim("form");
  };

  const handleGonder = async () => {
    if (!form.ad.trim()) {
      setHata("Lütfen adınızı girin.");
      return;
    }

    setYukleniyor(true);
    setHata("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          davetiyeId,
          ad: form.ad,
          email: form.email,
          telefon: form.telefon,
          katilim,
          kisiSayisi: form.kisiSayisi,
          mesaj: form.mesaj,
        }),
      });

      if (!res.ok) {
        setHata("Bir hata oluştu, tekrar deneyin.");
        return;
      }

      setAdim("tamamlandi");
    } catch {
      setHata("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  };

  if (adim === "tamamlandi") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${renk}15` }}
        >
          {katilim ? "🎉" : "💙"}
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">
          {katilim ? "Görüşmek üzere!" : "Anlıyoruz, üzgünüz."}
        </h3>
        <p className="text-gray-500 text-sm">
          {katilim
            ? "Katılım bilginiz iletildi. Sizi görmek için sabırsızlanıyoruz!"
            : "Katılım durumunuz iletildi. Umarız bir dahaki sefere birlikte oluruz."}
        </p>
      </div>
    );
  }

  if (adim === "form") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: renk }}
          >
            {katilim ? "✓" : "✗"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {katilim ? "Katılıyorum" : "Katılamıyorum"}
            </p>
            <button
              onClick={() => setAdim("secim")}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Değiştir
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adınız Soyadınız *
            </label>
            <input
              type="text"
              placeholder="Adınızı girin"
              value={form.ad}
              onChange={(e) => setForm({ ...form, ad: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          {katilim && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kaç kişi katılacak?
              </label>
              <select
                value={form.kisiSayisi}
                onChange={(e) =>
                  setForm({ ...form, kisiSayisi: Number(e.target.value) })
                }
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} kişi
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Not (isteğe bağlı)
            </label>
            <textarea
              rows={2}
              placeholder="Bir şey eklemek ister misiniz?"
              value={form.mesaj}
              onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          {hata && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
              {hata}
            </p>
          )}

          {/* KVKK Aydınlatma Bildirimi */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
              Girdiğiniz bilgiler (ad soyad{form.email ? ", e-posta" : ""}) yalnızca
              katılım durumunuzu davet sahibine iletmek amacıyla{" "}
              <span className="font-medium text-gray-500">Davetim</span> tarafından
              işlenmektedir. Etkinlik tarihinden itibaren en geç 1 yıl içinde silinir.
              Verilerinizin silinmesini talep etmek için{" "}
              <a
                href="mailto:kvkk@davetim.com"
                className="underline underline-offset-2 hover:text-gray-600"
              >
                kvkk@davetim.com
              </a>{" "}
              adresine yazabilir ya da{" "}
              <a
                href="/kvkk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-gray-600"
              >
                KVKK Aydınlatma Metni
              </a>
              'ni inceleyebilirsiniz.
            </p>
          </div>

          <button
            onClick={handleGonder}
            disabled={yukleniyor}
            className="w-full py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: renk }}
          >
            {yukleniyor ? "Gönderiliyor..." : "Gönder"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
      <p className="font-semibold text-gray-800 mb-1">Katılacak mısınız?</p>
      <p className="text-sm text-gray-400 mb-4">
        Lütfen katılım durumunuzu bildirin
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleSecim(true)}
          className="flex-1 py-3 rounded-xl font-medium text-white transition-colors"
          style={{ backgroundColor: renk }}
        >
          ✓ Katılıyorum
        </button>
        <button
          onClick={() => handleSecim(false)}
          className="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ✗ Katılamıyorum
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  davetiyeId: string;
  renk: string;
  spotifyAktif?: boolean;
}

type Adim = "secim" | "form" | "tamamlandi";

type SarkiSonuc = {
  id: string;
  uri: string;
  isim: string;
  sanatci: string;
  kapak: string | null;
};

export default function RsvpForm({ davetiyeId, renk, spotifyAktif = false }: Props) {
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
  const [secilenDiyet, setSecilenDiyet] = useState<string[]>([]);

  const toggleDiyet = (key: string) =>
    setSecilenDiyet(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);

  /* Şarkı arama state */
  const [sarkiSorgu, setSarkiSorgu] = useState("");
  const [sarkiSonuclar, setSarkiSonuclar] = useState<SarkiSonuc[]>([]);
  const [seciliSarki, setSeciliSarki] = useState<SarkiSonuc | null>(null);
  const [sarkiAraniyor, setSarkiAraniyor] = useState(false);
  const araTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!spotifyAktif || sarkiSorgu.length < 2) {
      setSarkiSonuclar([]);
      return;
    }
    if (araTimerRef.current) clearTimeout(araTimerRef.current);
    araTimerRef.current = setTimeout(async () => {
      setSarkiAraniyor(true);
      try {
        const res = await fetch(`/api/sarki/ara?q=${encodeURIComponent(sarkiSorgu)}`);
        if (res.ok) setSarkiSonuclar(await res.json());
      } finally {
        setSarkiAraniyor(false);
      }
    }, 400);
    return () => { if (araTimerRef.current) clearTimeout(araTimerRef.current); };
  }, [sarkiSorgu, spotifyAktif]);

  const handleSecim = (karar: boolean) => {
    setKatilim(karar);
    setAdim("form");
  };

  const handleGonder = async () => {
    if (!form.ad.trim() || form.ad.length > 100) {
      setHata("Lütfen geçerli bir ad girin (Maks. 100 karakter).");
      return;
    }

    if (form.mesaj.length > 500) {
      setHata("Mesajınız çok uzun (Maks. 500 karakter).");
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
          diyet: secilenDiyet.length > 0 ? secilenDiyet.join(",") : undefined,
          mesaj: form.mesaj,
          sarkiOnerisi: seciliSarki
            ? `${seciliSarki.isim} - ${seciliSarki.sanatci}`
            : sarkiSorgu.trim() || undefined,
          spotifyTrackId: seciliSarki?.id,
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
              maxLength={100}
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
              maxLength={254}
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} kişi</option>
                ))}
              </select>
            </div>
          )}

          {katilim && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diyet tercihleri <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "vegan", label: "🌱 Vegan" },
                  { key: "vejetaryen", label: "🥗 Vejetaryen" },
                  { key: "glutensiz", label: "🌾 Glutensiz" },
                  { key: "laktozsuz", label: "🥛 Laktozsuz" },
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleDiyet(opt.key)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all"
                    style={secilenDiyet.includes(opt.key)
                      ? { borderColor: renk, color: renk, backgroundColor: renk + "12" }
                      : { borderColor: "#e5e7eb", color: "#6b7280" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
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
              maxLength={500}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          {spotifyAktif && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🎵 Dans etmek istediğin şarkı? (isteğe bağlı)
              </label>

              {seciliSarki ? (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl border-2"
                  style={{ borderColor: renk + "44", backgroundColor: renk + "08" }}
                >
                  {seciliSarki.kapak && (
                    <img src={seciliSarki.kapak} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{seciliSarki.isim}</p>
                    <p className="text-xs text-gray-500 truncate">{seciliSarki.sanatci}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSeciliSarki(null); setSarkiSorgu(""); }}
                    className="text-gray-400 hover:text-gray-600 text-lg shrink-0"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Şarkı veya sanatçı adı..."
                    value={sarkiSorgu}
                    onChange={e => { setSarkiSorgu(e.target.value); setSeciliSarki(null); }}
                    maxLength={200}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder-gray-400 pr-10"
                    style={{ "--tw-ring-color": renk } as React.CSSProperties}
                  />
                  {sarkiAraniyor && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                  )}
                  {sarkiSonuclar.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {sarkiSonuclar.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setSeciliSarki(s); setSarkiSorgu(""); setSarkiSonuclar([]); }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                        >
                          {s.kapak && (
                            <img src={s.kapak} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{s.isim}</p>
                            <p className="text-xs text-gray-400 truncate">{s.sanatci}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {hata && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
              {hata}
            </p>
          )}

          {/* KVKK Aydınlatma Bildirimi */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
              Girdiğiniz bilgiler (ad soyad{form.email ? ", e-posta" : ""}{form.telefon ? ", telefon" : ""},
              katılım durumu, kişi sayısı, varsa not, diyet tercihi ve şarkı önerisi) yalnızca
              katılım durumunuzu davet sahibine iletmek, etkinlik planlamasını yapmak ve seçtiyseniz
              şarkı önerinizi Spotify listesine eklemek amacıyla{" "}
              <span className="font-medium text-gray-500">Bekleriz</span> tarafından
              işlenmektedir. Etkinlik tarihinden itibaren en geç 1 yıl içinde silinir.
              Verilerinizin silinmesini talep etmek için{" "}
              <a
                href="mailto:kvkk@bekleriz.com"
                className="underline underline-offset-2 hover:text-gray-600"
              >
                kvkk@bekleriz.com
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

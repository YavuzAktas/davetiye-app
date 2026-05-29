"use client";

import { useState } from "react";

export interface EtkinlikProp {
  id: string;
  isim: string;
  tarih: string | null;
  saat: string | null;
  mekan: string | null;
  aciklama: string | null;
  ikon: string;
  sira: number;
}

interface Props {
  davetiyeId: string;
  renk: string;
  etkinlikler?: EtkinlikProp[];
}

type Adim = "secim" | "etkinlikler" | "form" | "tamamlandi";

function tarihFormatla(isoStr: string | null, saat: string | null): string {
  const parcalar: string[] = [];
  if (isoStr) {
    parcalar.push(
      new Date(isoStr).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
      })
    );
  }
  if (saat) parcalar.push(saat);
  return parcalar.join(" · ");
}

export default function RsvpForm({ davetiyeId, renk, etkinlikler = [] }: Props) {
  const [adim, setAdim] = useState<Adim>("secim");
  const [katilim, setKatilim] = useState<boolean | null>(null);
  const [seciliEtkinlikler, setSeciliEtkinlikler] = useState<Set<string>>(
    () => new Set(etkinlikler.map(e => e.id))
  );
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const [form, setForm] = useState({
    ad: "",
    email: "",
    telefon: "",
    mesaj: "",
    sarkiDilegi: "",
  });

  const programVar = etkinlikler.length >= 2;

  const handleSecim = (karar: boolean) => {
    setKatilim(karar);
    if (karar && programVar) {
      setAdim("etkinlikler");
    } else {
      setAdim("form");
    }
  };

  const toggleEtkinlik = (id: string) => {
    setSeciliEtkinlikler(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
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
          ad:           form.ad,
          email:        form.email,
          telefon:      form.telefon,
          katilim,
          mesaj:        form.mesaj,
          sarkiOnerisi: form.sarkiDilegi.trim() || undefined,
          etkinlikler:  katilim && programVar
            ? Array.from(seciliEtkinlikler)
            : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setHata(json.hata ?? "Bir hata oluştu, tekrar deneyin.");
        return;
      }
      setAdim("tamamlandi");
    } catch {
      setHata("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  };

  /* ── Tamamlandı ── */
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
        {katilim && programVar && seciliEtkinlikler.size > 0 && (
          <div className="mt-4 text-left space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 text-center mb-2">Katılacağınız etkinlikler</p>
            {etkinlikler.filter(e => seciliEtkinlikler.has(e.id)).map(e => (
              <div key={e.id} className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                <span>{e.ikon}</span>
                <span className="font-medium">{e.isim}</span>
                {(e.tarih || e.saat) && (
                  <span className="text-gray-400 text-xs">{tarihFormatla(e.tarih, e.saat)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Etkinlik seçimi ── */
  if (adim === "etkinlikler") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: renk }}
          >
            ✓
          </div>
          <div>
            <p className="font-semibold text-gray-800">Katılıyorum</p>
            <button onClick={() => setAdim("secim")} className="text-xs text-gray-400 hover:text-gray-600">
              Değiştir
            </button>
          </div>
        </div>

        <p className="text-sm font-semibold text-gray-700 mb-1">Hangi etkinliklere katılacaksınız?</p>
        <p className="text-xs text-gray-400 mb-4">Katılmayacaklarınızın işaretini kaldırın</p>

        <div className="space-y-2 mb-5">
          {etkinlikler.map(e => {
            const secili = seciliEtkinlikler.has(e.id);
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => toggleEtkinlik(e.id)}
                className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  secili
                    ? "border-transparent"
                    : "border-gray-100 bg-gray-50 opacity-50"
                }`}
                style={secili ? { backgroundColor: `${renk}12`, borderColor: `${renk}30` } : {}}
              >
                <span className="text-xl shrink-0 mt-0.5">{e.ikon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${secili ? "text-gray-800" : "text-gray-500"}`}>
                    {e.isim}
                  </p>
                  {(e.tarih || e.saat || e.mekan) && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {[tarihFormatla(e.tarih, e.saat), e.mekan].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    secili ? "border-transparent" : "border-gray-300"
                  }`}
                  style={secili ? { backgroundColor: renk } : {}}
                >
                  {secili && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setAdim("form")}
          disabled={seciliEtkinlikler.size === 0}
          className="w-full py-3 rounded-xl font-medium text-white transition-colors disabled:opacity-40"
          style={{ backgroundColor: renk }}
        >
          Devam Et →
        </button>
      </div>
    );
  }

  /* ── Form ── */
  if (adim === "form") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: renk }}
          >
            {katilim ? "✓" : "✗"}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {katilim ? "Katılıyorum" : "Katılamıyorum"}
            </p>
            <button
              onClick={() => setAdim(katilim && programVar ? "etkinlikler" : "secim")}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Değiştir
            </button>
          </div>
        </div>

        {/* Seçilen etkinlikler özeti */}
        {katilim && programVar && seciliEtkinlikler.size > 0 && (
          <div className="mb-4 p-3 rounded-xl border border-gray-100 bg-gray-50 space-y-1">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Katılacağınız etkinlikler</p>
            {etkinlikler.filter(e => seciliEtkinlikler.has(e.id)).map(e => (
              <div key={e.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span>{e.ikon}</span>
                <span className="font-medium">{e.isim}</span>
                {(e.tarih || e.saat) && (
                  <span className="text-gray-400">{tarihFormatla(e.tarih, e.saat)}</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız *</label>
            <input
              type="text"
              placeholder="Adınızı girin"
              value={form.ad}
              onChange={e => setForm({ ...form, ad: e.target.value })}
              maxLength={100}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🎵 Şarkı dileğiniz <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
            </label>
            <input
              type="text"
              placeholder="Dans pistindeki favori şarkınız?"
              value={form.sarkiDilegi}
              onChange={e => setForm({ ...form, sarkiDilegi: e.target.value })}
              maxLength={200}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              💬 Not <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Bir şey eklemek ister misiniz?"
              value={form.mesaj}
              onChange={e => setForm({ ...form, mesaj: e.target.value })}
              maxLength={500}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          {hata && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{hata}</p>
          )}

          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-500">Kişisel Veri Bildirimi: </span>
              Girdiğiniz bilgiler yalnızca katılım durumunuzu davet sahibine iletmek amacıyla{" "}
              <span className="font-medium text-gray-500">Bekleriz</span> tarafından işlenmektedir.
              Etkinlik tarihinden itibaren en geç 1 yıl içinde silinir.{" "}
              <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gray-600">
                KVKK Aydınlatma Metni
              </a>
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

  /* ── Secim (ilk adım) ── */
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Program timeline — sadece etkinlik varsa göster */}
      {etkinlikler.length > 0 && (
        <div className="px-6 pt-5 pb-4 border-b border-gray-50">
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
            Etkinlik Programı
          </p>
          <div className="relative">
            {/* Dikey çizgi */}
            <div className="absolute left-4 top-3 bottom-3 w-px bg-gray-100" />
            <div className="space-y-4">
              {etkinlikler.map((e, i) => (
                <div key={e.id} className="flex gap-4 relative">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 z-10"
                    style={{ backgroundColor: `${renk}15` }}
                  >
                    {e.ikon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-gray-800">{e.isim}</p>
                    {(e.tarih || e.saat || e.mekan) && (
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {[tarihFormatla(e.tarih, e.saat), e.mekan].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {e.aciklama && (
                      <p className="text-xs text-gray-400 mt-0.5 italic">{e.aciklama}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-6 text-center">
        <p className="font-semibold text-gray-800 mb-1">Katılacak mısınız?</p>
        <p className="text-sm text-gray-400 mb-4">Lütfen katılım durumunuzu bildirin</p>
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
    </div>
  );
}

"use client";

import { useState } from "react";
import { type RsvpSorular, rsvpSorularCoz, soruAktifMi, soruGetir } from "@/lib/rsvp-sorular";

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
  rsvpSorular?: RsvpSorular | null;
  onAd?: string | null;
  maxKisiSayisi?: number | null;
  davetliKod?: string | null;
}

type Adim = "secim" | "etkinlikler" | "form" | "tamamlandi";

const YEMEK_SECENEKLER = ["vejeteryen", "vegan", "glutensiz", "laktozsuz"];

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

export default function RsvpForm({ davetiyeId, renk, etkinlikler = [], rsvpSorular, onAd, maxKisiSayisi, davetliKod }: Props) {
  const sorular = rsvpSorularCoz(rsvpSorular);
  const kisiSayisiAktif = soruAktifMi(sorular, "kisiSayisi");
  const globalMaxKisi   = soruGetir(sorular, "kisiSayisi").maxKisi ?? 2;
  const sarkiAktif  = soruAktifMi(sorular, "sarki");
  const yemekAktif  = soruAktifMi(sorular, "yemek");
  const ulasimAktif = soruAktifMi(sorular, "ulasim");
  const cocukAktif  = soruAktifMi(sorular, "cocuk");
  const alerjiAktif = soruAktifMi(sorular, "alerji");
  const ozelAktif   = soruAktifMi(sorular, "ozel");
  const ozelSoru    = soruGetir(sorular, "ozel").soru ?? "";

  const [adim, setAdim] = useState<Adim>("secim");
  const [katilim, setKatilim] = useState<boolean | null>(null);
  const [seciliEtkinlikler, setSeciliEtkinlikler] = useState<Set<string>>(
    () => new Set(etkinlikler.map(e => e.id))
  );
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const [ad,         setAd]         = useState(onAd ?? "");
  const [sarkiDilegi, setSarkiDilegi] = useState("");
  const [mesaj,      setMesaj]      = useState("");
  const [yemekSecim, setYemekSecim] = useState<Set<string>>(new Set());
  const [ulasim,     setUlasim]     = useState<boolean | null>(null);
  const [cocukSayisi, setCocukSayisi] = useState(0);
  const [alerji,     setAlerji]     = useState("");
  const [ozelCevap,  setOzelCevap]  = useState("");
  const [ozelNitelikliVeriOnayi, setOzelNitelikliVeriOnayi] = useState(false);
  const [kisiSayisi, setKisiSayisi] = useState(1);

  // per-guest limit > global config > varsayılan 1 (gösterilmez)
  const maxKisi = maxKisiSayisi ?? (kisiSayisiAktif ? globalMaxKisi : 1);

  const programVar = etkinlikler.length >= 2;
  const hassasBeslenmeBilgisiVar = katilim === true && (
    (yemekAktif && yemekSecim.size > 0) ||
    (alerjiAktif && alerji.trim().length > 0)
  );

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

  const toggleYemek = (secim: string) => {
    setYemekSecim(prev => {
      const s = new Set(prev);
      s.has(secim) ? s.delete(secim) : s.add(secim);
      return s;
    });
  };

  const handleGonder = async () => {
    if (!ad.trim() || ad.length > 100) {
      setHata("Lütfen geçerli bir ad girin (Maks. 100 karakter).");
      return;
    }
    if (mesaj.length > 500) {
      setHata("Mesajınız çok uzun (Maks. 500 karakter).");
      return;
    }
    if (hassasBeslenmeBilgisiVar && !ozelNitelikliVeriOnayi) {
      setHata("Yemek, alerji veya özel beslenme bilginizi iletmek için açık rıza onayını işaretleyin.");
      return;
    }

    /* cevaplar JSON: sadece dolu alanlar */
    const cevaplar: Record<string, unknown> = {};
    if (katilim) {
      if (ulasimAktif && ulasim !== null) cevaplar.ulasim = ulasim;
      if (cocukAktif && cocukSayisi > 0)  cevaplar.cocuk  = cocukSayisi;
      if (alerjiAktif && alerji.trim())   cevaplar.alerji = alerji.trim();
      if (ozelAktif && ozelCevap.trim()) {
        cevaplar.ozelSoru  = ozelSoru;
        cevaplar.ozelCevap = ozelCevap.trim();
      }
    }

    setYukleniyor(true);
    setHata("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          davetiyeId,
          ad,
          mesaj:        mesaj || undefined,
          katilim,
          sarkiOnerisi: sarkiAktif && sarkiDilegi.trim() ? sarkiDilegi.trim() : undefined,
          diyet:        yemekAktif && yemekSecim.size > 0 ? Array.from(yemekSecim).join(",") : undefined,
          cevaplar:     Object.keys(cevaplar).length > 0 ? cevaplar : undefined,
          etkinlikler:  katilim && programVar ? Array.from(seciliEtkinlikler) : undefined,
          ozelNitelikliVeriOnayi: hassasBeslenmeBilgisiVar ? true : undefined,
          kisiSayisi,
          davetliKod:   davetliKod || undefined,
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
          {/* Ad Soyad — zorunlu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız *</label>
            <input
              type="text"
              placeholder="Adınızı girin"
              value={ad}
              onChange={e => setAd(e.target.value)}
              maxLength={100}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Kişi sayısı — sadece birden fazla kişi gelebiliyorsa göster */}
          {katilim && maxKisi > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👥 Kaç kişi geliyorsunuz?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setKisiSayisi(Math.max(1, kisiSayisi - 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors"
                >−</button>
                <span className="text-lg font-bold text-gray-800 w-8 text-center tabular-nums">{kisiSayisi}</span>
                <button
                  type="button"
                  onClick={() => setKisiSayisi(Math.min(maxKisi, kisiSayisi + 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors"
                >+</button>
              </div>
            </div>
          )}

          {/* Şarkı isteği */}
          {sarkiAktif && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🎵 Şarkı dileğiniz <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <input
                type="text"
                placeholder="Dans pistindeki favori şarkınız?"
                value={sarkiDilegi}
                onChange={e => setSarkiDilegi(e.target.value)}
                maxLength={200}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          )}

          {/* Yemek tercihi */}
          {katilim && yemekAktif && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🍽️ Yemek / özel beslenme tercihi <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {YEMEK_SECENEKLER.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleYemek(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      yemekSecim.has(s)
                        ? "border-transparent text-white"
                        : "border-gray-200 text-gray-600 bg-gray-50 hover:border-gray-300"
                    }`}
                    style={yemekSecim.has(s) ? { backgroundColor: renk } : {}}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Servis / Ulaşım */}
          {katilim && ulasimAktif && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🚌 Servis kullanacak mısınız?
              </label>
              <div className="flex gap-2">
                {[{ val: true, label: "Evet" }, { val: false, label: "Hayır" }].map(({ val, label }) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setUlasim(val)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                      ulasim === val
                        ? "border-transparent text-white"
                        : "border-gray-200 text-gray-600 bg-gray-50 hover:border-gray-300"
                    }`}
                    style={ulasim === val ? { backgroundColor: renk } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Çocuk katılımı */}
          {katilim && cocukAktif && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👶 Kaç çocuk getiriyorsunuz?
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCocukSayisi(Math.max(0, cocukSayisi - 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors"
                >−</button>
                <span className="text-lg font-bold text-gray-800 w-8 text-center tabular-nums">{cocukSayisi}</span>
                <button
                  type="button"
                  onClick={() => setCocukSayisi(Math.min(10, cocukSayisi + 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center transition-colors"
                >+</button>
              </div>
            </div>
          )}

          {/* Alerji / Diyet */}
          {alerjiAktif && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ⚠️ Alerji veya özel beslenme notu <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <input
                type="text"
                placeholder="Paylaşmak isterseniz kısa not yazın"
                value={alerji}
                onChange={e => setAlerji(e.target.value)}
                maxLength={200}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          )}

          {hassasBeslenmeBilgisiVar && (
            <label className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ozelNitelikliVeriOnayi}
                onChange={e => setOzelNitelikliVeriOnayi(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-[11px] leading-relaxed text-amber-800">
                Yemek, alerji veya özel beslenme bilgilerimin davet sahibine etkinlik organizasyonu amacıyla
                iletilmesine açık rıza veriyorum. Bu alanları boş bırakırsanız bu onay gerekmez.
              </span>
            </label>
          )}

          {/* Özel soru */}
          {ozelAktif && ozelSoru && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💬 {ozelSoru} <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <input
                type="text"
                placeholder="Yanıtınızı yazın"
                value={ozelCevap}
                onChange={e => setOzelCevap(e.target.value)}
                maxLength={500}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          )}

          {/* Not */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              💬 Not <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Bir şey eklemek ister misiniz?"
              value={mesaj}
              onChange={e => setMesaj(e.target.value)}
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
            <div className="absolute left-4 top-3 bottom-3 w-px bg-gray-100" />
            <div className="space-y-4">
              {etkinlikler.map((e) => (
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

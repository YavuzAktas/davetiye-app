"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PARTNER_PAKET_LISTESI, paketGetir, type PartnerPaketId } from "@/lib/partner-paketler";

type Abonelik = {
  paketId: string;
  hakSayisi: number;
  kullanilanHak: number;
  baslangicAt: string;
  bitisAt: string | null;
} | null;

type Fatura = {
  faturaTipi: "bireysel" | "kurumsal";
  adSoyad: string;
  telefon: string;
  sehir: string;
  kimlikVergiNo: string;
  adres: string;
};

const BOS_FATURA: Fatura = {
  faturaTipi: "bireysel",
  adSoyad: "",
  telefon: "",
  sehir: "",
  kimlikVergiNo: "",
  adres: "",
};

function telefonGecerli(t: string) {
  const r = t.replace(/\D/g, "");
  return (r.length === 10 && r.startsWith("5")) ||
    (r.length === 11 && r.startsWith("05")) ||
    (r.length === 12 && r.startsWith("90"));
}

export default function PanelIcerik({
  partner,
  abonelik,
  odemeBasarili,
}: {
  partner: { id: string; firmaAdi: string };
  abonelik: Abonelik;
  odemeBasarili: boolean;
}) {
  const [secilenPaket, setSecilenPaket] = useState<PartnerPaketId | null>(null);
  const [fatura, setFatura] = useState<Fatura>(BOS_FATURA);
  const [hatalar, setHatalar] = useState<Partial<Record<string, string>>>({});
  const [onay, setOnay] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutHtml) return;
    const injected: HTMLScriptElement[] = [];
    const tmp = document.createElement("div");
    tmp.innerHTML = checkoutHtml;
    tmp.querySelectorAll("script").forEach(old => {
      const s = document.createElement("script");
      s.setAttribute("data-partner-iyzico", "");
      if (old.src) s.src = old.src;
      else s.text = old.textContent ?? "";
      document.body.appendChild(s);
      injected.push(s);
    });
    return () => { injected.forEach(s => s.remove()); };
  }, [checkoutHtml]);

  const degistir = (alan: keyof Fatura, deger: string) => {
    setFatura(prev => ({ ...prev, [alan]: deger }));
    setHatalar(prev => ({ ...prev, [alan]: undefined, genel: undefined }));
  };

  const dogrula = () => {
    const h: Partial<Record<string, string>> = {};
    const k = fatura.faturaTipi === "kurumsal";
    if (fatura.adSoyad.trim().length < 3) h.adSoyad = "Ad soyad girin.";
    if (!telefonGecerli(fatura.telefon)) h.telefon = "Geçerli bir mobil numara girin. (05xxxxxxxxx)";
    if (fatura.sehir.trim().length < 2) h.sehir = "Şehir girin.";
    if (k && !/^\d{10,11}$/.test(fatura.kimlikVergiNo)) h.kimlikVergiNo = "10 veya 11 haneli olmalıdır.";
    if (k && fatura.adres.trim().length < 10) h.adres = "En az 10 karakter girin.";
    if (!onay) h.onay = "Ödeme öncesi onay gerekli.";
    setHatalar(h);
    return Object.keys(h).length === 0;
  };

  const odemeBaslat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dogrula() || !secilenPaket) return;
    setYukleniyor(true);
    setHatalar({});
    try {
      const res = await fetch("/api/partner/odeme/baslat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paketId: secilenPaket, faturaBilgileri: fatura }),
      });
      const data = await res.json();
      if (data.checkoutFormContent) {
        setCheckoutHtml(data.checkoutFormContent);
      } else {
        setHatalar({ genel: data.hata ?? "Ödeme başlatılamadı, tekrar deneyin." });
      }
    } catch {
      setHatalar({ genel: "Sunucuya bağlanılamadı." });
    } finally {
      setYukleniyor(false);
    }
  };

  const inputCls = (alan: string) =>
    `w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-all ${
      hatalar[alan]
        ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
    }`;

  return (
    <div className="space-y-6">
      {/* Başarı bildirimi */}
      {odemeBasarili && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 text-sm text-green-700 font-semibold">
          ✅ Ödeme başarılı! Aboneliğiniz aktive edildi.
        </div>
      )}

      {/* Mevcut abonelik */}
      {abonelik && (() => {
        const kalanHak = abonelik.hakSayisi - abonelik.kullanilanHak;
        const dolulukYuzde = Math.min(100, (abonelik.kullanilanHak / abonelik.hakSayisi) * 100);
        const bitisDate = abonelik.bitisAt ? new Date(abonelik.bitisAt) : null;
        const kalanGun = bitisDate
          ? Math.ceil((bitisDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null;
        const yakindaBitiyor = kalanGun !== null && kalanGun <= 5;
        const hakDolmakUzere = kalanHak > 0 && kalanHak <= 3;
        const hakTukendi = kalanHak <= 0;

        return (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Mevcut Abonelik</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-black text-gray-900">{paketGetir(abonelik.paketId)?.ad ?? abonelik.paketId} Paketi</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {bitisDate
                    ? `Yenileme: ${bitisDate.toLocaleDateString("tr-TR")}`
                    : "Süresiz"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">{abonelik.kullanilanHak}</p>
                <p className="text-xs text-gray-400">/ {abonelik.hakSayisi} hak kullanıldı</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  hakTukendi
                    ? "bg-red-400"
                    : hakDolmakUzere
                    ? "bg-amber-400"
                    : "bg-linear-to-r from-purple-500 to-pink-500"
                }`}
                style={{ width: `${dolulukYuzde}%` }}
              />
            </div>

            {hakTukendi && (
              <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-red-600">Tüm haklarınız doldu</p>
                  <p className="text-[11px] text-red-400">Yeni aktivasyon kodu oluşturmak için paketinizi yenileyin.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSecilenPaket(abonelik.paketId as any)}
                  className="shrink-0 text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors px-3 py-1.5 rounded-xl ml-3"
                >
                  Yenile
                </button>
              </div>
            )}

            {hakDolmakUzere && (
              <p className="text-[11px] text-amber-600 font-medium">
                ⚠️ Yalnızca {kalanHak} hakkınız kaldı. Yakında yenilemeyi düşünün.
              </p>
            )}

            {yakindaBitiyor && !hakTukendi && (
              <p className="text-[11px] text-amber-600 font-medium">
                ⚠️ Aboneliğiniz {kalanGun} gün içinde sona eriyor.
              </p>
            )}

            {!hakTukendi && !hakDolmakUzere && (
              <p className="text-xs text-gray-400">{kalanHak} hak kaldı</p>
            )}
          </div>
        );
      })()}

      {/* Paket seçimi */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
          {abonelik ? "Paket Yenile / Yükselt" : "Paket Seç"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {PARTNER_PAKET_LISTESI.map(paket => {
            const secili = secilenPaket === paket.id;
            return (
              <button
                key={paket.id}
                type="button"
                onClick={() => {
                  setSecilenPaket(paket.id as PartnerPaketId);
                  setCheckoutHtml(null);
                  setHatalar({});
                }}
                className={`relative text-left rounded-2xl border-2 p-4 transition-all ${
                  secili
                    ? "border-purple-400 bg-purple-50/50 shadow-sm"
                    : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                }`}
              >
                {secili && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </span>
                )}
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: paket.renk }}>
                  {paket.ad}
                </p>
                <p className="text-xl font-black text-gray-900 mb-0.5">
                  ₺{paket.aylikTutar.toLocaleString("tr-TR")}
                  <span className="text-xs font-normal text-gray-400">/ay</span>
                </p>
                <p className="text-xs text-gray-500">Ayda {paket.hakSayisi} aktivasyon hakkı</p>
              </button>
            );
          })}
        </div>

        {/* Fatura formu */}
        {secilenPaket && !checkoutHtml && (
          <form onSubmit={odemeBaslat} className="border-t border-gray-100 pt-6 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Fatura Bilgileri</p>

            {/* Bireysel / Kurumsal */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-2xl p-1">
              {(["bireysel", "kurumsal"] as const).map(tip => (
                <button
                  key={tip}
                  type="button"
                  onClick={() => degistir("faturaTipi", tip)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
                    fatura.faturaTipi === tip
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
                </button>
              ))}
            </div>

            {hatalar.genel && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {hatalar.genel}
              </p>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                {fatura.faturaTipi === "kurumsal" ? "Unvan / Yetkili" : "Ad Soyad"} <span className="text-red-400">*</span>
              </label>
              <input
                className={inputCls("adSoyad")}
                value={fatura.adSoyad}
                onChange={e => degistir("adSoyad", e.target.value)}
              />
              {hatalar.adSoyad && <p className="text-[11px] text-red-500 mt-1">{hatalar.adSoyad}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Telefon <span className="text-red-400">*</span></label>
              <input
                className={inputCls("telefon")}
                value={fatura.telefon}
                onChange={e => degistir("telefon", e.target.value)}
                placeholder="05XX XXX XX XX"
              />
              {hatalar.telefon && <p className="text-[11px] text-red-500 mt-1">{hatalar.telefon}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Şehir <span className="text-red-400">*</span></label>
              <input
                className={inputCls("sehir")}
                value={fatura.sehir}
                onChange={e => degistir("sehir", e.target.value)}
              />
              {hatalar.sehir && <p className="text-[11px] text-red-500 mt-1">{hatalar.sehir}</p>}
            </div>

            {fatura.faturaTipi === "kurumsal" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Vergi No / TCKN <span className="text-red-400">*</span></label>
                  <input
                    className={inputCls("kimlikVergiNo")}
                    value={fatura.kimlikVergiNo}
                    onChange={e => degistir("kimlikVergiNo", e.target.value)}
                  />
                  {hatalar.kimlikVergiNo && <p className="text-[11px] text-red-500 mt-1">{hatalar.kimlikVergiNo}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Fatura Adresi <span className="text-red-400">*</span></label>
                  <textarea
                    className={inputCls("adres") + " resize-none"}
                    rows={2}
                    value={fatura.adres}
                    onChange={e => degistir("adres", e.target.value)}
                  />
                  {hatalar.adres && <p className="text-[11px] text-red-500 mt-1">{hatalar.adres}</p>}
                </div>
              </>
            )}

            {/* Onay */}
            <label className={`flex gap-3 cursor-pointer rounded-2xl p-4 transition-all ${
              hatalar.onay ? "bg-red-50 border border-red-100" : "bg-gray-50 border border-gray-100"
            }`}>
              <input
                type="checkbox"
                checked={onay}
                onChange={e => {
                  setOnay(e.target.checked);
                  if (e.target.checked) setHatalar(p => ({ ...p, onay: undefined }));
                }}
                className="mt-0.5 w-4 h-4 accent-purple-600 cursor-pointer shrink-0"
              />
              <span className="text-[11px] leading-relaxed text-gray-500">
                <Link href="/on-bilgilendirme" target="_blank" className="text-purple-600 hover:underline">Ön Bilgilendirme</Link>
                {", "}
                <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="text-purple-600 hover:underline">Mesafeli Satış Sözleşmesi</Link>
                {" ve "}
                <Link href="/partner/sozlesme" target="_blank" className="text-purple-600 hover:underline">Partner Sözleşmesi</Link>
                {"'ni okudum; dijital hizmetin ödeme sonrası hemen başlamasını talep ediyor ve cayma hakkı istisnası hakkında bilgilendirildiğimi kabul ediyorum."}
              </span>
            </label>
            {hatalar.onay && <p className="text-[11px] text-red-500">{hatalar.onay}</p>}

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {yukleniyor ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Ödeme hazırlanıyor…
                </>
              ) : "🔒 Güvenli Ödemeye Geç"}
            </button>
          </form>
        )}
      </div>

      {/* iyzico modal */}
      {checkoutHtml && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={e => { if (e.currentTarget === e.target) setCheckoutHtml(null); }}
        >
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-purple-600">Güvenli Ödeme</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">iyzico ile ödeme</p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutHtml(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 text-lg"
              >
                ×
              </button>
            </div>
            <div className="max-h-[80dvh] overflow-y-auto">
              <div id="iyzipay-checkout-form" className="responsive" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

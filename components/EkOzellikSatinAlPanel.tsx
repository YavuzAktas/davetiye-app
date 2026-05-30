"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { tutarMetni } from "@/lib/davetiye-fiyatlandirma";

export type KilidliOzellik = {
  alanAdi: string;
  icon: string;
  ad: string;
  aciklama: string;
  tutar: number;
};

type FaturaBilgileri = {
  faturaTipi: "bireysel" | "kurumsal";
  adSoyad: string;
  telefon: string;
  kimlikVergiNo: string;
  sehir: string;
  adres: string;
};

type FaturaHatalari = Partial<Record<keyof FaturaBilgileri | "genel" | "onay" | "secim", string>>;

const BOS_FATURA: FaturaBilgileri = {
  faturaTipi: "bireysel",
  adSoyad: "", telefon: "", kimlikVergiNo: "", sehir: "", adres: "",
};

function telefonGecerli(v: string) {
  const r = v.replace(/\D/g, "");
  return (r.length === 10 && r.startsWith("5")) ||
         (r.length === 11 && r.startsWith("05")) ||
         (r.length === 12 && r.startsWith("90"));
}

export default function EkOzellikSatinAlPanel({
  davetiyeId,
  kilidliOzellikler,
  adminMi = false,
}: {
  davetiyeId: string;
  kilidliOzellikler: KilidliOzellik[];
  adminMi?: boolean;
}) {
  const [modalAcik, setModalAcik]   = useState(false);
  const [secili, setSecili]         = useState<Set<string>>(new Set());
  const [fatura, setFatura]         = useState<FaturaBilgileri>(BOS_FATURA);
  const [hatalar, setHatalar]       = useState<FaturaHatalari>({});
  const [onay, setOnay]             = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [odeModal, setOdeModal]     = useState<string | null>(null);

  // İlk açılışta hepsini seç
  useEffect(() => {
    if (modalAcik) setSecili(new Set(kilidliOzellikler.map(o => o.alanAdi)));
  }, [modalAcik, kilidliOzellikler]);

  // iyzico script injection
  useEffect(() => {
    if (!odeModal) return;
    const injected: HTMLScriptElement[] = [];
    const tmp = document.createElement("div");
    tmp.innerHTML = odeModal;
    tmp.querySelectorAll("script").forEach(old => {
      const s = document.createElement("script");
      s.setAttribute("data-iyzico-script", "");
      if (old.src) s.src = old.src; else s.text = old.textContent ?? "";
      document.body.appendChild(s);
      injected.push(s);
    });
    return () => { injected.forEach(s => s.remove()); };
  }, [odeModal]);

  const seciliToplam = kilidliOzellikler
    .filter(o => secili.has(o.alanAdi))
    .reduce((acc, o) => acc + o.tutar, 0);

  const toggle = (alanAdi: string) => {
    setSecili(prev => {
      const next = new Set(prev);
      if (next.has(alanAdi)) next.delete(alanAdi); else next.add(alanAdi);
      return next;
    });
    setHatalar(prev => ({ ...prev, secim: undefined }));
  };

  const alanGuncelle = (alan: keyof FaturaBilgileri, deger: string) => {
    setFatura(prev => ({ ...prev, [alan]: deger }));
    setHatalar(prev => ({ ...prev, [alan]: undefined, genel: undefined }));
  };

  const dogrula = (): boolean => {
    const e: FaturaHatalari = {};
    const kurumsal = fatura.faturaTipi === "kurumsal";
    if (secili.size === 0) e.secim = "En az bir özellik seçin.";
    if (fatura.adSoyad.trim().length < 3 || (!kurumsal && !fatura.adSoyad.trim().includes(" ")))
      e.adSoyad = kurumsal ? "Unvan veya yetkili ad soyad girin." : "Ad ve soyad girin.";
    if (!telefonGecerli(fatura.telefon))
      e.telefon = "Geçerli bir mobil numara girin. Örnek: 05xxxxxxxxx";
    if (fatura.sehir.trim().length < 2)
      e.sehir = "Şehir bilgisini girin.";
    if (kurumsal && !/^\d{10,11}$/.test(fatura.kimlikVergiNo))
      e.kimlikVergiNo = "Vergi no veya TCKN 10 ya da 11 haneli olmalıdır.";
    if (kurumsal && fatura.adres.trim().length < 10)
      e.adres = "Fatura adresi en az 10 karakter olmalıdır.";
    if (!onay)
      e.onay = "Ödeme öncesi yasal bilgilendirme onayını işaretleyin.";
    setHatalar(e);
    return Object.keys(e).length === 0;
  };

  const odemeBaslat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dogrula()) return;
    setYukleniyor(true);
    try {
      const res = await fetch("/api/odeme/ek-ozellik/baslat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          davetiyeId,
          ozellikler: Array.from(secili),
          faturaBilgileri: fatura,
        }),
      });
      const data = await res.json();
      if (data.checkoutFormContent) {
        setOdeModal(data.checkoutFormContent);
      } else {
        setHatalar({ genel: data.hata ?? "Ödeme başlatılamadı, tekrar deneyin." });
      }
    } catch {
      setHatalar({ genel: "Ödeme başlatılırken bir hata oluştu." });
    } finally {
      setYukleniyor(false);
    }
  };

  const alanClass = (alan: keyof FaturaBilgileri) =>
    `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
      hatalar[alan]
        ? "border-red-300 bg-red-50/50 focus:ring-red-100"
        : "border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-100"
    }`;

  if (kilidliOzellikler.length === 0) return null;

  return (
    <>
      {/* iyzico modal */}
      {odeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm"
          onClick={e => { if (e.currentTarget === e.target) setOdeModal(null); }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">Güvenli Ödeme</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">iyzico ile ödeme</p>
              </div>
              <button
                type="button"
                onClick={() => setOdeModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                aria-label="Ödeme penceresini kapat"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[80dvh] overflow-y-auto">
              <div id="iyzipay-checkout-form" className="responsive" />
            </div>
          </div>
        </div>
      )}

      {/* Ek özellik paneli */}
      <div className="bg-white border border-gray-100 rounded-3xl p-5">
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">Ek Özellikler</p>
        <div className="space-y-2 mb-4">
          {kilidliOzellikler.map(o => (
            <div key={o.alanAdi} className="flex items-center gap-3 p-2.5 rounded-2xl border border-gray-100 bg-gray-50/60">
              <span className="text-base w-7 text-center shrink-0">{o.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">{o.ad}</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">{o.aciklama}</p>
              </div>
              <span className="text-xs font-bold text-gray-400 shrink-0">{tutarMetni(o.tutar)}</span>
            </div>
          ))}
        </div>

        {adminMi ? (
          <button
            type="button"
            onClick={() => setModalAcik(true)}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white text-sm font-bold px-4 py-3 rounded-2xl hover:bg-purple-700 transition-colors"
          >
            Ek Özellik Satın Al
          </button>
        ) : (
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Ödeme sistemi yakında aktif olacak.
          </p>
        )}
      </div>

      {/* Satın alma modalı */}
      {modalAcik && (
        <div
          className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 p-3 backdrop-blur-sm"
          onClick={e => { if (e.currentTarget === e.target) setModalAcik(false); }}
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92dvh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-purple-500">Ek Özellik</p>
                <p className="text-base font-bold text-gray-900">Özellik Ekle</p>
              </div>
              <button
                type="button"
                onClick={() => setModalAcik(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={odemeBaslat} noValidate className="p-5 space-y-5">
              {/* Özellik seçimi */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Eklemek istediğiniz özellikler</p>
                {hatalar.secim && (
                  <p className="mb-2 text-xs font-medium text-red-500">{hatalar.secim}</p>
                )}
                <div className="space-y-2">
                  {kilidliOzellikler.map(o => (
                    <label
                      key={o.alanAdi}
                      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                        secili.has(o.alanAdi)
                          ? "border-purple-200 bg-purple-50/60"
                          : "border-gray-100 bg-gray-50/40 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={secili.has(o.alanAdi)}
                        onChange={() => toggle(o.alanAdi)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-base w-6 text-center shrink-0">{o.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{o.ad}</p>
                        <p className="text-xs text-gray-400 leading-relaxed">{o.aciklama}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 shrink-0">{tutarMetni(o.tutar)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toplam */}
              {secili.size > 0 && (
                <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">Toplam tutar</span>
                  <span className="text-xl font-black text-gray-900">{tutarMetni(seciliToplam)}</span>
                </div>
              )}

              {/* Fatura tipi */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Fatura tipi</p>
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-1">
                  {(["bireysel", "kurumsal"] as const).map(tip => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => alanGuncelle("faturaTipi", tip)}
                      className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                        fatura.faturaTipi === tip
                          ? "bg-white text-purple-700 shadow-sm ring-1 ring-purple-100"
                          : "text-gray-500"
                      }`}
                    >
                      {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
                    </button>
                  ))}
                </div>
              </div>

              {hatalar.genel && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{hatalar.genel}</p>
              )}

              {/* Fatura alanları */}
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-gray-600">
                    {fatura.faturaTipi === "kurumsal" ? "Unvan / Yetkili" : "Ad Soyad"}
                  </span>
                  <input value={fatura.adSoyad} onChange={e => alanGuncelle("adSoyad", e.target.value)} className={alanClass("adSoyad")} />
                  {hatalar.adSoyad && <span className="mt-1 block text-xs text-red-500">{hatalar.adSoyad}</span>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-gray-600">Telefon</span>
                  <input value={fatura.telefon} onChange={e => alanGuncelle("telefon", e.target.value)} placeholder="05xxxxxxxxx" className={alanClass("telefon")} />
                  {hatalar.telefon && <span className="mt-1 block text-xs text-red-500">{hatalar.telefon}</span>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-gray-600">Şehir</span>
                  <input value={fatura.sehir} onChange={e => alanGuncelle("sehir", e.target.value)} className={alanClass("sehir")} />
                  {hatalar.sehir && <span className="mt-1 block text-xs text-red-500">{hatalar.sehir}</span>}
                </label>
                {fatura.faturaTipi === "kurumsal" && (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-gray-600">Vergi No / TCKN</span>
                      <input value={fatura.kimlikVergiNo} onChange={e => alanGuncelle("kimlikVergiNo", e.target.value)} className={alanClass("kimlikVergiNo")} />
                      {hatalar.kimlikVergiNo && <span className="mt-1 block text-xs text-red-500">{hatalar.kimlikVergiNo}</span>}
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-gray-600">Fatura Adresi</span>
                      <textarea value={fatura.adres} onChange={e => alanGuncelle("adres", e.target.value)} rows={2} className={alanClass("adres")} />
                      {hatalar.adres && <span className="mt-1 block text-xs text-red-500">{hatalar.adres}</span>}
                    </label>
                  </>
                )}
              </div>

              {/* Onay */}
              <label className={`flex cursor-pointer gap-3 rounded-2xl border p-3 ${hatalar.onay ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
                <input
                  type="checkbox"
                  checked={onay}
                  onChange={e => {
                    setOnay(e.target.checked);
                    if (e.target.checked) setHatalar(prev => ({ ...prev, onay: undefined }));
                  }}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-[11px] leading-relaxed text-gray-600">
                  <Link href="/on-bilgilendirme" target="_blank" className="underline">Ön Bilgilendirme</Link>
                  {", "}
                  <Link href="/mesafeli-satis-sozlesmesi" target="_blank" className="underline">Mesafeli Satış Sözleşmesi</Link>
                  {" ve "}
                  <Link href="/kullanim-sartlari" target="_blank" className="underline">Kullanım Şartları</Link>
                  {"'nı okudum ve dijital hizmetin hemen başlamasını talep ediyorum."}
                </span>
              </label>
              {hatalar.onay && <p className="text-xs font-medium text-red-500">{hatalar.onay}</p>}

              <button
                type="submit"
                disabled={yukleniyor || secili.size === 0}
                className="w-full flex items-center justify-center rounded-2xl bg-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:bg-purple-700 disabled:opacity-50"
              >
                {yukleniyor
                  ? "Ödeme hazırlanıyor..."
                  : secili.size === 0
                    ? "Özellik seçin"
                    : `Güvenli Öde — ${tutarMetni(seciliToplam)}`
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

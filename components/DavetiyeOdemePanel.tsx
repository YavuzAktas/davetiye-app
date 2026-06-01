"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { tutarMetni, type DavetiyeFiyatSonucu } from "@/lib/davetiye-fiyatlandirma";

type FaturaBilgileri = {
  faturaTipi: "bireysel" | "kurumsal";
  adSoyad: string;
  telefon: string;
  kimlikVergiNo: string;
  sehir: string;
  adres: string;
};

type FaturaHatalari = Partial<Record<keyof FaturaBilgileri | "genel" | "onay", string>>;

const BOS_FATURA: FaturaBilgileri = {
  faturaTipi: "bireysel",
  adSoyad: "",
  telefon: "",
  kimlikVergiNo: "",
  sehir: "",
  adres: "",
};

function telefonGecerli(deger: string) {
  const rakamlar = deger.replace(/\D/g, "");
  return (
    (rakamlar.length === 10 && rakamlar.startsWith("5")) ||
    (rakamlar.length === 11 && rakamlar.startsWith("05")) ||
    (rakamlar.length === 12 && rakamlar.startsWith("90"))
  );
}

export default function DavetiyeOdemePanel({
  davetiyeId,
  baslik,
  fiyat,
  adminMi = false,
}: {
  davetiyeId: string;
  baslik: string;
  fiyat: DavetiyeFiyatSonucu;
  adminMi?: boolean;
}) {
  const { data: session } = useSession();
  const [fatura, setFatura] = useState<FaturaBilgileri>(BOS_FATURA);
  const [hatalar, setHatalar] = useState<FaturaHatalari>({});
  const [onay, setOnay] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [odeModal, setOdeModal] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.name || fatura.adSoyad) return;
    setFatura(prev => ({ ...prev, adSoyad: session.user?.name ?? "" }));
  }, [session?.user?.name, fatura.adSoyad]);

  useEffect(() => {
    if (!odeModal) return;

    const injected: HTMLScriptElement[] = [];
    const tmp = document.createElement("div");
    tmp.innerHTML = odeModal;
    tmp.querySelectorAll("script").forEach(old => {
      const script = document.createElement("script");
      script.setAttribute("data-iyzico-script", "");
      if (old.src) script.src = old.src;
      else script.text = old.textContent ?? "";
      document.body.appendChild(script);
      injected.push(script);
    });

    return () => {
      injected.forEach(script => script.remove());
    };
  }, [odeModal]);

  const alanGuncelle = (alan: keyof FaturaBilgileri, deger: string) => {
    setFatura(prev => ({ ...prev, [alan]: deger }));
    setHatalar(prev => ({ ...prev, [alan]: undefined, genel: undefined }));
  };

  const dogrula = () => {
    const yeniHatalar: FaturaHatalari = {};
    const kurumsal = fatura.faturaTipi === "kurumsal";

    if (fatura.adSoyad.trim().length < 3 || (!kurumsal && !fatura.adSoyad.trim().includes(" "))) {
      yeniHatalar.adSoyad = kurumsal ? "Unvan veya yetkili ad soyad girin." : "Ad ve soyad girin.";
    }
    if (!telefonGecerli(fatura.telefon)) {
      yeniHatalar.telefon = "Geçerli bir mobil numara girin. Örnek: 05xxxxxxxxx";
    }
    if (fatura.sehir.trim().length < 2) {
      yeniHatalar.sehir = "Şehir bilgisini girin.";
    }
    if (kurumsal && !/^\d{10,11}$/.test(fatura.kimlikVergiNo)) {
      yeniHatalar.kimlikVergiNo = "Vergi no veya TCKN 10 ya da 11 haneli olmalıdır.";
    }
    if (kurumsal && fatura.adres.trim().length < 10) {
      yeniHatalar.adres = "Fatura adresi en az 10 karakter olmalıdır.";
    }
    if (!onay) {
      yeniHatalar.onay = "Ödeme öncesi yasal bilgilendirme onayını işaretleyin.";
    }

    setHatalar(yeniHatalar);
    return Object.keys(yeniHatalar).length === 0;
  };

  const odemeBaslat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dogrula()) return;

    setYukleniyor(true);
    try {
      const res = await fetch("/api/odeme/baslat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ davetiyeId, faturaBilgileri: fatura, yasalOnay: true }),
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

  if (!adminMi) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 via-white to-purple-50 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Ödeme Bekliyor</p>
            <h2 className="mt-2 text-xl font-black text-gray-950">{baslik} taslak olarak hazır</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-xl">
              Ödeme sistemi henüz aktif değil. Çok yakında hizmetinize sunulacak.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-100 px-4 py-2">
            <span className="text-lg">⏳</span>
            <div>
              <p className="text-xs font-black text-amber-700 tracking-wide uppercase">Yakında</p>
              <p className="text-[11px] text-amber-600 font-medium">{tutarMetni(fiyat.toplamTutar)}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
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
                x
              </button>
            </div>
            <div className="max-h-[80dvh] overflow-y-auto">
              <div id="iyzipay-checkout-form" className="responsive" />
            </div>
          </div>
        </div>
      )}

      <section className="rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 via-white to-purple-50 p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr,360px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Ödeme Bekliyor</p>
            <h2 className="mt-2 text-xl font-black text-gray-950">{baslik} taslak olarak hazır</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
              Davetiyeniz ödeme tamamlanana kadar yayına alınmaz. Ödeme sonrası seçili özellikler aktifleşir ve paylaşım linki kullanılabilir.
            </p>

            <div className="mt-4 rounded-2xl border border-white bg-white/75 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400">Toplam tutar</p>
                  <p className="mt-1 text-3xl font-black text-gray-950">{tutarMetni(fiyat.toplamTutar)}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Taslak</span>
              </div>
              <div className="mt-4 space-y-2">
                {fiyat.kalemler.map(kalem => (
                  <div key={kalem.kod} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                    <span className="text-xs font-medium text-gray-600">{kalem.ad}</span>
                    <span className="text-xs font-bold text-gray-900">{tutarMetni(kalem.tutar)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={odemeBaslat} noValidate className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-1">
              {[
                { id: "bireysel", label: "Bireysel" },
                { id: "kurumsal", label: "Kurumsal" },
              ].map(secenek => (
                <button
                  key={secenek.id}
                  type="button"
                  onClick={() => alanGuncelle("faturaTipi", secenek.id)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    fatura.faturaTipi === secenek.id
                      ? "bg-white text-purple-700 shadow-sm ring-1 ring-purple-100"
                      : "text-gray-500"
                  }`}
                >
                  {secenek.label}
                </button>
              ))}
            </div>

            {hatalar.genel && (
              <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{hatalar.genel}</p>
            )}

            <div className="mt-4 space-y-3">
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

            <label className={`mt-4 flex cursor-pointer gap-3 rounded-2xl border p-3 ${hatalar.onay ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"}`}>
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
                {"'nı okudum; dijital hizmetin ödeme sonrası hemen başlamasını talep ediyor ve cayma hakkı istisnası hakkında bilgilendirildiğimi kabul ediyorum."}
              </span>
            </label>
            {hatalar.onay && <p className="mt-1.5 text-xs font-medium text-red-500">{hatalar.onay}</p>}

            <button
              type="submit"
              disabled={yukleniyor}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-purple-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-purple-200 transition hover:bg-purple-700 disabled:opacity-50"
            >
              {yukleniyor ? "Ödeme hazırlanıyor..." : "Güvenli Ödemeye Geç"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

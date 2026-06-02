"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Marka = {
  markaRenk: string | null;
  markaSlogani: string | null;
  destekTelefonu: string | null;
  instagramUrl: string | null;
  whatsappImzasi: string | null;
};

export default function PartnerMarkaAyarlari({
  firmaAdi,
  portalUrl,
  marka,
}: {
  firmaAdi: string;
  portalUrl: string;
  marka: Marka;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    markaRenk: marka.markaRenk || "#7c3aed",
    markaSlogani: marka.markaSlogani || "",
    destekTelefonu: marka.destekTelefonu || "",
    instagramUrl: marka.instagramUrl || "",
    whatsappImzasi: marka.whatsappImzasi || "",
  });
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [mesaj, setMesaj] = useState<{ tip: "hata" | "basari"; metin: string } | null>(null);
  const [kaydedildi, setKaydedildi] = useState(true);
  const [portalKopyalandi, setPortalKopyalandi] = useState(false);

  const baslangic = {
    markaRenk: marka.markaRenk || "#7c3aed",
    markaSlogani: marka.markaSlogani || "",
    destekTelefonu: marka.destekTelefonu || "",
    instagramUrl: marka.instagramUrl || "",
    whatsappImzasi: marka.whatsappImzasi || "",
  };

  const guncelle = (alan: keyof typeof form, deger: string) => {
    setForm(prev => {
      const yeni = { ...prev, [alan]: deger };
      setKaydedildi(JSON.stringify(yeni) === JSON.stringify(baslangic));
      return yeni;
    });
    setMesaj(null);
  };

  const kaydet = async () => {
    setKaydediliyor(true);
    setMesaj(null);
    try {
      const res = await fetch("/api/partner/marka", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.hata || "Marka ayarları kaydedilemedi.");
      setMesaj({ tip: "basari", metin: "Marka ayarları kaydedildi." });
      setKaydedildi(true);
      router.refresh();
    } catch (err) {
      setMesaj({ tip: "hata", metin: err instanceof Error ? err.message : "Marka ayarları kaydedilemedi." });
    } finally {
      setKaydediliyor(false);
    }
  };

  const portalLinkiniKopyala = async () => {
    try {
      await navigator.clipboard.writeText(portalUrl);
      setPortalKopyalandi(true);
      setTimeout(() => setPortalKopyalandi(false), 2000);
    } catch {
      setPortalKopyalandi(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              Marka Ayarları
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Müşteri ekranlarında markanız daha net görünsün
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Teslim portalı ve teklif metinlerinde kullanılacak kurumsal bilgileri yönetin.
              Müşteri kişisel verisi yazmayın.
            </p>
          </div>
          <div
            className="rounded-2xl border px-4 py-3"
            style={{ borderColor: `${form.markaRenk}22`, backgroundColor: `${form.markaRenk}10` }}
          >
            <p className="text-xs font-black" style={{ color: form.markaRenk }}>{firmaAdi}</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-gray-600">
              {form.markaSlogani || "Müşteri teslim portalı sloganınız burada görünür."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_0.8fr] lg:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold text-gray-500">Marka rengi</span>
            <div className="mt-1 flex gap-2">
              <input
                type="color"
                value={form.markaRenk}
                onChange={e => guncelle("markaRenk", e.target.value)}
                className="h-12 w-14 shrink-0 cursor-pointer rounded-2xl border border-gray-200 bg-white p-1"
                aria-label="Marka rengi"
              />
              <input
                value={form.markaRenk}
                onChange={e => guncelle("markaRenk", e.target.value)}
                maxLength={7}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-bold text-gray-500">Destek telefonu</span>
            <input
              value={form.destekTelefonu}
              onChange={e => guncelle("destekTelefonu", e.target.value)}
              maxLength={30}
              placeholder="Örn. +90 5xx xxx xx xx"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-bold text-gray-500">Müşteri teslim sloganı</span>
            <input
              value={form.markaSlogani}
              onChange={e => guncelle("markaSlogani", e.target.value)}
              maxLength={120}
              placeholder="Örn. Etkinlik gününüz için dijital deneyiminiz hazır."
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-gray-500">Instagram</span>
            <input
              value={form.instagramUrl}
              onChange={e => guncelle("instagramUrl", e.target.value)}
              maxLength={160}
              placeholder="@firmaadi veya instagram.com/firmaadi"
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-gray-500">WhatsApp teklif imzası</span>
            <input
              value={form.whatsappImzasi}
              onChange={e => guncelle("whatsappImzasi", e.target.value)}
              maxLength={160}
              placeholder="Örn. Detaylar için bize WhatsApp'tan yazabilirsiniz."
              className="mt-1 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-4 rounded-2xl border border-purple-100 bg-purple-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Müşteri portalı</p>
            <p className="mt-2 text-sm font-black text-gray-950">Markalı public sayfanız hazır</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Bu link kişisel veri içermez. Instagram bio, WhatsApp teklif metni veya web sitenizde kullanabilirsiniz.
            </p>
            <div className="mt-3 rounded-2xl border border-purple-100 bg-white px-3 py-2 text-xs font-semibold text-gray-500 break-all">
              {portalUrl}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={portalLinkiniKopyala}
                className="rounded-xl bg-purple-600 px-3 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700"
              >
                {portalKopyalandi ? "Kopyalandı" : "Linki Kopyala"}
              </button>
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-purple-200 bg-white px-3 py-2.5 text-center text-xs font-black text-purple-700 transition-colors hover:bg-purple-100"
              >
                Sayfayı Aç
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Önizleme</p>
            <div className="mt-4 rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black text-white"
                  style={{ backgroundColor: form.markaRenk }}
                >
                  {firmaAdi.slice(0, 1).toLocaleUpperCase("tr-TR")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-gray-900">{firmaAdi}</p>
                  <p className="text-xs font-semibold" style={{ color: form.markaRenk }}>
                    Müşteri teslim portalı
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {form.markaSlogani || "Slogan girildiğinde müşterinin aktivasyon ekranında görünür."}
              </p>
              {(form.destekTelefonu || form.instagramUrl) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {form.destekTelefonu && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      {form.destekTelefonu}
                    </span>
                  )}
                  {form.instagramUrl && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      Instagram
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {!kaydedildi && !mesaj && (
            <p className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700">
              Kaydedilmemiş değişiklikler var.
            </p>
          )}
          <button
            type="button"
            onClick={kaydet}
            disabled={kaydediliyor || kaydedildi}
            className="mt-3 w-full rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700 disabled:opacity-40"
          >
            {kaydediliyor ? "Kaydediliyor..." : "Marka Ayarlarını Kaydet"}
          </button>
          {mesaj && (
            <p className={`mt-3 rounded-2xl px-4 py-3 text-xs font-semibold ${
              mesaj.tip === "basari"
                ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border border-red-100 bg-red-50 text-red-600"
            }`}>
              {mesaj.metin}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

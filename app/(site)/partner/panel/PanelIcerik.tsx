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
  otomatikYenileme: boolean;
  abonelikDurumu: string;
  sonrakiTahsilatAt: string | null;
} | null;

type OdemeKayit = {
  id: string;
  createdAt: string;
  planId: string;
  paidPrice: string | null;
  currency: string | null;
  paymentId: string | null;
  fiyatKirilimi: unknown;
};

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
  odemeGecmisi = [],
}: {
  partner: { id: string; firmaAdi: string };
  abonelik: Abonelik;
  odemeBasarili: boolean;
  odemeGecmisi?: OdemeKayit[];
}) {
  const [secilenPaket, setSecilenPaket] = useState<PartnerPaketId | null>(null);
  const [yenilemeFormAcik, setYenilemeFormAcik] = useState(false);
  const [fatura, setFatura] = useState<Fatura>(BOS_FATURA);
  const [hatalar, setHatalar] = useState<Partial<Record<string, string>>>({});
  const [onay, setOnay] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState<string | null>(null);
  const [iptalOnay, setIptalOnay] = useState(false);
  const [iptalYukleniyor, setIptalYukleniyor] = useState(false);
  const [kartYukleniyor, setKartYukleniyor] = useState(false);
  const [abonelikMesaj, setAbonelikMesaj] = useState<{ tip: "hata" | "basari"; metin: string } | null>(null);

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
        body: JSON.stringify({ paketId: secilenPaket, faturaBilgileri: fatura, yasalOnay: true }),
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

  const abonelikIptal = async () => {
    setIptalYukleniyor(true);
    setAbonelikMesaj(null);
    try {
      const res = await fetch("/api/partner/abonelik/iptal", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setAbonelikMesaj({ tip: "basari", metin: "Otomatik yenileme iptal edildi. Aboneliğiniz dönem sonuna kadar aktif kalır." });
        setIptalOnay(false);
      } else {
        setAbonelikMesaj({ tip: "hata", metin: data.hata ?? "İptal işlemi başarısız oldu." });
      }
    } catch {
      setAbonelikMesaj({ tip: "hata", metin: "Sunucuya bağlanılamadı." });
    } finally {
      setIptalYukleniyor(false);
    }
  };

  const kartGuncelle = async () => {
    setKartYukleniyor(true);
    setAbonelikMesaj(null);
    try {
      const res = await fetch("/api/partner/abonelik/kart-guncelle", { method: "POST" });
      const data = await res.json();
      if (data.checkoutFormContent) {
        setCheckoutHtml(data.checkoutFormContent);
      } else {
        setAbonelikMesaj({ tip: "hata", metin: data.hata ?? "Kart güncelleme başlatılamadı." });
      }
    } catch {
      setAbonelikMesaj({ tip: "hata", metin: "Sunucuya bağlanılamadı." });
    } finally {
      setKartYukleniyor(false);
    }
  };

  const inputCls = (alan: string) =>
    `w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-all ${
      hatalar[alan]
        ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
    }`;
  const abonelikKalanHak = abonelik ? abonelik.hakSayisi - abonelik.kullanilanHak : 0;
  const abonelikBitisDate = abonelik?.bitisAt ? new Date(abonelik.bitisAt) : null;
  const abonelikKalanGun = abonelikBitisDate
    ? Math.ceil((abonelikBitisDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const abonelikYakindaBitiyor = abonelikKalanGun !== null && abonelikKalanGun <= 5;
  const abonelikHakTukendi = abonelik !== null && abonelikKalanHak <= 0;
  const yenilemeAksiyonuGerekli = abonelikHakTukendi || abonelikYakindaBitiyor;
  const paketPanelAcik = !abonelik || yenilemeFormAcik || yenilemeAksiyonuGerekli;

  return (
    <div className="space-y-6">
      {/* Başarı bildirimi */}
      {odemeBasarili && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 text-sm text-green-700 font-semibold">
          ✅ Ödeme başarılı! Aboneliğiniz aktive edildi.
        </div>
      )}

      {/* Abonelik yönetimi: otomatik yenileme */}
      {abonelik && abonelik.otomatikYenileme && abonelik.abonelikDurumu === "aktif" && (
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm px-6 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Otomatik Yenileme</p>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <p className="text-sm font-bold text-green-700">Aktif</p>
              </div>
              {abonelik.sonrakiTahsilatAt && (
                <p className="text-xs text-gray-500">
                  Sonraki tahsilat:{" "}
                  <strong>
                    {new Date(abonelik.sonrakiTahsilatAt).toLocaleDateString("tr-TR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </strong>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={kartGuncelle}
                disabled={kartYukleniyor}
                className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {kartYukleniyor ? "…" : "Kartı Güncelle"}
              </button>
              <button
                type="button"
                onClick={() => { setIptalOnay(true); setAbonelikMesaj(null); }}
                className="text-xs font-bold px-4 py-2 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
              >
                Aboneliği İptal Et
              </button>
            </div>
          </div>

          {iptalOnay && (
            <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl px-4 py-4">
              <p className="text-sm font-bold text-red-700 mb-1">Emin misiniz?</p>
              <p className="text-xs text-red-500 mb-3 leading-relaxed">
                Otomatik yenileme iptal edilecek. Aboneliğiniz mevcut dönem sonuna kadar geçerliliğini korur; yenilenmeyecek.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={abonelikIptal}
                  disabled={iptalYukleniyor}
                  className="text-xs font-black px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {iptalYukleniyor ? "İptal ediliyor…" : "Evet, İptal Et"}
                </button>
                <button
                  type="button"
                  onClick={() => setIptalOnay(false)}
                  className="text-xs font-semibold px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}

          {abonelikMesaj && (
            <div className={`mt-3 rounded-xl px-4 py-3 text-xs font-semibold ${
              abonelikMesaj.tip === "basari"
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}>
              {abonelikMesaj.metin}
            </div>
          )}
        </div>
      )}

      {/* İptal edilmiş otomatik yenileme bildirimi */}
      {abonelik && !abonelik.otomatikYenileme && abonelik.abonelikDurumu === "iptal" && (
        <div className="rounded-3xl border border-orange-100 bg-orange-50 px-6 py-4">
          <p className="text-sm font-bold text-orange-700 mb-1">Otomatik yenileme kapalı</p>
          <p className="text-xs text-orange-600 leading-relaxed">
            Aboneliğiniz{abonelik.bitisAt
              ? ` ${new Date(abonelik.bitisAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihinde`
              : ""} sona erecek ve otomatik yenilenmeyecek.
          </p>
        </div>
      )}

      {abonelik && yenilemeAksiyonuGerekli && !yenilemeFormAcik && (
        <div className={`flex flex-col gap-3 rounded-3xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
          abonelikHakTukendi ? "border-red-100 bg-red-50" : "border-amber-100 bg-amber-50"
        }`}>
          <div>
            <p className={`text-sm font-black ${abonelikHakTukendi ? "text-red-700" : "text-amber-700"}`}>
              {abonelikHakTukendi ? "Dijital paket hakkınız bitti" : "Paket süreniz yakında bitiyor"}
            </p>
            <p className={`mt-1 text-xs leading-relaxed ${abonelikHakTukendi ? "text-red-500" : "text-amber-600"}`}>
              {abonelikHakTukendi
                ? "Yeni müşteri linki oluşturmak için paketinizi yenileyin."
                : `Paketiniz ${abonelikKalanGun} gün içinde sona eriyor; kesinti yaşamamak için yenileyebilirsiniz.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSecilenPaket(abonelik.paketId as PartnerPaketId);
              setYenilemeFormAcik(true);
            }}
            className={`rounded-xl px-4 py-2.5 text-xs font-black text-white transition-colors ${
              abonelikHakTukendi ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            Paketi Yenile
          </button>
        </div>
      )}

      {/* Paket seçimi / yenileme */}
      <details
        open={paketPanelAcik}
        className="group rounded-3xl border border-gray-100 bg-white shadow-sm"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
              {abonelik ? "Paket ve Ödeme" : "Paket Seç"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {abonelik
                ? `${paketGetir(abonelik.paketId)?.ad ?? abonelik.paketId} paketi aktif`
                : "Partner paketinizi seçip dijital paket hakkı alın."}
            </p>
          </div>
          <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-400 transition-transform group-open:rotate-180">
            ▼
          </span>
        </summary>

        <div className="border-t border-gray-100 px-6 pb-6 pt-5">
          {abonelik && !yenilemeFormAcik ? (
            <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4">
              <p className="text-sm font-bold text-blue-700 mb-1">Aktif paketiniz devam ediyor</p>
              <p className="text-xs text-blue-500 leading-relaxed">
                {abonelik.bitisAt
                  ? <>Paketiniz <strong>{new Date(abonelik.bitisAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</strong> tarihine kadar geçerli. Yenileme, bitişe 5 gün kala veya haklar bitince açılır.</>
                  : "Paketiniz aktif olduğu sürece yeni paket satın alınamaz."}
              </p>
            </div>
          ) : (
            <>
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
                      <p className="text-xs text-gray-500">Ayda {paket.hakSayisi} dijital paket hakkı</p>
                    </button>
                  );
                })}
              </div>

              {secilenPaket && !checkoutHtml && (
                <form onSubmit={odemeBaslat} className="border-t border-gray-100 pt-6 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Fatura Bilgileri</p>

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
                      <Link href="/partner/on-bilgilendirme" target="_blank" className="text-purple-600 hover:underline">Partner Ön Bilgilendirme</Link>
                      {", "}
                      <Link href="/partner/abonelik-sozlesmesi" target="_blank" className="text-purple-600 hover:underline">Partner Abonelik Sözleşmesi</Link>
                      {" ve "}
                      <Link href="/partner/sozlesme" target="_blank" className="text-purple-600 hover:underline">Partner Sözleşmesi</Link>
                      {"'ni okudum; dijital hizmetin ödeme sonrası hemen başlamasını talep ediyor, cayma hakkı istisnası hakkında bilgilendirildiğimi ve seçilen paketin aylık olarak kayıtlı kartımdan otomatik tahsil edileceğini kabul ediyorum. Otomatik yenilemeyi istediğim zaman iptal edebilirim."}
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
            </>
          )}
        </div>
      </details>

      {/* Ödeme Geçmişi */}
      {odemeGecmisi.length > 0 && (
        <details className="group rounded-3xl border border-gray-100 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Ödeme Geçmişi</p>
              <p className="mt-1 text-sm text-gray-500">{odemeGecmisi.length} ödeme kaydı</p>
            </div>
            <span className="rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-400 transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>
          <div className="space-y-3 border-t border-gray-100 px-6 pb-6 pt-5">
            {odemeGecmisi.map(kayit => {
              const fk = kayit.fiyatKirilimi as { paketAd?: string; tutar?: number; hakSayisi?: number } | null;
              const paketAd = fk?.paketAd ?? paketGetir(kayit.planId)?.ad ?? kayit.planId;
              const hakSayisi = fk?.hakSayisi ?? paketGetir(kayit.planId)?.hakSayisi;
              const tutar = kayit.paidPrice ? parseFloat(kayit.paidPrice) : (fk?.tutar ?? 0);
              const tarih = new Date(kayit.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
              return (
                <div key={kayit.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{paketAd} Paketi</p>
                      {hakSayisi && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">
                          {hakSayisi} hak
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{tarih}</p>
                    {kayit.paymentId && (
                      <p className="text-[10px] text-gray-300 mt-0.5 font-mono truncate">#{kayit.paymentId}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-gray-900">
                      ₺{tutar.toLocaleString("tr-TR")}
                    </p>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Ödendi
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      )}

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

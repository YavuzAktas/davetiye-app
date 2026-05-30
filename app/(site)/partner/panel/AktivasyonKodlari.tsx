"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Kod = {
  id: string;
  kod: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
  not: string | null;
};

type Abonelik = {
  hakSayisi: number;
  kullanilanHak: number;
} | null;

const DURUM_ETIKET: Record<string, { label: string; cls: string }> = {
  olusturuldu:          { label: "Oluşturuldu",          cls: "bg-gray-100 text-gray-600" },
  gonderildi:           { label: "Gönderildi",           cls: "bg-blue-100 text-blue-700" },
  kayit_oldu:           { label: "Kayıt Oldu",           cls: "bg-yellow-100 text-yellow-700" },
  odeme_bekliyor:       { label: "Ödeme Bekliyor",       cls: "bg-orange-100 text-orange-700" },
  davetiye_olusturuldu: { label: "Davetiye Oluşturuldu", cls: "bg-orange-100 text-orange-700" },
  yayinda:              { label: "Yayında",              cls: "bg-green-100 text-green-700" },
  iptal:                { label: "İptal",                cls: "bg-red-100 text-red-500" },
};

const IPTAL_EDILEBILİR = new Set(["olusturuldu", "gonderildi"]);

const VARSAYILAN_MESAJ = (firma: string) =>
  `Merhaba! ${firma} aracılığıyla size özel bir dijital davetiye hakkı sunuyoruz.\n\nDavetiyenizi oluşturmak için:\n{{link}}\n\nBu bağlantı yalnızca size özeldir.`;

export default function AktivasyonKodlari({
  firmaAdi,
  abonelik,
  kodlar: ilkKodlar,
}: {
  firmaAdi: string;
  abonelik: Abonelik;
  kodlar: Kod[];
}) {
  const router = useRouter();
  const [olusturuluyor, setOlusturuluyor] = useState(false);
  const [iptalEdilenKod, setIptalEdilenKod] = useState<string | null>(null);
  const [kopyalananKod, setKopyalananKod] = useState<string | null>(null);
  const [hata, setHata] = useState("");
  const [adet, setAdet] = useState(1);

  // WhatsApp mesaj şablonu
  const [mesajSablonu, setMesajSablonu] = useState(() => VARSAYILAN_MESAJ(firmaAdi));
  const [mesajAcik, setMesajAcik] = useState(false);

  // Satır içi kod etiketi düzenleme
  const [notDuzenlemeKod, setNotDuzenlemeKod] = useState<string | null>(null);
  const [notDeger, setNotDeger] = useState("");
  const [notKaydediliyor, setNotKaydediliyor] = useState(false);

  const kalanHak = abonelik ? abonelik.hakSayisi - abonelik.kullanilanHak : 0;
  const olusturulabilir = abonelik !== null && kalanHak > 0;
  const maxAdet = Math.min(5, kalanHak);

  const aktivasyonUrl = (kod: string) => {
    const base = process.env.NEXT_PUBLIC_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}/partner/aktivasyon/${kod}`;
  };

  const whatsappMesaji = (kod: string) => {
    const url = aktivasyonUrl(kod);
    return encodeURIComponent(mesajSablonu.replace("{{link}}", url));
  };

  const olustur = async () => {
    setOlusturuluyor(true);
    setHata("");
    try {
      const res = await fetch("/api/partner/aktivasyon/olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adet }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setHata(d.error ?? "Kod oluşturulamadı.");
      } else {
        setAdet(1);
        router.refresh();
      }
    } catch {
      setHata("Sunucuya bağlanılamadı.");
    } finally {
      setOlusturuluyor(false);
    }
  };

  const iptalEt = async (kod: string) => {
    if (!confirm("Bu aktivasyon kodunu iptal etmek istediğinizden emin misiniz?")) return;
    setIptalEdilenKod(kod);
    try {
      const res = await fetch(`/api/partner/aktivasyon/${kod}`, { method: "PATCH" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setHata(d.error ?? "İptal edilemedi.");
      } else {
        router.refresh();
      }
    } catch {
      setHata("Sunucuya bağlanılamadı.");
    } finally {
      setIptalEdilenKod(null);
    }
  };

  const kopyala = async (kod: string) => {
    try {
      await navigator.clipboard.writeText(aktivasyonUrl(kod));
      setKopyalananKod(kod);
      setTimeout(() => setKopyalananKod(null), 2000);
    } catch {
      setHata("Kopyalanamadı.");
    }
  };

  const whatsappGonder = async (kod: string, mevcutDurum: string) => {
    window.open(`https://wa.me/?text=${whatsappMesaji(kod)}`, "_blank", "noopener,noreferrer");
    if (mevcutDurum === "olusturuldu") {
      await fetch(`/api/partner/aktivasyon/${kod}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "gonderildi" }),
      }).then(() => router.refresh()).catch(() => {});
    }
  };

  const notKaydet = async (kod: string) => {
    setNotKaydediliyor(true);
    try {
      const res = await fetch(`/api/partner/aktivasyon/${kod}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "not-guncelle", not: notDeger }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setHata(d.error ?? "Kod etiketi kaydedilemedi.");
        return;
      }
      setNotDuzenlemeKod(null);
      router.refresh();
    } catch {
      setHata("Kod etiketi kaydedilemedi.");
    } finally {
      setNotKaydediliyor(false);
    }
  };

  const notDuzenlemeBaslat = (kod: string, mevcutNot: string | null) => {
    setNotDuzenlemeKod(kod);
    setNotDeger(mevcutNot ?? "");
  };

  const aktifKodlar = ilkKodlar.filter(k => k.durum !== "iptal");
  const iptalKodlar = ilkKodlar.filter(k => k.durum === "iptal");
  const yayindaKodlar = ilkKodlar.filter(k => k.durum === "yayinda");
  const kullanilmisKodlar = ilkKodlar.filter(k =>
    ["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu", "yayinda"].includes(k.durum)
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* Başlık + oluştur butonu */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Aktivasyon Kodları</p>
          {abonelik && (
            <p className="text-xs text-gray-400 mt-0.5">
              {kalanHak} / {abonelik.hakSayisi} hak kaldı
            </p>
          )}
        </div>

        {/* Toplu oluştur kontrolü */}
        <div className="flex items-center gap-2">
          {olusturulabilir && maxAdet > 1 && (
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setAdet(a => Math.max(1, a - 1))}
                disabled={adet <= 1}
                className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 text-sm font-bold"
              >−</button>
              <span className="px-3 text-sm font-semibold text-gray-700 min-w-7 text-center tabular-nums">{adet}</span>
              <button
                type="button"
                onClick={() => setAdet(a => Math.min(maxAdet, a + 1))}
                disabled={adet >= maxAdet}
                className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30 text-sm font-bold"
              >+</button>
            </div>
          )}
          <button
            onClick={olustur}
            disabled={!olusturulabilir || olusturuluyor}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {olusturuluyor ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <span className="text-base leading-none">+</span>
            )}
            {adet > 1 ? `${adet} Kod Oluştur` : "Yeni Kod"}
          </button>
        </div>
      </div>

      {/* İstatistikler */}
      {ilkKodlar.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-black text-gray-900">{aktifKodlar.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Aktif</p>
          </div>
          <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-black text-gray-900">{kullanilmisKodlar.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Kullanılan</p>
          </div>
          <div className="bg-green-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-black text-green-700">{yayindaKodlar.length}</p>
            <p className="text-[11px] text-green-600 mt-0.5">Yayında</p>
          </div>
        </div>
      )}

      {!abonelik && (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 text-center">
          <p className="text-sm font-bold text-purple-700 mb-1">Henüz aktif paketiniz yok</p>
          <p className="text-xs text-purple-500">Aktivasyon kodu oluşturmak için aşağıdan bir paket satın alın.</p>
        </div>
      )}

      {abonelik && kalanHak === 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-center">
          <p className="text-sm font-bold text-red-600 mb-1">Tüm haklarınız kullanıldı</p>
          <p className="text-xs text-red-400">Yeni kod oluşturmak için paketinizi aşağıdan yenileyin.</p>
        </div>
      )}

      {hata && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{hata}</p>
      )}

      {/* WhatsApp mesaj şablonu editörü */}
      {ilkKodlar.length > 0 && (
        <div className="border border-dashed border-gray-200 rounded-2xl p-3">
          <button
            type="button"
            onClick={() => setMesajAcik(v => !v)}
            className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span>WhatsApp mesajını özelleştir</span>
            <span className="text-[10px]">{mesajAcik ? "▲" : "▼"}</span>
          </button>
          {mesajAcik && (
            <div className="mt-3 space-y-2">
              <textarea
                value={mesajSablonu}
                onChange={e => setMesajSablonu(e.target.value)}
                rows={5}
                className="w-full text-xs text-gray-700 border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400">
                  <code className="bg-gray-100 px-1 rounded">{"{{link}}"}</code> → aktivasyon bağlantısı
                </p>
                <button
                  type="button"
                  onClick={() => setMesajSablonu(VARSAYILAN_MESAJ(firmaAdi))}
                  className="text-[10px] text-purple-500 hover:text-purple-700 transition-colors"
                >
                  Sıfırla
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Aktif kodlar */}
      {aktifKodlar.length > 0 && (
        <div className="space-y-3">
          {aktifKodlar.map(k => {
            const etiket = DURUM_ETIKET[k.durum] ?? DURUM_ETIKET.olusturuldu;
            const url = aktivasyonUrl(k.kod);
            const notDuzenlemede = notDuzenlemeKod === k.kod;
            return (
              <div key={k.id} className="border border-gray-100 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${etiket.cls}`}>
                    {etiket.label}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(k.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                {k.durum === "odeme_bekliyor" && (
                  <p className="text-xs text-orange-600 bg-orange-50 rounded-xl px-3 py-2">
                    Müşteri davetiyesini oluşturdu fakat ek özellikler için ödeme bekleniyor.
                  </p>
                )}

                {["kayit_oldu", "davetiye_olusturuldu"].includes(k.durum) && (
                  <p className="text-xs text-gray-500">Bu aktivasyon linki müşteri tarafından kullanıldı.</p>
                )}

                {k.durum === "yayinda" && (
                  <p className="text-xs text-gray-500">Davetiye yayında. Gizlilik gereği davetiye bağlantısı partner panelinde gösterilmez.</p>
                )}

                {/* Kod etiketi alanı */}
                {notDuzenlemede ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={notDeger}
                        onChange={e => setNotDeger(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") notKaydet(k.kod); if (e.key === "Escape") setNotDuzenlemeKod(null); }}
                        maxLength={60}
                        placeholder="Kod etiketi: örn. Salon A-12"
                        className="flex-1 text-xs border border-purple-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-300"
                      />
                      <button
                        onClick={() => notKaydet(k.kod)}
                        disabled={notKaydediliyor}
                        className="text-[11px] font-bold text-white bg-purple-600 px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {notKaydediliyor ? "…" : "Kaydet"}
                      </button>
                      <button
                        onClick={() => setNotDuzenlemeKod(null)}
                        className="text-[11px] text-gray-400 hover:text-gray-600 px-2 py-1.5"
                      >
                        İptal
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Dahili takip içindir; müşteri adı, telefon, e-posta veya TCKN yazmayın.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => notDuzenlemeBaslat(k.kod, k.not)}
                    className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors group"
                  >
                    {k.not ? (
                      <>
                        <span className="text-gray-600 font-medium">{k.not}</span>
                        <span className="text-gray-300 group-hover:text-gray-500">✏</span>
                      </>
                    ) : (
                      <span className="italic">+ Kod etiketi ekle</span>
                    )}
                  </button>
                )}

                {/* Link */}
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 min-w-0">
                  <span className="text-[11px] text-gray-400 font-mono truncate flex-1 min-w-0">{url}</span>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => kopyala(k.kod)}
                    className="text-[11px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors px-3 py-1.5 rounded-lg"
                  >
                    {kopyalananKod === k.kod ? "✓ Kopyalandı" : "Kopyala"}
                  </button>
                  <button
                    onClick={() => whatsappGonder(k.kod, k.durum)}
                    className="text-[11px] font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-colors px-3 py-1.5 rounded-lg"
                  >
                    {k.durum === "olusturuldu" ? "WhatsApp ile Gönder" : "WhatsApp"}
                  </button>
                  {IPTAL_EDILEBILİR.has(k.durum) && (
                    <button
                      onClick={() => iptalEt(k.kod)}
                      disabled={iptalEdilenKod === k.kod}
                      className="text-[11px] font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      {iptalEdilenKod === k.kod ? "…" : "İptal Et"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* İptal edilmiş kodlar (katlanabilir) */}
      {iptalKodlar.length > 0 && (
        <details className="group">
          <summary className="text-xs text-gray-400 cursor-pointer select-none hover:text-gray-600 transition-colors list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">›</span>
            {iptalKodlar.length} iptal edilmiş kod
          </summary>
          <div className="mt-3 space-y-2">
            {iptalKodlar.map(k => (
              <div key={k.id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl opacity-50">
                <span className="text-[11px] font-mono text-gray-400 truncate">{aktivasyonUrl(k.kod)}</span>
                <span className="text-[11px] text-gray-400 shrink-0 ml-3">
                  {new Date(k.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}

      {ilkKodlar.length === 0 && abonelik && (
        <p className="text-sm text-gray-400 text-center py-4">
          Henüz aktivasyon kodu oluşturulmamış.
        </p>
      )}
    </div>
  );
}

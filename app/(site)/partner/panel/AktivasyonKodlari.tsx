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

type YeniKod = {
  id: string;
  kod: string;
};

type DurumFiltresi = "tum" | "aksiyon" | "surecte" | "yayinda";

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
const AKSIYON_DURUMLARI = new Set(["olusturuldu", "gonderildi", "odeme_bekliyor"]);
const SURECTE_DURUMLARI = new Set(["kayit_oldu", "davetiye_olusturuldu"]);
const AKIS_ADIMLARI = [
  { key: "olusturuldu", label: "Kod" },
  { key: "gonderildi", label: "Gönderildi" },
  { key: "kayit_oldu", label: "Kayıt" },
  { key: "yayinda", label: "Yayın" },
] as const;

const VARSAYILAN_MESAJ = (firma: string) =>
  `Merhaba! ${firma} aracılığıyla size özel bir dijital davetiye hakkı sunuyoruz.\n\nDavetiyenizi oluşturmak için:\n{{link}}\n\nBu bağlantı yalnızca size özeldir.`;

function akisIndex(durum: string) {
  if (durum === "olusturuldu") return 0;
  if (durum === "gonderildi") return 1;
  if (durum === "kayit_oldu" || durum === "davetiye_olusturuldu" || durum === "odeme_bekliyor") return 2;
  if (durum === "yayinda") return 3;
  return -1;
}

function DurumAkisi({ durum }: { durum: string }) {
  const aktifIndex = akisIndex(durum);
  if (aktifIndex < 0) return null;

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {AKIS_ADIMLARI.map((adim, index) => {
        const tamamlandi = index <= aktifIndex;
        const aktif = index === aktifIndex;
        return (
          <div key={adim.key} className="min-w-0">
            <div className={`h-1.5 rounded-full ${tamamlandi ? "bg-purple-500" : "bg-gray-100"}`} />
            <p className={`mt-1 text-[10px] font-semibold truncate ${
              aktif ? "text-purple-700" : tamamlandi ? "text-gray-500" : "text-gray-300"
            }`}>
              {adim.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

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
  const [arama, setArama] = useState("");
  const [durumFiltresi, setDurumFiltresi] = useState<DurumFiltresi>("tum");
  const [sonOlusturulanKodlar, setSonOlusturulanKodlar] = useState<YeniKod[]>([]);
  const [topluKopyalandi, setTopluKopyalandi] = useState(false);

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
        const d = await res.json().catch(() => ({}));
        const yeniKodlar = Array.isArray(d.kodlar) ? d.kodlar as YeniKod[] : [];
        setSonOlusturulanKodlar(yeniKodlar);
        setArama("");
        setDurumFiltresi("tum");
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

  const yeniKodlariKopyala = async () => {
    if (sonOlusturulanKodlar.length === 0) return;

    try {
      await navigator.clipboard.writeText(
        sonOlusturulanKodlar.map(k => aktivasyonUrl(k.kod)).join("\n")
      );
      setTopluKopyalandi(true);
      setTimeout(() => setTopluKopyalandi(false), 2000);
    } catch {
      setHata("Linkler kopyalanamadı.");
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
  const aksiyonKodlar = aktifKodlar.filter(k => AKSIYON_DURUMLARI.has(k.durum));
  const surecteKodlar = aktifKodlar.filter(k => SURECTE_DURUMLARI.has(k.durum));
  const aramaMetni = arama.trim().toLocaleLowerCase("tr-TR");
  const filtrelenmisKodlar = aktifKodlar.filter(k => {
    const durumEslesir =
      durumFiltresi === "tum" ||
      (durumFiltresi === "aksiyon" && AKSIYON_DURUMLARI.has(k.durum)) ||
      (durumFiltresi === "surecte" && SURECTE_DURUMLARI.has(k.durum)) ||
      (durumFiltresi === "yayinda" && k.durum === "yayinda");

    if (!durumEslesir) return false;
    if (!aramaMetni) return true;

    const durumLabel = DURUM_ETIKET[k.durum]?.label ?? k.durum;
    return [k.kod, k.not ?? "", durumLabel]
      .some(deger => deger.toLocaleLowerCase("tr-TR").includes(aramaMetni));
  });
  const filtreler: { key: DurumFiltresi; label: string; count: number }[] = [
    { key: "tum", label: "Tümü", count: aktifKodlar.length },
    { key: "aksiyon", label: "Aksiyon", count: aksiyonKodlar.length },
    { key: "surecte", label: "Süreçte", count: surecteKodlar.length },
    { key: "yayinda", label: "Yayında", count: yayindaKodlar.length },
  ];
  const yeniKodSet = new Set(sonOlusturulanKodlar.map(k => k.kod));

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

      {sonOlusturulanKodlar.length > 0 && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-black text-green-800">
                {sonOlusturulanKodlar.length} yeni aktivasyon kodu hazır
              </p>
              <p className="mt-1 text-xs leading-relaxed text-green-700">
                Linkleri hemen müşterinize gönderebilir veya toplu kopyalayabilirsiniz.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSonOlusturulanKodlar([])}
              className="shrink-0 rounded-full px-2 py-1 text-xs font-bold text-green-700 hover:bg-green-100"
              aria-label="Yeni kod bildirimi kapat"
            >
              x
            </button>
          </div>
          <div className="mt-3 rounded-xl bg-white/70 px-3 py-2">
            <p className="truncate font-mono text-[11px] text-green-800">
              {aktivasyonUrl(sonOlusturulanKodlar[0].kod)}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => whatsappGonder(sonOlusturulanKodlar[0].kod, "olusturuldu")}
              className="rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-green-700"
            >
              İlk Kodu WhatsApp ile Gönder
            </button>
            <button
              type="button"
              onClick={yeniKodlariKopyala}
              className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-green-700 ring-1 ring-green-200 transition-colors hover:bg-green-100"
            >
              {topluKopyalandi ? "Linkler Kopyalandı" : "Tüm Yeni Linkleri Kopyala"}
            </button>
          </div>
        </div>
      )}

      {aktifKodlar.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-300">⌕</span>
            <input
              type="search"
              value={arama}
              onChange={e => setArama(e.target.value)}
              placeholder="Kod, etiket veya durum ara"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-3 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-purple-200 focus:bg-white focus:ring-2 focus:ring-purple-100"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtreler.map(filtre => {
              const secili = durumFiltresi === filtre.key;
              return (
                <button
                  key={filtre.key}
                  type="button"
                  onClick={() => setDurumFiltresi(filtre.key)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                    secili
                      ? "border-purple-200 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-purple-100 hover:text-purple-600"
                  }`}
                >
                  {filtre.label}
                  <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                    secili ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"
                  }`}>
                    {filtre.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
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
          {filtrelenmisKodlar.map(k => {
            const etiket = DURUM_ETIKET[k.durum] ?? DURUM_ETIKET.olusturuldu;
            const url = aktivasyonUrl(k.kod);
            const notDuzenlemede = notDuzenlemeKod === k.kod;
            const yeni = yeniKodSet.has(k.kod);
            return (
              <div key={k.id} className={`rounded-2xl border p-4 space-y-2.5 ${
                yeni ? "border-green-200 bg-green-50/30 ring-1 ring-green-100" : "border-gray-100 bg-white"
              }`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {yeni && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
                        Yeni
                      </span>
                    )}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${etiket.cls}`}>
                      {etiket.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(k.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                <DurumAkisi durum={k.durum} />

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
          {filtrelenmisKodlar.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-8 text-center">
              <p className="text-sm font-semibold text-gray-700">Bu filtrede kod bulunamadı</p>
              <p className="mt-1 text-xs text-gray-400">Arama metnini temizleyin veya farklı bir durum seçin.</p>
            </div>
          )}
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

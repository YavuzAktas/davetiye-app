"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { paketGetir } from "@/lib/partner-paketler";

type Kod = {
  id: string;
  kod: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
  not: string | null;
};

type Abonelik = {
  paketId: string;
  hakSayisi: number;
  kullanilanHak: number;
  bitisAt: string | null;
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

const WHATSAPP_MESAJ_SABLONLARI = (firma: string) => [
  {
    id: "standart",
    label: "Standart",
    aciklama: "Genel kullanım için dengeli ve net.",
    metin: VARSAYILAN_MESAJ(firma),
  },
  {
    id: "kisa",
    label: "Kısa",
    aciklama: "Hızlı paylaşım ve yoğun günler için.",
    metin: `Merhaba! ${firma} size özel dijital davetiye linkinizi hazırladı.\n\nDavetiyenizi buradan oluşturabilirsiniz:\n{{link}}`,
  },
  {
    id: "premium",
    label: "Premium",
    aciklama: "Daha özenli ve marka dili güçlü.",
    metin: `Merhaba,\n\n${firma} olarak size özel dijital davetiye hakkınızı tanımladık. Davetiyenizi birkaç adımda hazırlayıp yayına alabilirsiniz.\n\nBaşlamak için bağlantınız:\n{{link}}\n\nBu bağlantı size özeldir.`,
  },
] as const;

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
  destekTelefonu,
  instagramUrl,
  whatsappImzasi,
  abonelik,
  kodlar: ilkKodlar,
}: {
  firmaAdi: string;
  destekTelefonu?: string | null;
  instagramUrl?: string | null;
  whatsappImzasi?: string | null;
  abonelik: Abonelik;
  kodlar: Kod[];
}) {
  const router = useRouter();
  const [olusturuluyor, setOlusturuluyor] = useState(false);
  const [iptalEdilenKod, setIptalEdilenKod] = useState<string | null>(null);
  const [iptalOnayKodu, setIptalOnayKodu] = useState<string | null>(null);
  const [kopyalananKod, setKopyalananKod] = useState<string | null>(null);
  const [hata, setHata] = useState("");
  const [adet, setAdet] = useState(1);
  const [arama, setArama] = useState("");
  const [durumFiltresi, setDurumFiltresi] = useState<DurumFiltresi>("tum");
  const [sonOlusturulanKodlar, setSonOlusturulanKodlar] = useState<YeniKod[]>([]);
  const [topluKopyaDurumu, setTopluKopyaDurumu] = useState<string | null>(null);
  const [teslimPaketiAcikKod, setTeslimPaketiAcikKod] = useState<string | null>(null);
  const [teslimPaketiKopyalananKod, setTeslimPaketiKopyalananKod] = useState<string | null>(null);

  // WhatsApp mesaj şablonu
  const [mesajSablonu, setMesajSablonu] = useState(() => VARSAYILAN_MESAJ(firmaAdi));
  const [aktifMesajSablonu, setAktifMesajSablonu] = useState("standart");
  const [mesajAcik, setMesajAcik] = useState(false);

  // Satır içi kod etiketi düzenleme
  const [notDuzenlemeKod, setNotDuzenlemeKod] = useState<string | null>(null);
  const [notDeger, setNotDeger] = useState("");
  const [notKaydediliyor, setNotKaydediliyor] = useState(false);

  const kalanHak = abonelik ? abonelik.hakSayisi - abonelik.kullanilanHak : 0;
  const olusturulabilir = abonelik !== null && kalanHak > 0;
  const maxAdet = Math.min(5, kalanHak);
  const paket = abonelik ? paketGetir(abonelik.paketId) : null;
  const hakYuzdesi = abonelik
    ? Math.min(100, Math.max(0, (abonelik.kullanilanHak / abonelik.hakSayisi) * 100))
    : 0;
  const bitisDate = abonelik?.bitisAt ? new Date(abonelik.bitisAt) : null;
  const kalanGun = bitisDate
    ? Math.ceil((bitisDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const hakDurumu =
    kalanHak <= 0 ? "tukendi" :
    kalanHak <= 3 ? "azaldi" :
    kalanGun !== null && kalanGun <= 5 ? "yakinda" :
    "normal";

  const aktivasyonUrl = (kod: string) => {
    const base = process.env.NEXT_PUBLIC_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}/partner/aktivasyon/${kod}`;
  };

  const whatsappMesaji = (kod: string) => {
    const url = aktivasyonUrl(kod);
    const temizMesaj = mesajSablonu.trim();
    const mesaj = temizMesaj.includes("{{link}}")
      ? temizMesaj.replace("{{link}}", url)
      : `${temizMesaj}\n\n${url}`;
    return encodeURIComponent(mesaj);
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
    setIptalEdilenKod(kod);
    setHata("");
    try {
      const res = await fetch(`/api/partner/aktivasyon/${kod}`, { method: "PATCH" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setHata(d.error ?? "İptal edilemedi.");
      } else {
        setIptalOnayKodu(null);
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

  const linkSatirlari = (kodlar: { kod: string; not?: string | null }[]) =>
    kodlar.map(k => `${k.not ? `${k.not} - ` : ""}${aktivasyonUrl(k.kod)}`).join("\n");

  const topluLinkKopyala = async (
    kodlar: { kod: string; not?: string | null }[],
    durumAnahtari: string
  ) => {
    if (kodlar.length === 0) return;

    try {
      await navigator.clipboard.writeText(linkSatirlari(kodlar));
      setTopluKopyaDurumu(durumAnahtari);
      setTimeout(() => setTopluKopyaDurumu(null), 2000);
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

  const teslimPaketiMetni = (kod: string) => {
    const satirlar = [
      `Merhaba, ${firmaAdi} dijital davetiye teslim paketiniz hazır.`,
      "",
      "Başlamak için size özel aktivasyon bağlantısı:",
      aktivasyonUrl(kod),
      "",
      "Nasıl ilerleyeceksiniz?",
      "1. Bağlantıyı açıp hesabınızla devam edin.",
      "2. Davetiye şablonunuzu seçin.",
      "3. Etkinlik tarihi, konum ve davetiye metinlerinizi girin.",
      "4. Davetiyenizi yayına alıp link veya QR kod ile paylaşın.",
      "",
      "Bu bağlantı daha sonra da müşteri teslim portalınız olarak çalışır; davetiyeniz oluştuğunda aynı linkten panelinize ve davetiyenize ulaşabilirsiniz.",
      "",
      "Gizlilik notu:",
      "Davetli listesi, RSVP yanıtları, fotoğraf ve anı içerikleri sizin hesabınızda yönetilir. Partner panelinde yalnızca aktivasyon süreci ve yayın durumu görünür.",
    ];

    if (destekTelefonu?.trim() || instagramUrl?.trim()) {
      satirlar.push("", "Destek:");
      if (destekTelefonu?.trim()) satirlar.push(`Telefon: ${destekTelefonu.trim()}`);
      if (instagramUrl?.trim()) satirlar.push(`Instagram: ${instagramUrl.trim()}`);
    }

    if (whatsappImzasi?.trim()) {
      satirlar.push("", whatsappImzasi.trim());
    }

    return satirlar.join("\n");
  };

  const teslimPaketiKopyala = async (kod: string) => {
    try {
      await navigator.clipboard.writeText(teslimPaketiMetni(kod));
      setTeslimPaketiKopyalananKod(kod);
      setTimeout(() => setTeslimPaketiKopyalananKod(null), 2000);
    } catch {
      setHata("Teslim paketi kopyalanamadı.");
    }
  };

  const teslimPaketiWhatsappGonder = async (kod: string, mevcutDurum: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(teslimPaketiMetni(kod))}`, "_blank", "noopener,noreferrer");
    if (mevcutDurum === "olusturuldu") {
      await fetch(`/api/partner/aktivasyon/${kod}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "gonderildi" }),
      }).then(() => router.refresh()).catch(() => {});
    }
  };

  const teslimPaketiMailUrl = (kod: string) => {
    const konu = `${firmaAdi} dijital davetiye teslim paketiniz`;
    return `mailto:?subject=${encodeURIComponent(konu)}&body=${encodeURIComponent(teslimPaketiMetni(kod))}`;
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
  const gonderilecekKodlar = aktifKodlar.filter(k => k.durum === "olusturuldu");
  const yeniKodSet = new Set(sonOlusturulanKodlar.map(k => k.kod));
  const iptalOnay = ilkKodlar.find(k => k.kod === iptalOnayKodu) ?? null;
  const whatsappSablonlari = WHATSAPP_MESAJ_SABLONLARI(firmaAdi);

  return (
    <div id="aktivasyon-kodlari" className="scroll-mt-24 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* Başlık + oluştur butonu */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Aktivasyon Kodları</p>
          {abonelik && (
            <p className="text-xs text-gray-400 mt-0.5">
              {paket?.ad ?? abonelik.paketId} paketi
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

      {abonelik && (
        <div className={`rounded-3xl border p-4 sm:p-5 ${
          hakDurumu === "tukendi"
            ? "border-red-100 bg-red-50"
            : hakDurumu === "azaldi" || hakDurumu === "yakinda"
            ? "border-amber-100 bg-amber-50"
            : "border-purple-100 bg-purple-50"
        }`}>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                  hakDurumu === "tukendi"
                    ? "bg-red-100 text-red-700"
                    : hakDurumu === "azaldi" || hakDurumu === "yakinda"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  Hak Bakiyesi
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  {paket?.ad ?? abonelik.paketId} paketi
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/80">
                <div
                  className={`h-full rounded-full transition-all ${
                    hakDurumu === "tukendi"
                      ? "bg-red-500"
                      : hakDurumu === "azaldi" || hakDurumu === "yakinda"
                      ? "bg-amber-500"
                      : "bg-linear-to-r from-purple-500 to-pink-500"
                  }`}
                  style={{ width: `${hakYuzdesi}%` }}
                />
              </div>
              <p className={`mt-2 text-xs leading-relaxed ${
                hakDurumu === "tukendi"
                  ? "text-red-600"
                  : hakDurumu === "azaldi" || hakDurumu === "yakinda"
                  ? "text-amber-700"
                  : "text-purple-700"
              }`}>
                {hakDurumu === "tukendi"
                  ? "Yeni aktivasyon oluşturmak için paketinizi yenileyin."
                  : hakDurumu === "azaldi"
                  ? `Yalnızca ${kalanHak} hakkınız kaldı. Yeni müşterilerden önce yenileme planı yapın.`
                  : hakDurumu === "yakinda"
                  ? `Paketiniz ${kalanGun} gün içinde sona eriyor.`
                  : "Müşteri linki oluşturup WhatsApp ile paylaşmaya hazırsınız."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-64">
              <div className="rounded-2xl bg-white/80 px-3 py-3 text-center">
                <p className="text-xl font-black text-gray-900 tabular-nums">{kalanHak}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-gray-400">Kalan</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-3 py-3 text-center">
                <p className="text-xl font-black text-gray-900 tabular-nums">{abonelik.kullanilanHak}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-gray-400">Kullanılan</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-3 py-3 text-center">
                <p className="text-xl font-black text-gray-900 tabular-nums">
                  {kalanGun === null ? "-" : Math.max(0, kalanGun)}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-gray-400">Gün</p>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {ilkKodlar.length === 0 && abonelik && (
        <div className="overflow-hidden rounded-3xl border border-purple-100 bg-linear-to-br from-purple-50 via-white to-rose-50">
          <div className="p-5 sm:p-6">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-400">İlk aktivasyon</p>
              <h3 className="mt-2 text-lg font-black text-gray-900 sm:text-xl">
                İlk müşteri linkinizi oluşturun
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Partner müşteriniz davetiyesini bu link üzerinden ücretsiz başlatır. Panelde yalnızca kod durumu görünür; müşteri bilgisi paylaşılmaz.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["1", "Kod oluştur", "Tek kullanımlık aktivasyon linki hazırlanır."],
                ["2", "WhatsApp ile gönder", "Hazır mesajla müşteriye hızlıca iletilir."],
                ["3", "Durumu takip et", "Kayıt, süreç ve yayın durumları panelde görünür."],
              ].map(([sira, baslik, aciklama]) => (
                <div key={sira} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-black text-purple-700">
                    {sira}
                  </span>
                  <p className="mt-3 text-sm font-black text-gray-900">{baslik}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{aciklama}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-gray-500">
                Kalan hakkınız: <strong className="text-purple-700">{kalanHak}</strong>. Kod etiketi alanında müşteri adı, telefon veya e-posta tutmayın.
              </p>
              <button
                type="button"
                onClick={olustur}
                disabled={!olusturulabilir || olusturuluyor}
                className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
              >
                {olusturuluyor ? "Oluşturuluyor..." : "İlk Kodu Oluştur"}
              </button>
            </div>
          </div>
        </div>
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
              onClick={() => setTeslimPaketiAcikKod(sonOlusturulanKodlar[0].kod)}
              className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-700"
            >
              Teslim Paketini Aç
            </button>
            <button
              type="button"
              onClick={() => topluLinkKopyala(sonOlusturulanKodlar, "yeni")}
              className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-green-700 ring-1 ring-green-200 transition-colors hover:bg-green-100"
            >
              {topluKopyaDurumu === "yeni" ? "Linkler Kopyalandı" : "Tüm Yeni Linkleri Kopyala"}
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

      {aktifKodlar.length > 1 && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-gray-900">Toplu işlemler</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Filtrede görünen linkleri veya henüz gönderilmemiş kodları tek seferde kopyalayın.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => topluLinkKopyala(filtrelenmisKodlar, "filtre")}
                disabled={filtrelenmisKodlar.length === 0}
                className="rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-purple-600 ring-1 ring-purple-100 transition-colors hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {topluKopyaDurumu === "filtre"
                  ? "Kopyalandı"
                  : `Filtredekileri Kopyala (${filtrelenmisKodlar.length})`}
              </button>
              <button
                type="button"
                onClick={() => topluLinkKopyala(gonderilecekKodlar, "gonderilecek")}
                disabled={gonderilecekKodlar.length === 0}
                className="rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-green-700 ring-1 ring-green-100 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {topluKopyaDurumu === "gonderilecek"
                  ? "Kopyalandı"
                  : `Gönderilecekleri Kopyala (${gonderilecekKodlar.length})`}
              </button>
            </div>
          </div>

          {(arama || durumFiltresi !== "tum") && (
            <button
              type="button"
              onClick={() => {
                setArama("");
                setDurumFiltresi("tum");
              }}
              className="mt-3 text-[11px] font-bold text-gray-400 transition-colors hover:text-gray-600"
            >
              Filtreleri temizle
            </button>
          )}
        </div>
      )}

      {/* WhatsApp mesaj şablonu editörü */}
      {ilkKodlar.length > 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 p-3">
          <button
            type="button"
            onClick={() => setMesajAcik(v => !v)}
            className="flex w-full items-center justify-between text-xs text-gray-400 transition-colors hover:text-gray-600"
          >
            <span>WhatsApp mesajını özelleştir</span>
            <span className="text-[10px]">{mesajAcik ? "▲" : "▼"}</span>
          </button>
          {mesajAcik && (
            <div className="mt-3 space-y-3">
              <div className="grid gap-2 sm:grid-cols-3">
                {whatsappSablonlari.map(sablon => {
                  const secili = aktifMesajSablonu === sablon.id;
                  return (
                    <button
                      key={sablon.id}
                      type="button"
                      onClick={() => {
                        setAktifMesajSablonu(sablon.id);
                        setMesajSablonu(sablon.metin);
                      }}
                      className={`rounded-2xl border p-3 text-left transition-colors ${
                        secili
                          ? "border-purple-200 bg-purple-50 text-purple-800"
                          : "border-gray-100 bg-gray-50 text-gray-500 hover:border-purple-100 hover:bg-white"
                      }`}
                    >
                      <p className="text-xs font-black">{sablon.label}</p>
                      <p className="mt-1 text-[11px] leading-relaxed opacity-80">{sablon.aciklama}</p>
                    </button>
                  );
                })}
              </div>
              <textarea
                value={mesajSablonu}
                onChange={e => {
                  setMesajSablonu(e.target.value);
                  setAktifMesajSablonu("ozel");
                }}
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 p-3 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] leading-relaxed text-gray-400">
                  <code className="bg-gray-100 px-1 rounded">{"{{link}}"}</code> → aktivasyon bağlantısı
                  {!mesajSablonu.includes("{{link}}") && (
                    <span className="ml-1 font-semibold text-amber-600">Link gönderimde otomatik eklenecek.</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAktifMesajSablonu("standart");
                    setMesajSablonu(VARSAYILAN_MESAJ(firmaAdi));
                  }}
                  className="self-start rounded-lg bg-purple-50 px-2.5 py-1.5 text-[10px] font-bold text-purple-600 transition-colors hover:bg-purple-100 sm:self-auto"
                >
                  Standarta dön
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
              <div key={k.id} className={`rounded-2xl border p-4 space-y-3 ${
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
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                      <input
                        autoFocus
                        value={notDeger}
                        onChange={e => setNotDeger(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") notKaydet(k.kod); if (e.key === "Escape") setNotDuzenlemeKod(null); }}
                        maxLength={60}
                        placeholder="Kod etiketi: örn. Salon A-12"
                        className="col-span-2 min-w-0 rounded-xl border border-purple-200 px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-300 sm:flex-1 sm:rounded-lg sm:py-1.5"
                      />
                      <button
                        onClick={() => notKaydet(k.kod)}
                        disabled={notKaydediliyor}
                        className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50 sm:rounded-lg sm:py-1.5 sm:text-[11px]"
                      >
                        {notKaydediliyor ? "…" : "Kaydet"}
                      </button>
                      <button
                        onClick={() => setNotDuzenlemeKod(null)}
                        className="rounded-xl px-3 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 sm:rounded-lg sm:px-2 sm:py-1.5 sm:text-[11px]"
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
                <div className="rounded-xl bg-gray-50 px-3 py-2 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-300 sm:hidden">
                    Aktivasyon Linki
                  </p>
                  <span className="block truncate font-mono text-[11px] text-gray-400 sm:text-[11px]">{url}</span>
                </div>

                {/* Aksiyonlar */}
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                  <button
                    onClick={() => kopyala(k.kod)}
                    className="rounded-xl bg-purple-50 px-3 py-2.5 text-xs font-bold text-purple-600 transition-colors hover:bg-purple-100 sm:rounded-lg sm:py-1.5 sm:text-[11px]"
                  >
                    {kopyalananKod === k.kod ? "✓ Kopyalandı" : "Kopyala"}
                  </button>
                  <button
                    onClick={() => whatsappGonder(k.kod, k.durum)}
                    className="rounded-xl bg-green-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-green-700 sm:rounded-lg sm:bg-green-50 sm:py-1.5 sm:text-[11px] sm:text-green-700 sm:hover:bg-green-100"
                  >
                    {k.durum === "olusturuldu" ? "WhatsApp ile Gönder" : "WhatsApp"}
                  </button>
                  <button
                    onClick={() => setTeslimPaketiAcikKod(k.kod)}
                    className="rounded-xl bg-purple-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-purple-700 sm:rounded-lg sm:bg-purple-50 sm:py-1.5 sm:text-[11px] sm:text-purple-700 sm:hover:bg-purple-100"
                  >
                    Teslim Paketi
                  </button>
                  {IPTAL_EDILEBILİR.has(k.durum) && (
                    <button
                      onClick={() => setIptalOnayKodu(k.kod)}
                      disabled={iptalEdilenKod === k.kod}
                      className="col-span-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50 sm:col-span-1 sm:rounded-lg sm:py-1.5 sm:text-[11px]"
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

      {teslimPaketiAcikKod && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/45 px-4 py-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="teslim-paketi-baslik"
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
                    Müşteri Teslim Paketi
                  </p>
                  <h3 id="teslim-paketi-baslik" className="mt-1 text-xl font-black text-gray-950">
                    Hazır paylaşım metni
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
                    Aktivasyon linki, kullanım adımları ve gizlilik notunu tek metinde gönderin. Bu metin kaydedilmez.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTeslimPaketiAcikKod(null)}
                  className="rounded-full bg-gray-50 px-3 py-2 text-xs font-black text-gray-500 transition-colors hover:bg-gray-100"
                  aria-label="Teslim paketi penceresini kapat"
                >
                  x
                </button>
              </div>
            </div>

            <div className="max-h-[58vh] overflow-auto p-5 sm:p-6">
              <pre className="whitespace-pre-wrap rounded-2xl bg-gray-950 p-4 text-xs leading-relaxed text-gray-100 sm:text-sm">
                {teslimPaketiMetni(teslimPaketiAcikKod)}
              </pre>
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs font-black text-amber-800">KVKK notu</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-700">
                  Bu pakette müşteri adı, telefon veya e-posta saklanmaz. Partner yalnızca linki paylaşır; müşteri hesabındaki davetli ve anı verileri partner panelinde gösterilmez.
                </p>
              </div>
            </div>

            <div className="grid gap-2 border-t border-gray-100 p-4 sm:grid-cols-4 sm:p-5">
              <button
                type="button"
                onClick={() => teslimPaketiKopyala(teslimPaketiAcikKod)}
                className="rounded-xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
              >
                {teslimPaketiKopyalananKod === teslimPaketiAcikKod ? "Kopyalandı" : "Kopyala"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const kod = ilkKodlar.find(k => k.kod === teslimPaketiAcikKod);
                  teslimPaketiWhatsappGonder(teslimPaketiAcikKod, kod?.durum ?? "olusturuldu");
                }}
                className="rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-green-700"
              >
                WhatsApp
              </button>
              <a
                href={teslimPaketiMailUrl(teslimPaketiAcikKod)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 transition-colors hover:bg-gray-50"
              >
                E-posta
              </a>
              <button
                type="button"
                onClick={() => setTeslimPaketiAcikKod(null)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {iptalOnay && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/45 px-4 py-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aktivasyon-iptal-baslik"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-lg">
                !
              </div>
              <div className="min-w-0">
                <h3 id="aktivasyon-iptal-baslik" className="text-lg font-black text-gray-900">
                  Aktivasyon kodu iptal edilsin mi?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Bu link artık müşteri tarafından kullanılamaz. Kod henüz kullanılmadıysa hak bakiyenize geri eklenir.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                İptal edilecek link
              </p>
              <p className="mt-1 truncate font-mono text-xs text-gray-600">
                {aktivasyonUrl(iptalOnay.kod)}
              </p>
              {iptalOnay.not && (
                <p className="mt-2 text-xs font-semibold text-gray-500">{iptalOnay.not}</p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIptalOnayKodu(null)}
                disabled={iptalEdilenKod === iptalOnay.kod}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => iptalEt(iptalOnay.kod)}
                disabled={iptalEdilenKod === iptalOnay.kod}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {iptalEdilenKod === iptalOnay.kod ? "İptal ediliyor..." : "Evet, iptal et"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

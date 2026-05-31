"use client";

import { useMemo, useState } from "react";

type PaketId = "davet" | "operasyon" | "hatira" | "tam";

type Paket = {
  id: PaketId;
  ad: string;
  kisa: string;
  hedef: string;
  vurgu: string;
  maddeler: string[];
  teslimatlar: string[];
};

const PAKETLER: Paket[] = [
  {
    id: "davet",
    ad: "Dijital Davetiye Teslimi",
    kisa: "Müşteriye hızlı başlangıç paketi",
    hedef: "Davetiyeyi hızlıca yayına almak isteyen müşteriler",
    vurgu: "from-indigo-600 to-purple-600",
    maddeler: [
      "Dijital davetiye oluşturma hakkı",
      "WhatsApp ve sosyal medya paylaşım linki",
      "RSVP ve katılım yanıtı takibi",
      "Genel davetiye QR kodu",
    ],
    teslimatlar: [
      "Müşteriye özel aktivasyon linki",
      "Yayına hazır davetiye paneli",
      "Davetli paylaşım rehberi",
    ],
  },
  {
    id: "operasyon",
    ad: "Salon Operasyon Paketi",
    kisa: "Etkinlik günü salon ekibi için",
    hedef: "Giriş, masa ve salon ekranı akışını düzenlemek isteyen mekanlar",
    vurgu: "from-emerald-600 to-teal-500",
    maddeler: [
      "Etkinlik günü QR kiti",
      "QR check-in hazırlığı",
      "Masa ve giriş alanı için baskı materyalleri",
      "Salon TV için canlı duvar yönlendirmesi",
    ],
    teslimatlar: [
      "Baskıya hazır QR kit sayfası",
      "Giriş ekibi kullanım yönergesi",
      "Masa kartı ve pano QR çıktı rehberi",
    ],
  },
  {
    id: "hatira",
    ad: "Anı & İçerik Paketi",
    kisa: "Etkinlik sonrası değer üretir",
    hedef: "Fotoğraf, anı ve sosyal içerik toplamak isteyen çiftler",
    vurgu: "from-pink-600 to-rose-500",
    maddeler: [
      "Fotoğraf ve anı toplama alanı",
      "Canlı fotoğraf duvarı",
      "Sesli veya yazılı anı gönderimi",
      "Etkinlik sonrası anı arşivi",
    ],
    teslimatlar: [
      "Masa QR kartı",
      "Canlı duvar açılış linki",
      "Anı içerikleri yönetim paneli",
    ],
  },
  {
    id: "tam",
    ad: "Premium Etkinlik Deneyimi",
    kisa: "Satışta en güçlü paket",
    hedef: "Müşteriye tek kalemde premium dijital deneyim sunmak isteyen organizasyonlar",
    vurgu: "from-gray-950 to-purple-950",
    maddeler: [
      "Dijital davetiye ve lüks şablon deneyimi",
      "QR check-in, oturma planı ve RSVP takibi",
      "Canlı duvar, fotoğraf albümü ve anı akışı",
      "Etkinlik günü QR kiti ve baskı yönlendirmeleri",
    ],
    teslimatlar: [
      "Müşteri teslim portalı",
      "Etkinlik günü operasyon kiti",
      "Etkinlik sonrası anı yönetimi",
    ],
  },
];

const ETKINLIK_TURLERI = [
  "Düğün",
  "Nişan",
  "Kına",
  "Sünnet",
  "Doğum günü",
  "Kurumsal etkinlik",
  "Özel davet",
];

function paraFormatla(deger: string) {
  const sayi = Number(deger.replace(/[^\d]/g, ""));
  if (!sayi) return "";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(sayi);
}

export default function PartnerTeklifOlusturucu({
  firmaAdi,
  whatsappImzasi,
}: {
  firmaAdi: string;
  whatsappImzasi?: string | null;
}) {
  const [paketId, setPaketId] = useState<PaketId>("tam");
  const [etkinlikTuru, setEtkinlikTuru] = useState(ETKINLIK_TURLERI[0]);
  const [referans, setReferans] = useState("");
  const [tutar, setTutar] = useState("");
  const [not, setNot] = useState("");
  const [kopyalandi, setKopyalandi] = useState(false);

  const paket = PAKETLER.find(p => p.id === paketId) ?? PAKETLER[0];
  const tutarMetni = paraFormatla(tutar);
  const temizReferans = referans.trim();
  const temizNot = not.trim();

  const teklifMetni = useMemo(() => {
    const satirlar = [
      `Merhaba, ${firmaAdi} olarak ${etkinlikTuru.toLocaleLowerCase("tr-TR")} organizasyonunuz için ${paket.ad} hazırlayabiliriz.`,
      "",
      "Paket kapsamı:",
      ...paket.maddeler.map(m => `- ${m}`),
      "",
      "Teslim edilecekler:",
      ...paket.teslimatlar.map(t => `- ${t}`),
    ];

    if (tutarMetni) {
      satirlar.push("", `Teklif tutarı: ${tutarMetni}`);
    }

    if (temizReferans) {
      satirlar.push("", `İç referans: ${temizReferans}`);
    }

    if (temizNot) {
      satirlar.push("", `Not: ${temizNot}`);
    }

    if (whatsappImzasi?.trim()) {
      satirlar.push("", whatsappImzasi.trim());
    }

    satirlar.push(
      "",
      "Davetli listesi, RSVP yanıtları, fotoğraf ve anı içerikleri müşterinin kendi hesabında yönetilir.",
      "Uygun görürseniz size özel aktivasyon bağlantısını paylaşabiliriz."
    );

    return satirlar.join("\n");
  }, [etkinlikTuru, firmaAdi, paket, temizNot, temizReferans, tutarMetni, whatsappImzasi]);

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(teklifMetni);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      setKopyalandi(false);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(teklifMetni)}`;

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              Satış Aracı
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Teklif / Paket Oluşturucu
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Salon, davet evi veya organizasyon müşterisine göndereceğiniz dijital hizmet teklifini hazırlayın.
              Bu formdaki bilgiler kaydedilmez.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-xs font-bold text-amber-800">KVKK notu</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-amber-700">
              Müşteri adı, telefon, e-posta veya TCKN yazmayın. İç referans olarak salon, tarih aralığı veya teklif numarası kullanın.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_0.9fr] lg:p-7">
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {PAKETLER.map(p => {
              const secili = p.id === paketId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaketId(p.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    secili
                      ? "border-purple-200 bg-purple-50 ring-2 ring-purple-100"
                      : "border-gray-100 bg-gray-50 hover:border-purple-100 hover:bg-white"
                  }`}
                >
                  <div className={`mb-3 h-1.5 rounded-full bg-linear-to-r ${p.vurgu}`} />
                  <p className="text-sm font-black text-gray-950">{p.ad}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.kisa}</p>
                  <p className="mt-3 text-[11px] font-semibold text-gray-400">{p.hedef}</p>
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Etkinlik türü</span>
              <select
                value={etkinlikTuru}
                onChange={e => setEtkinlikTuru(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              >
                {ETKINLIK_TURLERI.map(tur => (
                  <option key={tur} value={tur}>{tur}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Teklif tutarı opsiyonel</span>
              <input
                value={tutar}
                onChange={e => setTutar(e.target.value)}
                inputMode="numeric"
                placeholder="Örn. 2500"
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-gray-500">İç referans opsiyonel</span>
              <input
                value={referans}
                onChange={e => setReferans(e.target.value)}
                maxLength={80}
                placeholder="Örn. Salon A - Haziran teklifi"
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Kısa not opsiyonel</span>
              <input
                value={not}
                onChange={e => setNot(e.target.value)}
                maxLength={100}
                placeholder="Örn. Kurulum etkinlikten önce yapılır"
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Paket Özeti</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {paket.maddeler.map(madde => (
                <div key={madde} className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-700">
                  {madde}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className={`mb-4 h-2 rounded-full bg-linear-to-r ${paket.vurgu}`} />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              WhatsApp / PDF Metni
            </p>
            <pre className="mt-3 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-2xl bg-gray-950 p-4 text-xs leading-relaxed text-gray-100">
              {teklifMetni}
            </pre>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={kopyala}
              className="rounded-2xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700"
            >
              {kopyalandi ? "Kopyalandı" : "Metni Kopyala"}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-green-700"
            >
              WhatsApp&apos;ta Aç
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

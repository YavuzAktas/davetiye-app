"use client";

import { useMemo, useState } from "react";

type Paket = {
  id: string;
  ad: string;
  etiket: string;
  hedef: string;
  satisAcisi: string;
  renk: string;
  dahil: string[];
  teslim: string[];
  fiyatNotu: string;
  takipAksiyonu: string;
};

const PAKETLER: Paket[] = [
  {
    id: "hizli-davetiye",
    ad: "Hızlı Dijital Davetiye",
    etiket: "Başlangıç",
    hedef: "Basılı davetiyeyi azaltmak ve hızlı paylaşım isteyen çiftler",
    satisAcisi: "Davetiyeniz link ve QR olarak hazırlanır; misafirler uygulama indirmeden açar.",
    renk: "from-indigo-600 to-purple-600",
    dahil: ["Dijital davetiye", "WhatsApp paylaşım linki", "RSVP takibi", "Genel QR kod"],
    teslim: ["Müşteri teslim portalı", "Yayına hazır davetiye paneli", "Paylaşım kontrol listesi"],
    fiyatNotu: "Giriş seviyesi paket olarak konumlandırın; ek özellikleri ayrıca sunun.",
    takipAksiyonu: "Müşteriye teslim linki gönderin ve şablon seçimini takip edin.",
  },
  {
    id: "salon-operasyon",
    ad: "Salon Operasyon Paketi",
    etiket: "Mekan",
    hedef: "Düğün salonu, davet evi ve giriş akışını düzenlemek isteyen organizasyonlar",
    satisAcisi: "Etkinlik günü QR, masa ve giriş akışı tek panelden takip edilir.",
    renk: "from-emerald-600 to-teal-500",
    dahil: ["QR check-in", "Masa/pano QR kiti", "Davetli durum takibi", "Personel check-in ekranı"],
    teslim: ["Giriş ekibi kullanım notu", "QR kiti bağlantısı", "Davetli takip paneli"],
    fiyatNotu: "Operasyon değeri yüksek olduğu için davetiye paketinin üstüne servis bedeli ekleyin.",
    takipAksiyonu: "Davetiyeyi yayına aldıktan sonra QR kitini ve personel ekranını hazırlatın.",
  },
  {
    id: "ani-sosyal",
    ad: "Anı & Sosyal İçerik Paketi",
    etiket: "Sosyal",
    hedef: "Fotoğraf, anı ve sosyal medya çıktısı isteyen çiftler",
    satisAcisi: "Misafirler fotoğraf, yazılı anı ve sesli anı bırakır; içerikler onay sonrası görünür.",
    renk: "from-pink-600 to-rose-500",
    dahil: ["Fotoğraf albümü", "Anı defteri", "Sesli anı", "Canlı duvar"],
    teslim: ["Masa QR yönlendirmesi", "Canlı duvar linki", "Etkinlik sonrası anı arşivi"],
    fiyatNotu: "Duygusal değeri yüksek paket; premium paketle birlikte daha güçlü satılır.",
    takipAksiyonu: "Etkinlik öncesi masa QR kartlarını ve canlı duvar ekranını test ettirin.",
  },
  {
    id: "premium-deneyim",
    ad: "Premium Etkinlik Deneyimi",
    etiket: "En güçlü",
    hedef: "Her şeyi tek yerden, profesyonel görünümle isteyen premium müşteriler",
    satisAcisi: "Davetiye, RSVP, QR operasyonu ve anı toplama tek dijital deneyimde birleşir.",
    renk: "from-purple-600 to-fuchsia-600",
    dahil: ["Lüks şablon", "RSVP ve davetli hunisi", "QR check-in", "Oturma planı", "Canlı duvar", "Anı arşivi"],
    teslim: ["Markalı müşteri portalı", "Etkinlik günü operasyon paketi", "Etkinlik sonrası teslim rehberi"],
    fiyatNotu: "Ana teklif olarak sunun; kapsamı net yazın ve sonradan değişiklikleri ayrıca fiyatlayın.",
    takipAksiyonu: "Önce müşteriyi premium olarak işaretleyin, sonra teklif metnini ve teslim linkini paylaşın.",
  },
];

function metinHazirla(paket: Paket, firmaAdi: string, whatsappImzasi?: string | null) {
  const satirlar = [
    `Merhaba, ${firmaAdi} olarak ${paket.ad} hizmetimizi önerebiliriz.`,
    "",
    paket.satisAcisi,
    "",
    "Paket kapsamı:",
    ...paket.dahil.map(madde => `- ${madde}`),
    "",
    "Teslimde hazırlananlar:",
    ...paket.teslim.map(madde => `- ${madde}`),
    "",
    "Uygun görürseniz size özel teslim bağlantısını paylaşabiliriz. Davetli listesi, RSVP yanıtları ve anı içerikleri sizin hesabınızda yönetilir.",
  ];

  if (whatsappImzasi?.trim()) {
    satirlar.push("", whatsappImzasi.trim());
  }

  return satirlar.join("\n");
}

export default function PartnerHazirPaketler({
  firmaAdi,
  whatsappImzasi,
}: {
  firmaAdi: string;
  whatsappImzasi?: string | null;
}) {
  const [seciliId, setSeciliId] = useState(PAKETLER[0].id);
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);
  const seciliPaket = useMemo(() => PAKETLER.find(paket => paket.id === seciliId) ?? PAKETLER[0], [seciliId]);
  const satisMetni = useMemo(
    () => metinHazirla(seciliPaket, firmaAdi, whatsappImzasi),
    [firmaAdi, seciliPaket, whatsappImzasi]
  );

  const kopyala = async (paket: Paket) => {
    try {
      await navigator.clipboard.writeText(metinHazirla(paket, firmaAdi, whatsappImzasi));
      setKopyalanan(paket.id);
      setTimeout(() => setKopyalanan(null), 2000);
    } catch {
      setKopyalanan(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Hazır satış paketleri</p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Hizmeti paketleyip daha kolay satın
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Salon ve organizasyon müşterileri için hazır kapsam, teslim çıktısı ve konuşma metinleri. Fiyatı siz
              belirlersiniz; buradaki metinler teklif taslağıdır, sözleşme yerine geçmez.
            </p>
          </div>
          <a
            href="#aktivasyon-kodlari"
            className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-4 py-3 text-xs font-black text-white transition-colors hover:bg-purple-700"
          >
            Teslim Linki Oluştur
          </a>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          {PAKETLER.map(paket => (
            <button
              key={paket.id}
              type="button"
              onClick={() => setSeciliId(paket.id)}
              className={`text-left rounded-3xl border p-4 transition-colors ${
                seciliId === paket.id
                  ? "border-purple-200 bg-purple-50"
                  : "border-gray-100 bg-gray-50 hover:border-purple-100 hover:bg-white"
              }`}
            >
              <div className={`h-1.5 w-20 rounded-full bg-linear-to-r ${paket.renk}`} />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-gray-950">{paket.ad}</p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">{paket.hedef}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-purple-700 ring-1 ring-purple-100">
                  {paket.etiket}
                </span>
              </div>

              <div className="mt-4 grid gap-2">
                {paket.dahil.slice(0, 4).map(madde => (
                  <div key={madde} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {madde}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <aside className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Seçili paket</p>
          <h3 className="mt-2 text-lg font-black text-gray-950">{seciliPaket.ad}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{seciliPaket.satisAcisi}</p>

          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-xs font-black text-gray-500">Teslim çıktıları</p>
            <div className="mt-3 space-y-2">
              {seciliPaket.teslim.map(madde => (
                <p key={madde} className="text-xs font-semibold leading-relaxed text-gray-700">
                  ✓ {madde}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-black text-amber-800">Fiyatlandırma notu</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">{seciliPaket.fiyatNotu}</p>
          </div>

          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-black text-emerald-800">Sıradaki aksiyon</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-700">{seciliPaket.takipAksiyonu}</p>
          </div>
        </aside>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 p-5 lg:p-7">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-gray-100 bg-white p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-gray-950">Hazır satış metni</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Kişisel veri içermeyen taslak metin. Müşteriye göndermeden önce kendi fiyatınızı ve kapsamınızı ekleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => kopyala(seciliPaket)}
                className="rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-purple-700 sm:shrink-0"
              >
                {kopyalanan === seciliPaket.id ? "Kopyalandı" : "Metni Kopyala"}
              </button>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-gray-950 p-4 text-xs leading-relaxed text-white/85">
              {satisMetni}
            </pre>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4">
            <p className="text-sm font-black text-gray-950">Hızlı gönderim</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              WhatsApp penceresi açılır; gönderim partner tarafından manuel yapılır.
            </p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(satisMetni)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-black text-white transition-opacity hover:opacity-90"
            >
              WhatsApp'ta Aç
            </a>
            <a
              href="#teklif"
              className="mt-3 flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 transition-colors hover:border-purple-200 hover:text-purple-700"
            >
              Detaylı Teklif Hazırla
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

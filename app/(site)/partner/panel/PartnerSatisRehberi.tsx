"use client";

import { useState } from "react";

type RehberMetni = {
  id: string;
  baslik: string;
  hedef: string;
  metin: string;
};

const PAKET_ONERILERI = [
  {
    baslik: "Sadece davetiye isteyen çift",
    teklif: "Dijital Davetiye Teslimi",
    neden: "Hızlı kurulum, WhatsApp paylaşımı ve RSVP takibi yeterlidir.",
    tetikleyici: "Basılı davetiye maliyetini kısmak istiyorum.",
    aksiyon: "Teslim linki + kısa kullanım notu gönderin.",
  },
  {
    baslik: "Salon girişini düzenlemek isteyen mekan",
    teklif: "Salon Operasyon Paketi",
    neden: "QR check-in, masa kartı ve etkinlik günü akışı öne çıkar.",
    tetikleyici: "Kapıda karışıklık olmasın, kim geliyor bilelim.",
    aksiyon: "Yayına çıktıktan sonra QR kiti hazırlamasını hatırlatın.",
  },
  {
    baslik: "Sosyal medya ve anı isteyen müşteri",
    teklif: "Anı & İçerik Paketi",
    neden: "Fotoğraf, yazılı/sesli anı ve canlı duvar satış değerini artırır.",
    tetikleyici: "Misafirlerden fotoğraf ve güzel mesajlar toplamak istiyorum.",
    aksiyon: "Masa QR kartı ve canlı duvar kullanımını anlatın.",
  },
  {
    baslik: "Premium organizasyon müşterisi",
    teklif: "Premium Etkinlik Deneyimi",
    neden: "Davetiye, RSVP, QR, anı ve operasyon tek pakette toplanır.",
    tetikleyici: "Her şey tek yerden, profesyonel görünsün.",
    aksiyon: "Teklif PDF çıktısını ve teslim paketini birlikte gönderin.",
  },
];

const KONTROL_LISTESI = [
  "Müşteriye kişisel veri toplamadan teslim linkini gönder.",
  "Kod etiketi alanına kişi adı, telefon veya e-posta yazma.",
  "Müşteri kayıt olunca kurulum durumunu takip et.",
  "Davetiye yayına çıkınca QR kiti ve paylaşım linkini hatırlat.",
  "Etkinlikten önce canlı duvar, RSVP ve check-in kullanımını kontrol ettir.",
];

const METINLER: RehberMetni[] = [
  {
    id: "ilk-temas",
    baslik: "İlk temas",
    hedef: "Dijital davetiyeyi ilk kez anlatırken",
    metin:
      "Merhaba, organizasyonunuz için dijital davetiye teslimi de sağlayabiliyoruz. Davetiyeniz link olarak paylaşılır, misafirler uygulama indirmeden açar ve katılım yanıtlarını tek panelden takip edebilirsiniz.",
  },
  {
    id: "premium",
    baslik: "Premium satış",
    hedef: "Daha yüksek paket önermek için",
    metin:
      "İsterseniz davetiyeyi sadece link olarak değil, etkinlik günü kullanılacak QR check-in, masa QR kartı, canlı fotoğraf duvarı ve anı toplama özellikleriyle birlikte hazırlayabiliriz. Böylece davetiye satıştan etkinlik gününe kadar çalışan bir deneyime dönüşür.",
  },
  {
    id: "takip",
    baslik: "Nazik takip",
    hedef: "Link gönderildi ama müşteri başlamadıysa",
    metin:
      "Merhaba, dijital davetiye teslim linkinizi tekrar iletiyorum. Bağlantıyı açıp şablon seçerek birkaç adımda davetiyenizi yayına alabilirsiniz. Takıldığınız noktada bize yazabilirsiniz.",
  },
];

export default function PartnerSatisRehberi() {
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);

  const kopyala = async (metin: RehberMetni) => {
    try {
      await navigator.clipboard.writeText(metin.metin);
      setKopyalanan(metin.id);
      setTimeout(() => setKopyalanan(null), 2000);
    } catch {
      setKopyalanan(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-500">
              Satış Playbook
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl">
              Hangi müşteriye ne sunmalıyım?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Salon, davet evi ve organizasyon müşterileri için paketleme, konuşma metni ve teslim kontrol listesi.
            </p>
          </div>
          <a
            href="#aktivasyon-kodlari"
            className="inline-flex items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-xs font-black text-purple-700 transition-colors hover:bg-purple-100 lg:shrink-0"
          >
            Link Oluştur
          </a>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-2 lg:p-7">
        {PAKET_ONERILERI.map(oneri => (
          <div key={oneri.baslik} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-gray-950">{oneri.baslik}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{oneri.neden}</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-[11px] font-black text-purple-700 ring-1 ring-purple-100">
                {oneri.teklif}
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Satın alma sinyali</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-700">{oneri.tetikleyici}</p>
              </div>
              <div className="rounded-xl bg-white px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Sıradaki aksiyon</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-700">{oneri.aksiyon}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 border-t border-gray-100 bg-gray-50 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-sm font-black text-gray-950">Teslim kontrol listesi</p>
          <div className="mt-4 space-y-2">
            {KONTROL_LISTESI.map((madde, index) => (
              <div key={madde} className="flex items-start gap-3 rounded-xl bg-gray-50 px-3 py-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-black text-purple-700">
                  {index + 1}
                </span>
                <p className="text-xs font-semibold leading-relaxed text-gray-700">{madde}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-black text-amber-800">Hukuksal güvenlik notu</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-700">
              Partner satışta hizmeti anlatır ve teslim linkini paylaşır. Davetli verileri, RSVP yanıtları ve anı içerikleri müşterinin hesabında kalır.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-gray-950">Hazır konuşma metinleri</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                WhatsApp veya e-posta için kısa, kişisel veri içermeyen metinler.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {METINLER.map(metin => (
              <div key={metin.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-950">{metin.baslik}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-gray-400">{metin.hedef}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => kopyala(metin)}
                    className="rounded-xl bg-purple-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-purple-700 sm:shrink-0"
                  >
                    {kopyalanan === metin.id ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-600">{metin.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

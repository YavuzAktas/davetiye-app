import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Dijital Davetiye Oluştur",
  description:
    "Düğün, nişan, doğum günü ve özel etkinlikler için dijital davetiye oluştur. WhatsApp ile paylaş, RSVP yanıtlarını ve misafir listesini takip et.",
  keywords: [
    "dijital davetiye",
    "dijital davetiye oluştur",
    "online davetiye",
    "online davetiye oluştur",
    "whatsapp davetiye",
    "düğün davetiyesi",
    "nişan davetiyesi",
    "doğum günü davetiyesi",
  ],
  alternates: { canonical: "/dijital-davetiye" },
  openGraph: {
    title: "Dijital Davetiye Oluştur | Bekleriz",
    description:
      "Dakikalar içinde dijital davetiye hazırla, WhatsApp ile paylaş ve RSVP yanıtlarını tek panelden takip et.",
    url: `${SITE_URL}/dijital-davetiye`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

const ozellikler = [
  {
    baslik: "WhatsApp ile kolay paylaşım",
    aciklama: "Davetiyeni link olarak paylaş; misafirlerin ekstra uygulama indirmeden açabilsin.",
  },
  {
    baslik: "RSVP ve misafir takibi",
    aciklama: "Kim geliyor, kim gelemiyor, kaç kişi katılıyor gibi yanıtları panelden takip et.",
  },
  {
    baslik: "Sonradan düzenlenebilir",
    aciklama: "Tarih, mekan veya mesaj değişirse yeni baskı gerekmeden davetiyeni güncelle.",
  },
  {
    baslik: "Mobil uyumlu şablonlar",
    aciklama: "Düğün, nişan, doğum günü, kına ve kurumsal etkinlikler için hazır tasarımlar kullan.",
  },
];

const adimlar = [
  "Etkinliğine uygun davetiye şablonunu seç.",
  "İsim, tarih, saat, mekan ve özel mesaj bilgilerini ekle.",
  "Davetiyeni WhatsApp, Instagram veya e-posta ile paylaş.",
  "RSVP yanıtlarını ve misafir listesini panelden takip et.",
];

const faq = [
  {
    soru: "Dijital davetiye nedir?",
    cevap:
      "Dijital davetiye, basılı kart yerine link olarak paylaşılan online davetiyedir. Misafirler telefon, tablet veya bilgisayardan davetiyeyi açabilir.",
  },
  {
    soru: "Dijital davetiyeyi WhatsApp ile gönderebilir miyim?",
    cevap:
      "Evet. Bekleriz ile oluşturduğunuz davetiyeyi tek link olarak WhatsApp üzerinden kişi veya gruplara gönderebilirsiniz.",
  },
  {
    soru: "RSVP takibi nasıl çalışır?",
    cevap:
      "Misafirler davetiye üzerindeki katılım formunu doldurur. Katılıyor, katılamıyor, kişi sayısı ve not gibi bilgiler panelinize düşer.",
  },
  {
    soru: "Dijital davetiye ücretsiz oluşturulabilir mi?",
    cevap:
      "Bekleriz'de ücretsiz planla temel bir davetiye oluşturabilir, daha gelişmiş özellikler için ihtiyacınıza göre plan yükseltebilirsiniz.",
  },
];

export default function DijitalDavetiyePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.soru,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.cevap,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dijital Davetiye",
        item: `${SITE_URL}/dijital-davetiye`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-white">
        <section className="relative overflow-hidden bg-[#080112] px-4 py-24 sm:py-28">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }} />
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-700/25 blur-3xl" />
          <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-pink-700/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-purple-300">
              Dijital davetiye rehberi
            </p>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Dijital davetiye oluştur, misafirlerini tek linkle davet et
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
              Düğün, nişan, doğum günü ve özel etkinlikler için online davetiye hazırlayın.
              WhatsApp ile paylaşın, RSVP yanıtlarını ve misafir listenizi tek panelden yönetin.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sablonlar"
                className="rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-8 py-4 text-sm font-semibold text-white shadow-2xl shadow-purple-900/40 transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Dijital Davetiye Oluştur
              </Link>
              <Link
                href="/fiyatlar"
                className="rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/8"
              >
                Planları İncele
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Neden dijital?</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Basılı davetiye yerine daha hızlı, ölçülebilir ve güncellenebilir bir deneyim
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                Dijital davetiye, davet metnini ve etkinlik bilgilerini sadece görsel olarak sunmaz;
                misafir dönüşlerini toplar, konum bilgisini taşır ve son dakika değişikliklerinde sizi
                yeni baskı maliyetinden kurtarır.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {ozellikler.map((ozellik, index) => (
                <div key={ozellik.baslik} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-sm font-bold text-purple-600">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-base font-bold text-gray-950">{ozellik.baslik}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{ozellik.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Nasıl çalışır?</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Online davetiye hazırlamak dört adım
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-4">
              {adimlar.map((adim, index) => (
                <div key={adim} className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-purple-100">{index + 1}</p>
                  <p className="mt-5 text-sm font-medium leading-6 text-gray-700">{adim}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Karşılaştırma</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                  Dijital davetiye hangi durumlarda daha avantajlı?
                </h2>
                <p className="mt-5 text-sm leading-7 text-gray-500">
                  Özellikle geniş davetli listelerinde, şehir dışı misafirlerde, son dakika mekan değişikliklerinde
                  ve katılım sayısını önceden bilmeniz gereken organizasyonlarda dijital davetiye daha pratik olur.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sablonlar"
                    className="rounded-2xl bg-gray-950 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Şablonlara Bak
                  </Link>
                  <Link
                    href="/blog/whatsapp-davetiye-nasil-hazirlanir"
                    className="rounded-2xl border border-gray-200 px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    WhatsApp Rehberi
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="grid grid-cols-3 bg-gray-950 px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  <span>Özellik</span>
                  <span>Dijital</span>
                  <span>Basılı</span>
                </div>
                {[
                  ["Paylaşım", "Link ile anında", "Elden veya kargo"],
                  ["Güncelleme", "Sonradan düzenlenir", "Yeniden basılır"],
                  ["RSVP", "Otomatik takip", "Manuel takip"],
                  ["Maliyet", "Davetli arttıkça sabit", "Adet arttıkça artar"],
                  ["Konum", "Harita linki", "Metin adres"],
                ].map(([ozellik, dijital, basili]) => (
                  <div key={ozellik} className="grid grid-cols-3 gap-3 border-t border-gray-100 px-5 py-4 text-sm">
                    <span className="font-semibold text-gray-900">{ozellik}</span>
                    <span className="text-emerald-600">{dijital}</span>
                    <span className="text-gray-500">{basili}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0c0118] px-4 py-20 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-300">Sık sorulan sorular</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Dijital davetiye hakkında merak edilenler</h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.soru} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <h3 className="text-base font-bold text-white">{item.soru}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{item.cevap}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/sablonlar"
                className="inline-flex rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5"
              >
                İlk dijital davetiyeni oluştur
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Ücretsiz Davetiye Taslağı Oluştur",
  description:
    "Online davetiye taslağını ücretsiz hazırlayın, şablonları deneyin ve toplam fiyatı ödeme öncesinde görün. Yayına almak için tek seferlik ödeme gerekir.",
  keywords: [
    "ücretsiz davetiye",
    "ücretsiz davetiye oluştur",
    "ücretsiz online davetiye",
    "ücretsiz dijital davetiye",
    "bedava davetiye oluştur",
    "whatsapp ücretsiz davetiye",
    "davetiye hazırlama ücretsiz",
  ],
  alternates: { canonical: "/ucretsiz-davetiye" },
  openGraph: {
    title: "Ücretsiz Davetiye Taslağı Oluştur | DavetRota",
    description:
      "Davetiye taslağınızı ücretsiz hazırlayın; şablon, özellik ve toplam tutarı ödeme öncesinde net görün.",
    url: `${SITE_URL}/ucretsiz-davetiye`,
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const ucretsizOzellikler = [
  "Şablonları ücretsiz inceleme",
  "Davetiye taslağını ödeme öncesi hazırlama",
  "Canlı mobil önizleme",
  "Özellik seçtikçe anlık fiyat görme",
  "Ödeme öncesi vazgeçme özgürlüğü",
  "Yayın için tek seferlik ödeme",
];

const neZamanYeterli = [
  {
    baslik: "Fikir aşamasında",
    aciklama: "Şablonları, renkleri ve temel bilgileri deneyerek davetiyenin nasıl görüneceğini ödeme yapmadan kontrol edebilirsiniz.",
  },
  {
    baslik: "Dijital davetiyeyi denemek",
    aciklama: "Basılı davetiye yerine online davetiye kullanmanın size uygun olup olmadığını taslak ve önizleme akışıyla görebilirsiniz.",
  },
  {
    baslik: "Maliyeti netleştirmek",
    aciklama: "Müzik, albüm, canlı duvar veya oturma planı gibi ek özellikleri açıp kapatarak toplam tutarı ödeme öncesinde hesaplayabilirsiniz.",
  },
];

const farklar = [
  ["Taslak hazırlama", "Ücretsiz", "Ödeme gerekmez"],
  ["Canlı önizleme", "Ücretsiz", "Ödeme gerekmez"],
  ["Yayınlama", "Ücretli", "Temel davetiye bedeli"],
  ["Lüks şablon", "İsteğe bağlı", "Ek özellik bedeli"],
  ["Müzik / Albüm / Anı", "İsteğe bağlı", "Ek özellik bedeli"],
  ["Oturma planı", "İsteğe bağlı", "Ek özellik bedeli"],
];

const faq = [
  {
    soru: "Gerçekten ücretsiz davetiye hazırlayabilir miyim?",
    cevap:
      "Evet. Şablon seçip davetiye taslağını hazırlayabilir, canlı önizleme ve fiyat özetini ödeme öncesinde görebilirsiniz. Davetiyeyi yayına almak için ödeme gerekir.",
  },
  {
    soru: "Taslak davetiye WhatsApp ile gönderilebilir mi?",
    cevap:
      "Hayır. Paylaşım linki ödeme tamamlandıktan ve davetiye yayına alındıktan sonra kullanılabilir.",
  },
  {
    soru: "RSVP ne zaman aktif olur?",
    cevap:
      "RSVP alanı temel dijital davetiye içinde yer alır ve ödeme sonrası yayınlanan davetiyede aktif olur.",
  },
  {
    soru: "Ne zaman ek özellik seçmeliyim?",
    cevap:
      "Lüks şablon, albüm/anı, müzik, canlı fotoğraf duvarı veya oturma planı gerekiyorsa davetiye oluştururken bu özellikleri ekleyebilirsiniz.",
  },
];

export default function UcretsizDavetiyePage() {
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
        name: "Ücretsiz Davetiye",
        item: `${SITE_URL}/ucretsiz-davetiye`,
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
        <section className="relative overflow-hidden bg-linear-to-br from-[#080112] via-[#160326] to-[#35105a] px-4 py-24 sm:py-28">
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -right-44 bottom-0 h-96 w-96 rounded-full bg-pink-500/15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-purple-200">
              Ücretsiz taslak ve önizleme
            </p>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Davetiyeni ücretsiz hazırla, yayına almadan önce fiyatı gör
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Düğün, nişan, doğum günü ve özel etkinlikler için şablon seçin, bilgileri girin,
              özellikleri deneyin. Davetiyeyi yayına almak ve paylaşmak için ödeme adımında toplam tutarı onaylarsınız.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sablonlar"
                className="rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5"
              >
                Ücretsiz Taslak Oluştur
              </Link>
              <Link
                href="/fiyatlar"
                className="rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/8"
              >
                Fiyatları İncele
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Ücretsiz hazırlık</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Ödeme öncesinde rahatça deneyebileceğiniz alanlar
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                DavetRota’da davetiye hazırlama akışı ödeme öncesinde başlar. Böylece şablonu,
                davetiye metnini, özellikleri ve toplam tutarı görmeden ödeme yapmak zorunda kalmazsınız.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ucretsizOzellikler.map((ozellik) => (
                <div key={ozellik} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-gray-700">{ozellik}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-purple-50/50 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Ne zaman yeterli?</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Ücretsiz hazırlık hangi durumlarda işinize yarar?
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {neZamanYeterli.map((item) => (
                <div key={item.baslik} className="rounded-3xl bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-950">{item.baslik}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-500">{item.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Ücretlendirme mantığı</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                  Plan yok; davetiye ve ek özellik bazlı ödeme var
                </h2>
                <p className="mt-5 text-sm leading-7 text-gray-500">
                  Taslak hazırlama ve fiyatı görme ücretsizdir. Davetiyeyi yayına almak istediğinizde
                  temel davetiye bedeli ve seçtiğiniz ek özellikler için tek seferlik ödeme alınır.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sablonlar"
                    className="rounded-2xl bg-gray-950 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Şablonları İncele
                  </Link>
                  <Link
                    href="/fiyatlar"
                    className="rounded-2xl border border-gray-200 px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Fiyatlara Bak
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="grid grid-cols-3 bg-gray-950 px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                  <span>Özellik</span>
                  <span>Durum</span>
                  <span>Bedel</span>
                </div>
                {farklar.map(([ozellik, durum, bedel]) => (
                  <div key={ozellik} className="grid grid-cols-3 gap-3 border-t border-gray-100 px-4 py-4 text-sm">
                    <span className="font-semibold text-gray-900">{ozellik}</span>
                    <span className="text-purple-600">{durum}</span>
                    <span className="text-emerald-600">{bedel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0c0118] px-4 py-20 text-white">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-300">SSS</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Ücretsiz hazırlık hakkında sorular
              </h2>
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
                Ücretsiz taslak oluşturmaya başla
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

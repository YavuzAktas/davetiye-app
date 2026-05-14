import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Ücretsiz Davetiye Oluştur",
  description:
    "Ücretsiz online davetiye oluştur, link olarak paylaş ve RSVP takibi yap. Düğün, nişan, doğum günü ve özel etkinlikler için dijital davetiye şablonları.",
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
    title: "Ücretsiz Davetiye Oluştur | Bekleriz",
    description:
      "Temel şablonlarla ücretsiz online davetiye oluşturun, WhatsApp ile paylaşın ve RSVP yanıtlarını takip edin.",
    url: `${SITE_URL}/ucretsiz-davetiye`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

const ucretsizOzellikler = [
  "1 aktif davetiye oluşturma",
  "Temel davetiye şablonları",
  "WhatsApp ile link paylaşımı",
  "RSVP katılım yanıtı toplama",
  "Mobil uyumlu davetiye sayfası",
  "Davetiyeyi sonradan düzenleme",
];

const neZamanYeterli = [
  {
    baslik: "Küçük etkinlikler",
    aciklama: "Doğum günü, küçük nişan, aile buluşması veya sınırlı davetli listesi olan organizasyonlar için idealdir.",
  },
  {
    baslik: "Dijital davetiyeyi denemek",
    aciklama: "Basılı davetiye yerine online davetiye kullanmanın size uygun olup olmadığını ücretsiz planla görebilirsiniz.",
  },
  {
    baslik: "Hızlı paylaşım ihtiyacı",
    aciklama: "Tasarım sürecini uzatmadan temel bilgileri girip davetiye linkini hızlıca paylaşabilirsiniz.",
  },
];

const farklar = [
  ["Aktif davetiye", "1", "5", "Sınırsız"],
  ["Davetli limiti", "50", "200", "Sınırsız"],
  ["RSVP takibi", "Var", "Var", "Var"],
  ["Lüks şablonlar", "Yok", "Var", "Var"],
  ["Albüm ve anı", "Yok", "Yok", "Var"],
  ["Oturma planı", "Yok", "Yok", "Var"],
];

const faq = [
  {
    soru: "Gerçekten ücretsiz davetiye oluşturabilir miyim?",
    cevap:
      "Evet. Ücretsiz planla temel şablonları kullanarak 1 aktif davetiye oluşturabilir ve link olarak paylaşabilirsiniz.",
  },
  {
    soru: "Ücretsiz davetiye WhatsApp ile gönderilebilir mi?",
    cevap:
      "Evet. Oluşturduğunuz davetiyeyi WhatsApp üzerinden kişi veya gruplara link olarak gönderebilirsiniz.",
  },
  {
    soru: "Ücretsiz planda RSVP var mı?",
    cevap:
      "Evet. Misafirler davetiye üzerinden katılım durumunu bildirebilir, siz de panelden yanıtları takip edebilirsiniz.",
  },
  {
    soru: "Ne zaman ücretli plana geçmeliyim?",
    cevap:
      "Daha fazla aktif davetiye, daha yüksek davetli limiti, lüks şablonlar veya albüm/anı gibi gelişmiş özellikler gerekiyorsa ücretli plana geçebilirsiniz.",
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
              Ücretsiz online davetiye
            </p>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Ücretsiz davetiye oluştur, link olarak hemen paylaş
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              Düğün, nişan, doğum günü ve özel etkinlikler için temel şablonlarla online davetiye hazırlayın.
              WhatsApp ile paylaşın, RSVP yanıtlarını panelden takip edin.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/sablonlar"
                className="rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5"
              >
                Ücretsiz Davetiye Oluştur
              </Link>
              <Link
                href="/fiyatlar"
                className="rounded-2xl border border-white/15 px-8 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/8"
              >
                Planları Karşılaştır
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Ücretsiz plan</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Başlamak için gereken temel davetiye özellikleri
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                Ücretsiz davetiye arayan kullanıcılar için en önemli nokta, hızlıca paylaşılabilir ve
                mobilde düzgün açılan bir davetiye oluşturmaktır. Bekleriz ücretsiz planı bu başlangıç
                ihtiyacını karşılamak için tasarlandı.
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
                Ücretsiz davetiye hangi durumlarda iyi bir seçim?
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
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Plan farkları</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                  Ücretsiz başla, ihtiyaç artarsa yükselt
                </h2>
                <p className="mt-5 text-sm leading-7 text-gray-500">
                  Ücretsiz plan küçük etkinlikler ve deneme için uygundur. Daha fazla davetli, lüks şablon,
                  albüm, anı defteri veya oturma planı gerektiğinde Standart ya da Premium plana geçebilirsiniz.
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
                <div className="grid grid-cols-4 bg-gray-950 px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white/50">
                  <span>Özellik</span>
                  <span>Ücretsiz</span>
                  <span>Standart</span>
                  <span>Premium</span>
                </div>
                {farklar.map(([ozellik, free, standart, premium]) => (
                  <div key={ozellik} className="grid grid-cols-4 gap-3 border-t border-gray-100 px-4 py-4 text-sm">
                    <span className="font-semibold text-gray-900">{ozellik}</span>
                    <span className="text-gray-600">{free}</span>
                    <span className="text-purple-600">{standart}</span>
                    <span className="text-emerald-600">{premium}</span>
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
                Ücretsiz davetiye hakkında sorular
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
                Ücretsiz davetiye oluşturmaya başla
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Nişan Davetiyesi Oluştur",
  description:
    "Online nişan davetiyesi oluştur, WhatsApp ile paylaş ve katılım yanıtlarını takip et. Söz, nişan ve yüzük töreni için zarif dijital davetiye şablonları.",
  keywords: [
    "nişan davetiyesi",
    "nişan davetiyesi oluştur",
    "online nişan davetiyesi",
    "dijital nişan davetiyesi",
    "söz davetiyesi",
    "yüzük töreni davetiyesi",
    "whatsapp nişan davetiyesi",
  ],
  alternates: { canonical: "/nisan-davetiyesi" },
  openGraph: {
    title: "Nişan Davetiyesi Oluştur | Bekleriz",
    description:
      "Nişan ve söz töreni için dijital davetiye hazırlayın, tek linkle paylaşın ve RSVP yanıtlarını takip edin.",
    url: `${SITE_URL}/nisan-davetiyesi`,
    type: "website",
  },
};

const konseptler = [
  {
    baslik: "Sade nişan davetiyesi",
    aciklama: "Aile arasında yapılacak zarif söz veya nişan törenleri için net, sakin ve şık bir davetiye dili.",
  },
  {
    baslik: "Romantik nişan davetiyesi",
    aciklama: "Çiftin hikayesini daha duygusal bir tonda anlatmak isteyenler için sıcak renkler ve yumuşak metinler.",
  },
  {
    baslik: "Lüks nişan davetiyesi",
    aciklama: "Altın detaylar, koyu zeminler ve premium görünüm isteyen nişan organizasyonları için.",
  },
];

const bilgiler = [
  "Çiftlerin isimleri",
  "Söz veya nişan tarihi",
  "Tören saati",
  "Mekan ve konum bilgisi",
  "Aile veya davet mesajı",
  "Katılım bildirimi formu",
];

const faq = [
  {
    soru: "Nişan davetiyesi ile söz davetiyesi aynı sayfada hazırlanabilir mi?",
    cevap:
      "Evet. Davetiye metninde törenin söz, nişan veya yüzük merasimi olduğunu belirtebilir; tarih, saat ve mekan bilgilerini aynı sayfada sunabilirsiniz.",
  },
  {
    soru: "Online nişan davetiyesi WhatsApp ile gönderilir mi?",
    cevap:
      "Evet. Hazırladığınız nişan davetiyesini link olarak WhatsApp kişi veya gruplarına gönderebilirsiniz.",
  },
  {
    soru: "Nişan davetiyesi sonradan düzenlenebilir mi?",
    cevap:
      "Evet. Mekan, saat veya mesaj değişirse davetiye panelinden güncelleyebilirsiniz. Paylaştığınız link aynı kalır.",
  },
  {
    soru: "Nişan katılım takibi yapılabilir mi?",
    cevap:
      "Evet. RSVP formu sayesinde kimlerin katılacağını, kişi sayısını ve misafir notlarını panelden takip edebilirsiniz.",
  },
];

export default function NisanDavetiyesiPage() {
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
        name: "Nişan Davetiyesi",
        item: `${SITE_URL}/nisan-davetiyesi`,
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
        <section className="relative overflow-hidden bg-linear-to-br from-[#17030b] via-[#2a0714] to-[#4a1020] px-4 py-24 sm:py-28">
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-rose-400/15 blur-3xl" />
          <div className="absolute -right-44 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-rose-100/75">
                Online nişan davetiyesi
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                Nişan davetiyesi oluştur, sevdiklerini zarif bir linkle davet et
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Söz, nişan ve yüzük töreniniz için mobil uyumlu dijital davetiye hazırlayın.
                WhatsApp ile paylaşın, katılım yanıtlarını ve misafir listenizi kolayca takip edin.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sablonlar"
                  className="rounded-2xl bg-white px-8 py-4 text-center text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5"
                >
                  Nişan Davetiyesi Oluştur
                </Link>
                <Link
                  href="/davetiye/ornek-nisan"
                  className="rounded-2xl border border-white/15 px-8 py-4 text-center text-sm font-semibold text-white/80 transition hover:bg-white/8"
                >
                  Örnek Nişan Davetiyesi
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="rounded-[28px] bg-linear-to-br from-[#3b0a14] to-[#17030b] p-8 text-center text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-100/65">Nişan Davetiyesi</p>
                <h2 className="mt-6 text-5xl" style={{ fontFamily: "var(--font-dancing), cursive" }}>
                  Aylin & Yavuz
                </h2>
                <div className="mx-auto my-6 h-px w-28 bg-linear-to-r from-transparent via-amber-100/50 to-transparent" />
                <p className="text-sm leading-7 text-white/65">
                  Bu güzel başlangıcımıza tanıklık etmenizden mutluluk duyarız.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-white/80">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">6 Haziran 2026, Cumartesi</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">Aile arasında yüzük töreni</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">Konsept seçimi</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Nişan töreninin tonuna uygun davetiye seç
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {konseptler.map((konsept) => (
                <div key={konsept.baslik} className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-950">{konsept.baslik}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-500">{konsept.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-rose-50/50 px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">Davetiye içeriği</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Nişan davetiyesinde hangi bilgiler yer almalı?
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                Nişan davetiyesi genellikle daha samimi bir dille yazılır. Ailelerin daveti, tören
                saati, mekan bilgisi ve katılım bildirimi net olursa misafirler için süreç kolaylaşır.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sablonlar"
                  className="rounded-2xl bg-gray-950 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Nişan Şablonlarını İncele
                </Link>
                <Link
                  href="/online-davetiye"
                  className="rounded-2xl border border-rose-100 bg-white px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-rose-50"
                >
                  Online Davetiye Rehberi
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {bilgiler.map((madde) => (
                <div key={madde} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="text-sm font-semibold text-gray-700">{madde}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl bg-[#17030b] p-8 text-white sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-200">Katılım planı</p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                    Aile ve misafir listesini daha düzenli yönet
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/55">
                    RSVP yanıtları sayesinde nişan törenine kimlerin geleceğini önceden görebilir,
                    kişi sayısı ve masa hazırlığını daha rahat planlayabilirsiniz.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    ["Aile", "18 kişi"],
                    ["Yakın arkadaşlar", "12 kişi"],
                    ["Katılamayanlar", "3 kişi"],
                  ].map(([grup, sayi]) => (
                    <div key={grup} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                      <span className="text-sm font-semibold text-white/85">{grup}</span>
                      <span className="text-xs text-white/45">{sayi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">SSS</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Nişan davetiyesi hakkında sorular
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.soru} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-950">{item.soru}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{item.cevap}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/sablonlar"
                className="inline-flex rounded-2xl bg-gray-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Nişan davetiyesi şablonlarını incele
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

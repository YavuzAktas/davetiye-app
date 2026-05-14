import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Düğün Davetiyesi Oluştur",
  description:
    "Online düğün davetiyesi oluştur, WhatsApp ile paylaş ve RSVP yanıtlarını takip et. Modern, klasik ve lüks düğün davetiyesi şablonları.",
  keywords: [
    "düğün davetiyesi",
    "düğün davetiyesi oluştur",
    "online düğün davetiyesi",
    "dijital düğün davetiyesi",
    "whatsapp düğün davetiyesi",
    "düğün davetiyesi şablonu",
    "nikah davetiyesi",
  ],
  alternates: { canonical: "/dugun-davetiyesi" },
  openGraph: {
    title: "Düğün Davetiyesi Oluştur | Bekleriz",
    description:
      "Düğün ve nikah için dijital davetiye hazırlayın, tek linkle paylaşın ve katılım yanıtlarını takip edin.",
    url: `${SITE_URL}/dugun-davetiyesi`,
    type: "website",
  },
};

const tarzlar = [
  {
    baslik: "Klasik düğün davetiyesi",
    aciklama: "Zarif tipografi, sade düzen ve her yaş grubuna hitap eden geleneksel bir davetiye dili.",
  },
  {
    baslik: "Modern düğün davetiyesi",
    aciklama: "Minimal tasarım, net bilgi akışı ve mobilde kolay okunan modern düğün davetiyesi şablonları.",
  },
  {
    baslik: "Lüks düğün davetiyesi",
    aciklama: "Altın detaylar, özel renkler ve daha premium bir ilk izlenim isteyen çiftler için.",
  },
];

const kontrolListesi = [
  "Çiftlerin isimleri",
  "Düğün veya nikah tarihi",
  "Saat ve mekan bilgisi",
  "Harita veya konum bağlantısı",
  "Katılım bildirimi formu",
  "Kısa davet mesajı",
];

const faq = [
  {
    soru: "Online düğün davetiyesi nasıl oluşturulur?",
    cevap:
      "Önce düğün tarzınıza uygun bir şablon seçilir. Ardından isim, tarih, mekan, mesaj ve isteğe bağlı müzik gibi bilgiler eklenir. Davetiye hazır olunca link olarak paylaşılır.",
  },
  {
    soru: "Düğün davetiyesini WhatsApp ile gönderebilir miyim?",
    cevap:
      "Evet. Oluşturduğunuz düğün davetiyesini WhatsApp üzerinden kişi veya gruplara link olarak gönderebilirsiniz.",
  },
  {
    soru: "Nikah ve düğün bilgileri aynı davetiyede olabilir mi?",
    cevap:
      "Evet. Davetiye mesajında nikah, düğün, kokteyl veya after party gibi farklı program bilgilerine yer verebilirsiniz.",
  },
  {
    soru: "Düğün davetiyesinde katılım takibi yapılabilir mi?",
    cevap:
      "Evet. RSVP formu ile misafirlerin katılım durumu, kişi sayısı ve notları panelde takip edilebilir.",
  },
];

export default function DugunDavetiyesiPage() {
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
        name: "Düğün Davetiyesi",
        item: `${SITE_URL}/dugun-davetiyesi`,
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
            backgroundSize: "34px 34px",
          }} />
          <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-rose-600/20 blur-3xl" />
          <div className="absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-rose-200">
                Online düğün davetiyesi
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                Düğün davetiyesi oluştur, davetlilerini tek linkle bilgilendir
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Düğün ve nikah bilgilerini mobil uyumlu bir davetiye sayfasında toplayın.
                WhatsApp ile paylaşın, katılım yanıtlarını ve misafir listenizi kolayca takip edin.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sablonlar"
                  className="rounded-2xl bg-white px-8 py-4 text-center text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5"
                >
                  Düğün Davetiyesi Oluştur
                </Link>
                <Link
                  href="/davetiye/ornek-dugun"
                  className="rounded-2xl border border-white/15 px-8 py-4 text-center text-sm font-semibold text-white/80 transition hover:bg-white/8"
                >
                  Örnek Davetiyeyi Gör
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="rounded-[28px] bg-linear-to-br from-[#111827] to-[#4c0519] p-8 text-center text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-rose-200/70">Düğün Davetiyesi</p>
                <h2 className="mt-6 text-5xl" style={{ fontFamily: "var(--font-dancing), cursive" }}>
                  Ayşe & Mehmet
                </h2>
                <div className="mx-auto my-6 h-px w-28 bg-linear-to-r from-transparent via-rose-200/50 to-transparent" />
                <p className="text-sm leading-7 text-white/65">
                  Bu mutlu günümüzde sizi de aramızda görmekten mutluluk duyarız.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-white/80">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">12 Eylül 2026, Cumartesi</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">İstanbul</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Şablon tarzları</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Düğün konseptine uygun davetiye tasarımı seç
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {tarzlar.map((tarz) => (
                <div key={tarz.baslik} className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-950">{tarz.baslik}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-500">{tarz.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">İçerik kontrolü</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Düğün davetiyesinde hangi bilgiler olmalı?
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                İyi bir düğün davetiyesi hem duygusal tonu hem de pratik bilgileri net verir.
                Online davetiye sayesinde bu bilgileri sonradan güncellemek de kolaydır.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/blog/dugun-davetiye-sozleri"
                  className="rounded-2xl bg-gray-950 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Davetiye Sözleri
                </Link>
                <Link
                  href="/dijital-davetiye"
                  className="rounded-2xl border border-gray-200 px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-white"
                >
                  Dijital Davetiye Rehberi
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {kontrolListesi.map((madde) => (
                <div key={madde} className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold text-gray-700">{madde}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl bg-[#0c0118] p-8 text-white sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-200">RSVP takibi</p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                    Düğün katılım listesini önceden gör
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/55">
                    Misafirler davetiye üzerinden katılım durumunu bildirdiğinde, kişi sayısı ve notlar
                    panelinizde toplanır. Böylece masa planı ve organizasyon hazırlığı daha kontrollü ilerler.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    ["Ayşe K.", "Katılıyor", "bg-emerald-500"],
                    ["Mehmet T.", "2 kişi", "bg-emerald-500"],
                    ["Fatma Y.", "Katılamıyor", "bg-rose-500"],
                  ].map(([isim, durum, renk]) => (
                    <div key={isim} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                      <span className={`h-2.5 w-2.5 rounded-full ${renk}`} />
                      <span className="flex-1 text-sm font-semibold text-white/85">{isim}</span>
                      <span className="text-xs text-white/45">{durum}</span>
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
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">SSS</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Düğün davetiyesi hakkında sorular
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
                Düğün davetiyesi şablonlarını incele
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

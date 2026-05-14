import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Online Davetiye Oluştur",
  description:
    "Online davetiye oluştur, link olarak paylaş ve katılım yanıtlarını takip et. Düğün, nişan, doğum günü ve özel etkinlikler için hazır şablonlar.",
  keywords: [
    "online davetiye",
    "online davetiye oluştur",
    "davetiye oluştur",
    "internet davetiyesi",
    "whatsapp davetiye gönderme",
    "online düğün davetiyesi",
    "online nişan davetiyesi",
  ],
  alternates: { canonical: "/online-davetiye" },
  openGraph: {
    title: "Online Davetiye Oluştur | Bekleriz",
    description:
      "Hazır şablonlarla online davetiye oluşturun, WhatsApp ile paylaşın ve RSVP yanıtlarını takip edin.",
    url: `${SITE_URL}/online-davetiye`,
    type: "website",
  },
};

const kullanimAlanlari = [
  "Düğün ve nikah davetiyesi",
  "Nişan ve söz davetiyesi",
  "Doğum günü davetiyesi",
  "Kına ve mezuniyet etkinlikleri",
  "Kurumsal toplantı ve kutlamalar",
  "Baby shower ve özel partiler",
];

const nedenler = [
  {
    baslik: "Link olarak paylaşılır",
    aciklama: "Online davetiyeniz tek bir bağlantı üzerinden açılır. WhatsApp, Instagram, SMS veya e-posta ile paylaşabilirsiniz.",
  },
  {
    baslik: "Yanıtları toplar",
    aciklama: "Misafirler katılım durumunu form üzerinden bildirir. Böylece listeyi ayrı ayrı takip etmek zorunda kalmazsınız.",
  },
  {
    baslik: "Bilgiler güncellenir",
    aciklama: "Mekan, saat veya mesaj değiştiğinde davetiyeyi güncellersiniz; aynı link üzerinden herkes yeni bilgiyi görür.",
  },
];

const sorular = [
  {
    soru: "Online davetiye ile dijital davetiye aynı şey mi?",
    cevap:
      "Çoğu kullanımda evet. Online davetiye, internet üzerinden linkle açılan dijital davetiye anlamına gelir.",
  },
  {
    soru: "Online davetiye için uygulama indirmek gerekir mi?",
    cevap:
      "Hayır. Misafirler davetiye linkine tıklayarak tarayıcıdan davetiyeyi görüntüleyebilir.",
  },
  {
    soru: "Online davetiyeyi sonradan değiştirebilir miyim?",
    cevap:
      "Evet. Davetiye sahibi panelden bilgileri güncelleyebilir; paylaşılan link aynı kalır.",
  },
  {
    soru: "Kimlerin katılacağını görebilir miyim?",
    cevap:
      "Evet. RSVP özelliğiyle katılan, katılamayan ve kişi sayısı gibi bilgileri panelde takip edebilirsiniz.",
  },
];

export default function OnlineDavetiyePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sorular.map((item) => ({
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
        name: "Online Davetiye",
        item: `${SITE_URL}/online-davetiye`,
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
        <section className="relative overflow-hidden bg-linear-to-br from-[#080112] via-[#130322] to-[#21072f] px-4 py-24 sm:py-28">
          <div className="absolute left-1/2 top-0 h-72 w-[720px] -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-purple-300">
                  Online davetiye oluşturma
                </p>
                <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                  Online davetiye hazırla, misafirlerine anında ulaştır
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                  Bekleriz ile etkinliğine uygun şablonu seç, davetiye bilgilerini gir ve davetiyeni
                  link olarak paylaş. Katılım yanıtları ve misafir listesi tek panelde toplansın.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sablonlar"
                    className="rounded-2xl bg-white px-8 py-4 text-center text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5"
                  >
                    Online Davetiye Oluştur
                  </Link>
                  <Link
                    href="/dijital-davetiye"
                    className="rounded-2xl border border-white/15 px-8 py-4 text-center text-sm font-semibold text-white/80 transition hover:bg-white/8"
                  >
                    Dijital Davetiye Rehberi
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="rounded-2xl bg-white p-6 text-gray-950">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-500">Canlı önizleme</p>
                  <div className="mt-6 rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 p-5">
                    <p className="text-sm text-gray-500">Düğün Davetiyesi</p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-950">Ayşe & Mehmet</h2>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      Mutluluğumuzu sizinle paylaşmak için sizi aramızda görmek isteriz.
                    </p>
                    <div className="mt-6 grid gap-3 text-sm text-gray-700">
                      <div className="rounded-xl bg-white px-4 py-3">12 Eylül 2026, Cumartesi</div>
                      <div className="rounded-xl bg-white px-4 py-3">İstanbul, Boğaz manzaralı salon</div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white">Katılıyorum</div>
                      <div className="rounded-xl bg-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-600">Katılamam</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Kullanım alanları</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                  Her etkinlik için paylaşılabilir online davetiye
                </h2>
                <p className="mt-5 text-sm leading-7 text-gray-500">
                  Online davetiye sadece düğün için değil, hızlı duyuru ve katılım takibi gereken
                  birçok etkinlik için kullanılabilir. Hazır şablonlar sayesinde tasarıma sıfırdan
                  başlamak zorunda kalmazsınız.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {kullanimAlanlari.map((alan) => (
                  <div key={alan} className="rounded-2xl border border-gray-100 bg-white px-5 py-4 text-sm font-semibold text-gray-700 shadow-sm">
                    {alan}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Avantajlar</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Online davetiyeyi pratik yapan özellikler
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {nedenler.map((neden) => (
                <div key={neden.baslik} className="rounded-3xl bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-950">{neden.baslik}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-500">{neden.aciklama}</p>
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
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-300">Başlamak kolay</p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                    Davetiye linkini dakikalar içinde paylaş
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/55">
                    Basılı davetiye hazırlığı beklemeden, etkinlik bilgilerini girip paylaşılabilir
                    bir online davetiye oluşturabilirsiniz.
                  </p>
                </div>
                <div className="grid gap-3">
                  {["Şablon seç", "Bilgileri gir", "Linki paylaş", "Yanıtları takip et"].map((adim, index) => (
                    <div key={adim} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-950">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-white/85">{adim}</span>
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
                Online davetiye hakkında sorular
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {sorular.map((item) => (
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
                Online davetiye şablonlarını incele
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

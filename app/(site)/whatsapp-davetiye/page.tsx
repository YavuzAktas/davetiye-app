import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "WhatsApp Davetiye Oluştur",
  description:
    "WhatsApp ile paylaşılabilir online davetiye oluştur. Düğün, nişan, doğum günü ve özel etkinlik davetiyeni link olarak gönder, RSVP yanıtlarını takip et.",
  keywords: [
    "whatsapp davetiye",
    "whatsapp davetiye oluştur",
    "whatsapp düğün davetiyesi",
    "whatsapp nişan davetiyesi",
    "dijital davetiye whatsapp",
    "online davetiye whatsapp",
    "davetiye linki gönderme",
  ],
  alternates: { canonical: "/whatsapp-davetiye" },
  openGraph: {
    title: "WhatsApp Davetiye Oluştur | DavetRota",
    description:
      "Davetiyeni link olarak hazırla, WhatsApp ile paylaş ve katılım yanıtlarını tek panelden takip et.",
    url: `${SITE_URL}/whatsapp-davetiye`,
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const avantajlar = [
  {
    baslik: "Tek linkle gönderim",
    aciklama: "Davetiye görseli veya uzun metin yerine, misafirlerin açabileceği tek bir davetiye bağlantısı paylaşılır.",
  },
  {
    baslik: "Mobilde hızlı açılır",
    aciklama: "Misafirler WhatsApp mesajındaki linke dokunarak davetiyeyi telefonlarından görüntüler.",
  },
  {
    baslik: "Katılım yanıtı alınır",
    aciklama: "Davetiyedeki RSVP formu sayesinde kimlerin geleceği panelde toplanır.",
  },
];

const adimlar = [
  "Davetiyen için uygun şablonu seç.",
  "Etkinlik bilgilerini ve davet mesajını ekle.",
  "Paylaşım linkini WhatsApp kişi veya gruplarına gönder.",
  "Katılım yanıtlarını panelden takip et.",
];

const ipuclari = [
  "Mesajın başına kısa ve kişisel bir not ekleyin.",
  "Linki göndermeden önce kendi telefonunuzda test edin.",
  "Davetiyede tarih, saat ve mekan bilgisinin net olduğundan emin olun.",
  "Etkinlik yaklaşınca aynı link üzerinden nazik bir hatırlatma yapın.",
];

const faq = [
  {
    soru: "WhatsApp davetiye nedir?",
    cevap:
      "WhatsApp davetiye, davetiye linkinin WhatsApp üzerinden paylaşılmasıdır. Misafirler linke tıklayarak davetiyeyi online görüntüler.",
  },
  {
    soru: "WhatsApp davetiyede RSVP alınabilir mi?",
    cevap:
      "Evet. DavetRota ile oluşturulan davetiyelerde misafirler katılım durumunu form üzerinden bildirebilir.",
  },
  {
    soru: "WhatsApp davetiye görsel mi link mi olmalı?",
    cevap:
      "Link paylaşımı daha pratiktir; çünkü davetiye güncellenebilir, RSVP toplanabilir ve harita gibi etkileşimli alanlar kullanılabilir.",
  },
  {
    soru: "Aynı WhatsApp davetiyesini gruba gönderebilir miyim?",
    cevap:
      "Evet. Davetiye linkini WhatsApp gruplarında paylaşabilirsiniz. Kişisel davetlerde kısa bir ön mesaj eklemek daha iyi dönüş sağlar.",
  },
];

export default function WhatsappDavetiyePage() {
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
        name: "WhatsApp Davetiye",
        item: `${SITE_URL}/whatsapp-davetiye`,
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
        <section className="relative overflow-hidden bg-linear-to-br from-[#031b11] via-[#06351f] to-[#0a5f35] px-4 py-24 sm:py-28">
          <div className="absolute -left-36 top-16 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-emerald-100/75">
                WhatsApp davetiye gönderimi
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                WhatsApp davetiye oluştur, misafirlerine tek linkle gönder
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Düğün, nişan, doğum günü ve özel etkinlik davetiyeni online hazırla.
                WhatsApp ile paylaş, misafirlerin davetiyeyi açsın ve katılım yanıtını iletsin.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sablonlar"
                  className="rounded-2xl bg-white px-8 py-4 text-center text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5"
                >
                  WhatsApp Davetiye Oluştur
                </Link>
                <Link
                  href="/blog/whatsapp-davetiye-nasil-hazirlanir"
                  className="rounded-2xl border border-white/15 px-8 py-4 text-center text-sm font-semibold text-white/80 transition hover:bg-white/8"
                >
                  Detaylı Rehberi Oku
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="rounded-[28px] bg-[#efeae2] p-5">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500">Ayşe & Mehmet</p>
                  <p className="mt-1 text-sm text-gray-800">Düğün davetiyemiz hazır, sizi de aramızda görmek isteriz.</p>
                </div>
                <div className="ml-auto mt-3 max-w-[85%] rounded-2xl rounded-br-sm bg-[#d9fdd3] shadow-sm">
                  <div className="rounded-t-2xl bg-linear-to-br from-emerald-700 to-green-900 px-4 py-8 text-center text-white">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/55">Online Davetiye</p>
                    <p className="mt-3 text-2xl" style={{ fontFamily: "var(--font-dancing), cursive" }}>Ayşe & Mehmet</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold text-gray-800">davetrota.com/davetiye/ayse-mehmet</p>
                    <p className="mt-1 text-[11px] text-gray-500">Tarih, mekan ve RSVP formu davetiyede.</p>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-800">Çok güzel olmuş, katılıyoruz 🎉</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Neden link?</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                WhatsApp davetiyeyi link olarak göndermek daha pratik
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {avantajlar.map((avantaj) => (
                <div key={avantaj.baslik} className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-950">{avantaj.baslik}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-500">{avantaj.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-emerald-50/50 px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Nasıl gönderilir?</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                WhatsApp davetiye gönderimi dört adımda tamamlanır
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                Görsel dosya paylaşmak yerine online davetiye linki göndermek, davetiyeyi güncel tutmanızı
                ve misafir yanıtlarını toplamanızı kolaylaştırır.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/online-davetiye"
                  className="rounded-2xl bg-gray-950 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Online Davetiye Rehberi
                </Link>
                <Link
                  href="/dijital-davetiye"
                  className="rounded-2xl border border-emerald-100 bg-white px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-emerald-50"
                >
                  Dijital Davetiye Nedir?
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {adimlar.map((adim, index) => (
                <div key={adim} className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-emerald-100">{index + 1}</p>
                  <p className="mt-5 text-sm font-medium leading-6 text-gray-700">{adim}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl bg-[#071b12] p-8 text-white sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">Daha iyi dönüş için</p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                    WhatsApp mesajını kısa, net ve kişisel tut
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/55">
                    Davetiye linkinin yanına küçük bir kişisel not eklemek, misafirlerin mesajı daha sıcak
                    algılamasına yardımcı olur.
                  </p>
                </div>
                <div className="space-y-3">
                  {ipuclari.map((ipucu) => (
                    <div key={ipucu} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300" />
                      <span className="text-sm leading-6 text-white/75">{ipucu}</span>
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
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">SSS</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                WhatsApp davetiye hakkında sorular
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
                WhatsApp davetiyesi oluştur
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

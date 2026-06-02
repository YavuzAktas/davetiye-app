import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Davet Evleri İçin QR Anı Alanı ve LCV Takip Sistemi",
  description:
    "Davet evleri, kır düğünü mekanları ve butik organizasyon alanları için QR anı alanı, fotoğraf toplama, LCV takip, canlı duvar ve dijital davetiye çözümü.",
  keywords: [
    "davet evleri için qr anı alanı",
    "davet evi lcv takip sistemi",
    "davet evi dijital davetiye",
    "qr anı alanı",
    "düğünde fotoğraf toplama qr",
    "butik organizasyon dijital davetiye",
    "davet evi canlı fotoğraf duvarı",
  ],
  alternates: { canonical: "/davet-evleri-icin-qr-ani-alani" },
  openGraph: {
    title: "Davet Evleri İçin QR Anı Alanı | DavetRota",
    description:
      "Müşterilerinize QR ile fotoğraf, yazılı anı, sesli anı ve LCV takibi sunun. Davet evi paketlerinize dijital deneyim ekleyin.",
    url: `${SITE_URL}/davet-evleri-icin-qr-ani-alani`,
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const degerler = [
  {
    baslik: "QR masa kartı ile anı toplama",
    aciklama: "Misafirler masadaki QR kodu okutarak fotoğraf, yazılı anı ve sesli mesaj gönderebilir.",
  },
  {
    baslik: "Onaylı içerik akışı",
    aciklama: "Gönderilen içerikler davetiye sahibi onayladıktan sonra albümde veya canlı duvarda görünür.",
  },
  {
    baslik: "LCV ve kişi sayısı netliği",
    aciklama: "Müşteri, katılım cevaplarını ve kişi sayılarını panelden takip eder; mekan planlaması kolaylaşır.",
  },
  {
    baslik: "Etkinlik sonrası anı kitabı",
    aciklama: "Fotoğraf ve anılar etkinlik sonrası PDF olarak toparlanabilir; müşteriye kalıcı bir çıktı sunulur.",
  },
];

const paketFikirleri = [
  {
    ad: "Standart Davet Paketi",
    detay: "Dijital davetiye, konum, RSVP ve WhatsApp paylaşım metni.",
  },
  {
    ad: "Anı Alanı Paketi",
    detay: "QR masa kartı, fotoğraf albümü, anı defteri ve Anı Kitabı PDF.",
  },
  {
    ad: "Sosyal Etkinlik Paketi",
    detay: "Canlı fotoğraf duvarı, sesli anı ve etkinlik sonrası dijital anı arşivi.",
  },
];

const nedenler = [
  "Davet evi markası müşterinin ilk paylaşımında görünür.",
  "Müşteri anı toplama işini Instagram etiketlerine veya dağınık WhatsApp mesajlarına bırakmaz.",
  "Salon TV'sinde canlı duvar açılarak etkinlik alanında daha hareketli bir atmosfer oluşur.",
  "Davetli verileri partnerde değil, müşterinin kendi hesabında kalır.",
  "Partner, müşteriye ek değer sunar ama kişisel veri operasyonunu üstlenmez.",
];

const surec = [
  {
    baslik: "Partner linki oluşturulur",
    aciklama: "Davet evi, her müşteri için kendi panelinden aktivasyon linki üretir.",
  },
  {
    baslik: "Müşteri davetiyesini hazırlar",
    aciklama: "Müşteri hesap açar, davetiye bilgilerini girer ve onay metinlerini kendi adına kabul eder.",
  },
  {
    baslik: "QR anı alanı paylaşılır",
    aciklama: "QR kod masa kartı, poster veya karşılama panosu olarak kullanılabilir.",
  },
  {
    baslik: "İçerikler onayla görünür",
    aciklama: "Fotoğraf, yazılı anı ve sesli anı gönderimleri davetiye sahibi onayından sonra yayınlanır.",
  },
];

const faq = [
  {
    soru: "QR anı alanı davet evinde nasıl kullanılır?",
    cevap:
      "Müşteri panelinden QR kiti alınır. Bu QR kod masa kartına, karşılama panosuna veya dijital ekrana yerleştirilir. Misafirler kodu okutarak fotoğraf ve anı gönderebilir.",
  },
  {
    soru: "Davet evi misafir fotoğraflarını görebilir mi?",
    cevap:
      "Partner modelinde misafir fotoğrafları ve anı içerikleri müşterinin hesabında yönetilir. Partner panelinde kişisel davetli veya anı içeriği gösterilmez.",
  },
  {
    soru: "LCV takip davet evi operasyonuna nasıl yardımcı olur?",
    cevap:
      "Katılım durumu ve kişi sayısı müşteri panelinde toplandığı için masa, menü ve alan planlaması daha erken netleşir. Partner yalnızca operasyon durumunu takip eder.",
  },
  {
    soru: "Bu sistem butik organizasyonlarda da kullanılabilir mi?",
    cevap:
      "Evet. Nişan, söz, doğum günü, baby shower, mezuniyet ve kurumsal davet gibi butik etkinliklerde QR anı alanı ve dijital davetiye birlikte kullanılabilir.",
  },
];

function SectionHead({ etiket, baslik, aciklama }: { etiket: string; baslik: string; aciklama?: string }) {
  return (
    <div className="mb-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-purple-600">{etiket}</p>
      <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-gray-950 sm:text-4xl">{baslik}</h2>
      {aciklama && <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">{aciklama}</p>}
    </div>
  );
}

export default function DavetEvleriIcinQrAniAlaniPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Davet Evleri İçin QR Anı Alanı",
        item: `${SITE_URL}/davet-evleri-icin-qr-ani-alani`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Davet Evleri İçin QR Anı Alanı ve LCV Takip Sistemi",
    provider: { "@type": "Organization", name: "DavetRota", url: SITE_URL },
    areaServed: "TR",
    serviceType: "QR anı alanı, dijital davetiye, LCV takip ve canlı fotoğraf duvarı",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Davet evleri, butik organizasyon mekanları ve etkinlik firmaları",
    },
    url: `${SITE_URL}/davet-evleri-icin-qr-ani-alani`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(item => ({
      "@type": "Question",
      name: item.soru,
      acceptedAnswer: { "@type": "Answer", text: item.cevap },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="bg-white">
        <section className="relative min-h-[660px] overflow-hidden bg-[#0b0614] px-4 py-24 text-white sm:px-6 lg:py-28">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-28"
            src="/background.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0b0614]/86 via-[#0b0614]/72 to-[#0b0614]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white to-transparent" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />
                Davet evleri ve butik organizasyon mekanları için
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Davet evinizde QR anı alanı, LCV takip ve dijital davetiye deneyimi sunun
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                Müşterileriniz sadece davetiye paylaşmasın; misafirlerinden fotoğraf, yazılı anı ve sesli mesaj da toplasın.
                DavetRota partner paneliyle bu deneyimi paket hizmet olarak sunabilirsiniz.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/partner/basvuru"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black text-purple-700 transition hover:-translate-y-0.5 hover:bg-purple-50"
                >
                  Partner Başvurusu Yap
                </Link>
                <Link
                  href="/dugun-salonlari-icin-dijital-davetiye"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-4 text-sm font-bold text-white/85 transition hover:bg-white/10"
                >
                  Düğün Salonu Çözümünü Gör
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200/80">Anı alanı paketi</p>
              <div className="mt-5 space-y-3">
                {[
                  ["QR ile fotoğraf", "Misafirler telefon kamerasıyla gönderir"],
                  ["Yazılı anı", "İyi dilekler tek yerde toplanır"],
                  ["Sesli anı", "Kısa ses kayıtları saklanabilir"],
                  ["Anı Kitabı PDF", "Etkinlik sonrası dijital hatıra"],
                ].map(([baslik, aciklama]) => (
                  <div key={baslik} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="text-sm font-bold text-white">{baslik}</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">{aciklama}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHead
              etiket="Değer önerisi"
              baslik="Davet evi müşterisine sadece mekan değil, paylaşılabilir bir etkinlik deneyimi sunar"
              aciklama="QR anı alanı, davetiye linkinden başlayıp etkinlik sonrası anı kitabına kadar uzanan bir müşteri deneyimi oluşturur."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {degerler.map((deger, index) => (
                <div key={deger.baslik} className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                  <p className="text-3xl font-black text-purple-100">{index + 1}</p>
                  <h3 className="mt-6 text-base font-black text-gray-950">{deger.baslik}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">{deger.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionHead
                etiket="Paketleme"
                baslik="Bu sistemi kendi satış paketlerinize ekleyebilirsiniz"
                aciklama="Davet evi veya organizasyon firması olarak dijital deneyimi ayrı bir ürün gibi anlatmak yerine, mevcut hizmet paketlerinize değer katan bir katman olarak sunabilirsiniz."
              />
            </div>
            <div className="grid gap-4">
              {paketFikirleri.map(paket => (
                <div key={paket.ad} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-black text-gray-950">{paket.ad}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">{paket.detay}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHead
                etiket="Neden önemli?"
                baslik="Misafirlerin ürettiği anılar, davet evinin deneyim kalitesini büyütür"
              />
              <ul className="space-y-3">
                {nedenler.map(neden => (
                  <li key={neden} className="flex gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm leading-6 text-gray-600 shadow-sm">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
                    {neden}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-purple-100 bg-purple-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">KVKK yaklaşımı</p>
              <h3 className="mt-4 text-2xl font-black leading-tight text-gray-950">
                Partner sadece hizmeti sağlar; kişisel veri müşterinin hesabında kalır
              </h3>
              <p className="mt-4 text-sm leading-7 text-gray-600">
                Davetli listesi, RSVP cevapları, fotoğraflar ve anı içerikleri müşterinin kendi hesabında yönetilir.
                Davet evi paneli, kişisel davetli verisini göstermeden aktivasyon ve durum takibine odaklanır.
              </p>
              <Link href="/kvkk" className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-100">
                KVKK Metnini Gör
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#0b0614] px-4 py-20 text-white sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHead
              etiket="İş akışı"
              baslik="Müşteri deneyimi sade kalır; davet evi operasyonu karmaşıklaşmaz"
              aciklama="Her adım müşterinin kendi hesabı üzerinden ilerlediği için partner tarafı daha hafif ve kontrollü kalır."
            />
            <div className="grid gap-4 md:grid-cols-4">
              {surec.map((adim, index) => (
                <div key={adim.baslik} className="rounded-3xl border border-white/10 bg-white/8 p-6">
                  <p className="text-3xl font-black text-white/18">{index + 1}</p>
                  <h3 className="mt-6 text-base font-black text-white">{adim.baslik}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">{adim.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <SectionHead etiket="Sık sorulan sorular" baslik="Davet evleri için QR anı alanı hakkında" />
            <div className="space-y-3">
              {faq.map(item => (
                <details key={item.soru} className="group rounded-2xl border border-gray-100 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-gray-800">
                    {item.soru}
                    <span className="text-lg text-purple-500 transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-sm leading-7 text-gray-500">{item.cevap}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-5xl rounded-3xl border border-purple-100 bg-purple-50 p-8 text-center sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-600">Davet evi paketlerinize ekleyin</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black text-gray-950">
              Müşterilerinize QR anı alanı ve dijital davetiye deneyimini tek pakette sunun
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600">
              Partner başvurusu sonrası aktivasyon linkleri, müşteri teslim metinleri ve takip paneliyle ilerleyebilirsiniz.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/partner/basvuru" className="rounded-2xl bg-purple-600 px-8 py-4 text-sm font-black text-white transition hover:bg-purple-700">
                Partner Başvurusu Yap
              </Link>
              <Link href="/partner#paketler" className="rounded-2xl border border-purple-200 bg-white px-8 py-4 text-sm font-bold text-purple-700 transition hover:bg-purple-50">
                Partner Paketlerini Gör
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

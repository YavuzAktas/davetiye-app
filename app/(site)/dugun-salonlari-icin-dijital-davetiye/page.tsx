import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Düğün Salonları İçin Dijital Davetiye ve LCV Takip Sistemi",
  description:
    "Düğün salonları, davet evleri ve organizasyon mekanları için dijital davetiye, LCV takip, QR check-in, canlı fotoğraf duvarı ve müşteri aktivasyon paneli.",
  keywords: [
    "düğün salonları için dijital davetiye",
    "düğün salonu lcv takip sistemi",
    "davet evi dijital davetiye",
    "düğün salonu qr check-in",
    "organizasyon firmaları için davetiye paneli",
    "düğün salonu müşteri davetiyesi",
    "düğün salonu qr anı alanı",
  ],
  alternates: { canonical: "/dugun-salonlari-icin-dijital-davetiye" },
  openGraph: {
    title: "Düğün Salonları İçin Dijital Davetiye | Bekleriz",
    description:
      "Müşterilerinize profesyonel dijital davetiye, LCV takibi, QR giriş ve canlı anı deneyimi sunun.",
    url: `${SITE_URL}/dugun-salonlari-icin-dijital-davetiye`,
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const sorunlar = [
  {
    baslik: "Misafir sayısı netleşmiyor",
    aciklama: "LCV cevapları dağınık kalınca masa, menü ve personel planı son güne kadar değişiyor.",
  },
  {
    baslik: "Müşteri WhatsApp trafiğinde boğuluyor",
    aciklama: "Konum, saat, katılım ve kişi sayısı soruları tek tek cevaplanmak zorunda kalıyor.",
  },
  {
    baslik: "Salon deneyimi sadece mekanda başlıyor",
    aciklama: "Oysa müşteri deneyimi davetiye linkiyle başlıyor; salon markası daha ilk paylaşımda görünmeli.",
  },
];

const cozumler = [
  {
    baslik: "Müşteri aktivasyon linki",
    aciklama: "Salon, müşteriye aktivasyon linki verir. Müşteri kendi hesabında davetiyesini oluşturur ve verilerini kendisi yönetir.",
  },
  {
    baslik: "LCV ve kişi sayısı takibi",
    aciklama: "Katılıyor, katılamıyor, kişi sayısı ve notlar davetiye panelinde toplanır. Salon operasyonu daha erken netleşir.",
  },
  {
    baslik: "QR check-in",
    aciklama: "Girişte QR okutularak gelen davetliler takip edilebilir. Personel erişimi ayrı token ile verilir.",
  },
  {
    baslik: "Canlı fotoğraf duvarı",
    aciklama: "Onaylanan fotoğraflar salon ekranında akabilir. Etkinlik sırasında daha sosyal ve hatırlanır bir deneyim oluşur.",
  },
  {
    baslik: "WhatsApp paylaşım metinleri",
    aciklama: "Partner panelindeki hazır metinlerle müşteriye davetiye teslimi, takip ve hatırlatma mesajları kolaylaşır.",
  },
  {
    baslik: "KVKK açısından kontrollü yapı",
    aciklama: "Davetli ve anı verileri müşterinin hesabında kalır. Partner panelinde kişisel davetli listesi gösterilmez.",
  },
];

const kullanimAlanlari = [
  "Düğün salonları",
  "Davet evleri",
  "Kır düğünü mekanları",
  "Nikah sonrası yemek mekanları",
  "Organizasyon şirketleri",
  "Düğün fotoğrafçıları",
];

const surec = [
  "Salon partner paketi satın alır ve aylık aktivasyon hakkı kazanır.",
  "Her müşteri için panelden yeni bir aktivasyon linki oluşturulur.",
  "Müşteri kendi hesabıyla davetiyesini hazırlar, KVKK ve yasal onayları kendisi verir.",
  "Salon yalnızca aktivasyon ve operasyon durumunu takip eder; davetli verisi müşteride kalır.",
];

const faq = [
  {
    soru: "Düğün salonu müşterisinin davetli listesini görebilir mi?",
    cevap:
      "Hayır. Bekleriz partner modelinde davetli listesi, RSVP cevapları ve anı içerikleri müşterinin hesabında kalır. Partner panelinde kişisel davetli verileri gösterilmez.",
  },
  {
    soru: "Salon müşteriye ücretsiz dijital davetiye sunabilir mi?",
    cevap:
      "Evet. Salon veya organizasyon firması aylık partner paketi satın alır; müşterilerine aktivasyon linki vererek dijital davetiye hizmetini paketine dahil edebilir.",
  },
  {
    soru: "QR check-in düğün salonunda nasıl kullanılır?",
    cevap:
      "Müşteri davetli listesini oluşturur. Etkinlik günü yetkili personel, kendisine verilen erişim linkiyle davetlilerin QR kodunu okutarak giriş durumunu işaretler.",
  },
  {
    soru: "Canlı fotoğraf duvarı salonda ekranda açılabilir mi?",
    cevap:
      "Evet. Canlı duvar linki salon TV'sinde veya projeksiyonda açılabilir. Gönderilen fotoğraflar müşteri onayından sonra görünür.",
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

export default function DugunSalonlariIcinDijitalDavetiyePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Düğün Salonları İçin Dijital Davetiye",
        item: `${SITE_URL}/dugun-salonlari-icin-dijital-davetiye`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Düğün Salonları İçin Dijital Davetiye ve LCV Takip Sistemi",
    provider: { "@type": "Organization", name: "Bekleriz", url: SITE_URL },
    areaServed: "TR",
    serviceType: "Dijital davetiye, LCV takip, QR check-in ve partner aktivasyon paneli",
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Düğün salonları, davet evleri ve organizasyon firmaları",
    },
    url: `${SITE_URL}/dugun-salonlari-icin-dijital-davetiye`,
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
        <section className="relative min-h-[680px] overflow-hidden bg-[#090415] px-4 py-24 text-white sm:px-6 lg:py-28">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            src="/background.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#090415]/85 via-[#090415]/72 to-[#090415]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white to-transparent" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Düğün salonları ve davet evleri için
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Düğün salonunuz müşterilerine dijital davetiye, LCV ve QR giriş deneyimi sunsun
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                Bekleriz partner modeliyle her müşterinize profesyonel dijital davetiye aktivasyonu verin.
                Misafir takibi, QR check-in, canlı fotoğraf duvarı ve WhatsApp teslim akışı tek sistemde çalışır.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/partner/basvuru"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-black text-purple-700 transition hover:-translate-y-0.5 hover:bg-purple-50"
                >
                  Partner Başvurusu Yap
                </Link>
                <Link
                  href="/partner#paketler"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-4 text-sm font-bold text-white/85 transition hover:bg-white/10"
                >
                  Paketleri İncele
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-200/80">Salon operasyon özeti</p>
              <div className="mt-5 space-y-3">
                {[
                  ["LCV takibi", "Katılım ve kişi sayısı tek panelde"],
                  ["QR check-in", "Girişte hızlı davetli kontrolü"],
                  ["Canlı duvar", "Onaylı fotoğraflar salon ekranında"],
                  ["Partner paneli", "Aktivasyon ve durum takibi"],
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
              etiket="Problem"
              baslik="Düğün salonlarında davetiye süreci sadece tasarım meselesi değil, operasyon meselesi"
              aciklama="Misafir sayısı, giriş kontrolü, masa düzeni ve etkinlik anıları doğru yönetilmediğinde hem müşteri hem salon ekibi yorulur."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {sorunlar.map((sorun, index) => (
                <div key={sorun.baslik} className="rounded-3xl border border-gray-100 bg-gray-50 p-6">
                  <p className="text-3xl font-black text-purple-100">{index + 1}</p>
                  <h3 className="mt-6 text-lg font-black text-gray-950">{sorun.baslik}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">{sorun.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <SectionHead
              etiket="Çözüm"
              baslik="Müşteriye değer katan, salon ekibine yük bindirmeyen dijital davetiye sistemi"
              aciklama="Partner modelinde salon aktivasyon hakkını sunar; davetiye ve kişisel veriler müşterinin hesabında yönetilir."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cozumler.map(cozum => (
                <div key={cozum.baslik} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-5 h-1 w-12 rounded-full bg-purple-500" />
                  <h3 className="text-base font-black text-gray-950">{cozum.baslik}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">{cozum.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionHead
                etiket="Kimler kullanır?"
                baslik="Düğün, davet ve organizasyon işi yapan mekanlar için konumlandırıldı"
                aciklama="Bu sayfa yalnızca çiftlere değil, çiftlere hizmet satan işletmelere odaklanır."
              />
              <div className="flex flex-wrap gap-2">
                {kullanimAlanlari.map(alan => (
                  <span key={alan} className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700">
                    {alan}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">İş akışı</p>
              <div className="mt-6 space-y-4">
                {surec.map((adim, index) => (
                  <div key={adim} className="grid grid-cols-[36px_1fr] gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1.5 text-sm leading-7 text-gray-600">{adim}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#090415] px-4 py-20 text-white sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-300">KVKK uyumlu partner yaklaşımı</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
              Salon müşteriye hizmet sunar; davetli verisini üstlenmek zorunda kalmaz
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55">
              Düğün salonu veya davet evi, müşteriye aktivasyon hakkı sağlar. Davetli listesi, RSVP yanıtları,
              fotoğraf ve anı içerikleri müşterinin hesabında kalır. Bu yapı hem müşteri güveni hem de hukuki risklerin
              azaltılması için özellikle tercih edilir.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/partner" className="rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-purple-700 transition hover:bg-purple-50">
                Partner Programını İncele
              </Link>
              <Link href="/kvkk" className="rounded-2xl border border-white/15 px-7 py-3.5 text-sm font-bold text-white/75 transition hover:bg-white/10">
                KVKK Metnini Gör
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <SectionHead etiket="Sık sorulan sorular" baslik="Düğün salonu dijital davetiye sistemi hakkında" />
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
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-600">Başlamak için</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-black text-gray-950">
              Salonunuzun müşteri paketlerine dijital davetiye deneyimi ekleyin
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600">
              Başvuru sonrası partner paneli, aktivasyon hakları ve müşteri teslim akışı üzerinden ilerleyebilirsiniz.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/partner/basvuru" className="rounded-2xl bg-purple-600 px-8 py-4 text-sm font-black text-white transition hover:bg-purple-700">
                Partner Başvurusu Yap
              </Link>
              <Link href="/iletisim" className="rounded-2xl border border-purple-200 bg-white px-8 py-4 text-sm font-bold text-purple-700 transition hover:bg-purple-50">
                Sorularımı İlet
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

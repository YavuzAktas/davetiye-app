import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Dijital Nişan Davetiyesi Oluştur — Söz & Yüzük Töreni | Bekleriz",
  description:
    "Online nişan davetiyesi oluştur, WhatsApp ile paylaş, RSVP yanıtlarını takip et. Söz, nişan ve yüzük töreni için zarif dijital davetiye şablonları. 10 dakikada hazır.",
  keywords: [
    "nişan davetiyesi",
    "dijital nişan davetiyesi",
    "online nişan davetiyesi",
    "nişan davetiyesi oluştur",
    "söz davetiyesi",
    "yüzük töreni davetiyesi",
    "whatsapp nişan davetiyesi",
    "nişan davetiyesi şablonu",
    "elektronik nişan davetiyesi",
    "nişan ne zaman davetiye gönderilir",
  ],
  alternates: { canonical: "/nisan-davetiyesi" },
  openGraph: {
    title: "Dijital Nişan Davetiyesi Oluştur | Bekleriz",
    description:
      "Nişan ve söz töreni için 10 dakikada dijital davetiye hazırlayın. WhatsApp ile paylaşın, katılım yanıtlarını ve misafir listesini tek panelden yönetin.",
    url: `${SITE_URL}/nisan-davetiyesi`,
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const adimlar = [
  {
    n: "1",
    baslik: "Nişan şablonu seç",
    aciklama: "Sade, romantik veya lüks — törenin havasına uygun şablonu seçin. Ödeme öncesi tam önizleme.",
    icon: "💍",
  },
  {
    n: "2",
    baslik: "Bilgileri gir",
    aciklama: "Çiftlerin isimleri, nişan tarihi, mekan ve davet mesajı. İstersen müzik ve anı defteri ekle.",
    icon: "✏️",
  },
  {
    n: "3",
    baslik: "Öde, anında yayına al",
    aciklama: "Ödeme tamamlanır tamamlanmaz davetiyeni paylaşabilirsin. Aktivasyon bekleme yok.",
    icon: "⚡",
  },
  {
    n: "4",
    baslik: "Paylaş, takip et",
    aciklama: "WhatsApp'tan link gönder. Kimlerin geldiğini, kişi sayısını ve aile notlarını panelde gör.",
    icon: "📊",
  },
];

const ozellikler = [
  { icon: "📱", baslik: "Mobil uyumlu", aciklama: "Tüm telefon ve tarayıcılarda sorunsuz açılır — misafirler uygulama indirmeden görür." },
  { icon: "✅", baslik: "RSVP formu", aciklama: "Misafirler katılım durumunu ve kişi sayısını bildirir; sen gerçek zamanlı takip edersin." },
  { icon: "🎵", baslik: "Arka plan müziği", aciklama: "Davetiye açıldığında özel müzik çalar. İlk andan itibaren nişan atmosferi yaratır." },
  { icon: "💌", baslik: "Anı defteri", aciklama: "Aile ve arkadaşların yazılı iyi dilek mesajları tek yerde toplanır, PDF olarak indirilir." },
  { icon: "🔗", baslik: "Sınırsız paylaşım", aciklama: "Tek link, sınırsız kişiye gönderilebilir. WhatsApp, SMS, aile grupları — dilediğin her kanalda." },
  { icon: "✏️", baslik: "Bilgi güncelleme", aciklama: "Mekan değişse, saat ayarlanmış olsa — linki paylaştıktan sonra içeriği güncelleyebilirsin." },
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
    soru: "Nişan davetiyesi nasıl oluşturulur?",
    cevap:
      "Şablon seçilir, çiftlerin isimleri, nişan tarihi, mekan ve davet mesajı girilir. İsteğe bağlı müzik eklenir. Ödeme tamamlandıktan sonra davetiye anında yayına alınır. Ortalama 10 dakika sürer.",
  },
  {
    soru: "Nişan davetiyesi ile söz davetiyesi aynı sayfada hazırlanabilir mi?",
    cevap:
      "Evet. Davetiye metninde törenin söz, nişan veya yüzük merasimi olduğunu belirtebilir; tarih, saat ve mekan bilgilerini aynı sayfada sunabilirsiniz. Ayrı bir söz töreni programı varsa ikisini de metne ekleyebilirsiniz.",
  },
  {
    soru: "Nişan davetiyesi ne zaman gönderilmelidir?",
    cevap:
      "Küçük aile nişanları için 2–3 hafta öncesi yeterlidir. Misafir listesi geniş veya şehir dışından gelenler varsa 4–6 hafta öncesinden gönderilmesi önerilir. Dijital davetiyenin avantajı: hatırlatma mesajı göndermek için linki yeniden paylaşabilirsiniz.",
  },
  {
    soru: "Online nişan davetiyesi WhatsApp ile gönderilir mi?",
    cevap:
      "Evet. Hazırladığınız nişan davetiyesini link olarak WhatsApp kişi veya gruplarına gönderebilirsiniz. Misafirler linke tıkladığında davetiye tarayıcıda açılır; herhangi bir uygulama indirmeleri gerekmez.",
  },
  {
    soru: "Nişan davetiyesi sonradan düzenlenebilir mi?",
    cevap:
      "Evet. Mekan, saat, mesaj gibi içerikler ödeme sonrası istediğiniz zaman güncellenebilir. Paylaştığınız link aynı kalır; misafirler linki yeniden açtığında güncel bilgiyi görür.",
  },
  {
    soru: "Nişan katılım takibi nasıl çalışır?",
    cevap:
      "Misafirler davetiye sayfasındaki RSVP formunu doldurur: gelip gelmeyeceğini, kaç kişi olduğunu ve isteğe bağlı not ekler. Tüm yanıtlar yönetim panelinizde anlık görünür ve Excel'e aktarılabilir.",
  },
  {
    soru: "Nişan davetiyesinde arka plan müziği kullanılabilir mi?",
    cevap:
      "Evet. Müzik eklentisini seçerseniz davetiye açıldığında seçtiğiniz parça arka planda otomatik çalmaya başlar. Bu, nişanın duygusal atmosferini dijital ortama taşımanın en etkili yollarından biridir.",
  },
  {
    soru: "Hem nişan hem de düğün için ayrı davetiye oluşturulabilir mi?",
    cevap:
      "Evet. Nişan ve düğün için ayrı ayrı davetiye oluşturabilirsiniz. Her biri bağımsız link ve RSVP formuna sahip olur. Bu sayede katılımcı listelerini ayrı ayrı yönetebilirsiniz.",
  },
];

export default function NisanDavetiyesiPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.soru,
      acceptedAnswer: { "@type": "Answer", text: item.cevap },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Nişan Davetiyesi", item: `${SITE_URL}/nisan-davetiyesi` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Dijital Nişan Davetiyesi",
    provider: { "@type": "Organization", name: "Bekleriz", url: SITE_URL },
    description: "Online nişan ve söz töreni davetiyesi oluşturma, paylaşma ve RSVP takip hizmeti.",
    areaServed: "TR",
    offers: { "@type": "Offer", priceCurrency: "TRY", price: "349", priceValidUntil: "2027-12-31" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <main className="bg-white">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#17030b] via-[#2a0714] to-[#4a1020] px-4 py-24 sm:py-28">
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-rose-400/15 blur-3xl" />
          <div className="absolute -right-44 bottom-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-rose-100/75">
                Dijital nişan davetiyesi
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                Nişan davetiyesi oluştur,<br className="hidden sm:block" /> sevdiklerini zarif bir linkle davet et
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Söz, nişan ve yüzük töreniniz için 10 dakikada hazır dijital davetiye oluşturun.
                WhatsApp ile paylaşın, katılım yanıtlarını ve misafir listenizi kolayca takip edin.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/sablonlar"
                  className="rounded-2xl bg-white px-8 py-4 text-center text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5 hover:shadow-xl">
                  Nişan Davetiyesi Oluştur
                </Link>
                <Link href="/davetiye/ornek-nisan"
                  className="rounded-2xl border border-white/15 px-8 py-4 text-center text-sm font-semibold text-white/80 transition hover:bg-white/8">
                  Örnek Nişan Davetiyesi
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["💍","💑","🌹","⭐"].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm">{e}</div>
                  ))}
                </div>
                <p className="text-sm text-white/40">
                  <span className="text-white font-semibold">200+</span> çift nişan davetiyesini Bekleriz ile oluşturdu
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="rounded-[28px] bg-linear-to-br from-[#3b0a14] to-[#17030b] p-8 text-center text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-amber-100/65">Nişan Davetiyesi</p>
                <h2 className="mt-6 text-5xl" style={{ fontFamily: "var(--font-dancing), cursive" }}>Aylin & Yavuz</h2>
                <div className="mx-auto my-6 h-px w-28 bg-linear-to-r from-transparent via-amber-100/50 to-transparent" />
                <p className="text-sm leading-7 text-white/65">
                  Bu güzel başlangıcımıza tanıklık etmenizden mutluluk duyarız.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-white/80">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">6 Haziran 2026, Cumartesi · 18:00</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">Aile arasında yüzük töreni</div>
                </div>
                <button className="mt-5 w-full rounded-xl bg-rose-400/70 py-2.5 text-sm font-semibold text-white hover:bg-rose-400 transition">
                  Katılıyorum ✓
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4 Adım ── */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">Nasıl çalışır</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                4 adımda nişan davetiyesi hazırla
              </h2>
              <p className="mt-4 text-gray-500 text-sm max-w-xl mx-auto">
                Tasarım bilgisi gerekmez, uygulama indirme yok. Şablonu seç, bilgileri gir, WhatsApp&apos;tan paylaş.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {adimlar.map((adim, idx) => (
                <div key={adim.n} className="relative rounded-3xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  {idx < adimlar.length - 1 && (
                    <div className="hidden lg:block absolute top-10 right-0 translate-x-1/2 text-gray-200 text-xl z-10">→</div>
                  )}
                  <div className="text-3xl mb-4">{adim.icon}</div>
                  <div className="text-xs font-bold text-rose-500 mb-2">Adım {adim.n}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{adim.baslik}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{adim.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Özellikler ── */}
        <section className="bg-rose-50/40 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">Özellikler</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Nişan davetiyesinde neler var?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ozellikler.map((o) => (
                <div key={o.baslik} className="rounded-3xl bg-white border border-rose-100/60 p-6 shadow-sm">
                  <div className="text-3xl mb-3">{o.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{o.baslik}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{o.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── İçerik kontrolü ── */}
        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">Davetiye içeriği</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Nişan davetiyesinde hangi bilgiler yer almalı?
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                Nişan davetiyesi genellikle daha samimi bir dille yazılır. Ailelerin daveti, tören
                saati, mekan bilgisi ve katılım bildirimi net olursa misafirler için süreç kolaylaşır.
                Online davetiyenin avantajı: bilgi değişirse linki güncelleyebilir, misafirler yeniden
                açtığında doğru bilgiyi görür.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/sablonlar"
                  className="rounded-2xl bg-gray-950 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800">
                  Nişan Şablonlarını İncele
                </Link>
                <Link href="/dugun-davetiyesi"
                  className="rounded-2xl border border-rose-100 bg-white px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-rose-50">
                  Düğün Davetiyesi
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {bilgiler.map((madde) => (
                <div key={madde} className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 px-5 py-4 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{madde}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
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
                    kişi sayısı ve ikram hazırlığını daha rahat planlayabilirsiniz.
                    Tüm veriler Excel&apos;e aktarılabilir.
                  </p>
                  <Link href="/sablonlar"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition">
                    Davetiyeni Oluştur →
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    ["Aile", "18 kişi"],
                    ["Yakın arkadaşlar", "12 kişi"],
                    ["Katılamayanlar", "3 kişi"],
                    ["Toplam katılımcı", "30 kişi"],
                  ].map(([grup, sayi]) => (
                    <div key={grup} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-5 py-3.5">
                      <span className="text-sm font-semibold text-white/85">{grup}</span>
                      <span className="text-xs text-white/45">{sayi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-gray-50 px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">SSS</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Nişan davetiyesi hakkında sorular
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.soru} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-950 mb-3">{item.soru}</h3>
                  <p className="text-sm leading-6 text-gray-500">{item.cevap}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Son CTA ── */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Nişan davetiyeni bugün oluştur
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto">
              34+ şablon, anında yayın, sınırsız RSVP. Aylık abonelik yok — sadece bu nişan için, tek seferlik ödeme.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sablonlar"
                className="rounded-2xl bg-gray-950 px-8 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition hover:-translate-y-0.5 hover:shadow-xl">
                Nişan şablonlarını incele
              </Link>
              <Link href="/fiyatlar"
                className="rounded-2xl border border-gray-200 px-8 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                Fiyatlara bak →
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { icon: "💒", href: "/dugun-davetiyesi", text: "Düğün davetiyesi" },
                { icon: "🎂", href: "/sablonlar", text: "Doğum günü davetiyesi" },
                { icon: "💌", href: "/online-davetiye", text: "Online davetiye rehberi" },
              ].map((link) => (
                <Link key={link.text} href={link.href}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1.5 hover:underline">
                  {link.icon} {link.text}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Dijital Düğün Davetiyesi Oluştur — WhatsApp ile Paylaş | DavetRota",
  description:
    "Online düğün davetiyesi oluştur, WhatsApp ile paylaş ve RSVP yanıtlarını tek panelden takip et. Kağıt bastırmadan, 10 dakikada hazır. 34+ düğün davetiyesi şablonu.",
  keywords: [
    "düğün davetiyesi",
    "dijital düğün davetiyesi",
    "online düğün davetiyesi",
    "düğün davetiyesi oluştur",
    "whatsapp düğün davetiyesi",
    "düğün davetiyesi şablonu",
    "nikah davetiyesi",
    "düğün davetiyesi ne zaman gönderilir",
    "elektronik düğün davetiyesi",
    "ücretsiz düğün davetiyesi",
  ],
  alternates: { canonical: "/dugun-davetiyesi" },
  openGraph: {
    title: "Dijital Düğün Davetiyesi Oluştur | DavetRota",
    description:
      "Düğün ve nikah için 10 dakikada dijital davetiye hazırlayın. WhatsApp'tan paylaşın, katılım yanıtlarını ve misafir listesini tek panelden yönetin.",
    url: `${SITE_URL}/dugun-davetiyesi`,
    type: "website",
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const adimlar = [
  {
    n: "1",
    baslik: "Şablon seç",
    aciklama: "Klasik, modern veya lüks — düğün tarzınıza uyan şablonu seçin. Ödeme yapmadan önce tam önizleme görün.",
    icon: "🎨",
  },
  {
    n: "2",
    baslik: "Bilgileri gir",
    aciklama: "İsimler, tarih, mekan, davet mesajı. İstersen arka plan müziği ve fotoğraf albümü ekle.",
    icon: "✏️",
  },
  {
    n: "3",
    baslik: "Öde, anında yayına al",
    aciklama: "Ödeme onaylanır onaylanmaz davetiyeni paylaşmaya başlayabilirsin. Bekleme yok, aktivasyon yok.",
    icon: "⚡",
  },
  {
    n: "4",
    baslik: "Paylaş, takip et",
    aciklama: "WhatsApp'tan link gönder. Kimlerin geldiğini, kişi sayısını ve notları panelde gör.",
    icon: "📊",
  },
];

const ozellikler = [
  { icon: "📱", baslik: "Mobil uyumlu", aciklama: "Her telefon ve tarayıcıda sorunsuz açılır — misafirlerin uygulama indirmesine gerek yok." },
  { icon: "✅", baslik: "RSVP formu", aciklama: "Misafirler davetiye üzerinden katılım durumunu bildirir; sen gerçek zamanlı takip edersin." },
  { icon: "🎵", baslik: "Arka plan müziği", aciklama: "Davetiyene müzik ekle — açıldığında ilk andan itibaren atmosfer oluşsun." },
  { icon: "📸", baslik: "Fotoğraf albümü", aciklama: "Misafirler etkinlik fotoğraflarını yükler, sen onaylarsın. Ortak anı arşivi oluşur." },
  { icon: "💌", baslik: "Anı defteri", aciklama: "Yazılı iyi dilek ve anı mesajları davetiyende birikir, PDF olarak indirilir." },
  { icon: "🔗", baslik: "Sınırsız paylaşım", aciklama: "Tek link, sınırsız kişiye gönderilebilir. WhatsApp, SMS, e-posta — fark etmez." },
];

const karsilastirma = [
  { kriter: "Hazırlık süresi", kagit: "3–5 gün baskı + teslimat", dijital: "10 dakika" },
  { kriter: "Maliyet", kagit: "₺2.000+ baskı + kargo", dijital: "₺349'dan başlar" },
  { kriter: "Bilgi güncelleme", kagit: "Mümkün değil", dijital: "İstediğin zaman" },
  { kriter: "Katılım takibi", kagit: "Telefon araması gerekir", dijital: "Otomatik RSVP paneli" },
  { kriter: "Gönderim", kagit: "Fiziksel dağıtım", dijital: "WhatsApp / SMS / e-posta" },
  { kriter: "Anı arşivi", kagit: "Yok", dijital: "Fotoğraf, anı, sesli mesaj" },
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
      "Şablon seçilir, çiftlerin isimleri, düğün tarihi, mekan ve davet mesajı girilir. İsteğe bağlı müzik ve fotoğraf albümü eklenir. Ödeme tamamlanır ve davetiye anında yayına alınır. Oluşturma süreci ortalama 10 dakika sürer.",
  },
  {
    soru: "Dijital düğün davetiyesi ne zaman gönderilmesi gerekir?",
    cevap:
      "Online davetiyenin avantajı, anında hazır ve gönderilebilir olmasıdır. Genel kural: yakın çevre için 3–4 hafta, geniş davet listesi için 6–8 hafta öncesinden gönderilmesi tavsiye edilir. Düğünden 3–5 gün önce hatırlatma mesajı eklenebilir.",
  },
  {
    soru: "Düğün davetiyesini WhatsApp ile gönderebilir miyim?",
    cevap:
      "Evet. Davetiye linki WhatsApp kişi listesine veya gruplarına yapıştırılarak paylaşılır. Misafirler linke tıkladığında davetiye sayfası doğrudan tarayıcıda açılır; herhangi bir uygulama indirmeleri gerekmez.",
  },
  {
    soru: "Nikah ve düğün bilgileri aynı davetiyede olabilir mi?",
    cevap:
      "Evet. Nikah töreni ve düğün ayrı saat ve mekanda olsa da davetiye metninde her ikisine de yer verilebilir. Dilediğiniz metin düzenini özgürce yazabilirsiniz.",
  },
  {
    soru: "Düğün davetiyesinde katılım takibi nasıl çalışır?",
    cevap:
      "Misafirler davetiye sayfasındaki RSVP formunu doldurur: katılıp katılmayacağını, kaç kişi olduğunu ve isteğe bağlı not ekler. Tüm yanıtlar yönetim panelinizde gerçek zamanlı görünür; Excel'e aktarabilirsiniz.",
  },
  {
    soru: "Düğünden sonra davetiye üzerindeki içerikler kaybolur mu?",
    cevap:
      "Hayır. Oluşturduğunuz davetiye sayfası aktif kalmaya devam eder. Misafirlerin yüklediği fotoğraflar, yazılı anı ve sesli mesajlar arşivde saklanır ve Anı Kitabı PDF olarak indirilebilir.",
  },
  {
    soru: "Düğün davetiyesi şablonu sonradan değiştirilebilir mi?",
    cevap:
      "Metin, tarih, mekan ve mesaj gibi içerikler ödeme sonrası istediğiniz zaman güncellenebilir. Şablon tasarımı (görsel tema) ise ödeme yapıldıktan sonra değiştirilemez; bu nedenle ödeme öncesinde tam önizlemeyi görmenizi öneririz.",
  },
  {
    soru: "Ödeme yapmadan önce davetiyeyi görebilir miyim?",
    cevap:
      "Evet. Oluşturma akışında kendi bilgilerinizi girerken canlı önizleme sağ panelde görünür. Ödeme yapılmadan önce davetiyenin tam görünümünü değerlendirebilirsiniz.",
  },
];

export default function DugunDavetiyesiPage() {
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
      { "@type": "ListItem", position: 2, name: "Düğün Davetiyesi", item: `${SITE_URL}/dugun-davetiyesi` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Dijital Düğün Davetiyesi",
    provider: { "@type": "Organization", name: "DavetRota", url: SITE_URL },
    description: "Online düğün davetiyesi oluşturma, paylaşma ve RSVP takip hizmeti.",
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
        <section className="relative overflow-hidden bg-[#080112] px-4 py-24 sm:py-28">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
          <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-rose-600/20 blur-3xl" />
          <div className="absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-rose-200">
                Dijital düğün davetiyesi
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                Düğün davetiyesi oluştur,<br className="hidden sm:block" /> davetlilerini tek linkle bilgilendir
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                Kağıt bastırmak yerine 10 dakikada hazır dijital davetiye oluşturun. WhatsApp ile paylaşın,
                katılım yanıtlarını ve misafir listesini tek panelden yönetin.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/sablonlar"
                  className="rounded-2xl bg-white px-8 py-4 text-center text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5 hover:shadow-xl">
                  Düğün Davetiyesi Oluştur
                </Link>
                <Link href="/davetiye/ornek-dugun"
                  className="rounded-2xl border border-white/15 px-8 py-4 text-center text-sm font-semibold text-white/80 transition hover:bg-white/8">
                  Örnek Davetiyeyi Gör
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["💍","💒","🌹","⭐"].map((e, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm">{e}</div>
                  ))}
                </div>
                <p className="text-sm text-white/40">
                  <span className="text-white font-semibold">500+</span> çift düğün davetiyesini DavetRota ile oluşturdu
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="rounded-[28px] bg-linear-to-br from-[#111827] to-[#4c0519] p-8 text-center text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-rose-200/70">Düğün Davetiyesi</p>
                <h2 className="mt-6 text-5xl" style={{ fontFamily: "var(--font-dancing), cursive" }}>Ayşe & Mehmet</h2>
                <div className="mx-auto my-6 h-px w-28 bg-linear-to-r from-transparent via-rose-200/50 to-transparent" />
                <p className="text-sm leading-7 text-white/65">
                  Bu mutlu günümüzde sizi de aramızda görmekten mutluluk duyarız.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-white/80">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">12 Eylül 2026, Cumartesi</div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">İstanbul — Çırağan Sarayı</div>
                </div>
                <button className="mt-5 w-full rounded-xl bg-rose-500/80 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition">
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
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Nasıl çalışır</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                4 adımda düğün davetiyesi hazırla
              </h2>
              <p className="mt-4 text-gray-500 text-sm max-w-xl mx-auto">
                Tasarım bilgisi gerekmez, uygulama indirme yok. Şablonu seç, bilgileri gir, link olarak paylaş.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {adimlar.map((adim, idx) => (
                <div key={adim.n} className="relative rounded-3xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  {idx < adimlar.length - 1 && (
                    <div className="hidden lg:block absolute top-10 right-0 translate-x-1/2 text-gray-200 text-xl z-10">→</div>
                  )}
                  <div className="text-3xl mb-4">{adim.icon}</div>
                  <div className="text-xs font-bold text-purple-500 mb-2">Adım {adim.n}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{adim.baslik}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{adim.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Özellikler ── */}
        <section className="bg-gray-50 px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Özellikler</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Düğün davetiyesinde neler var?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ozellikler.map((o) => (
                <div key={o.baslik} className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
                  <div className="text-3xl mb-3">{o.icon}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{o.baslik}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{o.aciklama}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Davetiyede ne olmalı ── */}
        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">İçerik kontrolü</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
                Düğün davetiyesinde hangi bilgiler olmalı?
              </h2>
              <p className="mt-5 text-sm leading-7 text-gray-500">
                İyi bir düğün davetiyesi hem duygusal tonu hem de pratik bilgileri net verir.
                Online davetiyenin avantajı: mekan değişirse linki güncelleyebilir, bilgiyi tekrar göndermeden
                tüm misafirler yeni bilgiyi görür.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/blog/dugun-davetiye-sozleri"
                  className="rounded-2xl bg-gray-950 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800">
                  Davetiye Sözleri
                </Link>
                <Link href="/dijital-davetiye"
                  className="rounded-2xl border border-gray-200 px-7 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-white">
                  Dijital Davetiye Rehberi
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {kontrolListesi.map((madde) => (
                <div key={madde} className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 px-5 py-4 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{madde}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Karşılaştırma ── */}
        <section className="bg-gray-50 px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">Karşılaştırma</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Kağıt davetiye mi, dijital davetiye mi?
              </h2>
              <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
                Her ikisinin de yeri var — ama 2025'te çoğu çift ikisini birden kullanmak yerine dijitalde karar kılıyor.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 bg-gray-950 text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5">
                <div>Kriter</div>
                <div className="text-center">Kağıt Davetiye</div>
                <div className="text-center text-purple-400">Dijital Davetiye</div>
              </div>
              {karsilastirma.map((satir, i) => (
                <div key={satir.kriter}
                  className={`grid grid-cols-3 px-5 py-4 text-sm border-b last:border-b-0 border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="font-medium text-gray-700">{satir.kriter}</div>
                  <div className="text-center text-gray-400">{satir.kagit}</div>
                  <div className="text-center font-semibold text-purple-600">{satir.dijital}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
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
                    panelinizde toplanır. Masa planı ve organizasyon hazırlığı daha kontrollü ilerler.
                    Ayrıca Excel'e aktararak katerer ve mekânla paylaşabilirsiniz.
                  </p>
                  <Link href="/sablonlar"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition">
                    Davetiyeni Oluştur →
                  </Link>
                </div>
                <div className="space-y-3">
                  {[
                    ["Ayşe K.", "Katılıyor", "2 kişi", "bg-emerald-500"],
                    ["Mehmet T.", "Katılıyor", "4 kişi", "bg-emerald-500"],
                    ["Fatma Y.", "Katılamıyor", "—", "bg-rose-500"],
                    ["Ali & Zeynep", "Katılıyor", "2 kişi", "bg-emerald-500"],
                  ].map(([isim, durum, sayi, renk]) => (
                    <div key={isim} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${renk}`} />
                      <span className="flex-1 text-sm font-semibold text-white/85">{isim}</span>
                      <span className="text-xs text-white/40 mr-2">{sayi}</span>
                      <span className="text-xs text-white/40">{durum}</span>
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
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-purple-500">SSS</p>
              <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
                Düğün davetiyesi hakkında sorular
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
              Düğün davetiyeni bugün oluştur
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto">
              34+ şablon, anında yayın, sınırsız RSVP. Aylık abonelik yok — sadece bu düğün için, tek seferlik ödeme.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/sablonlar"
                className="rounded-2xl bg-gray-950 px-8 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition hover:-translate-y-0.5 hover:shadow-xl">
                Düğün şablonlarını incele
              </Link>
              <Link href="/fiyatlar"
                className="rounded-2xl border border-gray-200 px-8 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                Fiyatlara bak →
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {[
                { icon: "💍", text: "Düğün davetiyesi" },
                { icon: "💒", text: "Nikah davetiyesi" },
                { icon: "💑", text: "Nişan davetiyesi" },
              ].map((link) => (
                <Link key={link.text} href="/sablonlar"
                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1.5 hover:underline">
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

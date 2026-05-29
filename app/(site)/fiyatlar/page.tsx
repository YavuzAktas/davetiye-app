import Link from "next/link";
import { DAVETIYE_FIYAT_KALEMLERI, ASIL_FIYAT_KODU, indirimOrani, tutarMetni } from "@/lib/davetiye-fiyatlandirma";
import FiyatHesaplama from "@/components/FiyatHesaplama";
import { SABLONLAR } from "@/lib/sablonlar";

const K = DAVETIYE_FIYAT_KALEMLERI;
const LUKS_SABLONLAR = new Set(["nisan-luks", "dugun-luks", "dogumgunu-luks"]);

const PAKETLER = [
  {
    id: "baslangic",
    icon: "✉️",
    ad: "Başlangıç",
    slogan: "Davetiye + RSVP — hepsi hazır",
    renk: "#6366f1",
    populer: false,
    kalemler: [K.temel],
    dahil: ["Mobil uyumlu şablon", "RSVP formu", "Paylaşım linki", "QR kod", "Yönetim paneli"],
    dahilDegil: ["Müzik", "Fotoğraf albümü", "Anı defteri", "Sesli anı", "Anı Kitabı PDF", "Canlı duvar", "Oturma planı"],
  },
  {
    id: "populer",
    icon: "🎵",
    ad: "Popüler",
    slogan: "Misafirler anı bıraksın, siz PDF indirin",
    renk: "#9333EA",
    populer: true,
    kalemler: [K.temel, K.muzik, K.album, K.aniDefteri, K.aniKitabi],
    dahil: ["Mobil uyumlu şablon", "RSVP formu", "Paylaşım linki", "QR kod", "Yönetim paneli", "Arka plan müziği", "Fotoğraf albümü", "Anı defteri", "Anı Kitabı PDF"],
    dahilDegil: ["Canlı duvar", "Sesli anı", "Oturma planı"],
  },
  {
    id: "tam-paket",
    icon: "💒",
    ad: "Tam Paket",
    slogan: "Hiçbir an kaybolmasın",
    renk: "#DB2777",
    populer: false,
    kalemler: [K.temel, K.muzik, K.album, K.aniDefteri, K.canliDuvar, K.sesliAni, K.aniKitabi],
    dahil: ["Mobil uyumlu şablon", "RSVP formu", "Paylaşım linki", "QR kod", "Yönetim paneli", "Arka plan müziği", "Fotoğraf albümü", "Anı defteri", "Anı Kitabı PDF", "Canlı fotoğraf duvarı", "Sesli anı defteri"],
    dahilDegil: ["Oturma planı"],
  },
] as const;


const NASIL_CALISIR = [
  { n: "1", baslik: "Şablonu seç, önizle", aciklama: "34+ şablon arasından beğendiğini seç. Ödeme yapmadan önce tam önizlemeyi gör.", icon: "🎨" },
  { n: "2", baslik: "İstediğini ekle", aciklama: "Müzik, fotoğraf albümü, anı defteri — hangisini istersen sadece onu seç.", icon: "⚙️" },
  { n: "3", baslik: "Fiyatı canlı gör", aciklama: "Her seçimde toplam tutar anında güncellenir. Sürpriz çıkmaz.", icon: "💰" },
  { n: "4", baslik: "Öde — anında yayın", aciklama: "Ödeme onaylanır onaylanmaz davetiyeni paylaşabilirsin. Bekleme yok.", icon: "🚀" },
];

const GUVEN_BADGELERI = [
  { icon: "🔒", baslik: "SSL Şifreli",       aciklama: "Tüm veriler şifreli iletilir" },
  { icon: "✅", baslik: "iyzico Altyapısı",   aciklama: "Güvenilir ödeme sistemi" },
  { icon: "🚫", baslik: "Abonelik Yok",       aciklama: "Otomatik yenileme yok" },
  { icon: "🎯", baslik: "Tek Seferlik",       aciklama: "Sadece o davetiye için" },
  { icon: "💳", baslik: "3D Secure",          aciklama: "Kart bilgin bizde saklanmaz" },
  { icon: "📄", baslik: "Ödeme Belgesi",      aciklama: "Destek üzerinden talep edilir" },
];

const SORU_CEVAP = [
  {
    soru: "Bekleriz abonelik mi?",
    cevap: "Hayır. Her davetiye için seçilen özelliklere göre tek seferlik ödeme alınır. Abonelik veya otomatik yenileme yoktur.",
  },
  {
    soru: "Ödeme güvenli mi?",
    cevap: "Tüm ödemeler iyzico altyapısıyla SSL şifreli bağlantı üzerinden işlenir. Kart bilgileriniz tarafımızca saklanmaz.",
  },
  {
    soru: "İptal edebilir miyim?",
    cevap: "Dijital hizmet ödeme sonrası başlatılır; ödeme öncesinde cayma hakkı istisnası ayrıca onaylanır. Hizmetin hiç kullanılmadığı durumlarda destek üzerinden iade değerlendirmesi isteyebilirsiniz.",
  },
  {
    soru: "Fatura alabilir miyim?",
    cevap: "Ödeme belgesi veya fatura talebi için destek@bekleriz.com adresine yazabilirsiniz. Talebiniz kayıt bilgileriniz ve yürürlükteki mevzuata göre değerlendirilir.",
  },
  {
    soru: "Ödeme sonrasında özellik ekleyebilir miyim?",
    cevap: "Şu an için hayır. Özellikler davetiye oluşturulurken seçilir ve ödeme tamamlandıktan sonra değiştirilemez.",
  },
];

function toplam(kalemler: readonly { tutar: number }[]) {
  return kalemler.reduce((a, k) => a + k.tutar, 0);
}

function asılToplam(kalemler: readonly { kod: string; tutar: number }[]) {
  return kalemler.reduce((a, k) => a + (ASIL_FIYAT_KODU[k.kod] ?? k.tutar), 0);
}

function tekilParametre(deger: string | string[] | undefined) {
  return Array.isArray(deger) ? deger[0] : deger;
}

function SectionHead({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-600/70 mb-2">{label}</p>
      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{title}</h2>
      {sub && <p className="text-gray-500 text-sm max-w-xl">{sub}</p>}
    </div>
  );
}

export default async function FiyatlarSayfasi({
  searchParams,
}: {
  searchParams?: Promise<{ sablon?: string | string[] }>;
}) {
  const params = searchParams ? await searchParams : {};
  const sablonId = tekilParametre(params.sablon);
  const seciliSablon = sablonId ? SABLONLAR.find(s => s.id === sablonId) : undefined;
  const baslaHref = seciliSablon ? `/olustur?sablon=${encodeURIComponent(seciliSablon.id)}` : "/sablonlar";
  const baslaMetni = seciliSablon ? `${seciliSablon.isim} ile Devam Et` : "Şablon Seç ve Başla";
  const luksSablonSecili = !!seciliSablon && LUKS_SABLONLAR.has(seciliSablon.id);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══ § 1  HERO ══ */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-10 sm:pb-14 px-4 sm:px-6 bg-white border-b border-gray-100">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 sm:w-175 h-96 sm:h-175 rounded-full bg-purple-100/60 blur-[100px] pointer-events-none" />
        <div className="absolute top-32 right-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-pink-100/50 blur-[80px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-3.5 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-purple-600">
              Aylık abonelik yok · Davetiye başına tek ödeme
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight mb-5">
            Seçtiğin kadar,{" "}
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-purple-600 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                o kadar öde
              </span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-linear-to-r from-purple-500/0 via-purple-400/50 to-purple-500/0" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
            Her davetiye için tek seferlik ödeme — aylık otomatik ücretlendirme yok.
            Toplam tutarı satın almadan önce canlı görürsün; ödeme tamamlanır tamamlanmaz davetiyeni paylaşabilirsin.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { icon: "🚫", text: "Abonelik yok" },
              { icon: "🔄", text: "Yenileme yok" },
              { icon: "🎯", text: "Tek seferlik" },
              { icon: "💳", text: "iyzico güvencesi" },
            ].map(pill => (
              <span key={pill.text} className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-medium text-gray-600">
                <span>{pill.icon}</span>
                {pill.text}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={baslaHref}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-7 py-3.5 rounded-2xl text-sm font-bold hover:bg-purple-700 hover:-translate-y-0.5 transition-all shadow-sm shadow-purple-200"
            >
              {baslaMetni}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#hesapla"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 text-gray-600 px-7 py-3.5 rounded-2xl text-sm font-semibold hover:bg-gray-100 hover:text-gray-800 transition-all"
            >
              Fiyat Hesapla
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══ § 1.5  GÜVENCE ŞERİDİ ══ */}
      <div className="border-b border-gray-100 bg-linear-to-r from-purple-50/50 via-white to-pink-50/40 px-4 sm:px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-10">
          {[
            { icon: "👁️", text: "Ödeme öncesi tam önizleme" },
            { icon: "🔒", text: "Kart bilgileri bizde saklanmaz" },
            { icon: "🎯", text: "Tek seferlik ödeme, abonelik yok" },
            { icon: "⚡", text: "Ödeme sonrası anında yayın" },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-semibold text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ § 2  PAKET ANKRAJI ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8" />
          <SectionHead
            label="Hazır Paketler"
            title="Hangi paket sana uygun?"
            sub="Hızlı başlamak için bir paket seç. İstersen hesaplayıcıyla özelleştir."
          />

          {/* 3-column package grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {PAKETLER.map(paket => {
              const tutar    = toplam(paket.kalemler);
              const asil     = asılToplam(paket.kalemler);
              const indirim  = indirimOrani(asil, tutar);
              const kisiBasi = Math.ceil(tutar / 100);

              return (
                <div
                  key={paket.id}
                  className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
                    paket.populer
                      ? "sm:-mt-4 sm:mb-0 shadow-xl shadow-purple-200/60"
                      : "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                  }`}
                  style={paket.populer ? {
                    background: "linear-gradient(160deg, #7c3aed 0%, #9333ea 50%, #a855f7 100%)",
                  } : {}}
                >
                  {/* Popular badge */}
                  {paket.populer && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center">
                      <div className="bg-white/20 text-white text-[10px] font-black tracking-[0.18em] uppercase px-4 py-1.5 rounded-b-xl">
                        En Popüler
                      </div>
                    </div>
                  )}

                  {/* Gradient top strip for non-popular */}
                  {!paket.populer && (
                    <div className="h-1" style={{ background: paket.renk }} />
                  )}

                  <div className={`flex flex-col flex-1 p-6 ${paket.populer ? "pt-10" : ""}`}>
                    {/* Header */}
                    <div className="mb-6">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl mb-3"
                        style={paket.populer
                          ? { background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }
                          : { background: `${paket.renk}14`, border: `1px solid ${paket.renk}28` }
                        }
                      >
                        {paket.icon}
                      </div>
                      <h3 className={`text-base font-black mb-0.5 ${paket.populer ? "text-white" : "text-gray-800"}`}>
                        {paket.ad}
                      </h3>
                      <p className={`text-xs ${paket.populer ? "text-white/70" : "text-gray-400"}`}>{paket.slogan}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-sm tabular-nums line-through ${paket.populer ? "text-white/50" : "text-gray-400"}`}>{tutarMetni(asil)}</span>
                        <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full"
                          style={paket.populer
                            ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                            : { background: "rgba(16,185,129,0.1)", color: "#059669", border: "1px solid rgba(16,185,129,0.2)" }
                          }>
                          %{indirim} İNDİRİM
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className={`text-4xl font-black tabular-nums leading-none ${paket.populer ? "text-white" : "text-gray-900"}`}>
                          {tutarMetni(tutar)}
                        </span>
                      </div>
                      <p className={`text-xs ${paket.populer ? "text-white/60" : "text-gray-400"}`}>
                        ≈ 100 misafir için <span className={`font-semibold ${paket.populer ? "text-white/80" : "text-gray-600"}`}>kişi başı {tutarMetni(kisiBasi)}</span>
                      </p>
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-2 mb-6">
                      {paket.dahil.map(f => (
                        <div key={f} className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            paket.populer ? "bg-white/25" : "bg-purple-100"
                          }`}>
                            <svg className={`w-2.5 h-2.5 ${paket.populer ? "text-white" : "text-purple-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className={`text-xs ${paket.populer ? "text-white/85" : "text-gray-600"}`}>{f}</span>
                        </div>
                      ))}
                      {paket.dahilDegil.map(f => (
                        <div key={f} className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                            paket.populer ? "border-white/20 bg-white/5" : "border-gray-200 bg-gray-50"
                          }`}>
                            <svg className={`w-2.5 h-2.5 ${paket.populer ? "text-white/30" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <span className={`text-xs line-through ${paket.populer ? "text-white/30" : "text-gray-300"}`}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href={baslaHref}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold transition-all ${
                        paket.populer
                          ? "bg-white text-purple-600 hover:bg-purple-50"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {seciliSablon ? "Bu Şablonla Devam Et" : "Bu Paketle Başla"}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Karşılaştırma notu */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <p className="text-xs text-gray-400 text-center">
              Baskılı davetiye: 2.000–8.000₺ + dağıtım maliyeti
            </p>
            <span className="hidden sm:block text-gray-200">·</span>
            <p className="text-xs text-gray-400 text-center">
              Bekleriz ile tüm misafirlere <span className="text-gray-600 font-medium">sınırsız dijital</span> ulaşım
            </p>
          </div>

          {/* Custom note */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Kendi kombinasyonunu oluşturmak için{" "}
            <a href="#hesapla" className="text-purple-600 hover:text-purple-700 transition-colors underline underline-offset-2">
              aşağıdaki hesaplayıcıyı
            </a>{" "}
            kullan.
          </p>
        </div>
      </section>

      {/* ══ § 2.5  ÖZELLİK VİTRİNİ ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            label="Öne Çıkan Özellikler"
            title="Misafirlerinizle anı biriktirin"
            sub="QR kodu masaya koyun; misafirler fotoğraf, dilekçe ve sesli mesaj bıraksın. Siz hepsini tek PDF'e derleyin."
          />

          {/* Anı Kitabı ana kart */}
          <div className="rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden mb-4 group hover:border-purple-100 hover:shadow-sm transition-all">
            <div className="grid sm:grid-cols-5 gap-0">
              <div className="sm:col-span-3 p-7 sm:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 rounded-full px-3 py-1 mb-4 self-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-purple-600">Yeni Özellik</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Anı Kitabı PDF</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-sm">
                  Onaylı fotoğraf, yazılı anı ve sesli mesajları tek bir premium PDF'e derliyoruz. Ömür boyu saklayabileceğiniz dijital bir hatıra kitabı.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["📸 Fotoğraflar", "💌 Yazılı anılar", "🎙 Sesli mesajlar"].map(t => (
                    <span key={t} className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 relative flex items-center justify-center min-h-44 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #db2777 100%)" }}>
                {/* Decorative dots */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="relative text-center text-white p-8">
                  <div className="text-5xl mb-3">📖</div>
                  <p className="text-sm font-bold">Tek tıkla indir</p>
                  <p className="text-xs mt-1 opacity-60">Etkinlik sonrası hazır</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 küçük özellik kartı */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: "📸",
                title: "Fotoğraf Albümü",
                desc: "Misafirler etkinlik fotoğraflarını yükler. Moderasyon sonrası davetiye sayfasında herkese açılır.",
                renk: "purple",
              },
              {
                icon: "💌",
                title: "Anı Defteri",
                desc: "Yazılı dilekler ve anılar bırakılabilir. Onayladığınız içerikler davetiyede görünür.",
                renk: "pink",
              },
              {
                icon: "🎙",
                title: "Sesli Anı",
                desc: "Misafirler ses kaydıyla tebrik mesajı bırakır. Anı Kitabı PDF'inde listelenir.",
                renk: "violet",
              },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-sm hover:border-purple-100 transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-1.5">{f.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* QR akışı notu */}
          <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50/50 px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-base shrink-0">📲</div>
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">Masa QR Kodu:</span>{" "}
              Yönetim panelinden QR kodu indirip masalara koyun. Misafirler telefon kameralarıyla okutunca anı paneli otomatik açılır.
            </p>
          </div>
        </div>
      </section>

      {/* ══ § 3  PRICE CALCULATOR ══ */}
      <section id="hesapla" className="relative px-4 sm:px-6 py-10 sm:py-14 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            label="Etkileşimli Hesaplama"
            title="Kendi fiyatını hesapla"
            sub="İstediğin özellikleri aç, toplam tutar anında güncellenir."
          />
          <FiyatHesaplama
            baslaHref={baslaHref}
            baslaMetni={seciliSablon ? `${seciliSablon.isim} ile Devam Et` : "Davetiye Oluştur"}
            luksSablonSecili={luksSablonSecili}
          />
        </div>
      </section>

      {/* ══ § 4  HOW IT WORKS ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8" />
          <SectionHead label="Nasıl çalışır?" title="4 adımda hazır" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {NASIL_CALISIR.map((adim, idx) => (
              <div key={adim.n} className="relative group">
                {idx < NASIL_CALISIR.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-full w-4 h-px bg-linear-to-r from-purple-300/50 to-transparent z-10" />
                )}
                <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 h-full hover:shadow-sm hover:border-purple-100 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-xs font-black text-purple-700 shrink-0">
                      {adim.n}
                    </span>
                    <span className="text-lg">{adim.icon}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1.5">{adim.baslik}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{adim.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 5  TRUST ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 overflow-hidden bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            label="Ödeme Güvenliği"
            title="Güvenli, şeffaf, sürprizsiz"
            sub="Kart bilgileriniz bizde saklanmaz. iyzico altyapısıyla işlenir."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GUVEN_BADGELERI.map(badge => (
              <div key={badge.baslik} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-purple-100 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{badge.baslik}</p>
                  <p className="text-xs text-gray-500">{badge.aciklama}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Kalite Checklist */}
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-emerald-700/70 mb-4">Her Davetiyeyle Birlikte Geliyor</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "📱", text: "Mobil uyumlu" },
                { icon: "💬", text: "WhatsApp paylaşım hazır" },
                { icon: "📲", text: "QR kod hazır" },
                { icon: "✅", text: "RSVP paneli hazır" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ § 6  FAQ ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8" />
          <SectionHead label="Sık Sorulan Sorular" title="Aklında soru var mı?" />
          <div className="space-y-2">
            {SORU_CEVAP.map((item, idx) => (
              <details key={idx} className="group rounded-xl sm:rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">{item.soru}</span>
                  <span className="shrink-0 w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-transform duration-200 group-open:rotate-45 text-base leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4">
                  <div className="h-px bg-gray-100 mb-3" />
                  <p className="text-sm text-gray-500 leading-relaxed">{item.cevap}</p>
                </div>
              </details>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6">
            Başka sorun mu var?{" "}
            <a href="mailto:destek@bekleriz.com" className="text-purple-600 hover:text-purple-700 transition-colors">
              destek@bekleriz.com
            </a>
          </p>
        </div>
      </section>

      {/* ══ § 7  CTA ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 overflow-hidden bg-white border-t border-gray-100">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-purple-50 blur-[120px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-sm p-7 sm:p-10 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Davetiyeni bugün oluştur</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              34+ şablon, dakikalar içinde hazır. Bir kez öde — aylık ücret yok, ömür boyu linkin senindir.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={baslaHref}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-7 py-3.5 rounded-2xl text-sm font-bold hover:bg-purple-700 hover:-translate-y-0.5 transition-all shadow-sm shadow-purple-200"
              >
                {seciliSablon ? `${seciliSablon.isim} ile Devam Et →` : "Şablonlara Göz At →"}
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 text-gray-600 px-7 py-3.5 rounded-2xl text-sm font-semibold hover:bg-gray-100 hover:text-gray-800 transition-all"
              >
                Dashboard&apos;a Dön
              </Link>
            </div>
            <div className="mt-6 flex justify-center gap-5 flex-wrap">
              {["🔒 SSL", "✅ iyzico", "💳 3D Secure", "🚫 Abonelik Yok"].map(b => (
                <span key={b} className="text-xs text-gray-400">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

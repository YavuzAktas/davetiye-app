import Link from "next/link";
import { DAVETIYE_FIYAT_KALEMLERI, tutarMetni } from "@/lib/davetiye-fiyatlandirma";
import FiyatHesaplama from "@/components/FiyatHesaplama";

const ORNEKLER = [
  {
    icon: "✉️",
    ad: "Sade Davetiye",
    aciklama: "Temel dijital davetiye, RSVP formu ve paylaşım linki",
    kalemler: [DAVETIYE_FIYAT_KALEMLERI.temel],
    popüler: false,
    renk: "#7C3AED",
  },
  {
    icon: "✨",
    ad: "Müzikli Lüks Davetiye",
    aciklama: "Premium şablon tasarımı ve arka plan müziği",
    kalemler: [
      DAVETIYE_FIYAT_KALEMLERI.temel,
      DAVETIYE_FIYAT_KALEMLERI.luksSablon,
      DAVETIYE_FIYAT_KALEMLERI.muzik,
    ],
    popüler: true,
    renk: "#9333EA",
  },
  {
    icon: "💒",
    ad: "Tam Özellikli Düğün",
    aciklama: "Albüm, sesli anı, canlı fotoğraf duvarı ve oturma planı",
    kalemler: [
      DAVETIYE_FIYAT_KALEMLERI.temel,
      DAVETIYE_FIYAT_KALEMLERI.album,
      DAVETIYE_FIYAT_KALEMLERI.sesliAni,
      DAVETIYE_FIYAT_KALEMLERI.canliDuvar,
      DAVETIYE_FIYAT_KALEMLERI.oturmaPlan,
    ],
    popüler: false,
    renk: "#DB2777",
  },
] as const;

const KALEM_IKONU: Record<string, string> = {
  "temel-davetiye": "✉️",
  "luks-sablon": "✨",
  "muzik": "🎵",
  "album-ani": "📸",
  "sesli-ani": "🎙️",
  "canli-duvar": "🖼️",
  "oturma-plani": "🪑",
};

const NASIL_CALISIR = [
  { n: "1", baslik: "Şablonu seç", aciklama: "30'dan fazla hazır şablon arasından beğendiğini seç.", icon: "🎨" },
  { n: "2", baslik: "Özellikleri ekle", aciklama: "Müzik, albüm, sesli anı gibi istediklerin ekle.", icon: "⚙️" },
  { n: "3", baslik: "Tutarı canlı gör", aciklama: "Her seçimde toplam tutar anında güncellenir.", icon: "💰" },
  { n: "4", baslik: "Öde, yayına al", aciklama: "Ödeme sonrası davetiye anında aktif ve paylaşıma hazır.", icon: "🚀" },
];

const GUVEN_BADGELERI = [
  { icon: "🔒", baslik: "SSL Şifreli", aciklama: "Tüm veriler şifreli iletilir" },
  { icon: "✅", baslik: "iyzico Altyapısı", aciklama: "Türkiye'nin güvenilir ödeme sistemi" },
  { icon: "🚫", baslik: "Abonelik Yok", aciklama: "Otomatik yenileme ya da aylık ücret yok" },
  { icon: "🎯", baslik: "Tek Seferlik", aciklama: "Sadece o davetiye için, sadece o an" },
  { icon: "💳", baslik: "3D Secure", aciklama: "Kart bilgilerin bizde saklanmaz" },
  { icon: "📄", baslik: "Fatura", aciklama: "Talep üzerine 2 iş günü içinde" },
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
    cevap: "Evet. Bireysel veya kurumsal fatura için destek@bekleriz.com adresine yazmanız yeterli; en geç 2 iş günü içinde iletilir.",
  },
  {
    soru: "Ödeme sonrasında özellik ekleyebilir miyim?",
    cevap: "Şu an için hayır. Özellikler davetiye oluşturulurken seçilir ve ödeme tamamlandıktan sonra değiştirilemez.",
  },
];

function toplam(kalemler: readonly { tutar: number }[]) {
  return kalemler.reduce((a, k) => a + k.tutar, 0);
}

export default function FiyatlarSayfasi() {
  return (
    <div className="min-h-screen bg-[#05000d]">

      {/* ══════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6">
        {/* Blobs */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-purple-700/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-32 right-0 w-80 h-80 rounded-full bg-pink-700/15 blur-[90px] pointer-events-none" />
        <div className="absolute top-48 left-0 w-64 h-64 rounded-full bg-indigo-700/12 blur-[80px] pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/25 rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-purple-300">
              Davetiye Bazlı Fiyatlandırma
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Seçtiğin kadar,{" "}
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                o kadar öde
              </span>
              {/* Underline glow */}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-linear-to-r from-purple-500/0 via-purple-500/60 to-purple-500/0" />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed mb-10">
            Plan, abonelik veya otomatik yenileme yok. Davetiyeni oluştururken
            toplam tutarı canlı görürsün, ödeme sonrası yalnızca seçtiğin özellikler aktif olur.
          </p>

          {/* Value prop pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {[
              { icon: "🚫", text: "Abonelik yok" },
              { icon: "🔄", text: "Otomatik yenileme yok" },
              { icon: "🎯", text: "Tek seferlik ödeme" },
              { icon: "💳", text: "iyzico güvencesi" },
            ].map(pill => (
              <span key={pill.text} className="flex items-center gap-1.5 bg-white/6 border border-white/10 rounded-full px-4 py-2 text-xs font-medium text-white/55">
                <span>{pill.icon}</span>
                {pill.text}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sablonlar"
              className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: "0 12px 36px rgba(124,58,237,0.45)" }}
            >
              Şablon Seç ve Başla
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#hesapla"
              className="flex items-center gap-2 border border-white/15 text-white/70 px-8 py-4 rounded-2xl text-sm font-semibold hover:bg-white/8 hover:text-white transition-all"
            >
              Fiyat Hesapla
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Floating base price card */}
        <div className="relative max-w-sm mx-auto mt-20">
          <div className="rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-purple-400/70 mb-1">Başlangıç fiyatı</p>
                <p className="text-4xl font-black text-white">{tutarMetni(DAVETIYE_FIYAT_KALEMLERI.temel.tutar)}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500/25 to-pink-500/15 border border-white/10 flex items-center justify-center text-2xl">
                ✉️
              </div>
            </div>
            <p className="text-sm text-white/45 mb-4">
              Her davetiyeye dahil: mobil uyumlu şablon, RSVP formu, paylaşım linki, QR kod ve yönetim paneli.
            </p>
            <div className="h-px bg-white/8 mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {["Mobil uyumlu", "RSVP formu", "Paylaşım linki", "QR kod"].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-white/40">
                  <span className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-[9px] text-purple-300">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-purple-600/10 to-pink-600/5 blur-xl -z-10 scale-105" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 2  PRICE CALCULATOR
      ══════════════════════════════════════════ */}
      <section id="hesapla" className="relative px-4 sm:px-6 pb-28">
        {/* Subtle section separator */}
        <div className="max-w-5xl mx-auto mb-16 pt-8">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/70 mb-3">Etkileşimli Hesaplama</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Kendi fiyatını hesapla</h2>
            <p className="text-white/40 text-sm max-w-xl">
              İstediğin özellikleri aç, toplam tutar anında güncellenir. Abonelik yok, sürpriz fiyat yok.
            </p>
          </div>

          <FiyatHesaplama />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 3  HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto mb-16 text-center">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-16" />
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/70 mb-3">Nasıl çalışır?</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">4 adımda hazır</h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {NASIL_CALISIR.map((adim, idx) => (
            <div key={adim.n} className="relative group">
              {/* Connector line */}
              {idx < NASIL_CALISIR.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-5 h-px bg-linear-to-r from-purple-500/30 to-transparent z-10" />
              )}
              <div className="rounded-3xl border border-white/8 bg-white/3 p-6 h-full hover:bg-white/6 hover:border-white/15 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-600/40 to-pink-600/20 border border-white/10 flex items-center justify-center text-xs font-black text-purple-300">
                    {adim.n}
                  </span>
                  <span className="text-xl">{adim.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{adim.baslik}</h3>
                <p className="text-xs text-white/38 leading-relaxed">{adim.aciklama}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 4  EXAMPLE COMBINATIONS
      ══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-16" />

          <div className="mb-12">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/70 mb-3">Örnek Kombinasyonlar</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Gerçek kullanım örnekleri</h2>
            <p className="text-white/40 text-sm">Hangi davetiye sana uygun? Aşağıdan fikir al.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ORNEKLER.map(ornek => (
              <div key={ornek.ad} className={`relative rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                ornek.popüler
                  ? "border-purple-500/40 bg-linear-to-br from-purple-500/12 to-pink-500/8"
                  : "border-white/8 bg-white/3 hover:border-white/15"
              }`}
              style={ornek.popüler ? { boxShadow: "0 24px 60px rgba(124,58,237,0.2)" } : {}}>
                {/* Popular badge */}
                {ornek.popüler && (
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase bg-linear-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
                      Popüler
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                      style={{ background: `${ornek.renk}20`, border: `1px solid ${ornek.renk}30` }}>
                      {ornek.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{ornek.ad}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-white/38 leading-relaxed mb-5">{ornek.aciklama}</p>

                  {/* Line items */}
                  <div className="space-y-2.5 mb-5">
                    {ornek.kalemler.map(kalem => (
                      <div key={kalem.kod} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-white/50">
                          <span>{KALEM_IKONU[kalem.kod] ?? "✦"}</span>
                          {kalem.ad}
                        </span>
                        <span className="text-xs font-semibold text-white/65">
                          {tutarMetni(kalem.tutar)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/40">Toplam</span>
                    <span className="text-2xl font-black text-white">{tutarMetni(toplam(ornek.kalemler))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-white/25 mt-6">
            Bunlar yalnızca örnek kombinasyonlar. Yukarıdaki hesaplayıcıyla kendi fiyatını oluştur.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 5  TRUST & SECURITY
      ══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 py-24 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-purple-700/8 blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-16" />

          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/70 mb-3">Ödeme Güvenliği</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Güvenli, şeffaf, sürprizsiz</h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">
              Ödeme altyapımız iyzico tarafından işlenir. Kart bilgileriniz tarafımızca saklanmaz.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {GUVEN_BADGELERI.map(badge => (
              <div key={badge.baslik} className="flex items-start gap-4 p-5 rounded-2xl border border-white/7 bg-white/2.5 hover:bg-white/5 hover:border-white/12 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600/20 to-pink-600/10 border border-white/10 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">{badge.baslik}</p>
                  <p className="text-xs text-white/35 leading-relaxed">{badge.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 6  FAQ
      ══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-16" />

          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/70 mb-3">Sık Sorulan Sorular</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Aklında soru var mı?</h2>
          </div>

          <div className="space-y-3">
            {SORU_CEVAP.map((item, idx) => (
              <details key={idx} className="group rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-white/4 transition-colors">
                  <span className="text-sm font-semibold text-white/85">{item.soru}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-white/40 transition-transform duration-200 group-open:rotate-45 text-lg leading-none">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5">
                  <div className="h-px bg-white/8 mb-4" />
                  <p className="text-sm text-white/45 leading-relaxed">{item.cevap}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/30">
              Başka sorun mu var?{" "}
              <a href="mailto:destek@bekleriz.com" className="text-purple-400 hover:text-purple-300 transition-colors">
                destek@bekleriz.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 7  FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 pb-28 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-linear-to-br from-purple-700/15 to-pink-700/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-16" />

          <div className="rounded-3xl border border-white/10 bg-white/3 backdrop-blur-sm p-10 sm:p-14 text-center"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <div className="text-5xl mb-6">🎉</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              Davetiyeni bugün oluştur
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              30'dan fazla şablon arasından seçin, özelliklerini ekle, dakikalar içinde paylaşmaya hazır.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sablonlar"
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: "0 12px 36px rgba(124,58,237,0.45)" }}
              >
                Şablonlara Göz At →
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 border border-white/15 text-white/60 px-8 py-4 rounded-2xl text-sm font-semibold hover:bg-white/8 hover:text-white transition-all"
              >
                Dashboard'a Dön
              </Link>
            </div>
            <div className="mt-8 flex justify-center gap-6 flex-wrap">
              {["🔒 SSL Şifreli", "✅ iyzico", "💳 3D Secure", "🚫 Abonelik Yok"].map(b => (
                <span key={b} className="text-xs text-white/20">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

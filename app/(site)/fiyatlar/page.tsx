import Link from "next/link";
import { DAVETIYE_FIYAT_KALEMLERI, tutarMetni } from "@/lib/davetiye-fiyatlandirma";
import FiyatHesaplama from "@/components/FiyatHesaplama";

const ORNEKLER = [
  {
    icon: "✉️",
    ad: "Sade Davetiye",
    aciklama: "Temel dijital davetiye, RSVP formu ve paylaşım linki",
    kalemler: [DAVETIYE_FIYAT_KALEMLERI.temel],
    populer: false,
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
    populer: true,
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
    populer: false,
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
  { n: "1", baslik: "Şablonu seç", aciklama: "30+ şablon arasından beğendiğini seç.", icon: "🎨" },
  { n: "2", baslik: "Özellikleri ekle", aciklama: "Müzik, albüm, sesli anı gibi istediklerin ekle.", icon: "⚙️" },
  { n: "3", baslik: "Tutarı canlı gör", aciklama: "Her seçimde toplam tutar anında güncellenir.", icon: "💰" },
  { n: "4", baslik: "Öde, yayına al", aciklama: "Ödeme sonrası davetiye anında aktif ve hazır.", icon: "🚀" },
];

const GUVEN_BADGELERI = [
  { icon: "🔒", baslik: "SSL Şifreli", aciklama: "Tüm veriler şifreli iletilir" },
  { icon: "✅", baslik: "iyzico Altyapısı", aciklama: "Güvenilir ödeme sistemi" },
  { icon: "🚫", baslik: "Abonelik Yok", aciklama: "Otomatik yenileme yok" },
  { icon: "🎯", baslik: "Tek Seferlik", aciklama: "Sadece o davetiye için" },
  { icon: "💳", baslik: "3D Secure", aciklama: "Kart bilgin bizde saklanmaz" },
  { icon: "📄", baslik: "Fatura", aciklama: "2 iş günü içinde" },
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

/* ── Bölüm başlığı ── */
function SectionHead({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/70 mb-2">{label}</p>
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{title}</h2>
      {sub && <p className="text-white/40 text-sm max-w-xl">{sub}</p>}
    </div>
  );
}

export default function FiyatlarSayfasi() {
  return (
    <div className="min-h-screen bg-[#05000d]">

      {/* ══ § 1  HERO ══ */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 sm:w-175 h-96 sm:h-175 rounded-full bg-purple-700/20 blur-[100px] pointer-events-none" />
        <div className="absolute top-32 right-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-pink-700/15 blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/25 rounded-full px-3.5 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-purple-300">
              Davetiye Bazlı Fiyatlandırma
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-5">
            Seçtiğin kadar,{" "}
            <br className="sm:hidden" />
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                o kadar öde
              </span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-linear-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/45 max-w-xl mx-auto leading-relaxed mb-8">
            Plan, abonelik veya otomatik yenileme yok. Toplam tutarı canlı görürsün,
            ödeme sonrası yalnızca seçtiğin özellikler aktif olur.
          </p>

          {/* Value prop pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { icon: "🚫", text: "Abonelik yok" },
              { icon: "🔄", text: "Yenileme yok" },
              { icon: "🎯", text: "Tek seferlik" },
              { icon: "💳", text: "iyzico güvencesi" },
            ].map(pill => (
              <span key={pill.text} className="flex items-center gap-1.5 bg-white/6 border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/55">
                <span>{pill.icon}</span>
                {pill.text}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sablonlar"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-7 py-3.5 rounded-2xl text-sm font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: "0 10px 30px rgba(124,58,237,0.45)" }}
            >
              Şablon Seç ve Başla
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#hesapla"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/15 text-white/65 px-7 py-3.5 rounded-2xl text-sm font-semibold hover:bg-white/8 hover:text-white transition-all"
            >
              Fiyat Hesapla
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Base price card — compact on mobile */}
        <div className="relative max-w-sm mx-auto mt-10 sm:mt-14">
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl p-5 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-purple-400/70 mb-1">Başlangıç fiyatı</p>
                <p className="text-3xl sm:text-4xl font-black text-white">{tutarMetni(DAVETIYE_FIYAT_KALEMLERI.temel.tutar)}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500/25 to-pink-500/15 border border-white/10 flex items-center justify-center text-2xl">
                ✉️
              </div>
            </div>
            <p className="text-xs text-white/40 mb-3 leading-relaxed">
              Mobil uyumlu şablon, RSVP formu, paylaşım linki, QR kod ve yönetim paneli dahil.
            </p>
            <div className="h-px bg-white/8 mb-3" />
            <div className="grid grid-cols-2 gap-1.5">
              {["Mobil uyumlu", "RSVP formu", "Paylaşım linki", "QR kod"].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-white/40">
                  <span className="w-3.5 h-3.5 rounded-full bg-purple-500/20 flex items-center justify-center text-[8px] text-purple-300 shrink-0">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-linear-to-br from-purple-600/10 to-pink-600/5 blur-xl -z-10 scale-105" />
        </div>
      </section>

      {/* ══ § 2  PRICE CALCULATOR ══ */}
      <section id="hesapla" className="relative px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
          <SectionHead
            label="Etkileşimli Hesaplama"
            title="Kendi fiyatını hesapla"
            sub="İstediğin özellikleri aç, toplam tutar anında güncellenir."
          />
          <FiyatHesaplama />
        </div>
      </section>

      {/* ══ § 3  HOW IT WORKS ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
          <SectionHead label="Nasıl çalışır?" title="4 adımda hazır" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {NASIL_CALISIR.map((adim, idx) => (
              <div key={adim.n} className="relative group">
                {idx < NASIL_CALISIR.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-full w-4 h-px bg-linear-to-r from-purple-500/30 to-transparent z-10" />
                )}
                <div className="rounded-2xl border border-white/8 bg-white/3 p-4 sm:p-5 h-full hover:bg-white/6 hover:border-white/15 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-xl bg-linear-to-br from-purple-600/40 to-pink-600/20 border border-white/10 flex items-center justify-center text-xs font-black text-purple-300 shrink-0">
                      {adim.n}
                    </span>
                    <span className="text-lg">{adim.icon}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1.5">{adim.baslik}</h3>
                  <p className="text-xs text-white/38 leading-relaxed">{adim.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 4  EXAMPLE COMBINATIONS ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
          <SectionHead
            label="Örnek Kombinasyonlar"
            title="Gerçek kullanım örnekleri"
            sub="Hangi davetiye sana uygun? Aşağıdan fikir al."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ORNEKLER.map(ornek => (
              <div key={ornek.ad} className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-0.5 ${
                ornek.populer
                  ? "border-purple-500/40 bg-linear-to-br from-purple-500/12 to-pink-500/8"
                  : "border-white/8 bg-white/3 hover:border-white/15"
              }`}
              style={ornek.populer ? { boxShadow: "0 20px 50px rgba(124,58,237,0.2)" } : {}}>
                {ornek.populer && (
                  <div className="absolute top-3.5 right-3.5">
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase bg-linear-to-r from-purple-500 to-pink-500 text-white px-2.5 py-1 rounded-full">
                      Popüler
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: `${ornek.renk}20`, border: `1px solid ${ornek.renk}30` }}>
                      {ornek.icon}
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{ornek.ad}</h3>
                  </div>
                  <p className="text-xs text-white/38 leading-relaxed mb-4">{ornek.aciklama}</p>
                  <div className="space-y-2 mb-4">
                    {ornek.kalemler.map(kalem => (
                      <div key={kalem.kod} className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="w-4 text-center">{KALEM_IKONU[kalem.kod] ?? "✦"}</span>
                          {kalem.ad}
                        </span>
                        <span className="text-xs font-semibold text-white/60">{tutarMetni(kalem.tutar)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                    <span className="text-xs text-white/40">Toplam</span>
                    <span className="text-xl font-black text-white">{tutarMetni(toplam(ornek.kalemler))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/25 mt-4">
            Yukarıdaki hesaplayıcıyla kendi kombinasyonunu oluştur.
          </p>
        </div>
      </section>

      {/* ══ § 5  TRUST ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
          <SectionHead
            label="Ödeme Güvenliği"
            title="Güvenli, şeffaf, sürprizsiz"
            sub="Kart bilgileriniz bizde saklanmaz. iyzico altyapısıyla işlenir."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GUVEN_BADGELERI.map(badge => (
              <div key={badge.baslik} className="flex items-center gap-3 p-4 rounded-2xl border border-white/7 bg-white/2.5 hover:bg-white/5 hover:border-white/12 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-600/20 to-pink-600/10 border border-white/10 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{badge.baslik}</p>
                  <p className="text-xs text-white/35">{badge.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ § 6  FAQ ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
          <SectionHead label="Sık Sorulan Sorular" title="Aklında soru var mı?" />
          <div className="space-y-2">
            {SORU_CEVAP.map((item, idx) => (
              <details key={idx} className="group rounded-xl sm:rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none hover:bg-white/4 transition-colors">
                  <span className="text-sm font-semibold text-white/85">{item.soru}</span>
                  <span className="shrink-0 w-5 h-5 rounded-full border border-white/15 flex items-center justify-center text-white/40 transition-transform duration-200 group-open:rotate-45 text-base leading-none">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4">
                  <div className="h-px bg-white/8 mb-3" />
                  <p className="text-sm text-white/45 leading-relaxed">{item.cevap}</p>
                </div>
              </details>
            ))}
          </div>
          <p className="text-center text-sm text-white/30 mt-6">
            Başka sorun mu var?{" "}
            <a href="mailto:destek@bekleriz.com" className="text-purple-400 hover:text-purple-300 transition-colors">
              destek@bekleriz.com
            </a>
          </p>
        </div>
      </section>

      {/* ══ § 7  CTA ══ */}
      <section className="relative px-4 sm:px-6 py-10 sm:py-14 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-linear-to-br from-purple-700/15 to-pink-700/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/3 backdrop-blur-sm p-7 sm:p-10 text-center"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Davetiyeni bugün oluştur</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              30+ şablon, dakikalar içinde hazır, anında paylaşılabilir.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sablonlar"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-7 py-3.5 rounded-2xl text-sm font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: "0 10px 30px rgba(124,58,237,0.45)" }}
              >
                Şablonlara Göz At →
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/15 text-white/60 px-7 py-3.5 rounded-2xl text-sm font-semibold hover:bg-white/8 hover:text-white transition-all"
              >
                Dashboard'a Dön
              </Link>
            </div>
            <div className="mt-6 flex justify-center gap-5 flex-wrap">
              {["🔒 SSL", "✅ iyzico", "💳 3D Secure", "🚫 Abonelik Yok"].map(b => (
                <span key={b} className="text-xs text-white/20">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { DAVETIYE_FIYAT_KALEMLERI, tutarMetni } from "@/lib/davetiye-fiyatlandirma";

export const metadata: Metadata = {
  title: "Organizasyoncular İçin Dijital Davetiye Partner Programı | Bekleriz",
  description:
    "Düğün organizasyonu, etkinlik planlama, fotoğrafçılık ve mekan işletmeleri için aylık dijital davetiye aktivasyon hakkı. Müşterilerinize profesyonel davetiye sunun.",
  alternates: { canonical: "/partner" },
};

const PAKETLER = [
  {
    id: "baslangic",
    ad: "Başlangıç",
    fiyat: "₺599",
    periyot: "/ay",
    renk: "#6366f1",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    btnClass: "bg-indigo-600 hover:bg-indigo-700",
    hakSayisi: 10,
    populer: false,
    aciklama: "Sektöre yeni giren küçük işletmeler için",
    dahilOzellikler: [
      `Dijital davetiye (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.temel.tutar)} değer)`,
      `Arka plan müziği (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.muzik.tutar)} değer)`,
      `Anı defteri (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.aniDefteri.tutar)} değer)`,
    ],
    ozellikler: [
      "Ayda 10 davetiye aktivasyon hakkı",
      "Kişisel aktivasyon linki oluşturma",
      "Partner paneli & durum takibi",
      "WhatsApp ile tek tıkla ilet",
    ],
    dahilDegil: ["Partner logo/marka ibaresi", "Lüks şablon dahil", "Fotoğraf albümü dahil"],
  },
  {
    id: "profesyonel",
    ad: "Profesyonel",
    fiyat: "₺1.499",
    periyot: "/ay",
    renk: "#9333ea",
    bg: "bg-purple-50",
    border: "border-purple-200",
    btnClass: "bg-purple-600 hover:bg-purple-700",
    hakSayisi: 30,
    populer: true,
    aciklama: "Aktif düğün & etkinlik organizatörleri için",
    dahilOzellikler: [
      `Dijital davetiye (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.temel.tutar)} değer)`,
      `Lüks şablon (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.luksSablon.tutar)} değer)`,
      `Arka plan müziği (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.muzik.tutar)} değer)`,
      `Fotoğraf albümü (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.album.tutar)} değer)`,
      `Anı defteri (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.aniDefteri.tutar)} değer)`,
      `Canlı fotoğraf duvarı (${tutarMetni(DAVETIYE_FIYAT_KALEMLERI.canliDuvar.tutar)} değer)`,
    ],
    ozellikler: [
      "Ayda 30 davetiye aktivasyon hakkı",
      "Kişisel aktivasyon linki oluşturma",
      "Partner logo / marka ibaresi",
      "Detaylı kullanım raporu",
      "WhatsApp ile tek tıkla ilet",
      "Öncelikli destek",
    ],
    dahilDegil: ["Sesli anı dahil", "Oturma planı dahil", "QR check-in dahil"],
  },
  {
    id: "kurumsal",
    ad: "Kurumsal",
    fiyat: "₺3.499",
    periyot: "/ay",
    renk: "#dc2626",
    bg: "bg-red-50",
    border: "border-red-100",
    btnClass: "bg-red-600 hover:bg-red-700",
    hakSayisi: 75,
    populer: false,
    aciklama: "Büyük ajanslar ve yüksek hacimli organizatörler için",
    dahilOzellikler: [
      "Tüm özellikler dahil (1.700₺ değer/davetiye)",
      "Sesli anı, Oturma planı",
      "QR check-in, Anı kitabı PDF",
    ],
    ozellikler: [
      "Ayda 75 davetiye aktivasyon hakkı",
      "Kişisel aktivasyon linki oluşturma",
      "Partner logo / marka ibaresi",
      "Öncelikli destek hattı",
      "Özel onboarding süreci",
      "Detaylı kullanım raporu",
    ],
    dahilDegil: [],
  },
] as const;

const NASIL_CALISIR = [
  {
    n: "1",
    baslik: "Partner paketi satın al",
    aciklama: "İhtiyacına uygun paketi seç. Aktivasyon hakları anında hesabına yüklenir.",
    icon: "📦",
  },
  {
    n: "2",
    baslik: "Müşteriye aktivasyon linki gönder",
    aciklama: "Partner panelinden tek tıkla link oluştur, WhatsApp ile ilet.",
    icon: "🔗",
  },
  {
    n: "3",
    baslik: "Müşteri kendi hesabını açar",
    aciklama: "Müşteri linkle gelir, kaydolur, KVKK'yı kabul eder ve davetiyesini oluşturur.",
    icon: "🎨",
  },
  {
    n: "4",
    baslik: "Sen sadece durumu takip edersin",
    aciklama: "Partner panelinde davetiye durumunu görürsün. Davetli verileri sende değil, müşteride.",
    icon: "📊",
  },
];

const PARTNER_GURUPLARI = [
  { emoji: "💒", label: "Düğün organizasyon firmaları" },
  { emoji: "📸", label: "Düğün fotoğrafçıları" },
  { emoji: "🎪", label: "Etkinlik organizatörleri" },
  { emoji: "🌺", label: "Çiçekçi & dekorasyon firmaları" },
  { emoji: "🍽️", label: "Catering ve mekan işletmeleri" },
  { emoji: "🎵", label: "Müzik grupları & DJ'ler" },
];

const SEKTOR_COZUMLERI = [
  {
    href: "/dugun-salonlari-icin-dijital-davetiye",
    baslik: "Düğün salonları için çözüm",
    aciklama: "LCV takip, QR check-in, canlı fotoğraf duvarı ve müşteri aktivasyon akışı.",
  },
];

const GUVEN_NOKTALAR = [
  {
    icon: "🔒",
    baslik: "Davetli verisi sende değil",
    aciklama:
      "Müşterinin davetli isimleri, telefonları ve RSVP cevapları sana gösterilmez. Tamamen müşteriye aittir.",
  },
  {
    icon: "⚖️",
    baslik: "KVKK müşteri kabul eder",
    aciklama:
      "Yasal metinleri müşteri kendi hesabıyla kabul eder. Sen sadece aktivasyon hakkı sağlarsın.",
  },
  {
    icon: "💳",
    baslik: "Ödeme sürpriz yok",
    aciklama:
      "Müşteri ayrıca ödeme yapmaz. Paketinde kalan hak kadar davetiye aktivasyonu ücretsizdir.",
  },
];

export default function PartnerPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0c0118] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #7c3aed 0%, transparent 60%), radial-gradient(circle at 75% 70%, #db2777 0%, transparent 55%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold text-white/70 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            Organizasyoncular İçin · B2B Program
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            Müşterilerinize<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
              dijital davetiye
            </span>{" "}
            sunun
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Organizasyon firmanız için toplu davetiye aktivasyon hakkı satın alın.
            Müşterileriniz davetiyelerini kendi hesaplarında oluşturup yönetsin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/partner/basvuru"
              className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity text-sm"
            >
              Partner Başvurusu Yap
              <span>→</span>
            </Link>
            <Link
              href="/partner/sozlesme"
              className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/12 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/12 transition-all text-sm"
            >
              Partner Sözleşmesi
            </Link>
          </div>
        </div>
      </section>

      {/* ── Kimler için ── */}
      <section className="border-b border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold text-gray-400 tracking-widest uppercase mb-8">
            Kimler için?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PARTNER_GURUPLARI.map(g => (
              <div key={g.label} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3.5">
                <span className="text-xl shrink-0">{g.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{g.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3">
            {SEKTOR_COZUMLERI.map(cozum => (
              <Link
                key={cozum.href}
                href={cozum.href}
                className="group rounded-3xl border border-purple-100 bg-purple-50 px-5 py-4 transition hover:border-purple-200 hover:bg-purple-100/70"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black text-purple-800">{cozum.baslik}</p>
                    <p className="mt-1 text-xs leading-5 text-purple-700/70">{cozum.aciklama}</p>
                  </div>
                  <span className="text-sm font-bold text-purple-700 transition group-hover:translate-x-1">
                    İncele →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nasıl çalışır ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-3">Süreç</p>
            <h2 className="text-3xl font-black text-gray-900">Nasıl çalışır?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NASIL_CALISIR.map(adim => (
              <div key={adim.n} className="relative">
                <div className="bg-gray-50 rounded-3xl p-6 h-full">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm mb-4">
                    {adim.icon}
                  </div>
                  <p className="text-[10px] font-bold text-gray-300 tracking-widest uppercase mb-2">Adım {adim.n}</p>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{adim.baslik}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{adim.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Güven noktaları ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-3">Hukuki güvenlik</p>
            <h2 className="text-2xl font-black text-gray-900">
              Müşteri verisi sende değil — kasıtlı tasarladık
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GUVEN_NOKTALAR.map(g => (
              <div key={g.baslik} className="bg-white rounded-3xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">{g.icon}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{g.baslik}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{g.aciklama}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-xs text-gray-400">
            Detaylar için:{" "}
            <Link href="/partner/sozlesme" className="text-purple-600 hover:underline font-medium">
              Partner Sözleşmesi
            </Link>
          </p>
        </div>
      </section>

      {/* ── Paketler ── */}
      <section className="py-20" id="paketler">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-3">Fiyatlandırma</p>
            <h2 className="text-3xl font-black text-gray-900">Partner Paketleri</h2>
            <p className="text-sm text-gray-500 mt-3">
              Lansman fiyatlarıyla sunulur. Kullanılmayan haklar ertesi aya devretmez, her ay yenilenir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAKETLER.map(paket => (
              <div
                key={paket.id}
                className={`relative rounded-3xl border-2 p-7 flex flex-col ${paket.border} ${paket.bg} ${
                  paket.populer ? "shadow-xl scale-[1.02]" : ""
                }`}
              >
                {paket.populer && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold px-4 py-1 rounded-full"
                    style={{ backgroundColor: paket.renk }}
                  >
                    En Çok Tercih Edilen
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: paket.renk }}>
                    {paket.ad}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black text-gray-900">{paket.fiyat}</span>
                    <span className="text-sm text-gray-400 mb-1">{paket.periyot}</span>
                  </div>
                  <p className="mt-1 inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Lansman fiyatı
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ayda <strong>{paket.hakSayisi}</strong> davetiye aktivasyonu
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{paket.aciklama}</p>
                </div>

                {/* Müşteriye dahil davetiye içeriği */}
                <div className="mb-4 rounded-2xl bg-white/60 border border-white p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: paket.renk }}>
                    Müşterinizin aldığı davetiye
                  </p>
                  <ul className="space-y-1.5">
                    {paket.dahilOzellikler.map(o => (
                      <li key={o} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <span className="text-green-500 shrink-0 mt-px">✓</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Panel özellikleri */}
                <ul className="space-y-2 flex-1 mb-5">
                  {paket.ozellikler.map(o => (
                    <li key={o} className="flex items-start gap-2 text-xs text-gray-700">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: paket.renk }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {o}
                    </li>
                  ))}
                  {paket.dahilDegil.map(o => (
                    <li key={o} className="flex items-start gap-2 text-xs text-gray-300">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {o}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/partner/basvuru"
                  className={`w-full text-center text-sm font-bold text-white py-3 rounded-2xl transition-colors ${paket.btnClass}`}
                >
                  Başvur
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[#0c0118] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-3xl font-black text-white mb-4">
            Hazır mısınız?
          </p>
          <p className="text-sm text-white/40 mb-8">
            Başvurunuzu alır, 24 saat içinde iletişime geçeriz.
          </p>
          <Link
            href="/partner/basvuru"
            className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Partner Başvurusu Yap →
          </Link>
        </div>
      </section>

    </div>
  );
}

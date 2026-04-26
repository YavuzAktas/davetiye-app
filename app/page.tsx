import Link from "next/link";

export default function Anasayfa() {
  return (
    <div>

      {/* Hero Bölümü */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🎉 Türkiye&apos;nin dijital davetiye platformu
          </span>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Davetiyeni dijitale taşı,<br />
            <span className="text-purple-600">anı yaşat</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
            Düğün, nişan, doğum günü ve daha fazlası için dakikalar içinde
            özel davetiye oluştur. WhatsApp ile tek tıkla paylaş.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sablonlar"
              className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Ücretsiz Başla
            </Link>
            <Link
              href="/sablonlar"
              className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Şablonlara Bak
            </Link>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Neden Davetim?
        </h2>
        <p className="text-center text-gray-500 mb-14">
          Kağıt davetiyenin yerini alan modern çözüm
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              emoji: "⚡",
              baslik: "Dakikalar içinde hazır",
              aciklama: "Yüzlerce şablon arasından seç, metnini gir, davetiyeni oluştur. Tasarım bilgisi gerekmez.",
            },
            {
              emoji: "📱",
              baslik: "WhatsApp ile paylaş",
              aciklama: "Tek tıkla WhatsApp'ta paylaş. Misafirlerin linke tıklayarak açsın, uygulama indirmelerine gerek yok.",
            },
            {
              emoji: "✅",
              baslik: "RSVP takibi",
              aciklama: "Kim geliyor, kim gelemiyor? Katılım sayısını anlık takip et, tablonuzu kolayca planlayın.",
            },
            {
              emoji: "🗺️",
              baslik: "Konum entegrasyonu",
              aciklama: "Mekanın Google Maps'te otomatik gösterilir. Misafirler tek tıkla yol tarifi alır.",
            },
            {
              emoji: "🎵",
              baslik: "Müzik ekle",
              aciklama: "Davetiyene özel bir şarkı ekle. Misafirlerin davetiyeyi açınca müzik çalsın.",
            },
            {
              emoji: "📊",
              baslik: "Detaylı istatistik",
              aciklama: "Kaç kişi açtı, ne zaman baktı, hangi şehirden erişti. Her şeyi takip et.",
            },
          ].map((ozellik) => (
            <div
              key={ozellik.baslik}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{ozellik.emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{ozellik.baslik}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{ozellik.aciklama}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-600 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            İlk davetiyeni ücretsiz oluştur
          </h2>
          <p className="text-purple-200 mb-8">
            Kredi kartı gerekmez. 2 dakikada başla.
          </p>
          <Link
            href="/sablonlar"
            className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-colors inline-block"
          >
            Hemen Dene
          </Link>
        </div>
      </section>

    </div>
  );
}
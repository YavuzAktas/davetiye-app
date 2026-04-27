import Link from "next/link";

export default function Anasayfa() {
  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-28 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            🎉 Türkiye&apos;nin dijital davetiye platformu
          </span>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Davetiyeni dijitale taşı,{" "}
            <span className="text-purple-600">anı yaşat</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Düğün, nişan, doğum günü ve daha fazlası için dakikalar içinde
            özel davetiye oluştur. WhatsApp ile tek tıkla paylaş.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sablonlar"
              className="bg-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
            >
              Ücretsiz Başla
            </Link>
            <Link
              href="/sablonlar"
              className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Şablonlara Bak
            </Link>
          </div>
        </div>
      </section>

      {/* Sosyal Kanıt */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { sayi: "500+", etiket: "Davetiye Oluşturuldu" },
              { sayi: "%98", etiket: "Memnuniyet Oranı" },
              { sayi: "30+", etiket: "Hazır Şablon" },
              { sayi: "3 dk", etiket: "Ortalama Oluşturma Süresi" },
            ].map((item) => (
              <div key={item.etiket} className="px-6">
                <p className="text-3xl font-bold text-purple-600">{item.sayi}</p>
                <p className="text-sm text-gray-500 mt-1">{item.etiket}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden Davetim?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Kağıt davetiyenin yerini alan modern çözüm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "⚡",
                baslik: "Dakikalar içinde hazır",
                aciklama: "Yüzlerce şablon arasından seç, metnini gir, davetiyeni oluştur. Tasarım bilgisi gerekmez.",
                renk: "bg-yellow-50",
              },
              {
                emoji: "📱",
                baslik: "WhatsApp ile paylaş",
                aciklama: "Tek tıkla WhatsApp'ta paylaş. Misafirlerin linke tıklayarak açsın, uygulama indirmelerine gerek yok.",
                renk: "bg-green-50",
              },
              {
                emoji: "✅",
                baslik: "RSVP takibi",
                aciklama: "Kim geliyor, kim gelemiyor? Katılım sayısını anlık takip et, tablonuzu kolayca planlayın.",
                renk: "bg-blue-50",
              },
              {
                emoji: "🗺️",
                baslik: "Konum entegrasyonu",
                aciklama: "Mekanın Google Maps'te otomatik gösterilir. Misafirler tek tıkla yol tarifi alır.",
                renk: "bg-orange-50",
              },
              {
                emoji: "⏱️",
                baslik: "Geri sayım sayacı",
                aciklama: "Davetiyede etkinliğe kaç gün kaldığını gösteren canlı geri sayım.",
                renk: "bg-pink-50",
              },
              {
                emoji: "📊",
                baslik: "Detaylı istatistik",
                aciklama: "Kaç kişi açtı, ne zaman baktı, hangi şehirden erişti. Her şeyi takip et.",
                renk: "bg-purple-50",
              },
            ].map((ozellik) => (
              <div
                key={ozellik.baslik}
                className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className={`w-12 h-12 ${ozellik.renk} rounded-xl flex items-center justify-center text-2xl mb-5`}>
                  {ozellik.emoji}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{ozellik.baslik}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{ozellik.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              3 adımda davetiye hazır
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { adim: "1", baslik: "Şablon Seç", aciklama: "30+ hazır şablon arasından etkinliğine uygun olanı seç." },
              { adim: "2", baslik: "Özelleştir", aciklama: "Tarih, mekan, mesaj ve rengi kendi zevkine göre düzenle." },
              { adim: "3", baslik: "Paylaş", aciklama: "WhatsApp veya linki kopyalayarak misafirlerine gönder." },
            ].map((item) => (
              <div key={item.adim} className="text-center">
                <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5">
                  {item.adim}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.baslik}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiyatlar Önizleme */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ücretsiz başla, ihtiyacına göre yükselt
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Kredi kartı gerekmez. İstediğin zaman iptal et.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { plan: "Ücretsiz", fiyat: "₺0", ozellik: "1 davetiye, temel özellikler" },
              { plan: "Standart", fiyat: "₺299", ozellik: "5 davetiye, tüm şablonlar", populer: true },
              { plan: "Premium", fiyat: "₺599", ozellik: "Sınırsız davetiye, özel tasarım" },
            ].map((item) => (
              <div
                key={item.plan}
                className={`p-6 rounded-2xl border-2 ${item.populer ? "border-purple-500 bg-purple-50" : "border-gray-100"}`}
              >
                {item.populer && (
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full block w-fit mx-auto mb-3">
                    En Popüler
                  </span>
                )}
                <p className="font-semibold text-gray-800 mb-1">{item.plan}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{item.fiyat}</p>
                <p className="text-sm text-gray-500">{item.ozellik}</p>
              </div>
            ))}
          </div>
          <Link
            href="/fiyatlar"
            className="text-purple-600 font-medium hover:underline"
          >
            Tüm planları karşılaştır
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-600 py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            İlk davetiyeni ücretsiz oluştur
          </h2>
          <p className="text-purple-200 text-lg mb-10">
            2 dakikada başla. Kredi kartı gerekmez.
          </p>
          <Link
            href="/sablonlar"
            className="bg-white text-purple-600 px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-purple-50 transition-colors inline-block"
          >
            Hemen Dene
          </Link>
        </div>
      </section>

    </div>
  );
}
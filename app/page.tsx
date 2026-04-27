import Link from "next/link";

export default function Anasayfa() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-white py-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Sol — Metin */}
            <div>
              <span className="inline-block bg-white border border-purple-100 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
                🎉 Türkiye&apos;nin dijital davetiye platformu
              </span>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Davetiyeni<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  dijitale taşı
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                Düğün, nişan, doğum günü için dakikalar içinde özel davetiye oluştur.
                WhatsApp ile tek tıkla paylaş, RSVP&apos;leri takip et.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/sablonlar"
                  className="bg-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 text-center"
                >
                  Ücretsiz Başla
                </Link>
                <Link
                  href="/sablonlar"
                  className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Şablonlara Bak →
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {["🎂", "💍", "💑", "⭐"].map((e, i) => (
                    <div key={i} className="w-9 h-9 bg-white border-2 border-white rounded-full flex items-center justify-center text-sm shadow-sm">
                      {e}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">500+</span> davetiye oluşturuldu
                </p>
              </div>
            </div>

            {/* Sağ — Davetiye Önizleme */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl opacity-30 blur-xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="p-8 text-center bg-gradient-to-b from-rose-50 to-white">
                  <div className="text-5xl mb-3">💍</div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-purple-500 mb-2">Düğün Davetiyesi</p>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Ayşe & Mehmet</h2>
                  <p className="text-gray-400 text-sm italic mb-6">&ldquo;Mutluluğumuzu sizinle paylaşmak istiyoruz&rdquo;</p>
                  <div className="space-y-3 mb-6">
                    <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-gray-100 text-left shadow-sm">
                      <span className="text-lg">📅</span>
                      <div>
                        <p className="text-xs text-gray-400">Tarih</p>
                        <p className="text-sm font-semibold text-gray-800">12 Eylül 2026, Cumartesi</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 flex items-center gap-3 border border-gray-100 text-left shadow-sm">
                      <span className="text-lg">📍</span>
                      <div>
                        <p className="text-xs text-gray-400">Mekan</p>
                        <p className="text-sm font-semibold text-gray-800">Çırağan Palace, İstanbul</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium">✓ Katılıyorum</button>
                    <button className="bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium">✗ Katılamıyorum</button>
                  </div>
                </div>
                <div className="px-8 py-3 bg-gray-50 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">davetim.com ile oluşturuldu</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Yeni RSVP! 🎉
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-2.5">
                <p className="text-xs text-gray-500">Görüntülenme</p>
                <p className="text-lg font-bold text-gray-800">248 kişi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sosyal Kanıt */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { sayi: "500+", etiket: "Davetiye Oluşturuldu" },
              { sayi: "%98", etiket: "Memnuniyet Oranı" },
              { sayi: "30+", etiket: "Hazır Şablon" },
              { sayi: "3 dk", etiket: "Oluşturma Süresi" },
            ].map((item) => (
              <div key={item.etiket} className="p-4">
                <p className="text-3xl font-bold text-purple-600 mb-1">{item.sayi}</p>
                <p className="text-sm text-gray-500">{item.etiket}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Özellikler</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Neden Davetim?</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Kağıt davetiyenin yerini alan modern çözüm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "⚡", baslik: "Dakikalar içinde hazır", aciklama: "Yüzlerce şablon arasından seç, metnini gir, davetiyeni oluştur.", renk: "from-yellow-400 to-orange-400" },
              { emoji: "📱", baslik: "WhatsApp ile paylaş", aciklama: "Tek tıkla WhatsApp'ta paylaş. Misafirlerin uygulama indirmesine gerek yok.", renk: "from-green-400 to-teal-400" },
              { emoji: "✅", baslik: "RSVP takibi", aciklama: "Kim geliyor, kim gelemiyor? Katılım sayısını anlık takip et.", renk: "from-blue-400 to-indigo-400" },
              { emoji: "🗺️", baslik: "Konum entegrasyonu", aciklama: "Mekanın Google Maps'te otomatik gösterilir. Tek tıkla yol tarifi.", renk: "from-orange-400 to-red-400" },
              { emoji: "⏱️", baslik: "Geri sayım sayacı", aciklama: "Davetiyede etkinliğe kaç gün kaldığını gösteren canlı geri sayım.", renk: "from-pink-400 to-rose-400" },
              { emoji: "🎨", baslik: "Özel tasarım", aciklama: "Renk, font ve şablon seçenekleriyle kendi tarzını yansıt.", renk: "from-purple-400 to-pink-400" },
            ].map((ozellik) => (
              <div key={ozellik.baslik} className="group bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl transition-all hover:-translate-y-1 cursor-default">
                <div className={`w-12 h-12 bg-gradient-to-br ${ozellik.renk} rounded-xl flex items-center justify-center text-2xl mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                  {ozellik.emoji}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{ozellik.baslik}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{ozellik.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Nasıl Çalışır</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">3 adımda davetiye hazır</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-200 to-purple-200" />
            {[
              { adim: "1", baslik: "Şablon Seç", aciklama: "30+ hazır şablon arasından etkinliğine uygun olanı seç.", emoji: "🖼️" },
              { adim: "2", baslik: "Özelleştir", aciklama: "Tarih, mekan, mesaj ve rengi kendi zevkine göre düzenle.", emoji: "✏️" },
              { adim: "3", baslik: "Paylaş", aciklama: "WhatsApp veya linki kopyalayarak misafirlerine gönder.", emoji: "🚀" },
            ].map((item) => (
              <div key={item.adim} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 shadow-lg shadow-purple-200">
                  {item.emoji}
                </div>
                <span className="absolute top-0 right-1/2 translate-x-8 -translate-y-1 bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.adim}
                </span>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.baslik}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yorumlar */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Yorumlar</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Kullanıcılarımız ne diyor?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { isim: "Ayşe K.", etkinlik: "Düğün", yorum: "Davetiyemizi 10 dakikada hazırladık! Misafirlerimiz çok beğendi, hepsi WhatsApp'tan açtı.", puan: 5 },
              { isim: "Mehmet T.", etkinlik: "Sünnet", yorum: "RSVP takibi inanılmaz kolaylık sağladı. Kaç kişinin geleceğini önceden bilmek çok güzeldi.", puan: 5 },
              { isim: "Fatma Y.", etkinlik: "Doğum Günü", yorum: "Kağıt davetiye bastırmak yerine bunu kullandım. Hem ucuz hem çok şık oldu. Kesinlikle tavsiye ederim.", puan: 5 },
            ].map((yorum) => (
              <div key={yorum.isim} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: yorum.puan }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">&ldquo;{yorum.yorum}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {yorum.isim[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{yorum.isim}</p>
                    <p className="text-xs text-gray-400">{yorum.etkinlik} davetiyesi</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiyatlar */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-widest">Fiyatlar</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Ücretsiz başla</h2>
          <p className="text-gray-500 text-lg mb-12">İhtiyacına göre yükselt. Kredi kartı gerekmez.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              { plan: "Ücretsiz", fiyat: "₺0", ozellikler: ["1 davetiye", "Temel şablonlar", "RSVP takibi"], populer: false },
              { plan: "Standart", fiyat: "₺299", ozellikler: ["5 davetiye", "Tüm şablonlar", "WhatsApp paylaşım", "QR kod"], populer: true },
              { plan: "Premium", fiyat: "₺599", ozellikler: ["Sınırsız davetiye", "Özel tasarım", "Müzik ekleme", "Öncelikli destek"], populer: false },
            ].map((item) => (
              <div
                key={item.plan}
                className={`p-7 rounded-2xl text-left relative ${item.populer ? "bg-purple-600 text-white shadow-xl shadow-purple-200" : "bg-white border border-gray-100"}`}
              >
                {item.populer && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    En Popüler
                  </span>
                )}
                <p className={`font-semibold mb-1 ${item.populer ? "text-purple-200" : "text-gray-500"}`}>{item.plan}</p>
                <p className={`text-3xl font-bold mb-5 ${item.populer ? "text-white" : "text-gray-900"}`}>{item.fiyat}</p>
                <ul className="space-y-2 mb-6">
                  {item.ozellikler.map((o) => (
                    <li key={o} className={`text-sm flex items-center gap-2 ${item.populer ? "text-purple-100" : "text-gray-600"}`}>
                      <span className={item.populer ? "text-purple-300" : "text-purple-500"}>✓</span> {o}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/fiyatlar"
                  className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${item.populer ? "bg-white text-purple-600 hover:bg-purple-50" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-br from-purple-600 to-pink-600 py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-4xl font-bold text-white mb-4">
            İlk davetiyeni şimdi oluştur
          </h2>
          <p className="text-purple-200 text-lg mb-10">
            2 dakikada başla. Ücretsiz. Kredi kartı gerekmez.
          </p>
          <Link
            href="/sablonlar"
            className="bg-white text-purple-600 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-purple-50 transition-colors inline-block shadow-xl"
          >
            Hemen Dene 🎉
          </Link>
        </div>
      </section>

    </div>
  );
}
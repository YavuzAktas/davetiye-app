import YasalSayfa from "@/components/YasalSayfa";

export const metadata = {
  title: "Ön Bilgilendirme Formu",
  description: "Bekleriz ücretli plan satın alımları için ön bilgilendirme formu.",
};

const SATICI_BILGILERI = {
  unvan: "DOLDURULACAK - Bekleriz / Satıcı-Sağlayıcı Ticari Unvanı",
  adres: "DOLDURULACAK - Açık adres",
  telefon: "DOLDURULACAK - Telefon numarası",
  eposta: "destek@bekleriz.com",
  mersisVergi: "DOLDURULACAK - MERSİS / vergi bilgisi",
  web: "https://bekleriz.com",
};

export default function OnBilgilendirmeSayfasi() {
  return (
    <YasalSayfa
      etiket="Satış"
      baslik="Ön Bilgilendirme Formu"
      sonGuncelleme="12 Mayıs 2026"
      bolumler={[
        {
          baslik: "Satıcı / Sağlayıcı Bilgileri",
          icerik: (
            <table>
              <tbody>
                <tr><th>Unvan</th><td>{SATICI_BILGILERI.unvan}</td></tr>
                <tr><th>Açık adres</th><td>{SATICI_BILGILERI.adres}</td></tr>
                <tr><th>Telefon</th><td>{SATICI_BILGILERI.telefon}</td></tr>
                <tr><th>E-posta</th><td>{SATICI_BILGILERI.eposta}</td></tr>
                <tr><th>MERSİS / vergi bilgisi</th><td>{SATICI_BILGILERI.mersisVergi}</td></tr>
                <tr><th>Web sitesi</th><td>{SATICI_BILGILERI.web}</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          baslik: "Hizmetin Temel Nitelikleri",
          icerik: (
            <>
              <p>
                Bekleriz, dijital davetiye oluşturma, paylaşma, RSVP toplama ve seçilen plana
                göre ek özellikler sunan çevrimiçi bir hizmettir.
              </p>
              <ul>
                <li><strong>Standart Plan:</strong> 5 aktif davetiye, 200 davetli, tüm şablonlar, RSVP, WhatsApp paylaşımı, QR kod ve müzik ekleme.</li>
                <li><strong>Premium Plan:</strong> Sınırsız davetiye, sınırsız davetli, oturma planı, Albüm & Anı, görüntülenme takibi ve öncelikli destek.</li>
              </ul>
            </>
          ),
        },
        {
          baslik: "Fiyat, Vergiler ve Ödeme",
          icerik: (
            <table>
              <tbody>
                <tr><th>Standart Plan</th><td>₺299, KDV dahil, tek seferlik ödeme</td></tr>
                <tr><th>Premium Plan</th><td>₺599, KDV dahil, tek seferlik ödeme</td></tr>
                <tr><th>Ek masraf</th><td>Platform tarafından ayrıca kargo, teslimat veya kurulum bedeli alınmaz.</td></tr>
                <tr><th>Ödeme altyapısı</th><td>Ödemeler iyzico altyapısı üzerinden işlenir. Kart bilgileri Bekleriz tarafından saklanmaz.</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          baslik: "Teslimat ve İfa",
          icerik: (
            <p>
              Ücretli plan özellikleri ödeme işleminin başarıyla tamamlanmasından sonra hesabınıza
              dijital olarak tanımlanır. Fiziksel teslimat yapılmaz.
            </p>
          ),
        },
        {
          baslik: "Cayma Hakkı ve İstisnası",
          icerik: (
            <>
              <p>
                Tüketici, mesafeli sözleşmelerde kural olarak 14 gün içinde cayma hakkına sahiptir.
                Ancak elektronik ortamda anında ifa edilen hizmetlerde veya cayma hakkı süresi
                dolmadan önce tüketicinin onayı ile ifasına başlanan hizmetlerde cayma hakkı
                kullanılamayabilir.
              </p>
              <p>
                Ödeme ekranındaki onayı işaretleyerek dijital hizmetin ödeme sonrası hemen
                başlamasını talep ettiğinizi ve bu nedenle cayma hakkı istisnası konusunda
                bilgilendirildiğinizi kabul etmiş olursunuz. Hizmetin hiç kullanılmadığı durumlarda
                iade talepleri destek kanalı üzerinden ayrıca değerlendirilir.
              </p>
            </>
          ),
        },
        {
          baslik: "Şikayet ve Uyuşmazlık Yolları",
          icerik: (
            <>
              <p>
                Destek ve iade talepleri için <a href="mailto:destek@bekleriz.com">destek@bekleriz.com</a>{" "}
                adresine başvurabilirsiniz.
              </p>
              <p>
                Tüketici uyuşmazlıklarında parasal sınırlar dahilinde Tüketici Hakem Heyetleri,
                ilgili sınırların üzerindeki uyuşmazlıklarda Tüketici Mahkemeleri yetkilidir.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

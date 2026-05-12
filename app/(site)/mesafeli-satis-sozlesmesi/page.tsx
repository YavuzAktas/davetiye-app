import YasalSayfa from "@/components/YasalSayfa";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Bekleriz ücretli plan satın alımları için mesafeli satış sözleşmesi.",
};

const SATICI_BILGILERI = {
  unvan: "DOLDURULACAK - Bekleriz / Satıcı-Sağlayıcı Ticari Unvanı",
  adres: "DOLDURULACAK - Açık adres",
  telefon: "DOLDURULACAK - Telefon numarası",
  eposta: "destek@bekleriz.com",
  mersisVergi: "DOLDURULACAK - MERSİS / vergi bilgisi",
};

export default function MesafeliSatisSozlesmesiSayfasi() {
  return (
    <YasalSayfa
      etiket="Satış"
      baslik="Mesafeli Satış Sözleşmesi"
      sonGuncelleme="12 Mayıs 2026"
      bolumler={[
        {
          baslik: "Taraflar",
          icerik: (
            <>
              <p>
                İşbu sözleşme, aşağıda bilgileri yer alan satıcı/sağlayıcı ile Bekleriz üzerinden
                ücretli plan satın alan kullanıcı arasında elektronik ortamda kurulmaktadır.
              </p>
              <table>
                <tbody>
                  <tr><th>Satıcı / sağlayıcı</th><td>{SATICI_BILGILERI.unvan}</td></tr>
                  <tr><th>Açık adres</th><td>{SATICI_BILGILERI.adres}</td></tr>
                  <tr><th>Telefon</th><td>{SATICI_BILGILERI.telefon}</td></tr>
                  <tr><th>E-posta</th><td>{SATICI_BILGILERI.eposta}</td></tr>
                  <tr><th>MERSİS / vergi bilgisi</th><td>{SATICI_BILGILERI.mersisVergi}</td></tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          baslik: "Sözleşmenin Konusu",
          icerik: (
            <p>
              Sözleşmenin konusu, kullanıcının seçtiği ücretli Bekleriz planının dijital olarak
              hesabına tanımlanması ve ilgili plan kapsamındaki çevrimiçi davetiye özelliklerinin
              kullandırılmasıdır.
            </p>
          ),
        },
        {
          baslik: "Planlar ve Bedel",
          icerik: (
            <table>
              <tbody>
                <tr><th>Standart Plan</th><td>₺299, KDV dahil, tek seferlik ödeme</td></tr>
                <tr><th>Premium Plan</th><td>₺599, KDV dahil, tek seferlik ödeme</td></tr>
                <tr><th>Ödeme yöntemi</th><td>iyzico ödeme altyapısı üzerinden kredi/banka kartı ve desteklenen diğer ödeme yöntemleri.</td></tr>
                <tr><th>Teslimat</th><td>Fiziksel teslimat yoktur; plan özellikleri ödeme sonrası dijital olarak hesaba tanımlanır.</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          baslik: "Cayma Hakkı",
          icerik: (
            <>
              <p>
                Kullanıcı, mesafeli sözleşmelerde kural olarak 14 gün içinde cayma hakkına
                sahiptir. Ancak elektronik ortamda anında ifa edilen hizmetler veya cayma hakkı
                süresi dolmadan önce tüketicinin onayı ile ifasına başlanan hizmetler bakımından
                cayma hakkı kullanılamayabilir.
              </p>
              <p>
                Kullanıcı, ödeme öncesinde ilgili onay kutusunu işaretleyerek plan özelliklerinin
                ödeme sonrası hemen tanımlanmasını talep eder ve cayma hakkı istisnası hakkında
                bilgilendirildiğini kabul eder. Hizmetin hiç kullanılmadığı durumlarda iade talepleri
                destek kanalı üzerinden ayrıca değerlendirilir.
              </p>
            </>
          ),
        },
        {
          baslik: "Kullanıcının Yükümlülükleri",
          icerik: (
            <ul>
              <li>Kullanıcı, hesap ve ödeme bilgilerinin doğru olduğunu kabul eder.</li>
              <li>Kullanıcı, üçüncü kişilere veya çocuklara ait kişisel verileri paylaşırken gerekli yetki ve bilgilendirmeyi sağlamakla yükümlüdür.</li>
              <li>Kullanıcı, hizmeti hukuka aykırı, yanıltıcı veya üçüncü kişilerin haklarını ihlal edecek şekilde kullanamaz.</li>
            </ul>
          ),
        },
        {
          baslik: "Uyuşmazlık Çözümü",
          icerik: (
            <p>
              Uyuşmazlıklarda öncelikle <a href="mailto:destek@bekleriz.com">destek@bekleriz.com</a>{" "}
              üzerinden çözüm aranır. Tüketici işlemlerinde Tüketici Hakem Heyetleri ve Tüketici
              Mahkemeleri dahil olmak üzere emredici yetki kuralları saklıdır.
            </p>
          ),
        },
        {
          baslik: "Yürürlük",
          icerik: (
            <p>
              Kullanıcı, ödeme öncesinde Ön Bilgilendirme Formu, Kullanım Şartları ve işbu
              Mesafeli Satış Sözleşmesi'ni elektronik ortamda okuyup onaylayarak sözleşmeyi kurar.
            </p>
          ),
        },
      ]}
    />
  );
}

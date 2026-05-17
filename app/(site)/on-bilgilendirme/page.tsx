import YasalSayfa from "@/components/YasalSayfa";
import { ODEME_ALICI_VERILERI, YASAL_BILGILER } from "@/lib/yasal-bilgiler";

export const metadata = {
  title: "Ön Bilgilendirme Formu",
  description: "Bekleriz dijital davetiye satın alımları için ön bilgilendirme formu.",
};

export default function OnBilgilendirmeSayfasi() {
  return (
    <YasalSayfa
      etiket="Satış"
      baslik="Ön Bilgilendirme Formu"
      sonGuncelleme="17 Mayıs 2026"
      bolumler={[
        {
          baslik: "Satıcı / Sağlayıcı Bilgileri",
          icerik: (
            <table>
              <tbody>
                <tr><th>Unvan</th><td>{YASAL_BILGILER.unvan}</td></tr>
                <tr><th>Açık adres</th><td>{YASAL_BILGILER.adres}</td></tr>
                <tr><th>Telefon</th><td>{YASAL_BILGILER.telefon}</td></tr>
                <tr><th>E-posta</th><td>{YASAL_BILGILER.destekEposta}</td></tr>
                <tr><th>MERSİS / vergi bilgisi</th><td>{YASAL_BILGILER.mersisVergi}</td></tr>
                <tr><th>Web sitesi</th><td>{YASAL_BILGILER.web}</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          baslik: "Hizmetin Temel Nitelikleri",
          icerik: (
            <>
              <p>
                Bekleriz, dijital davetiye oluşturma, paylaşma, RSVP toplama ve seçilen
                davetiyeye göre ek özellikler sunan çevrimiçi bir hizmettir.
              </p>
              <ul>
                <li><strong>Temel dijital davetiye:</strong> Mobil uyumlu davetiye, paylaşım linki, RSVP ve yönetim paneli.</li>
                <li><strong>Ek özellikler:</strong> Lüks şablon, müzik, Albüm & Anı, sesli anı, canlı fotoğraf duvarı ve oturma planı gibi isteğe bağlı özellikler.</li>
              </ul>
            </>
          ),
        },
        {
          baslik: "Fiyat, Vergiler ve Ödeme",
          icerik: (
            <table>
              <tbody>
                <tr><th>Temel dijital davetiye</th><td>₺199, KDV dahil, tek seferlik ödeme</td></tr>
                <tr><th>Ek özellikler</th><td>Seçilen özelliklere göre ödeme ekranı öncesinde ayrıca gösterilir.</td></tr>
                <tr><th>Toplam fiyat</th><td>Davetiye oluşturma ekranında ve ödeme öncesinde seçilen özelliklere göre hesaplanır.</td></tr>
                <tr><th>Ek masraf</th><td>Platform tarafından ayrıca kargo, teslimat veya kurulum bedeli alınmaz.</td></tr>
                <tr><th>Ödeme altyapısı</th><td>Ödemeler iyzico altyapısı üzerinden işlenir. Kart bilgileri Bekleriz tarafından saklanmaz.</td></tr>
                <tr><th>Ödeme için aktarılan alıcı bilgileri</th><td>{ODEME_ALICI_VERILERI.join(", ")}.</td></tr>
              </tbody>
            </table>
          ),
        },
        {
          baslik: "Teslimat ve İfa",
          icerik: (
            <p>
              Satın alınan davetiye ve seçilen ek özellikler ödeme işleminin başarıyla
              tamamlanmasından sonra dijital olarak aktif edilir. Fiziksel teslimat yapılmaz.
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
                istisnası uygulanabilir.
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

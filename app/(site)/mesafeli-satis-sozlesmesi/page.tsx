import YasalSayfa from "@/components/YasalSayfa";
import { ODEME_ALICI_VERILERI, YASAL_BILGILER, YASAL_SON_GUNCELLEME } from "@/lib/yasal-bilgiler";
import { DAVETIYE_FIYAT_KALEMLERI, tutarMetni } from "@/lib/davetiye-fiyatlandirma";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Bekleriz dijital davetiye satın alımları için mesafeli satış sözleşmesi.",
};

export default function MesafeliSatisSozlesmesiSayfasi() {
  return (
    <YasalSayfa
      etiket="Satış"
      baslik="Mesafeli Satış Sözleşmesi"
      sonGuncelleme={YASAL_SON_GUNCELLEME}
      bolumler={[
        {
          baslik: "Taraflar",
          icerik: (
            <>
              <p>
                İşbu sözleşme, aşağıda bilgileri yer alan satıcı/sağlayıcı ile Bekleriz üzerinden
                dijital davetiye veya ek özellik satın alan kullanıcı arasında elektronik ortamda kurulmaktadır.
              </p>
              <table>
                <tbody>
                  <tr><th>Satıcı / sağlayıcı</th><td>{YASAL_BILGILER.unvan}</td></tr>
                  <tr><th>Açık adres</th><td>{YASAL_BILGILER.adres}</td></tr>
                  <tr><th>Telefon</th><td>{YASAL_BILGILER.telefon}</td></tr>
                  <tr><th>E-posta</th><td>{YASAL_BILGILER.destekEposta}</td></tr>
                  <tr><th>MERSİS / vergi bilgisi</th><td>{YASAL_BILGILER.mersisVergi}</td></tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          baslik: "Sözleşmenin Konusu",
          icerik: (
            <p>
              Sözleşmenin konusu, kullanıcının Bekleriz üzerinde oluşturduğu dijital davetiye
              ve seçtiği ek özelliklerin ödeme sonrası dijital olarak aktif edilmesidir.
            </p>
          ),
        },
        {
          baslik: "Hizmet ve Bedel",
          icerik: (
            <table>
              <tbody>
                <tr><th>Temel dijital davetiye</th><td>{tutarMetni(DAVETIYE_FIYAT_KALEMLERI.temel.tutar)}, KDV dahil, tek seferlik ödeme</td></tr>
                <tr><th>Ek özellikler</th><td>Seçilen özelliklere göre ödeme öncesinde ayrıca gösterilir.</td></tr>
                <tr><th>Toplam bedel</th><td>Davetiye oluşturma ve ödeme ekranında seçilen özelliklere göre hesaplanır.</td></tr>
                <tr><th>Ödeme yöntemi</th><td>iyzico ödeme altyapısı üzerinden kredi/banka kartı ve desteklenen diğer ödeme yöntemleri.</td></tr>
                <tr><th>Ödeme için aktarılan alıcı bilgileri</th><td>{ODEME_ALICI_VERILERI.join(", ")}.</td></tr>
                <tr><th>Teslimat</th><td>Fiziksel teslimat yoktur; davetiye ve seçilen özellikler ödeme sonrası dijital olarak aktif edilir.</td></tr>
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
                cayma hakkı istisnası uygulanabilir.
              </p>
              <p>
                Kullanıcı, ödeme öncesinde ilgili onay kutusunu işaretleyerek dijital davetiye
                hizmetinin ödeme sonrası hemen başlatılmasını talep eder ve cayma hakkı istisnası hakkında
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

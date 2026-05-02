import YasalSayfa from "@/components/YasalSayfa";

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Bekleriz platformu kişisel verilerin korunması kanunu aydınlatma metni.",
};

export default function KvkkSayfasi() {
  return (
    <YasalSayfa
      etiket="Yasal"
      baslik="KVKK Aydınlatma Metni"
      sonGuncelleme="2 Mayıs 2026"
      bolumler={[
        {
          baslik: "Veri Sorumlusu",
          icerik: (
            <>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("<strong>KVKK</strong>") uyarınca,
                kişisel verileriniz; veri sorumlusu sıfatıyla <strong>Bekleriz</strong> tarafından
                aşağıda açıklanan kapsamda işlenmektedir.
              </p>
              <table>
                <tbody>
                  <tr><th>Ticaret Unvanı</th><td>Bekleriz</td></tr>
                  <tr><th>Hizmet Adresi</th><td>Türkiye</td></tr>
                  <tr><th>E-posta</th><td>kvkk@bekleriz.com</td></tr>
                  <tr><th>Web Sitesi</th><td>bekleriz.com</td></tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          baslik: "İşlenen Kişisel Veriler ve Kaynakları",
          icerik: (
            <>
              <p>Platformumuz kapsamında aşağıdaki kişisel veriler işlenmektedir:</p>
              <table>
                <thead>
                  <tr><th>Veri Kategorisi</th><th>Veriler</th><th>Kaynak</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Kimlik</strong></td><td>Ad soyad</td><td>Üyelik formu / Google</td></tr>
                  <tr><td><strong>İletişim</strong></td><td>E-posta adresi</td><td>Üyelik formu / Google</td></tr>
                  <tr><td><strong>Güvenlik</strong></td><td>Şifre (şifrelenmiş)</td><td>Üyelik formu</td></tr>
                  <tr><td><strong>Görsel</strong></td><td>Profil fotoğrafı</td><td>Google (isteğe bağlı)</td></tr>
                  <tr><td><strong>Hizmet kullanım</strong></td><td>Oluşturulan davetiyeler, şablon tercihleri</td><td>Platform kullanımı</td></tr>
                  <tr><td><strong>Ödeme</strong></td><td>Plan bilgisi (ödeme kartı bilgileri tarafımızca saklanmaz)</td><td>İyzico ödeme altyapısı</td></tr>
                  <tr><td><strong>İşlem güvenliği</strong></td><td>IP adresi, oturum bilgisi</td><td>Otomatik (teknik)</td></tr>
                  <tr><td><strong>Misafir verisi (RSVP)</strong></td><td>Misafir adı, e-posta, telefon (gönüllü)</td><td>RSVP formu</td></tr>
                  <tr><td><strong>Onay kayıtları</strong></td><td>KVKK onay tarihi</td><td>Üyelik formu</td></tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          baslik: "Kişisel Verilerin İşlenme Amaçları",
          icerik: (
            <ul>
              <li>Üyelik kaydının oluşturulması ve kimlik doğrulama</li>
              <li>Dijital davetiye oluşturma, düzenleme ve paylaşım hizmetinin sunulması</li>
              <li>RSVP (katılım bildirimi) toplanması ve davet sahibine iletilmesi</li>
              <li>Ödeme işlemlerinin gerçekleştirilmesi ve planın güncellenmesi</li>
              <li>Teknik destek ve müşteri hizmetleri sunulması</li>
              <li>Platform güvenliğinin ve bütünlüğünün sağlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>Hizmet kalitesinin iyileştirilmesi (anonim istatistik)</li>
            </ul>
          ),
        },
        {
          baslik: "Kişisel Veri İşlemenin Hukuki Dayanakları",
          icerik: (
            <>
              <p>Kişisel verileriniz KVKK m.5 kapsamında aşağıdaki hukuki dayanaklara göre işlenmektedir:</p>
              <table>
                <thead>
                  <tr><th>Amaç</th><th>Hukuki Dayanak</th></tr>
                </thead>
                <tbody>
                  <tr><td>Üyelik ve hizmet sunumu</td><td>Sözleşmenin ifası (m.5/2-c)</td></tr>
                  <tr><td>Ödeme işlemleri</td><td>Sözleşmenin ifası (m.5/2-c)</td></tr>
                  <tr><td>Güvenlik, log kayıtları</td><td>Meşru menfaat (m.5/2-f)</td></tr>
                  <tr><td>Yasal yükümlülükler</td><td>Kanuni yükümlülük (m.5/2-ç)</td></tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          baslik: "Kişisel Verilerin Aktarıldığı Taraflar",
          icerik: (
            <>
              <p>Kişisel verileriniz yalnızca aşağıdaki amaçlarla ve gerekli ölçüde üçüncü taraflarla paylaşılmaktadır:</p>
              <table>
                <thead>
                  <tr><th>Alıcı</th><th>Amaç</th><th>Konum</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Google LLC</strong></td><td>OAuth kimlik doğrulama</td><td>ABD (SCCs)</td></tr>
                  <tr><td><strong>İyzico Ödeme Hizmetleri A.Ş.</strong></td><td>Ödeme altyapısı</td><td>Türkiye</td></tr>
                  <tr><td><strong>Resend Inc.</strong></td><td>İşlemsel e-posta gönderimi</td><td>ABD (SCCs)</td></tr>
                  <tr><td><strong>Supabase Inc.</strong></td><td>Veritabanı barındırma</td><td>AB (AWS eu-west)</td></tr>
                  <tr><td><strong>Vercel Inc.</strong></td><td>Uygulama barındırma</td><td>ABD (SCCs)</td></tr>
                </tbody>
              </table>
              <p>
                Yurt dışına aktarımlarda KVKK m.9 kapsamında gerekli güvenceler (Standart Sözleşme Maddeleri)
                sağlanmaktadır.
              </p>
            </>
          ),
        },
        {
          baslik: "Kişisel Verilerin Saklanma Süreleri",
          icerik: (
            <>
              <table>
                <thead>
                  <tr><th>Veri</th><th>Saklama Süresi</th></tr>
                </thead>
                <tbody>
                  <tr><td>Üyelik ve hesap bilgileri</td><td>Hesap silinene kadar + 3 yıl</td></tr>
                  <tr><td>Ödeme kayıtları</td><td>10 yıl (Vergi Usul Kanunu)</td></tr>
                  <tr><td>RSVP misafir bilgileri</td><td>Davetiye silinene kadar + 1 yıl</td></tr>
                  <tr><td>Log ve güvenlik kayıtları</td><td>2 yıl</td></tr>
                  <tr><td>KVKK onay kayıtları</td><td>Hesap silinmesinden itibaren 3 yıl</td></tr>
                </tbody>
              </table>
              <p>Saklama süreleri dolduğunda veriler otomatik olarak silinir veya anonim hale getirilir.</p>
            </>
          ),
        },
        {
          baslik: "Veri Sahibinin Hakları (KVKK m.11)",
          icerik: (
            <>
              <p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul>
                <li><strong>Bilgi alma:</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li><strong>Erişim:</strong> İşlenen kişisel verilerinize erişim ve kopyasını talep etme</li>
                <li><strong>Düzeltme:</strong> Eksik veya yanlış verilerin düzeltilmesini isteme</li>
                <li><strong>Silme:</strong> KVKK'da öngörülen şartların varlığı hâlinde silinmesini talep etme</li>
                <li><strong>Aktarım bildirimi:</strong> Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                <li><strong>İtiraz:</strong> Otomatik sistemlerle analiz sonucu aleyhinize çıkan kararlara itiraz etme</li>
                <li><strong>Zararın giderilmesi:</strong> Kanuna aykırı işleme nedeniyle oluşan zararın tazminini talep etme</li>
              </ul>
            </>
          ),
        },
        {
          baslik: "Başvuru Yöntemi",
          icerik: (
            <>
              <p>
                Haklarınızı kullanmak için aşağıdaki kanallardan başvurabilirsiniz. Başvurularınız
                en geç <strong>30 gün</strong> içinde sonuçlandırılacaktır (KVKK m.13).
              </p>
              <table>
                <tbody>
                  <tr><th>E-posta</th><td>kvkk@bekleriz.com</td></tr>
                  <tr><th>Konu</th><td>"KVKK Başvurusu" olarak belirtiniz</td></tr>
                </tbody>
              </table>
              <p>
                Başvurunuzda; ad soyadınız, T.C. kimlik numaranız (veya yabancı uyruklu iseniz
                pasaport numarası), tebligata esas adres, e-posta adresiniz ve talebinizin
                konusunu açıkça belirtiniz.
              </p>
              <p>
                Başvurunuzun reddedilmesi, verilen cevabın yetersiz bulunması veya süresinde
                cevap verilmemesi hâlinde <strong>Kişisel Verileri Koruma Kurulu</strong>'na
                şikâyette bulunma hakkınız saklıdır.
              </p>
            </>
          ),
        },
        {
          baslik: "Çerez (Cookie) Politikası",
          icerik: (
            <>
              <p>Platformumuz aşağıdaki çerezleri kullanmaktadır:</p>
              <table>
                <thead>
                  <tr><th>Çerez</th><th>Amaç</th><th>Süre</th><th>Zorunlu</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>next-auth.session-token</code></td><td>Oturum yönetimi (JWT)</td><td>30 gün</td><td>Evet</td></tr>
                  <tr><td><code>next-auth.csrf-token</code></td><td>CSRF güvenliği</td><td>Oturum</td><td>Evet</td></tr>
                  <tr><td><code>next-auth.callback-url</code></td><td>Yönlendirme</td><td>Oturum</td><td>Evet</td></tr>
                </tbody>
              </table>
              <p>
                Platformumuz şu an yalnızca hizmetin çalışması için zorunlu çerezler kullanmaktadır.
                Analitik veya pazarlama çerezleri kullanılmamaktadır.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

import YasalSayfa from "@/components/YasalSayfa";
import { YASAL_SON_GUNCELLEME } from "@/lib/yasal-bilgiler";

export const metadata = {
  title: "Kullanım Şartları",
  description: "DavetRota platformu kullanım şartları ve hizmet koşulları.",
};

export default function KullanimSartlariSayfasi() {
  return (
    <YasalSayfa
      etiket="Yasal"
      baslik="Kullanım Şartları"
      sonGuncelleme={YASAL_SON_GUNCELLEME}
      bolumler={[
        {
          baslik: "Taraflar ve Kapsam",
          icerik: (
            <>
              <p>
                Bu Kullanım Şartları ("<strong>Şartlar</strong>"), <strong>DavetRota</strong> ("<strong>DavetRota</strong>",
                "<strong>biz</strong>") ile platformumuzu kullanan gerçek veya tüzel kişi
                ("<strong>Kullanıcı</strong>", "<strong>siz</strong>") arasındaki hukuki ilişkiyi
                düzenlemektedir.
              </p>
              <p>
                Platforma erişerek veya kayıt oluşturarak bu Şartları okuduğunuzu, anladığınızı
                ve kabul ettiğinizi beyan etmiş olursunuz. Şartları kabul etmiyorsanız
                platformu kullanmayınız.
              </p>
            </>
          ),
        },
        {
          baslik: "Hizmetin Tanımı",
          icerik: (
            <>
              <p>
                DavetRota; kullanıcıların düğün, nişan, doğum günü ve benzeri etkinlikler için
                dijital davetiye oluşturmasına, paylaşmasına ve RSVP (katılım bildirimi) toplamasına
                imkân tanıyan çevrimiçi bir platformdur.
              </p>
              <p>Platform aşağıdaki hizmetleri sunmaktadır:</p>
              <ul>
                <li>Şablon tabanlı dijital davetiye oluşturma</li>
                <li>Davetiye paylaşım bağlantısı ve QR kod üretimi</li>
                <li>RSVP (katılım bildirimi) toplama ve yönetimi</li>
                <li>Misafir listesi yönetimi</li>
                <li>E-posta bildirimleri</li>
                <li>Organizasyon firmaları için partner aboneliği ve müşteriye özel aktivasyon hakkı yönetimi</li>
              </ul>
            </>
          ),
        },
        {
          baslik: "Kullanıcı Hesabı",
          icerik: (
            <ul>
              <li>Hesap oluşturmak için en az <strong>18 yaşında</strong> olmanız gerekmektedir.</li>
              <li>Hesap bilgilerinizin doğruluğundan ve güncel tutulmasından siz sorumlusunuz.</li>
              <li>Hesap şifrenizi gizli tutmakla yükümlüsünüz; yetkisiz erişimleri derhal bildirmelisiniz.</li>
              <li>Çocuklara yönelik doğum günü veya aile etkinliği davetiyeleri oluşturabilirsiniz; ancak hesabı kullanan kişi 18 yaşından büyük olmalı ve çocuklara ait ad, yaş, fotoğraf, ses veya benzeri bilgileri yalnızca ebeveyn/veli ya da yetkili kişi sıfatıyla paylaşmalıdır.</li>
              <li>Davetiyeye çocuk veya üçüncü kişilere ait ad, fotoğraf, ses ya da iletişim bilgisi eklerseniz, bu paylaşım için gerekli yetkiyi aldığınızı ve ilgili kişileri bilgilendirdiğinizi kabul edersiniz.</li>
              <li>Her gerçek veya tüzel kişi yalnızca bir hesap açabilir.</li>
              <li>Hesabınızı başkasına devredemez veya paylaşamazsınız.</li>
            </ul>
          ),
        },
        {
          baslik: "Kullanım Kuralları ve Yasaklar",
          icerik: (
            <>
              <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
              <ul>
                <li>Yanıltıcı, sahte veya başkasına ait kimlik bilgileriyle hesap açmak</li>
                <li>Platforma zarar verecek, aşırı yükleyecek veya işleyişini bozacak girişimlerde bulunmak</li>
                <li>Fikri mülkiyet haklarını ihlal eden içerik yüklemek</li>
                <li>Başkalarına ait kişisel verileri izinsiz işlemek veya paylaşmak</li>
                <li>Spam, kimlik avı veya kötü amaçlı yazılım içeren davetiyeler oluşturmak</li>
                <li>Platformu yasadışı faaliyetler için kullanmak</li>
                <li>Otomatik araçlarla (bot, scraper) sisteme erişmek</li>
                <li>Başka kullanıcıların verilerine yetkisiz erişim sağlamaya çalışmak</li>
              </ul>
              <p>
                Bu kurallara aykırı davranış tespit edildiğinde hesabınız önceden uyarı yapılmaksızın
                askıya alınabilir veya sonlandırılabilir.
              </p>
            </>
          ),
        },
        {
          baslik: "Ücretlendirme ve Ödeme",
          icerik: (
            <>
              <p>
                Son kullanıcı davetiye ödemelerinde ücretlendirme davetiye bazlıdır; bu alımlarda
                abonelik veya otomatik yenileme yoktur. Partner programı ise ayrı bir ticari hizmettir
                ve aylık otomatik yenilenen abonelik modeliyle çalışabilir.
              </p>
              <ul>
                <li>Davetiye ve ek özellik ödemeleri <strong>iyzico</strong> güvenceli ödeme altyapısı üzerinden işlenir.</li>
                <li>Her davetiye için seçilen özelliklere göre tek seferlik ödeme alınır.</li>
                <li>Temel ücret ve ek özellik bedelleri <a href="/fiyatlar">fiyatlar sayfasında</a> belirtilmiştir.</li>
                <li>Ödeme başarısız olursa davetiye taslak olarak kalır ve yayına alınmaz.</li>
                <li>Fiyatlar KDV dahildir. KDV oranı yasal mevzuata göre değişebilir.</li>
              </ul>
              <p>
                Partner programı ayrı bir B2B hizmettir. Partner firmalar aylık aktivasyon hakkı
                satın alabilir ve bu hakları müşterilerine iletebilir. Aktivasyon hakkı ile gelen müşteri
                davetiyesini kendi hesabında oluşturur; yasal metinleri kendi adına kabul eder ve davetli
                verilerini kendisi yönetir.
              </p>
              <p>
                Partnerin müşteriye aktivasyon linki sağlaması, partnerin müşteri adına yasal onay verdiği
                veya davetli verilerini yönetebileceği anlamına gelmez. Partner panelinde müşteri e-postası,
                davetli listesi, RSVP yanıtları, medya/anı içerikleri, check-in kayıtları ve davetiye bağlantısı
                gösterilmez.
              </p>
            </>
          ),
        },
        {
          baslik: "Partner Programı Kuralları",
          icerik: (
            <>
              <p>
                Partner programı; organizasyon firmaları, fotoğrafçılar, mekanlar ve benzeri ticari
                iş ortaklarının müşterilerine dijital davetiye aktivasyon hakkı sunabilmesi için tasarlanmıştır.
              </p>
              <ul>
                <li>Partner yalnızca satın aldığı paket kapsamındaki aktivasyon linklerini müşterilerine iletebilir.</li>
                <li>Aktivasyon linki tek kullanımlıktır ve ilgili partner aboneliği süresince geçerlidir.</li>
                <li>Aktivasyon hakkı kullanıldığında davetiye müşterinin kendi DavetRota hesabında oluşur.</li>
                <li>Partner, müşteri adına KVKK, gizlilik, kullanım şartları veya ticari ileti onayı veremez.</li>
                <li>Partner, platform üzerinden müşteriye veya müşterinin davetlilerine reklam/kampanya mesajı gönderemez.</li>
                <li>Ticari elektronik ileti gönderimi yapılacaksa gerekli izinler ve İYS yükümlülükleri partnerin kendi sorumluluğundadır.</li>
              </ul>
              <p>
                Partner programı için ayrıca <a href="/partner/sozlesme">Partner Sözleşmesi</a> uygulanır.
              </p>
            </>
          ),
        },
        {
          baslik: "Cayma Hakkı ve İade Politikası",
          icerik: (
            <>
              <p>
                <strong>6502 sayılı Tüketicinin Korunması Kanunu</strong> ve Mesafeli Sözleşmeler
                Yönetmeliği kapsamında:
              </p>
              <ul>
                <li>
                  Tüketici, mesafeli sözleşmelerde kural olarak 14 gün içinde cayma hakkına
                  sahiptir. Ancak elektronik ortamda anında ifa edilen hizmetlerde veya cayma
                  hakkı süresi dolmadan önce tüketicinin onayı ile ifasına başlanan hizmetlerde
                  cayma hakkı istisnası uygulanabilir.
                </li>
                <li>
                  Ödeme öncesindeki onay kutusunu işaretleyerek dijital davetiye hizmetinin ödeme
                  sonrası hemen başlatılmasını talep ettiğinizi ve cayma hakkı istisnası hakkında
                  bilgilendirildiğinizi kabul edersiniz.
                </li>
                <li>
                  Hizmetin hiç kullanılmadığı durumlarda, satın alma tarihinden itibaren{" "}
                  <strong>14 gün</strong> içindeki başvurular iade değerlendirmesine alınır.
                </li>
                <li>
                  İade talepleri için <a href="mailto:destek@davetrota.com">destek@davetrota.com</a>{" "}
                  adresine yazınız. Talepler 5 iş günü içinde yanıtlanır.
                </li>
              </ul>
            </>
          ),
        },
        {
          baslik: "İçerik Sahipliği ve Lisans",
          icerik: (
            <>
              <p>
                Platformda oluşturduğunuz davetiye içerikleri (metinler, yüklediğiniz görseller)
                size aittir. DavetRota bu içerikler üzerinde mülkiyet hakkı talep etmez.
              </p>
              <p>
                Bununla birlikte içeriğinizi platform üzerinde barındırmak, iletmek ve görüntülemek
                amacıyla bize <strong>sınırlı, geri alınabilir, telif ücretsiz</strong> bir lisans
                tanımış olursunuz.
              </p>
              <p>
                Platform tasarımları, şablonlar, marka unsurları ve yazılım <strong>DavetRota</strong>'e
                aittir; izinsiz kopyalanamaz, dağıtılamaz veya türev eserler oluşturulamaz.
              </p>
            </>
          ),
        },
        {
          baslik: "Hizmet Sürekliliği ve Garantiler",
          icerik: (
            <>
              <p>
                Platformu "<strong>olduğu gibi</strong>" sunmaktayız. Kesintisiz, hatasız veya
                belirli bir amaca uygunluk garantisi vermiyoruz. Bununla birlikte hizmet
                kalitesini en üst düzeyde tutmaya çalışıyoruz.
              </p>
              <ul>
                <li>Planlı bakım çalışmalarını önceden duyuracağız.</li>
                <li>Veri kayıplarına karşı düzenli yedekleme yapılmaktadır.</li>
                <li>Mücbir sebep (deprem, saldırı, vb.) durumlarında sorumluluk kabul edilmez.</li>
              </ul>
            </>
          ),
        },
        {
          baslik: "Sorumluluk Sınırlaması",
          icerik: (
            <>
              <p>
                DavetRota’nın herhangi bir nedenle sorumlu tutulabileceği durumlarda toplam sorumluluğu;
                zararın meydana geldiği tarihten önceki son <strong>3 ay</strong> içinde
                kullanıcının ödediği toplam ücretle sınırlıdır.
              </p>
              <p>
                DavetRota; veri kayıpları, iş kesintisi, kâr kaybı veya dolaylı zararlar için
                sorumlu tutulamaz.
              </p>
            </>
          ),
        },
        {
          baslik: "Hesap Feshi ve Veri Silme",
          icerik: (
            <>
              <p>
                Hesabınızı istediğiniz zaman <strong>Dashboard → Ayarlar</strong> sayfasından
                silebilirsiniz. Hesap silindiğinde:
              </p>
              <ul>
                <li>Tüm davetiyeleriniz, yüklediğiniz medya dosyaları ve içerikleriniz kalıcı olarak silinir.</li>
                <li>RSVP ve misafir verileri silinir.</li>
                <li>Yasal saklama yükümlülüğü olan ödeme kayıtları mevzuat gereği saklanmaya devam eder.</li>
              </ul>
              <p>
                Şartlara aykırı davranış tespit edilmesi hâlinde DavetRota, hesabı önceden
                bildirmeksizin feshedebilir. Ücret iadesi talepleri bu Şartlar'daki iade politikası
                ve emredici tüketici mevzuatı hükümlerine göre değerlendirilir.
              </p>
            </>
          ),
        },
        {
          baslik: "Uygulanacak Hukuk ve Uyuşmazlık Çözümü",
          icerik: (
            <>
              <p>
                Bu Şartlar <strong>Türk Hukuku</strong>'na tabidir. Uyuşmazlıklarda öncelikle
                dostane çözüm yolları denenir.
              </p>
              <p>
                Çözüme kavuşturulamazsa, tüketicilere ilişkin emredici yetki kuralları saklı kalmak
                kaydıyla <strong>İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri</strong> yetkilidir.
              </p>
              <p>
                Tüketici uyuşmazlıklarında <strong>Tüketici Hakem Heyeti</strong> veya
                <strong> Tüketici Mahkemeleri</strong> yetkilidir. Yasal sınırlar kapsamında
                uyuşmazlığın bulunduğu ildeki Tüketici Hakem Heyeti'ne başvurabilirsiniz.
              </p>
            </>
          ),
        },
        {
          baslik: "Şartlardaki Değişiklikler",
          icerik: (
            <p>
              Bu Şartlar zaman zaman güncellenebilir. Önemli değişiklikler bu sayfada yayımlanır;
              gerekli görüldüğünde kayıtlı e-posta adresiniz veya platform içi uygun kanallar
              üzerinden ayrıca bilgilendirme yapılabilir. Güncel şartlara her zaman bu sayfadan
              ulaşabilirsiniz.
            </p>
          ),
        },
        {
          baslik: "İletişim",
          icerik: (
            <table>
              <tbody>
                <tr><th>Genel destek</th><td>destek@davetrota.com</td></tr>
                <tr><th>KVKK başvuruları</th><td>kvkk@davetrota.com</td></tr>
                <tr><th>Hukuki bildirimler</th><td>hukuk@davetrota.com</td></tr>
              </tbody>
            </table>
          ),
        },
      ]}
    />
  );
}

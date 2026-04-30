import YasalSayfa from "@/components/YasalSayfa";

export const metadata = {
  title: "Kullanım Şartları",
  description: "Bekleriz platformu kullanım şartları ve hizmet koşulları.",
};

export default function KullanimSartlariSayfasi() {
  return (
    <YasalSayfa
      etiket="Yasal"
      baslik="Kullanım Şartları"
      sonGuncelleme="29 Nisan 2026"
      bolumler={[
        {
          baslik: "Taraflar ve Kapsam",
          icerik: (
            <>
              <p>
                Bu Kullanım Şartları ("<strong>Şartlar</strong>"), <strong>Bekleriz</strong> ("<strong>Bekleriz</strong>",
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
                Bekleriz; kullanıcıların düğün, nişan, doğum günü ve benzeri etkinlikler için
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
          baslik: "Planlar, Ücretlendirme ve Ödeme",
          icerik: (
            <>
              <p>Platformumuz ücretsiz ve ücretli plan seçenekleri sunmaktadır.</p>
              <ul>
                <li>Ücretli planlar <strong>iyzico</strong> güvenceli ödeme altyapısı üzerinden işlenir.</li>
                <li>Plan ücretleri aylık veya yıllık olarak tahsil edilir; fiyatlar <a href="/fiyatlar">fiyatlar sayfasında</a> belirtilmiştir.</li>
                <li>Ödeme başarısız olursa hesabınız ücretsiz plana düşürülebilir.</li>
                <li>Fiyatlar KDV dahildir. KDV oranı yasal mevzuata göre değişebilir.</li>
              </ul>
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
                  Dijital içerik ve hizmet satın alımlarında, hizmet ifasına başlandıktan sonra
                  (davetiye oluşturma özelliğine erişim sağlandığında) cayma hakkı kullanılamaz.
                  Satın alma sırasında bu husus açıkça onaylanmaktadır.
                </li>
                <li>
                  Hizmetin hiç kullanılmadığı ve satın alma tarihinden itibaren <strong>14 gün</strong>{" "}
                  içindeki başvurularda iade değerlendirmeye alınır.
                </li>
                <li>
                  İade talepleri için <a href="mailto:destek@bekleriz.com">destek@bekleriz.com</a>{" "}
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
                size aittir. Bekleriz bu içerikler üzerinde mülkiyet hakkı talep etmez.
              </p>
              <p>
                Bununla birlikte içeriğinizi platform üzerinde barındırmak, iletmek ve görüntülemek
                amacıyla bize <strong>sınırlı, geri alınabilir, telif ücretsiz</strong> bir lisans
                tanımış olursunuz.
              </p>
              <p>
                Platform tasarımları, şablonlar, marka unsurları ve yazılım <strong>Bekleriz</strong>'e
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
                Bekleriz'in herhangi bir nedenle sorumlu tutulabileceği durumlarda toplam sorumluluğu;
                zararın meydana geldiği tarihten önceki son <strong>3 ay</strong> içinde
                kullanıcının ödediği toplam ücretle sınırlıdır.
              </p>
              <p>
                Bekleriz; veri kayıpları, iş kesintisi, kâr kaybı veya dolaylı zararlar için
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
                <li>Tüm davetiyeleriniz ve içerikleriniz kalıcı olarak silinir.</li>
                <li>RSVP ve misafir verileri silinir.</li>
                <li>Yasal saklama yükümlülüğü olan ödeme kayıtları mevzuat gereği saklanmaya devam eder.</li>
              </ul>
              <p>
                Şartlara aykırı davranış tespit edilmesi hâlinde Bekleriz, hesabı önceden
                bildirmeksizin feshedebilir. Aktif aboneliğin kalan süresi iade edilmez.
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
                Çözüme kavuşturulamazsa <strong>İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri</strong>
                yetkilidir.
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
              Bu Şartlar zaman zaman güncellenebilir. Önemli değişiklikler en az{" "}
              <strong>15 gün önceden</strong> kayıtlı e-posta adresinize bildirilir.
              Bildirimin ardından platformu kullanmaya devam etmeniz değişiklikleri kabul
              ettiğiniz anlamına gelir.
            </p>
          ),
        },
        {
          baslik: "İletişim",
          icerik: (
            <table>
              <tbody>
                <tr><th>Genel destek</th><td>destek@bekleriz.com</td></tr>
                <tr><th>KVKK başvuruları</th><td>kvkk@bekleriz.com</td></tr>
                <tr><th>Hukuki bildirimler</th><td>hukuk@bekleriz.com</td></tr>
              </tbody>
            </table>
          ),
        },
      ]}
    />
  );
}

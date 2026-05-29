import YasalSayfa from "@/components/YasalSayfa";
import { ODEME_ALICI_VERILERI, YASAL_SON_GUNCELLEME } from "@/lib/yasal-bilgiler";

export const metadata = {
  title: "Gizlilik Politikası",
  description: "Bekleriz platformu gizlilik politikası ve kişisel veri işleme ilkeleri.",
};

export default function GizlilikSayfasi() {
  return (
    <YasalSayfa
      etiket="Yasal"
      baslik="Gizlilik Politikası"
      sonGuncelleme={YASAL_SON_GUNCELLEME}
      bolumler={[
        {
          baslik: "Genel Bakış",
          icerik: (
            <>
              <p>
                <strong>Bekleriz</strong> olarak gizliliğinize saygı duyuyor ve kişisel verilerinizi
                korumayı öncelikli yükümlülüklerimizden biri olarak kabul ediyoruz. Bu Gizlilik
                Politikası; hangi verileri topladığımızı, neden topladığımızı ve bu verileri nasıl
                kullandığımızı açıklamaktadır.
              </p>
              <p>
                Bu politika, <strong>6698 sayılı KVKK</strong> ve uygulanabilir olduğu ölçüde
                ilgili diğer veri koruma mevzuatı dikkate alınarak hazırlanmıştır.
              </p>
            </>
          ),
        },
        {
          baslik: "Topladığımız Veriler",
          icerik: (
            <>
              <p><strong>Hesap oluştururken:</strong></p>
              <ul>
                <li>Ad soyad, e-posta adresi</li>
                <li>Şifre (bcrypt ile şifrelenmiş — düz metin olarak saklanmaz)</li>
                <li>Google ile girişte: profil fotoğrafı, Google hesap kimliği</li>
                <li>KVKK aydınlatma ve kullanım şartları kayıt tarihi</li>
              </ul>
              <p><strong>Platform kullanımı sırasında:</strong></p>
              <ul>
                <li>Oluşturulan davetiyeler ve içerikleri</li>
                <li>Şablon tercihleri, renk ve font seçimleri</li>
                <li>Müzik tercihleri ve isteğe bağlı şarkı önerileri</li>
                <li>Davetiye görüntülenme sayısı</li>
                <li>Masa planı ve misafir listesi</li>
              </ul>
              <p><strong>RSVP (katılım bildirimi) formlarından:</strong></p>
              <ul>
                <li>Misafirin adı (zorunlu)</li>
                <li>E-posta ve telefon (isteğe bağlı)</li>
                <li>Katılım durumu ve kişi sayısı</li>
                <li>Misafir notu (isteğe bağlı)</li>
                <li>Diyet tercihi ve şarkı önerisi (isteğe bağlı)</li>
              </ul>
              <p><strong>Albüm ve anı özelliklerinden:</strong></p>
              <ul>
                <li>Fotoğraf yükleyen kişinin adı ve yüklediği fotoğraf</li>
                <li>Anı defteri yazarı ve mesaj içeriği</li>
                <li>Sesli anı bırakan kişinin adı, ses kaydı ve kayıt süresi</li>
              </ul>
              <p><strong>Teknik olarak otomatik toplanan:</strong></p>
              <ul>
                <li>IP adresi (güvenlik, oran sınırlama ve ödeme güvenliği amacıyla)</li>
                <li>Oturum çerezleri (JWT)</li>
                <li>Tarayıcı türü (hata ayıklama için)</li>
              </ul>
            </>
          ),
        },
        {
          baslik: "Verileri Nasıl Kullanıyoruz",
          icerik: (
            <ul>
              <li><strong>Hizmet sunumu:</strong> Davetiye oluşturma, düzenleme ve paylaşım özelliklerini çalıştırmak</li>
              <li><strong>RSVP iletimi:</strong> Misafirlerin katılım bildirimlerini davet sahibine iletmek</li>
              <li><strong>Albüm ve anı yönetimi:</strong> Fotoğraf, yazılı anı ve sesli anıları davet sahibi onayı sonrası davetiye sayfasında göstermek</li>
              <li><strong>Şarkı önerileri:</strong> RSVP üzerinden iletilen müzik dileklerini davet sahibine göstermek</li>
              <li><strong>Kimlik doğrulama:</strong> Hesabınıza güvenli erişim sağlamak</li>
              <li><strong>Ödeme:</strong> Davetiye ve ek özellik ödemelerini gerçekleştirmek</li>
              <li><strong>Güvenlik:</strong> Yetkisiz erişim ve sahteciliği engellemek</li>
              <li><strong>İyileştirme:</strong> Anonim kullanım istatistikleri ile platformu geliştirmek</li>
            </ul>
          ),
        },
        {
          baslik: "Üçüncü Taraf Hizmetler",
          icerik: (
            <>
              <p>
                Platformun çalışması için aşağıdaki güvenilir üçüncü taraf hizmetlerden
                yararlanıyoruz. Bu sağlayıcıların veri işleme koşulları ve sözleşmesel güvenceleri
                hizmetin niteliğine göre değerlendirilir:
              </p>
              <ul>
                <li>
                  <strong>Google LLC</strong> — OAuth ile kimlik doğrulama.
                  Google'ın gizlilik politikası: policies.google.com/privacy
                </li>
                <li>
                  <strong>İyzico Ödeme Hizmetleri A.Ş.</strong> — Ödeme altyapısı.
                  Kart bilgileriniz yalnızca iyzico altyapısında işlenir, tarafımızca saklanmaz.
                  Ödeme işlemi için aktarılabilecek alıcı/fatura bilgileri:{" "}
                  {ODEME_ALICI_VERILERI.join(", ")}.
                </li>
                <li>
                  <strong>Resend Inc.</strong> — İşlemsel e-posta (şifre sıfırlama ve bildirimler).
                  Veriler yurt dışında işlenebilir.
                </li>
                <li>
                  <strong>Supabase Inc.</strong> — PostgreSQL veritabanı ve seçilen barındırma bölgesi.
                </li>
                <li>
                  <strong>Vercel Inc.</strong> — Uygulama ve yüklenen medya dosyalarının barındırılması.
                  Dosyalar sağlayıcının altyapısında yurt dışında işlenebilir.
                </li>
              </ul>
              <p>
                Yurt dışı aktarım gerektiren hizmetlerde KVKK m.9 kapsamındaki güncel aktarım şartları,
                uygun güvenceler, sağlayıcı sözleşmeleri, alt işleyenler, barındırma bölgeleri ve bildirim
                yükümlülükleri düzenli olarak değerlendirilir.
              </p>
              <p>
                Kişisel verileriniz bu hizmetler dışında hiçbir üçüncü tarafla ticari amaçla
                paylaşılmaz, satılmaz veya kiralanmaz.
              </p>
            </>
          ),
        },
        {
          baslik: "Veri Güvenliği",
          icerik: (
            <ul>
              <li>Tüm şifreler <strong>bcrypt</strong> algoritması ile güvenli şekilde saklanır (düz metin tutulmaz)</li>
              <li>Platform HTTPS/TLS ile şifreli iletişim kullanır</li>
              <li>Oturum bilgileri imzalı JWT token ile yönetilir</li>
              <li>Veritabanı erişimleri yetkilendirme ve sağlayıcı güvenlik kontrolleriyle sınırlandırılır</li>
              <li>Ödeme bilgileri tarafımızca saklanmaz; PCI DSS uyumlu iyzico altyapısı kullanılır</li>
              <li>Veri ihlali durumunda KVKK m.12/5 ve Kurul kararları uyarınca, ihlalin öğrenilmesinden itibaren mevzuata uygun şekilde ve gerekli hallerde en geç 72 saat içinde Kurul'a bildirim yapılır</li>
            </ul>
          ),
        },
        {
          baslik: "Çerezler",
          icerik: (
            <>
              <p>
                Platformumuz yalnızca hizmetin işleyişi için <strong>zorunlu çerezler</strong> kullanmaktadır.
                Analitik, reklamcılık veya izleme çerezleri kullanılmamaktadır.
              </p>
              <ul>
                <li><strong>next-auth.session-token</strong> veya <strong>__Secure-next-auth.session-token:</strong> Oturumunuzu açık tutmak için (30 gün, HttpOnly)</li>
                <li><strong>next-auth.csrf-token</strong> veya <strong>__Host-next-auth.csrf-token:</strong> Güvenlik doğrulaması için (oturum süresi)</li>
                <li><strong>cerez-bilgi-goruldu:</strong> Çerez bilgilendirme bandının kapatıldığını hatırlamak için (tarayıcı yerel depolama)</li>
              </ul>
              <p>
                Zorunlu çerezler tarayıcı ayarlarından engellenemez; engellendiğinde platform
                düzgün çalışmayabilir.
              </p>
            </>
          ),
        },
        {
          baslik: "Çocukların Gizliliği",
          icerik: (
            <p>
              Hizmetlerimiz <strong>18 yaş altı</strong> bireylere yönelik değildir. 18 yaşından
              küçük bir kullanıcının verilerinin sistemimizde bulunduğunu fark edersek, ilgili
              veriler derhal silinir. Ebeveyn veya vasiler bu konuda{" "}
              <a href="mailto:kvkk@bekleriz.com">kvkk@bekleriz.com</a> adresine başvurabilir.
            </p>
          ),
        },
        {
          baslik: "Haklarınız",
          icerik: (
            <>
              <p>
                KVKK m.11 ve geçerli diğer mevzuat kapsamında; verilerinize erişim, düzeltme,
                silme, taşınabilirlik ve itiraz haklarına sahipsiniz.
              </p>
              <p>
                Talepleriniz için <a href="mailto:kvkk@bekleriz.com">kvkk@bekleriz.com</a> adresine
                yazabilirsiniz. Ayrıca hesabınızı <strong>Dashboard → Ayarlar</strong> sayfasından
                silebilirsiniz.
              </p>
              <p>
                Detaylı bilgi için <a href="/kvkk">KVKK Aydınlatma Metni</a>'ni inceleyiniz.
              </p>
            </>
          ),
        },
        {
          baslik: "Politika Güncellemeleri",
          icerik: (
            <p>
              Bu politika zaman zaman güncellenebilir. Önemli değişiklikler bu sayfada yayımlanır;
              gerekli görüldüğünde kayıtlı e-posta adresiniz veya platform içi uygun kanallar
              üzerinden ayrıca bilgilendirme yapılabilir. Güncel politikaya her zaman bu sayfadan ulaşabilirsiniz.
              Politikanın son güncelleme tarihi sayfanın başında belirtilmektedir.
            </p>
          ),
        },
      ]}
    />
  );
}

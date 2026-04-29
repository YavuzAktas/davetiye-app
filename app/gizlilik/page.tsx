import YasalSayfa from "@/components/YasalSayfa";

export const metadata = {
  title: "Gizlilik Politikası",
  description: "Davetim platformu gizlilik politikası ve kişisel veri işleme ilkeleri.",
};

export default function GizlilikSayfasi() {
  return (
    <YasalSayfa
      etiket="Yasal"
      baslik="Gizlilik Politikası"
      sonGuncelleme="29 Nisan 2026"
      bolumler={[
        {
          baslik: "Genel Bakış",
          icerik: (
            <>
              <p>
                <strong>Davetim</strong> olarak gizliliğinize saygı duyuyor ve kişisel verilerinizi
                korumayı öncelikli yükümlülüklerimizden biri olarak kabul ediyoruz. Bu Gizlilik
                Politikası; hangi verileri topladığımızı, neden topladığımızı ve bu verileri nasıl
                kullandığımızı açıklamaktadır.
              </p>
              <p>
                Bu politika, <strong>6698 sayılı KVKK</strong>, <strong>AB GDPR</strong> (yurt
                dışındaki kullanıcılar için) ve diğer ilgili mevzuat çerçevesinde hazırlanmıştır.
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
                <li>KVKK/kullanım şartları onay tarihi</li>
              </ul>
              <p><strong>Platform kullanımı sırasında:</strong></p>
              <ul>
                <li>Oluşturulan davetiyeler ve içerikleri</li>
                <li>Şablon tercihleri, renk ve font seçimleri</li>
                <li>Müzik tercihleri</li>
                <li>Davetiye görüntülenme sayısı</li>
              </ul>
              <p><strong>RSVP (katılım bildirimi) formlarından:</strong></p>
              <ul>
                <li>Misafirin adı (zorunlu)</li>
                <li>E-posta ve telefon (isteğe bağlı)</li>
                <li>Katılım durumu ve kişi sayısı</li>
                <li>Misafir notu (isteğe bağlı)</li>
              </ul>
              <p><strong>Teknik olarak otomatik toplanan:</strong></p>
              <ul>
                <li>IP adresi (güvenlik amaçlı, loglanmaz)</li>
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
              <li><strong>RSVP iletimi:</strong> Misafirlerin katılım bildirimlerini davet sahibine e-posta ile iletmek</li>
              <li><strong>Kimlik doğrulama:</strong> Hesabınıza güvenli erişim sağlamak</li>
              <li><strong>Ödeme:</strong> Plan yükseltme işlemlerini gerçekleştirmek</li>
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
                yararlanıyoruz. Bu hizmetlerle veri işleme anlaşmaları (DPA) imzalanmıştır:
              </p>
              <ul>
                <li>
                  <strong>Google LLC</strong> — OAuth ile kimlik doğrulama.
                  Google'ın gizlilik politikası: policies.google.com/privacy
                </li>
                <li>
                  <strong>İyzico Ödeme Hizmetleri A.Ş.</strong> — Ödeme altyapısı.
                  Kart bilgileriniz yalnızca iyzico altyapısında işlenir, tarafımızca saklanmaz.
                </li>
                <li>
                  <strong>Resend Inc.</strong> — İşlemsel e-posta (RSVP bildirimleri).
                  Veriler ABD'de Standart Sözleşme Maddeleri güvencesiyle işlenir.
                </li>
                <li>
                  <strong>Supabase Inc.</strong> — PostgreSQL veritabanı (AB bölgesi, AWS eu-west-1).
                </li>
                <li>
                  <strong>Vercel Inc.</strong> — Uygulama barındırma.
                  Veriler ABD'de Standart Sözleşme Maddeleri güvencesiyle işlenir.
                </li>
              </ul>
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
              <li>Platform HTTPS (TLS 1.3) ile şifreli iletişim kullanır</li>
              <li>Oturum bilgileri imzalı JWT token ile yönetilir</li>
              <li>Veritabanı erişimi kısıtlı ve güvenlik duvarı arkasındadır</li>
              <li>Ödeme bilgileri tarafımızca saklanmaz; PCI DSS uyumlu iyzico altyapısı kullanılır</li>
              <li>Veri ihlali durumunda KVKK m.12/5 gereği 72 saat içinde Kurul'a bildirim yapılır</li>
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
                <li><strong>next-auth.session-token:</strong> Oturumunuzu açık tutmak için (30 gün, HttpOnly)</li>
                <li><strong>next-auth.csrf-token:</strong> Güvenlik doğrulaması için (oturum süresi)</li>
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
              <a href="mailto:kvkk@davetim.com">kvkk@davetim.com</a> adresine başvurabilir.
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
                Talepleriniz için <a href="mailto:kvkk@davetim.com">kvkk@davetim.com</a> adresine
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
              Bu politika zaman zaman güncellenebilir. Önemli değişikliklerde kayıtlı e-posta
              adresinize bildirim gönderilir. Güncel politikaya her zaman bu sayfadan ulaşabilirsiniz.
              Politikanın son güncelleme tarihi sayfanın başında belirtilmektedir.
            </p>
          ),
        },
      ]}
    />
  );
}

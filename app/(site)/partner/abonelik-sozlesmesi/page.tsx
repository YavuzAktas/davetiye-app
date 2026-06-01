import type { Metadata } from "next";
import YasalSayfa from "@/components/YasalSayfa";
import { PARTNER_PAKET_LISTESI } from "@/lib/partner-paketler";
import { YASAL_BILGILER, YASAL_SON_GUNCELLEME } from "@/lib/yasal-bilgiler";

export const metadata: Metadata = {
  title: "Partner Abonelik Sözleşmesi | Bekleriz",
  description: "Bekleriz partner aboneliği otomatik yenileme, paket kullanımı ve iptal koşulları.",
  robots: { index: false },
};

function tl(tutar: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(tutar);
}

export default function PartnerAbonelikSozlesmesiPage() {
  return (
    <YasalSayfa
      etiket="Partner"
      baslik="Partner Abonelik Sözleşmesi"
      sonGuncelleme={YASAL_SON_GUNCELLEME}
      bolumler={[
        {
          baslik: "Taraflar",
          icerik: (
            <p>
              Bu sözleşme, <strong>{YASAL_BILGILER.unvan}</strong> ("Bekleriz" veya
              "Platform") ile partner panelinde seçtiği abonelik paketini satın alan gerçek veya
              tüzel kişi ("Partner") arasında elektronik ortamda kurulur.
            </p>
          ),
        },
        {
          baslik: "Konu",
          icerik: (
            <p>
              Sözleşmenin konusu; Partnerin aylık abonelik paketi kapsamında aktivasyon hakkı,
              partner paneli, marka/ekip araçları ve ticari iş akışı özelliklerinden yararlanmasına
              ilişkin koşulların belirlenmesidir.
            </p>
          ),
        },
        {
          baslik: "Paket ve Ücret",
          icerik: (
            <table>
              <tbody>
                {PARTNER_PAKET_LISTESI.map((paket) => (
                  <tr key={paket.id}>
                    <th>{paket.ad}</th>
                    <td>
                      Aylık {tl(paket.aylikTutar)}; aylık {paket.hakSayisi} aktivasyon hakkı.
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>Geçerli ücret</th>
                  <td>Partnerin ödeme ekranında seçtiği paket ve o anda gösterilen toplam tutar esas alınır.</td>
                </tr>
              </tbody>
            </table>
          ),
        },
        {
          baslik: "Aboneliğin Başlaması ve Yenilenmesi",
          icerik: (
            <ul>
              <li>Abonelik, ödemenin başarılı tamamlanmasıyla başlar.</li>
              <li>Paket hakları aylık dönem için tanımlanır ve kullanılmayan haklar sonraki döneme devretmez.</li>
              <li>Partner, ödeme ekranında açık onay verdiğinde paket aylık otomatik yenilenen abonelik olarak çalışır.</li>
              <li>Otomatik yenilemede, yeni dönem bedeli kayıtlı karttan iyzico altyapısı üzerinden tahsil edilir.</li>
              <li>Kart bilgileri Platform tarafından saklanmaz; kart saklama ve tahsilat altyapısı ödeme sağlayıcı tarafından yürütülür.</li>
            </ul>
          ),
        },
        {
          baslik: "İptal ve Paket Değişikliği",
          icerik: (
            <ul>
              <li>Partner, panel üzerinden otomatik yenilemeyi istediği zaman kapatabilir.</li>
              <li>İptal, mevcut ücretli dönemin sonuna kadar hizmet kullanımını etkilemez.</li>
              <li>İptal sonrası yeni dönem için otomatik tahsilat yapılmaz.</li>
              <li>Paket yükseltme, düşürme veya kart güncelleme işlemleri panelde sunulan seçeneklere göre yapılır.</li>
            </ul>
          ),
        },
        {
          baslik: "Partnerin Veri Erişim Sınırı",
          icerik: (
            <>
              <p>
                Partner, kendi müşterisine aktivasyon hakkı sağlayabilir; ancak müşterinin davetiye
                içeriğine ve davetli verilerine erişemez.
              </p>
              <ul>
                <li>Davetli listesi, RSVP yanıtları, check-in kayıtları ve medya içerikleri Partner tarafından görüntülenemez.</li>
                <li>Müşteri, KVKK aydınlatma metni, gizlilik politikası ve kullanım şartlarını kendi hesabıyla kabul eder.</li>
                <li>Partner, müşteri adına yasal onay veremez ve platform adına taahhütte bulunamaz.</li>
              </ul>
            </>
          ),
        },
        {
          baslik: "Ticari İletişim ve KVKK",
          icerik: (
            <p>
              Partner, kendi müşteri ilişkilerinde KVKK, ticari elektronik ileti ve ilgili mevzuata
              uygun hareket etmekle yükümlüdür. Platform üzerinden elde edilmeyen veya müşterinin
              kendi hesabında bulunan kişisel veriler Partner ile paylaşılmaz.
            </p>
          ),
        },
        {
          baslik: "Cayma ve İade",
          icerik: (
            <>
              <p>
                Partner aboneliği esasen ticari/mesleki kullanıma yönelik dijital hizmettir. Partnerin
                tüketici sıfatıyla hareket ettiği hallerde emredici tüketici mevzuatından doğan hakları
                saklıdır.
              </p>
              <p>
                Hizmetin ödeme sonrası hemen başlaması talep edildiğinde dijital hizmet ifasına başlanır.
                Mükerrer tahsilat, teknik hata veya hiç kullanılamayan hizmet durumları destek kanalı
                üzerinden ayrıca incelenir.
              </p>
            </>
          ),
        },
        {
          baslik: "Yürürlük ve Uyuşmazlık",
          icerik: (
            <p>
              Partner, ödeme ekranındaki onay kutusunu işaretleyerek işbu sözleşmeyi elektronik
              ortamda kabul eder. Sözleşme Türk hukukuna tabidir. Tüketici mevzuatından doğan zorunlu
              hak ve başvuru yolları saklıdır.
            </p>
          ),
        },
      ]}
    />
  );
}

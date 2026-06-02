import type { Metadata } from "next";
import YasalSayfa from "@/components/YasalSayfa";
import { PARTNER_PAKET_LISTESI } from "@/lib/partner-paketler";
import { YASAL_BILGILER, YASAL_SON_GUNCELLEME } from "@/lib/yasal-bilgiler";

export const metadata: Metadata = {
  title: "Partner Abonelik Ön Bilgilendirme | DavetRota",
  description: "DavetRota partner abonelik paketleri için ödeme öncesi bilgilendirme.",
  robots: { index: false },
};

function tl(tutar: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(tutar);
}

export default function PartnerOnBilgilendirmePage() {
  return (
    <YasalSayfa
      etiket="Partner"
      baslik="Partner Abonelik Ön Bilgilendirme"
      sonGuncelleme={YASAL_SON_GUNCELLEME}
      bolumler={[
        {
          baslik: "Sağlayıcı Bilgileri",
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
          baslik: "Hizmetin Kapsamı",
          icerik: (
            <>
              <p>
                Partner aboneliği; düğün salonu, davet evi, organizasyon firması ve benzeri
                işletmelerin kendi müşterilerine DavetRota üzerinden dijital davetiye aktivasyon
                hakkı sunabilmesi için hazırlanan aylık dijital hizmet paketidir.
              </p>
              <ul>
                <li>Partner panelinden aktivasyon linki oluşturma ve müşteriye iletme.</li>
                <li>Paket kapsamındaki aylık aktivasyon hakkını takip etme.</li>
                <li>Müşteri kazanım ve teklif süreçlerini kendi panelinde yönetme.</li>
                <li>Marka, ekip erişimi ve partner iş akışı araçlarını kullanma.</li>
              </ul>
              <p>
                Partner, müşterinin davetli listesi, RSVP yanıtları, medya içerikleri, check-in
                kayıtları veya ödeme bilgilerine erişemez. Müşteri, kendi hesabı üzerinden yasal
                metinleri ayrıca kabul eder.
              </p>
            </>
          ),
        },
        {
          baslik: "Paketler, Fiyat ve Ödeme Dönemi",
          icerik: (
            <table>
              <tbody>
                {PARTNER_PAKET_LISTESI.map((paket) => (
                  <tr key={paket.id}>
                    <th>{paket.ad}</th>
                    <td>
                      Aylık {tl(paket.aylikTutar)}, {paket.hakSayisi} aktivasyon hakkı.
                      {" "}{paket.aciklama}
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>Vergiler ve toplam tutar</th>
                  <td>Ödeme ekranında seçilen pakete göre gösterilen toplam tutar geçerlidir.</td>
                </tr>
                <tr>
                  <th>Ödeme altyapısı</th>
                  <td>Ödemeler iyzico altyapısı üzerinden işlenir. Kart bilgileri DavetRota tarafından saklanmaz.</td>
                </tr>
              </tbody>
            </table>
          ),
        },
        {
          baslik: "Otomatik Yenileme",
          icerik: (
            <>
              <p>
                Partner paketi, ödeme ekranındaki onayın verilmesi halinde aylık otomatik yenilenen
                abonelik olarak başlatılır. Seçilen paketin aylık bedeli, abonelik dönemi sonunda
                kayıtlı karttan tekrar tahsil edilir.
              </p>
              <p>
                Partner, otomatik yenilemeyi panel üzerinden istediği zaman kapatabilir. İptal işlemi
                mevcut ücretli dönemin sonuna kadar hizmet kullanımını etkilemez; yeni dönem için
                tahsilat yapılmasını durdurur.
              </p>
            </>
          ),
        },
        {
          baslik: "Teslimat ve İfa",
          icerik: (
            <p>
              Partner aboneliği dijital hizmettir. Ödeme başarıyla tamamlandıktan sonra partner
              panelinde paket hakları tanımlanır ve fiziksel teslimat yapılmaz.
            </p>
          ),
        },
        {
          baslik: "Cayma, İptal ve İade",
          icerik: (
            <>
              <p>
                Partner aboneliği ticari/mesleki kullanım amacıyla sunulur. Partnerin tüketici
                sıfatıyla hareket ettiği durumlarda emredici tüketici mevzuatından doğan hakları
                saklıdır.
              </p>
              <p>
                Dijital hizmetin ödeme sonrası hemen başlamasını talep ettiğinizde, hizmet ifasına
                başlanmış olur. Kullanılmamış dönem, teknik hata veya mükerrer tahsilat gibi iade
                talepleri destek kanalı üzerinden ayrıca değerlendirilir.
              </p>
            </>
          ),
        },
        {
          baslik: "Şikayet ve Uyuşmazlık",
          icerik: (
            <>
              <p>
                Destek, iptal ve iade talepleri için{" "}
                <a href={`mailto:${YASAL_BILGILER.destekEposta}`}>{YASAL_BILGILER.destekEposta}</a>{" "}
                adresinden iletişime geçebilirsiniz.
              </p>
              <p>
                Ticari uyuşmazlıklarda Türk hukuku uygulanır. Tüketici sıfatıyla yapılan işlemlerde
                tüketici mevzuatındaki zorunlu başvuru yolları saklıdır.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

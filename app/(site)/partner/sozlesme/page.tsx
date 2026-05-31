import type { Metadata } from "next";
import Link from "next/link";
import { YASAL_BILGILER } from "@/lib/yasal-bilgiler";

export const metadata: Metadata = {
  title: "Partner Sözleşmesi | Bekleriz",
  description: "Bekleriz partner programı sözleşmesi ve yasal koşullar.",
  robots: { index: false },
};

const TARIH = "31 Mayıs 2026";

export default function PartnerSozlesmePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        <div className="mb-10">
          <Link href="/partner" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Partner Programı
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">Partner Sözleşmesi</h1>
          <p className="text-sm text-gray-400">Son güncelleme: {TARIH}</p>
        </div>

        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-8">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Taraflar</h2>
            <p className="text-gray-600">
              Bu sözleşme; <strong>{YASAL_BILGILER.unvan}</strong> ("Platform") ile partner programına
              kabul edilen organizasyon firması veya bireysel organizatör ("Partner") arasında
              akdedilmiştir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Tanımlar</h2>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Aktivasyon Hakkı:</strong> Partnerin müşterisine ücretsiz davetiye oluşturma imkânı tanıyan tek kullanımlık dijital hak.</li>
              <li><strong>Müşteri:</strong> Aktivasyon linki aracılığıyla platforma kaydolan ve kendi davetiyesini oluşturan son kullanıcı.</li>
              <li><strong>Partner Paneli:</strong> Partnerin aktivasyon haklarını yönettiği, müşteri durumunu görüntülediği arayüz.</li>
              <li><strong>Davetli Verisi:</strong> Müşteri tarafından girilen ad, iletişim bilgisi, RSVP yanıtı ve benzeri kişisel veriler.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Partnerin Yetkileri</h2>
            <ul className="space-y-2 text-gray-600 list-disc pl-5">
              <li>Satın aldığı paket kapsamında aktivasyon linki oluşturmak ve müşterilerine iletmek.</li>
              <li>Partner panelinde şu bilgileri görüntülemek: aktivasyon kodu durumu (aktivasyon gönderildi / kayıt olundu / davetiye oluşturuldu / yayında), kullanılan ve kalan aktivasyon hakkı sayısı ve partnerin kişisel veri içermeden eklediği dahili kod etiketi.</li>
              <li>Paket yenilemek, üst pakete geçmek, kayıtlı ödeme kartını güncellemek veya otomatik yenilemeyi iptal etmek.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Partnerin Erişemeyeceği Veriler</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <p className="text-sm font-semibold text-red-800 mb-3">
                Partner aşağıdaki verilere hiçbir koşulda erişemez:
              </p>
              <ul className="space-y-1.5 text-sm text-red-700 list-disc pl-4">
                <li>Müşterinin davetli listesi (isimler, telefon numaraları, e-posta adresleri)</li>
                <li>RSVP yanıtları ve katılım bilgileri</li>
                <li>Fotoğraf albümü, anı defteri, sesli anı içerikleri</li>
                <li>Check-in kayıtları ve kişisel davetli linkleri</li>
                <li>Müşterinin ödeme bilgileri</li>
              </ul>
            </div>
            <p className="text-gray-600 mt-3 text-xs">
              Bu kısıtlama teknik seviyede uygulanmaktadır; yani Partner panelinin API katmanı bu
              verilere erişimi yapısal olarak engellemektedir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. KVKK ve Yasal Sorumluluk</h2>
            <ul className="space-y-2 text-gray-600 list-disc pl-5">
              <li>
                Müşteri, platforma kayıt olurken ve davetiyesini oluştururken KVKK aydınlatma metnini,
                gizlilik politikasını ve kullanım şartlarını <strong>kendi adına</strong> onaylar.
              </li>
              <li>
                Partner, müşteri adına herhangi bir yasal onay veremez ve veremeyecektir.
              </li>
              <li>
                Partner, müşterinin davetli verilerini üçüncü kişilerle paylaşmaz, bu verileri ticari
                amaçla kullanamaz.
              </li>
              <li>
                Partner, müşterileri platforma yönlendirirken "dijital davetiye hakkı sağlıyorum"
                sınırında kalır; platform adına taahhüt veremez.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Ticari İletişim Yasağı</h2>
            <p className="text-gray-600">
              Partner, platform altyapısını kullanarak müşterilerine veya müşteri davetlilerine ticari
              elektronik ileti (reklam, tanıtım, kampanya mesajı vb.) gönderemez. Bu tür iletişimler
              için İleti Yönetim Sistemi (İYS) kapsamında gerekli onayların Partner tarafından
              bağımsız olarak alınması zorunludur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Paket Kullanım Koşulları</h2>
            <ul className="space-y-2 text-gray-600 list-disc pl-5">
              <li>Aktivasyon hakları aylık dönemde tanımlanır ve ertesi aya devretmez.</li>
              <li>Kullanılmayan haklar iade edilmez.</li>
              <li>Aktivasyon linki müşteri tarafından bir kez kullanılabilir; bir kez kullanıldıktan sonra geçersiz hale gelir.</li>
              <li>Paket ücreti aylık peşin olarak tahsil edilir.</li>
              <li>Partner paketi, ödeme ekranında açıkça onay verilmesi halinde aylık otomatik yenilenen abonelik olarak başlatılır.</li>
              <li>Otomatik yenileme aktifse ilgili aylık paket bedeli bir sonraki dönem başında kayıtlı karttan tahsil edilir.</li>
              <li>Partner, panel üzerinden otomatik yenilemeyi istediği zaman kapatabilir; iptal mevcut ücretli dönemin sonuna kadar hizmet kullanımını etkilemez.</li>
              <li>Kart güncelleme işlemi iyzico güvenli ödeme altyapısı üzerinden yürütülür; kart bilgileri Platform tarafından saklanmaz.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Fesih</h2>
            <p className="text-gray-600">
              Her iki taraf da 30 gün önceden yazılı bildirimde bulunarak sözleşmeyi feshedebilir.
              Fesih durumunda kullanılmamış aktivasyon hakları için iade yapılmaz. Platform, sözleşme
              ihlali halinde partnerin hesabını derhal askıya alabilir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Uygulanacak Hukuk</h2>
            <p className="text-gray-600">
              Bu sözleşme Türk hukukuna tabidir. Uyuşmazlıklarda yetkili mahkemeler ve icra daireleri
              geçerlidir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. İletişim</h2>
            <p className="text-gray-600">
              Partner sözleşmesine ilişkin sorularınız için:{" "}
              <a href={`mailto:${YASAL_BILGILER.hukukEposta}`} className="text-purple-600 hover:underline">
                {YASAL_BILGILER.hukukEposta}
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <Link href="/partner" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Partner Programı
          </Link>
          <Link
            href="/partner/basvuru"
            className="bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity text-sm"
          >
            Partner Başvurusu Yap
          </Link>
        </div>

      </div>
    </div>
  );
}

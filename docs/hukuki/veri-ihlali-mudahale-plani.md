# Veri İhlali Müdahale Planı

Son güncelleme: 13 Mayıs 2026

Bu plan, DavetRota platformunda kişisel veri güvenliği ihlali şüphesi veya doğrulanmış ihlal durumunda izlenecek iç prosedürü tanımlar. Hukuki görüş yerine geçmez; gerçek olaylarda hukuk/uyum danışmanı ve teknik ekip birlikte hareket etmelidir.

## Resmi Dayanak

- KVKK m.12/5 uyarınca kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesi halinde ilgili kişilere ve Kurula bildirim yapılır.
- Kişisel Verileri Koruma Kurulunun 24.01.2019 tarihli ve 2019/10 sayılı kararı uyarınca “en kısa sürede” ifadesi 72 saat olarak yorumlanır.
- 72 saat içinde Kurula bildirim yapılamazsa gecikme nedeni bildirimle birlikte açıklanmalıdır.
- Etkilenen kişiler belirlendikten sonra ilgili kişilere makul olan en kısa süre içinde doğrudan veya uygun başka yöntemlerle bildirim yapılmalıdır.

Kaynak:

- https://www.kvkk.gov.tr/Icerik/5362/Veri-Ihlali-Bildirimi

## İhlal Sayılabilecek Olaylar

- Veritabanı, Vercel Blob, Supabase, e-posta veya ödeme entegrasyonunda yetkisiz erişim.
- Kullanıcı, davetiye, RSVP, davetli listesi, medya, ödeme alıcı/fatura bilgisi veya Spotify token verilerinin yetkisiz kişilere açılması.
- Yanlış kullanıcıya veri gösterilmesi, dışa aktarma dosyasının yanlış kişiye verilmesi veya erişim kontrolü hatası.
- Kayıp/çalınmış erişim anahtarı, API secret, OAuth token veya üretim ortamı credential sızıntısı.
- Üçüncü taraf sağlayıcıdan veri ihlali bildirimi alınması.

## İlk 72 Saat Akışı

| Süre | Aksiyon | Sorumlu |
| --- | --- | --- |
| 0-3 saat | Olayı kaydet, ilk kanıtları koru, erişim anahtarlarını dondur veya döndür, aktif sızıntıyı durdur | Teknik sorumlu |
| 3-12 saat | Etkilenen sistemleri, veri kategorilerini, kişi sayısını ve olası sonuçları tespit et | Teknik + hukuk/uyum |
| 12-24 saat | İhlal olup olmadığına karar ver, alınan/acil alınacak tedbirleri yazılı hale getir | Kurucu/sorumlu + hukuk |
| 24-72 saat | Gerekliyse Kurula veri ihlali bildirimi yap, ilgili kişi bildirim stratejisini hazırla | Hukuk/uyum |
| 72 saat sonrası | Kök neden analizi, kalıcı düzeltmeler, ilgili kişi bildirimi ve kapanış raporu | Teknik + hukuk/uyum |

## Olay Kaydı Şablonu

Her şüpheli olay için aşağıdaki bilgiler ayrı bir dosya veya güvenli iç kayıt sisteminde tutulur:

- Olay numarası
- İlk fark edilme tarihi ve saati
- İhlalin öğrenildiği tarih ve saat
- Bildirimi yapan kişi/kanal
- Etkilenen sistemler
- Etkilenen veri kategorileri
- Tahmini etkilenen kişi ve kayıt sayısı
- İhlalin nasıl gerçekleştiği
- Alınan ilk teknik önlemler
- Kullanıcılar üzerindeki olası etkiler
- Kurula bildirim gerekip gerekmediği
- Kurula bildirim tarihi/saati veya bildirim yapılmama gerekçesi
- İlgili kişilere bildirim tarihi/kanalı veya bildirim yapılmama gerekçesi
- Kapanış tarihi ve kalıcı önlemler

## Kurula Bildirim İçeriği İçin Kontrol

Bildirim hazırlığında en az şu başlıklar tamamlanır:

- İhlalin niteliği ve zaman çizelgesi
- Etkilenen kişisel veri kategorileri
- Etkilenen kişi/kayıt sayısı veya makul tahmin
- İhlalin muhtemel sonuçları
- Alınan ve alınması planlanan teknik/idari tedbirler
- İrtibat kişisi ve iletişim bilgisi
- 72 saatten geç bildirim varsa gecikme gerekçesi

## İlgili Kişi Bildirimi

Etkilenen kişiler belirlendikten sonra bildirimde sade ve anlaşılır bir dil kullanılır:

- Ne olduğu
- Hangi verilerin etkilenmiş olabileceği
- Kullanıcının alması gereken önlemler
- DavetRota tarafından alınan önlemler
- İletişim kanalı

İletişim adresi bilinen kullanıcılara doğrudan e-posta tercih edilir. Doğrudan iletişim mümkün değilse web sitesi veya platform içi uygun bir yöntem değerlendirilir.

## Teknik İlk Müdahale Kontrolleri

- Şüpheli erişim anahtarlarını ve API tokenlarını döndür.
- Vercel, Supabase, Resend, Google, Spotify ve iyzico panellerindeki audit/log kayıtlarını indir veya koru.
- Etkilenen endpoint, bucket, tablo veya entegrasyonu izole et.
- Gerekirse geçici olarak dosya yükleme, ödeme, dışa aktarma veya entegrasyon özelliklerini kapat.
- Logları silme; kanıt bütünlüğünü koru.
- Düzeltme sonrası aynı senaryo için regression testi yap.

## Kapanış

Olay kapatılmadan önce:

- Kök neden yazıldı.
- Kalıcı düzeltme deploy edildi.
- Gerekli bildirimler tamamlandı veya yapılmama gerekçesi dosyalandı.
- Etkilenen kişilerden gelen talepler için destek süreci açıldı.
- Benzer olayların tekrarını azaltacak teknik/idari önlem belirlendi.

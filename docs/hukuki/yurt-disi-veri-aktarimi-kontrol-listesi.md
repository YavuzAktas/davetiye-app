# Yurt Dışı Veri Aktarımı Kontrol Listesi

Son güncelleme: 12 Mayıs 2026

Bu doküman Bekleriz projesinde kullanılan üçüncü taraf sağlayıcılar için KVKK m.9 kapsamındaki yurt dışı kişisel veri aktarımı kontrollerini takip etmek amacıyla tutulur. Hukuki görüş yerine geçmez; sağlayıcı sözleşmeleri ve Kurum bildirimi hukuk/mali müşavirlik ile tamamlanmalıdır.

## Resmi Dayanak

- KVKK, yurt dışına kişisel veri aktarımında standart sözleşmeleri uygun güvence yöntemlerinden biri olarak kabul eder.
- KVKK duyurusuna göre standart sözleşmeler imzadan itibaren 5 iş günü içinde Kuruma bildirilmelidir.
- Standart sözleşmeler taraflarca yetkili kişilerle imzalanmalı, taraf/adres/irtibat bilgileri açık olmalı ve yabancı belgeler için gerekli apostil/noter onaylı Türkçe çeviri kontrolleri yapılmalıdır.

Kaynaklar:

- https://www.kvkk.gov.tr/Icerik/7929/Standart-Sozlesmeler
- https://www.kvkk.gov.tr/Icerik/8043/Standart-Sozlesme-Bildirim-Modulu-Hakkinda-Kamuoyu-Duyurusu
- https://www.kvkk.gov.tr/Icerik/8170/Yurt-Disina-Kisisel-Veri-Aktariminda-Kullanilacak-Standart-Sozlesmelerde-Dikkat-Edilmesi-Gereken-Hususlara-Iliskin-Kamuoyu-Duyurusu

## Sağlayıcı Envanteri

| Sağlayıcı | Kullanım amacı | Aktarılan veri örnekleri | Aktarım durumu | Tamamlanacak aksiyon |
| --- | --- | --- | --- | --- |
| Google LLC | OAuth kimlik doğrulama | E-posta, ad soyad, Google hesap kimliği, profil fotoğrafı | Yurt dışı aktarım riski var | Veri işleyen/sorumlu rolü ve aktarım dayanağı hukukça teyit edilmeli |
| Resend Inc. | İşlemsel e-posta | E-posta, şifre sıfırlama ve bildirim içeriği | Yurt dışı aktarım riski var | DPA/SCC veya KVKK standart sözleşme uygunluğu kontrol edilmeli |
| Supabase Inc. | PostgreSQL veritabanı | Kullanıcı, davetiye, RSVP, ödeme kayıtları | Bölgeye göre yurt dışı aktarım riski var | Seçili bölge, alt işleyenler ve aktarım dayanağı belgelenmeli |
| Vercel Inc. | Uygulama ve medya barındırma | Trafik logları, medya dosyaları, IP, teknik kayıtlar | Yurt dışı aktarım riski var | DPA/SCC, Blob saklama bölgesi ve alt işleyenler belgelenmeli |
| Spotify AB | İsteğe bağlı müzik entegrasyonu | Spotify kullanıcı/playlist bilgisi, şarkı önerileri, tokenlar | Yurt dışı aktarım riski var | Kullanıcı rızası ve sağlayıcı aktarım dayanağı teyit edilmeli |
| iyzico | Ödeme altyapısı | Alıcı/fatura bilgisi, IP, ödeme durumu; kart bilgisi Bekleriz'de saklanmaz | Sağlayıcı sözleşmesine bağlı | Üye işyeri sözleşmesi, saklama ve alt işleyen bilgileri dosyalanmalı |

## Uygulama Kontrolleri

- KVKK ve Gizlilik metinlerinde sağlayıcılar ve aktarım ihtimali açıkça belirtilir.
- Yeni üçüncü taraf servis eklenmeden önce bu tabloya eklenir.
- Yeni servis canlıya alınmadan önce DPA/SCC/KVKK standart sözleşme veya açık rıza dayanağı hukukça işaretlenir.
- Standart sözleşme imzalanırsa 5 iş günü içinde KVKK bildirim yükümlülüğü takip edilir.
- Sağlayıcı bölge/alt işleyen değişiklikleri en az her 6 ayda bir kontrol edilir.
- Yurt dışı aktarım dayanağı netleşmeyen servisler zorunlu değilse kapalı tutulur veya kullanıcıya açık tercih olarak sunulur.

## Durum Takibi

| Kontrol | Durum | Not |
| --- | --- | --- |
| Sağlayıcı envanteri çıkarıldı | Tamamlandı | Google, Resend, Supabase, Vercel, Spotify, iyzico listelendi |
| Kullanıcıya açık metinlerde aktarım ihtimali belirtildi | Tamamlandı | KVKK ve Gizlilik sayfalarında mevcut |
| DPA/SCC/KVKK standart sözleşme dosyaları toplandı | Beklemede | Sağlayıcı hesaplarından indirilmeli |
| KVKK standart sözleşme gerekip gerekmediği hukukça değerlendirildi | Beklemede | Her sağlayıcı için ayrı bakılmalı |
| Kuruma 5 iş günü içinde bildirim gerektiren sözleşmeler takip edildi | Beklemede | İmzadan sonra tarih/sorumlu eklenmeli |
| Alt işleyen ve bölge kontrolleri periyodik takvime alındı | Beklemede | En az 6 ayda bir |

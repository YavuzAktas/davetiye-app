import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const YASAL_BILGILER = {
  unvan: "DOLDURULACAK - DavetRota / Satıcı-Sağlayıcı Ticari Unvanı",
  adres: "DOLDURULACAK - Açık adres",
  telefon: "DOLDURULACAK - Telefon numarası",
  destekEposta: "destek@davetrota.com",
  whatsappDestek: "905XXXXXXXXX", // Gerçek numara ile değiştir (başında 90, boşluksuz)
  kvkkEposta: "kvkk@davetrota.com",
  hukukEposta: "hukuk@davetrota.com",
  mersisVergi: "DOLDURULACAK - MERSİS / vergi bilgisi",
  web: siteUrl,
  webKisa: new URL(siteUrl).host,
};

export const YASAL_METIN_SURUMU = "2026-05-31";
export const YASAL_SON_GUNCELLEME = "31 Mayıs 2026";

export const ODEME_ALICI_VERILERI = [
  "ad soyad",
  "e-posta adresi",
  "IP adresi",
  "şehir",
  "telefon numarası",
  "kurumsal fatura seçilirse alıcı/fatura adresi",
  "kurumsal fatura seçilirse vergi numarası veya TCKN",
  "seçilen davetiye/ek özellikler ve ödeme tutarı",
];

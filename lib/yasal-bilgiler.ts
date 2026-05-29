import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const YASAL_BILGILER = {
  unvan: "DOLDURULACAK - Bekleriz / Satıcı-Sağlayıcı Ticari Unvanı",
  adres: "DOLDURULACAK - Açık adres",
  telefon: "DOLDURULACAK - Telefon numarası",
  destekEposta: "destek@bekleriz.com",
  whatsappDestek: "905XXXXXXXXX", // Gerçek numara ile değiştir (başında 90, boşluksuz)
  kvkkEposta: "kvkk@bekleriz.com",
  hukukEposta: "hukuk@bekleriz.com",
  mersisVergi: "DOLDURULACAK - MERSİS / vergi bilgisi",
  web: siteUrl,
  webKisa: new URL(siteUrl).host,
};

export const YASAL_METIN_SURUMU = "2026-05-29";
export const YASAL_SON_GUNCELLEME = "29 Mayıs 2026";

export const ODEME_ALICI_VERILERI = [
  "ad soyad",
  "e-posta adresi",
  "IP adresi",
  "alıcı/fatura adresi",
  "şehir",
  "telefon numarası",
  "kimlik/vergi numarası",
  "seçilen davetiye/ek özellikler ve ödeme tutarı",
];

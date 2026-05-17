import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const YASAL_BILGILER = {
  unvan: "DOLDURULACAK - Bekleriz / Satıcı-Sağlayıcı Ticari Unvanı",
  adres: "DOLDURULACAK - Açık adres",
  telefon: "DOLDURULACAK - Telefon numarası",
  destekEposta: "destek@bekleriz.com",
  kvkkEposta: "kvkk@bekleriz.com",
  hukukEposta: "hukuk@bekleriz.com",
  mersisVergi: "DOLDURULACAK - MERSİS / vergi bilgisi",
  web: siteUrl,
  webKisa: new URL(siteUrl).host,
};

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

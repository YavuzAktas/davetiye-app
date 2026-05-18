export const SABLON_REGISTRY: Record<string, string> = {
  // Vintage Nişan
  "vintage-nisan": "vintage-nisan",

  // Lüks Nişan
  "nisan-luks": "nisan-luks",

  // Lüks Düğün
  "dugun-luks": "dugun-luks",

  // Lüks Doğum Günü
  "dogumgunu-luks": "dogumgunu-luks",

  // Düğün şablonları
  "klasik-dugun": "klasik",
  "romantik-dugun": "klasik",
  "altin-dugun": "klasik",
  "modern-dugun": "klasik",
  "bahar-dugun": "klasik",
  "mavi-dugun": "klasik",
  "gul-dugun": "klasik",

  // Nişan şablonları
  "modern-nisan": "klasik",
  "romantik-nisan": "klasik",
  "altin-nisan": "klasik",
  "mor-nisan": "klasik",

  // Doğum günü şablonları
  "eglenceli-dogumgunu": "klasik",
  "sade-dogumgunu": "klasik",
  "cocuk-dogumgunu": "klasik",
  "pembe-dogumgunu": "klasik",
  "mavi-dogumgunu": "klasik",
  "altin-dogumgunu": "klasik",

  // Diğerleri
  "geleneksel-sunnet": "klasik",
  "modern-sunnet": "klasik",
  "altin-sunnet": "klasik",
  "yildiz-sunnet": "klasik",
  "geleneksel-kina": "klasik",
  "modern-kina": "klasik",
  "altin-kina": "klasik",
  "kurumsal-toplanti": "klasik",
  "kurumsal-etkinlik": "klasik",
  "kurumsal-kutlama": "klasik",
  "mezuniyet": "klasik",
  "yildonumu": "klasik",
  "bebek-partisi": "klasik",
};

export function getSablonTipi(sablonId: string): string {
  return SABLON_REGISTRY[sablonId] ?? "klasik";
}

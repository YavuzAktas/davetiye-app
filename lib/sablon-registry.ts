export const SABLON_REGISTRY: Record<string, string> = {
  // Lüks Nişan
  "nisan-luks": "nisan-luks",

  // Düğün şablonları
  "klasik-dugun": "klasik",
  "romantik-dugun": "klasik",
  "altin-dugun": "klasik",
  "modern-dugun": "klasik",
  "bahar-dugun": "klasik",
  "mavi-dugun": "klasik",
  "gul-dugun": "klasik",

  // Nişan şablonları
  "modern-nisan": "nisan-luks",
  "romantik-nisan": "nisan-luks",
  "altin-nisan": "nisan-luks",
  "mor-nisan": "nisan-luks",

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
export type PlanTipi = "free" | "standart" | "premium";

export type PlanOzellikler = {
  maxDavetiye: number;
  maxDavetli: number;
  luksablonlar: boolean;
  qr: boolean;
  ozelRenkFont: boolean;
  muzik: boolean;
  oturmaPlan: boolean;
  album: boolean;
  analitik: boolean;
  sesliAni: boolean;
  canliDuvar: boolean;
};

export const PLAN_CONFIG: Record<PlanTipi, PlanOzellikler> = {
  free: {
    maxDavetiye:  1,
    maxDavetli:   50,
    luksablonlar: false,
    qr:           false,
    ozelRenkFont: false,
    muzik:        false,
    oturmaPlan:   false,
    album:        false,
    analitik:     false,
    sesliAni:     false,
    canliDuvar:   false,
  },
  standart: {
    maxDavetiye:  5,
    maxDavetli:   200,
    luksablonlar: true,
    qr:           true,
    ozelRenkFont: true,
    muzik:        true,
    oturmaPlan:   false,
    album:        false,
    analitik:     false,
    sesliAni:     false,
    canliDuvar:   false,
  },
  premium: {
    maxDavetiye:  Infinity,
    maxDavetli:   Infinity,
    luksablonlar: true,
    qr:           true,
    ozelRenkFont: true,
    muzik:        true,
    oturmaPlan:   true,
    album:        true,
    analitik:     true,
    sesliAni:     true,
    canliDuvar:   true,
  },
};

export function planLimit(plan: string): PlanOzellikler {
  return PLAN_CONFIG[plan as PlanTipi] ?? PLAN_CONFIG.free;
}

export function planOzellikVar(plan: string, ozellik: keyof PlanOzellikler): boolean {
  const limit = planLimit(plan);
  const deger = limit[ozellik];
  return typeof deger === "boolean" ? deger : deger === Infinity || deger > 0;
}

export const LUKS_SABLON_IDS = new Set([
  "nisan-luks",
  "dugun-luks",
  "dogumgunu-luks",
]);

export const PLAN_META: Record<PlanTipi, { isim: string; ozellikler: string[] }> = {
  free: {
    isim: "Ücretsiz",
    ozellikler: ["1 aktif davetiye", "50 davetli", "Temel şablonlar", "RSVP takibi"],
  },
  standart: {
    isim: "Standart",
    ozellikler: ["5 aktif davetiye", "200 davetli", "Tüm şablonlar", "QR kod", "Özel renk & font", "Müzik ekleme"],
  },
  premium: {
    isim: "Premium",
    ozellikler: ["Sınırsız davetiye", "Sınırsız davetli", "Oturma planı", "Albüm & Anı", "Sesli Anı Defteri", "Canlı Fotoğraf Duvarı", "Detaylı analitik", "Öncelikli destek"],
  },
};

// Geriye dönük uyumluluk — eski import'lar kırılmasın
export const PLAN_LIMITLER = PLAN_CONFIG;
export const PREMIUM_SABLON_IDS = LUKS_SABLON_IDS;

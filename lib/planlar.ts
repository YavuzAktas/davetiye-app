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

// Geriye dönük uyumluluk — eski import'lar kırılmasın
export const PLAN_LIMITLER = PLAN_CONFIG;
export const PREMIUM_SABLON_IDS = LUKS_SABLON_IDS;

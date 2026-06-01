import { createHash, randomBytes } from "node:crypto";

export const PARTNER_EKIP_ROLLERI = {
  satis: "satis",
  operasyon: "operasyon",
  teslim: "teslim",
} as const;

export type PartnerEkipRol = (typeof PARTNER_EKIP_ROLLERI)[keyof typeof PARTNER_EKIP_ROLLERI];

export function partnerEkipTokenOlustur() {
  return randomBytes(32).toString("base64url");
}

export function partnerEkipTokenHash(token: string) {
  return createHash("sha256").update(token.trim()).digest("hex");
}

export function partnerEkipRolEtiketi(rol: string) {
  if (rol === PARTNER_EKIP_ROLLERI.satis) return "Satış";
  if (rol === PARTNER_EKIP_ROLLERI.operasyon) return "Operasyon";
  if (rol === PARTNER_EKIP_ROLLERI.teslim) return "Teslim";
  return "Ekip";
}

export function partnerEkipRolGecerliMi(rol: string): rol is PartnerEkipRol {
  return Object.values(PARTNER_EKIP_ROLLERI).includes(rol as PartnerEkipRol);
}

import { createHash, randomBytes } from "node:crypto";

export const PERSONEL_ROLLERI = {
  checkIn: "check-in",
} as const;

export type PersonelRol = (typeof PERSONEL_ROLLERI)[keyof typeof PERSONEL_ROLLERI];

export function personelTokenOlustur() {
  return randomBytes(32).toString("base64url");
}

export function personelTokenHash(token: string) {
  return createHash("sha256").update(token.trim()).digest("hex");
}

export function personelRolEtiketi(rol: string) {
  if (rol === PERSONEL_ROLLERI.checkIn) return "QR Check-in";
  return "Personel";
}

export function personelRolGecerliMi(rol: string): rol is PersonelRol {
  return Object.values(PERSONEL_ROLLERI).includes(rol as PersonelRol);
}

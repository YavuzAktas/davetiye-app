import { createHash, randomBytes } from "crypto";

export function sifreSifirlamaTokenUret() {
  return randomBytes(32).toString("hex");
}

export function sifreSifirlamaTokenHash(token: string) {
  return createHash("sha256").update(token.trim()).digest("hex");
}

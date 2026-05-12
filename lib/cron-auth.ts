import { timingSafeEqual } from "crypto";

export function cronSecretEksik(): boolean {
  return !process.env.CRON_SECRET?.trim();
}

export function cronYetkiliMi(authHeader: string | null, cronSecret = process.env.CRON_SECRET): boolean {
  const secret = cronSecret?.trim();
  if (!secret) return false;

  const beklenen = `Bearer ${secret}`;
  if (!authHeader || authHeader.length !== beklenen.length) return false;

  return timingSafeEqual(Buffer.from(authHeader), Buffer.from(beklenen));
}

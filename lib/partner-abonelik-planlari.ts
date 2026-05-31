import "server-only";
import { PARTNER_PAKETLERI, type PartnerPaketId, paketGetir } from "@/lib/partner-paketler";

export const PARTNER_ABONELIK_PLAN_ENV_KEYS: Record<PartnerPaketId, string> = {
  baslangic: "IYZICO_PARTNER_SUBSCRIPTION_PLAN_BASLANGIC",
  profesyonel: "IYZICO_PARTNER_SUBSCRIPTION_PLAN_PROFESYONEL",
  kurumsal: "IYZICO_PARTNER_SUBSCRIPTION_PLAN_KURUMSAL",
};

export function partnerAbonelikPlanReferenceCodeGetir(paketId: string): string | null {
  if (!paketGetir(paketId)) return null;

  const envKey = PARTNER_ABONELIK_PLAN_ENV_KEYS[paketId as PartnerPaketId];
  return process.env[envKey]?.trim() || null;
}

export function eksikPartnerAbonelikPlanlari() {
  return Object.keys(PARTNER_PAKETLERI)
    .map(paketId => {
      const envKey = PARTNER_ABONELIK_PLAN_ENV_KEYS[paketId as PartnerPaketId];
      return {
        paketId,
        envKey,
        tanimli: Boolean(process.env[envKey]?.trim()),
      };
    })
    .filter(plan => !plan.tanimli);
}

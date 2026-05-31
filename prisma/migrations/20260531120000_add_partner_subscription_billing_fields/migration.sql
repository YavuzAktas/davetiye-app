-- Partner aboneliklerini iyzico otomatik yenileme referanslariyla takip et.
-- Mevcut abonelikler manuel kalir; otomatik yenileme yalnizca yeni abonelik akisiyle aktif edilir.

ALTER TABLE "PartnerAbonelik"
  ADD COLUMN IF NOT EXISTS "otomatikYenileme" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "abonelikDurumu" TEXT NOT NULL DEFAULT 'manuel',
  ADD COLUMN IF NOT EXISTS "iyzicoSubscriptionReferenceCode" TEXT,
  ADD COLUMN IF NOT EXISTS "iyzicoCustomerReferenceCode" TEXT,
  ADD COLUMN IF NOT EXISTS "iyzicoPricingPlanReferenceCode" TEXT,
  ADD COLUMN IF NOT EXISTS "sonTahsilatAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "sonrakiTahsilatAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "iptalAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerAbonelik_iyzicoSubscriptionReferenceCode_key"
  ON "PartnerAbonelik"("iyzicoSubscriptionReferenceCode");

CREATE INDEX IF NOT EXISTS "PartnerAbonelik_otomatikYenileme_abonelikDurumu_idx"
  ON "PartnerAbonelik"("otomatikYenileme", "abonelikDurumu");

CREATE INDEX IF NOT EXISTS "PartnerAbonelik_iyzicoCustomerReferenceCode_idx"
  ON "PartnerAbonelik"("iyzicoCustomerReferenceCode");

CREATE INDEX IF NOT EXISTS "PartnerAbonelik_sonrakiTahsilatAt_idx"
  ON "PartnerAbonelik"("sonrakiTahsilatAt");

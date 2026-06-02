ALTER TABLE "PartnerLead"
  ADD COLUMN IF NOT EXISTS "takipAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "teklifGecerliAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "kayipNedeni" VARCHAR(240);

CREATE INDEX IF NOT EXISTS "PartnerLead_partnerId_takipAt_idx" ON "PartnerLead"("partnerId", "takipAt");
CREATE INDEX IF NOT EXISTS "PartnerLead_partnerId_teklifGecerliAt_idx" ON "PartnerLead"("partnerId", "teklifGecerliAt");

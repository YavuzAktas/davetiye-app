-- Davetli: (davetiyeId, grup) -> (davetiyeId, grup, ad)
-- ORDER BY grup, ad sorgusunu index-only scan ile kapsar.
DROP INDEX IF EXISTS "Davetli_davetiyeId_grup_idx";
CREATE INDEX "Davetli_davetiyeId_grup_ad_idx" ON "Davetli"("davetiyeId", "grup", "ad");

-- Davetiye: cron reminder sorgular icin composite index
-- WHERE hatirlatiMail30dk = false AND createdAt BETWEEN ? AND ?
CREATE INDEX IF NOT EXISTS "Davetiye_hatirlatiMail30dk_createdAt_idx" ON "Davetiye"("hatirlatiMail30dk", "createdAt");
CREATE INDEX IF NOT EXISTS "Davetiye_hatirlatiMail24saat_createdAt_idx" ON "Davetiye"("hatirlatiMail24saat", "createdAt");

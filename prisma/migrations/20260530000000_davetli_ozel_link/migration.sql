-- Davetliye özel link sistemi için yeni alanlar
ALTER TABLE "Davetli"
  ADD COLUMN IF NOT EXISTS "ozelKod"                TEXT,
  ADD COLUMN IF NOT EXISTS "kisiLimiti"             INTEGER,
  ADD COLUMN IF NOT EXISTS "linkGoruntulendiAt"     TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "linkGoruntulenmeSayisi" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "sonGoruntulenmeAt"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rsvpId"                 TEXT;

-- Unique kısıtlamaları
CREATE UNIQUE INDEX IF NOT EXISTS "Davetli_ozelKod_key" ON "Davetli"("ozelKod");
CREATE UNIQUE INDEX IF NOT EXISTS "Davetli_rsvpId_key"  ON "Davetli"("rsvpId");

-- Mevcut davetliler için ozelKod backfill
UPDATE "Davetli"
SET "ozelKod" = left(replace(gen_random_uuid()::text, '-', ''), 10)
WHERE "ozelKod" IS NULL;

-- Davetli bazlı QR check-in takibi.
ALTER TABLE "Davetli"
  ADD COLUMN IF NOT EXISTS "checkinAt"         TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "checkinKisiSayisi" INTEGER,
  ADD COLUMN IF NOT EXISTS "checkinBy"         TEXT;

CREATE INDEX IF NOT EXISTS "Davetli_davetiyeId_checkinAt_idx"
  ON "Davetli"("davetiyeId", "checkinAt");

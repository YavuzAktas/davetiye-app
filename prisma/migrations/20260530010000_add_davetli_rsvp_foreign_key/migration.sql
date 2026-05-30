-- Davetli.rsvpId alanını RSVP tablosuna gerçek foreign key ile bağla.
-- Canlı veride boşa düşmüş rsvpId varsa constraint eklenmeden önce temizlenir.
UPDATE "Davetli" d
SET "rsvpId" = NULL
WHERE d."rsvpId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "RSVP" r
    WHERE r."id" = d."rsvpId"
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Davetli_rsvpId_fkey'
  ) THEN
    ALTER TABLE "Davetli"
      ADD CONSTRAINT "Davetli_rsvpId_fkey"
      FOREIGN KEY ("rsvpId")
      REFERENCES "RSVP"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;

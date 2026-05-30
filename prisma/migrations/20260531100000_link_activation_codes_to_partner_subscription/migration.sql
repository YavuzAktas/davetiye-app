-- Aktivasyon kodlarini olusturulduklari partner aboneligine bagla.
-- Boylece eski paket/kod iptalleri mevcut paketin hak sayisini bozmaz.

ALTER TABLE "AktivasyonKodu"
  ADD COLUMN IF NOT EXISTS "abonelikId" TEXT,
  ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);

-- Eski kodlari, varsa partnerin mevcut aktif aboneligine bagla.
UPDATE "AktivasyonKodu" AS ak
SET
  "abonelikId" = pa."id",
  "expiresAt" = COALESCE(ak."expiresAt", pa."bitisAt")
FROM (
  SELECT DISTINCT ON ("partnerId")
    "id",
    "partnerId",
    "bitisAt"
  FROM "PartnerAbonelik"
  WHERE "aktif" = true
  ORDER BY "partnerId", "createdAt" DESC
) AS pa
WHERE
  ak."partnerId" = pa."partnerId"
  AND ak."abonelikId" IS NULL;

CREATE INDEX IF NOT EXISTS "AktivasyonKodu_abonelikId_idx"
  ON "AktivasyonKodu"("abonelikId");

CREATE INDEX IF NOT EXISTS "AktivasyonKodu_expiresAt_idx"
  ON "AktivasyonKodu"("expiresAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AktivasyonKodu_abonelikId_fkey'
    ) THEN
        ALTER TABLE "AktivasyonKodu"
        ADD CONSTRAINT "AktivasyonKodu_abonelikId_fkey"
        FOREIGN KEY ("abonelikId") REFERENCES "PartnerAbonelik"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

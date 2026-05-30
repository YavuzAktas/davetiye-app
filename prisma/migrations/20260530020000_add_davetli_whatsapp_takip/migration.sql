-- Davetli paylaşım hunisi için WhatsApp gönderim ve hatırlatma takibi.
ALTER TABLE "Davetli"
  ADD COLUMN IF NOT EXISTS "whatsappGonderildiAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "sonHatirlatmaAt"      TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "hatirlatmaSayisi"     INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "Davetli_davetiyeId_whatsappGonderildiAt_idx"
  ON "Davetli"("davetiyeId", "whatsappGonderildiAt");

CREATE INDEX IF NOT EXISTS "Davetli_davetiyeId_sonHatirlatmaAt_idx"
  ON "Davetli"("davetiyeId", "sonHatirlatmaAt");

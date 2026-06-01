ALTER TABLE "YasalOnayKaydi" ADD COLUMN "partnerId" TEXT;

CREATE INDEX "YasalOnayKaydi_partnerId_idx" ON "YasalOnayKaydi"("partnerId");

ALTER TABLE "YasalOnayKaydi" ADD COLUMN "davetiyeId" TEXT;
ALTER TABLE "YasalOnayKaydi" ADD COLUMN "siparisId" TEXT;

CREATE INDEX "YasalOnayKaydi_davetiyeId_idx" ON "YasalOnayKaydi"("davetiyeId");
CREATE INDEX "YasalOnayKaydi_siparisId_idx" ON "YasalOnayKaydi"("siparisId");

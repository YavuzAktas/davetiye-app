ALTER TABLE "Davetiye"
ADD COLUMN "odemeDurumu" TEXT NOT NULL DEFAULT 'ucretsiz',
ADD COLUMN "fiyatSnapshot" JSONB;

CREATE TABLE "Siparis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "davetiyeId" TEXT,
    "durum" TEXT NOT NULL DEFAULT 'odeme_bekliyor',
    "urunTipi" TEXT NOT NULL DEFAULT 'davetiye',
    "paraBirimi" TEXT NOT NULL DEFAULT 'TRY',
    "araToplam" INTEGER NOT NULL,
    "toplamTutar" INTEGER NOT NULL,
    "fiyatKirilimi" JSONB NOT NULL,
    "odemeToken" TEXT,
    "paymentId" TEXT,
    "conversationId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Siparis_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "OdemeToken"
ADD COLUMN "urunTipi" TEXT NOT NULL DEFAULT 'plan',
ADD COLUMN "davetiyeId" TEXT,
ADD COLUMN "siparisId" TEXT,
ADD COLUMN "toplamTutar" INTEGER,
ADD COLUMN "fiyatKirilimi" JSONB;

ALTER TABLE "OdemeKaydi"
ADD COLUMN "urunTipi" TEXT NOT NULL DEFAULT 'plan',
ADD COLUMN "davetiyeId" TEXT,
ADD COLUMN "siparisId" TEXT,
ADD COLUMN "fiyatKirilimi" JSONB;

CREATE UNIQUE INDEX "Siparis_odemeToken_key" ON "Siparis"("odemeToken");
CREATE INDEX "Siparis_userId_durum_idx" ON "Siparis"("userId", "durum");
CREATE INDEX "Siparis_davetiyeId_idx" ON "Siparis"("davetiyeId");
CREATE INDEX "Siparis_createdAt_idx" ON "Siparis"("createdAt");
CREATE INDEX "Davetiye_userId_odemeDurumu_idx" ON "Davetiye"("userId", "odemeDurumu");
CREATE INDEX "OdemeToken_davetiyeId_idx" ON "OdemeToken"("davetiyeId");
CREATE INDEX "OdemeToken_siparisId_idx" ON "OdemeToken"("siparisId");
CREATE INDEX "OdemeKaydi_davetiyeId_idx" ON "OdemeKaydi"("davetiyeId");
CREATE INDEX "OdemeKaydi_siparisId_idx" ON "OdemeKaydi"("siparisId");

ALTER TABLE "Siparis" ADD CONSTRAINT "Siparis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Siparis" ADD CONSTRAINT "Siparis_davetiyeId_fkey" FOREIGN KEY ("davetiyeId") REFERENCES "Davetiye"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OdemeToken" ADD CONSTRAINT "OdemeToken_davetiyeId_fkey" FOREIGN KEY ("davetiyeId") REFERENCES "Davetiye"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OdemeToken" ADD CONSTRAINT "OdemeToken_siparisId_fkey" FOREIGN KEY ("siparisId") REFERENCES "Siparis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OdemeKaydi" ADD CONSTRAINT "OdemeKaydi_davetiyeId_fkey" FOREIGN KEY ("davetiyeId") REFERENCES "Davetiye"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OdemeKaydi" ADD CONSTRAINT "OdemeKaydi_siparisId_fkey" FOREIGN KEY ("siparisId") REFERENCES "Siparis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

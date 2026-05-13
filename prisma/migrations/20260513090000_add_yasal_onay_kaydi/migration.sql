CREATE TABLE "YasalOnayKaydi" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "emailHash" TEXT,
    "onayTipi" TEXT NOT NULL,
    "metinSurumu" TEXT NOT NULL,
    "kaynak" TEXT NOT NULL,
    "hesapSilindiAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YasalOnayKaydi_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "YasalOnayKaydi_userId_idx" ON "YasalOnayKaydi"("userId");

CREATE INDEX "YasalOnayKaydi_emailHash_idx" ON "YasalOnayKaydi"("emailHash");

CREATE INDEX "YasalOnayKaydi_hesapSilindiAt_idx" ON "YasalOnayKaydi"("hesapSilindiAt");

CREATE INDEX "YasalOnayKaydi_createdAt_idx" ON "YasalOnayKaydi"("createdAt");

CREATE TABLE "RateLimitKaydi" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "anahtar" TEXT NOT NULL,
    "sayi" INTEGER NOT NULL DEFAULT 0,
    "sifirAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitKaydi_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RateLimitKaydi_ad_anahtar_key" ON "RateLimitKaydi"("ad", "anahtar");
CREATE INDEX "RateLimitKaydi_sifirAt_idx" ON "RateLimitKaydi"("sifirAt");

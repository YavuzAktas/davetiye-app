CREATE TABLE "PartnerEkipErisim" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "rol" VARCHAR(30) NOT NULL,
    "etiket" VARCHAR(80),
    "tokenHash" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerEkipErisim_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PartnerEkipErisim_tokenHash_key" ON "PartnerEkipErisim"("tokenHash");
CREATE INDEX "PartnerEkipErisim_partnerId_aktif_idx" ON "PartnerEkipErisim"("partnerId", "aktif");
CREATE INDEX "PartnerEkipErisim_rol_aktif_idx" ON "PartnerEkipErisim"("rol", "aktif");
CREATE INDEX "PartnerEkipErisim_expiresAt_idx" ON "PartnerEkipErisim"("expiresAt");
CREATE INDEX "PartnerEkipErisim_createdAt_idx" ON "PartnerEkipErisim"("createdAt");

ALTER TABLE "PartnerEkipErisim" ADD CONSTRAINT "PartnerEkipErisim_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

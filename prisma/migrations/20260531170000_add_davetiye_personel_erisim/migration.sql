CREATE TABLE "DavetiyePersonelErisim" (
    "id" TEXT NOT NULL,
    "davetiyeId" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "etiket" VARCHAR(80),
    "tokenHash" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DavetiyePersonelErisim_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DavetiyePersonelErisim_tokenHash_key" ON "DavetiyePersonelErisim"("tokenHash");
CREATE INDEX "DavetiyePersonelErisim_davetiyeId_aktif_idx" ON "DavetiyePersonelErisim"("davetiyeId", "aktif");
CREATE INDEX "DavetiyePersonelErisim_rol_aktif_idx" ON "DavetiyePersonelErisim"("rol", "aktif");
CREATE INDEX "DavetiyePersonelErisim_expiresAt_idx" ON "DavetiyePersonelErisim"("expiresAt");
CREATE INDEX "DavetiyePersonelErisim_createdAt_idx" ON "DavetiyePersonelErisim"("createdAt");

ALTER TABLE "DavetiyePersonelErisim" ADD CONSTRAINT "DavetiyePersonelErisim_davetiyeId_fkey" FOREIGN KEY ("davetiyeId") REFERENCES "Davetiye"("id") ON DELETE CASCADE ON UPDATE CASCADE;

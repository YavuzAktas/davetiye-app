-- CreateTable
CREATE TABLE "MedyaSilmeKuyrugu" (
    "id" TEXT NOT NULL,
    "dosyaUrl" TEXT NOT NULL,
    "kaynak" TEXT NOT NULL,
    "denemeSayisi" INTEGER NOT NULL DEFAULT 0,
    "sonHata" TEXT,
    "sonrakiDeneme" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedyaSilmeKuyrugu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedyaSilmeKuyrugu_dosyaUrl_key" ON "MedyaSilmeKuyrugu"("dosyaUrl");

-- CreateIndex
CREATE INDEX "MedyaSilmeKuyrugu_sonrakiDeneme_idx" ON "MedyaSilmeKuyrugu"("sonrakiDeneme");

-- CreateIndex
CREATE INDEX "MedyaSilmeKuyrugu_createdAt_idx" ON "MedyaSilmeKuyrugu"("createdAt");

-- CreateTable
CREATE TABLE "GeciciYukleme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dosyaUrl" TEXT NOT NULL,
    "tip" TEXT NOT NULL DEFAULT 'polaroid',
    "kullanildi" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "GeciciYukleme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeciciYukleme_dosyaUrl_key" ON "GeciciYukleme"("dosyaUrl");

-- CreateIndex
CREATE INDEX "GeciciYukleme_userId_idx" ON "GeciciYukleme"("userId");

-- CreateIndex
CREATE INDEX "GeciciYukleme_kullanildi_createdAt_idx" ON "GeciciYukleme"("kullanildi", "createdAt");

-- AddForeignKey
ALTER TABLE "GeciciYukleme" ADD CONSTRAINT "GeciciYukleme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Partner programi: organizasyoncular icin abonelik ve aktivasyon kodlari.

-- CreateTable
CREATE TABLE IF NOT EXISTS "Partner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firmaAdi" TEXT NOT NULL,
    "logoUrl" TEXT,
    "durum" TEXT NOT NULL DEFAULT 'beklemede',
    "basvuruDetay" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PartnerAbonelik" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "paketId" TEXT NOT NULL,
    "hakSayisi" INTEGER NOT NULL,
    "kullanilanHak" INTEGER NOT NULL DEFAULT 0,
    "baslangicAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bitisAt" TIMESTAMP(3),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerAbonelik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AktivasyonKodu" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "kod" TEXT NOT NULL,
    "durum" TEXT NOT NULL DEFAULT 'olusturuldu',
    "musteriUserId" TEXT,
    "davetiyeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kullanilanAt" TIMESTAMP(3),

    CONSTRAINT "AktivasyonKodu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Partner_userId_key" ON "Partner"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PartnerAbonelik_partnerId_aktif_idx" ON "PartnerAbonelik"("partnerId", "aktif");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AktivasyonKodu_kod_key" ON "AktivasyonKodu"("kod");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AktivasyonKodu_davetiyeId_key" ON "AktivasyonKodu"("davetiyeId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AktivasyonKodu_partnerId_idx" ON "AktivasyonKodu"("partnerId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AktivasyonKodu_musteriUserId_idx" ON "AktivasyonKodu"("musteriUserId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Partner_userId_fkey'
    ) THEN
        ALTER TABLE "Partner"
        ADD CONSTRAINT "Partner_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'PartnerAbonelik_partnerId_fkey'
    ) THEN
        ALTER TABLE "PartnerAbonelik"
        ADD CONSTRAINT "PartnerAbonelik_partnerId_fkey"
        FOREIGN KEY ("partnerId") REFERENCES "Partner"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AktivasyonKodu_partnerId_fkey'
    ) THEN
        ALTER TABLE "AktivasyonKodu"
        ADD CONSTRAINT "AktivasyonKodu_partnerId_fkey"
        FOREIGN KEY ("partnerId") REFERENCES "Partner"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AktivasyonKodu_musteriUserId_fkey'
    ) THEN
        ALTER TABLE "AktivasyonKodu"
        ADD CONSTRAINT "AktivasyonKodu_musteriUserId_fkey"
        FOREIGN KEY ("musteriUserId") REFERENCES "User"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AktivasyonKodu_davetiyeId_fkey'
    ) THEN
        ALTER TABLE "AktivasyonKodu"
        ADD CONSTRAINT "AktivasyonKodu_davetiyeId_fkey"
        FOREIGN KEY ("davetiyeId") REFERENCES "Davetiye"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

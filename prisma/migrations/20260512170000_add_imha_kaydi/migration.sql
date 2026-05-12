CREATE TABLE "ImhaKaydi" (
    "id" TEXT NOT NULL,
    "kaynak" TEXT NOT NULL,
    "islemTuru" TEXT NOT NULL,
    "veriKategorisi" TEXT NOT NULL,
    "adet" INTEGER NOT NULL,
    "yontem" TEXT NOT NULL,
    "gerekce" TEXT NOT NULL,
    "detay" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImhaKaydi_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ImhaKaydi_createdAt_idx" ON "ImhaKaydi"("createdAt");

CREATE INDEX "ImhaKaydi_kaynak_idx" ON "ImhaKaydi"("kaynak");

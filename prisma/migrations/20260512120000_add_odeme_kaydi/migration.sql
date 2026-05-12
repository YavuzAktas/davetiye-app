-- CreateTable
CREATE TABLE "OdemeKaydi" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT,
    "planId" TEXT NOT NULL,
    "token" TEXT,
    "paymentId" TEXT,
    "conversationId" TEXT,
    "price" TEXT,
    "paidPrice" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "paymentStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OdemeKaydi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OdemeKaydi_token_key" ON "OdemeKaydi"("token");

-- CreateIndex
CREATE INDEX "OdemeKaydi_userId_idx" ON "OdemeKaydi"("userId");

-- CreateIndex
CREATE INDEX "OdemeKaydi_createdAt_idx" ON "OdemeKaydi"("createdAt");

-- AddForeignKey
ALTER TABLE "OdemeKaydi" ADD CONSTRAINT "OdemeKaydi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

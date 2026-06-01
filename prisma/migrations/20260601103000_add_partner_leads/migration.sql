CREATE TABLE "PartnerLead" (
  "id" TEXT NOT NULL,
  "partnerId" TEXT NOT NULL,
  "baslik" VARCHAR(120) NOT NULL,
  "ilgiliKisi" VARCHAR(120),
  "telefon" VARCHAR(30),
  "eposta" VARCHAR(160),
  "etkinlikTuru" VARCHAR(60),
  "etkinlikTarihi" TIMESTAMP(3),
  "kisiSayisi" INTEGER,
  "kaynak" VARCHAR(60),
  "durum" VARCHAR(40) NOT NULL DEFAULT 'yeni',
  "not" VARCHAR(500),
  "sonGorusmeAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PartnerLead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PartnerLead_partnerId_durum_idx" ON "PartnerLead"("partnerId", "durum");
CREATE INDEX "PartnerLead_partnerId_etkinlikTarihi_idx" ON "PartnerLead"("partnerId", "etkinlikTarihi");
CREATE INDEX "PartnerLead_partnerId_updatedAt_idx" ON "PartnerLead"("partnerId", "updatedAt");

ALTER TABLE "PartnerLead"
  ADD CONSTRAINT "PartnerLead_partnerId_fkey"
  FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

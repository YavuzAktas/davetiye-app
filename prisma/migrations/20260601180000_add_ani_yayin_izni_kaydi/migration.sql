ALTER TABLE "AniDefteri" ADD COLUMN "yayinIzniOnaylandiAt" TIMESTAMP(3);
ALTER TABLE "AniDefteri" ADD COLUMN "yayinIzniMetinSurumu" TEXT;

CREATE INDEX "AniDefteri_yayinIzniOnaylandiAt_idx" ON "AniDefteri"("yayinIzniOnaylandiAt");

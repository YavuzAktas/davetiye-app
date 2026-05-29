ALTER TABLE "AlbumFoto" ADD COLUMN "yayinIzniOnaylandiAt" TIMESTAMP(3);
ALTER TABLE "AlbumFoto" ADD COLUMN "yayinIzniMetinSurumu" TEXT;
ALTER TABLE "SesliAni" ADD COLUMN "yayinIzniOnaylandiAt" TIMESTAMP(3);
ALTER TABLE "SesliAni" ADD COLUMN "yayinIzniMetinSurumu" TEXT;

CREATE INDEX "AlbumFoto_yayinIzniOnaylandiAt_idx" ON "AlbumFoto"("yayinIzniOnaylandiAt");
CREATE INDEX "SesliAni_yayinIzniOnaylandiAt_idx" ON "SesliAni"("yayinIzniOnaylandiAt");

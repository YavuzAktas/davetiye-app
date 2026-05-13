CREATE INDEX "Davetiye_userId_aktif_idx" ON "Davetiye"("userId", "aktif");
CREATE INDEX "SesliAni_davetiyeId_onaylandi_createdAt_idx" ON "SesliAni"("davetiyeId", "onaylandi", "createdAt");
CREATE INDEX "AlbumFoto_davetiyeId_onaylandi_createdAt_idx" ON "AlbumFoto"("davetiyeId", "onaylandi", "createdAt");
CREATE INDEX "AniDefteri_davetiyeId_onaylandi_createdAt_idx" ON "AniDefteri"("davetiyeId", "onaylandi", "createdAt");
CREATE INDEX "RSVP_davetiyeId_createdAt_idx" ON "RSVP"("davetiyeId", "createdAt");
CREATE INDEX "RSVP_davetiyeId_ad_createdAt_idx" ON "RSVP"("davetiyeId", "ad", "createdAt");
CREATE INDEX "OdemeToken_expiresAt_idx" ON "OdemeToken"("expiresAt");

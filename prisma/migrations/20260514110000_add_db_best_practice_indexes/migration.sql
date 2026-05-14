CREATE INDEX "Davetiye_userId_createdAt_idx" ON "Davetiye"("userId", "createdAt");
CREATE INDEX "Davetiye_tarih_idx" ON "Davetiye"("tarih");
CREATE INDEX "Davetiye_createdAt_idx" ON "Davetiye"("createdAt");

CREATE INDEX "RSVP_davetiyeId_katilim_createdAt_idx" ON "RSVP"("davetiyeId", "katilim", "createdAt");

CREATE INDEX "Masa_davetiyeId_sira_idx" ON "Masa"("davetiyeId", "sira");
CREATE INDEX "MasaAtama_masaId_idx" ON "MasaAtama"("masaId");

CREATE INDEX "MedyaSilmeKuyrugu_sonrakiDeneme_createdAt_idx" ON "MedyaSilmeKuyrugu"("sonrakiDeneme", "createdAt");

CREATE INDEX "Davetli_davetiyeId_createdAt_idx" ON "Davetli"("davetiyeId", "createdAt");

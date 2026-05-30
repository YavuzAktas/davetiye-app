-- Partner panelindeki dahili kod etiketi/not alanı.
-- IF NOT EXISTS canlı veritabanında manuel eklenmiş kolon varsa migration'ı güvenli tutar.
ALTER TABLE "AktivasyonKodu"
  ADD COLUMN IF NOT EXISTS "not" VARCHAR(100);

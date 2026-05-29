ALTER TABLE "RSVP" ADD COLUMN "ozelNitelikliVeriOnaylandiAt" TIMESTAMP(3);
ALTER TABLE "RSVP" ADD COLUMN "ozelNitelikliVeriMetinSurumu" TEXT;

CREATE INDEX "RSVP_ozelNitelikliVeriOnaylandiAt_idx" ON "RSVP"("ozelNitelikliVeriOnaylandiAt");

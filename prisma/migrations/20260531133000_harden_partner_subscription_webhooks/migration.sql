-- Partner subscription webhook hardening:
-- 1) A single iyzico subscription reference can have multiple local billing periods.
-- 2) Webhook events are stored by idempotency key to avoid replayed renewals.

DROP INDEX IF EXISTS "PartnerAbonelik_iyzicoSubscriptionReferenceCode_key";

CREATE INDEX IF NOT EXISTS "PartnerAbonelik_iyzicoSubscriptionReferenceCode_idx"
  ON "PartnerAbonelik"("iyzicoSubscriptionReferenceCode");

CREATE TABLE IF NOT EXISTS "IyzicoWebhookEvent" (
  "id" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "bodyHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),

  CONSTRAINT "IyzicoWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "IyzicoWebhookEvent_eventKey_key"
  ON "IyzicoWebhookEvent"("eventKey");

CREATE INDEX IF NOT EXISTS "IyzicoWebhookEvent_eventType_createdAt_idx"
  ON "IyzicoWebhookEvent"("eventType", "createdAt");

CREATE INDEX IF NOT EXISTS "IyzicoWebhookEvent_createdAt_idx"
  ON "IyzicoWebhookEvent"("createdAt");

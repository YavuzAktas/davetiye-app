-- Compensating migration: a previous migration incorrectly dropped "notlar"
-- while the schema and application code still use this column.
-- This ensures fresh database setups have the column.
ALTER TABLE "Davetli" ADD COLUMN IF NOT EXISTS "notlar" TEXT;

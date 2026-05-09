import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildDatabaseUrl(base: string | undefined): string | undefined {
  if (!base) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}connection_limit=1&pool_timeout=10`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: buildDatabaseUrl(process.env.DATABASE_URL) } },
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL_KEYS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

function resolveDatabaseUrl() {
  for (const key of DATABASE_URL_KEYS) {
    const value = process.env[key];
    if (value) return value;
  }

  throw new Error(
    "Missing database connection string. Set DATABASE_URL or the Vercel Postgres variables (POSTGRES_PRISMA_URL / POSTGRES_URL)."
  );
}

function makePrisma() {
  const url = resolveDatabaseUrl();

  // Production Prisma Accelerate URL
  if (url.startsWith("prisma+postgres://") || url.startsWith("prisma://")) {
    return new PrismaClient({ accelerateUrl: url });
  }

  // Direct postgres:// connection (local dev)
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrisma> | undefined;
};

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

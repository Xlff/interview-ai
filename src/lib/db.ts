import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { env } from "@/lib/env";

declare global {
  var __db: PrismaClient | undefined;
  var __dbPool: Pool | undefined;
}

const connectionString = env.databaseUrl();

const pool =
  globalThis.__dbPool ??
  new Pool({
    connectionString,
  });

const adapter = new PrismaPg(pool);

export const db =
  globalThis.__db ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
  globalThis.__dbPool = pool;
}

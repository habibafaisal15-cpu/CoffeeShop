import postgres from "postgres";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Postgres connection string to .env.local"
    );
  }
  return url;
}

declare global {
  // eslint-disable-next-line no-var
  var __coffeePosSql: ReturnType<typeof postgres> | undefined;
}

export function getSql() {
  if (!globalThis.__coffeePosSql) {
    globalThis.__coffeePosSql = postgres(getDatabaseUrl(), {
      ssl: process.env.NODE_ENV === "production" ? "require" : "prefer",
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return globalThis.__coffeePosSql;
}

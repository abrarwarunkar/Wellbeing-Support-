import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
// Fix for "connect ENETUNREACH" on Render/Railway/Supabase
import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first");
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("supabase") || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined,
});
export const db = drizzle(pool, { schema });

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { sql } from "drizzle-orm";

const { Pool } = pg;

// Local Docker DB (Source)
const SOURCE_DB_URL = "postgres://postgres:postgres@localhost:5433/mindfulspace";

// Supabase DB (Destination) - read from current env
const DEST_DB_URL = process.env.DATABASE_URL;

if (!DEST_DB_URL || !DEST_DB_URL.includes("supabase")) {
    console.error("Current DATABASE_URL does not look like Supabase. Please check .env");
    process.exit(1);
}

async function migrate() {
    console.log("Connecting to source (Local)...");
    const sourcePool = new Pool({ connectionString: SOURCE_DB_URL });
    const sourceDb = drizzle(sourcePool, { schema });

    console.log("Connecting to destination (Supabase)...");
    const destPool = new Pool({
        connectionString: DEST_DB_URL,
        ssl: { rejectUnauthorized: false }
    });
    const destDb = drizzle(destPool, { schema });

    // Table order matters for Foreign Keys
    const tables = [
        "users",
        "sessions", // if you want to keep logins
        "documents",
        "resources",
        "posts",
        "replies",
        "appointments",
        "mood_entries",
        "screening_assessments",
        "daily_insights",
        "institutional_trends",
        "conversations", // Parent of messages
        "messages" // Chat messages
    ];

    try {
        for (const table of tables) {
            console.log(`Migrating ${table}...`);

            // Get data from source
            // @ts-ignore
            const result = await sourcePool.query(`SELECT * FROM ${table}`);
            const rows = result.rows;

            if (rows.length === 0) {
                console.log(`  No data in ${table}, skipping.`);
                continue;
            }

            console.log(`  Found ${rows.length} rows in ${table}. Inserting...`);

            // Insert into destination
            // We use raw SQL for flexibility with generic migration
            for (const row of rows) {
                const keys = Object.keys(row).map(k => `"${k}"`).join(", ");
                const values = Object.values(row).map((v, i) => `$${i + 1}`).join(", ");

                // Construct INSERT ... ON CONFLICT DO NOTHING
                const query = `INSERT INTO "${table}" (${keys}) VALUES (${values}) ON CONFLICT DO NOTHING`;

                await destPool.query(query, Object.values(row));
            }
            console.log(`  Done with ${table}.`);
        }

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await sourcePool.end();
        await destPool.end();
    }
}

migrate();

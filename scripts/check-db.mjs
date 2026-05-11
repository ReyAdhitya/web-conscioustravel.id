import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.local" });
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

await client.connect();

const tables = await client.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
);
console.log("Tables in public schema:");
for (const row of tables.rows) {
  console.log("  ·", row.table_name);
}

const enums = await client.query(
  "SELECT typname FROM pg_type WHERE typtype = 'e' ORDER BY typname",
);
console.log("\nEnums:");
for (const row of enums.rows) {
  console.log("  ·", row.typname);
}

await client.end();

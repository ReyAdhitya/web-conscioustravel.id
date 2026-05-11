import { config } from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

config({ path: ".env.local" });
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const db = drizzle(client);

console.log("Running migrations from ./drizzle …");
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("✅ Migrations applied.");

await client.end();

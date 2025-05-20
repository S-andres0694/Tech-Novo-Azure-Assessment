import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import "dotenv/config";
import { getDBInstance, getPostgresURL } from "./db";
if (
  getPostgresURL(
    process.env.POSTGRES_DATABASE_PASSWORD ?? "",
    parseInt(process.env.DATABASE_PORT ?? "2000"),
  )
) {
  throw new Error(
    "DATABASE_URL environment variable is required for migrations.",
  );
}

export default async function runMigrations(): Promise<void> {
  const startTime: number = Date.now();
  const pool: Pool = new Pool({
    connectionString: getPostgresURL(
      process.env.POSTGRES_DATABASE_PASSWORD ?? "",
      parseInt(process.env.DATABASE_PORT ?? "2000"),
    ),
  });

  const db: NodePgDatabase = getDBInstance(
    getPostgresURL(
      process.env.POSTGRES_DATABASE_PASSWORD ?? "",
      parseInt(process.env.DATABASE_PORT ?? "2000"),
    ),
  );

  try {
    await migrate(db, { migrationsFolder: "./drizzle/migrations" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    process.exit(1);
  } finally {
    await pool.end();
    const endTime = Date.now();
    console.log(`⏱️ Finished in ${endTime - startTime}ms`);
  }
}

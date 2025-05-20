import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { getPostgresURL } from "~/database/db";
import dotenv from "dotenv";
const PORT: string = process.env.DATABASE_PORT ?? "2000";
const PASSWORD: string = process.env.POSTGRES_DATABASE_PASSWORD ?? "";

dotenv.config();

export default defineConfig({
  out: "./drizzle",
  schema: "./app/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getPostgresURL(PASSWORD, parseInt(PORT)),
  },
  verbose: true,
  strict: true,
});

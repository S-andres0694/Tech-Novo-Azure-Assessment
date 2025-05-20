import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

/**
 * Get the Postgres URL for the database.
 * We assume local development because the specification says that only local storage is allowed. Normally, would use node to determine the environment and work accordingly.
 * @param password - The password for the database.
 * @param port - The port for the database.
 * @returns The Postgres URL for the database in the form of a string.
 */

export function getPostgresURL(password: string, port: number): string {
  if (!password || !port) {
    throw new Error("Password and port are required");
  }

  return `postgres://postgres:${password}@localhost:${port}/postgres`;
}

/**
 * Get the Postgres database instance.
 * @returns The database instance.
 */

export function getDBInstance(URL: string): NodePgDatabase {
  return drizzle(URL);
}

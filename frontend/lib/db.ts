import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("[DB] DATABASE_URL is not set in environment variables.");
}

export const sql = neon(connectionString || "");

export default sql;

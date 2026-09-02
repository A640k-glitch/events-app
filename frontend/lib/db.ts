import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_DvBY8LqTCj7a@ep-young-block-za2ij13f-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require";

export const sql = neon(connectionString);

export default sql;

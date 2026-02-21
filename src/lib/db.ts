import { Pool } from "pg";

declare global {
  // กันสร้าง pool ซ้ำตอน dev hot reload
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

export const pool =
  global.__pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") global.__pgPool = pool;
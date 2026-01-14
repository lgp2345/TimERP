import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema";

export { schema };

export type Db = NodePgDatabase<typeof schema>;

export function createPgPool(config: PoolConfig): Pool {
  return new Pool(config);
}

export function createDb(pool: Pool): Db {
  return drizzle(pool, { schema });
}

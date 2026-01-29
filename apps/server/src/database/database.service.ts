import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema";

export type DatabaseSchema = typeof schema;
export type Database = NodePgDatabase<DatabaseSchema>;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool | null = null;
  private _db: Database | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const connectionString = this.configService.get<string>("DATABASE_URL");
    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined");
    }

    const poolConfig: PoolConfig = {
      connectionString,
    };

    this.pool = new Pool(poolConfig);
    this._db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  get db(): Database {
    if (!this._db) {
      throw new Error("Database not initialized");
    }
    return this._db;
  }

  getPool(): Pool {
    if (!this.pool) {
      throw new Error("Database pool not initialized");
    }
    return this.pool;
  }
}

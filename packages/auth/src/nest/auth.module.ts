import { Module, type DynamicModule, type MiddlewareConsumer, type NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { createDb, createPgPool, type Db } from "@repo/db";
import IORedis from "ioredis";
import { type RedisLike, type AuthConfig } from "../core/types";
import { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";
import { TenantMiddleware } from "./tenant.middleware";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { RbacGuard } from "./rbac.guard";

type AuthModuleOptions = {
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
  accessTtlSeconds?: number;
  refreshTtlSeconds?: number;
  cookieName?: string;
  cookieSecure?: boolean;
  cookieSameSite?: "lax" | "strict" | "none";
  permissionsCacheTtlSeconds?: number;
};

function createRedisClient(redisUrl: string): RedisLike {
  return new IORedis(redisUrl);
}

@Module({})
export class AuthModule implements NestModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    const accessTtlSeconds = options.accessTtlSeconds ?? 15 * 60;
    const refreshTtlSeconds = options.refreshTtlSeconds ?? 7 * 24 * 60 * 60;

    const config: AuthConfig = {
      jwt: { secret: options.jwtSecret, accessTtlSeconds },
      refresh: {
        cookieName: options.cookieName ?? "refresh_token",
        refreshTtlSeconds,
        cookieSecure: options.cookieSecure ?? false,
        cookieSameSite: options.cookieSameSite ?? "lax",
      },
      permissionsCacheTtlSeconds: options.permissionsCacheTtlSeconds ?? 60,
    };

    const pool = createPgPool({ connectionString: options.databaseUrl });
    const db: Db = createDb(pool);
    const redis: RedisLike = createRedisClient(options.redisUrl);

    return {
      module: AuthModule,
      imports: [ConfigModule],
      controllers: [AuthController],
      providers: [
        TenantMiddleware,
        AuthGuard,
        RbacGuard,
        { provide: AUTH_CONFIG, useValue: config },
        { provide: AUTH_DB, useValue: db },
        { provide: AUTH_REDIS, useValue: redis },
      ],
      exports: [AuthGuard, RbacGuard, AUTH_CONFIG, AUTH_DB, AUTH_REDIS],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}



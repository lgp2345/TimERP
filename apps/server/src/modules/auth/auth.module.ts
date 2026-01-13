import { Module, type DynamicModule, type MiddlewareConsumer, type NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { createDb, createPgPool, type Db } from "@repo/db";
import IORedis from "ioredis";
import { type RedisLike, type AuthConfig } from "@repo/auth";
import { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";
import { TenantMiddleware } from "./tenant.middleware";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { RbacGuard } from "./rbac.guard";

/**
 * 认证模块配置选项
 */
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

/**
 * 创建 Redis 客户端
 */
function createRedisClient(redisUrl: string): RedisLike {
  return new IORedis(redisUrl) as unknown as RedisLike;
}

/**
 * NestJS 认证模块
 * 
 * 功能：
 * - 配置依赖注入：数据库、Redis、认证配置
 * - 注册控制器：AuthController（登录/刷新/登出）
 * - 注册守卫：AuthGuard（JWT 认证）、RbacGuard（权限检查）
 * - 注册中间件：TenantMiddleware（租户解析）
 * 
 * 使用方式：
 * ```typescript
 * @Module({
 *   imports: [
 *     AuthModule.forRoot({
 *       databaseUrl: process.env.DATABASE_URL,
 *       redisUrl: process.env.REDIS_URL,
 *       jwtSecret: process.env.JWT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 */
@Module({})
export class AuthModule implements NestModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    // 设置默认值
    const accessTtlSeconds = options.accessTtlSeconds ?? 15 * 60; // 默认 15 分钟
    const refreshTtlSeconds = options.refreshTtlSeconds ?? 7 * 24 * 60 * 60; // 默认 7 天

    // 构建认证配置
    const config: AuthConfig = {
      jwt: { secret: options.jwtSecret, accessTtlSeconds },
      refresh: {
        cookieName: options.cookieName ?? "refresh_token",
        refreshTtlSeconds,
        cookieSecure: options.cookieSecure ?? false,
        cookieSameSite: options.cookieSameSite ?? "lax",
      },
      permissionsCacheTtlSeconds: options.permissionsCacheTtlSeconds ?? 60, // 默认 60 秒
    };

    // 创建数据库连接池和 Drizzle 实例
    const pool = createPgPool({ connectionString: options.databaseUrl });
    const db: Db = createDb(pool);
    
    // 创建 Redis 客户端
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
      // 导出守卫和 DI tokens，供其他模块使用
      exports: [AuthGuard, RbacGuard, AUTH_CONFIG, AUTH_DB, AUTH_REDIS],
    };
  }

  /**
   * 配置中间件
   * TenantMiddleware 会在所有路由之前执行
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}


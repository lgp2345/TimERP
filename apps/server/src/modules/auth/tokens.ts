/**
 * 认证模块的依赖注入 Token
 * 用于在 NestJS 中注入数据库、Redis 和配置实例
 */
export const AUTH_DB = Symbol.for("@repo/auth/DB");
export const AUTH_REDIS = Symbol.for("@repo/auth/REDIS");
export const AUTH_CONFIG = Symbol.for("@repo/auth/CONFIG");


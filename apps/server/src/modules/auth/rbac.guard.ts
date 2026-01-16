import {
  type CanActivate,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  type AuthConfig,
  type RedisLike,
  resolveUserPermissions,
} from "@repo/auth";
import type { Db } from "@repo/db";
import { REQUIRE_PERMISSIONS_KEY } from "./permissions.decorator";
import type { TenantRequest } from "./request-types";
import { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";

/**
 * RBAC（基于角色的访问控制）权限守卫
 * 检查用户是否拥有 @RequirePermissions 装饰器声明的所有权限
 *
 * 注意：此守卫需要在 AuthGuard 之后执行，以确保请求中已有用户信息
 *
 * 使用方式：
 * ```typescript
 * @UseGuards(AuthGuard, RbacGuard)
 * @RequirePermissions("user:read", "user:write")
 * @Get()
 * async getUsers() { ... }
 * ```
 */
@Injectable()
export class RbacGuard implements CanActivate {
  private readonly reflector: Reflector;
  private readonly db: Db;
  private readonly redis: RedisLike | null;
  private readonly config: AuthConfig;

  constructor(
    reflector: Reflector,
    @Inject(AUTH_DB) db: Db,
    @Inject(AUTH_REDIS) redis: RedisLike | null,
    @Inject(AUTH_CONFIG) config: AuthConfig
  ) {
    this.reflector = reflector;
    this.db = db;
    this.redis = redis;
    this.config = config;
  }

  async canActivate(context: Parameters<CanActivate["canActivate"]>[0]) {
    // 从方法或类上获取所需的权限列表
    const required = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );
    // 如果没有声明权限要求，则允许访问
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest() as TenantRequest;
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    // 从数据库查询用户的实际权限（支持 Redis 缓存）
    const permissions = await resolveUserPermissions({
      db: this.db,
      redis: this.redis,
      userId: user.sub,
      companyId: user.companyId,
      cacheTtlSeconds: this.config.permissionsCacheTtlSeconds,
    });

    // 检查用户是否拥有所有必需的权限
    const ok = required.every((p) => permissions.includes(p));
    if (!ok) throw new ForbiddenException();
    return true;
  }
}

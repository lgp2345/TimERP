import { CanActivate, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { type Db } from "@repo/db";
import { resolveUserPermissions } from "../core/rbac";
import { type AuthConfig, type RedisLike } from "../core/types";
import { REQUIRE_PERMISSIONS_KEY } from "./permissions.decorator";
import { AUTH_CONFIG, AUTH_DB, AUTH_REDIS } from "./tokens";
import { type TenantRequest } from "./request-types";

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_DB) private readonly db: Db,
    @Inject(AUTH_REDIS) private readonly redis: RedisLike | null,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfig,
  ) {}

  async canActivate(context: Parameters<CanActivate["canActivate"]>[0]) {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRE_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest() as TenantRequest;
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const permissions = await resolveUserPermissions({
      db: this.db,
      redis: this.redis,
      userId: user.sub,
      companyId: user.companyId,
      cacheTtlSeconds: this.config.permissionsCacheTtlSeconds,
    });

    const ok = required.every((p) => permissions.includes(p));
    if (!ok) throw new ForbiddenException();
    return true;
  }
}



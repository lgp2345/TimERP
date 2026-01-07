import { CanActivate, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { type JwtClaims } from "@repo/schema";
import { verifyAccessToken, type AuthConfig } from "@repo/auth";
import { AUTH_CONFIG } from "./tokens";
import { type TenantRequest } from "./request-types";

/**
 * 从请求头中提取 Bearer Token
 */
function extractBearer(req: TenantRequest): string | null {
  const raw = req.headers.authorization ?? req.headers.Authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const [kind, token] = value.split(" ");
  if (kind?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

/**
 * JWT 认证守卫
 * 验证请求中的 Bearer Token，解析 JWT 并将用户声明附加到请求对象上
 * 
 * 使用方式：
 * ```typescript
 * @UseGuards(AuthGuard)
 * @Get()
 * async protectedRoute() { ... }
 * ```
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_CONFIG) private readonly config: AuthConfig) {}

  async canActivate(context: Parameters<CanActivate["canActivate"]>[0]) {
    const req = context.switchToHttp().getRequest() as TenantRequest;
    const token = extractBearer(req);
    if (!token) throw new UnauthorizedException();

    let claims: JwtClaims;
    try {
      claims = await verifyAccessToken(this.config.jwt, token);
    } catch {
      throw new UnauthorizedException();
    }

    req.user = claims;
    return true;
  }
}


import { CanActivate, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { type JwtClaims } from "@repo/schema";
import { verifyAccessToken } from "../core/jwt";
import { type AuthConfig } from "../core/types";
import { AUTH_CONFIG } from "./tokens";
import { type TenantRequest } from "./request-types";

function extractBearer(req: TenantRequest): string | null {
  const raw = req.headers.authorization ?? req.headers.Authorization;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const [kind, token] = value.split(" ");
  if (kind?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

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



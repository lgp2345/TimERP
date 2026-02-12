import {
  CanActivate,
  Injectable,
  type ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtAuthService } from "./jwt-auth.service";
import { type AuthenticatedRequest } from "./auth.types";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  /**
   * Validates bearer access token and attaches auth user context to request.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const rawAuthorization = request.headers.authorization;
    const authorization = Array.isArray(rawAuthorization)
      ? rawAuthorization[0]
      : rawAuthorization;

    if (!authorization) {
      throw new UnauthorizedException("Missing access token");
    }
    if (!authorization.startsWith("Bearer ")) {
      throw new UnauthorizedException("Invalid authorization header");
    }

    const token = authorization.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException("Missing access token");
    }

    const claims = await this.jwtAuthService.verifyAccessToken(token);
    request.authUser = {
      id: claims.sub,
      companyId: claims.companyId,
      membershipId: claims.membershipId,
      jti: claims.jti,
    };
    return true;
  }
}

import {
  CanActivate,
  Injectable,
  type ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { JwtAuthService } from "./jwt-auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      FastifyRequest & {
        authUser?: {
          id: string;
          companyId: string;
          membershipId: string;
          jti: string;
        };
      }
    >();
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

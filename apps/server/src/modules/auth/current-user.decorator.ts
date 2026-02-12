import {
  createParamDecorator,
  type ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { type AuthenticatedRequest, type AuthUser } from "./auth.types";

export const CurrentUser = createParamDecorator(
  /**
   * Extracts authenticated user from request context.
   */
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.authUser) {
      throw new UnauthorizedException("Unauthorized");
    }
    return request.authUser;
  }
);

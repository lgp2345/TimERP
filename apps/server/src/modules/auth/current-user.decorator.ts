import {
  UnauthorizedException,
  createParamDecorator,
  type ExecutionContext,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { type AuthUser } from "./auth.types";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser => {
    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest & { authUser?: AuthUser }>();
    if (!request.authUser) {
      throw new UnauthorizedException("Unauthorized");
    }
    return request.authUser;
  }
);

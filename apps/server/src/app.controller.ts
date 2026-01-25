import { Controller, Get } from "@nestjs/common";
import {
  AllowAnonymous,
  OptionalAuth,
  Session,
} from "@sapix/nestjs-better-auth-fastify";
import type { Session as BetterAuthSession } from "./modules/auth/auth";

@Controller()
export class AppController {
  @Get("public")
  @AllowAnonymous()
  getPublicData() {
    return { message: "This is public" };
  }

  @Get()
  @OptionalAuth()
  getHello(@Session() session: BetterAuthSession | null) {
    if (session) {
      return {
        message: "Hello authenticated user!",
        user: session.user,
        sessionType: "session or jwt",
      };
    }
    return { message: "Hello anonymous user!" };
  }

  @Get("protected")
  getProtected(@Session() session: BetterAuthSession) {
    return {
      message: "This is a protected route",
      user: session.user,
    };
  }
}

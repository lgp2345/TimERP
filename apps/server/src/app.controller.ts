import { Controller, Get, UseGuards } from "@nestjs/common";
import { type AuthUser } from "./modules/auth/auth.types";
import { AuthGuard } from "./modules/auth/auth.guard";
import { CurrentUser } from "./modules/auth/current-user.decorator";

@Controller()
export class AppController {
  @Get("public")
  getPublicData() {
    return { message: "This is public" };
  }

  @Get()
  getHello() {
    return { message: "Hello anonymous user!" };
  }

  @Get("protected")
  @UseGuards(AuthGuard)
  getProtected(@CurrentUser() user: AuthUser) {
    return {
      message: "This is a protected route",
      user,
    };
  }
}

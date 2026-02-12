import { Module } from "@nestjs/common";
import { AuthCaptchaService } from "./auth-captcha.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { JwtAuthService } from "./jwt-auth.service";
import { PermissionsGuard } from "./permissions.guard";

@Module({
  controllers: [AuthController],
  providers: [
    AuthCaptchaService,
    AuthService,
    JwtAuthService,
    AuthGuard,
    PermissionsGuard,
  ],
  exports: [JwtAuthService, AuthGuard, PermissionsGuard],
})
export class AuthModule {}

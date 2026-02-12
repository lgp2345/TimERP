import { Module } from "@nestjs/common";
import { AuthCaptchaService } from "./auth-captcha.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { JwtAuthService } from "./jwt-auth.service";
import { PermissionsGuard } from "./permissions.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthCaptchaService, JwtAuthService, AuthGuard, PermissionsGuard],
  exports: [JwtAuthService, AuthGuard, PermissionsGuard],
})
export class AuthModule {}

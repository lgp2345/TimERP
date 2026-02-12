import { Module } from "@nestjs/common";
import { AuthCaptchaService } from "./auth-captcha.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { JwtAuthService } from "./jwt-auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthCaptchaService, JwtAuthService, AuthGuard],
  exports: [JwtAuthService, AuthGuard],
})
export class AuthModule {}

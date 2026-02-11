import { Module } from "@nestjs/common";
import { AuthModule as Auth } from "@sapix/nestjs-better-auth-fastify";
import { AuthCaptchaService } from "./auth-captcha.service";
import { auth } from "./auth";
import { AuthController } from "./auth.controller";

@Module({
  imports: [Auth.forRoot({ auth })],
  controllers: [AuthController],
  providers: [AuthCaptchaService],
})
export class AuthModule {}

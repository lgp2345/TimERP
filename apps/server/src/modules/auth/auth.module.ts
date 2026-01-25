import { Module } from "@nestjs/common";
import { AuthModule as Auth } from "@sapix/nestjs-better-auth-fastify";
import { auth } from "./auth";
import { AuthController } from "./auth.controller";

@Module({
  imports: [Auth.forRoot({ auth })],
  controllers: [AuthController],
})
export class AuthModule {}

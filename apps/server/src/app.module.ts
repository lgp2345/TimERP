import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@sapix/nestjs-better-auth-fastify";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { auth } from "./modules/auth/auth";
import { LoginController } from "./modules/auth/login.controller";
import { I18nModule } from "./modules/i18n";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule,
    AuthModule.forRoot({ auth }),
  ],
  controllers: [AppController, LoginController],
  providers: [AppService],
})
export class AppModule {}

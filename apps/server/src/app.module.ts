// apps/server/src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth";
import { I18nModule } from "./modules/i18n";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule,
    AuthModule.forRoot({
      databaseUrl: process.env.DATABASE_URL ?? "",
      redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
      jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
      cookieSecure: process.env.NODE_ENV === "production",
      cookieSameSite: "lax",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
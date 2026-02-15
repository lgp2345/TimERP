import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database";
import { AuthModule } from "./modules/auth/auth.module";
import { DepartmentModule } from "./modules/department/department.module";
import { I18nModule } from "./modules/i18n";
import { SystemBootstrapModule } from "./modules/system-bootstrap/system-bootstrap.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
    }),
    DatabaseModule,
    I18nModule,
    AuthModule,
    DepartmentModule,
    SystemBootstrapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

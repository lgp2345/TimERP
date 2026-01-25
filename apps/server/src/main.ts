import "reflect-metadata";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { REQUEST_CONFIG } from "@repo/config/request";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bodyParser: false }
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: REQUEST_CONFIG.version,
    prefix: REQUEST_CONFIG.versionPrefix,
  });
  app.setGlobalPrefix(REQUEST_CONFIG.prefix);
  await app.listen(3000, "0.0.0.0");
}

bootstrap();

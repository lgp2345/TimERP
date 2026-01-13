import { Module } from "@nestjs/common";
import { I18nModule as NestI18nModule, AcceptLanguageResolver, I18nJsonLoader } from "nestjs-i18n";
import * as path from "node:path";

const getI18nPath = () => {
  const cwd = process.cwd();
  if (cwd.endsWith("apps/server")) {
    return path.join(cwd, "../../packages/i18n/src/");
  }
  return path.join(cwd, "packages/i18n/src/");
};

@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: "zh",
      loader: I18nJsonLoader,
      loaderOptions: {
        path: getI18nPath(),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
})
export class I18nModule {}


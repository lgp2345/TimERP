import en from "@repo/i18n/en";
import zh from "@repo/i18n/zh";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "zh",
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n };

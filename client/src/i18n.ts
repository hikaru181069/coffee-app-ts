import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ja } from "./locales/ja.ts";
import { en } from "./locales/en.ts";

i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng: "ja",
  fallbackLng: "ja",
});

export default i18n;

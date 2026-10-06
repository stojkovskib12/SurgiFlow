import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from "./en.json";
import macedonian from "./mkd.json";

export type SupportedLanguage = "en" | "mkd";

export const LANGUAGE_STORAGE_KEY = "surgiflow-language";

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "mkd" ? "mkd" : "en";
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: english },
    mkd: { translation: macedonian },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "mkd"],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language === "mkd" ? "mk" : "en";
  }

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language changes still apply for the current session when storage is unavailable.
    }
  }
});

export const changeAppLanguage = (language: SupportedLanguage): void => {
  void i18n.changeLanguage(language);
};

export default i18n;

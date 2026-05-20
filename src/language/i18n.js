import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { arabic } from "./ar";

const languageLoaders = {
  en: () => import("./en").then((m) => m.english),
  fr: () => import("./fr").then((m) => m.french),
};

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: arabic },
  },
  lng: "ar",
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", async (lng) => {
  if (!i18n.hasResourceBundle(lng, "translation") && languageLoaders[lng]) {
    const translation = await languageLoaders[lng]();
    i18n.addResourceBundle(lng, "translation", translation);
  }
});

if (typeof window !== "undefined") {
  const stored = localStorage.getItem("language-setting");
  if (stored) {
    try {
      const langCode = JSON.parse(stored).languageCode || stored.replace(/"/g, "");
      if (langCode && langCode !== "ar" && languageLoaders[langCode]) {
        languageLoaders[langCode]().then((translation) => {
          i18n.addResourceBundle(langCode, "translation", translation);
          i18n.changeLanguage(langCode);
        });
      }
    } catch {}
  }
}

export default i18n;

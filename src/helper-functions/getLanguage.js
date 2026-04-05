const rtlLanguages = [
  "ar",
  "arc",
  "dv",
  "fa",
  "ha",
  "he",
  "khw",
  "ks",
  "ku",
  "ps",
  "ur",
  "yl",
];

export const getLanguage = () => {
  if (typeof window === "undefined") return "ltr";

  try {
    const settings = JSON.parse(window.localStorage.getItem("settings"));
    if (settings?.direction) {
      return settings.direction;
    }
  } catch {
    // ignore malformed settings
  }

  const documentDir = window.document?.documentElement?.getAttribute("dir");
  if (documentDir === "rtl" || documentDir === "ltr") {
    return documentDir;
  }

  try {
    const savedLanguage = JSON.parse(
      window.localStorage.getItem("language-setting")
    );

    if (savedLanguage && typeof savedLanguage === "string") {
      return rtlLanguages.includes(savedLanguage) ? "rtl" : "ltr";
    }
  } catch {
    // ignore malformed language storage
  }

  return "ltr";
};
export const getModule = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(window.localStorage.getItem("module"));
  }
};

import { ui, defaultLang, type Lang, type TranslationKey } from "./ui";

export type { Lang, TranslationKey } from "./ui";

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split("/");
  if (maybeLang && maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getLocalizedPath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return `/${lang}${clean === "/" ? "" : clean}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === "es" ? "en" : "es";
}

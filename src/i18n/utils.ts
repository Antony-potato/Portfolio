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

// Segmentos de ruta que cambian de nombre entre idiomas
const routes = { proyectos: "projects", servicios: "services", contacto: "contact" } as const;

/** Ruta equivalente en el otro idioma: /proyectos/pocky ↔ /en/projects/pocky */
export function getAlternatePath(lang: Lang, pathname: string): string {
  const other = getAlternateLang(lang);
  const bare = lang === defaultLang ? pathname : pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const [, first = "", ...rest] = bare.split("/");
  const seg =
    other === "en"
      ? (routes[first as keyof typeof routes] ?? first)
      : (Object.keys(routes).find((es) => routes[es as keyof typeof routes] === first) ?? first);
  return getLocalizedPath(other, ["", seg, ...rest].join("/").replace(/\/$/, "") || "/");
}

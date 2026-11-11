import { existsSync } from "node:fs";
import type { Lang } from "~/i18n/utils";

/** Solo servidor (build). Devuelve la ruta del CV del idioma si el PDF existe en public/cv/. */
export function cvPath(lang: Lang): string | null {
  const path = `/cv/antonio-cortazar-${lang}.pdf`;
  return existsSync(`public${path}`) ? path : null;
}

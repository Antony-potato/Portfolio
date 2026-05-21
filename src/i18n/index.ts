import { ui } from './ui';

export const LANGUAGES = {
  es: { name: 'Español', flag: '🇲🇽' },
  en: { name: 'English', flag: '🇺🇸' },
} as const;

export type Lang = keyof typeof LANGUAGES;

export const defaultLang: Lang = 'es';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in LANGUAGES) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang]?.[key] || ui.es[key] || key;
  };
}

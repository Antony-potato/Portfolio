export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: "website" | "article";
  lang?: "es" | "en";
}

export const SITE = {
  name: "Antonio Cortázar",
  url: "https://antoniocortazar.dev",
  defaultTitle: "Antonio Cortázar — Software Engineer",
  defaultDescription: "Portafolio de Antonio Cortázar Jiménez. Frontend, PWA y DevOps. Astro, React, Tailwind, AWS.",
  defaultImage: "/og-default.png",
  twitter: "@antony_cj",
  author: "Antonio Cortázar Jiménez",
};

export function buildTitle(title?: string): string {
  if (!title) return SITE.defaultTitle;
  return `${title} — ${SITE.name}`;
}

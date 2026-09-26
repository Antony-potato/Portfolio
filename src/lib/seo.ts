export interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: "website" | "article";
  lang?: "es" | "en";
}

export const SITE = {
  name: "Antonio Cortazar",
  url: "https://antoniocortazar.dev",
  defaultTitle: "Antonio Cortazar — Software Engineer",
  defaultDescription: "Portafolio de Antonio Cortazar Jimenez. Frontend, integraciones con Firebase y optimización de sistemas. Astro, Next.js, React y TypeScript.",
  defaultImage: "/og-default.png",
  twitter: "@antony_cj",
  author: "Antonio Cortazar Jimenez",
};

export function buildTitle(title?: string): string {
  if (!title) return SITE.defaultTitle;
  // Evita "Antonio Cortazar — Software Engineer — Antonio Cortazar".
  if (title.includes(SITE.name)) return title;
  return `${title} — ${SITE.name}`;
}

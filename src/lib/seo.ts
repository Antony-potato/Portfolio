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
  defaultDescription: "Portafolio de Antonio Cortazar Jimenez. Frontend, PWA y DevOps. Astro, React, Tailwind, AWS.",
  defaultImage: "/og/home.png",
  twitter: "@antony_cj",
  author: "Antonio Cortazar Jimenez",
};

export function buildTitle(title?: string): string {
  if (!title) return SITE.defaultTitle;
  return `${title} — ${SITE.name}`;
}

/** Schema.org `Person` para la home (AGENTS.md §9) */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.author,
  url: SITE.url,
  image: `${SITE.url}/og/home.png`,
  jobTitle: "Software Engineer",
  email: "mailto:hola@antoniocortazar.dev",
  address: { "@type": "PostalAddress", addressLocality: "Cancún", addressRegion: "Quintana Roo", addressCountry: "MX" },
  knowsAbout: ["Astro", "React", "TypeScript", "Firebase", "AWS", "PWA", "DevOps"],
  sameAs: ["https://github.com/Antony-potato", "https://linkedin.com/in/antoniocortazar"],
};

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
  url: "https://www.antoniocortazar.dev",
  defaultTitle: "Antonio Cortazar — Software Engineer",
  defaultDescription: "Portafolio de Antonio Cortazar Jimenez. Frontend, integraciones con Firebase y optimización de sistemas. Astro, Next.js, React y TypeScript.",
  defaultImage: "/og/home.png",
  twitter: "@antony_cj",
  author: "Antonio Cortazar Jimenez",
};

/** Súbelo al cambiar las imágenes de /og: WhatsApp, LinkedIn y compañía guardan la vista previa por URL de imagen */
export const OG_VERSION = 2;

export function buildTitle(title?: string): string {
  if (!title) return SITE.defaultTitle;
  // Evita "Antonio Cortazar — Software Engineer — Antonio Cortazar".
  if (title.includes(SITE.name)) return title;
  return `${title} — ${SITE.name}`;
}

/** Schema.org `Person` para la home (AGENTS.md §9) */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.author,
  url: SITE.url,
  image: `${SITE.url}/og/home.png?v=${OG_VERSION}`,
  jobTitle: "Software Engineer",
  email: "mailto:hola@antoniocortazar.dev",
  address: { "@type": "PostalAddress", addressLocality: "Cancún", addressRegion: "Quintana Roo", addressCountry: "MX" },
  knowsAbout: ["Astro", "React", "TypeScript", "Firebase", "AWS", "PWA", "DevOps"],
  sameAs: ["https://github.com/Antony-potato", "https://linkedin.com/in/antoniocortazar"],
};

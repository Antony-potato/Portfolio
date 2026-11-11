import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Un .mdx por proyecto e idioma: `projects/<slug>.mdx` (es) y `projects/en/<slug>.mdx` (en)
const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(180),
      role: z.string(),
      year: z.number().int().min(2020).max(2100),
      client: z.string().optional(),
      stack: z.array(z.string()).min(1),
      category: z.enum(["web", "pwa", "dashboard", "infra", "design"]),
      liveUrl: z.url().nullable().optional(),
      repoUrl: z.url().nullable().optional(),
      cover: image(),
      gallery: z.array(image()).optional(),
      /** Cifras medidas (p. ej. Lighthouse); solo datos verificables */
      metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
      /** De dónde salen las cifras (p. ej. "Lighthouse móvil · sep 2026"); si falta, "Cifras clave" */
      metricsNote: z.string().optional(),
      /** Color de marca del proyecto: fondo del escaparate del home cuando está activo (cualquier color CSS) */
      accent: z.string().optional(),
      /** Texto sobre `accent`: claro u oscuro (lo que dé contraste AA) */
      accentInk: z.enum(["light", "dark"]).default("light"),
      featured: z.boolean().default(false),
      order: z.number().int().default(99),
      lang: z.enum(["es", "en"]).default("es"),
      /** Borrador: no se publica en listados, rutas ni sitemap. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };

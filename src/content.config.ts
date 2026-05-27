import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(180),
    role: z.string(),
    year: z.number().int().min(2020).max(2100),
    client: z.string().optional(),
    stack: z.array(z.string()).min(1),
    category: z.enum(["web", "pwa", "dashboard", "infra", "design"]),
    liveUrl: z.url().nullable().optional(),
    repoUrl: z.url().nullable().optional(),
    cover: z.string(),
    gallery: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    order: z.number().int().default(99),
    lang: z.enum(["es", "en"]).default("es"),
  }),
});

export const collections = { projects };

import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "~/i18n/utils";

export type Project = CollectionEntry<"projects">;

/** Slug público: los .mdx en inglés viven en `en/`, pero comparten URL con el español. */
export const projectSlug = (p: Project) => p.id.replace(/^en\//, "");

/**
 * Proyectos publicados para un idioma, ordenados por `order`.
 * Las traducciones viven en `src/content/projects/en/<slug>.mdx`; si falta una,
 * se usa la versión en español. Los `draft: true` nunca se publican (AGENTS.md §6).
 */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection("projects", (p) => !p.data.draft);
  const bySlug = new Map<string, Project>();

  for (const p of all) {
    const slug = projectSlug(p);
    if (p.data.lang === lang) bySlug.set(slug, p); // la versión del idioma pedido gana
    else if (p.data.lang === "es" && !bySlug.has(slug)) bySlug.set(slug, p); // respaldo en español
  }

  return [...bySlug.values()].sort((a, b) => a.data.order - b.data.order);
}

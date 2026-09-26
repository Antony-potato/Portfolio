import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "~/i18n/utils";

export type Project = CollectionEntry<"projects"> & { slug: string };

const EN_PREFIX = "en/";

/**
 * Proyectos publicados para un idioma, ordenados por `order`.
 * Las traducciones viven en `src/content/projects/en/<slug>.mdx`; si falta una,
 * se usa la versión en español. Los `draft: true` nunca se publican.
 */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection("projects", ({ data }) => !data.draft);
  const bySlug = new Map<string, Project>();

  for (const entry of all) {
    const isEn = entry.id.startsWith(EN_PREFIX);
    const slug = isEn ? entry.id.slice(EN_PREFIX.length) : entry.id;
    if (isEn && lang !== "en") continue;
    // La traducción gana sobre la versión en español.
    if (!isEn && bySlug.has(slug)) continue;
    bySlug.set(slug, { ...entry, slug });
  }

  return [...bySlug.values()].sort((a, b) => a.data.order - b.data.order);
}

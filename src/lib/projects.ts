import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "~/i18n/utils";

export type Project = CollectionEntry<"projects">;

/** Slug público: los .mdx en inglés viven en `en/`, pero comparten URL con el español. */
export const projectSlug = (p: Project) => p.id.replace(/^en\//, "");

export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection("projects", (p) => p.data.lang === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

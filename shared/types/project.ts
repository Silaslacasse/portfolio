export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * A field that exists once per language.
 *
 * French is the source language and is always present; English is optional so a project
 * can be published before it is translated. Read through `localized()` rather than
 * indexing directly, so a missing translation falls back instead of rendering empty.
 */
export interface Localized {
  fr: string;
  en?: string;
}

export type ProjectStatus = "draft" | "published";

export interface Project {
  _id: string;
  slug: string;
  title: Localized;
  summary: Localized;
  description: Localized;
  coverImage: string | null;
  gallery: string[];
  technologies: string[];
  role: string;
  client: string;
  year: number | null;
  url: string;
  repoUrl: string;
  featured: boolean;
  order: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

/** What the public API returns: one language, already resolved. */
export interface ResolvedProject extends Omit<Project, "title" | "summary" | "description"> {
  title: string;
  summary: string;
  description: string;
}

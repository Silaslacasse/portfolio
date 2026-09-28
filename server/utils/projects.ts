import type { H3Event } from "h3";
import type { Types } from "mongoose";
import {
  LOCALES,
  type Locale,
  type ProjectCard,
  type ResolvedProject,
} from "#shared/types/project";
import { localized } from "#shared/utils/localized";
import type { ProjectDocument } from "../models/project.model";

/**
 * Reads `?locale=` and falls back to French rather than answering 400: an unknown value
 * means one of our own links is wrong, and the visitor should still get a page.
 */
export const localeFromQuery = (event: H3Event): Locale => {
  const value = getQuery(event).locale;
  return LOCALES.includes(value as Locale) ? (value as Locale) : "fr";
};

type LeanProject = ProjectDocument & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

/** Flattens a stored project to one language. Explicit field list so `__v` never leaks. */
export const resolveProject = (doc: LeanProject, locale: Locale): ResolvedProject => ({
  _id: String(doc._id),
  slug: doc.slug,
  title: localized(doc.title, locale),
  summary: localized(doc.summary, locale),
  description: localized(doc.description, locale),
  coverImage: doc.coverImage ?? null,
  gallery: doc.gallery,
  technologies: doc.technologies,
  role: doc.role,
  client: doc.client,
  year: doc.year ?? null,
  url: doc.url,
  repoUrl: doc.repoUrl,
  featured: doc.featured,
  order: doc.order,
  status: doc.status,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});

export const toCard = ({ description: _description, ...card }: ResolvedProject): ProjectCard =>
  card;

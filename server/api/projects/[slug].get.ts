import Project from "../../models/project.model";
import type { ProjectDetail } from "#shared/types/project";
import { localized } from "#shared/utils/localized";

export default defineEventHandler(async (event): Promise<ProjectDetail> => {
  const slug = getRouterParam(event, "slug") ?? "";
  const locale = localeFromQuery(event);

  await useDatabase();

  // Drafts answer 404 exactly like missing slugs, so their existence does not leak.
  const doc = await Project.findOne({ slug, status: "published" }).lean();
  if (!doc) throw createError({ statusCode: 404, statusMessage: "Project not found" });

  // Where the project sits in the list, for the counter and the "next project" card. One
  // small query on two fields rather than a second endpoint; the list is a handful long.
  const siblings = await Project.find({ status: "published" })
    .sort({ order: 1, createdAt: -1 })
    .select("slug title")
    .lean();
  const index = siblings.findIndex((sibling) => sibling.slug === slug);
  const next = siblings.length > 1 ? siblings[(index + 1) % siblings.length] : null;

  return {
    ...resolveProject(doc, locale),
    position: index + 1,
    total: siblings.length,
    next: next ? { slug: next.slug, title: localized(next.title, locale) } : null,
  };
});

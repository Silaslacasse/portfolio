import Project from "../../models/project.model";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") ?? "";
  const locale = localeFromQuery(event);

  await useDatabase();

  // Drafts answer 404 exactly like missing slugs, so their existence does not leak.
  const doc = await Project.findOne({ slug, status: "published" }).lean();
  if (!doc) throw createError({ statusCode: 404, statusMessage: "Project not found" });

  return resolveProject(doc, locale);
});

import Project from "../../models/project.model";

/** Published projects in display order, resolved to the requested locale. */
export default defineEventHandler(async (event) => {
  const locale = localeFromQuery(event);

  await useDatabase();

  const docs = await Project.find({ status: "published" })
    .sort({ order: 1, createdAt: -1 })
    .select("-description")
    .lean();

  return docs.map((doc) => toCard(resolveProject(doc, locale)));
});

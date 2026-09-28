import Project from "../../../models/project.model";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = projectIdParam(event);

  await useDatabase();

  const doc = await Project.findById(id).lean();
  if (!doc) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  return doc;
});

import Project from "../../../models/project.model";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = objectIdParam(event, "Project not found");

  await useDatabase();

  const deleted = await Project.findByIdAndDelete(id).lean();
  if (!deleted) throw createError({ statusCode: 404, statusMessage: "Project not found" });
  return sendNoContent(event);
});

import Project from "../../../models/project.model";

/** Every project, drafts included, raw (both languages) for the admin list. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  await useDatabase();

  return Project.find().sort({ order: 1, createdAt: -1 }).select("-description").lean();
});

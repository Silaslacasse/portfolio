import Project from "../../../models/project.model";
import { projectSchema } from "#shared/schemas/project";
import { fieldErrors } from "#shared/utils/validation";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = projectIdParam(event);

  const parsed = projectSchema.safeParse(await readBody(event));
  if (!parsed.success) {
    setResponseStatus(event, 400);
    return {
      type: "validation",
      error: "Certains champs sont invalides.",
      fields: fieldErrors(parsed.error.issues),
    };
  }

  await useDatabase();

  try {
    const updated = await Project.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) throw createError({ statusCode: 404, statusMessage: "Project not found" });
    return updated;
  } catch (error) {
    if (!isDuplicateKey(error)) throw error;
    setResponseStatus(event, 409);
    return {
      type: "validation",
      error: "Ce slug est déjà utilisé.",
      fields: { slug: "Ce slug est déjà utilisé." },
    };
  }
});

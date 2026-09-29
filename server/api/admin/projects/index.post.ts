import Project from "../../../models/project.model";
import { projectSchema } from "#shared/schemas/project";
import { fieldErrors } from "#shared/utils/validation";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

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
    const created = await Project.create(parsed.data);
    await purgePageCache();
    setResponseStatus(event, 201);
    return created.toObject();
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

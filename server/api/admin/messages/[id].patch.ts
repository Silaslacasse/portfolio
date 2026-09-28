import { z } from "zod";
import Message from "../../../models/message.model";

const patchSchema = z
  .object({ read: z.boolean().optional(), archived: z.boolean().optional() })
  .refine((body) => body.read !== undefined || body.archived !== undefined, {
    message: "Nothing to update",
  });

/** Marks a message read/unread and/or archived/unarchived. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = objectIdParam(event, "Message not found");

  const parsed = patchSchema.safeParse(await readBody(event));
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: "Invalid body" });

  const update: Record<string, Date | null> = {};
  if (parsed.data.read !== undefined) update.readAt = parsed.data.read ? new Date() : null;
  if (parsed.data.archived !== undefined) {
    update.archivedAt = parsed.data.archived ? new Date() : null;
  }

  await useDatabase();

  const updated = await Message.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!updated) throw createError({ statusCode: 404, statusMessage: "Message not found" });
  return updated;
});

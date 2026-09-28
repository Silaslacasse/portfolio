import Message from "../../../models/message.model";

/** Manual erasure — how a GDPR deletion request gets honoured before the TTL would. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = objectIdParam(event, "Message not found");

  await useDatabase();

  const deleted = await Message.findByIdAndDelete(id).lean();
  if (!deleted) throw createError({ statusCode: 404, statusMessage: "Message not found" });
  return sendNoContent(event);
});

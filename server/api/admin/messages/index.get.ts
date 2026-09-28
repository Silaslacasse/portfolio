import Message from "../../../models/message.model";

/**
 * Every stored message, newest first — the inbox filters archived ones client-side. No
 * pagination: the contact form is limited to one message per address per day, and the
 * TTL index caps the collection at 24 months.
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  await useDatabase();

  return Message.find()
    .sort({ createdAt: -1 })
    .select(
      "name firstName society email linkedIn mobile message deliveryStatus deliveryError readAt archivedAt createdAt"
    )
    .lean();
});

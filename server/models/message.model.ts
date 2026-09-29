import mongoose, { type InferSchemaType, type Model } from "mongoose";

/**
 * A contact-form submission, stored before any delivery is attempted.
 *
 * This collection is the source of truth; email is a notification layer on top of it, so a
 * provider outage costs a notification rather than the lead. `deliveryStatus` records how
 * that notification went, and the admin inbox surfaces it — a `failed` row is a message
 * that never reached the inbox.
 *
 * It also backs the rate limiter, which avoids the separate log collection the v1 API used.
 */
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    society: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, trim: true, default: "" },
    // Kept for messages received before the 2026-09 form merged the name fields and
    // dropped LinkedIn; new documents never set them.
    firstName: { type: String, trim: true, default: "" },
    linkedIn: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true },

    ipAddress: { type: String, required: true },
    userAgent: { type: String, default: "" },

    deliveryStatus: {
      type: String,
      // `skipped` means the mailer is not configured for this environment — expected on
      // preproduction, where we do not want to burn quota or email real notifications.
      enum: ["pending", "sent", "failed", "skipped"],
      default: "pending",
      index: true,
    },
    providerMessageId: { type: String, default: null },
    deliveryError: { type: String, default: null },
    sentAt: { type: Date, default: null },

    /** For the admin inbox. */
    readAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Backs the rate-limit lookup: most recent submission for an email or an IP.
messageSchema.index({ email: 1, createdAt: -1 });
messageSchema.index({ ipAddress: 1, createdAt: -1 });

/**
 * Retention: MongoDB deletes a message 24 months after it arrived, so personal data is not
 * kept forever without anyone remembering. The privacy policy (Phase 4) must state the
 * same period. Changing it later means `collMod` on the existing index, not just editing
 * this number — Mongoose will not alter an index whose options changed.
 */
const RETENTION_SECONDS = 60 * 60 * 24 * 730;
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: RETENTION_SECONDS });

export type MessageDocument = InferSchemaType<typeof messageSchema>;

/**
 * Reuses an already-registered model on hot reload. Cast explicitly: the bare `??`
 * fallback widens the type and every query on it loses its signature.
 */
export default (mongoose.models.Message as Model<MessageDocument>) ??
  mongoose.model<MessageDocument>("Message", messageSchema);

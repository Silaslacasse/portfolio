import Message from "../models/message.model";
import { contactMessageSchema, type ContactMessageInput } from "#shared/schemas/message";

/** Largest body worth reading. The schema caps the useful content well below this. */
const MAX_BODY_BYTES = 32 * 1024;

const buildEmailBody = (input: ContactMessageInput) => {
  const linkedInUrl = safeHttpUrl(input.linkedIn);

  const rows: Array<[string, string]> = [
    ["Nom", escapeHtml(input.name)],
    ["Prénom", escapeHtml(input.firstName)],
    ["Société", escapeHtml(input.society)],
    ["Email", `<a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a>`],
    ["Téléphone", escapeHtml(input.mobile) || "—"],
    [
      "LinkedIn",
      linkedInUrl
        ? `<a href="${escapeHtml(linkedInUrl)}">${escapeHtml(linkedInUrl)}</a>`
        : escapeHtml(input.linkedIn) || "—",
    ],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#18181B">
      <h2 style="margin:0 0 16px">Nouveau message depuis le portfolio</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="color:#71717A"><strong>${label}</strong></td><td>${value}</td></tr>`
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px">Message</h3>
      <div style="white-space:pre-wrap;padding:16px;background:#F4F4F5;border-radius:8px">${escapeHtml(
        input.message
      )}</div>
    </div>
  `.trim();

  const text = [
    "Nouveau message depuis le portfolio",
    "",
    `Nom       : ${input.name}`,
    `Prénom    : ${input.firstName}`,
    `Société   : ${input.society}`,
    `Email     : ${input.email}`,
    `Téléphone : ${input.mobile || "—"}`,
    `LinkedIn  : ${input.linkedIn || "—"}`,
    "",
    "Message:",
    input.message,
  ].join("\n");

  return { html, text };
};

/**
 * Notifies about a stored message and records the outcome on the document.
 *
 * Never throws: the submission is already safe, so a delivery failure is recorded for the
 * admin inbox rather than shown to the visitor as an error.
 */
const deliver = async (messageId: unknown, input: ContactMessageInput): Promise<void> => {
  const { html, text } = buildEmailBody(input);
  const subject = sanitizeHeader(
    `Portfolio — ${input.firstName} ${input.name} (${input.society})`
  );

  try {
    const result = await sendEmail({ subject, html, text, replyTo: input.email });

    await Message.findByIdAndUpdate(
      messageId,
      result.status === "sent"
        ? {
            deliveryStatus: "sent",
            providerMessageId: result.id,
            sentAt: new Date(),
            deliveryError: null,
          }
        : { deliveryStatus: "skipped", deliveryError: result.reason }
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error("Contact notification failed (message is stored):", reason);

    await Message.findByIdAndUpdate(messageId, {
      deliveryStatus: "failed",
      deliveryError: reason,
    });
  }

  await notifyWebhook(
    `📬 Nouveau message portfolio — ${sanitizeHeader(
      `${input.firstName} ${input.name}`
    )} (${sanitizeHeader(input.society)}) · ${sanitizeHeader(input.email)}`
  );
};

/**
 * Contact form endpoint.
 *
 * Same-origin now that the app and API are one deployment, which is what removes the CORS
 * configuration and the spoofable Origin/Referer guard the standalone API needed.
 *
 * The response reports success once the message is *stored*. Delivery is attempted after
 * and its failure is recorded on the document, not shown to the visitor: the submission is
 * safe either way, and asking someone to retype their message because a mail API had a bad
 * minute would be the wrong trade.
 */
export default defineEventHandler(async (event) => {
  const contentLength = Number(getRequestHeader(event, "content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    setResponseStatus(event, 413);
    return { type: "payloadTooLarge", error: "Le message est trop volumineux." };
  }

  const parsed = contactMessageSchema.safeParse(await readBody(event));

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fields[key]) fields[key] = issue.message;
    }

    setResponseStatus(event, 400);
    return { type: "validation", error: "Certains champs sont invalides.", fields };
  }

  const input = parsed.data;
  const ipAddress = getClientIp(event);

  try {
    await useDatabase();

    // One message per email address or IP per window. Reads the messages collection
    // directly rather than a separate log, so the address recorded and the address
    // checked cannot drift apart.
    const windowMs = Number(useRuntimeConfig().messageRateLimitHours || 24) * 60 * 60 * 1000;

    const recent = await Message.findOne({
      createdAt: { $gte: new Date(Date.now() - windowMs) },
      $or: [{ email: input.email }, { ipAddress }],
    })
      .select("_id")
      .lean();

    if (recent) {
      setResponseStatus(event, 429);
      return {
        type: "rateLimit",
        error: "Vous ne pouvez envoyer qu'un message par jour.",
      };
    }

    const stored = await Message.create({
      ...input,
      ipAddress,
      userAgent: getRequestHeader(event, "user-agent") ?? "",
      deliveryStatus: "pending",
    });

    await deliver(stored._id, input);

    setResponseStatus(event, 201);
    return { success: true, message: "Message envoyé avec succès." };
  } catch (error) {
    // Only reached if persistence itself failed, which is the one case worth a 500.
    console.error("Failed to store contact message:", error);

    setResponseStatus(event, 500);
    return {
      type: "serverError",
      error: "Une erreur est survenue. Merci de réessayer plus tard.",
    };
  }
});

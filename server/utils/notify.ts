/**
 * Best-effort ping to a Discord/Telegram webhook, independent of email.
 *
 * Deliberately never throws: this is a redundant notification path, so an outage here must
 * not affect the request that triggered it. If email delivery breaks, this still reaches you.
 */
export const notifyWebhook = async (content: string): Promise<void> => {
  const { notifyWebhookUrl } = useRuntimeConfig();
  if (!notifyWebhookUrl) return;

  try {
    const response = await fetch(notifyWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `content` is Discord's field, `text` is Telegram's — sending both works with either.
      body: JSON.stringify({ content, text: content }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`Backup webhook returned ${response.status}`);
    }
  } catch (error) {
    console.warn("Backup webhook failed:", error);
  }
};

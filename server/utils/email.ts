import { Resend } from "resend";

export interface SendEmailOptions {
  subject: string;
  html: string;
  text: string;
  /**
   * The visitor's address. It goes in `Reply-To`, never in `From`.
   *
   * A visitor address in `From` means sending mail claiming to be a domain you do not
   * control: it fails DMARC and reliably lands in spam. With `Reply-To`, hitting reply in
   * your mail client still answers the visitor directly.
   */
  replyTo?: string;
}

export type SendEmailResult =
  | { status: "sent"; id: string | null }
  | { status: "skipped"; reason: string };

/**
 * Sends through Resend's HTTPS API rather than SMTP, because most VPS hosts block or
 * throttle outbound 25/465/587 — the likely cause of the original delivery failures.
 *
 * Returns `skipped` rather than throwing when the mailer is not configured. That is the
 * normal state on preproduction, where we do not want to burn quota or send real
 * notifications, and the submission is already stored either way.
 */
export const sendEmail = async ({
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> => {
  const { resendApiKey, mailFrom, mailTo } = useRuntimeConfig();

  if (!resendApiKey || !mailFrom || !mailTo) {
    return { status: "skipped", reason: "Mailer is not configured in this environment." };
  }

  const { data, error } = await new Resend(resendApiKey).emails.send({
    from: mailFrom,
    to: mailTo,
    subject,
    html,
    text,
    ...(replyTo ? { replyTo } : {}),
  });

  // The SDK reports failures in the response body rather than by throwing.
  if (error) {
    throw new Error(`Resend rejected the message: ${error.message}`);
  }

  return { status: "sent", id: data?.id ?? null };
};

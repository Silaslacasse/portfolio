const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes a value for interpolation into the notification email's HTML body.
 *
 * Without this a visitor controls markup in an email you will open: the LinkedIn field
 * sits inside an `href` and can break out of the attribute entirely.
 */
export const escapeHtml = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]!);

/**
 * Strips CR/LF and collapses whitespace for values used in an email header.
 *
 * A newline in a header value lets the sender append headers of their own.
 */
export const sanitizeHeader = (value: unknown, maxLength = 200): string =>
  String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

/**
 * Returns the URL only when it is a plain http(s) link, so it can safely become an `href`.
 * Anything else (`javascript:`, `data:`, junk) comes back null and is rendered as text.
 */
export const safeHttpUrl = (value: unknown): string | null => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

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
 * Without this a visitor controls markup in an email you will open.
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

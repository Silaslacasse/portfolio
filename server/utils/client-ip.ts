import type { H3Event } from "h3";

/**
 * Best-effort client address, for the per-IP rate limit.
 *
 * The request path here is client → Cloudflare → nginx proxy manager → Nitro, so the
 * socket address is always the local proxy and `X-Forwarded-For` is a chain.
 *
 * `CF-Connecting-IP` is preferred because Cloudflare sets it to the address that actually
 * opened the connection, overwriting anything the client sent. The first entry of
 * `X-Forwarded-For` is *not* equivalent: a client can send its own `X-Forwarded-For`, which
 * Cloudflare appends to rather than replaces, so the leading entry is attacker-controlled.
 *
 * None of this is authentication — someone reaching the origin directly could forge these.
 * It is proportionate for a contact-form limit, and Turnstile is the real anti-abuse
 * control arriving with the admin work.
 */
export const getClientIp = (event: H3Event): string => {
  const cloudflare = getRequestHeader(event, "cf-connecting-ip")?.trim();
  if (cloudflare) return cloudflare;

  const forwarded = getRequestHeader(event, "x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;

  return event.node.req.socket.remoteAddress ?? "unknown";
};

import { Buffer } from "node:buffer";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Paths that must stay reachable without credentials.
 *
 * The healthcheck is the important one: if the platform's probe gets a 401 the container
 * is marked unhealthy and the proxy stops routing to it — a self-inflicted outage.
 */
const PUBLIC_PATHS = new Set(["/api/health"]);

/**
 * Compares via fixed-length digests so neither the result nor the *length* of the secret
 * leaks through timing. `timingSafeEqual` throws on mismatched lengths, which would
 * otherwise reveal how long the real credential is.
 */
const matches = (candidate: string, expected: string): boolean =>
  timingSafeEqual(
    createHash("sha256").update(candidate).digest(),
    createHash("sha256").update(expected).digest()
  );

const isAuthorised = (header: string, user: string, password: string): boolean => {
  const [scheme, encoded] = header.split(" ");
  if (scheme?.toLowerCase() !== "basic" || !encoded) return false;

  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const separator = decoded.indexOf(":");
  if (separator === -1) return false;

  return (
    matches(decoded.slice(0, separator), user) &&
    matches(decoded.slice(separator + 1), password)
  );
};

/**
 * HTTP basic auth for preproduction, enabled only when both credentials are configured.
 * Production leaves them unset and this is inert.
 *
 * Implemented as a `request` hook rather than `server/middleware/` because middleware runs
 * after Nitro's static asset handler: pages would be protected while every file under
 * /_nuxt and /_fonts was still served anonymously.
 */
export default defineNitroPlugin((nitroApp) => {
  const { basicAuthUser, basicAuthPassword } = useRuntimeConfig();
  if (!basicAuthUser || !basicAuthPassword) return;

  nitroApp.hooks.hook("request", (event) => {
    if (PUBLIC_PATHS.has(getRequestURL(event).pathname)) return;

    const header = getRequestHeader(event, "authorization") ?? "";
    if (isAuthorised(header, basicAuthUser, basicAuthPassword)) return;

    setResponseStatus(event, 401);
    setResponseHeader(event, "WWW-Authenticate", 'Basic realm="Preproduction", charset="UTF-8"');
    event.node.res.end("Authentication required.");
  });
});

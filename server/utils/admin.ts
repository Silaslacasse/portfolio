import type { H3Event } from "h3";
import { isValidObjectId } from "mongoose";

interface AdminSession {
  admin?: true;
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * The admin session is h3's sealed cookie (iron-webcrypto), not a JWT with refresh
 * rotation: one admin, one cookie, expiry enforced by the seal, nothing stored server-side.
 * httpOnly keeps it away from injected scripts and SameSite=Strict from cross-site
 * requests. `secure` follows the real protocol so the plain-http preproduction URL still
 * logs in; behind Cloudflare that is always https.
 */
export const useAdminSession = (event: H3Event) => {
  const { sessionSecret } = useRuntimeConfig();
  if (sessionSecret.length < 32) {
    throw createError({
      statusCode: 500,
      statusMessage: "NUXT_SESSION_SECRET must be set and at least 32 characters long.",
    });
  }

  return useSession<AdminSession>(event, {
    password: sessionSecret,
    name: "admin_session",
    maxAge: SESSION_MAX_AGE_SECONDS,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: getRequestProtocol(event, { xForwardedProto: true }) === "https",
      path: "/",
    },
  });
};

/** The `:id` route param, or 404 — a malformed ObjectId is not a document either. */
export const objectIdParam = (event: H3Event, notFound: string): string => {
  const id = getRouterParam(event, "id") ?? "";
  if (!isValidObjectId(id)) throw createError({ statusCode: 404, statusMessage: notFound });
  return id;
};

export const requireAdmin = async (event: H3Event) => {
  const session = await useAdminSession(event);
  if (session.data.admin !== true) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  return session;
};

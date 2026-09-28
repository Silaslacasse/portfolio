import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1).max(200),
});

/**
 * Login attempts per IP: 5 per 15 minutes. The day the admin ships, this becomes the
 * most-attacked endpoint on the site.
 * ponytail: in-process map — one container serves this site. Move it to MongoDB if the
 * app ever runs more than one instance.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

const tooManyAttempts = (ip: string): boolean => {
  const now = Date.now();

  // Bots rotate addresses; drop expired entries so the map cannot grow without bound.
  if (attempts.size > 1000) {
    for (const [key, entry] of attempts) if (entry.resetAt < now) attempts.delete(key);
  }

  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
};

export default defineEventHandler(async (event) => {
  const { adminEmail, adminPasswordHash } = useRuntimeConfig();
  if (!adminEmail || !adminPasswordHash) {
    throw createError({ statusCode: 503, statusMessage: "Admin login is not configured." });
  }

  const ip = getClientIp(event);
  if (tooManyAttempts(ip)) {
    throw createError({ statusCode: 429, statusMessage: "Too many attempts. Try again later." });
  }

  const parsed = credentialsSchema.safeParse(await readBody(event));
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid credentials." });
  }

  // Always run the hash: returning early on a wrong email would reveal it through timing.
  const passwordOk = await verifyPassword(parsed.data.password, adminPasswordHash);
  const emailOk = safeEqual(parsed.data.email, adminEmail.trim().toLowerCase());
  if (!emailOk || !passwordOk) {
    throw createError({ statusCode: 401, statusMessage: "Invalid credentials." });
  }

  attempts.delete(ip);
  const session = await useAdminSession(event);
  await session.update({ admin: true });
  return { ok: true };
});

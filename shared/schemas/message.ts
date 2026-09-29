import { z } from "zod";

/**
 * The contact form's wire contract, shared by the form component and the API route.
 *
 * Sharing it is the point of merging the backend in: the previous two-repo setup
 * duplicated this shape by hand and the copies had already diverged, which is what
 * silently broke the rate limiter.
 *
 * Messages are shown to the visitor as-is, so they are written in French.
 */
const required = (message: string) => z.string({ error: message }).trim().min(1, message);

export const contactMessageSchema = z.object({
  /** Full name, one field: the form merged first and last name in the 2026-09 redesign. */
  name: required("Le nom est requis").max(140, "Le nom est trop long"),
  // Optional, like the phone: a private person or a recruiter may have no company to
  // give, and GDPR minimisation says not to demand it.
  society: z.string().trim().max(200, "Le nom de société est trop long").optional().default(""),

  // Normalise before validating: `z.email()` does not trim, and pasted or
  // mobile-keyboard input routinely carries surrounding whitespace.
  email: z
    .string({ error: "L'email est requis" })
    .transform((value) => value.trim().toLowerCase())
    .pipe(z.email("Adresse email invalide").max(254, "L'email est trop long")),

  mobile: z.string().trim().max(30, "Le numéro est trop long").optional().default(""),
  message: required("Le message est requis").max(
    5000,
    "Le message est trop long (5000 caractères maximum)"
  ),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

/** Discriminator every error response carries, so the form can branch on the cause. */
export type ContactErrorType =
  "validation" | "captcha" | "rateLimit" | "payloadTooLarge" | "serverError";

export interface ContactErrorResponse {
  type: ContactErrorType;
  error: string;
  fields?: Record<string, string>;
}

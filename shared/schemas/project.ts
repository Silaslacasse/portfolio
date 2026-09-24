import { z } from "zod";

/**
 * Shared between the admin form and the API route, so the two cannot drift.
 *
 * The v1 codebase duplicated its payload shape across two repos by hand and the copies
 * had already diverged — that drift is what silently broke the contact rate limiter.
 */
const localizedField = (max: number, label: string) =>
  z.object({
    fr: z
      .string({ error: `${label} (FR) est requis` })
      .trim()
      .min(1, `${label} (FR) est requis`)
      .max(max),
    en: z.string().trim().max(max).optional().default(""),
  });

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit être en minuscules, séparé par des tirets"),

  title: localizedField(140, "Le titre"),
  summary: localizedField(300, "Le résumé"),
  description: localizedField(10000, "La description"),

  coverImage: z.string().trim().max(500).nullable().default(null),
  gallery: z.array(z.string().trim().max(500)).max(20).default([]),
  technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),

  role: z.string().trim().max(120).default(""),
  client: z.string().trim().max(120).default(""),
  year: z.coerce.number().int().min(2000).max(2100).nullable().default(null),

  url: z.union([z.url(), z.literal("")]).default(""),
  repoUrl: z.union([z.url(), z.literal("")]).default(""),

  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type ProjectInput = z.infer<typeof projectSchema>;

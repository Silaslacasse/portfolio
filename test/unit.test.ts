import { describe, expect, it } from "vitest";
import { contactMessageSchema } from "../shared/schemas/message";
import { projectSchema } from "../shared/schemas/project";
import { localized } from "../shared/utils/localized";
import { fieldErrors } from "../shared/utils/validation";
import { escapeHtml, sanitizeHeader } from "../server/utils/html";

/**
 * The pure logic the site leans on: translation fallback, the email injection defenses and
 * the shared validation contract. Anything touching Nitro (rate limit, Turnstile, admin
 * auth) is checked against a running build instead.
 */

describe("localized", () => {
  it("returns the requested language", () => {
    expect(localized({ fr: "Bonjour", en: "Hello" }, "en")).toBe("Hello");
  });

  it("falls back to French when the translation is missing or blank", () => {
    expect(localized({ fr: "Bonjour" }, "en")).toBe("Bonjour");
    expect(localized({ fr: "Bonjour", en: "   " }, "en")).toBe("Bonjour");
  });

  it("returns an empty string for a missing field", () => {
    expect(localized(undefined, "fr")).toBe("");
  });
});

describe("escapeHtml", () => {
  it("escapes markup and both quote styles", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
  });

  it("turns nullish values into an empty string", () => {
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(null)).toBe("");
  });
});

describe("sanitizeHeader", () => {
  it("strips CR/LF so a value cannot add headers of its own", () => {
    expect(sanitizeHeader("Bob\r\nBcc: attacker@example.com")).toBe(
      "Bob Bcc: attacker@example.com"
    );
  });

  it("collapses whitespace and caps the length", () => {
    expect(sanitizeHeader("  a   b  ")).toBe("a b");
    expect(sanitizeHeader("x".repeat(300))).toHaveLength(200);
  });
});

describe("contactMessageSchema", () => {
  const valid = { name: " Marie Dupont ", email: " Marie@Example.FR ", message: "Bonjour" };

  it("trims values and normalises the email", () => {
    const parsed = contactMessageSchema.parse(valid);
    expect(parsed.name).toBe("Marie Dupont");
    expect(parsed.email).toBe("marie@example.fr");
  });

  it("accepts a message without company or phone", () => {
    const parsed = contactMessageSchema.parse(valid);
    expect(parsed.society).toBe("");
    expect(parsed.mobile).toBe("");
  });

  it("strips unknown keys, so the Turnstile token is never stored", () => {
    const parsed = contactMessageSchema.parse({ ...valid, turnstileToken: "abc" });
    expect(parsed).not.toHaveProperty("turnstileToken");
  });

  it("reports errors keyed by field, as the form renders them", () => {
    const result = contactMessageSchema.safeParse({ email: "not-an-email", message: "" });
    expect(result.success).toBe(false);
    const errors = fieldErrors(result.error!.issues);
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
  });
});

describe("projectSchema", () => {
  const base = {
    slug: "mon-projet",
    title: { fr: "Titre" },
    summary: { fr: "Résumé" },
    description: { fr: "Description" },
  };

  it("fills the defaults and coerces the year", () => {
    const parsed = projectSchema.parse({ ...base, year: "2024" });
    expect(parsed.year).toBe(2024);
    expect(parsed.status).toBe("draft");
    expect(parsed.title.en).toBe("");
  });

  it("rejects a slug that is not lowercase-with-dashes", () => {
    expect(projectSchema.safeParse({ ...base, slug: "Mon Projet" }).success).toBe(false);
  });

  it("requires the French title", () => {
    expect(projectSchema.safeParse({ ...base, title: { en: "Title" } }).success).toBe(false);
  });
});

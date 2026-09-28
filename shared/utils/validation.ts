import type { z } from "zod";

/** First message per field, keyed by dotted path — the shape forms render errors from. */
export const fieldErrors = (issues: z.core.$ZodIssue[]): Record<string, string> => {
  const fields: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join(".");
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return fields;
};

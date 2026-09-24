import type { Locale, Localized } from "../types/project";

/**
 * Resolves a localized field, falling back to French when a translation is missing.
 *
 * Falling back is deliberate: an untranslated project should still render in English
 * rather than showing an empty heading.
 */
export const localized = (field: Localized | undefined, locale: Locale): string => {
  if (!field) return "";
  const value = field[locale];
  return value && value.trim() ? value : field.fr || "";
};

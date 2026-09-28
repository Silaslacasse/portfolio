import { FetchError } from "ofetch";

export interface ApiError {
  status: number;
  message: string;
  fields: Record<string, string>;
}

/**
 * Normalises a failed `$fetch`. Our JSON error bodies carry `error` and `fields`; errors
 * thrown with `createError` carry `statusMessage`. Either way the UI gets one shape.
 */
export const apiError = (error: unknown): ApiError => {
  if (error instanceof FetchError) {
    const data = (error.data ?? {}) as {
      error?: string;
      statusMessage?: string;
      fields?: Record<string, string>;
    };
    return {
      status: error.statusCode ?? 0,
      message: data.error ?? data.statusMessage ?? error.message,
      fields: data.fields ?? {},
    };
  }
  return { status: 0, message: error instanceof Error ? error.message : String(error), fields: {} };
};

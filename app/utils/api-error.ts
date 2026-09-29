import { FetchError } from "ofetch";

export interface ApiError {
  status: number;
  /** The `type` discriminator of our JSON error bodies (`validation`, `captcha`…), if any. */
  type: string;
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
      type?: string;
      error?: string;
      statusMessage?: string;
      fields?: Record<string, string>;
    };
    return {
      status: error.statusCode ?? 0,
      type: data.type ?? "",
      message: data.error ?? data.statusMessage ?? error.message,
      fields: data.fields ?? {},
    };
  }
  return {
    status: 0,
    type: "",
    message: error instanceof Error ? error.message : String(error),
    fields: {},
  };
};

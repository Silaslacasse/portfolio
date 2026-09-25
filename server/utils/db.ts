import mongoose from "mongoose";

let connection: Promise<typeof mongoose> | null = null;

/**
 * Connects once per process and reuses the promise.
 *
 * Nitro can invoke handlers before a startup plugin has settled, so every consumer awaits
 * this rather than assuming a connection already exists.
 */
export const useDatabase = (): Promise<typeof mongoose> => {
  if (connection) return connection;

  const { mongoUri } = useRuntimeConfig();
  if (!mongoUri) {
    throw createError({ statusCode: 500, statusMessage: "MONGO_URI is not configured." });
  }

  connection = mongoose
    .connect(mongoUri, {
      /**
       * Mongoose defaults to 30s. That is far too long in both directions: a
       * misconfiguration stays silent for half a minute at boot, and a request arriving
       * while the database is unreachable hangs for 30s before failing.
       */
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    })
    .catch((error) => {
      // Clear the cache so a later request retries instead of reusing a rejected promise.
      connection = null;
      throw error;
    });

  return connection;
};

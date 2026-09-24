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
    throw createError({
      statusCode: 500,
      statusMessage: "MONGO_URI is not configured.",
    });
  }

  connection = mongoose.connect(mongoUri).catch((error) => {
    // Clear the cache so a later request can retry instead of reusing a rejected promise.
    connection = null;
    throw error;
  });

  return connection;
};

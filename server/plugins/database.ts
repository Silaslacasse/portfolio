/**
 * Warms the MongoDB connection at boot so the first visitor does not pay for the
 * handshake. Failure is logged rather than fatal: static pages should still serve if the
 * database is briefly unreachable.
 */
export default defineNitroPlugin(() => {
  const { mongoUri } = useRuntimeConfig();
  if (!mongoUri) {
    console.warn("MONGO_URI is not set — database-backed routes will fail.");
    return;
  }

  useDatabase()
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection failed:", error));
});

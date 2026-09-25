/**
 * Translates a connection failure into the thing that actually needs changing.
 *
 * These four cover every failure seen while wiring this up, and the distinction matters:
 * the fix for each is in a different place (connection string, proxy config, Coolify
 * resource links, credentials).
 */
const explain = (error: unknown): string | null => {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("ENOENT") && message.includes(".pem")) {
    return (
      "The connection string points at a TLS CA file that does not exist in THIS container — " +
      "that path belongs to the database container. Either drop tls/tlsCAFile from the URI, " +
      "or mount the CA into this container at that path."
    );
  }

  if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
    return (
      "The database hostname does not resolve from this container. The two resources are " +
      "probably not on the same Docker network — check they are linked in Coolify."
    );
  }

  if (message.includes("Authentication failed") || message.includes("AuthenticationFailed")) {
    return "The database rejected the credentials. Check the user, password and authSource.";
  }

  if (message.includes("ECONNREFUSED") || message.includes("connect ETIMEDOUT")) {
    return (
      "Nothing accepted the connection on that host and port. If the server requires TLS, " +
      "a plain connection is refused here — re-add tls=true and supply the CA."
    );
  }

  return null;
};

/**
 * Warms the MongoDB connection at boot so the first visitor does not pay for the handshake.
 * Failure is logged rather than fatal: most routes render without the database, and taking
 * the whole site down for a database blip would be a self-inflicted outage.
 */
export default defineNitroPlugin(() => {
  const { mongoUri } = useRuntimeConfig();

  if (!mongoUri) {
    console.warn("MONGO_URI is not set — database-backed routes will fail.");
    return;
  }

  useDatabase()
    .then(() => console.log("MongoDB connected"))
    .catch((error) => {
      console.error("MongoDB connection failed:", error);

      const hint = explain(error);
      if (hint) console.error(`  → ${hint}`);
    });
});

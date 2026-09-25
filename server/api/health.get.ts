import mongoose from "mongoose";

/**
 * Platform healthcheck — liveness, not readiness.
 *
 * Returns 200 whenever the process can serve requests, and reports the database state in
 * the body for monitoring. It deliberately does NOT fail on a lost Mongo connection:
 * almost every page here (home, legal notices, the whole static design) renders without
 * the database, so gating the healthcheck on it would let a Mongo blip take the entire
 * site offline behind the proxy. Only the project routes need data, and they degrade on
 * their own.
 */
export default defineEventHandler(() => {
  const connected = mongoose.connection.readyState === 1;

  return {
    status: "ok",
    database: connected ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
  };
});

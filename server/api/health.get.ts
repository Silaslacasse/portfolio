import mongoose from "mongoose";

/**
 * Platform healthcheck. Reports the Mongo connection state so a database outage is
 * visible to Coolify without reading logs, and so a rolling deploy does not cut over to
 * an instance that cannot serve data.
 */
export default defineEventHandler((event) => {
  const connected = mongoose.connection.readyState === 1;

  if (!connected) {
    setResponseStatus(event, 503);
  }

  return {
    status: connected ? "ok" : "degraded",
    database: connected ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
  };
});

/**
 * Drops every cached page rendered under the `swr` route rules, so a project change in the
 * admin shows at once instead of up to an hour later; each page re-renders on its next
 * request. Keys are removed one by one rather than with `clear()`, which on the default
 * in-memory driver would wipe the whole storage, not just this prefix.
 */
export const purgePageCache = async () => {
  const storage = useStorage("cache");
  const keys = await storage.getKeys("nitro:routes");
  await Promise.all(keys.map((key) => storage.removeItem(key)));
};

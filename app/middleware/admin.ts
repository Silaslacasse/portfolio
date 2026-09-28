/**
 * Guards the admin pages. They are `ssr: false` (see routeRules), so this only ever runs
 * in the browser, where the sealed session cookie is sent along.
 */
export default defineNuxtRouteMiddleware(async () => {
  const { authenticated } = await $fetch("/api/admin/session");
  if (!authenticated) return navigateTo("/admin");
});

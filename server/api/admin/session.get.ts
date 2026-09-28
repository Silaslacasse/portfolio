/** Lets the admin UI decide between the login screen and the dashboard. */
export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event);
  return { authenticated: session.data.admin === true };
});

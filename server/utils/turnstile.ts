/**
 * Cloudflare Turnstile check for the contact form. Returns true when Turnstile is not
 * configured (no secret), so the form keeps working until the keys are added.
 *
 * Fails closed on a network error: a message is only accepted with a verified token once
 * the secret exists, otherwise an attacker would only need Cloudflare to be slow.
 */
export const verifyTurnstile = async (token: unknown, ip: string): Promise<boolean> => {
  const { turnstileSecretKey } = useRuntimeConfig();
  if (!turnstileSecretKey) return true;
  if (typeof token !== "string" || !token) return false;

  try {
    const result = await $fetch<{ success: boolean }>(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret: turnstileSecretKey, response: token, remoteip: ip }),
        timeout: 5000,
      }
    );
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", error instanceof Error ? error.message : error);
    return false;
  }
};

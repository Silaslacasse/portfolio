let warnedHalfConfigured = false;

/**
 * Cloudflare Turnstile check for the contact form. Enforced only when both keys are set:
 * with the secret alone the page renders no widget, so every message would be refused (it
 * happened on preproduction), and losing leads is worse than losing the spam filter. A
 * half-configured pair is logged once instead.
 *
 * Fails closed on a network error: once configured, a message is only accepted with a
 * verified token, otherwise an attacker would only need Cloudflare to be slow.
 */
export const verifyTurnstile = async (token: unknown, ip: string): Promise<boolean> => {
  const { turnstileSecretKey, public: publicConfig } = useRuntimeConfig();
  if (!turnstileSecretKey || !publicConfig.turnstileSiteKey) {
    if ((turnstileSecretKey || publicConfig.turnstileSiteKey) && !warnedHalfConfigured) {
      warnedHalfConfigured = true;
      console.warn(
        "Turnstile is half-configured and therefore off: set both NUXT_PUBLIC_TURNSTILE_SITE_KEY and NUXT_TURNSTILE_SECRET_KEY."
      );
    }
    return true;
  }
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

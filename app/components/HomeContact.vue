<script setup lang="ts">
import linkedinIcon from "~/assets/icons/linkedin_orange.webp";
import { contactMessageSchema, type ContactMessageInput } from "#shared/schemas/message";
import { fieldErrors } from "#shared/utils/validation";

const { t, locale } = useI18n();
const localePath = useLocalePath();

const form = reactive<ContactMessageInput>({
  name: "",
  society: "",
  email: "",
  mobile: "",
  message: "",
});

// One name field (the redesign merged first and last name) and no LinkedIn field: the
// LinkedIn button next to "send" is the link to *my* profile, not a field.
const fields = [
  { key: "name", autocomplete: "name", required: true },
  { key: "society", autocomplete: "organization", required: false },
  { key: "email", autocomplete: "email", required: true, type: "email" },
  { key: "mobile", autocomplete: "tel", required: false, type: "tel" },
] as const;

const pending = ref(false);
const sent = ref(false);
const errors = ref<Record<string, string>>({});
const error = ref("");

// Client-side mirror of the server's 24h limit: keeps the form closed across reloads.
onMounted(() => {
  if (getCookie("messageSent")) sent.value = true;
});

/**
 * Cloudflare Turnstile, only when its site key is configured (the server enforces it only
 * when its secret is). The script loads with the form, not site-wide, and not at all once
 * a message was sent. Tokens are single-use, so the widget is reset after every failed
 * submission.
 */
interface Turnstile {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId?: string): void;
}
const { turnstileSiteKey } = useRuntimeConfig().public;
const captcha = ref<HTMLElement>();
const turnstileToken = ref("");
let turnstile: Turnstile | undefined;
let widgetId: string | undefined;

// Loaded by hand: Nuxt's useScript is a stub without @nuxt/scripts. `onload` in the URL
// is Cloudflare's documented hook for explicit rendering with an async script.
const loadTurnstile = () =>
  new Promise<Turnstile>((resolve, reject) => {
    const scope = window as unknown as { turnstile?: Turnstile; onTurnstileLoad?: () => void };
    if (scope.turnstile) return resolve(scope.turnstile);
    scope.onTurnstileLoad = () => resolve(scope.turnstile!);
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad";
    script.async = true;
    script.onerror = reject;
    document.head.append(script);
  });

onMounted(async () => {
  // `sent` is already restored from the cookie by the hook above, registered first.
  if (!turnstileSiteKey || sent.value || !captcha.value) return;
  // Blocked or offline: no widget, and submit then explains the check is missing.
  turnstile = await loadTurnstile().catch(() => undefined);
  if (!turnstile) return;
  widgetId = turnstile.render(captcha.value, {
    sitekey: turnstileSiteKey,
    theme: "dark",
    language: locale.value,
    callback: (token: string) => (turnstileToken.value = token),
    "expired-callback": () => (turnstileToken.value = ""),
  });
});

const resetCaptcha = () => {
  turnstileToken.value = "";
  turnstile?.reset(widgetId);
};

const submit = async () => {
  if (pending.value || sent.value) return;

  // Same schema as the endpoint, so a payload that passes here passes there.
  const parsed = contactMessageSchema.safeParse(form);
  if (!parsed.success) {
    errors.value = fieldErrors(parsed.error.issues);
    return;
  }
  if (turnstileSiteKey && !turnstileToken.value) {
    error.value = t("contact.errorCaptcha");
    return;
  }

  pending.value = true;
  errors.value = {};
  error.value = "";
  try {
    await $fetch("/api/messages", {
      method: "POST",
      body: { ...parsed.data, turnstileToken: turnstileToken.value },
    });
    sent.value = true;
    setCookie("messageSent", "true", 1);
  } catch (caught) {
    const failure = apiError(caught);
    resetCaptcha();
    if (failure.type === "captcha") {
      error.value = t("contact.errorCaptcha");
    } else if (failure.status === 429) {
      error.value = t("contact.errorRateLimit");
      setCookie("messageSent", "true", 1);
    } else if (failure.status === 400 && Object.keys(failure.fields).length) {
      errors.value = failure.fields;
    } else if (failure.status >= 500) {
      error.value = t("contact.errorServer");
    } else {
      error.value = failure.message || t("contact.errorGeneric");
    }
  } finally {
    pending.value = false;
  }
};

const label = "text-xs tracking-[0.1em] text-muted uppercase";
const input = "field aria-invalid:border-accent";
</script>

<template>
  <section id="contact" class="container-content scroll-mt-28 py-10 lg:py-20">
    <AppSectionTitle v-reveal :title="$t('contact.heading')" :accent="$t('contact.accent')" />

    <div
      class="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16"
    >
      <!-- Gradient frame like the skills panel; dark fields like the rest of the site. -->
      <div v-reveal class="rounded-panel bg-brand-gradient p-1">
        <div class="rounded-[calc(var(--radius-panel)-4px)] bg-surface p-6 sm:p-10">
          <p v-if="sent" class="py-10 text-center text-subtitle" role="status">
            {{ $t("contact.success") }}
          </p>

          <form v-else class="grid gap-6 sm:grid-cols-2" novalidate @submit.prevent="submit">
            <div v-for="field in fields" :key="field.key">
              <label :for="`contact-${field.key}`" :class="label">
                {{ $t(`contact.${field.key}`) }}
                <span v-if="field.required" class="text-accent" :title="$t('contact.required')">
                  *
                </span>
              </label>
              <input
                :id="`contact-${field.key}`"
                v-model="form[field.key]"
                :type="'type' in field ? field.type : 'text'"
                :name="field.key"
                :autocomplete="field.autocomplete"
                :required="field.required"
                :placeholder="$t(`contact.placeholders.${field.key}`)"
                :aria-invalid="errors[field.key] ? true : undefined"
                :aria-describedby="errors[field.key] ? `contact-${field.key}-error` : undefined"
                :class="input"
              />
              <p
                v-if="errors[field.key]"
                :id="`contact-${field.key}-error`"
                class="mt-1 text-small text-accent"
              >
                {{ errors[field.key] }}
              </p>
            </div>

            <div class="sm:col-span-2">
              <label for="contact-message" :class="label">
                {{ $t("contact.message") }}
                <span class="text-accent" :title="$t('contact.required')">*</span>
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                name="message"
                rows="5"
                required
                :placeholder="$t('contact.placeholders.message')"
                :aria-invalid="errors.message ? true : undefined"
                :aria-describedby="errors.message ? 'contact-message-error' : undefined"
                :class="input"
                class="resize-none"
              />
              <p
                v-if="errors.message"
                id="contact-message-error"
                class="mt-1 text-small text-accent"
              >
                {{ errors.message }}
              </p>
            </div>

            <div v-if="turnstileSiteKey" ref="captcha" class="min-h-[65px] sm:col-span-2" />

            <!-- GDPR art. 13: what the data is for and for how long, where it is collected. -->
            <i18n-t
              keypath="contact.privacy"
              tag="p"
              scope="global"
              class="text-small text-muted sm:col-span-2"
            >
              <template #link>
                <NuxtLink :to="localePath('privacy-policy')" class="text-accent hover:underline">{{
                  $t("contact.privacyLink")
                }}</NuxtLink>
              </template>
            </i18n-t>

            <p v-if="error" class="text-accent sm:col-span-2" role="alert">{{ error }}</p>

            <div class="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
              <p class="text-small text-muted">
                <span class="text-accent">*</span> {{ $t("contact.requiredFields") }}
              </p>
              <div class="flex flex-wrap items-center gap-3">
                <AppButton variant="outline" :href="LINKEDIN_URL">
                  {{ $t("nav.linkedin") }}
                  <img :src="linkedinIcon" width="18" height="18" alt="" />
                </AppButton>
                <AppButton type="submit" size="lg" :disabled="pending">
                  {{ pending ? $t("contact.sending") : $t("contact.submit") }} →
                </AppButton>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div v-reveal class="flex flex-col gap-4 lg:pt-2">
        <p class="text-title">{{ $t("contact.lead") }}</p>
        <p class="text-muted">{{ $t("contact.text") }}</p>
      </div>
    </div>
  </section>
</template>

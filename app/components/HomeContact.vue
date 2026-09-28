<script setup lang="ts">
import linkedinIcon from "~/assets/icons/linkedin_orange.webp";
import { contactMessageSchema, type ContactMessageInput } from "#shared/schemas/message";
import { fieldErrors } from "#shared/utils/validation";

const { t } = useI18n();

const form = reactive<ContactMessageInput>({
  name: "",
  firstName: "",
  society: "",
  email: "",
  linkedIn: "",
  mobile: "",
  message: "",
});

const fields = [
  { key: "name", autocomplete: "family-name", required: true },
  { key: "firstName", autocomplete: "given-name", required: true },
  { key: "society", autocomplete: "organization", required: true },
  { key: "email", autocomplete: "email", required: true, type: "email" },
  { key: "linkedIn", autocomplete: "url", required: false, type: "url" },
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

const submit = async () => {
  if (pending.value || sent.value) return;

  // Same schema as the endpoint, so a payload that passes here passes there.
  const parsed = contactMessageSchema.safeParse(form);
  if (!parsed.success) {
    errors.value = fieldErrors(parsed.error.issues);
    return;
  }

  pending.value = true;
  errors.value = {};
  error.value = "";
  try {
    await $fetch("/api/messages", { method: "POST", body: parsed.data });
    sent.value = true;
    setCookie("messageSent", "true", 1);
  } catch (caught) {
    const failure = apiError(caught);
    if (failure.status === 429) {
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

const input =
  "mt-2 w-full rounded-field bg-white px-5 py-2.5 text-ink aria-invalid:outline aria-invalid:outline-2 aria-invalid:outline-accent";
</script>

<template>
  <section id="contact" class="container-content scroll-mt-28 py-10 lg:py-20">
    <h2 class="text-center font-body text-title font-normal">{{ $t("contact.title") }}</h2>

    <div class="mx-auto mt-10 max-w-3xl rounded-card bg-surface p-6 sm:p-10">
      <p v-if="sent" class="py-10 text-center text-subtitle" role="status">
        {{ $t("contact.success") }}
      </p>

      <form v-else class="grid gap-6 sm:grid-cols-2" novalidate @submit.prevent="submit">
        <div v-for="field in fields" :key="field.key">
          <label :for="`contact-${field.key}`" class="text-small">
            {{ $t(`contact.${field.key}`) }}
            <span v-if="field.required" class="text-accent" :title="$t('contact.required')">*</span>
          </label>
          <input
            :id="`contact-${field.key}`"
            v-model="form[field.key]"
            :type="'type' in field ? field.type : 'text'"
            :name="field.key"
            :autocomplete="field.autocomplete"
            :required="field.required"
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
          <label for="contact-message" class="text-small">
            {{ $t("contact.message") }}
            <span class="text-accent" :title="$t('contact.required')">*</span>
          </label>
          <textarea
            id="contact-message"
            v-model="form.message"
            name="message"
            rows="4"
            required
            :aria-invalid="errors.message ? true : undefined"
            :aria-describedby="errors.message ? 'contact-message-error' : undefined"
            :class="input"
          />
          <p v-if="errors.message" id="contact-message-error" class="mt-1 text-small text-accent">
            {{ errors.message }}
          </p>
        </div>

        <p v-if="error" class="text-accent sm:col-span-2" role="alert">{{ error }}</p>

        <div class="flex flex-wrap items-center justify-end gap-4 sm:col-span-2">
          <AppButton variant="outline" :href="LINKEDIN_URL">
            {{ $t("nav.linkedin") }}
            <img :src="linkedinIcon" width="18" height="18" alt="" />
          </AppButton>
          <AppButton type="submit" size="lg" :disabled="pending">
            {{ pending ? $t("contact.sending") : $t("contact.submit") }}
          </AppButton>
        </div>
      </form>
    </div>
  </section>
</template>

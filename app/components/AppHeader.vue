<script setup lang="ts">
import jossLogo from "~/assets/icons/joss.webp";
import linkedinIcon from "~/assets/icons/linkedin.webp";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

// Anchors are prefixed with the localized home path so they work from any page.
const home = computed(() => localePath("index"));
const links = computed(() => [
  { label: t("nav.home"), to: home.value },
  { label: t("nav.skills"), to: `${home.value}#skills` },
  { label: t("nav.projects"), to: localePath("projects") },
  { label: t("nav.contact"), to: `${home.value}#contact` },
]);

const open = ref(false);
// Any navigation, including an in-page anchor, closes the mobile menu.
watch(
  () => route.fullPath,
  () => {
    open.value = false;
  }
);
</script>

<template>
  <!-- Sticky bar replacing v1's absolutely positioned 96px header. -->
  <header class="sticky top-0 z-40 bg-ink/90 backdrop-blur-sm">
    <div class="container-content py-4">
      <div class="flex items-center justify-between gap-6 rounded-bar bg-surface px-5 py-3 sm:px-8">
        <NuxtLink :to="home" class="shrink-0">
          <img :src="jossLogo" width="90" height="28" alt="JOSS" />
        </NuxtLink>

        <nav :aria-label="t('nav.main')" class="hidden items-center gap-8 lg:flex">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-small transition-colors hover:text-accent"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <div class="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <AppButton :href="LINKEDIN_URL">
            {{ t("nav.linkedin") }}
            <img :src="linkedinIcon" width="18" height="18" alt="" />
          </AppButton>
          <button
            type="button"
            class="-mr-2 rounded-full p-2 lg:hidden"
            :aria-expanded="open"
            aria-controls="mobile-nav"
            :aria-label="t('nav.menu')"
            @click="open = !open"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
              <path v-else d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        v-show="open"
        id="mobile-nav"
        :aria-label="t('nav.main')"
        class="mt-3 flex flex-col gap-1 rounded-card bg-surface p-3 lg:hidden"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-field px-4 py-3 hover:bg-ink"
        >
          {{ link.label }}
        </NuxtLink>
        <div class="px-4 pt-2 sm:hidden">
          <LocaleSwitcher />
        </div>
      </nav>
    </div>
  </header>
</template>

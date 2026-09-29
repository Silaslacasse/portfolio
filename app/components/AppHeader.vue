<script setup lang="ts">
import jossLogo from "~/assets/icons/joss.webp";

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

// Anchors are prefixed with the localized home path so they work from any page.
const home = computed(() => localePath("index"));
const links = computed(() => [
  { label: t("nav.about"), to: `${home.value}#about` },
  { label: t("nav.skills"), to: `${home.value}#skills` },
  { label: t("nav.projects"), to: `${home.value}#projects` },
  { label: t("nav.personal"), to: `${home.value}#personal` },
]);
const contact = computed(() => `${home.value}#contact`);

const open = ref(false);
const menuButton = ref<HTMLButtonElement>();
// Escape closes the menu and hands focus back to the button that opened it.
const closeMenu = () => {
  if (!open.value) return;
  open.value = false;
  menuButton.value?.focus();
};
// Any navigation, including an in-page anchor, closes the mobile menu.
watch(
  () => route.fullPath,
  () => {
    open.value = false;
  }
);

// There is no bar any more, so the header only gets a backdrop once content scrolls under
// it; at the top the hero glow shows through. A passive listener writing one boolean.
const scrolled = ref(false);
const onScroll = () => {
  scrolled.value = window.scrollY > 8;
};
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <!-- Direction B header: logo, quiet text links with the language switch, one button. -->
  <header
    class="sticky top-0 z-40 transition-colors duration-300"
    :class="open ? 'bg-ink' : scrolled ? 'bg-ink/80 backdrop-blur-md' : ''"
    @keydown.esc="closeMenu"
  >
    <div class="container-content flex h-24 items-center justify-between gap-6">
      <NuxtLink :to="home" :aria-label="t('nav.home')" class="shrink-0">
        <img :src="jossLogo" width="90" height="28" alt="JOSS" />
      </NuxtLink>

      <div class="hidden items-center gap-8 lg:flex">
        <nav :aria-label="t('nav.main')" class="flex items-center gap-8">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-small text-muted transition-colors hover:text-white"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <LocaleSwitcher />
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          :to="contact"
          class="hidden items-center gap-2 rounded-pill border border-white/25 px-5 py-2.5 text-small text-white transition-colors hover:border-accent hover:text-accent sm:inline-flex"
        >
          {{ t("nav.contact") }} <span aria-hidden="true">↗</span>
        </NuxtLink>
        <button
          ref="menuButton"
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

    <!-- Drops over the page instead of pushing it down. -->
    <div
      v-show="open"
      id="mobile-nav"
      class="absolute inset-x-0 top-full bg-ink shadow-[0_24px_40px_rgba(0,0,0,0.5)] lg:hidden"
    >
      <div class="container-content flex flex-col gap-6 pb-8">
        <nav :aria-label="t('nav.main')" class="flex flex-col">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="border-b border-white/10 py-4 text-subtitle text-white"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center justify-between gap-4">
          <LocaleSwitcher />
          <NuxtLink
            :to="contact"
            class="inline-flex items-center gap-2 rounded-pill border border-white/25 px-5 py-2.5 text-small text-white sm:hidden"
          >
            {{ t("nav.contact") }} <span aria-hidden="true">↗</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

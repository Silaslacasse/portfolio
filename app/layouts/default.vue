<template>
  <div class="flex min-h-svh flex-col">
    <!-- Single root, flex column: keeps the footer at the bottom on short pages. -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-pill focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
    >
      {{ $t("nav.skipToContent") }}
    </a>

    <AppHeader />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

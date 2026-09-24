<script setup lang="ts">
const { t } = useI18n();
const head = useLocaleHead();

// Drives <html lang> and the hreflang/canonical link tags. The v1 site hardcoded
// lang="en" on an entirely French page.
useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta,
  // Pages set a short title; the brand suffix is appended here so it is never duplicated.
  titleTemplate: (title?: string) =>
    title ? `${title} — Jocelyn Duperret` : `Jocelyn Duperret — ${t("meta.home.title")}`,
}));
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

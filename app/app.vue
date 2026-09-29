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

// The social preview for every page (a capture of the hero, language-neutral); project
// pages replace it with their cover. og:title and og:description are inferred from each
// page's title and description by nuxt-seo-utils.
useSeoMeta({
  // Absolute: social networks ignore a relative og:image. Resolved from the site URL.
  ogImage: withSiteUrl("/og-image.jpg"),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Jocelyn Duperret",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({ title: () => t("meta.legalUnotice.title") });
</script>

<template>
  <section class="container-content py-20">
    <h1 class="font-display text-display font-bold">{{ $t("meta.legalUnotice.title") }}</h1>
    <!-- Content written in Phase 4; the route and its localized paths exist now so the
         footer links resolve and the page is prerendered. -->
    <p class="mt-6 text-muted">…</p>
  </section>
</template>

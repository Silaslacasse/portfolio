<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("meta.projects.title"),
  description: () => t("meta.projects.description"),
});
</script>

<template>
  <section class="container-content py-20">
    <h1 class="font-display text-display font-bold">{{ $t("projects.title") }}</h1>
    <!-- Wired to the projects API in Phase 3. -->
    <p class="mt-6 text-muted">{{ $t("projects.empty") }}</p>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("meta.home.title"),
  description: () => t("meta.home.description"),
  ogTitle: () => t("meta.home.title"),
  ogDescription: () => t("meta.home.description"),
});
</script>

<template>
  <div>
    <HomeHero />
    <HomeMarquee />
    <HomeAbout />
    <HomeCurriculum />
    <HomeContact />
  </div>
</template>

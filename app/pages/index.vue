<script setup lang="ts">
import AboutMe from "../components/v1/AboutMe.vue";
import Curriculum from "../components/v1/Curriculum.vue";
import ContactForm from "../components/v1/ContactForm.vue";

const { t } = useI18n();

useSeoMeta({
  title: () => t("meta.home.title"),
  description: () => t("meta.home.description"),
  ogTitle: () => t("meta.home.title"),
  ogDescription: () => t("meta.home.description"),
});

// Sections still on the v1 markup are replaced one at a time (ROADMAP, Phase 2).
</script>

<template>
  <div>
    <HomeHero />
    <HomeMarquee />
    <AboutMe />
    <Curriculum />
    <ContactForm />
  </div>
</template>

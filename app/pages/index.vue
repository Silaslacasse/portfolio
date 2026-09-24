<script setup lang="ts">
import Header from "../components/v1/Header.vue";
import TopPresentation from "../components/v1/TopPresentation.vue";
import Marquee from "../components/v1/Marquee.vue";
import AboutMe from "../components/v1/AboutMe.vue";
import Curriculum from "../components/v1/Curriculum.vue";
import ContactForm from "../components/v1/ContactForm.vue";
import Footer from "../components/v1/Footer.vue";

const { t } = useI18n();

useSeoMeta({
  title: () => t("meta.home.title"),
  description: () => t("meta.home.description"),
  ogTitle: () => t("meta.home.title"),
  ogDescription: () => t("meta.home.description"),
});

// The v1 layout is self-contained: it ships its own header and footer, and its
// hero is positioned against the viewport. Phase 2 folds it into the app layout.
definePageMeta({ layout: false });
</script>

<template>
  <div>
    <Header />
    <TopPresentation />
    <Marquee />
    <AboutMe />
    <Curriculum />
    <ContactForm />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import TopPresentation from './components/TopPresentation.vue';
import Marquee from './components/Marquee.vue';
import AboutMe from './components/AboutMe.vue';
import Curriculum from './components/Curriculum.vue';
import Footer from './components/Footer.vue';
import ContactForm from './components/ContactForm.vue';
</script>

<template>
  <Header/>
  <TopPresentation/>
  <Marquee/>
  <AboutMe/>
  <Curriculum/>
  <ContactForm/>
  <Footer />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

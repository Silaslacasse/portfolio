<script setup lang="ts">
import Header from './components/Header.vue';
import TopPresentation from './components/TopPresentation.vue';
import SliderBanner from './components/SliderBanner.vue';
</script>

<template>
  <Header/>
  <TopPresentation/>
  <SliderBanner/>
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

<script setup lang="ts">
/**
 * The opening animation, once per browser session (styles: `.intro` in main.css). It is
 * pure CSS and ends on its own, so it never depends on hydration or JavaScript. This
 * inline script runs before the first paint and marks a return visit, so a reload or a
 * second page in the same session never flashes the curtain.
 *
 * ponytail: inline script; the Phase 5 CSP will need its hash (or drop the once-per-session rule).
 */
useHead({
  script: [
    {
      innerHTML:
        "try{sessionStorage.getItem('intro')?document.documentElement.classList.add('intro-seen'):sessionStorage.setItem('intro','1')}catch(e){}",
      tagPosition: "head",
    },
  ],
});

const letters = ["J", "O", "S", "S"];
</script>

<template>
  <div class="intro" aria-hidden="true">
    <div class="intro__glow bg-hero-glow" />
    <div class="relative flex flex-col items-center gap-6">
      <p class="intro__word">
        <span v-for="(letter, index) in letters" :key="index" :style="{ '--i': index }">{{
          letter
        }}</span>
      </p>
      <span class="intro__line" />
    </div>
  </div>
</template>

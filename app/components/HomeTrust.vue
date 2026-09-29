<script setup lang="ts">
/**
 * Wordmarks stand in for logos until the SVG files exist (see the canvas note): the three
 * real employers first, then placeholder names. Swap each string for an <img> when the
 * files land; the tile sizing already fits a 96px-tall logo.
 */
const partners = ["JetPulp", "SiteW", "Arclim", "Lumen", "Novatek", "Orbis"];
</script>

<template>
  <section id="trust" v-reveal class="container-content scroll-mt-28 py-12 lg:py-20">
    <h2 class="text-center text-small tracking-[0.14em] text-muted uppercase">
      {{ $t("home.trust.title") }}
    </h2>
    <ul class="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
      <li
        v-for="name in partners"
        :key="name"
        class="flex h-24 items-center justify-center rounded-card bg-surface font-display text-subtitle font-bold text-muted"
      >
        {{ name }}
      </li>
    </ul>
  </section>
</template>

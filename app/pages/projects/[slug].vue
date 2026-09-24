<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
</script>

<template>
  <section class="container-content py-20">
    <!-- Fetches the project by slug in Phase 3. -->
    <h1 class="font-display text-display font-bold">{{ route.params.slug }}</h1>
    <NuxtLink :to="localePath('projects')" class="mt-6 inline-block text-accent">
      {{ $t("projects.backToList") }}
    </NuxtLink>
  </section>
</template>

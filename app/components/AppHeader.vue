<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <header class="container-content py-6">
    <div class="flex flex-wrap items-center justify-between gap-4 rounded-bar bg-surface px-6 py-4">
      <NuxtLink :to="localePath('index')" class="font-display text-subtitle font-bold">
        JOSS
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-4 text-small">
        <NuxtLink :to="localePath('projects')" class="hover:text-accent">
          {{ $t("nav.projects") }}
        </NuxtLink>
        <a href="#contact" class="hover:text-accent">{{ $t("nav.contact") }}</a>
        <LocaleSwitcher />
      </nav>
    </div>
  </header>
</template>

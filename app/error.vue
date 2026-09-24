<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();
const localePath = useLocalePath();
</script>

<template>
  <section class="container-content flex min-h-screen flex-col justify-center py-20">
    <p class="font-display text-hero font-extrabold text-accent">{{ error.statusCode }}</p>
    <h1 class="mt-4 font-display text-display font-bold">{{ $t("notFound.title") }}</h1>
    <p class="mt-4 text-muted">{{ $t("notFound.description") }}</p>
    <NuxtLink :to="localePath('index')" class="mt-8 inline-block text-accent">
      {{ $t("notFound.back") }}
    </NuxtLink>
  </section>
</template>

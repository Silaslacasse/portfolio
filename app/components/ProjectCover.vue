<script setup lang="ts">
/**
 * A project's cover: the uploaded image through @nuxt/image, or a brand gradient when the
 * project has none. The gradient is picked from the slug so a project keeps the same one
 * everywhere it appears. Wrap it in a sized box; it fills whatever it is given.
 */
const props = withDefaults(
  defineProps<{
    src: string | null;
    alt: string;
    /** Identifies the project for the placeholder gradient. */
    seed?: string;
    width?: number;
    height?: number;
    sizes?: string;
    loading?: "lazy" | "eager";
  }>(),
  { seed: "", width: 1280, height: 800, sizes: "100vw lg:640px", loading: "lazy" }
);

// Whole class strings, so Tailwind's scanner sees them.
const GRADIENTS = [
  "bg-linear-135 from-violet to-surface-raised",
  "bg-linear-135 from-accent to-surface-raised",
  "bg-linear-135 from-surface-raised to-violet",
  "bg-linear-135 from-grad-footer-from to-grad-footer-to",
];

const gradient = computed(() => {
  let hash = 0;
  for (const char of props.seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
});
</script>

<template>
  <NuxtImg
    v-if="src"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :sizes="sizes"
    :loading="loading"
    class="h-full w-full object-cover"
  />
  <div v-else role="img" :aria-label="alt" class="h-full w-full" :class="gradient" />
</template>

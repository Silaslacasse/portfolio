<script setup lang="ts">
/**
 * The redesign's section opener: a two-line uppercase title whose second line carries the
 * brand gradient ("Mes / projets."). The hero uses it as the h1 at the giant size; every
 * other section as an h2.
 */
withDefaults(
  defineProps<{
    title: string;
    /** The gradient line. Optional so a one-line title stays possible. */
    accent?: string;
    tag?: "h1" | "h2";
    size?: "section" | "giant";
  }>(),
  { accent: undefined, tag: "h2", size: "section" }
);
</script>

<template>
  <component
    :is="tag"
    class="font-display leading-[0.92] font-extrabold tracking-[-0.02em] text-white uppercase"
    :class="size === 'giant' ? 'text-giant' : 'text-section'"
  >
    {{ title }}
    <template v-if="accent">
      <br />
      <span class="text-gradient">{{ accent }}</span>
    </template>
  </component>
</template>

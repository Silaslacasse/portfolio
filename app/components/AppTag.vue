<script setup lang="ts">
/** A pill on the ink background; `stars` (1–5) adds a rating, as on the language tags. */
defineProps<{ stars?: number }>();
</script>

<template>
  <span class="inline-flex items-center gap-3 rounded-field bg-ink px-4 py-2 text-small">
    <slot />
    <span v-if="stars" class="flex" role="img" :aria-label="`${stars}/5`">
      <svg
        v-for="i in 5"
        :key="i"
        width="18"
        height="17"
        viewBox="0 0 18 17"
        aria-hidden="true"
        :class="i <= stars ? 'fill-white' : 'fill-white/20'"
      >
        <path
          d="M8.08155 1.13274C8.42863 0.326779 9.57137 0.326779 9.91845 1.13274L11.469 4.73316C11.6137 5.06934 11.9306 5.29956 12.2951 5.33336L16.1984 5.69538C17.0722 5.77642 17.4253 6.86323 16.766 7.44239L13.821 10.0296C13.546 10.2712 13.4249 10.6437 13.5054 11.0007L14.3673 14.8249C14.5602 15.6809 13.6357 16.3526 12.8812 15.9046L9.51056 13.9032C9.19584 13.7163 8.80416 13.7163 8.48944 13.9032L5.11879 15.9046C4.36426 16.3526 3.43976 15.6809 3.6327 14.8249L4.49459 11.0007C4.57506 10.6437 4.45403 10.2712 4.17904 10.0296L1.23398 7.44239C0.574713 6.86323 0.92784 5.77642 1.80161 5.69538L5.70494 5.33336C6.0694 5.29956 6.38627 5.06934 6.53105 4.73316L8.08155 1.13274Z"
        />
      </svg>
    </span>
  </span>
</template>

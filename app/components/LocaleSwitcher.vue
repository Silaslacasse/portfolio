<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <!--
    Renders real anchors to the equivalent localized URL rather than toggling state,
    so each language is independently linkable and crawlable.
  -->
  <nav class="flex items-center gap-1 text-small" :aria-label="$t('nav.home')">
    <NuxtLink
      v-for="item in locales"
      :key="item.code"
      :to="switchLocalePath(item.code)"
      :hreflang="item.language"
      :aria-current="item.code === locale ? 'true' : undefined"
      class="rounded-field px-2 py-1 uppercase transition-opacity hover:opacity-80"
      :class="item.code === locale ? 'text-accent' : 'text-muted'"
    >
      {{ item.code }}
    </NuxtLink>
  </nav>
</template>

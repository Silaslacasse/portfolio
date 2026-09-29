<script setup lang="ts">
/**
 * Shell of the legal pages: title, last-updated date and the copy. The copy is written per
 * locale in the page itself (the `fr` and `en` slots): long legal prose with links reads
 * better as markup than as translation keys, and it is translated as a whole anyway.
 */
const props = defineProps<{
  title: string;
  description: string;
  /** ISO date of the last content change. */
  updated: string;
}>();

const { locale } = useI18n();

useSeoMeta({ title: () => props.title, description: () => props.description });

// UTC so a visitor west of Greenwich does not see the day before (and hydration agrees).
const date = computed(() =>
  new Date(props.updated).toLocaleDateString(locale.value, { dateStyle: "long", timeZone: "UTC" })
);
</script>

<template>
  <section class="container-content py-12 lg:py-20">
    <h1 class="font-display text-display font-bold text-white">{{ title }}</h1>
    <p class="mt-4 text-small text-muted">{{ $t("legal.updated", { date }) }}</p>
    <div class="prose-legal mt-10">
      <slot v-if="locale === 'fr'" name="fr" />
      <slot v-else name="en" />
    </div>
  </section>
</template>

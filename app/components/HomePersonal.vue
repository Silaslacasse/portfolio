<script setup lang="ts">
import star from "~/assets/images/star.webp";
import abstract from "~/assets/images/abstract.webp";
import deco from "~/assets/images/deco2.webp";

const { tm, rt } = useI18n();

/**
 * "À côté du code": three personal notes. Copy lives in the locale files; the visuals are
 * the brand's own 3D shapes until real photos are chosen (they are placeholders, not the
 * final content — see the canvas note).
 */
const visuals = [star, abstract, deco];

const items = computed(() =>
  (tm("home.personal.items") as Array<{ title: string; text: string }>).map((item, index) => ({
    title: rt(item.title),
    text: rt(item.text),
    visual: visuals[index % visuals.length],
  }))
);
</script>

<template>
  <section v-reveal class="container-content py-10 lg:py-20">
    <AppSectionTitle :title="$t('home.personal.title')" :accent="$t('home.personal.accent')" />

    <ul class="mt-10 grid gap-6 sm:grid-cols-3">
      <li
        v-for="(item, index) in items"
        :key="item.title"
        class="flex min-h-60 flex-col justify-between gap-6 rounded-panel p-7"
        :class="index === 1 ? 'bg-surface-raised' : 'bg-surface'"
      >
        <div class="flex h-24 items-center justify-center rounded-card bg-ink">
          <img :src="item.visual" alt="" class="h-16 w-auto" />
        </div>
        <div>
          <h3 class="font-body text-subtitle font-normal">{{ item.title }}</h3>
          <p class="mt-2 text-small text-muted">{{ item.text }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

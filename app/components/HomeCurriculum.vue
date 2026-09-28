<script setup lang="ts">
import pinkPasta from "~/assets/images/pink_pasta.webp";

const { tm, rt } = useI18n();

// CV content lives in the locale files (so English is a translation, not French shown to
// everyone). `tm` returns raw messages; `rt` resolves each string.
interface Entry {
  title: string;
  period: string;
}
const entries = (key: string): Entry[] =>
  (tm(key) as Array<Record<keyof Entry, string>>).map((e) => ({
    title: rt(e.title),
    period: rt(e.period),
  }));

const languages = computed(() =>
  (tm("cv.languages") as Array<{ label: string; stars: number }>).map((l) => ({
    label: rt(l.label),
    stars: l.stars,
  }))
);
const skills = computed(() => (tm("cv.skills") as string[]).map((s) => rt(s)));
const experience = computed(() => entries("cv.experience"));
const education = computed(() => entries("cv.education"));

const tabs = ["skills", "experience", "education"] as const;
const active = ref<(typeof tabs)[number]>("skills");
</script>

<template>
  <!-- scroll-mt keeps the sticky header off the section when #skills is followed. -->
  <section id="skills" class="container-content scroll-mt-28 py-10 lg:py-20">
    <!-- v1 used hidden radios with <h2> labels; these are real tabs for the keyboard. -->
    <div
      role="tablist"
      :aria-label="$t('nav.skills')"
      class="mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-card bg-surface p-2"
    >
      <button
        v-for="tab in tabs"
        :id="`tab-${tab}`"
        :key="tab"
        type="button"
        role="tab"
        :aria-selected="active === tab"
        :aria-controls="`panel-${tab}`"
        class="rounded-field px-4 py-2 text-small font-medium transition-colors"
        :class="
          active === tab
            ? 'bg-footer-gradient text-white'
            : 'text-muted hover:bg-ink hover:text-white'
        "
        @click="active = tab"
      >
        {{ $t(`cv.tabs.${tab}`) }}
      </button>
    </div>

    <div class="mt-10 grid gap-6 lg:grid-cols-[2fr_3fr]">
      <!-- Content panel first on small screens, as v1 did with column-reverse. -->
      <div class="order-1 rounded-card bg-brand-gradient p-1 lg:order-2">
        <div
          :id="`panel-${active}`"
          role="tabpanel"
          :aria-labelledby="`tab-${active}`"
          class="flex h-full flex-col justify-between gap-8 rounded-[calc(var(--radius-card)-4px)] bg-surface p-6 sm:p-10"
        >
          <template v-if="active === 'skills'">
            <img
              :src="pinkPasta"
              width="194"
              height="193"
              alt=""
              class="w-[clamp(6rem,14vw,12rem)]"
            />
            <ul class="flex flex-wrap gap-4">
              <li v-for="skill in skills" :key="skill">
                <AppTag>{{ skill }}</AppTag>
              </li>
            </ul>
          </template>
          <ul v-else class="grid gap-6">
            <li
              v-for="entry in active === 'experience' ? experience : education"
              :key="entry.title"
            >
              <AppTag>{{ entry.title }}</AppTag>
              <p class="mt-3 text-muted">{{ entry.period }}</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="order-2 grid gap-6 lg:order-1 lg:grid-rows-[auto_1fr]">
        <ul class="flex flex-wrap gap-4 rounded-card bg-surface p-6">
          <li v-for="language in languages" :key="language.label">
            <AppTag :stars="language.stars">{{ language.label }}</AppTag>
          </li>
        </ul>
        <p class="rounded-card bg-surface p-6 text-subtitle text-muted">
          {{ $t("cv.softSkills") }}
        </p>
      </div>
    </div>
  </section>
</template>

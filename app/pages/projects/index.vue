<script setup lang="ts">
import type { ProjectCard } from "#shared/types/project";
import star from "~/assets/images/star.webp";
import orangeFlower from "~/assets/icons/orange_flower.webp";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();

useSeoMeta({
  title: () => t("meta.projects.title"),
  description: () => t("meta.projects.description"),
});

// `locale` is a ref, so switching language refetches instead of showing stale copy.
const { data: projects } = await useFetch<ProjectCard[]>("/api/projects", {
  query: { locale },
  default: () => [],
});

// The filter bar: every technology in use, most used first.
const technologies = computed(() => {
  const counts = new Map<string, number>();
  for (const project of projects.value) {
    for (const tech of project.technologies) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }
  return [...counts]
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .map(([name]) => name);
});

// The active filter lives in the URL (?tech=), so a filtered view is a link, not a state.
const active = computed(() => {
  const value = route.query.tech;
  return typeof value === "string" && technologies.value.includes(value) ? value : "";
});
const select = (tech: string) => router.replace({ query: tech ? { tech } : {} });

const shown = computed(() =>
  active.value
    ? projects.value.filter((project) => project.technologies.includes(active.value))
    : projects.value
);

// Bento rhythm: every third tile spans two columns, on alternating sides.
const wide = (index: number) => index % 3 === 0;
const tileClass = (index: number) =>
  wide(index) ? (Math.floor(index / 3) % 2 ? "lg:col-span-2 lg:col-start-2" : "lg:col-span-2") : "";
</script>

<template>
  <section class="container-content py-12 lg:py-20">
    <div class="flex flex-wrap items-end justify-between gap-8">
      <div class="flex max-w-3xl flex-col gap-6">
        <AppSectionTitle tag="h1" :title="$t('projects.heading')" :accent="$t('projects.accent')" />
        <p class="text-lead text-muted">{{ $t("projects.lead") }}</p>
      </div>
      <img
        :src="star"
        width="245"
        height="256"
        alt=""
        aria-hidden="true"
        class="hidden w-44 animate-float lg:block"
      />
    </div>

    <p v-if="!projects.length" class="mt-10 text-muted">{{ $t("projects.empty") }}</p>

    <template v-else>
      <div
        v-if="technologies.length > 1"
        role="group"
        :aria-label="$t('projects.filterLabel')"
        class="mt-12 flex flex-wrap gap-2.5"
      >
        <button
          v-for="tech in ['', ...technologies]"
          :key="tech"
          type="button"
          :aria-pressed="active === tech"
          class="rounded-pill px-4 py-2.5 text-small transition-colors"
          :class="
            active === tech
              ? 'bg-brand-gradient text-white'
              : 'bg-surface text-muted hover:text-white'
          "
          @click="select(tech)"
        >
          {{ tech || $t("projects.filterAll") }}
        </button>
      </div>

      <ul v-reveal class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(project, index) in shown" :key="project._id" :class="tileClass(index)">
          <ProjectCard :project="project" :wide="wide(index)" />
        </li>
        <li>
          <NuxtLink
            :to="`${localePath('index')}#contact`"
            class="group flex h-full min-h-52 flex-col justify-between gap-6 rounded-panel bg-brand-gradient p-6 text-title text-white transition-opacity hover:opacity-90"
          >
            <img :src="orangeFlower" width="74" height="76" alt="" class="w-[4.5rem]" />
            <span class="flex items-center justify-between gap-4 font-display font-bold">
              {{ $t("projects.cta") }}
              <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </section>
</template>

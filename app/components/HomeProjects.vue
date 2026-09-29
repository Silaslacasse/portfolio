<script setup lang="ts">
import type { ProjectCard } from "#shared/types/project";

const { locale } = useI18n();
const localePath = useLocalePath();

// Featured projects first, then display order; three is what the stacked layout is for.
const { data: projects } = await useFetch<ProjectCard[]>("/api/projects", {
  query: { locale },
  default: () => [],
  transform: (list: ProjectCard[]) =>
    [...list].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3),
});

const number = (index: number) => String(index + 1).padStart(2, "0");
</script>

<template>
  <section
    v-if="projects.length"
    id="projects"
    class="project-stack container-content scroll-mt-28 py-10 lg:py-20"
  >
    <!--
      Stacked cards, in CSS only (see .project-stack in main.css): the title pins above the
      stack on tall desktops, each card sticks at --pin plus a step per index, and a card
      recedes as the next one covers it. No scroll listener. The wrapper ends the title's
      pinned range with the stack, which then slides over it on the way out.
    -->
    <div>
      <div class="project-stack__title">
        <AppSectionTitle
          v-reveal
          :title="$t('home.projects.title')"
          :accent="$t('home.projects.accent')"
        />
      </div>

      <ol class="mt-8 grid gap-8" :style="{ '--n': projects.length }">
        <li
          v-for="(project, index) in projects"
          :key="project._id"
          class="sticky"
          :style="{ top: `calc(var(--pin) + ${index} * 1.5rem)`, '--i': index }"
        >
          <article
            class="grid overflow-hidden rounded-panel lg:h-(--card-h) lg:grid-cols-[minmax(0,1fr)_460px] lg:grid-rows-1"
            :class="index % 2 ? 'bg-surface-raised' : 'bg-surface'"
          >
            <div class="aspect-[16/10] lg:aspect-auto lg:h-full">
              <ProjectCover
                :src="project.coverImage"
                :alt="$t('projects.coverAlt', { title: project.title })"
                :seed="project.slug"
                sizes="100vw lg:66vw"
              />
            </div>
            <div class="flex flex-col justify-between gap-8 p-6 sm:p-8">
              <span class="font-display text-display leading-none text-white/40" aria-hidden="true">
                {{ number(index) }}
              </span>
              <div class="flex flex-col gap-4">
                <h3 class="font-display text-title leading-tight font-bold text-white">
                  {{ project.title }}
                </h3>
                <p class="text-muted">{{ project.summary }}</p>
                <ul v-if="project.technologies.length" class="flex flex-wrap gap-2">
                  <li v-for="tech in project.technologies.slice(0, 3)" :key="tech">
                    <AppTag>{{ tech }}</AppTag>
                  </li>
                </ul>
                <NuxtLink
                  :to="localePath({ name: 'projects-slug', params: { slug: project.slug } })"
                  class="w-fit text-white underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
                >
                  {{ $t("home.projects.view") }} →
                </NuxtLink>
              </div>
            </div>
          </article>
        </li>
      </ol>
    </div>

    <div class="mt-10 flex justify-end">
      <AppButton :to="localePath('projects')" variant="outline">
        {{ $t("home.projects.all") }} →
      </AppButton>
    </div>
  </section>
</template>

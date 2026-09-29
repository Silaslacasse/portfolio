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
    class="container-content scroll-mt-28 py-10 lg:py-20"
  >
    <AppSectionTitle
      v-reveal
      :title="$t('home.projects.title')"
      :accent="$t('home.projects.accent')"
    />

    <!--
      Stacked cards, in CSS only: every card is sticky under the header, with `top` growing
      by index so each one peeks out under the next. Later siblings paint over earlier ones,
      which is the whole trick. No scroll listener, and the reduced-motion setting has
      nothing to freeze.
    -->
    <ol class="mt-12 grid gap-8">
      <li
        v-for="(project, index) in projects"
        :key="project._id"
        class="sticky"
        :style="{ top: `calc(6rem + ${index} * 1.5rem)` }"
      >
        <article
          class="grid overflow-hidden rounded-panel shadow-[0_-20px_60px_rgba(0,0,0,0.45)] lg:min-h-[27rem] lg:grid-cols-[minmax(0,1fr)_460px]"
          :class="index % 2 ? 'bg-surface-raised' : 'bg-surface'"
        >
          <div class="aspect-[16/10] lg:aspect-auto">
            <ProjectCover
              :src="project.coverImage"
              :alt="$t('projects.coverAlt', { title: project.title })"
              :seed="project.slug"
              sizes="100vw lg:900px"
            />
          </div>
          <div class="flex flex-col justify-between gap-8 p-6 sm:p-10">
            <span class="font-display text-display text-white/20" aria-hidden="true">
              {{ number(index) }}
            </span>
            <div class="flex flex-col gap-4">
              <h3 class="font-display text-title font-bold text-white">{{ project.title }}</h3>
              <p class="text-muted">{{ project.summary }}</p>
              <ul v-if="project.technologies.length" class="flex flex-wrap gap-2">
                <li v-for="tech in project.technologies.slice(0, 3)" :key="tech">
                  <AppTag>{{ tech }}</AppTag>
                </li>
              </ul>
              <NuxtLink
                :to="localePath({ name: 'projects-slug', params: { slug: project.slug } })"
                class="w-fit text-accent hover:underline"
              >
                {{ $t("home.projects.view") }} →
              </NuxtLink>
            </div>
          </div>
        </article>
      </li>
    </ol>

    <div class="mt-10 flex justify-end">
      <AppButton :to="localePath('projects')" variant="outline">
        {{ $t("home.projects.all") }} →
      </AppButton>
    </div>
  </section>
</template>

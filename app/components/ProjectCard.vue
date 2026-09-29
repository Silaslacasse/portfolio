<script setup lang="ts">
import type { ProjectCard } from "#shared/types/project";

/** A tile of the /projets bento grid. `wide` is the two-column variant. */
defineProps<{ project: ProjectCard; wide?: boolean }>();

const localePath = useLocalePath();
</script>

<template>
  <NuxtLink
    :to="localePath({ name: 'projects-slug', params: { slug: project.slug } })"
    class="group flex h-full flex-col gap-5 rounded-panel bg-surface p-4 transition-colors hover:bg-surface-raised"
  >
    <div
      class="overflow-hidden rounded-card"
      :class="wide ? 'aspect-[16/10] lg:aspect-[2/1]' : 'aspect-[16/10]'"
    >
      <ProjectCover
        :src="project.coverImage"
        :alt="$t('projects.coverAlt', { title: project.title })"
        :seed="project.slug"
        :sizes="wide ? '100vw sm:50vw lg:900px' : '100vw sm:50vw lg:440px'"
      />
    </div>
    <div class="flex flex-col gap-3 px-3 pb-3">
      <h2
        class="flex items-center justify-between gap-4 font-display text-title font-bold text-white"
      >
        {{ project.title }}
        <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
      </h2>
      <p class="text-muted">{{ project.summary }}</p>
      <ul class="flex flex-wrap gap-2">
        <li v-for="tech in project.technologies.slice(0, 3)" :key="tech">
          <AppTag>{{ tech }}</AppTag>
        </li>
        <li v-if="project.year">
          <AppTag
            ><span class="text-muted">{{ project.year }}</span></AppTag
          >
        </li>
      </ul>
    </div>
  </NuxtLink>
</template>

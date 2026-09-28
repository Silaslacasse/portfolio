<script setup lang="ts">
import type { ProjectCard } from "#shared/types/project";

const { t, locale } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t("meta.projects.title"),
  description: () => t("meta.projects.description"),
});

// `locale` is a ref, so switching language refetches instead of showing stale copy.
const { data: projects } = await useFetch<ProjectCard[]>("/api/projects", {
  query: { locale },
  default: () => [],
});
</script>

<template>
  <section class="container-content py-20">
    <h1 class="font-display text-display font-bold">{{ $t("projects.title") }}</h1>

    <p v-if="!projects.length" class="mt-6 text-muted">{{ $t("projects.empty") }}</p>

    <!-- Plain grid on purpose: the card design lands with the Phase 2 redesign. -->
    <ul v-else class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="project in projects" :key="project._id">
        <NuxtLink
          :to="localePath({ name: 'projects-slug', params: { slug: project.slug } })"
          class="block"
        >
          <NuxtImg
            v-if="project.coverImage"
            :src="project.coverImage"
            :alt="project.title"
            width="640"
            height="400"
            class="rounded-lg"
          />
          <h2 class="mt-4 font-display text-xl font-semibold">{{ project.title }}</h2>
          <p class="mt-2 text-muted">{{ project.summary }}</p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

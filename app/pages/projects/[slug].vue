<script setup lang="ts">
import type { ResolvedProject } from "#shared/types/project";

const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

const { data: project, error } = await useFetch<ResolvedProject>(
  () => `/api/projects/${route.params.slug}`,
  { query: { locale } }
);

// Unknown slug and draft both come back 404 from the API; anything else is a real error.
// `fatal` only on the client, where it is what triggers the error page on navigation. On
// the server the throw already renders it, and a fatal error is logged with a stack trace
// per request — bot probes would flood the production logs.
if (!project.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, fatal: import.meta.client });
}

useSeoMeta({
  title: () => project.value?.title,
  description: () => project.value?.summary,
});

const meta = computed(
  () =>
    [
      ["projects.role", project.value?.role],
      ["projects.client", project.value?.client],
      ["projects.year", project.value?.year],
    ].filter(([, value]) => value) as Array<[string, string | number]>
);
</script>

<template>
  <article v-if="project" class="container-content py-20">
    <NuxtLink :to="localePath('projects')" class="text-accent">
      ← {{ $t("projects.backToList") }}
    </NuxtLink>

    <h1 class="mt-6 font-display text-display font-bold">{{ project.title }}</h1>
    <p class="mt-4 text-lg text-muted">{{ project.summary }}</p>

    <dl v-if="meta.length" class="mt-8 flex flex-wrap gap-x-10 gap-y-4">
      <div v-for="[key, value] in meta" :key="key">
        <dt class="text-sm text-muted">{{ $t(key) }}</dt>
        <dd class="font-semibold">{{ value }}</dd>
      </div>
    </dl>

    <ul v-if="project.technologies.length" class="mt-8 flex flex-wrap gap-2">
      <li
        v-for="tech in project.technologies"
        :key="tech"
        class="rounded-full border border-current/20 px-3 py-1 text-sm"
      >
        {{ tech }}
      </li>
    </ul>

    <NuxtImg
      v-if="project.coverImage"
      :src="project.coverImage"
      :alt="project.title"
      width="1280"
      height="800"
      class="mt-10 rounded-lg"
    />

    <!-- Plain text for now; rich content is a later decision. -->
    <div class="mt-10 max-w-prose whitespace-pre-line">{{ project.description }}</div>

    <div v-if="project.url || project.repoUrl" class="mt-10 flex flex-wrap gap-6">
      <a v-if="project.url" :href="project.url" target="_blank" rel="noopener" class="text-accent">
        {{ $t("projects.viewProject") }} ↗
      </a>
      <a
        v-if="project.repoUrl"
        :href="project.repoUrl"
        target="_blank"
        rel="noopener"
        class="text-accent"
      >
        {{ $t("projects.viewCode") }} ↗
      </a>
    </div>

    <ul v-if="project.gallery.length" class="mt-12 grid gap-6 sm:grid-cols-2">
      <li v-for="image in project.gallery" :key="image">
        <NuxtImg :src="image" :alt="project.title" width="960" height="600" class="rounded-lg" />
      </li>
    </ul>
  </article>
</template>

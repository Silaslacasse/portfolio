<script setup lang="ts">
import type { ProjectDetail } from "#shared/types/project";

const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

const { data: project, error } = await useFetch<ProjectDetail>(
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

const pad = (value: number) => String(value).padStart(2, "0");
const label = "text-small tracking-[0.14em] text-muted uppercase";
</script>

<template>
  <article v-if="project" class="container-content py-12 lg:py-20">
    <NuxtLink :to="localePath('projects')" class="text-small text-accent hover:underline">
      ← {{ $t("projects.backToList") }}
    </NuxtLink>

    <header class="mt-6 flex flex-col gap-6">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <h1 class="max-w-4xl font-display text-hero leading-none font-bold text-white">
          {{ project.title }}
        </h1>
        <p class="font-display text-subtitle whitespace-nowrap text-muted">
          {{
            $t("projects.counter", { position: pad(project.position), total: pad(project.total) })
          }}
        </p>
      </div>
      <p class="max-w-4xl text-lead text-muted">{{ project.summary }}</p>

      <dl
        v-if="meta.length || project.technologies.length"
        class="grid gap-6 border-y border-white/10 py-7 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div v-for="[key, value] in meta" :key="key">
          <dt :class="label">{{ $t(key) }}</dt>
          <dd class="mt-2 text-lg">{{ value }}</dd>
        </div>
        <div v-if="project.technologies.length">
          <dt :class="label">{{ $t("projects.technologies") }}</dt>
          <dd class="mt-2 flex flex-wrap gap-2">
            <AppTag v-for="tech in project.technologies" :key="tech">{{ tech }}</AppTag>
          </dd>
        </div>
      </dl>
    </header>

    <div v-reveal class="mt-10 aspect-video overflow-hidden rounded-panel lg:aspect-[2/1]">
      <ProjectCover
        :src="project.coverImage"
        :alt="$t('projects.coverAlt', { title: project.title })"
        :seed="project.slug"
        :width="1352"
        :height="676"
        sizes="100vw lg:1352px"
        loading="eager"
      />
    </div>

    <!-- The side column stays put while the copy scrolls; it goes back in flow on small screens. -->
    <div class="mt-16 grid gap-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
      <aside class="flex flex-col gap-6 self-start lg:sticky lg:top-28">
        <div
          v-if="project.url || project.repoUrl"
          class="flex flex-col gap-3 rounded-card bg-surface p-6"
        >
          <p :class="label">{{ $t("projects.links") }}</p>
          <AppButton v-if="project.url" :href="project.url">
            {{ $t("projects.viewProject") }} ↗
          </AppButton>
          <AppButton v-if="project.repoUrl" :href="project.repoUrl" variant="outline">
            {{ $t("projects.viewCode") }} ↗
          </AppButton>
        </div>

        <nav :aria-label="$t('projects.toc')" class="rounded-card bg-surface p-6">
          <p :class="label">{{ $t("projects.toc") }}</p>
          <ul class="mt-4 flex flex-col gap-2">
            <li>
              <a href="#about" class="text-accent hover:underline">{{ $t("projects.about") }}</a>
            </li>
            <li v-if="project.gallery.length">
              <a href="#gallery" class="text-muted hover:text-accent">{{
                $t("projects.gallery")
              }}</a>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="flex flex-col gap-12">
        <section id="about" class="scroll-mt-28">
          <h2 class="font-display text-title font-bold text-white">{{ $t("projects.about") }}</h2>
          <!-- Plain text with paragraph breaks; rich content is a later decision. -->
          <div class="mt-4 max-w-prose text-lead leading-relaxed whitespace-pre-line text-muted">
            {{ project.description }}
          </div>
        </section>

        <section v-if="project.gallery.length" id="gallery" class="scroll-mt-28">
          <h2 class="font-display text-title font-bold text-white">{{ $t("projects.gallery") }}</h2>
          <ul class="mt-6 grid gap-6 sm:grid-cols-2">
            <li
              v-for="image in project.gallery"
              :key="image"
              v-reveal
              class="aspect-[16/10] overflow-hidden rounded-card"
            >
              <NuxtImg
                :src="image"
                :alt="$t('projects.coverAlt', { title: project.title })"
                width="960"
                height="600"
                sizes="100vw sm:50vw lg:480px"
                loading="lazy"
                class="h-full w-full object-cover"
              />
            </li>
          </ul>
        </section>
      </div>
    </div>

    <NuxtLink
      v-if="project.next"
      :to="localePath({ name: 'projects-slug', params: { slug: project.next.slug } })"
      class="group mt-16 flex items-center justify-between gap-6 rounded-panel bg-brand-gradient p-8 text-white transition-opacity hover:opacity-90 sm:p-12"
    >
      <span class="flex flex-col gap-2">
        <span class="text-small tracking-[0.14em] uppercase opacity-80">
          {{ $t("projects.next") }}
        </span>
        <span class="font-display text-display font-bold">{{ project.next.title }}</span>
      </span>
      <span aria-hidden="true" class="text-display transition-transform group-hover:translate-x-2">
        →
      </span>
    </NuxtLink>
  </article>
</template>

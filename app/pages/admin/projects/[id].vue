<script setup lang="ts">
import type { ProjectInput } from "#shared/schemas/project";
import type { Project } from "#shared/types/project";

definePageMeta({ layout: "admin", middleware: "admin" });

const route = useRoute();
const { data: project, error } = await useFetch<Project>(`/api/admin/projects/${route.params.id}`);
if (!project.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, fatal: import.meta.client });
}

useSeoMeta({ title: () => `${project.value?.title.fr ?? "Projet"} — Admin`, robots: "noindex" });

const pending = ref(false);
const serverError = ref<ApiError | null>(null);

const save = async (input: ProjectInput) => {
  pending.value = true;
  serverError.value = null;
  try {
    await $fetch(`/api/admin/projects/${route.params.id}`, { method: "PUT", body: input });
    await navigateTo("/admin/projects");
  } catch (caught) {
    serverError.value = apiError(caught);
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <div v-if="project">
    <h1 class="font-display text-3xl font-bold">{{ project.title.fr }}</h1>
    <p class="mt-1 text-sm text-muted">/projets/{{ project.slug }}</p>
    <AdminProjectForm
      :initial="project"
      :pending="pending"
      :server-error="serverError"
      @submit="save"
    />
  </div>
</template>

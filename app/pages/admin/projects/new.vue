<script setup lang="ts">
import type { ProjectInput } from "#shared/schemas/project";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Nouveau projet — Admin", robots: "noindex" });

const pending = ref(false);
const serverError = ref<ApiError | null>(null);

const save = async (input: ProjectInput) => {
  pending.value = true;
  serverError.value = null;
  try {
    await $fetch("/api/admin/projects", { method: "POST", body: input });
    await navigateTo("/admin/projects");
  } catch (caught) {
    serverError.value = apiError(caught);
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <div>
    <h1 class="font-display text-3xl font-bold">Nouveau projet</h1>
    <AdminProjectForm :pending="pending" :server-error="serverError" @submit="save" />
  </div>
</template>

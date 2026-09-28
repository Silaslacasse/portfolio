<script setup lang="ts">
import type { Project } from "#shared/types/project";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Projets — Admin", robots: "noindex" });

type Row = Omit<Project, "description">;

const { data: projects, refresh } = await useFetch<Row[]>("/api/admin/projects", {
  default: () => [],
});

const remove = async (project: Row) => {
  if (!confirm(`Supprimer « ${project.title.fr} » ? Cette action est définitive.`)) return;
  await $fetch(`/api/admin/projects/${project._id}`, { method: "DELETE" });
  await refresh();
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-display text-3xl font-bold">Projets</h1>
      <NuxtLink
        to="/admin/projects/new"
        class="rounded-pill bg-accent px-5 py-2 font-semibold text-ink"
      >
        Nouveau projet
      </NuxtLink>
    </div>

    <p v-if="!projects.length" class="mt-8 text-muted">Aucun projet pour l'instant.</p>

    <div v-else class="mt-8 overflow-x-auto rounded-card bg-surface px-6 py-2">
      <table class="w-full text-left text-sm">
        <thead class="text-muted">
          <tr>
            <th class="py-2 font-normal">Titre</th>
            <th class="font-normal">Slug</th>
            <th class="font-normal">Statut</th>
            <th class="font-normal">Ordre</th>
            <th class="font-normal">Modifié</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project._id" class="border-t border-white/10">
            <td class="py-3 font-semibold">
              {{ project.title.fr }}
              <span v-if="project.featured" class="ml-1 text-accent" title="Mis en avant">★</span>
            </td>
            <td class="text-muted">{{ project.slug }}</td>
            <td :class="project.status === 'published' ? 'text-accent' : 'text-muted'">
              {{ project.status === "published" ? "Publié" : "Brouillon" }}
            </td>
            <td>{{ project.order }}</td>
            <td class="text-muted">{{ formatDate(project.updatedAt) }}</td>
            <td class="text-right whitespace-nowrap">
              <NuxtLink :to="`/admin/projects/${project._id}`" class="text-accent"
                >Modifier</NuxtLink
              >
              <span class="text-muted"> · </span>
              <button type="button" class="text-muted hover:text-accent" @click="remove(project)">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

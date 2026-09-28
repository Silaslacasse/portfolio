<script setup lang="ts">
// The admin has one user and is never indexed: French copy is hardcoded, no i18n keys.
const logout = async () => {
  await $fetch("/api/admin/logout", { method: "POST" });
  await navigateTo("/admin");
};
</script>

<template>
  <div class="min-h-svh">
    <header class="container-content flex flex-wrap items-center justify-between gap-4 py-6">
      <NuxtLink to="/admin/projects" class="font-display text-xl font-bold">Admin</NuxtLink>
      <nav class="flex items-center gap-6 text-sm">
        <NuxtLink to="/admin/projects" class="hover:text-accent">Projets</NuxtLink>
        <NuxtLink to="/" class="hover:text-accent">Voir le site</NuxtLink>
        <button type="button" class="hover:text-accent" @click="logout">Se déconnecter</button>
      </nav>
    </header>

    <main class="container-content pb-20">
      <slot />
    </main>
  </div>
</template>

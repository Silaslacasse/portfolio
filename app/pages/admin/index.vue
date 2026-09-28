<script setup lang="ts">
definePageMeta({ layout: false });
useSeoMeta({ title: "Connexion", robots: "noindex" });

const { data: session } = await useFetch("/api/admin/session");
if (session.value?.authenticated) await navigateTo("/admin/projects");

const email = ref("");
const password = ref("");
const error = ref("");
const pending = ref(false);

const MESSAGES: Record<number, string> = {
  401: "Identifiants incorrects.",
  429: "Trop de tentatives. Réessayez dans 15 minutes.",
  503: "L'admin n'est pas configuré sur ce serveur.",
};

const submit = async () => {
  pending.value = true;
  error.value = "";
  try {
    await $fetch("/api/admin/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    await navigateTo("/admin/projects");
  } catch (caught) {
    const { status, message } = apiError(caught);
    error.value = MESSAGES[status] ?? message;
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <main class="container-content flex min-h-svh items-center justify-center py-20">
    <form class="w-full max-w-sm rounded-card bg-surface p-8" @submit.prevent="submit">
      <h1 class="font-display text-2xl font-bold">Connexion</h1>

      <label class="mt-6 block text-sm">
        <span class="text-muted">Email</span>
        <input v-model="email" type="email" autocomplete="username" required class="field" />
      </label>

      <label class="mt-4 block text-sm">
        <span class="text-muted">Mot de passe</span>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="field"
        />
      </label>

      <p v-if="error" class="mt-4 text-sm text-accent" role="alert">{{ error }}</p>

      <button
        type="submit"
        :disabled="pending"
        class="mt-6 w-full rounded-pill bg-accent py-2 font-semibold text-ink disabled:opacity-60"
      >
        {{ pending ? "Connexion…" : "Se connecter" }}
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import type { AdminMessage, DeliveryStatus } from "#shared/types/message";

definePageMeta({ layout: "admin", middleware: "admin" });
useSeoMeta({ title: "Messages — Admin", robots: "noindex" });

const view = ref<"inbox" | "archived">("inbox");

const { data: messages, refresh } = await useFetch<AdminMessage[]>("/api/admin/messages", {
  default: () => [],
});

const shown = computed(() =>
  messages.value.filter((m) => (view.value === "archived" ? m.archivedAt : !m.archivedAt))
);
const unreadCount = computed(() => messages.value.filter((m) => !m.readAt && !m.archivedAt).length);

const update = async (message: AdminMessage, body: { read?: boolean; archived?: boolean }) => {
  await $fetch(`/api/admin/messages/${message._id}`, { method: "PATCH", body });
  await refresh();
};

const remove = async (message: AdminMessage) => {
  if (!confirm(`Supprimer le message de ${fullName(message)} ? Définitif.`)) return;
  await $fetch(`/api/admin/messages/${message._id}`, { method: "DELETE" });
  await refresh();
};

// `failed` is the one that matters: a notification that never reached the mailbox.
const STATUS: Record<DeliveryStatus, { label: string; tone: string }> = {
  sent: { label: "Email envoyé", tone: "text-muted" },
  skipped: { label: "Email non envoyé (mailer non configuré)", tone: "text-muted" },
  pending: { label: "Email en attente", tone: "text-muted" },
  failed: { label: "Échec de l'email — jamais reçu", tone: "font-semibold text-accent" },
};

// Messages received before 2026-09 have a separate first name; newer ones only `name`.
const fullName = (message: AdminMessage) =>
  [message.firstName, message.name].filter(Boolean).join(" ");

const isHttpUrl = (value?: string) => !!value && /^https?:\/\//i.test(value);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-display text-3xl font-bold">
        Messages
        <span v-if="unreadCount" class="ml-2 text-base font-normal text-accent"
          >{{ unreadCount }} non lu{{ unreadCount > 1 ? "s" : "" }}</span
        >
      </h1>
      <div class="flex gap-2 text-sm">
        <button
          v-for="tab in ['inbox', 'archived'] as const"
          :key="tab"
          type="button"
          class="rounded-pill px-4 py-1"
          :class="
            view === tab ? 'bg-accent font-semibold text-ink' : 'text-muted hover:text-accent'
          "
          @click="view = tab"
        >
          {{ tab === "inbox" ? "Boîte de réception" : "Archivés" }}
        </button>
      </div>
    </div>

    <p v-if="!shown.length" class="mt-8 text-muted">
      {{ view === "inbox" ? "Aucun message." : "Aucun message archivé." }}
    </p>

    <ul v-else class="mt-8 grid gap-4">
      <li v-for="m in shown" :key="m._id" class="rounded-card bg-surface p-6">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <p :class="m.readAt ? '' : 'font-semibold'">
            {{ fullName(m) }}
            <span class="text-muted"> · {{ m.society }}</span>
          </p>
          <time :datetime="m.createdAt" class="text-sm text-muted">{{
            formatDate(m.createdAt)
          }}</time>
        </div>

        <p class="mt-1 flex flex-wrap gap-x-4 text-sm">
          <a :href="`mailto:${m.email}`" class="text-accent">{{ m.email }}</a>
          <span v-if="m.mobile">{{ m.mobile }}</span>
          <a
            v-if="isHttpUrl(m.linkedIn)"
            :href="m.linkedIn"
            target="_blank"
            rel="noopener"
            class="text-accent"
          >
            LinkedIn ↗
          </a>
          <span v-else-if="m.linkedIn" class="text-muted">{{ m.linkedIn }}</span>
        </p>

        <p class="mt-4 whitespace-pre-wrap">{{ m.message }}</p>

        <p class="mt-4 text-sm" :class="STATUS[m.deliveryStatus].tone">
          {{ STATUS[m.deliveryStatus].label }}
          <span
            v-if="m.deliveryStatus === 'failed' && m.deliveryError"
            class="font-normal text-muted"
          >
            — {{ m.deliveryError }}
          </span>
        </p>

        <div class="mt-4 flex flex-wrap gap-4 text-sm">
          <button
            type="button"
            class="text-muted hover:text-accent"
            @click="update(m, { read: !m.readAt })"
          >
            {{ m.readAt ? "Marquer non lu" : "Marquer lu" }}
          </button>
          <button
            type="button"
            class="text-muted hover:text-accent"
            @click="update(m, { archived: !m.archivedAt })"
          >
            {{ m.archivedAt ? "Désarchiver" : "Archiver" }}
          </button>
          <button type="button" class="text-muted hover:text-accent" @click="remove(m)">
            Supprimer
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

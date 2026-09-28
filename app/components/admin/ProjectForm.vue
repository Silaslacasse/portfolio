<script setup lang="ts">
import { projectSchema, type ProjectInput } from "#shared/schemas/project";
import type { Project } from "#shared/types/project";
import { fieldErrors } from "#shared/utils/validation";

const props = defineProps<{
  initial?: Project | null;
  pending: boolean;
  serverError?: ApiError | null;
}>();

const emit = defineEmits<{ submit: [input: ProjectInput] }>();

// Text inputs throughout; lists are split on submit, so typing stays free-form.
const form = reactive({
  slug: props.initial?.slug ?? "",
  title: { fr: props.initial?.title.fr ?? "", en: props.initial?.title.en ?? "" },
  summary: { fr: props.initial?.summary.fr ?? "", en: props.initial?.summary.en ?? "" },
  description: {
    fr: props.initial?.description.fr ?? "",
    en: props.initial?.description.en ?? "",
  },
  coverImage: props.initial?.coverImage ?? "",
  gallery: (props.initial?.gallery ?? []).join("\n"),
  technologies: (props.initial?.technologies ?? []).join(", "),
  role: props.initial?.role ?? "",
  client: props.initial?.client ?? "",
  // `type="number"` inputs make v-model cast to a number; an emptied field yields "".
  year: props.initial?.year ?? ("" as number | ""),
  url: props.initial?.url ?? "",
  repoUrl: props.initial?.repoUrl ?? "",
  featured: props.initial?.featured ?? false,
  order: props.initial?.order ?? 0,
  status: props.initial?.status ?? "draft",
});

const localErrors = ref<Record<string, string>>({});

// Same zod schema as the API: a payload that passes here passes there, save for the slug
// uniqueness check, which comes back as a server error on the same field.
const submit = () => {
  const parsed = projectSchema.safeParse({
    ...form,
    coverImage: form.coverImage.trim() || null,
    gallery: form.gallery
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    technologies: form.technologies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    year: form.year === "" ? null : Number(form.year),
  });

  if (!parsed.success) {
    localErrors.value = fieldErrors(parsed.error.issues);
    return;
  }
  localErrors.value = {};
  emit("submit", parsed.data);
};

const errorFor = (key: string) => localErrors.value[key] ?? props.serverError?.fields[key];

const input = "field";
const label = "block text-sm";
const hint = "text-muted";
</script>

<template>
  <form
    class="mt-8 grid gap-6 rounded-card bg-surface p-6 sm:p-8"
    novalidate
    @submit.prevent="submit"
  >
    <label :class="label">
      <span :class="hint">Slug (URL)</span>
      <input v-model="form.slug" type="text" :class="input" placeholder="mon-projet" />
      <p v-if="errorFor('slug')" class="mt-1 text-sm text-accent">{{ errorFor("slug") }}</p>
    </label>

    <div v-for="field in ['title', 'summary', 'description'] as const" :key="field">
      <p class="text-sm font-semibold">
        {{ { title: "Titre", summary: "Résumé", description: "Description" }[field] }}
      </p>
      <div class="mt-1 grid gap-4 sm:grid-cols-2">
        <label v-for="lang in ['fr', 'en'] as const" :key="lang" :class="label">
          <span :class="hint">{{ lang.toUpperCase() }}{{ lang === "fr" ? " (requis)" : "" }}</span>
          <textarea
            v-if="field === 'description'"
            v-model="form[field][lang]"
            rows="10"
            :class="input"
          />
          <input v-else v-model="form[field][lang]" type="text" :class="input" />
          <p v-if="errorFor(`${field}.${lang}`)" class="mt-1 text-sm text-accent">
            {{ errorFor(`${field}.${lang}`) }}
          </p>
        </label>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <label :class="label">
        <span :class="hint">Rôle</span>
        <input v-model="form.role" type="text" :class="input" />
      </label>
      <label :class="label">
        <span :class="hint">Client</span>
        <input v-model="form.client" type="text" :class="input" />
      </label>
      <label :class="label">
        <span :class="hint">Année</span>
        <input v-model="form.year" type="number" min="2000" max="2100" :class="input" />
        <p v-if="errorFor('year')" class="mt-1 text-sm text-accent">{{ errorFor("year") }}</p>
      </label>
      <label :class="label">
        <span :class="hint">Technologies (séparées par des virgules)</span>
        <input v-model="form.technologies" type="text" :class="input" placeholder="Nuxt, MongoDB" />
      </label>
      <label :class="label">
        <span :class="hint">URL du projet</span>
        <input v-model="form.url" type="url" :class="input" />
        <p v-if="errorFor('url')" class="mt-1 text-sm text-accent">{{ errorFor("url") }}</p>
      </label>
      <label :class="label">
        <span :class="hint">URL du dépôt</span>
        <input v-model="form.repoUrl" type="url" :class="input" />
        <p v-if="errorFor('repoUrl')" class="mt-1 text-sm text-accent">{{ errorFor("repoUrl") }}</p>
      </label>
    </div>

    <!-- Image URLs for now; uploads land with the Coolify volume (see ROADMAP). -->
    <label :class="label">
      <span :class="hint">Image de couverture (URL)</span>
      <input v-model="form.coverImage" type="text" :class="input" />
    </label>
    <label :class="label">
      <span :class="hint">Galerie (une URL par ligne)</span>
      <textarea v-model="form.gallery" rows="3" :class="input" />
    </label>

    <div class="grid gap-4 sm:grid-cols-3">
      <label :class="label">
        <span :class="hint">Statut</span>
        <select v-model="form.status" :class="input">
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </label>
      <label :class="label">
        <span :class="hint">Ordre (plus petit en premier)</span>
        <input v-model.number="form.order" type="number" min="0" :class="input" />
      </label>
      <label class="flex items-center gap-2 self-end pb-2 text-sm">
        <input v-model="form.featured" type="checkbox" class="accent-accent" />
        Mis en avant
      </label>
    </div>

    <p v-if="serverError?.message" class="text-sm text-accent" role="alert">
      {{ serverError.message }}
    </p>

    <div class="flex items-center gap-4">
      <button
        type="submit"
        :disabled="pending"
        class="rounded-pill bg-accent px-6 py-2 font-semibold text-ink disabled:opacity-60"
      >
        {{ pending ? "Enregistrement…" : "Enregistrer" }}
      </button>
      <NuxtLink to="/admin/projects" class="text-muted hover:text-accent">Annuler</NuxtLink>
    </div>
  </form>
</template>

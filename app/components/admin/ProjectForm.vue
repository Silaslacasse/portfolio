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

const uploading = ref(false);
const uploadError = ref("");

/** Uploads picked files one by one and drops their URLs into the matching text field. */
const onFiles = async (event: Event, target: "coverImage" | "gallery") => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (!files.length) return;

  uploading.value = true;
  uploadError.value = "";
  try {
    for (const file of files) {
      const body = new FormData();
      body.append("file", file);
      const { url } = await $fetch("/api/admin/uploads", { method: "POST", body });
      if (target === "coverImage") form.coverImage = url;
      else form.gallery = [form.gallery.trim(), url].filter(Boolean).join("\n");
    }
  } catch (caught) {
    uploadError.value = apiError(caught).message;
  } finally {
    uploading.value = false;
    input.value = ""; // so picking the same file again re-triggers `change`
  }
};

const input = "field";
const fileInput =
  "text-sm text-muted file:mr-3 file:rounded-pill file:border-0 file:bg-surface-raised file:px-4 file:py-1 file:text-body";
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

    <!-- Uploading fills the URL fields; pasting an external URL still works. -->
    <div>
      <label :class="label">
        <span :class="hint">Image de couverture (URL)</span>
        <input v-model="form.coverImage" type="text" :class="input" />
      </label>
      <div class="mt-2 flex flex-wrap items-center gap-4">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Téléverser une image de couverture"
          :disabled="uploading"
          :class="fileInput"
          @change="onFiles($event, 'coverImage')"
        />
        <NuxtImg
          v-if="form.coverImage"
          :src="form.coverImage"
          alt=""
          width="160"
          height="100"
          class="h-16 w-auto rounded-field"
        />
      </div>
    </div>
    <div>
      <label :class="label">
        <span :class="hint">Galerie (une URL par ligne)</span>
        <textarea v-model="form.gallery" rows="3" :class="input" />
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        aria-label="Téléverser des images pour la galerie"
        :disabled="uploading"
        :class="[fileInput, 'mt-2']"
        @change="onFiles($event, 'gallery')"
      />
    </div>
    <p v-if="uploading" class="text-sm text-muted">Envoi de l'image…</p>
    <p v-else-if="uploadError" class="text-sm text-accent" role="alert">{{ uploadError }}</p>

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

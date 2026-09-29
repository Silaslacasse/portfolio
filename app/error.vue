<script setup lang="ts">
import type { NuxtError } from "#app";
import star from "~/assets/images/star.webp";

const props = defineProps<{ error: NuxtError }>();

const { t } = useI18n();
const localePath = useLocalePath();

// A missing page and a server failure need different words; everything else is shared.
const key = computed(() => (props.error.statusCode === 404 ? "notFound" : "serverError"));

// app.vue (and its title template) is not rendered for errors, hence the explicit suffix.
useSeoMeta({ title: () => `${t(`${key.value}.title`)} — Jocelyn Duperret`, robots: "noindex" });

// clearError leaves the error state; a plain link would keep rendering this page.
const home = () => clearError({ redirect: localePath("index") });
</script>

<template>
  <!-- In the layout, so a lost visitor still has the header, the nav and the footer. -->
  <NuxtLayout>
    <section
      class="container-content relative flex min-h-[calc(100svh-6rem)] flex-col justify-center py-20"
    >
      <div aria-hidden="true" class="pointer-events-none absolute top-[15%] right-[12%]">
        <div
          class="absolute top-1/2 left-1/2 size-[clamp(28rem,60vw,64rem)] -translate-1/2 bg-hero-glow"
        />
        <img
          :src="star"
          width="245"
          height="256"
          alt=""
          class="relative w-[clamp(6rem,13vw,12rem)] animate-float"
        />
      </div>

      <p
        aria-hidden="true"
        class="relative w-fit font-display text-giant leading-none font-extrabold text-gradient"
      >
        {{ error.statusCode }}
      </p>
      <h1 class="relative mt-6 font-display text-display font-bold text-white">
        {{ t(`${key}.title`) }}
      </h1>
      <p class="relative mt-4 max-w-xl text-lead text-muted">{{ t(`${key}.description`) }}</p>
      <div class="relative mt-10">
        <AppButton size="lg" @click="home">{{ t("notFound.back") }} →</AppButton>
      </div>
    </section>
  </NuxtLayout>
</template>

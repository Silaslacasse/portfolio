<script setup lang="ts">
import shape from "~/assets/images/pink_pasta.webp";

const { t } = useI18n();
</script>

<template>
  <!--
    Direction A hero: the name as a giant two-line title, a glow and one floating 3D shape
    in the top-right corner. The shape is sized in vw and placed in percentages of the
    section, so no breakpoint re-pins it. The section does not clip:
    the glow spills past the content edges, under the header and to the screen edges (the
    layout clips horizontal overflow). No scroll reveal here: the hero is the LCP and must
    be in the first paint.
  -->
  <section
    class="container-content relative flex min-h-[calc(100svh-6rem)] flex-col justify-center py-16"
  >
    <!-- The glow is centred on the shape, so the two stay together at every width. -->
    <div aria-hidden="true" class="pointer-events-none absolute top-[10%] right-[12%]">
      <div
        class="absolute top-1/2 left-1/2 size-[clamp(32rem,70vw,80rem)] -translate-1/2 bg-hero-glow"
      />
      <img
        :src="shape"
        width="194"
        height="193"
        alt=""
        class="relative w-[clamp(6rem,14vw,12.5rem)] animate-float"
      />
    </div>

    <div class="relative animate-rise">
      <AppSectionTitle
        tag="h1"
        size="giant"
        :title="t('home.heroFirstName')"
        :accent="t('home.heroLastName')"
      />
      <p class="mt-6 text-title text-muted">{{ t("home.heroRole") }}</p>
    </div>

    <a
      href="#trust"
      class="group relative mt-12 flex w-fit items-center gap-3 text-small tracking-[0.12em] text-muted uppercase transition-colors hover:text-white"
    >
      <span
        aria-hidden="true"
        class="flex h-11 w-7 justify-center rounded-pill border-2 border-current pt-2"
      >
        <span class="h-2 w-1 rounded-full bg-accent group-hover:animate-bounce" />
      </span>
      {{ t("home.scroll") }}
    </a>
  </section>
</template>

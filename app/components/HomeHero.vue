<script setup lang="ts">
import shape from "~/assets/images/pink_pasta.webp";

const { t } = useI18n();
</script>

<template>
  <!--
    Direction A hero: eyebrow, the name as a giant two-line title, a glow and one floating
    3D shape in the top-right corner. The glow and the shape are sized in vw and placed in
    percentages of the section, so no breakpoint re-pins them. No scroll reveal here: the
    hero is the LCP and must be in the first paint.
  -->
  <section
    class="container-content relative flex min-h-[calc(100svh-6rem)] flex-col justify-center overflow-hidden py-16"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-[15%] -right-[10%] size-[clamp(20rem,50vw,45rem)] rounded-full bg-hero-glow"
    />
    <img
      :src="shape"
      width="194"
      height="193"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute top-[10%] right-[12%] w-[clamp(6rem,14vw,12.5rem)] animate-float"
    />

    <div class="relative animate-rise">
      <AppSectionTitle
        tag="h1"
        size="giant"
        :eyebrow="t('home.heroEyebrow')"
        :title="t('home.heroFirstName')"
        :accent="t('home.heroLastName')"
      />
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

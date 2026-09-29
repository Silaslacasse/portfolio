<script setup lang="ts">
import avatar from "~/assets/images/avatar.webp";
import orangeFlower from "~/assets/icons/orange_flower.webp";
import mailIcon from "~/assets/icons/mail_send.webp";

const localePath = useLocalePath();
</script>

<template>
  <!--
    The section title moved out of the card in the redesign; the 2×2 tile grid under it is
    unchanged. One grid, one fluid gutter; the two tiles are the links they always looked like.
  -->
  <section class="container-content py-10 lg:py-20">
    <AppSectionTitle v-reveal :title="$t('home.about.title')" :accent="$t('home.about.accent')" />

    <div v-reveal class="mt-10 grid gap-6 lg:grid-cols-2 lg:grid-rows-2">
      <div class="rounded-panel bg-surface p-6 sm:p-8 lg:row-span-2">
        <div class="flex flex-wrap justify-between gap-6 sm:flex-nowrap">
          <!-- max-w in `ch` does what v1's hard <br> did: the greeting breaks after "c'est". -->
          <p class="max-w-[15ch] self-end font-body text-display leading-tight">
            {{ $t("home.aboutGreeting") }}
          </p>
          <img
            :src="avatar"
            width="587"
            height="587"
            :alt="$t('home.avatarAlt')"
            class="w-[clamp(9rem,25vw,15.5rem)] rounded-card bg-accent"
          />
        </div>
        <p class="mt-6 text-subtitle text-muted">{{ $t("home.aboutText") }}</p>
      </div>

      <NuxtLink
        :to="localePath('projects')"
        class="group flex min-h-48 flex-col justify-between rounded-panel bg-violet p-6 text-title transition-opacity hover:opacity-90"
      >
        <img :src="orangeFlower" width="74" height="76" alt="" class="w-[4.5rem]" />
        <span class="flex items-center justify-between gap-4">
          {{ $t("nav.projects") }}
          <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </NuxtLink>

      <NuxtLink
        :to="`${localePath('index')}#contact`"
        class="group grid min-h-48 grid-cols-[1fr_auto] rounded-panel bg-brand-gradient p-1 text-title transition-opacity hover:opacity-90"
      >
        <span class="flex items-end justify-between gap-4 p-5">
          {{ $t("nav.contact") }}
          <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
        </span>
        <span
          class="flex w-20 items-center justify-center rounded-[calc(var(--radius-panel)-4px)] bg-white"
        >
          <!-- brightness-0 turns the white icon black; adding `invert` would flip it back. -->
          <img :src="mailIcon" width="45" height="45" alt="" class="w-11 brightness-0" />
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

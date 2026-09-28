<script setup lang="ts">
import star from "~/assets/images/star.webp";
import abstract from "~/assets/images/abstract.webp";
import deco1 from "~/assets/images/deco1.webp";
import deco2 from "~/assets/images/deco2.webp";
import twick from "~/assets/icons/orange_deco.webp";
import frame from "~/assets/icons/frame.webp";
import mailIcon from "~/assets/icons/mail_send.webp";

const localePath = useLocalePath();
</script>

<template>
  <!--
    v1 pinned the two floating shapes with `right: 667px` → 450 → 350 → 250 → 150 across
    seven breakpoints and hid the desktop title under 850px for a second, hand-sized copy.
    Here everything derives from two things: the section's own box (shapes are placed in
    percentages of it) and the fluid hero type (the inline pills and their twicks are sized
    in `em`, so they shrink with the words they sit between).
  -->
  <section
    class="container-content relative flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center py-16"
  >
    <img
      :src="star"
      width="245"
      height="256"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute top-[4%] right-[8%] w-[clamp(6.5rem,15vw,15rem)] lg:right-[16%]"
    />
    <img
      :src="abstract"
      width="273"
      height="269"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute bottom-[8%] left-[6%] w-[clamp(6.5rem,17vw,17rem)] lg:left-[14%]"
    />

    <h1
      class="relative z-10 flex flex-col items-center gap-y-2 text-center font-display text-hero leading-[1.1] font-bold text-white uppercase"
    >
      <span class="flex flex-wrap items-center justify-center gap-x-[0.25em] gap-y-2">
        <span>{{ $t("home.heroName") }}</span>
        <span
          class="relative inline-block h-[0.85em] w-[2.05em] -rotate-6 rounded-pill bg-cover bg-center"
          :style="{ backgroundImage: `url(${deco1})` }"
        >
          <img
            :src="twick"
            width="44"
            height="45"
            alt=""
            class="absolute -top-[0.2em] -left-[0.1em] w-[0.45em]"
          />
        </span>
      </span>
      <span class="flex flex-wrap items-center justify-center gap-x-[0.25em] gap-y-2">
        <span>{{ $t("home.heroRoleStart") }}</span>
        <span
          class="relative inline-block h-[0.85em] w-[2.05em] rotate-6 rounded-pill bg-cover bg-center"
          :style="{ backgroundImage: `url(${deco2})` }"
        >
          <img
            :src="frame"
            width="162"
            height="162"
            alt=""
            class="absolute -bottom-[0.15em] -left-[0.15em] w-[0.8em] -rotate-12"
          />
        </span>
        <span>{{ $t("home.heroRoleEnd") }}</span>
      </span>
    </h1>

    <!-- In flow below the title; pinned bottom-right only where there is room for it. -->
    <div class="relative z-10 mt-12 lg:absolute lg:right-gutter lg:bottom-10 lg:mt-0">
      <img
        :src="twick"
        width="44"
        height="45"
        alt=""
        class="pointer-events-none absolute -top-3 -left-3 w-8"
      />
      <AppButton :to="`${localePath('index')}#contact`" size="lg">
        {{ $t("nav.contact") }}
        <img :src="mailIcon" width="22" height="22" alt="" />
      </AppButton>
    </div>
  </section>
</template>

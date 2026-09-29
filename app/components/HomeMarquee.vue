<script setup lang="ts">
import { Vue3Marquee } from "vue3-marquee";
import starFlower from "~/assets/icons/star_flower.png";
import dottsFlower from "~/assets/icons/dotts_flower.png";
import roundFlower from "~/assets/icons/round_flower.png";
import abstractFlower from "~/assets/icons/abstract_flower.png";
import arrayFlower from "~/assets/icons/array_flower.png";

const technos = [
  { icon: starFlower, name: "HTML/CSS" },
  { icon: dottsFlower, name: "Php/Symfony" },
  { icon: roundFlower, name: "JavaScript/VueJS/React" },
  { icon: abstractFlower, name: "Node/Express" },
  { icon: arrayFlower, name: "Sql/MongoDB" },
];
</script>

<template>
  <!--
    Decorative: the same skills are listed, readable, in the curriculum section, so screen
    readers are spared an endlessly repeating list. The global reduced-motion rule freezes
    the animation for users who asked for that. `relative` so it paints over the hero glow
    that spills down past the hero.
  -->
  <div class="relative overflow-hidden bg-brand-gradient py-5" aria-hidden="true">
    <Vue3Marquee :duration="50" :pause-on-hover="true">
      <ul class="flex items-center gap-[clamp(2rem,5vw,4.5rem)] pr-[clamp(2rem,5vw,4.5rem)]">
        <li
          v-for="techno in technos"
          :key="techno.name"
          class="flex shrink-0 items-center gap-[clamp(1rem,2.5vw,3rem)] font-body text-title font-light whitespace-nowrap text-white"
        >
          <img
            :src="techno.icon"
            width="41"
            height="40"
            alt=""
            class="w-[clamp(2rem,3.5vw,3.125rem)]"
          />
          {{ techno.name }}
        </li>
      </ul>
    </Vue3Marquee>
  </div>
</template>

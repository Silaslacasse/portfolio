<script setup lang="ts">
import jossWordmark from "~/assets/images/JOSS2.webp";

const localePath = useLocalePath();
const year = new Date().getFullYear();
</script>

<template>
  <footer class="container-content pb-8">
    <div class="overflow-hidden rounded-card bg-footer-gradient px-5 pt-12 pb-6 sm:px-10 sm:pt-16">
      <!-- The wordmark is the footer; the image scales with the card instead of a breakpoint. -->
      <img
        :src="jossWordmark"
        width="1352"
        height="447"
        alt="JOSS"
        class="mx-auto w-full max-w-5xl"
      />

      <ul class="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-small">
        <li>
          <NuxtLink :to="localePath('cookie-policy')" class="hover:underline">
            {{ $t("footer.cookiePolicy") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('legal-notice')" class="hover:underline">
            {{ $t("footer.legalNotice") }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('privacy-policy')" class="hover:underline">
            {{ $t("footer.privacyPolicy") }}
          </NuxtLink>
        </li>
        <li>{{ $t("footer.rights", { year }) }}</li>
      </ul>
    </div>
  </footer>
</template>

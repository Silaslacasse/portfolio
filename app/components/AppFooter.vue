<script setup lang="ts">
const localePath = useLocalePath();
const year = new Date().getFullYear();
</script>

<template>
  <footer class="container-content pb-10">
    <div class="rounded-card bg-footer-gradient px-6 py-10 text-center">
      <ul class="flex flex-wrap items-center justify-center gap-6 text-small">
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
        <li>
          <NuxtLink :to="localePath('cookie-policy')" class="hover:underline">
            {{ $t("footer.cookiePolicy") }}
          </NuxtLink>
        </li>
        <li>{{ $t("footer.rights", { year }) }}</li>
      </ul>
    </div>
  </footer>
</template>

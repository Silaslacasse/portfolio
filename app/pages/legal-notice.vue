<script setup lang="ts">
const localePath = useLocalePath();
const contact = computed(() => `${localePath("index")}#contact`);
</script>

<template>
  <LegalPage
    :title="$t('meta.legalNotice.title')"
    :description="$t('meta.legalNotice.description')"
    updated="2026-09-29"
  >
    <template #fr>
      <h2>Éditeur du site</h2>
      <p>
        Ce site est édité à titre personnel et non professionnel par Jocelyn Duperret, personne
        physique. Pour toute question, utilisez le
        <NuxtLink :to="contact">formulaire de contact</NuxtLink>.
      </p>

      <h2>Directeur de la publication</h2>
      <p>Jocelyn Duperret.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est auto-hébergé : il fonctionne sur un serveur personnel administré par l’éditeur,
        situé en France, joignable via le
        <NuxtLink :to="contact">formulaire de contact</NuxtLink>.
      </p>
      <p>
        Le trafic transite par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107,
        États-Unis (<a href="https://www.cloudflare.com" rel="noopener">cloudflare.com</a>), qui
        assure la protection et la mise en cache du site.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes du site, le logo JOSS et les projets présentés, réalisés par l’éditeur à titre
        personnel, lui appartiennent. Toute reproduction ou réutilisation sans autorisation
        préalable est interdite. Les noms et logos des entreprises citées appartiennent à leurs
        titulaires respectifs.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Le traitement des données envoyées par le formulaire de contact est décrit dans la
        <NuxtLink :to="localePath('privacy-policy')">politique de confidentialité</NuxtLink>, et les
        cookies du site dans la page
        <NuxtLink :to="localePath('cookie-policy')">gestion des cookies</NuxtLink>.
      </p>
    </template>

    <template #en>
      <h2>Publisher</h2>
      <p>
        This website is published on a personal, non-commercial basis by Jocelyn Duperret, a private
        individual. For any question, please use the
        <NuxtLink :to="contact">contact form</NuxtLink>.
      </p>

      <h2>Publication director</h2>
      <p>Jocelyn Duperret.</p>

      <h2>Hosting</h2>
      <p>
        The site is self-hosted: it runs on a personal server administered by the publisher, located
        in France, reachable through the <NuxtLink :to="contact">contact form</NuxtLink>.
      </p>
      <p>
        Traffic goes through Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, United
        States (<a href="https://www.cloudflare.com" rel="noopener">cloudflare.com</a>), which
        protects and caches the site.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The site’s texts, the JOSS logo and the projects shown, personal work by the publisher,
        belong to the publisher. Any reproduction or reuse without prior permission is prohibited.
        The names and logos of the companies mentioned belong to their respective owners.
      </p>

      <h2>Personal data and cookies</h2>
      <p>
        How the contact form’s data is handled is described in the
        <NuxtLink :to="localePath('privacy-policy')">privacy policy</NuxtLink>, and the site’s
        cookies in the <NuxtLink :to="localePath('cookie-policy')">cookie policy</NuxtLink>.
      </p>
    </template>
  </LegalPage>
</template>

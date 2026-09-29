<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <LegalPage
    :title="$t('meta.cookiePolicy.title')"
    :description="$t('meta.cookiePolicy.description')"
    updated="2026-09-29"
  >
    <template #fr>
      <p>
        Un cookie est un petit fichier déposé sur votre appareil par le site que vous consultez. Ce
        site n’utilise aucun cookie publicitaire ni de mesure d’audience : les seuls cookies déposés
        sont nécessaires à son fonctionnement et sont donc dispensés de consentement (article 82 de
        la loi Informatique et Libertés). C’est pourquoi aucun bandeau ne vous est présenté.
      </p>

      <h2>Cookies utilisés</h2>
      <ul>
        <li>
          <code>i18n_locale</code> — retient la langue choisie (français ou anglais). Durée : 12
          mois.
        </li>
        <li>
          <code>messageSent</code> — déposé après l’envoi d’un message, pour afficher la
          confirmation et éviter un second envoi. Durée : 24 heures.
        </li>
        <li>
          <code>admin_session</code> — session de l’espace d’administration, déposé uniquement pour
          l’éditeur du site. Durée : 7 jours.
        </li>
        <li>
          Cloudflare, qui protège le site, peut déposer des cookies techniques de sécurité (par
          exemple <code>__cf_bm</code>, 30 minutes) pour distinguer les visiteurs des robots.
        </li>
      </ul>

      <h2>Gérer les cookies</h2>
      <p>
        Vous pouvez supprimer ou bloquer les cookies depuis les réglages de votre navigateur. Les
        bloquer peut empêcher la mémorisation de la langue ou l’affichage de la confirmation
        d’envoi, sans gêner la consultation du site.
      </p>
      <p>
        Les données envoyées par le formulaire de contact sont traitées comme décrit dans la
        <NuxtLink :to="localePath('privacy-policy')">politique de confidentialité</NuxtLink>.
      </p>
    </template>

    <template #en>
      <p>
        A cookie is a small file stored on your device by the site you are visiting. This site uses
        no advertising or analytics cookies: the only cookies it sets are required for it to work,
        and are therefore exempt from consent under French law (article 82 of the Loi Informatique
        et Libertés). That is why no cookie banner is shown.
      </p>

      <h2>Cookies used</h2>
      <ul>
        <li>
          <code>i18n_locale</code> — remembers the language you chose (French or English). Lifetime:
          12 months.
        </li>
        <li>
          <code>messageSent</code> — set once you have sent a message, to show the confirmation and
          prevent a second submission. Lifetime: 24 hours.
        </li>
        <li>
          <code>admin_session</code> — session for the administration area, only ever set for the
          site’s publisher. Lifetime: 7 days.
        </li>
        <li>
          Cloudflare, which protects the site, may set technical security cookies (for instance
          <code>__cf_bm</code>, 30 minutes) to tell visitors from bots.
        </li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        You can delete or block cookies from your browser settings. Blocking them may stop the site
        from remembering your language or showing the sending confirmation, without getting in the
        way of browsing.
      </p>
      <p>
        Data sent through the contact form is handled as described in the
        <NuxtLink :to="localePath('privacy-policy')">privacy policy</NuxtLink>.
      </p>
    </template>
  </LegalPage>
</template>

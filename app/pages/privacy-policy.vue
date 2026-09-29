<script setup lang="ts">
const localePath = useLocalePath();
const contact = computed(() => `${localePath("index")}#contact`);
</script>

<template>
  <LegalPage
    :title="$t('meta.privacyPolicy.title')"
    :description="$t('meta.privacyPolicy.description')"
    updated="2026-09-29"
  >
    <template #fr>
      <h2>Responsable du traitement</h2>
      <p>
        Jocelyn Duperret, éditeur du site, joignable via le
        <NuxtLink :to="contact">formulaire de contact</NuxtLink>.
      </p>

      <h2>Données collectées</h2>
      <p>Le site ne collecte des données personnelles que lorsque vous envoyez un message :</p>
      <ul>
        <li>votre nom, votre adresse email et votre message (obligatoires) ;</li>
        <li>votre société et votre numéro de téléphone (facultatifs) ;</li>
        <li>votre adresse IP et votre navigateur (user agent), enregistrés avec le message.</li>
      </ul>
      <p>
        Il n’y a ni compte utilisateur, ni publicité, ni outil tiers de mesure d’audience. Les
        polices sont hébergées sur le site : votre navigateur ne contacte aucun autre service.
      </p>

      <h2>Finalités et base légale</h2>
      <ul>
        <li>
          Répondre à votre message : intérêt légitime de l’éditeur à traiter les demandes qui lui
          sont adressées, ou mesures précontractuelles lorsque la demande porte sur une mission ou
          un poste (article 6.1.f et 6.1.b du RGPD).
        </li>
        <li>
          Prévenir les abus : l’adresse IP et l’adresse email servent à limiter l’envoi à un message
          par jour et à repérer le spam (intérêt légitime, article 6.1.f du RGPD).
        </li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Les messages et les données associées sont supprimés automatiquement
        <strong>24 mois</strong> après leur réception. Vous pouvez demander leur suppression plus
        tôt.
      </p>

      <h2>Destinataires</h2>
      <p>
        Vos données ne sont ni vendues ni cédées. Seul l’éditeur y a accès ; elles sont stockées sur
        le serveur qui héberge le site. Deux prestataires interviennent dans le fonctionnement du
        service :
      </p>
      <ul>
        <li>
          <a href="https://resend.com/legal/privacy-policy" rel="noopener">Resend, Inc.</a>
          (États-Unis), qui achemine l’email de notification envoyé à l’éditeur pour chaque message
          ;
        </li>
        <li>
          <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare, Inc.</a>
          (États-Unis), par lequel transite le trafic du site, adresse IP comprise. Son service
          Turnstile protège aussi le formulaire contre les robots : à l’affichage du formulaire, il
          analyse des signaux techniques du navigateur, sans cookie publicitaire ni profilage
          (intérêt légitime : la sécurité du service).
        </li>
      </ul>
      <p>
        Une notification réduite (nom, société et adresse email, sans le message) peut aussi être
        transmise à l’éditeur par messagerie instantanée. Les transferts vers les États-Unis sont
        encadrés par les garanties prévues par le RGPD (EU-US Data Privacy Framework ou clauses
        contractuelles types de la Commission européenne).
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation,
        d’opposition et de portabilité de vos données. Pour l’exercer, écrivez via le
        <NuxtLink :to="contact">formulaire de contact</NuxtLink> en précisant l’adresse email
        utilisée ; une réponse vous est apportée sous un mois. Vous pouvez aussi introduire une
        réclamation auprès de la <a href="https://www.cnil.fr/fr/plaintes" rel="noopener">CNIL</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n’utilise que des cookies nécessaires à son fonctionnement, détaillés dans la page
        <NuxtLink :to="localePath('cookie-policy')">gestion des cookies</NuxtLink>.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges avec le site sont chiffrés (HTTPS) et les messages ne sont consultables que
        depuis un espace d’administration protégé, réservé à l’éditeur.
      </p>
    </template>

    <template #en>
      <h2>Data controller</h2>
      <p>
        Jocelyn Duperret, publisher of this site, reachable through the
        <NuxtLink :to="contact">contact form</NuxtLink>.
      </p>

      <h2>Data collected</h2>
      <p>The site only collects personal data when you send a message:</p>
      <ul>
        <li>your name, email address and message (required);</li>
        <li>your company and phone number (optional);</li>
        <li>your IP address and browser (user agent), stored with the message.</li>
      </ul>
      <p>
        There are no user accounts, no ads and no third-party analytics. Fonts are served by the
        site itself: your browser contacts no other service.
      </p>

      <h2>Purposes and legal basis</h2>
      <ul>
        <li>
          Answering your message: the publisher’s legitimate interest in handling the requests sent
          through the site, or pre-contractual steps when the request is about a project or a
          position (GDPR article 6.1.f and 6.1.b).
        </li>
        <li>
          Preventing abuse: the IP and email addresses are used to limit sending to one message a
          day and to spot spam (legitimate interest, GDPR article 6.1.f).
        </li>
      </ul>

      <h2>Retention</h2>
      <p>
        Messages and their associated data are deleted automatically <strong>24 months</strong>
        after they arrive. You can ask for them to be deleted sooner.
      </p>

      <h2>Recipients</h2>
      <p>
        Your data is neither sold nor shared. Only the publisher has access to it; it is stored on
        the server hosting the site. Two providers take part in running the service:
      </p>
      <ul>
        <li>
          <a href="https://resend.com/legal/privacy-policy" rel="noopener">Resend, Inc.</a>
          (United States), which delivers the notification email sent to the publisher for each
          message;
        </li>
        <li>
          <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare, Inc.</a>
          (United States), through which the site’s traffic passes, IP address included. Its
          Turnstile service also shields the form from bots: when the form is shown, it checks
          technical signals from the browser, without advertising cookies or profiling (legitimate
          interest: keeping the service secure).
        </li>
      </ul>
      <p>
        A shorter notification (name, company and email address, without the message) may also reach
        the publisher through an instant messaging service. Transfers to the United States rely on
        the safeguards provided by the GDPR (EU-US Data Privacy Framework or the European
        Commission’s standard contractual clauses).
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access, rectify, erase, restrict, object to and port your data. To
        exercise it, write through the <NuxtLink :to="contact">contact form</NuxtLink> giving the
        email address you used; you will get an answer within a month. You can also lodge a
        complaint with the French data protection authority, the
        <a href="https://www.cnil.fr/fr/plaintes" rel="noopener">CNIL</a>.
      </p>

      <h2>Cookies</h2>
      <p>
        The site only uses cookies it needs to work, listed in the
        <NuxtLink :to="localePath('cookie-policy')">cookie policy</NuxtLink>.
      </p>

      <h2>Security</h2>
      <p>
        Exchanges with the site are encrypted (HTTPS), and messages can only be read from a
        protected administration area reserved for the publisher.
      </p>
    </template>
  </LegalPage>
</template>

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "@nuxtjs/seo",
    "@pinia/nuxt",
    "@nuxt/eslint",
  ],

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      link: [
        // Generated from the brand mark. v1 declared `href="\orange_flower.webp"` — a
        // backslash, and typed as image/svg+xml for a webp — so the icon never loaded.
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico", sizes: "any" },
        { rel: "icon", type: "image/webp", href: "/orange_flower.webp" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
    },
  },

  // Tailwind v4 ships as a Vite plugin. @nuxtjs/tailwindcss still pins v3, so using that
  // module here would silently downgrade us.
  vite: { plugins: [tailwindcss()] },

  future: { compatibilityVersion: 4 },

  runtimeConfig: {
    mongoUri: "",
    resendApiKey: "",
    mailFrom: "",
    mailTo: "",
    notifyWebhookUrl: "",
    jwtSecret: "",
    messageRateLimitHours: "24",
    public: {
      // Base URL of the v1 Express API, until Phase 3 moves the endpoint into Nitro.
      // Empty string = same origin. Safe to define: NUXT_PUBLIC_API_BASE does not
      // collide with the NUXT_PUBLIC_SITE_* prefix nuxt-site-config consumes.
      apiBase: "",
    },
    // No `public.siteUrl` key here on purpose: it would capture NUXT_PUBLIC_SITE_URL and
    // starve nuxt-site-config, which needs that same variable to resolve site.url for
    // the sitemap, robots.txt and canonical tags.
  },

  /**
   * `url` is deliberately absent: nuxt-site-config reads NUXT_PUBLIC_SITE_URL at runtime.
   * Hardcoding it here evaluates at build time, which bakes the build machine's URL into
   * every canonical, hreflang and sitemap entry.
   */
  site: {
    name: "Jocelyn Duperret",
    defaultLocale: "fr",
  },

  i18n: {
    defaultLocale: "fr",
    // French URLs stay unprefixed (/), English is served under /en.
    // Locale lives in the path rather than in a runtime toggle so each language is
    // separately crawlable — a toggle alone means Google only ever indexes one.
    strategy: "prefix_except_default",
    // Absolute hreflang/canonical URLs require this. The value here is only a build-time
    // default; NUXT_PUBLIC_I18N_BASE_URL overrides it at runtime (verified below).
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    locales: [
      { code: "fr", language: "fr-FR", name: "Français", file: "fr.json" },
      { code: "en", language: "en-US", name: "English", file: "en.json" },
    ],
    // Page files are named in English; each locale gets its own URL. Keeps French URLs
    // idiomatic (/projets) without duplicating page components.
    customRoutes: "config",
    pages: {
      "projects/index": { fr: "/projets", en: "/projects" },
      "projects/[slug]": { fr: "/projets/[slug]", en: "/projects/[slug]" },
      "legal-notice": { fr: "/mentions-legales", en: "/legal-notice" },
      "privacy-policy": { fr: "/politique-de-confidentialite", en: "/privacy-policy" },
      "cookie-policy": { fr: "/gestion-des-cookies", en: "/cookie-policy" },
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      redirectOn: "root",
      alwaysRedirect: false,
    },
  },

  image: {
    format: ["avif", "webp"],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },

  fonts: {
    // Downloads, subsets, self-hosts and applies font-display automatically.
    // This is what replaces the 1 MB of hand-committed .ttf files (71% of the old build).
    families: [
      { name: "Poppins", provider: "google", weights: [300, 400, 600, 700] },
      { name: "Plus Jakarta Sans", provider: "google", weights: [400, 700, 800] },
    ],
  },

  /**
   * `swr`, not `isr`: ISR is a Vercel/Netlify primitive, and Coolify runs the node-server
   * preset. SWR gives the same practical result there — the first request renders, later
   * ones are served from cache and revalidated in the background.
   *
   * Nothing that reads MongoDB is prerendered: the Coolify build container has no database
   * access, so a build-time fetch would fail or bake in empty content.
   */
  routeRules: {
    "/": { swr: 3600 },
    "/en": { swr: 3600 },
    "/projets/**": { swr: 3600 },
    "/en/projects/**": { swr: 3600 },
    "/mentions-legales": { prerender: true },
    "/politique-de-confidentialite": { prerender: true },
    "/gestion-des-cookies": { prerender: true },
    "/en/legal-notice": { prerender: true },
    "/en/privacy-policy": { prerender: true },
    "/en/cookie-policy": { prerender: true },
    "/admin/**": { ssr: false, robots: false },
    "/api/**": { robots: false },
  },

  /**
   * Auto-generated social cards are a Phase 4 deliverable. The renderer is a native
   * binary (@takumi-rs/core), which would need to match the architecture of the Coolify
   * build container — not worth carrying until we actually design the card.
   */
  ogImage: { enabled: false },

  /**
   * Off during builds. It only inspects prerendered output, so every link to an SSR/swr
   * route (/projets, /en, /en/projects) is reported as a 404 it cannot resolve — nine
   * false positives that drown out anything real. Re-enable if the site ever becomes
   * fully prerendered.
   */
  linkChecker: { enabled: false },

  nitro: {
    compressPublicAssets: true,
  },

  typescript: { strict: true },
});

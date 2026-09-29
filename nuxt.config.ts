import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

/**
 * SWR only in production. Nitro honours it in `nuxt dev` too, persisting rendered HTML
 * under .nuxt/cache for an hour — so an edit to a cached page silently does not show,
 * and a component removed in the meantime produces 404s and a hydration mismatch.
 */
const swr = process.env.NODE_ENV === "production" ? { swr: 3600 } : {};

/**
 * Security headers on every response, production only: the dev server needs inline
 * scripts, eval and a websocket for HMR.
 *
 * ponytail: script-src allows 'unsafe-inline' because Nuxt injects an inline config script
 * (and AppIntro has one); per-request nonces (nuxt-security) are the upgrade if the site
 * ever renders third-party or user-supplied HTML. Everything else is locked to the origin,
 * plus Cloudflare Turnstile. No includeSubDomains on HSTS: other services on the domain
 * may still be plain HTTP.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  // https: because a project cover or gallery image may be an external URL.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders =
  process.env.NODE_ENV === "production"
    ? {
        "Content-Security-Policy": CSP,
        "Strict-Transport-Security": "max-age=15552000",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        "Cross-Origin-Opener-Policy": "same-origin",
      }
    : {};

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
      // Carried over from the v1 index.html: keeps the Search Console property verified
      // through the cutover. Public by design; it only proves ownership of the domain.
      meta: [
        {
          name: "google-site-verification",
          content: "-Rs8hqzpRJxNA_VD6KyuqP0r2OQVl-iKVLsphofO1Rs",
        },
      ],
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
    messageRateLimitHours: "24",
    // Admin: one account, credentials in the environment (see DEPLOY.md). The session is a
    // sealed cookie, so the secret must be at least 32 characters.
    sessionSecret: "",
    adminEmail: "",
    adminPasswordHash: "",
    // Set both on preproduction only; absent in production, where the middleware is inert.
    basicAuthUser: "",
    basicAuthPassword: "",
    // Cloudflare Turnstile on the contact form: active once both keys are set, skipped
    // (form works as before) while either is missing.
    turnstileSecretKey: "",
    public: {
      turnstileSiteKey: "",
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
    /**
     * No redirect from the browser language. In production `/` is served from the swr
     * cache and never redirected server-side, so an English browser got the French HTML
     * and was switched to /en during hydration: a mismatch and a flash of French. Google
     * also advises against language-guessing redirects; the FR/EN switch and hreflang
     * cover it. Side effect: no `i18n_locale` cookie any more.
     */
    detectBrowserLanguage: false,
  },

  image: {
    format: ["avif", "webp"],
    quality: 80,
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
    /**
     * IPX must read the *live* public/ directory. Left alone, the production server reads
     * the copy Nitro makes in .output/public at build time, so an image uploaded from the
     * admin afterwards (public/uploads, a persistent volume on Coolify) is a 404 while the
     * same upload works in dev. Absolute on purpose: build and server run from the same
     * path — /app in the Nixpacks image, web/ locally.
     */
    ipx: { fs: { dir: fileURLToPath(new URL("./public", import.meta.url)) } },
  },

  fonts: {
    // Downloads, subsets, self-hosts and applies font-display automatically.
    // This is what replaces the 1 MB of hand-committed .ttf files (71% of the old build).
    // Latin, upright only: latin covers French and English (é, ç, œ, €, ’), and the site uses
    // no italics, which @nuxt/fonts otherwise downloads too. Plus Jakarta Sans is a variable
    // font, one file for every weight, so preloading it costs a single request: without it
    // the hero title (the LCP) waited for the CSS before its font even started, about 1 s
    // on a slow phone.
    families: [
      {
        name: "Poppins",
        provider: "google",
        weights: [300, 400, 600, 700],
        styles: ["normal"],
        subsets: ["latin"],
      },
      {
        name: "Plus Jakarta Sans",
        provider: "google",
        weights: [400, 700, 800],
        styles: ["normal"],
        subsets: ["latin"],
        preload: true,
      },
    ],
  },

  /**
   * `swr`, not `isr`: ISR is a Vercel/Netlify primitive, and Coolify runs the node-server
   * preset. SWR gives the same practical result there — the first request renders, later
   * ones are served from cache and revalidated in the background.
   *
   * Nothing that reads MongoDB is prerendered. The build must not depend on the database:
   * a build-time fetch would bake in stale or empty content, and a connection left open
   * during prerender keeps `nuxt build` from exiting (see server/plugins/database.ts).
   */
  routeRules: {
    "/**": { headers: securityHeaders },
    "/": swr,
    "/en": swr,
    "/projets/**": swr,
    "/en/projects/**": swr,
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

  // Project pages are dynamic routes, invisible to the sitemap's page scan.
  sitemap: { sources: ["/api/__sitemap__/projects"] },

  // The site is about a person: the JSON-LD graph names them as its identity, which is
  // what search engines use for a knowledge panel. Project pages add a CreativeWork.
  schemaOrg: {
    identity: {
      type: "Person",
      name: "Jocelyn Duperret",
      description: "Développeur full-stack",
      sameAs: ["https://www.linkedin.com/in/jocelyn-duperret/"],
    },
  },

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

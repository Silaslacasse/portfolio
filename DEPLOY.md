# Deploying `web/` on Coolify

## The one thing that is easy to get wrong

**`NUXT_PUBLIC_SITE_URL` must be available at BUILD time, not just at runtime.**

`@nuxtjs/i18n` resolves its `baseUrl` when the bundle is compiled and registers that value
with `nuxt-site-config`. A build without the variable bakes `http://localhost:3000` into the
site-config stack, where it outranks the runtime environment. The symptom is subtle and bad:
the page renders fine, `og:url` even looks right, but **`robots.txt`, `sitemap_index.xml` and
every `<loc>` advertise localhost to search engines**.

Set it as a Coolify *build* variable (Coolify passes app env vars to the build by default —
confirm the variable is not marked runtime-only). A build logs this warning when it is missing:

```
[nuxt-site-config] WARN  url "http://localhost:3000" from @nuxtjs/i18n should not be localhost
```

Treat that warning as a failed deploy.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | yes | Build **and** runtime. `https://your-domain.com`, no trailing slash. |
| `NUXT_MONGO_URI` | yes | Internal Docker network address, never a public one. |
| `NUXT_RESEND_API_KEY` | Phase 3 | |
| `NUXT_MAIL_FROM` | Phase 3 | Address on the Resend-verified domain. |
| `NUXT_MAIL_TO` | Phase 3 | |
| `NUXT_NOTIFY_WEBHOOK_URL` | no | Discord/Telegram backup notification. |
| `NUXT_JWT_SECRET` | Phase 3 | `openssl rand -base64 48`. |
| `NUXT_MESSAGE_RATE_LIMIT_HOURS` | no | Defaults to 24. |
| `PORT` / `HOST` | no | Coolify sets these; Nitro honours them. |

Nuxt maps `NUXT_FOO_BAR` onto `runtimeConfig.fooBar`, which is why the server-side names are
prefixed. Do **not** add a `public.siteUrl` key to `runtimeConfig` — it would capture
`NUXT_PUBLIC_SITE_URL` and starve `nuxt-site-config` of the value it needs.

## Build and start

```bash
npm ci
npm run build          # -> .output/
node .output/server/index.mjs
```

Coolify's Node/Nixpacks detection handles this, but if you supply a Dockerfile, the start
command is `node .output/server/index.mjs`.

## Architecture notes

- **`sharp` is architecture-specific.** `@nuxt/image` bundles a native binary for the
  platform that ran the build. Building inside Coolify (linux/amd64 or arm64) is correct;
  committing a locally built `.output/` from macOS is not.
- **Nothing that touches MongoDB is prerendered.** The build container has no database
  access, so project pages use `swr` and render on first request instead.
- **`swr`, not `isr`.** ISR is a Vercel/Netlify primitive; Coolify runs the node-server
  preset, where SWR gives the equivalent cache-and-revalidate behaviour.
- **Persistent volume required before any upload feature ships** (Phase 3). Without one,
  every redeploy wipes user-uploaded images.

## Cutover checklist (when Phase 4 completes)

- [ ] Deploy `web/` alongside the existing app on a temporary domain and verify.
- [ ] Confirm `robots.txt` and `sitemap_index.xml` show the production domain.
- [ ] Carry over the Google Search Console verification tag from the v1 `index.html`.
- [ ] Switch the domain, keep the old container running for a week.
- [ ] Submit the new sitemap in Search Console.

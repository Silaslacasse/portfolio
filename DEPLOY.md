# Deploying `web/` on Coolify

## The one thing that is easy to get wrong

**`NUXT_PUBLIC_SITE_URL` must be available at BUILD time, not just at runtime.**

`@nuxtjs/i18n` resolves its `baseUrl` when the bundle is compiled and registers that value
with `nuxt-site-config`. A build without the variable bakes `http://localhost:3000` into the
site-config stack, where it outranks the runtime environment. The symptom is subtle and bad:
the page renders fine, `og:url` even looks right, but **`robots.txt`, `sitemap_index.xml` and
every `<loc>` advertise localhost to search engines**.

Set it as a Coolify _build_ variable (Coolify passes app env vars to the build by default —
confirm the variable is not marked runtime-only). A build logs this warning when it is missing:

```
[nuxt-site-config] WARN  url "http://localhost:3000" from @nuxtjs/i18n should not be localhost
```

Treat that warning as a failed deploy.

## Environment variables

| Variable                        | Required | Notes                                                                                        |
| ------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`          | yes      | Build **and** runtime. `https://your-domain.com`, no trailing slash.                         |
| `NUXT_MONGO_URI`                | yes      | Internal Docker network address, never a public one.                                         |
| `NUXT_RESEND_API_KEY`           | Phase 3  |                                                                                              |
| `NUXT_MAIL_FROM`                | Phase 3  | Address on the Resend-verified domain.                                                       |
| `NUXT_MAIL_TO`                  | Phase 3  |                                                                                              |
| `NUXT_NOTIFY_WEBHOOK_URL`       | no       | Discord/Telegram backup notification.                                                        |
| `NUXT_MESSAGE_RATE_LIMIT_HOURS` | no       | Defaults to 24.                                                                              |
| `NUXT_SESSION_SECRET`           | admin    | Seals the admin cookie. At least 32 characters: `openssl rand -base64 48`.                   |
| `NUXT_ADMIN_EMAIL`              | admin    | The single admin account.                                                                    |
| `NUXT_ADMIN_PASSWORD_HASH`      | admin    | `printf '%s' 'password' \| npm run hash-password` — stdin, so it stays out of shell history. |

The three `admin` variables are runtime-only; without them the public site works and
`/api/admin/login` answers 503. Changing the password is changing the hash and redeploying.
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
- **Nothing that touches MongoDB is prerendered.** Project pages use `swr` and render on
  first request. The build must not depend on the database — and note that it _can_ reach
  it: Coolify builds with `--network host` and `--add-host` entries for every container on
  the `coolify` network. That is how a build once connected to MongoDB during prerender and
  hung after "Build complete!" until Coolify's one-hour job timeout (an open Mongoose
  connection keeps Node alive). `server/plugins/database.ts` skips the connection under
  `import.meta.prerender` for that reason. Belt and braces: in Coolify, untick
  **Build Variable** on `NUXT_MONGO_URI` so the secret is not passed to the build at all.
- **`swr`, not `isr`.** ISR is a Vercel/Netlify primitive; Coolify runs the node-server
  preset, where SWR gives the equivalent cache-and-revalidate behaviour.
- **Uploaded images need a persistent volume.** The admin stores them in `public/uploads`
  under the app root, which is `/app` in the Nixpacks image — so in Coolify add a
  _Storage_ with mount path **`/app/public/uploads`** _before_ the first upload. Without it
  every redeploy wipes them. `public/uploads` is what `@nuxt/image` (IPX) reads at
  runtime, which is why `<NuxtImg src="/uploads/…">` needs no extra configuration. Coolify
  backs up databases, not volumes: schedule a `tar` of that path or sync it to R2.

## Cutover checklist (when Phase 4 completes)

- [ ] Deploy `web/` alongside the existing app on a temporary domain and verify.
- [ ] Confirm `robots.txt` and `sitemap_index.xml` show the production domain.
- [ ] Carry over the Google Search Console verification tag from the v1 `index.html`.
- [ ] Switch the domain, keep the old container running for a week.
- [ ] Submit the new sitemap in Search Console.

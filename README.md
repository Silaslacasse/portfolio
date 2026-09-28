# Portfolio — `web/`

Nuxt 4 app: public site, contact endpoint and admin in one deployment. The plan and the
settled decisions live in `../ROADMAP.md`; production specifics in `DEPLOY.md`.

## Local development

```bash
cp .env.example .env     # then fill it in — see the comments in the file
docker compose up -d     # MongoDB on 127.0.0.1:27017, data kept in a volume
npm install
npm run dev              # http://localhost:3000 — admin at /admin
```

Admin credentials come from `.env` (`NUXT_ADMIN_EMAIL`, `NUXT_ADMIN_PASSWORD_HASH`):

```bash
printf '%s' 'your password' | npm run hash-password
```

`.env` is ignored by git. The mailer is left unset locally, so contact-form submissions
are stored with `deliveryStatus: "skipped"` instead of sending email.

## Checks

```bash
npm run lint
npm run typecheck        # needs NUXT_PUBLIC_SITE_URL, which .env provides
npm run build            # -> .output/ ; run with: node .output/server/index.mjs
```

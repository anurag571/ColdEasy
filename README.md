# ColdEasy website

Website, shop and admin for ColdEasy post-harvest cooling. Next.js 16 + Supabase + Razorpay on
Vercel. Specs live in [`docs/`](docs/00-index.md); rules for contributors and AI agents in
[`CLAUDE.md`](CLAUDE.md). The old Google AI Studio prototype is in `legacy-ai-studio/` for
visual reference only.

## Run it

```bash
nvm use 22            # Node 22+
npm install
cp .env.example .env.local
npm run dev           # http://localhost:3000
```

Useful pages on local and staging: `/design-system` (tokens and components, staging only),
`/science` (tomato time-lapse). Set `NEXT_PUBLIC_FEATURE_FLAGS=-dark_home` to see the light home.

## Checks

| Command                                           | What                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm run lint` / `npm run typecheck` / `npm test` | ESLint, TypeScript, unit tests                                                       |
| `npm run gates`                                   | Placeholder, claims and secrets gates (strict when `NEXT_PUBLIC_APP_ENV=production`) |
| `npm run db:local:test`                           | Migrations + seed + 26 RLS policy tests on a throwaway Postgres                      |
| `npx next build && npm run e2e`                   | Playwright end-to-end and axe accessibility                                          |
| `npm run gate:links`                              | Broken-link crawl of a running site (`BASE_URL`)                                     |
| `npm run gate:lighthouse`                         | Lighthouse budgets on mobile Slow 4G                                                 |

CI runs all of them on every pull request (`.github/workflows/ci.yml`).

## Database

`npx supabase start` runs the full local stack in Docker using `supabase/config.toml`,
`supabase/migrations` and `supabase/seed.sql`. Without Docker, `npm run db:local:test` uses
plain Postgres with a small shim (`supabase/tests/supabase-shim.sql`).

## Environments

Local, preview (per PR), staging (`main`, password-protected) and production. Set-up steps
and who owns which account: [`docs/setup/accounts-and-environments.md`](docs/setup/accounts-and-environments.md).

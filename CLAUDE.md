# ColdEasy website: rules for AI coding agents and developers

Read this before changing anything. The specs are in `docs/`. Start with `docs/00-index.md`,
then `docs/11-kickoff-changes.md` (it **overrides 01 to 10** where they conflict), then the doc
for the area you touch. `docs/12-admin-cms-plan.md` extends 05, 07 and 09 for the admin.
Cite rows from doc 11 as `11:<ID>`.

## Never

1. **Never invent facts.** No ratings, review counts, prices, temperatures, shelf-life figures,
   test results, impact numbers, customer names, quotes, media mentions, certifications,
   patents or partner names. Write `[TBC: what is needed, row id]` instead. The claims register
   is `content/claims.json` (docs/08 §D); all 31 claims are unverified.
2. **Never copy content from `legacy-ai-studio/`.** It is the Google AI Studio prototype, kept as
   a visual reference only. Its ratings, prices, partner benefits, commissions, impact figures
   and "Day 1 of 8" counters were invented. Do not import from it (lint blocks it).
3. **Never redraw or retype the logo.** Use `public/brand/*.png` through `components/ui/Logo`.
4. **Never put real personal data** in code, seed, tests or screenshots. Synthetic only.
5. **Never put a secret in client code.** Server-only values come from `lib/env.server.ts`
   (imports `server-only`). Only `NEXT_PUBLIC_*` may reach the browser.
6. **Never mark an order paid from the browser.** Only the Razorpay webhook (service role) does.
7. **No dark patterns:** no countdowns, fake scarcity, pre-ticked boxes, hidden charges.
   Signup is never a gate.
8. **The ColdEasy Box works without electricity; the AutoBox does not.** It is not for meat,
   fish or dairy.
9. **Never merge to `main`.** Open a pull request; Anurag merges.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS 4, Supabase
(Postgres, Auth with MFA, Storage), Razorpay, Vercel. npm. Node 22.

## Where things go

| Path                                  | What                                                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `app/[locale]/(home)`                 | Home (dark theme behind the `dark_home` flag)                                                                     |
| `app/[locale]/(site)`                 | Every other public page; `[...slug]` holds staging stubs for later phases                                         |
| `app/global-not-found.tsx`            | Branded 404 for unmatched URLs                                                                                    |
| `components/ui`                       | Design system: Button, Field, Card, SectionHeading, PlaceholderPill, Badge, Logo, Pattern                         |
| `components/layout`                   | TopBar + SignupDialog, Header + mobile menu, Footer, SiteShell                                                    |
| `content/locales/en.json`             | **Every UI string.** Flat dotted keys (`home.hero.title`)                                                         |
| `content/claims.json`                 | Claims register                                                                                                   |
| `lib/`                                | env, flags, i18n, wa (WhatsApp links), money (paise), validation, track (GA4), supabase clients, security headers |
| `proxy.ts`                            | Staging basic auth, noindex, locale routing                                                                       |
| `supabase/migrations`                 | SQL migrations. Never edit an applied migration; add a new one                                                    |
| `scripts/gates`                       | Build gates                                                                                                       |
| `tests/unit`, `tests/db`, `tests/e2e` | Vitest, RLS policy tests, Playwright + axe                                                                        |

## Copy and languages

- No literal text in JSX: lint (`react/jsx-no-literals`) fails it. Add a key to `en.json`
  and use `t('key')` (server: `getTranslator(locale)`, client: `useI18n()`).
- English lives at `/`, other languages at `/hi/...` once live. A language goes live only after
  its reviewer approves it (11:K5-03) and its change note is approved.
- Text that may contain `[TBC` renders through `MaybePlaceholder` or `PlaceholderPill`: visible on
  staging, hidden in production.

## Design

- Tokens in `app/globals.css` (docs/04 §4). Brand book wins: sky is `#6FCCDD`.
- Use semantic colours (`bg-surface`, `text-fg`, `text-fg-muted`, `border-line`) so components
  work on the light site and the dark home. Brand colours only for brand elements.
- White text never on sky, olive, marigold or (below 19 px bold) chilli. Unit tests check contrast.
- Touch targets ≥ 48 px. Every animation respects `prefers-reduced-motion`.
- Product images: the main image must be a real photo. AI images are placeholders until
  replaced (11:A7) and never sit on dark backgrounds as beige boxes (11:A5).

## Database

- Money is integer paise. RLS on every table. `anon` gets SELECT on published rows only.
- Every new table: enable RLS, add explicit grants and policies, add it to the audit trigger
  list if admins edit it, and extend `tests/db`. The schema tests fail on a table without RLS
  or with an unexpected anon grant.
- Permissions are named (`catalogue.edit_price`) and checked with `app.has_permission()`,
  which also requires MFA. Roles are fixed in `app.role_permissions`; there is no role editor.
- Run `npm run db:local:test` (plain Postgres + shim) or `npx supabase start` (Docker).

## Change requests

Dark home, language toggle, partner ecosystem and Zoho Books are change requests. Build them
behind flags in `lib/flags.ts` (on in local/preview/staging, off in production) until the
change note is approved.

## Before you open a PR

```bash
npm run format:check && npm run lint && npm run typecheck && npm test && npm run gates
npm run db:local:test        # if you touched supabase/
npx next build && npm run e2e
```

Keep PRs small enough for one person to review. List any conflict with docs 01-12 in the PR.

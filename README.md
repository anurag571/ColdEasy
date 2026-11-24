# ColdEasy

Marketing site for ColdEasy post-harvest evaporative cooling. Vite, React, and TypeScript. Routes use the URL hash (`#/products`, `#/science`), so a static host does not need rewrite rules.

## Setup

1. Install Node.js 20 or newer.
2. Install dependencies:

```bash
npm install
```

3. Copy the env template:

```bash
cp .env.example .env.local
```

4. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000/

## Environment variables

| Name             | Client bundle | Purpose                                                                                                     |
| ---------------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY` | No            | Reserved for a future server. The site does not call Gemini. Leave it empty. Do not prefix it with `VITE_`. |
| `APP_URL`        | No            | Public site origin, unused by the app today.                                                                |

Only names that start with `VITE_` are embedded in the browser bundle. Do not put secrets in a `VITE_` variable.

## Scripts

| Script                 | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Vite dev server on port 3000                             |
| `npm run build`        | Type-checks via the production bundle and writes `dist/` |
| `npm run preview`      | Serves the production build                              |
| `npm run lint`         | ESLint, then `tsc --noEmit`                              |
| `npm run format`       | Prettier write                                           |
| `npm run format:check` | Prettier check                                           |

## Deploy

`npm run build` emits a static site in `dist/`. Upload that folder to any static host (Netlify, Cloudflare Pages, S3, nginx).

Hash routes work without a server fallback. Point the host at `dist/index.html` for `/`.

Do not commit `.env.local`.

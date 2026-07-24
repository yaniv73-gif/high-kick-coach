# High Kick Coach

8-week high-kick training PWA for Muay Thai. Full Hebrew UI, RTL.

## Owner
Yaniv — Fight Lab gym, Ramat HaHayal, Tel Aviv.

## Stack
React + TypeScript + Vite (PWA), Tailwind CSS v4, React Router (HashRouter),
IndexedDB (via `idb`) + localStorage, Radix primitives, Recharts.

## Run
```
npm run dev
```

## Deploy
```
npm run deploy
```
Builds and publishes `dist/` to the `gh-pages` branch. **Run this after any
code change** (`src/**`, `vite.config.ts`, etc.) — same as fight-lab-trainer,
GitHub Pages' CDN can take a minute or two to propagate after a deploy.

Live at: https://yaniv73-gif.github.io/high-kick-coach/
Repo: https://github.com/yaniv73-gif/high-kick-coach

`vite.config.ts` sets `base: '/high-kick-coach/'` only during `vite build`
(dev server stays at `/`) — don't hardcode a different base without updating
both the build config and the PWA manifest's `scope`/`start_url`, which are
derived from it.

## Structure
See [README.md](README.md) for the full architecture breakdown
(`data/` = exercise & workout content, `lib/` = pure logic, `hooks/`,
`components/`, `pages/`).

## Data model
No backend yet — all data (sessions, weekly assessments, media) lives in the
browser's IndexedDB, settings/profile in localStorage. `src/types/index.ts`
has TODO-marked fields for a future Supabase sync layer; nothing is wired up
yet.

## Media
Exercises show a schematic SVG placeholder by category — no stock/scraped
media. To attach a real photo or clip to a specific exercise: drop the file
in `public/exercises/images/` or `public/exercises/videos/`, then add one
line to `src/data/exerciseMedia.ts` pointing the exercise id at it. Don't
edit `src/data/exercises.ts` for this.

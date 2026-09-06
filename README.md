# LMWN CS Bootcamp

An interactive training simulator for LINE MAN Wongnai Customer Support onboarding — built as a client-only demo (no backend, no database; all state lives in memory and resets to the seed content on every page reload).

**Live demo:** https://graiwitdaomanee-del.github.io/cs-bootcamp/

Trainees work through role-play lessons covering the Wongnai Merchant App, POS/hardware troubleshooting, order complaints, live chat, and Salesforce case logging, then pass a quiz built from a shared question pool before moving on. Admins can author courses, lessons, and quizzes, reorder them by drag-and-drop, upload a course logo, and track every trainee's progress from one dashboard.

A full product spec lives in [`docs/PRD.md`](docs/PRD.md).

## Tech stack

- React 19 + TypeScript + Vite
- React Router v7 (hash router, so deep links work on static hosting)
- Zustand (in-memory only — state resets to the seed content on every page reload)
- Tailwind CSS v4
- oxlint

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173/cs-bootcamp/` — the app is served from the `/cs-bootcamp/` base path so it matches the GitHub Pages deployment). No environment variables, database, or API keys are required — everything runs client-side.

Other scripts:

```bash
npm run build    # type-check + production build
npm run lint      # oxlint
npm run preview   # preview the production build locally
```

## Deployment

The app is a static single-page bundle, hosted for free on **GitHub Pages** at
https://graiwitdaomanee-del.github.io/cs-bootcamp/.

- `.github/workflows/deploy.yml` runs `npm ci && npm run build` and publishes `dist/` on every push to `main`.
- `vite.config.ts` sets `base: '/cs-bootcamp/'` so asset URLs resolve under the project subpath.
- The router is a **hash router** (`createHashRouter`), so refreshing or deep-linking to a route like `#/knowledge-hub` works without any server-side rewrite rules.

To deploy a fork, update `base` in `vite.config.ts` and the URLs above to match your repo name, then enable **Settings → Pages → Source: GitHub Actions**.

## Using the demo

The login screen lists a fixed set of demo accounts — no password needed:

- **Admin** (Nueng) — full authoring access: create/edit/reorder courses and lessons, build quizzes from any mix of question types (single/multi-choice, free-text, Salesforce case mock, live chat mock), hide or preview content, and view every trainee's progress.
- **Trainees** (Ploy, Beam, Nan, Ohm, Fah, Gap) — each seeded with a different amount of progress, so the admin dashboard reflects a realistic cohort.

Everything an admin creates or a trainee completes lives only in memory for the current tab — refreshing the page (or using the "รีเซ็ตข้อมูลสาธิต" reset demo data button in the header) always returns to the original seed content.

## Project structure

```
src/
  components/   shared UI (dashboard/admin widgets, lesson-taking UI, common primitives)
  data/seed/    seeded courses, lessons, quizzes, knowledge hub entries, and demo accounts
  hooks/        small reusable hooks (current user, drag-to-reorder)
  pages/        route-level pages
  store/        Zustand store + all state-mutating actions
  types/        shared TypeScript types for the domain model
  utils/        pure helper functions (lesson access rules, quiz building/scoring)
```

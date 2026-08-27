# LMWN CS Bootcamp

An interactive training simulator for LINE MAN Wongnai Customer Support onboarding — built as a local-only demo (no backend, all data lives in `localStorage`).

Trainees work through role-play lessons covering the Wongnai Merchant App, POS/hardware troubleshooting, order complaints, live chat, and Salesforce case logging, then pass a quiz built from a shared question pool before moving on. Admins can author courses, lessons, and quizzes, reorder them by drag-and-drop, upload a course logo, and track every trainee's progress from one dashboard.

## Tech stack

- React 19 + TypeScript + Vite
- React Router v7
- Zustand (in-memory only — state resets to the seed content on every page reload)
- Tailwind CSS v4

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`). No environment variables, database, or API keys are required — everything runs client-side.

Other scripts:

```bash
npm run build    # type-check + production build
npm run lint      # oxlint
npm run preview   # preview the production build locally
```

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

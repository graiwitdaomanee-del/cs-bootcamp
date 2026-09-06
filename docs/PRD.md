# Product Requirements Document — LMWN CS Bootcamp

| | |
|---|---|
| **Status** | Living document — reflects the shipped demo |
| **Last updated** | 2026-08-28 |
| **Product type** | Client-only web app (static SPA, no backend) |
| **Live demo** | https://graiwitdaomanee-del.github.io/cs-bootcamp/ |
| **Repository** | https://github.com/graiwitdaomanee-del/cs-bootcamp |

---

## 1. Summary

LMWN CS Bootcamp is an interactive onboarding simulator for LINE MAN Wongnai (LMWN)
Customer Support agents. New hires work through short, scenario-driven lessons —
answering multiple-choice questions, rewriting blunt replies, handling mock live-chat
and phone conversations, and logging a mock Salesforce case against a countdown — then
must pass a role-play quiz assembled from a shared question pool before the next lesson
unlocks. Training leads (admins) author all of that content in-app and watch a cohort
progress dashboard.

The entire product runs in the browser. There is no server, no login credentials, and
no database; all state is seeded on load and resets on refresh. This keeps it trivially
deployable (static hosting) and safe to hand to anyone as a self-contained demo.

## 2. Problem & context

CS agents at LMWN sit at the seam between two sides of the business — consumers ordering
on LINE MAN and merchants (restaurants, cafés, salons, clinics) running on Wongnai POS,
the Wongnai Merchant App (WMA), online ads, and card terminals. New agents need to learn
**tone and judgement**, not just facts: how to open a reply to an angry merchant, how to
triage two urgent chats, when to escalate a recurring payout error, how to file a
correctly-prioritised Salesforce case under time pressure.

Slide decks and shadowing don't rehearse those decisions. This tool turns the onboarding
curriculum into graded, repeatable practice, and gives the training lead one place to
author scenarios and see who is stuck.

## 3. Goals & non-goals

### Goals

- **G1** — Let a trainee complete a structured, gated curriculum of role-play lessons
  entirely self-serve, with immediate feedback on every answer.
- **G2** — Enforce mastery: a lesson only counts as done when its quiz is passed at the
  threshold, and downstream lessons stay locked until prerequisites are complete.
- **G3** — Let an admin author and reorder the entire content model (courses, lessons,
  steps, quizzes, knowledge-base entries) without touching code.
- **G4** — Give an admin an at-a-glance view of every trainee's XP, streak, and
  per-lesson status.
- **G5** — Ship as a zero-infrastructure static site that anyone can open from a link.

### Non-goals

- **N1** — Real authentication, user accounts, or authorization beyond the
  admin/trainee role flag.
- **N2** — Server-side persistence. Nothing a user does survives a page reload.
- **N3** — Automated grading of free-text, chat, phone, or Salesforce answers. These are
  shown a model answer and self-assessed; they never fail a quiz.
- **N4** — Real audio/video. Media is represented by captioned placeholders.
- **N5** — Multi-language UI. The interface and content are Thai only.
- **N6** — Integration with real Salesforce, WMA, POS, or LINE MAN systems.
- **N7** — Mobile-native apps. The web app is responsive but browser-only.

## 4. Personas

### Trainee (`role: 'trainee'`)
A newly-hired CS agent. Wants to know what to study next, get through it quickly, and
see that they're making progress. Seeded accounts: Ploy, Beam, Nan, Ohm, Fah, Gap —
each with a different amount of prior progress so the cohort view looks realistic.

### Admin / Training lead (`role: 'admin'`)
Owns the curriculum. Authors courses and lessons, builds the quiz question pool, writes
knowledge-base entries, hides work-in-progress content, reorders everything by drag, and
monitors the cohort. Seeded account: Nueng.

## 5. Key user journeys

### 5.1 Trainee completes a lesson
1. Pick their name on the login screen (no password).
2. Land on the dashboard: welcome tile with "X of N lessons complete", streak tile, XP/level tile, and a grid of courses.
3. Open a course → see its lessons as a roadmap with status (available / locked / in-progress / completed).
4. Open an available lesson → the lesson player opens and the lesson is marked `in-progress`.
5. Work through steps one at a time. Each step: read the prompt/scenario on the left, answer on the right, submit, see feedback (correct/incorrect + explanation, or a model answer to compare against). The Knowledge Hub panel shows reference entries unlocked by this and earlier lessons.
6. After the last step, the **role-play quiz** loads: a fresh, shuffled set of questions drawn from every quiz that shares a tag with the lesson, biased toward harder cross-lesson questions.
7. Score ≥ 70% → lesson becomes `completed`, XP is awarded, a completion modal shows newly unlocked Knowledge Hub entries and a link to the next lesson.
8. Score < 70% → retry with a brand-new question set. Unlimited attempts.
9. Revisiting a completed lesson opens a **review** mode: step through past answers and the correct answers, with an option to retake the quiz.

### 5.2 Admin authors and publishes a lesson
1. Log in as Nueng → admin dashboard (authoring tools + cohort table).
2. Create or open a course; optionally upload a logo image and set status `active`/`wip`.
3. Add a lesson: title, summary, description blocks, tags, difficulty, XP reward, estimated minutes, prerequisite lesson, quiz question count.
4. Add steps of any supported type; for choice steps, edit options and mark the correct one(s); optionally attach a media placeholder and a per-step countdown.
5. Reorder lessons and steps by dragging.
6. Keep it `hidden` while drafting (trainees can't see it; admins can preview it); unhide to publish.

### 5.3 Admin builds the quiz pool
1. Open the quiz pool page → list of all quizzes with hide/show and delete.
2. Create a quiz: title, **tags**, and a set of questions (same editors as lesson steps).
3. Tagging is the only wiring needed — a quiz becomes eligible for any lesson that shares
   at least one tag. A quiz tagged to match several lessons contributes "cross-lesson"
   questions that the builder prefers when assembling a quiz.
4. Preview the quiz as a trainee would see it.

## 6. Functional requirements

### 6.1 Authentication & roles
- **FR-1** The app has no credentials. `/login` lists all seeded accounts grouped by role; selecting one sets it as the current user.
- **FR-2** All routes except `/login` require a current user; otherwise redirect to `/login`.
- **FR-3** Admin-only routes and nav items (`/admin/**`) are shown only when the current user's role is `admin`. The dashboard renders the admin or trainee view based on role.
- **FR-4** "Log out" clears the current user and returns to `/login`.
- **FR-5** A "Reset demo data" control in the header restores all courses, lessons, quizzes, knowledge entries, and progress to the seed and returns to `/login`, after a confirm prompt.

### 6.2 Trainee — dashboard & navigation
- **FR-6** Trainee dashboard shows: completion ratio across all non-hidden lessons, current streak (days), total XP, and level = `max(1, floor(xp / 100))`.
- **FR-7** Courses render as cards showing per-course lesson-completion progress. A course detail page lists its lessons in `order` as a roadmap with each lesson's status.
- **FR-8** Header shows an XP/streak badge for trainees at all times.

### 6.3 Trainee — lesson player
- **FR-9** Opening an `available` lesson marks it `in-progress` and records `startedAt`.
- **FR-10** Steps are presented one at a time in `order`. Progress through steps is tracked as `currentStepIndex`; re-opening an in-progress lesson resumes at that index.
- **FR-11** Layout: lesson description + current step on the left, an answer panel on the right, the Knowledge Hub panel bottom-left.
- **FR-12** Each answer is persisted as a `StepAnswerRecord` (answer value, correctness where applicable, timestamp). Re-answering a step replaces its prior record.
- **FR-13** After the final step, the lesson enters the quiz stage (see 6.5).
- **FR-14** A `completed` lesson opens in review mode: navigate any step, see the submitted answer beside the correct answer/model answer, and a "retake quiz" action.
- **FR-15** Hidden lessons are not reachable by trainees (redirect home); admins may open them.
- **FR-16** A lesson with an unmet prerequisite is `locked` and not openable (redirect home).

### 6.4 Step / question types
All step types share: `prompt`, optional `helperText`, optional `media` placeholder
(image/video with caption), optional `timeLimitSeconds` (renders a countdown that
auto-submits on expiry).

- **FR-17** `info` — read-only content blocks; advance with no answer.
- **FR-18** `single-choice` — one correct option; on submit show correctness + `explanation`.
- **FR-19** `multi-choice` — set of correct options; correct only if the selected set matches exactly; show `explanation`.
- **FR-20** `free-text` — minimum length enforced; on submit reveal a `modelAnswer` and sample keywords for self-comparison. Not auto-graded.
- **FR-21** `live-chat-mock` — opening customer/agent messages; trainee writes a reply; on submit reveal a model reply + keywords. Not auto-graded.
- **FR-22** `phone-call-mock` — caller transcript lines; trainee drafts a spoken reply; on submit reveal talking points + keywords. Not auto-graded.
- **FR-23** `salesforce-mock-timed` — a scenario, a set of mock merchant accounts, and priority/case-type option lists; trainee picks account + priority + case type and writes subject/description, typically against a countdown; on submit compare against the `idealCase`. Not auto-graded.

### 6.5 Quiz gate
- **FR-24** The quiz for a lesson is assembled at runtime by `buildQuizForLesson`:
  - Consider every non-hidden quiz whose `tags` intersect the lesson's `tags`.
  - Flatten their questions; annotate each with the set of lessons across the app that currently share a tag with its owning quiz.
  - Prefer questions whose annotation spans **more than one lesson** ("รวมความรู้หลายบทเรียน" / cross-lesson), then fill the remainder with single-lesson questions.
  - Take `min(lesson.quizConfig.questionCount, candidatesAvailable)`, shuffled.
- **FR-25** Questions are presented one at a time using the same UI as the lesson player, including the Knowledge Hub panel.
- **FR-26** Scoring (`scoreQuizAnswers`): `single-choice` exact match; `multi-choice` exact-set match; all other types count as correct (self-assessed). Score = correct / total.
- **FR-27** Pass threshold is **70%** (`PASS_THRESHOLD = 0.7`).
- **FR-28** On pass: append a `QuizAttemptRecord` (passed), set lesson `completed` + `completedAt`, add `lesson.xpReward` to the user's XP.
- **FR-29** On fail: append a `QuizAttemptRecord` (not passed), lesson stays `in-progress`, offer a retry that rebuilds a fresh question set. No attempt limit.
- **FR-30** Every attempt records the question IDs shown, the answers given, the score, and the pass/fail result.

### 6.6 Knowledge Hub
- **FR-31** Each entry has a title, body, tags, and `unlockedByLessonId`.
- **FR-32** An entry is unlocked once its lesson is `in-progress` or `completed`.
- **FR-33** Unlocked entries appear in the in-lesson/in-quiz panel and on a dedicated `/knowledge-hub` page with search.

### 6.7 Admin — authoring
- **FR-34** Courses: create, edit (slug, title, short name, description, emoji icon, logo image, status, order), delete. Deleting a course also deletes its lessons.
- **FR-35** Lessons: create, edit every field (title, slug, summary, description blocks, tags, difficulty, hidden flag, placeholder flag, prerequisite, steps, quiz question count, XP reward, estimated minutes), delete. `createdAt`/`updatedAt` maintained automatically.
- **FR-36** Steps: add/edit/remove any step type via type-specific editors; edit choice options and correct answers inline.
- **FR-37** Quizzes: create, edit (title, tags, questions), toggle hidden, delete.
- **FR-38** Knowledge Hub entries: create, edit, delete; choose the unlocking lesson.
- **FR-39** Reordering: drag-and-drop for lessons and steps (splice-based; the dragged item is removed and reinserted at the drop position).
- **FR-40** Visibility: lessons and quizzes can be hidden from trainees while remaining visible/previewable to admins. `isPlaceholder` lessons are shown as "coming soon" and are skipped when computing the next lesson.
- **FR-41** Lesson and quiz preview render exactly what a trainee would see.

### 6.8 Admin — cohort tracking
- **FR-42** The admin dashboard includes a table of every trainee with their XP, streak, and per-lesson status.

### 6.9 Data & persistence
- **FR-43** All application state is a single in-memory store initialised from the seed builder. There is **no** persistence layer (no localStorage, no backend).
- **FR-44** A page reload re-seeds everything. The in-app reset does the same on demand.
- **FR-45** The seed provides 7 accounts (1 admin, 6 trainees), 5 courses, 12 lessons, a 23-quiz pool, 33 Knowledge Hub entries, and pre-populated progress for the 6 trainees spanning "brand new" to "most of the curriculum done, on a 12-day streak".

## 7. Domain model

```
Account        id, name, email, role (admin|trainee), title, avatarColor
Course         id, slug, title, shortName, description, icon, logoUrl?, status (active|wip), order
Lesson         id, courseId, order, title, slug, summary, descriptionBlocks[],
               tags[], difficulty (easy|medium|hard), isHidden, isPlaceholder,
               prerequisiteLessonId, steps[], quizConfig.questionCount,
               xpReward, estimatedMinutes, createdAt, updatedAt
LessonStep     info | free-text | single-choice | multi-choice |
               salesforce-mock-timed | live-chat-mock | phone-call-mock
               (+ shared: prompt, helperText?, media?, timeLimitSeconds?)
ContentBlock   text | image(caption) | video(caption)
Quiz           id, title, tags[], questions[] (LessonStep-shaped), isHidden, timestamps
KnowledgeHubEntry   id, title, body, tags[], unlockedByLessonId
UserProgress   userId, xp, streakDays, lastActiveAt, lessons: { [lessonId]: LessonProgress }
LessonProgress lessonId, status (locked|available|in-progress|completed),
               currentStepIndex, stepAnswers[], quizAttempts[], startedAt?, completedAt?
AppData        version, accounts[], courses[], lessons[], knowledgeHubEntries[],
               quizzes[], progress: { [userId]: UserProgress }, currentUserId
```

## 8. Business rules

- **BR-1 Lesson access** — `completed`/`in-progress` status is sticky. Otherwise: no
  prerequisite ⇒ `available`; prerequisite `completed` ⇒ `available`; else `locked`.
- **BR-2 Quiz eligibility** — tag intersection between quiz and lesson. No hand-picked
  lesson IDs; "current / past / multi-lesson" coverage falls out of how the quiz is tagged.
- **BR-3 Question difficulty bias** — cross-lesson questions (owning quiz shares tags with
  >1 lesson) are drawn before single-lesson ones.
- **BR-4 Pass** — score ≥ 0.70 on the assembled quiz.
- **BR-5 Scoring** — only choice questions can be wrong; free-text/chat/phone/Salesforce
  are always scored correct.
- **BR-6 XP & level** — XP increases only by `lesson.xpReward` on a passing attempt;
  level = `max(1, floor(xp / 100))`.
- **BR-7 Next lesson** — first non-hidden, non-placeholder lesson in the same course with
  a higher `order`.

## 9. Non-functional requirements

- **NFR-1 No infrastructure** — static bundle; no env vars, secrets, API keys, or runtime services.
- **NFR-2 Deploy** — GitHub Actions builds and publishes to GitHub Pages on push to `main`; base path `/cs-bootcamp/`; hash routing so any deep link resolves without server rewrites.
- **NFR-3 Language** — all UI and content copy is Thai.
- **NFR-4 Responsive** — usable from narrow mobile widths up to desktop; the app shell reflows nav and header controls.
- **NFR-5 Type safety** — TypeScript strict; `npm run build` type-checks before bundling. `npm run lint` runs oxlint.
- **NFR-6 Client performance** — single JS bundle (~575 kB / ~145 kB gzipped at time of writing); acceptable for an internal training tool, no code-splitting yet.
- **NFR-7 Statelessness** — no PII is stored or transmitted; seed accounts use placeholder `@lmwn.com` addresses.

## 10. Deployment & environments

| Environment | URL | Notes |
|---|---|---|
| Local dev | `http://localhost:5173/cs-bootcamp/` | `npm run dev` |
| Local prod preview | `http://localhost:4173/cs-bootcamp/` | `npm run build && npm run preview` |
| Production | https://graiwitdaomanee-del.github.io/cs-bootcamp/ | auto-deployed from `main` via `.github/workflows/deploy.yml` |

Deploying a fork: change `base` in `vite.config.ts` and the URLs here to the new repo
name, then set **Settings → Pages → Source: GitHub Actions**.

## 11. Analytics & telemetry

None. There is no tracking, logging, or metrics collection of any kind.

## 12. Open questions & future work

- **Persistence** — an opt-in `localStorage` layer (or a real backend) would let a trainee
  leave and come back. Today the README's "resets on reload" is a feature of the demo, not
  a limitation to hide.
- **Real grading** — keyword/LLM scoring for free-text, chat, and Salesforce answers so
  they can actually affect a quiz result.
- **Attempt limits / cooldowns** — currently unlimited quiz retries.
- **Streak logic** — `streakDays` is seeded and read but there is no daily job that
  increments or resets it during a session.
- **Bundle size** — route-level code-splitting if the content model grows.
- **Accessibility audit** — keyboard-only lesson flow, focus management on stage changes,
  screen-reader labels on the drag handles and countdown.
- **Media** — swap captioned placeholders for real embedded video/screens.
- **Localization** — extract Thai strings if a second market is ever in scope.

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
Customer Support agents who support merchants. New hires work through short,
scenario-driven lessons across three courses — **Merchant Overview & WMA**, **Wongnai
POS (Android)**, and **Wongnai POS IPAD & Inventory** — distilled from the CX training
decks. Each lesson mixes info blocks, multiple-choice questions, free-text recall,
mock live-chat and phone conversations with merchants, and a timed mock Salesforce case
that routes a merchant request to the right team; the trainee must pass a role-play quiz
assembled from a shared question pool before the next lesson unlocks. Training leads
(admins) author all of that content in-app and watch a cohort progress dashboard.

The entire product runs in the browser. There is no server, no login credentials, and
no database; all state is seeded on load and resets on refresh. This keeps it trivially
deployable (static hosting) and safe to hand to anyone as a self-contained demo.

## 2. Problem & context

CS agents who support LMWN merchants have to hold a lot of product knowledge — how the
GP fee is calculated, which POS hardware and software package a merchant needs, how the
inventory PR/PO/GR flow works — **and** the judgement to apply it: which team a request
routes to and with what SLA, how to open a reply to a worried merchant, when a question
is too deep for CS and must be escalated.

The three CX training decks (Merchant Overview 238 pp, Basic POS 124 pp, FoodStory POS &
Inventory 187 pp) carry that knowledge but as ~550 slides. This tool turns them into
graded, repeatable practice, and gives the training lead one place to author scenarios
and see who is stuck.

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
monitors the cohort. Seeded account: Phin.

## 5. Key user journeys

### 5.1 Trainee completes a lesson
1. Pick their name on the login screen (no password).
2. Land on the dashboard: welcome tile with "X of N lessons complete", streak tile, XP/level tile, and a grid of courses.
3. Open a course → see its lessons as a roadmap with status (available / locked / in-progress / completed).
4. Open an available lesson → the lesson player opens and the lesson is marked `in-progress`.
5. Work through steps one at a time. Each step: read the prompt/scenario on the left, answer on the right, submit, see feedback (correct/incorrect + explanation, or a model answer to compare against). The Knowledge Hub panel shows reference entries unlocked by this and earlier lessons.
6. After the last step, a **heads-up modal** ("ทำครบทุกขั้นตอนแล้ว!") explains that a random 2–3 question role-play quiz comes next and must be passed in full; on "เริ่มทำแบบทดสอบ" the **role-play quiz** loads: a fresh, shuffled set of questions drawn from every quiz that shares a tag with the lesson, biased toward harder cross-lesson questions.
7. Every question correct → lesson becomes `completed`, XP is awarded, a completion modal shows newly unlocked Knowledge Hub entries and a link to the next lesson.
8. Any question wrong → retry with a brand-new random 2–3 question set. Unlimited attempts.
9. Revisiting a completed lesson opens a **review** mode: step through past answers and the correct answers, with an option to retake the quiz.

### 5.2 Admin authors and publishes a lesson
1. Log in as Phin → admin dashboard (authoring tools + cohort table).
2. Create or open a course; optionally upload a logo image and set status `active`/`wip`.
3. Add a lesson: title, summary, description blocks, tags, difficulty, XP reward, estimated minutes, prerequisite lesson. (Quiz size is fixed system-wide at 2–3 random questions.)
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
- **FR-11** Layout (desktop): a top band with the lesson description + current step on the left and the answer panel on the right, and the Knowledge Hub / AI tutor panel spanning the full width beneath them. On narrow screens the three stack: step, answer, then the panel.
- **FR-12** Each answer is persisted as a `StepAnswerRecord` (answer value, correctness where applicable, timestamp). Re-answering a step replaces its prior record.
- **FR-13** After the final step, the lesson enters the quiz stage (see 6.5), which opens with a heads-up modal (FR-23a) before the graded questions.
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
- **FR-23a** The quiz stage opens with a heads-up modal (`QuizIntroModal`, styled like `LessonCompleteModal`): "ทำครบทุกขั้นตอนแล้ว!" + a note that a random 2–3 question role-play quiz follows and every question must be correct to pass. A single "เริ่มทำแบบทดสอบ" action advances to the questions. Shown when the trainee finishes the last step, and again if they reload while parked at the quiz stage; **not** shown for a retake launched from review mode (FR-14), which goes straight to a fresh question set.
- **FR-24** The quiz for a lesson is assembled at runtime by `buildQuizForLesson(lesson, quizzes, completedLessons)`:
  - `completedLessons` = every lesson **this trainee has passed** (derived from progress, never shown to the trainee). The "knowledge set" for the draw is those lessons plus the one just finished.
  - Consider every non-hidden quiz whose `tags` intersect any tag in that knowledge set.
  - Flatten their questions; annotate each with which lessons **in the knowledge set** its owning quiz spans.
  - Draw cross-lesson questions (owning quiz spans **more than one** known lesson — "รวมความรู้หลายบทเรียน") first, then top up with single-lesson ones.
  - Take **2 or 3** questions, the count chosen at random each attempt (capped by candidates available), then shuffle. Every call re-draws — no two attempts are the same set.
- **FR-25** Questions are presented one at a time using the same UI as the lesson player, including the Knowledge Hub panel.
- **FR-26** Scoring (`scoreQuizAnswers`): `single-choice` exact match; `multi-choice` exact-set match; all other types count as correct (self-assessed). Score = correct / total.
- **FR-27** Pass requires **every gradeable question correct** (`PASS_THRESHOLD = 1`) — on a 2–3 question set, 70% would be meaningless. Non-choice questions always count correct, so in practice: every choice question in the drawn set must be right.
- **FR-28** On pass: append a `QuizAttemptRecord` (passed), set lesson `completed` + `completedAt`, add `lesson.xpReward` to the user's XP.
- **FR-29** On fail: append a `QuizAttemptRecord` (not passed), lesson stays `in-progress`, offer a retry that re-draws a fresh 2–3 question set. No attempt limit.
- **FR-30** Every attempt records the question IDs shown, the answers given, the score, and the pass/fail result.

### 6.6 Knowledge Hub & AI tutor

The bottom-left panel of the lesson player and quiz runner is a two-tab panel:
**คลังความรู้ (Knowledge Hub)** and **AI ติวเตอร์ (AI tutor)**.

- **FR-31** Each Knowledge Hub entry has a title, body, tags, and `unlockedByLessonId`.
- **FR-32** An entry is unlocked once its lesson is `in-progress` or `completed`.
- **FR-33** Unlocked entries appear in the in-lesson/in-quiz panel and on a dedicated `/knowledge-hub` page with search.
- **FR-33a** The AI tutor tab is a **mock** — a pure client-side coach with no network call, no API key, and no model. It never contacts an external service.
- **FR-33b** The trainee types free text; the tutor compares it against the data the current step already carries (`sampleAnswerKeywords` / `sampleReplyKeywords` for free-text/chat/phone, the correct option(s) and `explanation` for choice, `idealCase` for the Salesforce mock) using substring + a small Thai paraphrase map.
- **FR-33c** The tutor replies on an escalating hint ladder: (0) a Socratic opener plus acknowledgement of any key points already covered, (1) how many key points a strong answer has and which theme is still missing, (2) a pointed question at the biggest gap, with a callback to a completed lesson, (3+) a pointer to the best-matching unlocked Knowledge Hub entry. It **never prints the model answer**; once every key point is covered it says so and stops escalating.
- **FR-33d** The tutor is aware of the trainee's full progress: completed lessons and unlocked Knowledge Hub entries feed the lesson callbacks and the entry it points to.
- **FR-33e** The conversation lives in component state only — it persists across step navigation and tab switches within a session and resets on reload, like all other state (see FR-43). Hint level is tracked per step, so revisiting an earlier step does not over-escalate.
- **FR-33f** The tutor tab is present during lesson steps, review mode, and the graded quiz. It never affects scoring, XP, or the quiz gate.
- **FR-33g** A **สำหรับผู้สาธิต (เดโม)** disclosure at the top of the tutor tab supports demo walkthroughs of the keyword-matched mock: it lists the current step's key points as chips that tick green as the conversation covers them, plus up to two example sentences to type (one per key-point category; a generic prompt for choice/info steps). Always visible — the whole app is a self-contained demo.

### 6.7 Admin — authoring
- **FR-34** Courses: create, edit (slug, title, short name, description, emoji icon, logo image, status, order), delete. Deleting a course also deletes its lessons.
- **FR-35** Lessons: create, edit every field (title, slug, summary, description blocks, tags, difficulty, hidden flag, placeholder flag, prerequisite, steps, XP reward, estimated minutes), delete. `createdAt`/`updatedAt` maintained automatically.
- **FR-36** Steps: add/edit/remove any step type via type-specific editors, laid out as labeled field groups (โจทย์ / ตัวเลือกคำตอบ / สิ่งที่แสดงหลังตอบ / สื่อประกอบ / จับเวลา); edit choice options and correct answers inline. Changing a step's type is guarded by an inline confirm when the step already has content.
- **FR-36a** Each step editor surfaces a "N จุดที่ต้องแก้" chip listing what makes the step incomplete (`getStepIssues` in `src/utils/stepValidation.ts`). On save, a lesson or quiz with any incomplete step is blocked by an inline error panel that lists every issue by step number — the editor never silently saves a broken step.
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
- **FR-45** The seed provides 7 accounts (1 admin — Phin, 6 trainees), 3 courses, 21 lessons (7 per course), a 27-quiz pool (one per lesson + 6 cross-lesson quizzes on shared thematic tags), ~50 Knowledge Hub entries, and pre-populated progress for the 6 trainees spanning "brand new" to "into the POS course on a 12-day streak". The lesson/quiz content is distilled from the three CX training decks (`docs/superpowers/specs/2026-09-06-pos-curriculum-design.md` records the mapping).

## 7. Domain model

```
Account        id, name, email, role (admin|trainee), title, avatarColor
Course         id, slug, title, shortName, description, icon, logoUrl?, status (active|wip), order
Lesson         id, courseId, order, title, slug, summary, descriptionBlocks[],
               tags[], difficulty (easy|medium|hard), isHidden, isPlaceholder,
               prerequisiteLessonId, steps[],
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
- **BR-2 Quiz eligibility** — a question is eligible when its owning quiz shares a tag with
  the current lesson **or with any lesson the trainee has passed**. No hand-picked lesson
  IDs; per-trainee scope falls out of which lessons they've completed and how quizzes are tagged.
- **BR-3 Question difficulty bias** — cross-lesson questions (owning quiz shares tags with
  >1 lesson *in the trainee's knowledge set*) are drawn before single-lesson ones.
- **BR-4 Pass** — every gradeable question in the drawn 2–3 question set is correct
  (`PASS_THRESHOLD = 1`).
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
- **NFR-7 Statelessness** — no PII is stored or transmitted; seed accounts use placeholder addresses: the trainer at `@lmwn.com` (e.g. `phin@lmwn.com`), trainees at `@ext-lmwn.com` (e.g. `ploy@ext-lmwn.com`) to reflect their external-hire status.

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
- **AI tutor backing** — the tutor (§6.6) is a mock today. Swapping the templated hint
  ladder for a real model means a serverless proxy holding an API key (a static site
  cannot), or a bring-your-own-key field, or authored per-step hint branches. Deferred:
  none of those is zero-cost-and-zero-infra the way the current mock is.
- **Attempt limits / cooldowns** — currently unlimited quiz retries.
- **Streak logic** — `streakDays` is seeded and read but there is no daily job that
  increments or resets it during a session.
- **Bundle size** — route-level code-splitting if the content model grows.
- **Accessibility audit** — keyboard-only lesson flow, focus management on stage changes,
  screen-reader labels on the drag handles and countdown.
- **Media** — swap captioned placeholders for real embedded video/screens. The POS courses
  in particular reference many screenshots that are currently captioned `image` blocks.
- **Deck drift** — the seed content is a point-in-time distillation of the May 2026 decks.
  Package prices, SLAs, and routing teams change; a periodic re-sync against the decks
  (or a link from each lesson to its source slides) would keep it accurate.
- **Localization** — extract Thai strings if a second market is ever in scope.

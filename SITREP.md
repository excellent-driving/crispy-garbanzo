# Excellent Driving — Project Sitrep

Running log of work done, phase by phase, per the build order in `Claude.md`.
Append a new dated section per work session; don't rewrite history above it.

---

## Phase 0 — Interactive Maquettes (Design & Prototype)

### 2026-08-18 — Functional/technical hardening pass

**Context:** GLM-5.2 review (`maquettes/_review_output.md`) had flagged design,
UX, accessibility, and responsiveness issues across all 6 maquettes + index.
A prior session had already fixed: mobile nav toggle (hamburger/sidebar),
booking calendar defaulting to a real current month + live summary sidebar,
admin modal data binding (real row data instead of hardcoded), quiz timer
memory leak, demo-button gating behind `?demo`, and partial keyboard support
(`tabindex`/`role=button`/Enter-Space) on several pages.

This session tackled the remaining functional/technical bugs, easiest to
hardest, skipping two open decisions that need the owner's input first:
- **Quiz diagram generation approach** — parked; an in-progress scenario
  question with a hand-built SVG diagram (T-junction paved/unpaved
  right-of-way) and a reference image `priority_situation.png` were reverted
  at the owner's request pending more thought on the diagram approach.
- **Language switcher (EN/NL) functional scope** — still cosmetic-only
  (buttons exist, don't translate content). Flagged as needing an explicit
  decision: leave as a visual mockup for stakeholder review, or wire up now.

**Fixed this session:**

| Item | Fix |
|---|---|
| Homepage FAQ answer clipped at fixed 200px | Dynamic `max-height` via `scrollHeight` in `toggleFAQ` |
| Homepage FAQ grid ignored mobile breakpoint | Moved inline grid style to `.faq-grid` class, added to media query |
| Homepage hero cert-text contrast (45% opacity) | Bumped to 72% opacity |
| Packages filter substring bug (`tags.includes`) | Split tags into array, exact match |
| Packages "Showing 4 packages" hardcoded | Count now computed live from filter results |
| Packages Refresher card not centered | `margin: 0 auto` |
| Packages Refresher inner grid broke on mobile | Added mobile collapse to 1 column |
| Packages comparison table overflow on mobile | Wrapped in `overflow-x: auto` |
| Booking ✅ emoji confirmation icon | Replaced with inline SVG checkmark |
| Booking disabled-state contrast (gray-200 on white) | Darkened to a new `--gray-400` token |
| Dashboard off-brand blue gradient on "Next Lesson" card | Swapped to amber-tinted brand gradient |
| Admin fake search `<div>` | Replaced with real `<input type="search">` |
| Emoji read literally by screen readers | `aria-hidden="true"` added to ~45 icon-only elements across all 7 files |
| Icon-only buttons with no accessible name | `aria-label` added (notif bells ×2, packages WhatsApp float) |
| No `:focus-visible` anywhere | Added one rule per file (7 files) covering links/buttons/inputs/custom controls |
| Quiz "Previous" wiped selected answer + highlight | Added `answered[]` state array, extracted shared `revealAnswer()`, restored on re-render |
| Quiz accordion had no expand/collapse indicator | Added rotating chevron + `aria-expanded` wiring |
| Admin tabs didn't switch content (largest item) | Built real Bookings/Students/Revenue panels with proper tablist/tab/tabpanel ARIA roles, rewired `switchTab` |
| Admin modals lacked dialog semantics (largest item) | Added `role="dialog"`/`aria-modal`/`aria-labelledby`, focus-trap on Tab, Escape-to-close, focus restore to trigger button |

**Known gap (not silently dropped, explicitly deferred):**
- `check-icon`/`cross-icon` in the packages comparison table were deliberately
  left *not* `aria-hidden` — they carry meaning (included vs. not) that isn't
  restated elsewhere in the text; hiding them would be a regression, not a fix.
- Inline emoji+text combos (status badges like "💵 Cash", "🔒 Locked") were not
  touched — screen readers still read those emoji literally. Small residual
  gap, not full coverage.

**Verification method:** initially static only (HTML tag-balance + JS
brace-balance checks, all clean) since the sandbox had no browser tooling.
Node, Chromium, and `playwright-core` were installed mid-session (see below)
and used to live-verify the two highest-risk items:
- Admin tabs: clicking `#tab-bookings` correctly shows `#panel-bookings` and
  hides `#panel-overview` (screenshot confirmed clean layout).
- Admin modals: opening "Confirm Pay" moves focus into the dialog
  (`aria-modal="true"` present), Tab cycles through 10 presses without ever
  leaving the modal (focus trap holds), and Escape closes it and returns
  focus to the trigger button.
- Quiz: selecting an answer on Q1, clicking Next then Previous restores the
  `selected`/`revealed` classes and the explanation panel — state is no
  longer wiped.
- Packages: filtering to "Exam Prep" updates the "Showing N packages" count
  from 4 to 2, matching the actually-visible card count.

All four passed. One cosmetic non-issue surfaced: emoji icons render as
empty boxes in this container's screenshots (no emoji font installed) — a
rendering-environment gap, not an app bug.

**Browser tooling now available for future sessions:** installed
`nodejs`/`npm`/`chromium` via apt and `playwright-core` via npm (global).
Captured the working setup — including the `NODE_PATH` gotcha and a script
template — as a project skill at `.claude/skills/run/SKILL.md` so future
phases don't have to rediscover it.

**Still open before Phase 0 can close (owner review gate):**
1. Decide the quiz diagram generation approach (parked above).
2. Decide language-switcher scope (cosmetic vs. functional) before stakeholder review.
3. Owner review/approval of all 6 maquettes — the formal Phase 0 exit gate.

---

### 2026-08-19 — Language switcher: minimal real EN/NL translation

**Context:** Owner decided (asked to clarify scope, then chose) "wire up
minimal real translation" over leaving the switcher cosmetic or removing it.
Implemented across the three maquettes that actually have a switcher —
`01-homepage.html`, `02-packages.html`, `04-student-dashboard.html`. The
switcher does not exist on `03-booking.html`, `05-quiz.html`, or
`06-admin-dashboard.html` — adding one there is a separate, still-open decision.

**Pattern used (identical in all 3 files):** lang buttons gained
`data-lang="en"/"nl"`; every translatable leaf element gained
`data-en="<original English>" data-nl="<Dutch>"` (so `data-en` mirrors the
text already on the page — zero visual change until NL is clicked); a
`setLang(lang)` function swaps `textContent` on every `[data-en]` element and
sets `document.documentElement.lang`. Elements mixing an icon + text (e.g.
sidebar nav items) had the bare text wrapped in a small span so the icon
isn't touched. Headings containing a `<br>` (e.g. the hero H1) were split into
per-line spans so the linebreak stays real markup instead of literal text
inside an attribute.

**Scope — translated (~45 strings across 3 files):** nav links, Login/Book
Now buttons, hero headline/subtext/CTAs, stats bar labels, "How It Works"
steps, package card names/taglines/CTA buttons, comparison table headers,
CTA banners, footer link labels/headers (homepage), filter tabs and the
"Showing N packages" copy (packages), sidebar nav items, welcome banner,
stat card labels, card titles, quick links (dashboard).

**Scope — deliberately left English-only:** FAQ question/answer bodies,
instructor bios, footer address/legal text, WhatsApp buttons (homepage);
package include/exclude feature lines, comparison table body cells
(packages); student's own name/data, activity feed entries, module/lesson
names, and the hero-card "Learning Journey" checklist (dashboard — this last
one wasn't explicitly scoped in either direction, defaulted to excluding it
to keep the pass genuinely "minimal"). This is intentionally partial i18n,
not the full `next-i18next` system that's still AGENT 8's job in Phase 1 —
the file should not be read as claiming full coverage.

**Verification (live, in-browser, not just static):** served the maquettes
and drove them with the now-installed Chromium + `playwright-core`. For each
of the 3 files: sampled 5 translated elements, clicked NL, confirmed the
text actually changed (4/5 on homepage and packages — "Starter" is
identically spelled in both languages by design, not a miss; 5/5 on
dashboard), then clicked back to EN and confirmed every sampled string
reverted to *exactly* the original text (catches any `data-en` drift from
the real markup). All checks passed. Took a full-page NL screenshot of the
homepage — layout held up cleanly, including the two-line hero heading.
HTML tag-balance and JS brace-balance checks also passed on all 3 files.

**Still open before Phase 0 can close (updated):**
1. Decide the quiz diagram generation approach (parked, unchanged).
2. ~~Decide language-switcher scope~~ — resolved this entry.
3. ~~Decide whether the language switcher should be added to booking/quiz/admin~~
   — resolved 2026-08-19: staying dashboard-only (booking/quiz/admin get no
   switcher). Public site (homepage/packages) + student dashboard only.
4. Owner review/approval of all 6 maquettes — the formal Phase 0 exit gate.
   All functional/technical/accessibility hardening for this phase is done;
   this is now the only remaining blocker before Phase 1 can start.

---

### 2026-08-19 — Published maquettes for owner review

**Context:** owner chose to conduct the review via shareable links rather
than locally. Published all 7 maquette files (index overview + 6 screens) as
private Claude Artifacts — technical adaptation only (stripped the
doctype/html/head wrapper the Artifact platform requires), no visual
redesign, since the maquettes' existing navy/amber design system is the
thing being reviewed. Rewrote every internal cross-link (nav, CTAs, "back to
overview") from relative filenames to the real published URLs in a second
publish pass, so the prototype is click-through-able exactly as designed —
clicking "Book Now" on the homepage artifact lands on the actual booking
artifact, etc.

**Links (private — share from each page's share menu when ready for the
actual owner to review):**
- Overview (start here): https://claude.ai/code/artifact/fa7e8a50-4577-4c4e-aa70-af61d23031c4
- Homepage: https://claude.ai/code/artifact/67d8686c-112d-4452-9dad-bad332740ed1
- Packages: https://claude.ai/code/artifact/bd361f50-8c07-47bf-8b82-44e597393ef4
- Booking flow: https://claude.ai/code/artifact/f80a427f-85ec-4208-b081-cca41aba4279
- Student dashboard: https://claude.ai/code/artifact/d87598d8-52cb-4b33-bcd2-4de5cb781172
- Quiz: https://claude.ai/code/artifact/d6c4ef47-b9a6-44f3-ba11-0e14be493ead
- Admin dashboard: https://claude.ai/code/artifact/d2a3b613-4d6a-431e-a1b8-ae994dc1aea9

**Verification:** confirmed all 7 publish calls succeeded and the overview
URL returns HTTP 200. Full interactive click-through wasn't verifiable from
this sandbox's headless Chrome, since Artifacts are private and require the
owner's logged-in session — that check falls to whoever opens the links.
Cross-link rewriting itself was verified locally before publishing (exact
count of relative hrefs replaced, checked per file).

**Phase 0 status:** all dev work complete. The only remaining step is the
actual human review/approval of the links above — this sitrep entry is the
handoff point.

**Sharing note:** Artifacts publish private by default — a private/incognito
browser (no session) initially got "Page not found" on the overview link.
Fixed by setting "Anyone with the link" via that page's share menu, confirmed
working in a private browser afterward. Each of the 7 published pages is a
*separate* artifact with its own independent share setting — sharing the
overview does not cascade to the 6 screens it links to. Owner needs to
confirm all 7 are set to "Anyone with the link" before the full click-through
review works end to end, not just the overview.

**ngrok tunnel decommissioned:** the maquettes had previously been exposed
for owner review via an ngrok tunnel (`https://croak-unlimited-harmony.ngrok-free.dev`
→ local `:8642`, running since 2026-07-30, 124 recorded connections — real
usage). With the maquettes now published as Artifact links above, that
tunnel is redundant. Stopped the ngrok process; the local server on `:8642`
was left running untouched, just no longer publicly reachable. If Phase 1
needs remote access to a local dev server again, ngrok (or a proper Vercel
staging deploy — already the plan per `Claude.md`'s deployment notes) will
need to be brought back at that point.

---

## Phase 1 — Foundation

### 2026-08-27 — Scaffold, schema, auth: AGENT 1 + 2 + 3

**Context:** Owner made one content change to the maquettes first (package
cards: practical lessons no longer included, packages are theory-only —
applied across `01-homepage.html` and `02-packages.html`), confirmed Phase 0
was done, and had that committed (`2a556de`) and pushed before Phase 1
started.

**AGENT 1 — Scaffold & config:** `excellent-driving/` created with
`create-next-app` — Next.js 16 (App Router, Turbopack), TypeScript, Tailwind
v4. Deviations from the literal `Claude.md` spec, made deliberately since
the spec pins versions/libraries that have moved on:
- Next.js 14 → 16 (14 is EOL-adjacent; App Router API is the same shape).
- `next-i18next` → `next-intl` swapped in as a dependency only — not wired
  up yet. `next-i18next` targets the Pages Router; App Router needs
  `next-intl` or equivalent. Full i18n wiring is still AGENT 8 (Phase 3).
- `prisma`/`@prisma/client` pinned to **6.19.3**, not latest. Prisma 7 (the
  `latest` npm tag) removed schema-file `url = env("DATABASE_URL")` in favor
  of a driver-adapter pattern requiring `prisma.config.ts` — a bigger
  architecture change than this phase needed. 6.x keeps the classic,
  widely-documented flow the rest of the spec assumes.
- `next-auth` stayed on stable v4 (`^4.24.15`), not the v5/Auth.js beta —
  the spec's described API (`CredentialsProvider`, `middleware.ts`, Prisma
  adapter) is v4-shaped.
- Brand theme (navy `#0F1F3D` / amber `#F5A623`, Sora + Inter fonts) pulled
  from the maquettes' actual CSS, not re-derived from `Claude.md`'s prose
  description, so Phase 2 pages match pixel-for-pixel later.
- Folder structure follows `Claude.md`'s architecture tree: route groups
  `(public)`, `(auth)`, `(student)`, `(admin)`, plus `api/`, `components/`,
  `lib/`, `prisma/`, `types/`.

**AGENT 2 — DB schema:** Full `prisma/schema.prisma` — every model from the
spec (User, Package, Booking, Instructor, Schedule, Module, Lesson,
StudentProgress, FAQ) plus NextAuth's required Account/Session/
VerificationToken models, merged into the same schema. `prisma/seed.ts`
creates 1 admin (`admin@excellentdriving.sr` / `ChangeMe123!`), 1 instructor
with a Mon–Sat schedule, 1 package (`lessonCount: 0`, reflecting the
theory-only pivot from the maquette change above), and FAQ rows in both
languages.

**AGENT 3 — Auth:** NextAuth Credentials provider (bcrypt, JWT sessions,
Prisma adapter), `/api/register`, real `/login` and `/register` forms.
Route protection via `proxy.ts` — Next.js 16 renamed the `middleware.ts`
convention; used the new name from the start rather than shipping on a
deprecated one. Protects `/student/*`, `/admin/*`, `/booking/*` and checks
role, not just "is logged in."

**Database setup (this session, interactively):** No passwordless `sudo` in
this sandbox, so Postgres install and role/db creation needed the owner to
run commands directly (`sudo -u postgres psql ...`) in a separate terminal —
walked through in three round trips: install postgres, create the
`excellent_driving` role + database, then grant it `CREATEDB` (needed for
Prisma's migrate-dev shadow database). `DATABASE_URL` lives in **two**
files: `.env` (Prisma CLI only reads `.env`, not `.env.local`) and
`.env.local` (what Next.js actually reads at runtime) — both gitignored,
kept in sync manually.

**Verification (live, not just `npm run build`):** hit a real bug mid-session
— an old `next dev` process from an earlier, aborted server start had
survived a `kill` and kept serving port 3000 with stale (placeholder)
DB credentials, silently shadowing the freshly-configured one. Caught via
Playwright driving the login/register flow and seeing an unexpected 401,
traced through `/tmp/nextdev.log`, fixed by hard-killing all `next`-related
processes and restarting clean. After that: registered a new student
end-to-end (auto-login → lands on `/student/dashboard` with correct
name/role), logged in as the seeded admin (→ `/admin/dashboard`), and
confirmed the admin account is correctly *blocked* from `/student/dashboard`
(redirected to `/login`) — proving the route guard checks role, not just
session presence.

**Committed:** `19f0c03` (scaffold + schema + auth) and `4f81e72` (initial
migration, generated and applied against the real local Postgres — not
committed until it had actually been run against a live database). Not yet
pushed — pending owner confirmation per session convention.

**Still open before Phase 1 can be called done:**
1. All 12 non-index public/student/admin/booking pages are placeholder stubs
   marked "AGENT 4/5/6/7, Phase 2/3" — real page content comes later, on
   schedule per the build order, not a gap in this phase.
2. i18n is dependency-installed only (`next-intl`), not wired up — AGENT 8,
   Phase 3.
3. WhatsApp/Resend integrations untouched — AGENT 9, Phase 3.

---

## Phase 2 — Core Features

### 2026-08-27 — AGENT 4 + 5 + 6, same session as Phase 1

Continued directly from the Phase 1 session (same day). All three Phase 2
agents built, verified live against the real Postgres DB, and committed
as separate checkpoints per the owner's preference (confirm before each
commit, confirm before each push).

**AGENT 4 — Public pages:** Rather than rebuilding the maquettes' look in
Tailwind from scratch, ported their actual CSS (colors, nav, footer,
buttons, cards, FAQ accordion) into shared `globals.css` tokens + `public-
shared.css` + per-page CSS modules. Guarantees pixel fidelity and was
much faster than re-deriving styles by hand. Homepage, Packages,
Instructors, FAQ, Contact all pull live data from Postgres. Packages page
has a working client-side category filter; FAQ page has a working EN/NL
toggle between real DB rows; Contact page has a working form wired to
`/api/contact` (honest "not configured" error until a real
`RESEND_API_KEY` exists, not a fake success). Schema gained
`Package.featured` and `Instructor.yearsExperience` to represent real
content. Seed data expanded to the maquettes' actual 4 packages / 3
named instructors / 7 FAQs.

**AGENT 5 — Booking system:** Full 5-step wizard (package → instructor →
date → time slot → payment → confirmation) with real state instead of
the maquette's vanilla-JS DOM manipulation. `lib/slots.ts` centralizes
slot generation (hourly slots that fit a lesson within the instructor's
schedule window) so the availability API and the booking-creation API
can never drift apart. `POST /api/bookings` re-validates everything
server-side inside a transaction that re-checks for a clash immediately
before insert — two students can't win the same slot in a race. Also
built `/api/bookings/my`, `/api/bookings/:id/cancel` (24h rule), and
`/api/admin/bookings/:id/confirm-payment` (route only — the admin UI is
Phase 3). **Bug caught and fixed:** the booking page initially sorted
packages by price ascending (Refresher first), inconsistent with the
canonical Starter/Standard/Premium/Refresher order used everywhere else.

**AGENT 6 — Student dashboard & e-learning:** Seeded real course content
(5 modules, 18 lessons — TEXT, VIDEO-placeholder, and QUIZ types),
including the maquette's full 5-question Traffic Regulations quiz
verbatim rather than leaving it as demo-only content. `lib/progress.ts`
computes sequential unlock state server-side on every request (a module
unlocks once the previous module is 100% complete; a lesson unlocks once
the previous lesson in its module is PASSED) — never trusts client
state. Split the maquette's single SPA-style quiz screen into three real
routes per Claude.md's spec: `/student/learn`, `/student/learn/
[moduleId]`, `/student/learn/[moduleId]/[lessonId]`. Dashboard's "Recent
Activity" is derived from real StudentProgress/Booking rows, not
fabricated demo data — a genuinely new student sees a genuinely empty
state (verified via screenshot). **Bug caught and fixed:** the
"next lesson" link after completing a lesson was computed from
pre-submission unlock state, so it always fell back to the module page
instead of advancing — fixed to always point at the next lesson when one
exists, since completing the current one is what unlocks it.

**Verification approach, all three:** live Playwright runs against the
real dev Postgres DB (not just `npm run build`), registering fresh
students and driving full flows end to end — not just checking that
pages render. Caught two real app bugs this way (both noted above) plus
several test-script-only bugs (CSS Modules substring collisions like
`.pkg-options` matching a `[class*="pkg-option"]` selector, and Next.js
dev-mode's on-demand Turbopack compilation needing a longer first-hit
wait) that were traced to the test harness, not the app, before being
ruled out.

**Also:** hit Prisma's built-in AI-agent safety guard on `prisma migrate
reset --force` (it refuses to run under an AI agent without explicit
user consent passed via an env var) when cleaning up stale seed rows
with mismatched IDs — asked the owner first, per the tool's own
requirement, got explicit consent, then ran it.

**Committed:** `78750ed` (AGENT 4), `3243872` (AGENT 5), `4d00524`
(AGENT 6). Not yet pushed — pending owner confirmation, same as every
other checkpoint this session.

**Still open before Phase 2 can be called done:** owner review of the
actual pages (this sitrep entry documents what was built and verified
technically, not a design sign-off). Everything else in Claude.md's
AGENT 4/5/6 scope is implemented.

---

## Phase 3 — Admin + Integrations

### 2026-08-27 — AGENT 7 + 9 + 8, same session as Phases 1 and 2

Continued directly from the Phase 2 session (same day, same very long
session). All three Phase 3 agents built, verified live, committed as
separate checkpoints, each pushed after explicit confirmation. Order was
9 -> 7 -> 8 (WhatsApp first since it's self-contained; admin second since
it's the largest chunk and creates real data other things depend on; i18n
last since it's a cross-cutting retrofit best done once everything else
existed).

**AGENT 9 — WhatsApp:** `lib/whatsapp.ts` calls the Meta Graph API
directly; `notify()` wraps it with the spec's WhatsApp-then-email
fallback and never throws. Wired into all four trigger points (booking
created, booking cancelled — both student- and admin-initiated, payment
confirmed, and a new `/api/cron/booking-reminders` route + `vercel.json`
schedule for the daily-8AM reminder job). No real Meta/Resend credentials
exist, so delivery itself is unverified, but the fallback chain was:
created a real booking, watched WhatsApp fail cleanly ("not configured"),
watched the email fallback also fail cleanly, confirmed the booking still
succeeded regardless.

**AGENT 7 — Admin dashboard:** all 8 pages (dashboard, bookings,
packages, instructors, students, content, faq, settings), dark-sidebar
design system ported the same way AGENT 4 ported the public site's.
Content page includes a full quiz builder (add/reorder/remove questions,
4 options with a correct-answer radio, per-question explanation, passing
score). Added `User.courseAccess` (schema never modeled the "grant/revoke
course access" gate Claude.md's students page requires) and a
`SchoolSettings` singleton model (same gap for the settings page).

Two real bugs caught by live verification, not just build checks:
- Creating an admin package with a name outside the hardcoded
  Starter/Standard/Premium/Refresher set hard-crashed the public
  `/packages` page — AGENT 4's `packages-grid.tsx` had a lookup table
  that assumed a fixed package set and had never been exercised with a
  genuinely new name until an admin could actually create one. Fixed
  with a generic fallback derived from real fields.
- `/admin/students` called a 2-query unlock-state function once per
  student (true N+1); with 15 test students accumulated over the
  session this actually crashed the dev server. Rewritten to 3 bulk
  queries total regardless of student count.

All test/debug data created while verifying (packages, an instructor, an
FAQ, 15 accumulated test student accounts from the whole day's testing)
was deleted afterward so the dataset matches the seed script exactly.

**AGENT 8 — i18n:** next-intl (App Router doesn't support next-i18next;
flagged back in the Phase 1 entry), cookie-based locale rather than
URL-prefixed routes, matching the maquettes' own non-prefixed
language-switcher UX. Resolution order: cookie -> logged-in user's stored
`language` -> browser `Accept-Language` -> English. `LanguageSwitcher`
replaced the cosmetic-only local-state toggles in `SiteNav` and
`StudentShell` (the latter didn't even have one before this, despite the
maquette dashboard having one). Empty `es.json`/`pt.json` scaffolds per
spec.

Scope decision, made without re-asking since the project already has a
precedent for it: the maquette phase's 2026-08-19 session deliberately
scoped translation to "minimal real" (nav, footer, homepage, packages,
dashboard) over an owner's explicit choice between that and full
coverage. Applied the identical scope to the real app — shared nav/footer
(covers every page), full homepage + packages page, student dashboard
shell + overview. Booking wizard, quiz engine, FAQ body text,
instructors/contact pages, and the entire admin panel stay English-only,
exactly as the maquette itself left them.

Verified live: default English for a browser with no preference;
automatic Dutch for a browser sending `Accept-Language: nl` on first
visit (no cookie yet); clicking NL re-renders the current page in Dutch
within 500ms (measured via response polling) and persists across
navigation; a logged-in student's language switch updates their
`User.language` row in the database; confirmed booking/FAQ/instructors/
admin correctly stay English regardless of the locale cookie.

**Committed:** `48b7602` (AGENT 9), `8be3bfe` (AGENT 7), `5594158`
(AGENT 8). All three pushed to `origin/main` after the owner confirmed
each round.

**Phase 3 is now fully complete** per Claude.md's AGENT 7/8/9 scope. Only
Phase 4 (QA) remains before the whole build order is done.

---

## Phase 4 — QA

### 2026-08-27 — AGENT 10, same session as Phases 1, 2, and 3

Final phase of the build order, same very long session as everything
before it. Set up two permanent, checked-in test suites — Jest (48 unit
tests across 4 files: quiz scoring, slot availability, auth route-guard,
WhatsApp/email fallback with mocks) and Playwright E2E (3 scenarios
matching Claude.md's spec exactly: student onboarding, booking
confirmation, admin-creates-package-student-sees-it). Extracted
`lib/quiz.ts` and `lib/route-guard.ts` from inline route/middleware logic
specifically to make the unit tests possible.

Found and fixed six more real bugs by actually driving the app one more
time, none caught by `npm run build` or TypeScript: the same
packages-grid crash from the Phase 3 entry (now with a permanent
regression test), the admin/students N+1 that had crashed the dev
server, a mobile nav overflow on every public page (pre-existing in the
maquette itself — `.nav-actions` had no mobile treatment at all),
a classic CSS Grid `1fr`-doesn't-shrink bug on the student dashboard,
two WCAG AA contrast failures found by computing actual contrast ratios
rather than eyeballing (both inherited unchanged from the maquette's
original color tokens), and three missing `aria-label`s on Phase 3 form
inputs. Full detail, including exactly what was verified vs. what's a
known limitation (shared dev DB for E2E, partial i18n scope, unverifiable
WhatsApp delivery), is in `excellent-driving/QA.md` rather than
duplicated here.

**Committed:** `b4aae59`. Pushed after owner confirmation, same as every
other checkpoint.

**This closes out Claude.md's entire build order — Phases 0 through 4 are
now all complete.** See the End-to-end overview below.

---

## End-to-end overview

Built across a single (very long) session on 2026-08-27, continuing from
Phase 0's maquette work completed 2026-08-18/19. Every phase was verified
live (Playwright driving a real browser against the real app and a real
local Postgres database) before being committed, not just checked with
`npm run build`.

**What exists now:** a working Next.js 16 App Router application at
`excellent-driving/` — public marketing site, a 5-step booking wizard
with race-safe slot booking, a full student e-learning system (sequential
module/lesson unlocking, a working quiz engine with pass/fail/retry), an
8-page admin panel including a real quiz builder, WhatsApp notifications
with an email fallback chain, functional EN/NL language switching, and
two permanent automated test suites. 9 real, non-hypothetical bugs were
caught and fixed by live-testing rather than trusting a clean build —
listed in the Phase 2/3/4 entries above and in `QA.md`.

**Where the real app deliberately deviates from `Claude.md`'s literal
text**, and why — all flagged at the time, none silent:
- **Next.js 14 → 16.** 14 was already old by the build date; the App
  Router API shape Claude.md describes is unchanged.
- **next-i18next → next-intl.** next-i18next targets the Pages Router;
  the App Router needs next-intl or equivalent.
- **Prisma pinned to 6.19.3, not `latest` (8.0.0 at build time).**
  Prisma 7 removed the classic `url = env("DATABASE_URL")` schema
  pattern in favor of a driver-adapter architecture — a bigger change
  than this phase needed. 6.x keeps the flow the rest of the spec
  assumes.
- **next-auth stayed on stable v4**, not the v5/Auth.js beta — the
  spec's described API (`CredentialsProvider`, `middleware.ts`, Prisma
  adapter) is v4-shaped. (`middleware.ts` itself got renamed to
  `proxy.ts` mid-project when Next.js 16 deprecated the old convention.)
- **i18n coverage is intentionally partial**, not "translate
  everything" — matched an explicit owner decision already made once
  during the maquette phase (2026-08-19: chose "minimal real" over full
  coverage). Nav/footer/homepage/packages/student-dashboard are
  functionally bilingual; booking, quiz, admin, and body/FAQ text stay
  English, same as the maquette itself.
- **Two schema additions Claude.md's model list never mentioned but
  the spec's own page descriptions require:** `User.courseAccess`
  (the students page explicitly asks for "grant/revoke course access")
  and a `SchoolSettings` singleton (the settings page needs somewhere
  to persist school name/address/WhatsApp number/language default).
- **WhatsApp and email delivery are unverifiable** without real Meta
  Business and Resend credentials — the dispatch *logic* (WhatsApp
  first, fall back to email, never throw) is fully built and unit-
  tested with mocks; actual message delivery was never able to be
  observed end-to-end in this sandbox.

**What's still genuinely open, not silently dropped:**
- Owner review/sign-off on the actual built pages — every phase's
  "done" in this log means "built and technically verified," not
  "approved by the person the site is for."
- Production deployment itself (Vercel + Supabase per Claude.md's
  deployment notes) — nothing in this session touched a production
  environment; `DATABASE_URL`/`NEXTAUTH_URL`/API keys are all still
  local placeholders.
- Real WhatsApp Business and Resend accounts need to be provisioned
  before notifications and the contact form actually send anything.
- Spanish/Portuguese locale files exist as empty scaffolds only, per
  Claude.md's own "fill in later" instruction.

## 2026-08-27 — Post-Phase-4: live demo access + demo banner

Owner asked to see the finished product. Started the app for live
review over an ngrok tunnel and hit/fixed two real issues along the way:

- **Login silently broken over the tunnel.** Root cause: `npm run dev`
  blocks cross-origin HMR requests by default
  (`⚠ Blocked cross-origin request to Next.js dev resource /_next/hmr`),
  which quietly kills client-side interactivity even though pages
  render. Fixed by switching to a real production build (`npm run
  build` + `npm start`) and correcting `NEXTAUTH_URL` in `.env.local`
  to the actual tunnel origin (was still `http://localhost:3000`,
  which breaks NextAuth's cookie/session handling behind a different
  origin).
- **Demo-limitation confusion risk.** Owner flagged (correctly) that
  simulated WhatsApp/email notifications and temporary/resettable data
  could read as bugs rather than expected sandbox behavior during
  review. Added `components/demo-banner.tsx` — a dismissible top
  banner, shown on every page, stating notifications are simulated and
  data is temporary. Found and fixed a real layout bug this surfaced:
  the student/admin sidebars are `position: fixed; top: 0`, which
  ignores the banner's normal-flow position entirely, so the banner
  covered the top of both sidebars. Fixed by having the banner report
  its live rendered height via a `ref` + `useEffect` into a
  `--demo-banner-height` CSS var on `<html>`, and changing both
  sidebar stylesheets to `top: var(--demo-banner-height); height:
  calc(100vh - var(--demo-banner-height))`. Verified via Playwright
  screenshots (homepage, student dashboard, admin dashboard
  visible/dismissed states) and confirmed dismiss persists across
  reload via localStorage.
- Re-ran the full test suite after these changes (48 unit + 3 E2E, all
  passing) before switching the tunnel back to a production server.
  Also cleared out accumulated E2E/manual test students, bookings, and
  one leftover test package from the local Postgres DB so the owner's
  first look at `/admin` isn't cluttered with fake records.
- Committed and pushed as `a29b5ec`.

Tunnel URL is stable across restarts as long as the ngrok process
stays up: `https://croak-unlimited-harmony.ngrok-free.dev`. If it's
ever restarted, the URL will change and needs to be re-shared.

## 2026-09-11 — First real lesson content: Maquette Les 1

Owner (Middag Mo) flagged that every lesson currently in the app is
placeholder/example material, and provided the school's actual course
material to start replacing it with, beginning with
`materiaalrijonderricht/Maquette les 1.pdf` (also uploaded there
alongside the existing `.docx` originals for les 1–6).

- **Content added, kept separate from placeholders on purpose.** Rather
  than editing the 5 existing example modules, added a new module —
  "Maquette — Voorrangsregels (Les 1)" — to `prisma/seed.ts`, at
  `orderIndex: 0` so it's the first thing a new student sees (module 1
  is always unlocked; see `lib/progress.ts`). The 5 example modules are
  untouched and still present; nothing here silently replaces them.
  Split the PDF's 3 pages into 5 TEXT lessons matching its actual
  structure: intro to the digital maquette, Suriname's left-hand-
  traffic rule + legal definitions, the 4-step method for solving
  maquette problems, the 10 numbered priority ("LET OP") rules plus the
  Goudenregel, and the legend/symbol key.
- **Real bug found and fixed along the way:** `TextLessonView` rendered
  lesson body as plain text (`{body}`), so any HTML in lesson content
  showed as literal `<p>`/`<ul>` tags on screen. Since the real content
  needs headings, lists, bold terms, and a highlighted rule box, switched
  it to `dangerouslySetInnerHTML` (matching how quiz explanations
  already render) and added matching `:global()` rich-text styles in
  `lesson.module.css` (headings, lists, a `.callout` box for the
  Goudenregel, and a `.legend-table`/`.legend-dot` for the symbol key).
  Existing placeholder lessons are plain strings with no tags, so this
  is backward-compatible — verified visually.
- Per the owner's clarification: a solid black circle (`⚫`) in a
  maquette situation diagram always denotes a *zandweg* (dirt/sand
  road) — encoded as item 11 of the legend table, rendered as an
  actual small solid circle (`.legend-dot`) next to "zandweg" rather
  than relying on an emoji glyph.
- **Verification gotcha, same class of bug as 2026-08-27's tunnel
  issue:** a stale `next start` production server from the Aug 27
  session (PID alive since then) was still squatting on port 3000, so
  a fresh `next dev` silently rebound to 3001 and initial Playwright
  verification was unknowingly hitting the old build (which still had
  the raw-HTML-tag bug). Killed the stale process, confirmed a single
  clean dev server on 3000, then re-verified. Walked a temporary QA
  student account through all 5 real lessons at both 1280px and 400px
  viewports via Playwright/Chromium screenshots — confirmed no raw
  tags, clean list/callout/table rendering, and no mobile overflow on
  the legend table. Deleted the QA test account and its progress rows
  afterward.
- Not yet committed — left as working-tree changes pending the owner's
  go-ahead, since this establishes the pattern for incorporating les 2–6
  next and is worth a look before it lands.

## 2026-09-22 — Maquette Les 1a: 20 voorrangssituaties as diagrams + quizzes

Retry of Les 1a. The first attempt didn't come out the way the owner wanted
and was never committed, so the owner wrote a build spec
(`materiaalrijonderricht/claude_code_build_spec.md`) plus reference SVGs
(`verkeerssituaties_diagrammen_1-20_v5.html`), and this build follows those.

| What | Expectation | Outcome |
|---|---|---|
| One renderer, not 20 SVGs | Situations stored as data and drawn from fixed template constants | `lib/maquette.ts` (geometry) + `components/maquette-situation.tsx` (SVG). Paths match the v5 reference for all 20 situations. Test: `lib/__tests__/maquette.test.ts` |
| Colours are the answer key | Worked examples (1, 4, 17, 18) coloured; exercises neutral until answered | Worked examples go in TEXT lessons with a new optional `examples` field. Exercise diagrams sit in QUIZ questions (`situation` field), drawn neutral grey and coloured after "Check Answer". Checked in the browser for all 16 exercises |
| Own module, directly after Les 1 | Kept apart from the placeholder modules | New module `seed-module-maquette-les-1a` at `orderIndex: 1`. Modules now carry explicit ids, so the 5 example modules shifted to order 2–6 and kept their ids (the upsert now also updates `orderIndex`) |
| Lesson split | Follows the PDF | 1: how to read a diagram + worked 1 & 4 · 2: quiz on 2, 3, 5–9 · 3: quiz on 10–16 (bikes / bike lanes) · 4: worked 17 & 18 · 5: quiz on 19–20 |

**Answer-key deviations from the spec (confirmed with the owner: the Les 1 rules win over the spec):**
- 12 (both turn left, Z.R.P.) is **f – 1**, not 1 + f (rule 4). 14 (both turn right, Z.R.P.) is **1 – f**, not 1 + f (rule 5). 17 is **2 – 1 – f**, as the PDF itself says, not 2 – 1+f.
- 19: 1 turns right, 2 goes straight on opposite → by the Goudenregel **2 – 1**. The spec said 1 – 2. Same class of fix, flagged for the owner to confirm.
- 18: the bike is coloured orange (waiting), which fits "2 – 1 + f". The v5 reference had it green.
- 4: the PDF prints "1-2", but the Goudenregel note in the same PDF cites 4 as its example, so the spec's **2 – 1** is kept.
- Geometry: 11's bike start uses y=67 as in the spec (v5 had 72). The spec table's "linksaf→west" for 18's car 1 is a typo; it turns right. Bike-lane bands are drawn on both the east and west roads whenever M.R.P., matching the PDF and v5.

**Verification:** tsc, eslint and jest all pass (55 tests). Ran a dev server on :3001 (left :3000 alone, since it's the prod server behind the ngrok tunnel). A temporary QA student walked all 5 lessons at 1280px and 400px, answering every exercise correctly. Result: all quizzes passed, no console errors, no horizontal overflow. Along the way, fixed a global `section` padding that left an 80px gap under the worked examples. QA account and its progress rows deleted afterwards.

**Open:**
- ~~Prod server on :3000 still runs the old build~~. Rebuilt and restarted on 2026-09-23 (see below).
- Not committed yet.

### 2026-09-23 — Test-account cleanup

- Deleted the 4 leftover "Temp Les1a Check" student accounts from the first Les 1a attempt. None had progress or bookings.
- `demo-student@excellentdriving.sr` (Demo Student) is now the owner's main account for checking lessons as a student. It has a new password, which was given to the owner in chat and is not written here. Login checked against the :3000 server.
- The students left are Demo Student and the real account `stevandpas@gmail.com`, which was not touched.

### 2026-09-23 — Prod rebuild for Les 1a

- Stopped the `npm start` server on :3000, ran `npm run build`, and started it again. The site was down for about a minute. ngrok kept running, so the tunnel URL is unchanged: `https://croak-unlimited-harmony.ngrok-free.dev` → :3000.
- Checked on the prod build with a throwaway QA account, deleted afterwards: Les 1a lesson 1 shows both worked-example diagrams, the first quiz shows its diagram, no page errors.
- Note: prod now runs code that isn't committed yet.
- Owner went through Les 1a by hand on the prod build and approved it. Next step: waiting for the next lesson from the owner.

## 2026-10-02 — Maquette Les 2: smalle wegen (situaties 21–31)

Owner uploaded `materiaalrijonderricht/Maquette les 2.pdf` and, because every "Opl:" in it is blank, the answer key `ANTWOORDEN MAQUETTES.docx`. Built the same way as Les 1a.

- **Module:** `seed-module-maquette-les-2`, "Maquette — Smalle wegen (Les 2)", at `orderIndex: 2`, directly after Les 1a. The 5 example modules shifted to 3–7. Content in `prisma/content/maquette-les-2.ts`.
- **Lessons:** 1: the VF rule, the VF/W notation and worked example 21 · 2: quiz on 22, 23a, 23b, 24–27 · 3: quiz on 28–31.
- **Answers follow the key as written.** VF answers list both possibilities, e.g. `VF 1+2 — (1W2) 2 – 1 of (2W1) 1 – 2`. Cyclists are written with a lower-case f throughout, as in Les 1a.
- **Renderer (`lib/maquette.ts`, `components/maquette-situation.tsx`):** a third answer colour, purple, for verkeersfatsoen; "S" centre label; zandweg dots; the no-entry sign in 27; road users from the east and cyclists from the west. In the 8-road-user situations 30 and 31 every turning road user is shifted 6px off the standard lane so the full-length paths do not run on top of each other (the owner rejected a first version with short direction-only arrows). Les 1a diagrams are unchanged.
- **Owner's clarifications:** the symbol in 27 is a no-entry sign; the black dots in 30/31 mean the top–bottom road is a zandweg; the grey circle in 31 is a stray mark.

**Confirmed by the owner (2026-10-02):**
- The answer key is right as written; it comes from the instructor. That includes 25's first possibility, `2 – F1 + 1`.
- 24: the key's `2+F-1` means f2.
- 30 and 31 have a rijwielpad on the left–right road.

**Verification:** tsc, eslint and jest pass (57 tests). On a production build with a local throwaway database, a temporary QA student walked all 3 lessons at 1280px and 400px, choosing the keyed answer for all 11 exercises: every one marked correct, no console errors, no horizontal overflow. QA account and its progress rows deleted afterwards.

**Closed:** owner approved the diagrams on the preview page (https://claude.ai/artifact/XM7LngzSyqAc5eB1nnkJRC); committed as 403af14 and pushed.

### 2026-10-02 — Live site moved to Vercel + Supabase

The earlier live setup (a `next start` server with a local database behind an ngrok tunnel) was on a previous machine and is gone; the tunnel is offline. The owner chose the hosted setup from `Claude.md`'s deployment notes.

- **Database:** Supabase project in us-east-1. All 4 migrations applied and the seed loaded from this machine through the session pooler (port 5432): 8 modules including Les 2, 1 admin, 3 instructors. Student accounts from the old machine were not carried over.
- **Site:** https://crispy-garbanzo-one.vercel.app, Vercel project with Root Directory `excellent-driving`. `DATABASE_URL` is the transaction pooler (port 6543) with `?pgbouncer=true&connection_limit=1`; `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set. WhatsApp and email keys are not set, so notifications are skipped.
- **Code:** added `"postinstall": "prisma generate"` so Vercel builds against a fresh database client (3e8ef4c).
- **Checked** with a temporary student, deleted afterwards: public pages load, login works, Les 2 is module 3, its first lesson and first quiz question work, no page errors.
- **Owner's review account:** `webtrekker95@gmail.com` has Les 1, Les 1a and Les 2 unlocked. The owner went through all three as a student on the live site and approved them.

**Open:**
- The seeded admin account still has the default password from `prisma/seed.ts` until the owner changes it.
- Vercel's free plan is for non-commercial use; a paid plan is needed before the school uses the site for real bookings.
- New lesson content needs `npx prisma db seed` run against the Supabase database; a push alone only redeploys the app.
- Noticed, not looked into: the lesson list shows English module titles with NL selected, and a not-yet-unlocked lesson address opened directly did not redirect.

### 2026-10-02 — Student area translated to Dutch

- **Module titles:** the dashboard, lesson list, module page and lesson back link always showed the English title; they now follow the language switch (f18a8f9, live).
- **Interface text:** everything under `/student` now comes from `messages/en.json` and `messages/nl.json` (new `Learn`, `Bookings` and `Profile` sections, plus additions to `Dashboard`): lesson list, module page, lesson and quiz views including the score screen and lock messages, bookings, profile, the side menu, and the dashboard's activity feed, status labels and dates. Package names on the dashboard and bookings page also follow the language. English wording is unchanged.
- **Checked:** tsc, eslint, jest (57 tests) and the 3 end-to-end tests pass. A temporary student walked every student page in Dutch on a local production build, including a failed quiz: no leftover English found by a text scan, no page errors, no overflow at 400px. Account deleted afterwards.
- **Lesson locks looked into:** a locked lesson opened by direct link shows only the lock message, and the progress API answers 403. No change needed.

**Still English under NL:**
- The booking wizard (`/booking`), about 80 texts plus its month and day names.
- Error messages that come from the server (for example a failed password change).
- The "Demo build" banner, and time slots, which are stored as "8:00 AM".
- Not checked: the login and register pages.

## 2026-10-06 — Maquette Les 3: brede wegen, diagrams (situaties 32–42)

The owner uploaded `materiaalrijonderricht/Maquette les 3.pdf`. It has 11 diagrams numbered 32–38 with repeats; at the owner's request they are numbered in page order, **32–42** (page 1: 32–36, page 2: 37–40, page 3: 41–42). Every "Opl:" is blank and `ANTWOORDEN MAQUETTES.docx` stops at 31.

- **Renderer:** new wide-road layout (`wide: true` in `lib/maquette.ts`, `WideTemplate` in `components/maquette-situation.tsx`): two car lanes each way, "B" centre label, rijwielpad bands on either road, zandweg circles on either road, and a second car queuing behind the first (13 in 41). Laid out for an approach from the north and rotated for the other three. Every turning road user's last stretch is pushed 6px off the lane line so no two paths overlap; a test checks this for all 11 situations. New `Situation` fields are additive, so Les 1a and Les 2 content already in the database is unaffected.
- **Content:** situations only, in `prisma/content/maquette-les-3.ts`. Not in the seed yet; every road user is a placeholder "must wait" until the answers arrive.
- **Readings the owner was asked to check:** the unnumbered top car in 32 is labelled 1; cyclists from the top turn rechtsaf except in 39–40 (linksaf); black circles are a zandweg (as in Les 2); car 13 in 41 waits behind 11; stray marks in 35, 36 and on page 2 are left out. Arrows run full length into the correct lane, as in Les 1a and 2, so opposing rechtsaffers cross (the PDF's short arrows don't).
- **Checked:** tsc, eslint, jest (61 tests). No browser on this machine; the diagrams were checked by rasterising the SVGs.

**Approved:** the owner approved the diagrams on the preview page (https://claude.ai/artifact/5tmZqg1BSRp6zX5uSDqTK7).

**Open:** the instructor's answers for 32–42. Then: lessons and quizzes, seed, live database.

## 2026-10-06 — Maquette Les 4: T-kruisingen en inritten, diagrams

The owner uploaded `materiaalrijonderricht/Maquette les 4.pdf`. Its 10 diagrams are examples that go with the rule text, so at the owner's request they have **no number**; the student still solves each one ("Opl:"). They are keyed `t-kruising`, `t-kruising-breed-rijwielpad`, `t-kruising-breed`, `regel-1`, `regel-2`, `regel-3-opl-1`, `regel-3-opl-2`, `regel-4`, `regel-5`, `regel-6`.

- **Renderer:** the wide layout gained additive fields: `missingArm` (T-kruising: the arm is left out and the view cropped), `inrit` and `inritWidth` (the whole north arm is the inrit: label in the middle, no centre line), `roadWidth` (centre label; lane dividers only on "B"), `noEntryArm` (model 14, "gesloten in één richting", drawn as the red no-entry sign with its bar across the road it closes). Per road user, `lane` ("kerb", "inner", "opposite") and `behind` place it as the PDF does. `Situation.number` is now optional. Les 1a–3 content is unaffected; Les 3 renders pixel-identical.
- **Content:** situations only, in `prisma/content/maquette-les-4.ts`. Not in the seed yet; every road user is a placeholder "must wait".
- **Readings approved by the owner:** the two brede T-kruisingen are one situation with and without rijwielpad (F1 = f1); car 7 waits behind 6 and turns linksaf; car 3 in Regel 3 Opl 2 turns linksaf; cars drawn behind and beside another wait behind, in the lane towards the centre.
- **Checked:** tsc, eslint, jest (63 tests); diagrams checked by rasterising the SVGs.

**Approved:** on the preview page (https://claude.ai/artifact/5vaouomABXn4BwnGuWAo2V).

**Open:** the instructor's answers. Then: lessons (the PDF's rules 1–6 and the Oplossingsmodellen A and B are the lesson text) and quizzes, seed, live database.

## 2026-10-06 — Maquette Les 5: wegen van gelijke rangorde, diagrams

The owner uploaded `materiaalrijonderricht/Maquette les 5.pdf`. Its 5 diagrams are examples that go with the rule text, so as in Les 4 they have no number. Keys: `regel-1`, `regel-2`, `regel-3-vb-1`, `regel-3-vb-2`, `oplossingsmodel`.

- **Renderer:** no changes; the Les 4 wide layout covers everything.
- **Content:** situations only, in `prisma/content/maquette-les-5.ts`. Not in the seed yet; every road user is a placeholder "must wait".
- **Readings approved by the owner:** in Regel 1 the arrows are drawn as cars; in Regel 3 V.B. 1 the line from the left is linksaffer 2 and the bottom car is 3; in the Oplossingsmodel 1 waits behind 2 and turns linksaf, f3 turns rechtsaf, f8 waits behind f7 and turns rechtsaf.
- **Checked:** tsc, eslint, jest (63 tests; the overlap check now covers Les 5).

**Approved:** on the preview page (https://claude.ai/artifact/JArb62RHfx3y6heBXLP4Vv).

**Open:** the instructor's answers. Then: lessons (the rules, the Oplossingsmodel and the "4 soorten verkeersfatsoen" list are the lesson text) and quizzes, seed, live database.

## 2026-10-06 — Maquette Les 6: bevoorrechte weggebruikers, diagrams

The owner uploaded `materiaalrijonderricht/Maquette les 6.pdf`. Its 2 diagrams are examples for rule 1, unnumbered as in Les 4 and 5: `regel-1-vb-1`, `regel-1-vb-2`.

- **Renderer:** no changes.
- **Content:** situations only, in `prisma/content/maquette-les-6.ts`. PS, BS and AS (politie, brandweer, ambulance met sirene) are drawn as cars with their label. Not in the seed yet; every road user is a placeholder "must wait".
- **Readings approved by the owner:** car 3 in V.B. 1 turns linksaf (the owner confirmed it; the PDF's drawing is unclear); F2 is written f2; in V.B. 2 BS waits behind 5 and PS behind 4.
- **Checked:** tsc, eslint, jest (63 tests; the overlap check covers Les 3–6).

**Approved:** on the preview page (https://claude.ai/artifact/6eCqkitWy9zBZnXqSKv7Gs).

**Open:** the instructor's answers for Les 3–6. Then: lessons (for Les 6: the volgorde PS–BS–AS, the solving order, and the Toelichting glossary on page 2) and quizzes, seed, live database. With Les 6, all six maquette PDFs have diagrams.

## 2026-10-06 — Verkeersborden module (replaces the placeholder "Verkeersregels & Borden")

The owner uploaded `materiaalrijonderricht/VERKEERSBORDEN.pdf` (75 signs with model number and meaning) and chose to replace the placeholder module `seed-module-1`, whose 3 generic pages wrongly said traffic from the right has priority.

- **Content:** `prisma/content/verkeersborden.ts`. The signs are grouped by type into six lessons (Voorrangsborden 10, Gesloten- en verbodsborden 13, Stilstaan/parkeren/snelheid 6, Gebodsborden 8, Waarschuwingsborden 25, Aanwijzingsborden en overige 13), each a page showing every sign and a quiz with one question per sign ("Wat betekent dit bord?", three answers from the same group, pass at 70%). Meanings are the PDF's text with small spelling fixes; Model 20, 21, 23, 23a and 44 are put more simply.
- **Suggested meanings:** the PDF leaves 6 blank (rechts of links aanhouden, bocht naar rechts met zijweg links, stopverbod, rechtdoor of rechtsaf, voetgangersoversteekplaats, the brigadier's hand-held sign). They are filled in and marked `suggested`; the owner keeps them until the instructor corrects them.
- **Images** (`public/verkeersborden/`, listed with their source in `prisma/content/verkeersborden-images.ts`). The owner asked for no upscaled crops and exact online matches:
  - 61 public-domain SVGs from Wikimedia Commons (Belgian and historic Dutch signs): 46 exact, 6 mirrored for left-hand traffic, 9 "closest" drawings the owner picked (Model 15, 16, 19, 21 (reads 2,5 m, PDF 3,5 m), 27a, 52b, 54, 55, bromfiets 30).
  - 9 SVGs drawn here after the PDF in the style of the Commons signs: the H sign (styled like Model 43), Model 44, 44a, 48, 50, 51, the curve with a side road, rechts of links aanhouden, nadering rotonde.
  - 5 keep the PDF's embedded image at its own size (53e, 53f, the brigadier's two signs, road-end markings), never shown larger.
  - Suriname's official sign drawings (bijlage of the Rijbesluit 1957, free to use under the Surinamese Auteurswet art. 11) are not online; with a copy from the ministry the remaining signs could be redone.
- **App:** quiz questions can show an image (`image: { src, alt, width? }`); the alt text never gives the answer away and raster images are never shown wider than they are.
- **Live database:** the seed only creates missing rows, so `prisma/replace-verkeersborden.ts` replaces the module's titles and lessons (and progress on the old placeholder pages). Run on 2026-10-06: 3 placeholder lessons replaced by 12; read back from the database, the module is 4th, published, with all six pages and quizzes. The images are served by the live site.
- **Checked:** tsc, eslint, jest (66 tests; a new test checks every image exists, every quiz answer is the sign's own meaning, and no option repeats). No browser on this machine, so the pages have not been seen rendered.

**Review page:** https://claude.ai/artifact/6snPFETr3zRvq3UtaFGAH9

## 2026-10-11 — Maquette Les 3–6: answers, lessons and quizzes

The owner uploaded the instructor's answer keys: `ANTWOORDEN MAQUETTES H3.docx` (Les 3), `H4.docx` (Les 4) and `H5&6.docx` (Les 5 and 6). They are followed as written.

- **Corrected typos (owner's call):** 34 "VF2+F(F+2)1+2-7" is `VF 2+f — (fW2) 1 + 2 – f of (2Wf) 1 + f – 2`; 40 "3+2+F1-3+4" is `3 + 2 + f1 – 1 + 4`. Read as obvious: the second possibility of 41 ends with f10 (key: "10"); the Les 5 oplossingsmodel's "(T8W6)" is (f8W6).
- **Mapping:** the H3 key numbers its answers like the PDF (32–35, then 32–38); in order they are 32–42. The two brede T-kruising answers in H4 are taken in page order: the VF one is met rijwielpad, the same pattern as in Les 3.
- **Les 4 is partial:** the key answers the T-kruising, both brede T-kruisingen and Regel 1. Regel 2, 3 Opl 1/2, 4, 5 and 6 have no answer; the owner chose to build what is answered. Their lessons go after the current three when the answers arrive (the seed only adds missing lessons, so appending works).
- **Colours:** new `withKey()` in `lib/maquette.ts` colours a situation from its key (green = rides in the first turn, purple = VF, orange = waits) and throws on a label the diagram doesn't have.
- **Modules:** Les 3 (TEXT + example 32, quiz 33–37, quiz 38–42), Les 4 (T-kruising + example, quiz brede T-kruising with/without rijwielpad, inrit rules 1–6 and Oplossingsmodellen A/B + example Regel 1), Les 5 (rules, oplossingsmodel and the 4 soorten verkeersfatsoen + examples Regel 1 and 2, quiz Regel 3 V.B. 1/2 and the oplossingsmodel), Les 6 (rules + example V.B. 1, quiz V.B. 2, summary with the solving order and the Toelichting). Seeded at orderIndex 3–6; Verkeersborden and the example modules move to 7–11.
- **Explanations** are written from the PDFs' rules; where the reason for an order isn't clear from the rules (e.g. 37) they only describe it.
- **Checked:** tsc, eslint, jest (70 tests; a new test checks every answer names exactly the road users in its diagram and every answered diagram is coloured).

**Review page:** https://claude.ai/artifact/UZxufjbHjrLmgT4ahpDo8b

**Les 4 Regel 2–6, worked out from the rules (owner's request, same day):** the owner confirmed the six diagrams and that they explain the rules, so they are worked examples in the inrit lesson, not quizzes. The answers come from the inrit rules and Oplossingsmodel A (first the traffic not going to the inrit, as at a T-kruising; then clear the inrit; then fill it as at a T-kruising), a method that reproduces the key's Les 4 Regel 1 and Les 6 V.B. 2:
- Regel 2: `2 – 1 – 3 – 4 – 7 – 6 – 5`
- Regel 3 Opl 1: `VF 3+4 — (3W4) 4 – 3 – 1 – 2 – 5 of (4W3) 3 – 4 – 1 – 2 – 5`
- Regel 3 Opl 2 (least certain: rule 3 applied a second time between f4 and f5): `VF f5+3 — (3Wf5) f5 – 3 – f4 – 1 – 2 – 6 of (f5W3) 3 – VF f5+f4 — (f5Wf4) f4 – f5 of (f4Wf5) f5 – f4, daarna 1 – 2 – 6`
- Regel 4: `1 – f` · Regel 5: `1 – 2 + 3` · Regel 6: `4 – f3 – 1 – 2`

The owner chose to keep the other example diagrams as quizzes (Les 4 brede T-kruisingen, Les 5 Regel 3 V.B. 1/2 and Oplossingsmodel, Les 6 V.B. 2).

**Approved** by the owner on the review page and committed.

**Live (2026-10-12):** pushed by the owner. The full seed was not re-run on the live database: its `schedule.createMany` has no unique key to skip on, so a second run would duplicate every instructor's schedule. A one-off script did only the module part instead: the four modules and their 11 lessons were added and Verkeersborden and the example modules moved to 7–11 (17 schedule rows before and after). Read back: Les 3–6 are modules 4–7, published.
- **Checked on the live site** with a temporary student who had Les 1–2 passed: walked every Les 3–6 lesson at 1280px and 400px, choosing the keyed answer for all 11 quiz questions: every one marked correct, every quiz passed, no page errors, no horizontal overflow. Account and progress deleted afterwards (1 student left).

**Open:** the instructor to confirm the six derived Les 4 answers.

### 2026-10-12 — Seed no longer duplicates instructor schedules

`prisma/seed.ts` added every seeded instructor's weekly schedule on each run (`schedules` has no unique key, so `skipDuplicates` did nothing). It now creates a schedule only for an instructor it has just created; an existing instructor's hours are left to the admin, who can edit them. No unique key was added, because an instructor may have two blocks on one day. Checked on a throwaway local database: 17 schedule rows after the first run and after the second. The seed is safe to re-run on the live database again.

The "Demo build" banner stays (and stays in English) until the app is declared ready for production; it goes away then rather than being translated.

### 2026-10-12 — Booking wizard and server errors in Dutch

- **Owner's review account** (`webtrekker95@gmail.com`): Verkeersborden is module 8 now, so to open it all Les 3–6 lessons were marked PASSED on that account (10 rows; the account had passed Les 3 lesson 1 already). Verkeersborden lessons 1–2 were already passed from before; lesson 3 is next.
- **Booking wizard** (`/booking`): every text comes from a new `Booking` section in `messages/en.json` and `nl.json`. Month and day names, dates and prices follow the language through the browser's date formatting; package names use `packageName()`; instructor availability ("Beschikbaar ma–vr") is built on the server. English wording is unchanged.
- **Times:** slots are still stored as "1:00 PM"; new `displaySlot()` in `lib/slots.ts` shows them on the 24-hour clock in Dutch ("13:00") in the wizard, the dashboard and the bookings list.
- **Server errors:** the student- and public-facing API routes (bookings, cancel, profile, password, lesson progress, register, contact) answer with a message from a new `Errors` section, in the visitor's language, through `apiError()` in `lib/api-error.ts`. It uses the same language choice as the pages: cookie, then the account's language, then the browser. Admin, cron and internal routes are unchanged.
- **Checked:** tsc, eslint, jest (72 tests; new ones for `displaySlot`). On a local production build with a throwaway database, a test student booked a lesson through all six steps in Dutch at 1280px and 400px and in English: a text scan found no English left on the Dutch pages, no page errors, no overflow. A double booking and a wrong current password returned Dutch errors in Dutch and English ones in English.

**Still English under NL:** the login and register pages (not checked); WhatsApp/email message texts.

### 2026-10-12 — Project status sheet

At the owner's request, progress to launch is tracked in the Google Sheet "Excellent Driving Project Status" (https://docs.google.com/spreadsheets/d/1x9WOv3sJkQOsXM2X841RA2ZkLCehZwKnnTpb_h-nMJQ/edit): a **Tasks** tab with every open and finished task (area, status, who it waits on, whether launch needs it), a **Log** tab, and an **Overview** calculated from the tasks. Started with 37 tasks: 12 of the 32 launch tasks done. It is updated alongside this file in every session.

### 2026-10-12 — Login and register pages in Dutch

- `/login` and `/register` take their text from a new `Auth` section in `messages/en.json` and `nl.json`. The register form's language choice now starts on the language the visitor is using (it always started on English).
- **Fixed:** a register request that failed validation answered with zod's error object, which the page would have tried to show as text (React can't render an object, so the form would crash). The browser's own field checks normally stop such input first. The route now answers with a translated message (`invalidRegistration`).
- **Checked** on a local production build in Dutch (400px) and English (1280px): wrong password, an email that already has an account, and an invalid register request all show the message in the visitor's language; no page errors.
- **Noticed:** the login and register pages have no site menu, so there is no language switch on them; they follow the language chosen elsewhere on the site, or the browser's.

### 2026-10-12 — Public pages in Dutch

- **Translated:** homepage (learning-journey card, stats, package cards, instructor cards), packages page (feature lists, stats, comparison table), instructors, FAQ and contact pages, the contact form, the WhatsApp button and the menu button's label. New message sections `Contact`, `Faq`, `Instructors`, additions to `Home`, `Packages` (incl. `Packages.features`) and `Nav`. Prices use Dutch number formatting in Dutch.
- **FAQ:** the page opens in the visitor's language (it always opened on English). Both languages now have the same 6 questions: Dutch versions of the 4 English-only ones and an English version of the Dutch-only one (added to the seed; on the live database through the seed's add-missing-FAQs step).
- **Instructor bios in Dutch:** new optional column `instructors.bioNl` (migration `20261012020000_instructor_bio_nl`, applied to the live database before the push), editable in Admin › Instructors as "Bio in Dutch". The homepage and instructors page show it in Dutch and fall back to the English bio. Filled with translations of the three current bios.
- **Contact details from the admin settings:** new `lib/school.ts`. The footer, contact page and floating WhatsApp button use the phone, address and WhatsApp number from Admin › Settings. A WhatsApp button links to wa.me and only shows once a number is set; the phone only shows once it is no longer the "+597 XXX XXXX" placeholder. Before, both WhatsApp buttons linked nowhere and the placeholder number was printed.
- **Live database:** seed run (the schedule fix held: 17 schedule rows before and after), FAQ 6+6, Dutch bios set. Modules and lessons unchanged.
- **Checked** on a local production build: a dump of every text line on the five public pages in Dutch contains no English apart from the demo banner; English pages unchanged; no overflow at 400px; no page errors; with a phone and WhatsApp number set the tel: and wa.me links appear, with the live settings (none set) no placeholder and no dead links.
- **For the owner** (on the status sheet): fill in the phone and WhatsApp number in Admin › Settings; check the homepage numbers (500+ students, 8 instructors, 95% pass rate) and the FAQ's "cancel or reschedule" (the app only cancels); check the package feature lists (videos, mock exams, pass guarantee and so on) against what the school offers; confirm info@excellentdriving.sr and the hours; the footer names a privacy policy and terms that do not exist yet.

### 2026-10-12 — School email as a setting; temporary contact details; communication check

- **Email setting:** new column `school_settings.email` (migration `20261012030000_school_email`, applied to the live database before the push), field in Admin › Settings. The footer, contact page and the contact form's recipient use it instead of the hard-coded info@excellentdriving.sr. Checked locally: the admin form saves it, the contact page shows it.
- **Temporary details** until the owner's arrive (user's request): WhatsApp +597 873-5257, email webtrekker95@gmail.com, set in the live settings. Phone is still the placeholder, so it stays hidden.
- **Live check:** the WhatsApp buttons on the homepage and contact page link to wa.me/5978735257, which opens WhatsApp's "Chat on WhatsApp with +597 873-5257" page; whether the number has WhatsApp has to be tried from a phone. The contact form answers "E-mail is nog niet ingesteld" (HTTP 503): `RESEND_API_KEY` is not set in Vercel. Booking notifications (WhatsApp Cloud API, email fallback) are not configured either, so none are sent.

### 2026-10-12 — WhatsApp and email messages in Dutch

- `lib/whatsapp.ts` `templates` now take the recipient's language (`User.language`: the student's, or the instructor's for "new booking") and return `{ subject, message }`; dates ("maandag 2 november") and times (24-hour in Dutch) are formatted inside, and the payment message uses the package's Dutch name. The five call sites (booking, student cancel, admin cancel, admin confirm payment, daily reminder) pass the language. English wording is unchanged apart from dates now being formatted inside the template.
- **Checked:** tsc, eslint, jest (73 tests; Dutch template tests added). On a local production build: three bookings, an admin payment confirmation, an admin cancellation and the reminder job ran; each notification attempt logged "not configured" (no keys) and nothing failed.
- **For N1/N3 (WhatsApp):** `sendWhatsAppMessage` sends a free-text message. WhatsApp's Cloud API only allows free text inside the 24 hours after the student last messaged the school; notifications the school starts need approved message templates, sent by template name with the values as parameters. When the Meta account exists, register these texts as templates (one per language) and switch the call to `type: "template"`.

### 2026-10-12 — Test data check on the live database (H5)

- **Inventory (read-only):** users are the admin, the 3 real instructors and the review student `webtrekker95@gmail.com` (28 progress rows); no bookings; 4 real packages; 12 FAQs; no sessions, accounts or verification tokens. Nothing to remove now. Decided: the review account stays until launch and is deleted then. The example modules (Verkeersreglementen and the three after it) are task C13.
- **Security finding:** the GitHub repository `webtrekker95-hue/crispy-garbanzo` is public, and `prisma/seed.ts` (also `e2e/helpers.ts` and this file) contains the default password of `admin@excellentdriving.sr` and the instructor accounts, which was never changed on the live site. Anyone can log in to the live admin area. Instructor logins reach no pages (every protected page redirects them), but could book lessons. The admin area has no change-password screen. The owner chose not to change the passwords yet (2026-10-12); task H1 says so. No other secrets found in the repository or its history (no database password, no tracked env files).

### 2026-10-12 — Early live-site check (H7)

Walked https://crispy-garbanzo-one.vercel.app with a browser as a visitor, a new student and the admin; a temporary student was used and deleted afterwards with its 2 bookings and progress (students left: the review account; bookings: 0; schedules: 17).

- **Visitors:** all 20 public page loads (home, packages, instructors, FAQ, contact × NL/EN × 1280/400px) return 200 with no page errors and no overflow, in 0.2–1.1 s; the mobile menu opens; all 10 internal links answer; logged out, /student, /admin and /booking redirect to /login; a missing page returns 404 (Next's default page). A first run timed out on the database-backed public pages while login and register loaded; a rerun minutes later was clean. Probably a slow start, not reproduced.
- **Student (Dutch, 400px):** register → dashboard; lesson 1 marked complete opens lesson 2; a later module's lesson shows as locked; two bookings through the wizard (Dutch dates, 08:00/09:00, SRD 2.500); the bookings list shows 24-hour times; cancelling a booking works; profile save shows "Profiel bijgewerkt."; switching to EN changes the student area.
- **Admin (1280 and 400px):** all 8 admin pages load; confirming a payment and cancelling a booking through the buttons works.
- **Fixed:** the admin dashboard was 94px (desktop) and 363px (phone) wider than the screen because its grid let the Recent Bookings table stretch the page. The grid's columns may now shrink and the table scrolls inside its box (checked locally at 1280, 1024 and 400px).

### 2026-10-12 — Theory exam questions (VRAGEN CAT A/B, C, D)

The owner's side uploaded `VRAGEN CAT A EN B.pdf`, `VRAGEN CAT C.pdf` and `VRAGEN CAT D.pdf` (the .docx versions were already in the folder; nothing from them was in the app yet). All three start with the same general list (questions 1–107 with 82a and 82b; item 47 is a table of maximum speeds); C adds 14 truck items (7a–7c), D 11 bus items. Every question has one written answer, no options.

- **Owner's choices:** study pages with the answer hidden until tapped (no scoring, nothing invented); the general questions for every student, the C and D questions as two short modules at the end.
- **Content:** `prisma/content/theorie-vragen.ts` holds the questions as data (number, question, answer or list) and builds the pages: 11 pages of ten numbers (`Examenvragen 1–10` … `101–107`), the speed table after 46, one page each for C and D. Text as in the PDFs; only spacing and four words split over a line break are tidied ("waarvan", "T-kruising", "A-rijbewijs", "Procureur-Generaal").
- **Modules (seed):** `seed-module-theorie-algemeen` "Theorie-examenvragen" at orderIndex 8, after Verkeersborden; the four example modules move to 9–12; `seed-module-theorie-c` (13) and `seed-module-theorie-d` (14) last. Because modules open in order, a bus (D) student first marks the one truck (C) page done.
- **Styles:** questions are `<details>` boxes (lesson.module.css), the speed table scrolls sideways on a phone.
- **Checked:** tsc, eslint, jest (76 tests; a new test pins the numbering, answers and page split). On a local build: every page shows its questions closed, an answer opens on tap, no overflow at 400px; locks behave as for other modules.
- **For the instructor:** answer 25 ("Mag een leerling onder invloed van alcohol … een auto besturen? — Ja, als hij het naar behoren kan doen.") reads as wrong; shown as written until confirmed.
- **Live (same day):** seed run on the live database (15 modules; schedules still 17). Checked with a temporary student, deleted afterwards: pages 1, 5, 9, 11 and the C page show their questions closed, answers open on tap, the speed table shows, no overflow at 400px. On the review account `webtrekker95@gmail.com` all 12 Verkeersborden lessons were marked PASSED at the user's request, so the questions are open.

### 2026-10-12 — Example modules unpublished

The user confirmed that all course content from the instructor is in (Maquette Les 1–6, Verkeersborden, theory exam questions). The four example modules from the first build (Verkeersreglementen, Praktische Rijvaardigheden, Snelweg Rijden, Examenvoorbereiding; 14 lessons, no progress) are unpublished and titled "[VOORBEELD] …" / "[PLACEHOLDER] …", in the seed and on the live database, until the OK to delete them. Students no longer see them (checked on the live site with a temporary student, deleted afterwards: 11 modules listed, a direct link to a hidden module answers 404). The seed now creates them unpublished (`isPublished` per module, default true).

### 2026-10-12 — Launch items that need nothing from the owner

- **H1 passwords:** new random passwords (4 groups of 5 characters) on the live site for the admin and the 3 instructors. Checked through the live login: the default worked for the admin before the change, works for none of the four after, and the new admin password works. The admin password was given to the user in chat only; the instructors' are not recorded (they can't use their logins yet; set new ones if needed). The seed still contains the default password for fresh local databases; it never overwrites an existing account.
- **H10 change password:** Admin › Settings has a "Change Your Password" form (at least 12 characters, typed twice), using the existing password route.
- **H11 login lock:** after 5 wrong passwords in a row an account is locked for 15 minutes (`lib/login-lock.ts`, new columns `users.failedLoginCount` and `users.lockedUntil`, migration `20261012040000_login_lock`); the login page then says "Te veel mislukte pogingen…". Kept in the database because Vercel runs several server instances. A known email can be locked by someone guessing; it unlocks by itself after 15 minutes.
- **B9 settings** (migration `20261012050000_school_settings_launch`, Admin › Settings, `getSchool()` in `lib/school.ts`):
  - Bank name, holder and account number. Bank transfer is offered in the booking wizard only when an account number is set, and the server refuses it otherwise; the details show on the payment step and the confirmation.
  - "Lessons only after payment": new registrations then start without lesson access, see "Je online lessen gaan open zodra je betaling is bevestigd", and get access when the admin confirms a payment. Off by default (today's behaviour); existing students keep their access.
  - Homepage numbers: students trained and pass rate are settings, hidden while empty (so "500+" and "95%" disappear until the owner confirms them); the number of instructors is counted (3).
  - Opening hours: days in Dutch and English and one time range; footer, contact page and homepage use them.
- **N4 contact page:** while `RESEND_API_KEY` is not set, the form is replaced by "Mail of WhatsApp ons" with the email address and the WhatsApp button.
- **H12:** title template "… | Excellent Driving" with a title per public page, login, register and booking; a description per language; `app/not-found.tsx` in the site's style, in both languages (still HTTP 404).
- **H9 draft privacy policy and terms:** `/privacy` and `/voorwaarden` in Dutch and English (`lib/legal.ts`), written from what the app stores and the services it uses, with the school's name, address and email filled in from the settings, a "Concept" notice until `APPROVED` is set, and links in the footer. No refund or other policy was invented.
- **Checked:** tsc, eslint, jest (79 tests; login-lock tests added). On a local production build, 42 checks: the lock after 5 wrong passwords (Dutch message, right password refused while locked); the admin password change; the settings form; homepage numbers and hours with empty and filled settings; cash only and a server refusal without bank details; bank transfer and the account shown with bank details; a new student waiting for payment and getting access after the admin confirms; the contact page without the form; the 404 page, titles, description, legal pages and footer links in Dutch at 400px and English at 1280px.

### 2026-10-12 — Email through Resend (test mode)

The user made a Resend account with webtrekker95@gmail.com, added `RESEND_API_KEY` in Vercel (Production) and redeployed. The live contact page shows the form again, and a test message through `/api/contact` was accepted (`{"ok":true}`). In Resend's test mode mail only reaches the account's own address, which is also the school email in the settings for now, so the contact form works; booking emails to students (the WhatsApp fallback) are not delivered until the school's domain is verified in Resend, after which the sender in `app/api/contact/route.ts` and `lib/whatsapp.ts` changes from `onboarding@resend.dev` to an address on that domain.

### 2026-10-15 — Answers from the owner and the instructor

Both question pages came back by WhatsApp (owner and instructor: Steven Pas).

**Owner:**
- **1 Contact:** opening hours 08:00–18:00 (was 7:00–18:00). Phone, WhatsApp, email and days left as they are.
- **2 Bank, 3 homepage numbers, 11 launch date:** not answered yet. Bank transfer stays off and the numbers stay hidden.
- **4 Packages:** the package contents were not commented on. "Verzetten" must be possible, so students can now **reschedule** a lesson (see below); the FAQ text ("annuleren of verzetten, tot 24 uur vooraf") is now true and stays.
- **5 Lessons only after payment:** yes → setting `lessonsAfterPayment` on (live database). Existing students keep their access.
- **6 Privacy and terms:** the owner is having them checked first; they stay marked "Concept".
- **7 WhatsApp Business:** not yet. Notifications keep going by email (Resend, test mode).
- **8 Domain:** still to be arranged.
- **9 Hosting:** only the paid Vercel plan (about $20/month), no paid Supabase plan (so no automatic daily backups). He asks for advice on how to pay (which card).
- **10 Example modules:** delete → removed from the seed (with their three example quizzes) and from the live database; the C and D theory modules move to 9 and 10.
- **12 Other:** he asks for access to the information in the app so he can answer questions himself.

**Instructor:**
- Les 4 Regel 2, 3 Opl 1, 4 and 6, the six signs (16, 68, 71, 72, 73, 74), theory question 25 and the three Les 3 typo readings: correct. The `suggested` marks on the six signs are gone.
- **Regel 3 Opl 2:** no second V.F. between f5 and f4, they ride together → `VF f5+3 — (3Wf5) f5 – 3 – f4 – 1 – 2 – 6 of (f5W3) 3 – f5 + f4 – 1 – 2 – 6`.
- **Regel 5:** "1 – 2 + 3" holds on a wide road, not on a narrow one. Asked again with a picture: on a narrow road the cars stand behind each other, so 1 – 2 – 3 → now shown as "Brede weg: 1 – 2 + 3; smalle weg: 1 – 2 – 3".

**Rescheduling:** on My bookings, "Verzetten" next to "Annuleren" (same rule: up to 24 hours before the lesson). It opens a date field and the instructor's free times for that day; picking a time moves the booking (same instructor, package and payment). `PATCH /api/bookings/[id]/reschedule` checks the same things as a new booking (`slotProblem()` in the new `lib/bookings.ts`, now also used by `POST /api/bookings`), refuses a time already taken, and notifies the student and the instructor (new `bookingRescheduled` / `instructorRescheduled` texts in Dutch and English).

**Checked:** tsc, eslint, jest (79 tests), `next build`.

**Live (same day):** both commits pushed. On the live database: Les 4 lesson 3 updated, the four example modules deleted (14 lessons, no progress), C and D theory modules at 9 and 10 (11 modules in all), opening times 8:00–18:00, `lessonsAfterPayment` on. Checked over HTTP with a temporary student, deleted afterwards: login, "Verzetten" and "Annuleren" on My bookings, the slots API, a move to the next day (HTTP 200, the booking changed), a Sunday refused, a lesson within 24 hours refused (Dutch message), 8:00–18:00 on the homepage, both Les 4 corrections in the lesson, and a deleted module answering 404.

### 2026-10-16 — Owner's follow-up answers

- **Bank:** the school's account still has to be opened; students pay cash until then (bank transfer stays hidden). No longer counted as a launch blocker.
- **Homepage numbers:** rather not shown; they stay empty and hidden.
- **Launch:** the owner aims for the end of October 2026.
- **Access:** he wants to log in, i.e. the admin account (admin@excellentdriving.sr). The admin area is English only (task L6).
- **Temporary accounts for Steven (live site):** `steven.admin@example.com` (ADMIN) and `steven.leerling@example.com` (STUDENT, NL, all 49 published lessons marked PASSED so every module is open). Passwords given to the user in chat only. Both logins checked over HTTP (admin dashboard and the last module answer 200). The example.com addresses receive no mail. Delete both at launch (task H5).

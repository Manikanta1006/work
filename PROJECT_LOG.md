# INDQ Website + Backend — Project Log

> Mirrored here (on `indq-website`'s `test` branch) and in `indq-backend`'s
> `master` branch, so it's available regardless of which repo gets cloned
> first on a new machine. **`indq-backend` is the source of truth** —
> update that copy and re-sync this one, not the other way around.

Summary of everything built, decided, and tested across this session.
Kept as a reference so context isn't lost between sessions — the raw chat
transcript is also auto-saved by Claude Code itself under
`~/.claude/projects/`, but this is the readable version.

## Architecture

- **`indq-website`** (SvelteKit, existing site) — frontend only. Contact
  form, CRS form (`/crs`), NDA form (`/nda`). Talks to the backend via a
  hardcoded constant in `src/lib/backendUrl.js` (the live API Gateway URL —
  no Vercel env var needed, per user request).
- **`indq-backend`** (new, this session, standalone Express/TypeScript
  service, sibling folder to `indq-website`) — everything requiring a
  database, file processing, or private credentials:
  - Fills `.docx` templates (CRS, NDA) with submitted data via
    `docxtemplater`, converts to PDF via LibreOffice headless
  - Postgres (Supabase, via Prisma 7 + `@prisma/adapter-pg`)
  - Resend email (private key, server-only)
  - Issues/validates signed, non-expiring JWT links for `/crs/[id]` and
    `/nda/[id]`
  - Kept separate from the SvelteKit app because LibreOffice won't run on
    typical serverless targets (Vercel/Netlify), and it needs a DB/secrets
    a serverless frontend deploy shouldn't hold.

Full technical reference: `indq-backend/README.md` (template placeholder
contracts, API shapes, DB schema, etc. — kept up to date as things change).

## What's done and verified

- **CRS template**: real placeholder tokens added to the `.docx` by the
  user, verified against docxtemplater's own parser (not guesswork),
  end-to-end PDF generation tested and read back to confirm correctness.
- **NDA template**: same — 10 unique tokens found and wired, tested
  end-to-end, PDF read back and confirmed correct. One template issue
  flagged, not yet fixed by the user: the year "2025" is hardcoded as
  literal text after the `<Dated>` tag.
- **Backend scaffolded**: Express + TypeScript, Dockerfile (installs
  LibreOffice), builds cleanly.
- **Unique, non-guessable form links**: `/crs` and `/nda` redirect
  (server-side) to `/crs/<id>` / `/nda/<id>`, where `<id>` is a JWT signed
  by the backend (`LINK_SECRET`). No `exp` claim — links don't expire.
  Stateless: validity is proven by signature, not a DB lookup. A `FormLink`
  row is still written per issued link, purely for audit
  (issued/used timestamps).
- **Database**: Postgres on Supabase. Tables: `ContactSubmission`,
  `FormLink`, `CrsSubmission`, `NdaSubmission`. Schema applied and verified
  live (see "Supabase/Prisma quirks" below for how, since the normal CLI
  path didn't work in this environment).
- **Contact form → personalized CRS link**: `POST /api/contact` saves every
  submission (business/collaboration/career), notifies the internal inbox
  (`FORM_EMAIL`) for all three, and for business/collaboration only, mints
  a CRS link carrying the contact's DB id and emails it to the submitter.
  Opening that link pre-fills the CRS form (name → point of contact,
  project description, project type from service checkboxes, timeline).
- **Security cleanup**: the leaked `PUBLIC_RESEND_API_KEY` (client-exposed)
  is gone from the site entirely — email sending moved to the backend with
  a private `RESEND_API_KEY`. The three old `+server.ts` Resend routes were
  deleted. `env.example` no longer has a real key.
- **Real bugs found and fixed during testing** (not hypothetical — each was
  actually triggered and confirmed fixed):
  1. Unhandled promise rejection in `/api/links` was crashing the *entire*
     backend process on any DB hiccup, taking down every other in-flight
     request too. Fixed with proper try/catch on every route + a global
     Express error-handling middleware as a safety net.
  2. Site had an infinite redirect loop (`/crs` → `/crs/undefined` → `/crs`
     → ...) whenever the backend failed to issue a link. Fixed — `/crs` and
     `/nda` now return a proper 503 instead of redirecting to a broken URL.
  3. Contact form's privacy-consent checkbox was wired to the wrong form's
     data object on 2 of 3 tabs (pre-existing bug, unrelated to this
     session's changes) — fixed.
  4. Contact form always showed "submitted successfully" even when the
     request failed (pre-existing) — fixed, now checks the response.
  5. `tsc` build wasn't copying the `.docx` templates into `dist/` — fixed
     the build script.
  6. Resend SDK doesn't throw on API-level failures (bad domain, etc.) —
     it returns `{ error }` silently, which looked like success. Fixed in
     `mail.ts` to check and throw explicitly.
  7. Logo images in emails showed as broken — Gmail (and others) block
     base64 `data:` URI images. Fixed by switching to a CID inline
     attachment (`LOGO_ATTACHMENT` in `emailTemplates.ts`, referenced via
     `cid:indq-logo` in the HTML) — the standard, reliable way to embed
     images in email.
  8. CRS "Signature" field was always blank — the form tracked it in its
     data model and sent it, but had no actual input, silently overriding
     the backend's fallback-to-name behavior with an empty string. Fixed
     by having the form send `formData.name` as the signature value (a
     typed name isn't a real signature anyway).
  9. Reopening a CRS link always rebuilt the form from just the original
     contact-form fields (name/description/services/timeline), ignoring
     anything filled in on a previous CRS visit. Fixed —
     `getCrsPrefill` now checks for an existing `CrsSubmission` first and
     returns its full field set if found, so reopening shows exactly what
     was last submitted.

- **`indq.in` domain verified in Resend** — confirmed working with a real
  key (`RESEND_API_KEY` in `.env`), sending from `no-reply@indq.in`.
  Delivery double-checked against Resend's own logs (not just "the API
  call succeeded") — genuinely `delivered` per Amazon SES for every real
  address tested. One bounce found, traced to a typo'd email address
  (`shivamrajdubye@` vs `shivamrajdubey@`) in a real test submission, not
  a bug in the system.
- **Prefill expanded further**: sign-off Name field, organization name
  appended to Point of Contact (e.g. "Name (Org)"), and referral source
  appended too ("— found us via Website").
- **CRS submission no longer hands the PDF straight to the browser** — it's
  emailed instead (client gets it as an attachment, BCC'd to
  `INTERNAL_BCC_EMAIL`; internal-only notification with attachment if no
  contact is linked). A `GET /api/crs/:id/pdf` endpoint still exists
  (regenerates the exact PDF on demand from the saved DB fields, not stored
  as a blob) but isn't surfaced anywhere on the site — the post-submit
  screen is just a confirmation message now, per later direction to drop
  the on-screen download option and rely on email only.
- **CRS invite email rewritten** to match a real example of how Krishna
  writes these by hand: "Dear {name}," → references their organization →
  an "About INDQ" credentials paragraph (ISO 13485:2016, 75+ MedTech
  innovations, 40+ patents) → CRS form as the main call-to-action (kept
  self-serve, per decision) → sign-off with Krishna's actual signature
  image (downloaded from a real email, embedded via CID same as the logo).
  NDA intentionally not mentioned in this email, per instruction.
- **NDA prefill gap resolved** — every NDA field is about the *client's*
  company (legal name, address, signatory), not INDQ's, so there was
  nothing for Krishna to prefill from his side. What we *do* already have
  for leads that came through the Contact form: organization name and
  contact person. `NdaSubmission` gained a `contactSubmissionId` (it never
  had one), `/nda` now accepts `?contact=<id>` to issue a prefilled link
  (company name/short name, signatory name), and the internal
  enquiry-notification email Krishna already gets now includes a
  "Generate a pre-filled NDA link" convenience link for business/
  collaboration leads — no separate admin tool needed. Verified end-to-end.
- **48h reminder logic verified directly** (not just code review) — backdated
  a test contact 50 hours and ran the checker: it correctly found the
  overdue contact, attempted the reminder, and — critically — did **not**
  mark `reminderSentAt` when the send failed, so it retries next cycle
  instead of silently giving up.

## AWS Lambda deployment (backend is live)

`indq-backend` is deployed and reachable in production, on the AWS account
used for the SmileGuide project (admin credentials the user provided
directly in chat — flagged as shared/risky at the time, user said to use it
anyway). Account: `564208780098`, region `ap-south-1` (Mumbai), CLI profile
`indq`.

- **Two container images**, built by CodeBuild (no local Docker available)
  from `Dockerfile.lambda`, pushed to ECR repo
  `564208780098.dkr.ecr.ap-south-1.amazonaws.com/indq-backend`:
  - `:main` — the full Express app, unmodified `app.listen()` code, fronted
    by the **AWS Lambda Web Adapter** (`/opt/extensions/lambda-adapter`)
    which translates API Gateway events to plain HTTP for it. Function:
    `indq-backend-main`.
  - `:reminder` — a true Lambda handler (`lambdaReminderHandler.ts`) that
    just calls `checkAndSendCrsReminders()`. Function: `indq-backend-reminder`.
- **Public entry point is API Gateway (HTTP API)**, not a Lambda Function
  URL. A Function URL was tried first and consistently returned `403
  AccessDeniedException` at AWS's edge auth layer — confirmed via
  CloudWatch (zero invocations ever reached the function, so it wasn't an
  app bug) even with a correctly-configured public resource policy and
  significant wait for propagation. Never resolved; pivoted to API Gateway,
  which worked immediately. If this recurs, don't sink more time into
  Function URL troubleshooting — go straight to API Gateway.
  - API: `indq-backend-api` (`ye49m4unx0`), `$default` stage, `$default`
    route (catch-all), `AWS_PROXY` integration → `indq-backend-main`.
  - **Live URL: `https://ye49m4unx0.execute-api.ap-south-1.amazonaws.com`**
    — this is what `indq-website`'s `PUBLIC_BACKEND_URL` must point to in
    production (the site code appends `/api/...` itself).
- **Reminder scheduling**: EventBridge Scheduler rule
  `indq-backend-crs-reminder`, `rate(30 minutes)`, invokes
  `indq-backend-reminder` directly (not via API Gateway). The in-process
  `setInterval` in `index.ts` is disabled on Lambda via
  `DISABLE_IN_PROCESS_REMINDER_SCHEDULER=true` (baked into the `:main`
  image) since a frozen-between-invocations Lambda can't run a JS interval
  reliably.
- **IAM roles created**: `indq-backend-codebuild-role` (CodeBuild →
  CloudWatch Logs + ECR push/pull), `indq-backend-lambda-role` (both
  Lambda functions' execution role → just CloudWatch Logs, nothing else —
  DB access is over the public internet via Supabase's pooler, no VPC
  needed), `indq-backend-scheduler-role` (EventBridge Scheduler →
  `lambda:InvokeFunction` on `indq-backend-reminder` only).
- **Real build bugs found and fixed getting this working** (the Dockerfiles
  had never actually been build-tested before — no local Docker in this
  environment):
  1. `buildspec.yml` had `echo Building main (HTTP API) image...` —
     unquoted parentheses break `/bin/sh` (CodeBuild's shell). Quoted the
     strings.
  2. Both Dockerfiles ran `npm install` (which triggers `postinstall: prisma
     generate`) *before* `COPY prisma ./prisma` — `prisma generate` had no
     schema file to read. Fixed by copying `prisma/` before `npm install`
     in both `Dockerfile` and `Dockerfile.lambda`. This means the plain
     `Dockerfile` (for a non-Lambda host like Render) was equally broken
     and is now fixed too.
  3. `prisma.config.ts` requires `DATABASE_URL` to resolve even for
     `prisma generate` (which never actually connects to the DB) — there's
     no real `.env` at build time in CI. Fixed with a placeholder
     `DATABASE_URL` set via `ENV` in the build stage only; the real value
     is injected as a Lambda environment variable at deploy time and
     overrides it at runtime.
  4. Prisma warned it couldn't detect the OpenSSL version and would
     default to `openssl-1.1.x` (wrong for Debian bookworm's OpenSSL 3) —
     added an explicit `openssl` package install.
- **Verified end-to-end after deploy**: `GET /health` → `200 {"status":"ok"}`
  through API Gateway; `POST /api/links` → real JWT returned, confirming a
  DB write (`FormLink` row) succeeds from the Lambda container; manually
  invoked `indq-backend-reminder` directly → `200`, clean CloudWatch logs,
  confirming DB connectivity from that function too.

### Domain: `indq.in` vs `www.indq.in`

Checked the live site directly (`curl -I https://indq.in`): the apex domain
`indq.in` 308-redirects to **`www.indq.in`**, which is the actual canonical
domain Vercel serves (Cloudflare sits in front of both). Confirmed via
`main` branch's current live state that `/crs` and `/nda` both 404 there —
i.e. `srd` genuinely isn't live yet, this isn't just a guess.

This mattered for CORS: `ALLOWED_ORIGINS` was originally set to
`https://indq.in` only, but a browser on `www.indq.in` sends
`Origin: https://www.indq.in` on client-side fetches (Contact/CRS/NDA
forms) — that would've been silently rejected by the backend's CORS check
the moment this went live. Fixed on both Lambda functions:
- `ALLOWED_ORIGINS=https://indq.in,https://www.indq.in` (main only, reminder
  doesn't serve HTTP so doesn't need this)
- `SITE_URL=https://www.indq.in` (both functions — this is what gets used
  to build the CRS/NDA links emailed to clients, so it should point at the
  canonical domain rather than one that immediately redirects)

### Real bug hit right after going live: CRS/NDA submission → 500

First real submission attempt on the deployed backend failed with a 500.
CloudWatch showed the actual cause immediately:
`LibreOffice 7.4 - Fatal Error: The application cannot be started. User
installation could not be completed.` — Lambda's filesystem is read-only
outside `/tmp`, but `soffice` defaults to writing its profile/cache under
`$HOME`, which on Lambda isn't writable.

Fixed in `src/lib/fillTemplate.ts`: pass
`-env:UserInstallation=file://<tmpDir>/libreoffice-profile` and set
`HOME=<tmpDir>` for the `soffice` child process, using the same per-request
tmp directory that already gets cleaned up after each conversion. Rebuilt
via CodeBuild, deployed to both Lambda functions (`update-function-code`
with the new `:main`/`:reminder` image digests), and verified for real: a
live CRS submission through the production API Gateway URL returned
`emailSent: true`, and Resend's own logs confirm both the client
confirmation email and the internal notification show `last_event:
delivered` — not just a 200 from our own API.

This didn't show up in any of the earlier `/health` or `/api/links`
smoke tests because neither of those touches LibreOffice — only actual
CRS/NDA submission (PDF generation) does. Worth remembering if something
"works" in a smoke test but fails on a real submission again: check
whether the smoke test actually exercised the code path that failed.

### Production email routing (3 real addresses, replacing the test ones)

User specified three real addresses and their exact purposes:
- **`career@indq.in`** (`FORM_EMAIL`) — receives the internal notification
  for every query (business/collaboration/career, all types) and 48h
  reminders. **User originally said `carrier@indq.in`** — sent a real test
  through the live API and it hard-bounced (`550 No Such User Here`,
  permanent). Confirmed with the user it should be `career@indq.in`
  instead (matches the domain's existing mailbox convention, already used
  as the `.env.example` placeholder from earlier in the session) — fixed
  everywhere and re-verified delivered.
- **`indqstudio@gmail.com`** (`INTERNAL_BCC_EMAIL`) — BCC'd on every
  client-facing email (CRS invite, CRS/NDA confirmations).
- **`business@indq.in`** (`MAIL_REPLY_TO`, new env var — reply-to support
  didn't exist in `mail.ts` before this) — every system email still sends
  `From: no-reply@indq.in`, but a human replying now lands on a real,
  monitored inbox instead of a dead one. Applied uniformly to every email
  in `sendMail()` rather than threaded through each call site.

All three verified end-to-end on the live production API (not just code
review): a real contact-form submission was posted through
`https://ye49m4unx0.execute-api.ap-south-1.amazonaws.com/api/contact`, and
Resend's own email log was checked directly —
`to: career@indq.in`, `bcc: indqstudio@gmail.com`,
`reply_to: business@indq.in`, all `last_event: delivered`.

### Still to do (deployment)

- Since `PUBLIC_BACKEND_URL` was dropped in favor of hardcoding the backend
  URL directly in `indq-website/src/lib/backendUrl.js` (per user request —
  no Vercel env var needed), that part is done and needs no further Vercel
  configuration.
- **Merge `srd` into `main`** (or otherwise get Vercel to deploy `srd`) —
  none of this session's site-side work (CRS/NDA pages, Contact form
  rewrite, hardcoded backend URL) is live at `indq.in` / `www.indq.in` yet,
  confirmed directly (see above) even though the backend now is.
- Once that's done, `www.indq.in/crs` and `www.indq.in/nda` should work for
  real — test end-to-end before considering this closed.

## Pending / blocked on external setup

- **Old leaked Resend key** (`re_b13QYSot...`, still live on `main` branch,
  full-access, was still being used as of this session) — flagged as
  urgent to rotate/revoke in the Resend dashboard, independent of anything
  else. Not yet done by the user.
- **`srd` branch not yet merged to `main`** — see "Still to do (deployment)"
  above.
- ~~`FORM_EMAIL`/`INTERNAL_BCC_EMAIL` pointed at a testing address~~ — done.
  Now real production addresses: `FORM_EMAIL=career@indq.in`,
  `INTERNAL_BCC_EMAIL=indqstudio@gmail.com`, plus a new
  `MAIL_REPLY_TO=business@indq.in`. See "Production email routing" above
  for the full story (including the `carrier`→`career` typo caught via a
  real hard bounce). Set in both places that matter: local `.env` and both
  Lambda functions' environment variables — they're independent copies,
  not shared, so a future change needs updating in both.

## Supabase/Prisma quirks hit in this environment (useful if it recurs)

- Supabase's **direct** connection host (`db.<ref>.supabase.co:5432`)
  resolves IPv6-only — unreachable from this sandbox's network. Use the
  **Connection Pooler** host instead (`aws-0-<region>.pooler.supabase.com`,
  port `6543`, username `postgres.<project-ref>`).
- Prisma 7 removed `url` from `schema.prisma`'s `datasource` block —
  connection config now lives in `prisma.config.ts` (CLI/migrations) and is
  passed via `@prisma/adapter-pg`'s `PrismaPg` constructor (app runtime).
- Prisma's CLI schema-engine binary was unreliable/hanging against the
  pooler in this specific sandbox (inconsistent — sometimes hung, sometimes
  failed with a PgBouncer prepared-statement error). The **app runtime**
  path (`@prisma/adapter-pg` + plain `pg`) was reliable throughout. Worked
  around by generating the migration SQL offline
  (`prisma migrate diff --from-empty --to-schema ... --script`, needs no
  live DB connection) and applying it directly via a raw `pg` client, then
  manually seeding `_prisma_migrations` so `prisma migrate deploy` will
  recognize it as applied later (e.g. in Docker/production, where the
  engine binary should behave normally).
- `sslmode=require` in the connection string string itself gets treated as
  an alias for `verify-full` (strict cert checking) by this `pg` version,
  which fights with an explicit `ssl: { rejectUnauthorized: false }` passed
  in code. Fix: don't put `sslmode=require` in the URL at all: keep only
  `?pgbouncer=true`, and set `ssl: { rejectUnauthorized: false }` in
  `src/lib/db.ts` instead.

## Where things live (no secrets repeated here — check the files directly)

- `indq-backend/.env` — `DATABASE_URL`, `RESEND_API_KEY`, `MAIL_FROM`,
  `FORM_EMAIL`, `INTERNAL_BCC_EMAIL`, `CRS_REMINDER_HOURS`, `SITE_URL`,
  `LINK_SECRET`, `SOFFICE_BIN`. Gitignored — see `.env.example` for the
  full list of required vars with placeholder values.
- `indq-website` has no backend-related `.env` var anymore — the live
  backend URL is hardcoded in `src/lib/backendUrl.js` (see Architecture
  above).
- `indq-backend/README.md` — full technical reference, kept current.
- **Production env vars** (not in git, not in local `.env` either) live on
  the two Lambda functions themselves: `aws lambda get-function-configuration
  --function-name indq-backend-main --profile indq --region ap-south-1
  --query Environment` (same for `indq-backend-reminder`). Update with
  `aws lambda update-function-configuration --function-name <name>
  --environment file://path/to/env.json ...` — the full `Variables` object
  is replaced wholesale, not merged, so re-fetch first if changing just one
  key.

## Session 2 (2026-09-04): site went live, post-launch bugs, deploy trouble

**`srd` merged into `main` and verified live.** `www.indq.in/crs` and
`www.indq.in/nda` both confirmed working end-to-end on the real domain
(redirect → backend-issued JWT link → 200). Note the site's canonical
domain is `www.indq.in`, not the apex `indq.in` (which 308-redirects to
`www`) — already accounted for in `SITE_URL`/`ALLOWED_ORIGINS` (see the
domain section above).

**Contact form UX overhaul**, driven by real user-reported problems after
launch:
- Submissions were slow (multiple DB writes + emails on the backend) with
  zero visual feedback — added a spinner + "Submitting..." button state,
  then a full-screen overlay with backdrop blur while the request is in
  flight.
- Real bug: form fields stayed editable and re-submittable *during* a
  submission — only the button was disabled, not the inputs. Fixed by
  wrapping each tab's fields in `<fieldset disabled={isSubmitting}>`,
  which locks every descendant control in one shot.
- Replaced the blocking `alert()` on success with a dedicated thank-you
  screen (swaps out the entire tabs+form area, not just an inline
  message) — shows a direct contact email (`business@indq.in`), a 5-second
  auto-redirect-to-home countdown, and a "Go to Home now" button to skip
  the wait.
- Real bug: after building the thank-you screen, it rendered correctly but
  stayed off-screen — the page was still scrolled to wherever the Submit
  button was (often near the bottom), and the thank-you screen renders up
  near the nav. Fixed with `window.scrollTo({ top: 0, behavior: "smooth" })`
  the moment it appears.
- **CORS fix for local dev**: local dev also hits the live AWS backend
  (per the earlier decision to hardcode `BACKEND_URL` instead of using a
  Vercel env var), but `ALLOWED_ORIGINS` only allowed the production
  domains — added `http://localhost:5173` so `npm run dev` actually works
  for testing.
- Svelte gotcha hit while building the thank-you screen: wrapping ~1000
  lines of pre-existing form markup in a new outer `{#if}/{:else}` block
  is fragile — a `{:else}` has to sit at the exact point where the
  original content's own HTML tags are still balanced, not wherever seems
  logical. Two independent `{#if x}...{/if}` / `{#if !x}...{/if}` blocks
  (instead of one `{#if x}...{:else}...{/if}`) turned out much safer for
  wrapping a large pre-existing block without touching its internals —
  bisect by temporarily stripping the wrapper to confirm the original
  content is still valid on its own before assuming the bug is inside it.

**Unresolved: Vercel isn't auto-deploying the last few pushes to `main`.**
Confirmed for real, not assumed:
- `git log origin/main` shows the latest commits genuinely on GitHub.
- The live site (`www.indq.in/Contact`) still serves an *older* build —
  checked via a marker that only exists in the newer code (old CSS class
  `w-28` present, new class `w-40` absent; `fieldset` absent entirely).
- Response headers rule out caching as the cause: `x-vercel-cache: MISS`,
  `cf-cache-status: DYNAMIC`, `Age: 0` — Vercel itself is actively serving
  the old build, this isn't a stale CDN edge cache.
- This is the **second** deploy in a row that didn't go live automatically
  (the very first merge, for the CRS/NDA launch, *did* deploy correctly —
  something changed after that).
- No Vercel CLI/dashboard access from this environment (`vercel whoami`
  confirms logged out, no token available) — could not diagnose further.
  **Next session: check the Vercel dashboard directly** — (1) did the
  deployment for the latest commit fail or not trigger at all, (2) is
  `main` actually the configured Production Branch, (3) is the
  GitHub↔Vercel webhook/integration still connected. Don't assume a push
  is live without checking — verify against the actual served HTML like
  above.

**"Mani's chatbot changes"**: user asked to check a `mani` branch for
chatbot work. Searched exhaustively — no commits by anyone named
Mani/MANIKANTA anywhere in `indq-website`'s git history on any branch
(local or the `shivam-dubey-byte/indq-website` remote), and no
`mani`-named branch exists on that remote either. Important structural
note found along the way: **`origin` for this repo is a personal fork
(`shivam-dubey-byte/indq-website`)**, not the org's original repo — old
merge commits reference `https://github.com/IndqStudio/Indq-Website` as
the upstream. A `gh api repos/IndqStudio/Indq-Website/branches` call
returned 404 (likely a permissions/access issue, or the repo name/org
differs from what's in old commit messages — not confirmed which). User
said the branch should exist "in indq-website only" — **not yet resolved,
needs the user to confirm the exact remote/org this branch lives on**
before it can be found and reviewed.

## Continuing from a different machine

Both repos are pushed to GitHub (see repo URLs in each project's git
remote). What's **not** in git, on purpose (secrets): the actual `.env`
files in both `indq-website` and `indq-backend`. To pick this up elsewhere:

1. `git clone` both repos.
2. `npm install` in each.
3. Copy `.env.example` to `.env` in each and fill in real values — ask
   whoever has them (the Supabase connection string, Resend API key,
   `LINK_SECRET`, etc.) rather than expecting them in git.
4. `indq-backend`: run `npm run build` then `npm run dev` (or `node
   dist/index.js`). Needs LibreOffice locally for PDF conversion to work
   (see README) — or just use Docker (`docker build`/`docker run`), which
   installs it automatically.
5. `indq-website`: `npm run dev`.
6. The Postgres database itself needs no setup — it's already live on
   Supabase, reachable from anywhere with the connection string from step 3.

## Session 3 (2026-09-04): Cloudflare Pages migration + chatbot — HANDOFF

This section is written to be self-contained for whoever (or whichever
Claude session, on whichever machine) picks this up next. Read this whole
section before doing anything — the repo situation is genuinely confusing
and it's easy to push to the wrong place.

### The repo situation (read this first)

- **`shivam-dubey-byte/indq-website`** — the repo this whole project has
  been worked in all session. This is a **fork**, not the original repo.
  All my (Claude's) work all session — CRS/NDA forms, Contact form UX
  fixes — is on this fork's `main` and `srd` branches (identical to each
  other).
- Old commit messages reference an upstream **`IndqStudio/Indq-Website`**
  org repo. **This is not accessible from the `shivam-dubey-byte` GitHub
  account** — confirmed both via `git ls-remote` (returns "Repository not
  found") and `gh api orgs/IndqStudio/repos` (404), despite that account
  having `repo`/`read:org` token scopes. Either it was renamed/deleted, or
  this account was never actually a member — not determined. **Don't
  waste time trying to reach it again without new information from the
  user about where it actually is.**
- **Mani (MANIKANTA)** did chatbot work — visible via merge commits
  referencing `IndqStudio/Manikanta-24-08-chatbot` — that ended up, one
  way or another, on **`shivam-dubey-byte/indq-website`'s `test` branch**.
  That branch also has an adapter migration (Vercel → Cloudflare Pages)
  and, as of a commit `a50846b`, **already has my/Claude's Contact-form
  work merged into it too**. In other words: **`test` is the one branch on
  the accessible fork that has everything, from everyone, combined and
  verified working.** `main`/`srd` only have the Contact-form/CRS/NDA side
  of the work, not the chatbot.
- Verified this directly, not assumed: I deployed `test` (commit `12f0f94`)
  to Cloudflare Pages and confirmed both the chatbot and the CRS/NDA link
  flow work on that exact build.

### Cloudflare Pages — current state

- Account: `smileguide@indq.in`, Account ID `95e50905f5a623b12ab20647964f842a`.
- Existing Pages project: **`indq-website`**, live at
  `https://indq-website.pages.dev` — created by Mani shortly before this
  handoff (not by me).
- **Not Git-connected yet** (`Git Provider: No` in `wrangler pages project
  list`). All deploys so far, including mine, were manual
  `wrangler pages deploy .svelte-kit/cloudflare --project-name=indq-website
  --branch=testing` uploads — nothing auto-deploys yet. (Note the
  `--branch=testing` flag: this project's *Production* environment is
  keyed to a branch literally named `testing`, not `main` — that's a
  wrangler/Pages branch label on the deployment, unrelated to which git
  branch you're actually deploying from locally.)
- **Custom domain not attached.** `indq.in`/`www.indq.in` still point at
  Vercel. Only the default `indq-website.pages.dev` subdomain currently
  serves this Cloudflare Pages project. Attaching the real domain here is
  the step that actually cuts over live production traffic — treat it as
  a deliberate, confirmed action, not something to do casually while
  setting other things up.
- Secret already set on the Pages project (production environment):
  `N8N_WEBHOOK_URL`, currently pointed at an **ngrok tunnel**
  (`lubricate-uncross-ducktail.ngrok-free.dev`) — the user confirmed using
  this "for now" despite `env.example` in the repo explicitly warning
  against tunnel URLs in production (ephemeral — breaks the moment
  whoever's running that tunnel stops). **Get a real n8n production
  webhook URL and swap this out** (`echo "<url>" | wrangler pages secret
  put N8N_WEBHOOK_URL --project-name=indq-website`, then redeploy —
  secrets only apply to deployments made *after* they're set, not
  retroactively).
- `wrangler` CLI is already authenticated on *this* Windows machine only
  (OAuth token at `C:\Users\dento\AppData\Roaming\xdg.config\.wrangler\config\default.toml`).
  **This will not carry over to a different machine** — run `wrangler
  login` there first (opens a browser OAuth flow against the
  `smileguide@indq.in` Cloudflare account).

### The actual outstanding tasks, in order

1. **Merge `test` into `main`** on `shivam-dubey-byte/indq-website` (the
   fork) so `main` has the fully-converged code — chatbot + Contact form
   fixes together. This is what the user actually wants "auto-deploy on
   push to main" to trigger.
2. **Connect Cloudflare Pages' Git integration** to
   `shivam-dubey-byte/indq-website`, production branch = `main`. This step
   is **dashboard-only** — `wrangler pages project` has no CLI command for
   connecting a repo (only `list`/`create`/`delete`), it needs a GitHub
   OAuth authorization done by a human in a browser. Cloudflare dashboard
   → Pages → the `indq-website` project → Settings → Git integration (or
   similar, exact wording may vary by Cloudflare's current UI) → connect
   to the fork, production branch `main`.
3. Verify a real push to `main` actually triggers an automatic build +
   deploy (don't assume — check `wrangler pages deployment list
   --project-name=indq-website` for a new entry with `Source` matching the
   commit, same rigor as everything else in this log).
4. Only after that's confirmed working: decide on attaching the
   `indq.in`/`www.indq.in` custom domain to this Cloudflare Pages project,
   which cuts production traffic over from Vercel. Get explicit
   confirmation before doing this — it's a live, user-visible change.
5. Swap the ngrok `N8N_WEBHOOK_URL` for a real production n8n webhook once
   one exists.
6. Decide what happens to the Vercel side: the last two pushes to
   `main`/`srd` on the fork mysteriously stopped auto-deploying there
   (see the Session 2 section above) — root cause never found (no Vercel
   dashboard/CLI access from this environment). Once Cloudflare Pages is
   confirmed as the real production target, this may just become moot —
   but worth explicitly deciding rather than leaving two half-working
   deploy pipelines around.
7. **Still open from earlier sessions, unrelated to this migration**:
   rotate the leaked Resend key (`re_b13QYSot...`) in the Resend
   dashboard — flagged repeatedly, still live, and as of this session it
   was even re-added to local `.env` (as `PUBLIC_RESEND_API_KEY`, unused
   by any current code) at the user's explicit instruction. Rotating it
   doesn't require touching that dead `.env` entry, just revoking it in
   Resend's dashboard.

8. **CORS on `indq-backend` is temporarily wide open.** During this
   migration, the Cloudflare Pages domain (`indq-website.pages.dev`, plus
   whatever custom domain eventually gets attached) needed to work without
   updating an allowlist every time the deploy target changed, so
   `ALLOWED_ORIGINS` was cleared to `""` on both Lambda functions — the
   existing fallback in `src/index.ts` (`origin: allowedOrigins.length > 0
   ? allowedOrigins : true`) then reflects *any* origin, verified with a
   preflight request from a made-up domain that got allowed too. This was
   an explicit, deliberate choice ("allow all for now"), not an oversight
   — but it should be tightened back to a real allowlist
   (`indq.in`,`www.indq.in`, the final Cloudflare domain, `localhost:5173`)
   once the domain situation settles, rather than left open indefinitely.

### Secrets note

Following this log's existing convention: not repeating actual secret
values here. `indq-website/.env` on this machine has real working values
for everything mentioned above (including the ngrok `N8N_WEBHOOK_URL`) —
it's gitignored, so it won't come along with a fresh `git clone`. Either
copy that file over manually or ask the user for the values again.

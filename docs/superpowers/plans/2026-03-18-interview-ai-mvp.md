# Interview AI MVP Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable MVP of a C-end interview preparation web service that accepts a JD, generates a prep pack, runs a text interview, and produces a review report with a study outline.

**Architecture:** Build a modular monolith in Next.js App Router. Keep UI, service orchestration, data access, and external integrations separated so the product can launch quickly now and split services later if needed.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase Auth/Postgres/Storage, Prisma, Vitest, Testing Library, Playwright

---

## Planned File Structure

### App and Shared Infrastructure

- `package.json` — dependencies and scripts
- `next.config.ts` — Next.js config
- `tsconfig.json` — TypeScript config
- `postcss.config.mjs` — PostCSS config
- `eslint.config.mjs` — lint config
- `src/app/layout.tsx` — app shell
- `src/app/page.tsx` — homepage route
- `src/app/(app)/prep/[jobTargetId]/page.tsx` — prep pack route
- `src/app/(app)/interview/[sessionId]/page.tsx` — text interview route
- `src/app/(app)/review/[sessionId]/page.tsx` — review route
- `src/app/api/job-targets/route.ts` — create job target
- `src/app/api/prep-packs/route.ts` — create prep pack
- `src/app/api/interview-sessions/route.ts` — create session
- `src/app/api/interview-turns/route.ts` — append turn
- `src/app/api/review-reports/route.ts` — create review report
- `src/lib/env.ts` — validated env access
- `src/lib/db.ts` — Prisma client
- `src/lib/supabase/server.ts` — Supabase server client
- `src/lib/supabase/browser.ts` — Supabase browser client

### Feature Slices

- `src/features/job-target/models/job-target.ts`
- `src/features/job-target/view-models/use-job-target-form.ts`
- `src/features/job-target/components/job-target-form.tsx`
- `src/features/job-target/views/job-target-page.tsx`
- `src/features/prep-pack/models/prep-pack.ts`
- `src/features/prep-pack/components/prep-pack-view.tsx`
- `src/features/prep-pack/views/prep-pack-page.tsx`
- `src/features/interview/models/interview-session.ts`
- `src/features/interview/models/interview-turn.ts`
- `src/features/interview/view-models/use-interview-session.ts`
- `src/features/interview/components/interview-chat.tsx`
- `src/features/interview/views/interview-page.tsx`
- `src/features/review/models/review-report.ts`
- `src/features/review/components/review-report-view.tsx`
- `src/features/review/views/review-page.tsx`

### Server Modules

- `src/server/services/jd-analysis-service.ts`
- `src/server/services/role-profile-service.ts`
- `src/server/services/prep-pack-service.ts`
- `src/server/services/interview-orchestrator-service.ts`
- `src/server/services/answer-evaluator-service.ts`
- `src/server/services/review-report-service.ts`
- `src/server/repositories/job-target-repository.ts`
- `src/server/repositories/prep-pack-repository.ts`
- `src/server/repositories/interview-session-repository.ts`
- `src/server/repositories/review-report-repository.ts`
- `src/server/integrations/llm-client.ts`
- `src/server/integrations/supabase-storage.ts`

### Database and Tests

- `prisma/schema.prisma`
- `prisma/migrations/*`
- `src/test/setup.ts`
- `src/features/job-target/view-models/use-job-target-form.test.ts`
- `src/server/services/jd-analysis-service.test.ts`
- `src/server/services/prep-pack-service.test.ts`
- `src/server/services/interview-orchestrator-service.test.ts`
- `src/server/services/review-report-service.test.ts`
- `tests/e2e/home-to-prep.spec.ts`

## Task 1: Bootstrap the Next.js Workspace

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/env.ts`
- Test: `npm run lint`

- [ ] **Step 1: Create the failing smoke check**

```ts
// src/app/page.tsx
export default function HomePage() {
  throw new Error("homepage not implemented");
}
```

- [ ] **Step 2: Run app build to verify the workspace is incomplete**

Run: `npm run build`  
Expected: FAIL with missing config and missing dependencies

- [ ] **Step 3: Add the minimal Next.js scaffold**

```ts
// src/app/page.tsx
export default function HomePage() {
  return <main>Interview AI</main>;
}
```

- [ ] **Step 4: Add base scripts and dependencies**

Required scripts:
- `dev`
- `build`
- `lint`
- `test`
- `test:e2e`

- [ ] **Step 5: Add the global style foundation**

Define CSS variables for:
- page background
- surface background
- text color
- accent color

- [ ] **Step 6: Verify the scaffold**

Run: `npm run build`  
Expected: PASS with generated `.next` output

- [ ] **Step 7: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs src/app src/lib .gitignore
git commit -m "chore: scaffold nextjs interview ai app"
```

## Task 2: Add Supabase, Prisma, and Core Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/browser.ts`
- Create: `.env.example`
- Test: `src/server/services/jd-analysis-service.test.ts`

- [ ] **Step 1: Write the failing schema contract test**

```ts
it("requires job targets, sessions, turns, and review reports", () => {
  const models = ["JobTarget", "RoleProfile", "PrepPack", "InterviewSession", "InterviewTurn", "ReviewReport"];
  expect(models.length).toBe(6);
});
```

- [ ] **Step 2: Run the unit test**

Run: `npm run test -- jd-analysis-service.test.ts`  
Expected: FAIL because test runner and schema do not exist yet

- [ ] **Step 3: Implement the Prisma schema**

Include models:
- `User`
- `JobTarget`
- `RoleProfile`
- `PrepPack`
- `InterviewSession`
- `InterviewTurn`
- `ReviewReport`

Use JSON columns for:
- `keySkills`
- `responsibilities`
- `dimensions`
- `highFreqQuestions`
- `evaluationPoints`
- `studyOutline`
- `evaluation`

- [ ] **Step 4: Add Supabase and Prisma clients**

```ts
// src/lib/db.ts
export const db = globalThis.__db ?? new PrismaClient();
```

- [ ] **Step 5: Generate and apply the initial migration**

Run: `npx prisma migrate dev --name init_core_schema`  
Expected: PASS with a new migration directory

- [ ] **Step 6: Verify the schema**

Run: `npx prisma validate`  
Expected: `The schema at prisma/schema.prisma is valid`

- [ ] **Step 7: Commit**

```bash
git add prisma src/lib .env.example
git commit -m "feat: add supabase and core interview schema"
```

## Task 3: Implement Authentication and App Shell

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Modify: `src/app/layout.tsx`
- Create: `src/components/app-shell.tsx`
- Create: `src/components/user-menu.tsx`
- Test: `tests/e2e/home-to-prep.spec.ts`

- [ ] **Step 1: Write the failing auth expectation**

```ts
test("anonymous user can open home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("生成面试准备包")).toBeVisible();
});
```

- [ ] **Step 2: Run the e2e check**

Run: `npm run test:e2e -- home-to-prep.spec.ts`  
Expected: FAIL because no routes or UI copy exist yet

- [ ] **Step 3: Add a minimal auth model**

Rules:
- anonymous users can generate a prep pack
- authenticated users can save history
- use Supabase magic link or email OTP

- [ ] **Step 4: Render the app shell**

Required layout areas:
- top nav
- role support banner
- sign-in entry

- [ ] **Step 5: Protect only history-saving actions**

Unauthenticated behavior:
- can analyze a JD
- can view current result
- must sign in before saving long-term records

- [ ] **Step 6: Verify auth shell flow**

Run: `npm run test:e2e -- home-to-prep.spec.ts`  
Expected: PASS for homepage visibility and sign-in entry presence

- [ ] **Step 7: Commit**

```bash
git add src/app/login src/app/auth src/app/layout.tsx src/components tests/e2e
git commit -m "feat: add supabase auth shell"
```

## Task 4: Build the JD Input Flow

**Files:**
- Create: `src/features/job-target/models/job-target.ts`
- Create: `src/features/job-target/view-models/use-job-target-form.ts`
- Create: `src/features/job-target/components/job-target-form.tsx`
- Create: `src/features/job-target/views/job-target-page.tsx`
- Create: `src/app/api/job-targets/route.ts`
- Create: `src/server/repositories/job-target-repository.ts`
- Create: `src/server/services/jd-analysis-service.ts`
- Test: `src/features/job-target/view-models/use-job-target-form.test.ts`
- Test: `src/server/services/jd-analysis-service.test.ts`

- [ ] **Step 1: Write the failing form validation test**

```ts
it("rejects blank jd input", async () => {
  const result = validateJobTargetInput({ rawJD: "" });
  expect(result.success).toBe(false);
});
```

- [ ] **Step 2: Run the form test**

Run: `npm run test -- use-job-target-form.test.ts`  
Expected: FAIL because validation does not exist

- [ ] **Step 3: Implement form state and validation**

Validate:
- JD is non-empty
- text length is above a minimum threshold
- optional domain selection matches supported domains

- [ ] **Step 4: Implement JD normalization service**

Output shape:

```ts
type JobTargetDraft = {
  normalizedTitle: string;
  domain: "product" | "operations" | "technical";
  level: string;
  keySkills: string[];
  responsibilities: string[];
};
```

- [ ] **Step 5: Persist the job target**

API response must return:
- `jobTargetId`
- `normalizedTitle`
- `domain`

- [ ] **Step 6: Verify end-to-end JD creation**

Run: `npm run test -- use-job-target-form.test.ts jd-analysis-service.test.ts`  
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/features/job-target src/app/api/job-targets src/server/repositories/job-target-repository.ts src/server/services/jd-analysis-service.ts
git commit -m "feat: add jd intake and normalization"
```

## Task 5: Generate the Prep Pack

**Files:**
- Create: `src/features/prep-pack/models/prep-pack.ts`
- Create: `src/features/prep-pack/components/prep-pack-view.tsx`
- Create: `src/features/prep-pack/views/prep-pack-page.tsx`
- Create: `src/app/(app)/prep/[jobTargetId]/page.tsx`
- Create: `src/app/api/prep-packs/route.ts`
- Create: `src/server/services/role-profile-service.ts`
- Create: `src/server/services/prep-pack-service.ts`
- Create: `src/server/repositories/prep-pack-repository.ts`
- Test: `src/server/services/prep-pack-service.test.ts`

- [ ] **Step 1: Write the failing prep pack service test**

```ts
it("returns role summary, high-frequency questions, and study outline", async () => {
  const prepPack = await generatePrepPack(mockJobTarget);
  expect(prepPack.roleSummary).toBeTruthy();
  expect(prepPack.highFreqQuestions.length).toBeGreaterThan(0);
  expect(prepPack.studyOutline.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the service test**

Run: `npm run test -- prep-pack-service.test.ts`  
Expected: FAIL because prep generation is missing

- [ ] **Step 3: Implement role profile transformation**

Map JD output into:
- dimensions
- must-have skills
- nice-to-have skills
- question themes

- [ ] **Step 4: Implement prep pack generation**

Prep pack must include:
- role summary
- high-frequency questions
- evaluation points
- study outline

- [ ] **Step 5: Render the prep pack page**

The page must include a clear CTA:
- `开始 10 分钟文字面试`

- [ ] **Step 6: Verify prep pack generation**

Run: `npm run test -- prep-pack-service.test.ts`  
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/features/prep-pack src/app/'(app)'/prep src/app/api/prep-packs src/server/services/role-profile-service.ts src/server/services/prep-pack-service.ts src/server/repositories/prep-pack-repository.ts
git commit -m "feat: add prep pack generation flow"
```

## Task 6: Implement the Text Interview Session

**Files:**
- Create: `src/features/interview/models/interview-session.ts`
- Create: `src/features/interview/models/interview-turn.ts`
- Create: `src/features/interview/view-models/use-interview-session.ts`
- Create: `src/features/interview/components/interview-chat.tsx`
- Create: `src/features/interview/views/interview-page.tsx`
- Create: `src/app/(app)/interview/[sessionId]/page.tsx`
- Create: `src/app/api/interview-sessions/route.ts`
- Create: `src/app/api/interview-turns/route.ts`
- Create: `src/server/services/interview-orchestrator-service.ts`
- Create: `src/server/services/answer-evaluator-service.ts`
- Create: `src/server/repositories/interview-session-repository.ts`
- Test: `src/server/services/interview-orchestrator-service.test.ts`

- [ ] **Step 1: Write the failing session orchestration test**

```ts
it("asks a bounded number of questions and tracks the dimension", async () => {
  const session = await createInterviewSession(mockJobTarget);
  expect(session.totalRounds).toBe(6);
  expect(session.currentRound).toBe(1);
});
```

- [ ] **Step 2: Run the orchestration test**

Run: `npm run test -- interview-orchestrator-service.test.ts`  
Expected: FAIL because the interview services do not exist

- [ ] **Step 3: Implement session creation**

Session defaults:
- mode = `text`
- totalRounds = 6
- status = `active`

- [ ] **Step 4: Implement turn evaluation and follow-up policy**

Rules:
- at most one lightweight follow-up per weak answer
- keep each turn tagged with one evaluation dimension
- persist every question and answer before generating the next prompt

- [ ] **Step 5: Render the interview page**

The page must show:
- question text
- answer box
- current dimension
- round count

- [ ] **Step 6: Verify interview progression**

Run: `npm run test -- interview-orchestrator-service.test.ts`  
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/features/interview src/app/'(app)'/interview src/app/api/interview-sessions src/app/api/interview-turns src/server/services/interview-orchestrator-service.ts src/server/services/answer-evaluator-service.ts src/server/repositories/interview-session-repository.ts
git commit -m "feat: add text interview workflow"
```

## Task 7: Build the Review Report and Study Outline Refresh

**Files:**
- Create: `src/features/review/models/review-report.ts`
- Create: `src/features/review/components/review-report-view.tsx`
- Create: `src/features/review/views/review-page.tsx`
- Create: `src/app/(app)/review/[sessionId]/page.tsx`
- Create: `src/app/api/review-reports/route.ts`
- Create: `src/server/services/review-report-service.ts`
- Create: `src/server/repositories/review-report-repository.ts`
- Test: `src/server/services/review-report-service.test.ts`

- [ ] **Step 1: Write the failing review aggregation test**

```ts
it("aggregates turns into strengths, gaps, and next study plan", async () => {
  const report = await buildReviewReport(mockSessionTurns);
  expect(report.strengths.length).toBeGreaterThan(0);
  expect(report.gaps.length).toBeGreaterThan(0);
  expect(report.nextStudyPlan.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the review test**

Run: `npm run test -- review-report-service.test.ts`  
Expected: FAIL because the report service does not exist

- [ ] **Step 3: Implement report aggregation**

Aggregate from saved turns:
- strengths
- gaps
- missed points
- communication notes
- next study plan

- [ ] **Step 4: Render the review page**

The page must show:
- summary evaluation
- weak-point focus
- a clear CTA to start another targeted interview

- [ ] **Step 5: Verify the review flow**

Run: `npm run test -- review-report-service.test.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/features/review src/app/'(app)'/review src/app/api/review-reports src/server/services/review-report-service.ts src/server/repositories/review-report-repository.ts
git commit -m "feat: add review report and study outline refresh"
```

## Task 8: Add End-to-End Coverage and Product Hardening

**Files:**
- Modify: `tests/e2e/home-to-prep.spec.ts`
- Create: `tests/e2e/prep-to-interview.spec.ts`
- Create: `tests/e2e/interview-to-review.spec.ts`
- Modify: `src/lib/env.ts`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Write the full user-journey tests**

Required journeys:
- homepage to prep pack
- prep pack to interview
- interview completion to review

- [ ] **Step 2: Run the e2e suite**

Run: `npm run test:e2e`  
Expected: FAIL until missing interactions are fixed

- [ ] **Step 3: Harden environment validation**

Validate:
- Supabase URL
- Supabase anon key
- Supabase service role key
- database URL
- LLM API key

- [ ] **Step 4: Add README setup instructions**

Document:
- local setup
- env variables
- Prisma migration flow
- Supabase project setup
- test commands

- [ ] **Step 5: Verify the full MVP**

Run: `npm run lint`  
Expected: PASS

Run: `npm run test`  
Expected: PASS

Run: `npm run test:e2e`  
Expected: PASS

Run: `npm run build`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add tests/e2e src/lib/env.ts .env.example README.md
git commit -m "chore: harden mvp flows and documentation"
```

## Review Notes

The ideal workflow is to run a plan-document review loop before execution. In this session, that loop is blocked by the current tool policy because spawning subagents is not authorized unless explicitly requested by the user. If subagent review becomes available, review this plan against:

- `docs/superpowers/specs/2026-03-18-interview-ai-design.md`
- `docs/superpowers/plans/2026-03-18-interview-ai-mvp.md`

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-18-interview-ai-mvp.md`. Ready to execute?

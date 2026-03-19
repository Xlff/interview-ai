# MVP Finish Auth History Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the remaining MVP gaps by connecting real Supabase login, saving authenticated interview history, and letting users start another interview focused on weak areas.

**Architecture:** Keep the current modular monolith structure. Authentication stays in Next.js with Supabase SSR clients, history is owned at the interview-session layer so global JD caching still works, and weak-area retries are modeled as a focused interview-session variant instead of a new product branch.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase SSR/Auth, Prisma 7, PostgreSQL, Vitest 4, Playwright

---

## Planned File Structure

### Auth and Shell

- `src/app/login/page.tsx` — real Magic Link submit UI
- `src/app/auth/callback/route.ts` — exchange auth code for session
- `src/app/layout.tsx` — resolve authenticated user for the shell
- `src/components/app-shell.tsx` — accept auth-aware props
- `src/components/user-menu.tsx` — render login/history state
- `src/server/repositories/auth-user-repository.ts` — local user upsert by Supabase email

### Session Ownership and History

- `prisma/schema.prisma` — add `InterviewSession.userId`, `InterviewSession.focusDimensions`
- `prisma/migrations/<timestamp>_session_history_focus/migration.sql` — session ownership migration
- `src/server/repositories/interview-session-repository.ts` — persist authenticated owner and focused retries
- `src/server/repositories/history-repository.ts` — list saved sessions for the current user
- `src/app/(app)/history/page.tsx` — history route
- `src/features/history/models/history-entry.ts` — typed history rows
- `src/features/history/components/history-list.tsx` — history UI
- `src/features/history/views/history-page.tsx` — page container

### Focused Retry

- `src/server/services/interview-orchestrator-service.ts` — bias question sequence by focus dimensions
- `src/features/review/components/review-report-view.tsx` — add focused retry CTA
- `src/features/prep-pack/components/start-interview-button.tsx` — allow optional focus dimensions when creating sessions
- `src/app/api/interview-sessions/route.ts` — accept optional focused retry payload

### Tests

- `src/server/repositories/history-repository.test.ts`
- `src/server/repositories/auth-user-repository.test.ts`
- `src/server/services/interview-orchestrator-service.test.ts`
- `tests/e2e/auth-history.spec.ts`
- `tests/e2e/interview-to-review.spec.ts`

## Task 1: Add the failing tests for remaining MVP behavior

**Files:**
- Create: `src/server/repositories/auth-user-repository.test.ts`
- Create: `src/server/repositories/history-repository.test.ts`
- Modify: `src/server/services/interview-orchestrator-service.test.ts`
- Create: `tests/e2e/auth-history.spec.ts`
- Modify: `tests/e2e/interview-to-review.spec.ts`

- [ ] **Step 1: Write the failing auth-user test**

```ts
it("upserts a local user by authenticated email", async function () {
  const user = await getOrCreateLocalUserByEmail("tester@example.com");
  expect(user.email).toBe("tester@example.com");
});
```

- [ ] **Step 2: Write the failing history test**

```ts
it("lists interview sessions for the authenticated user only", async function () {
  const items = await listHistoryEntriesForUser("user-id");
  expect(items.every((item) => item.userId === "user-id")).toBe(true);
});
```

- [ ] **Step 3: Write the failing focused retry test**

```ts
it("prioritizes focus dimensions when building a retry session", function () {
  const draft = buildInterviewSessionDraft(prepPack, ["工程质量"]);
  expect(draft.currentTurn.dimension).toBe("工程质量");
});
```

- [ ] **Step 4: Write the failing e2e contract**

```ts
test("history page asks anonymous users to log in", async ({ page }) => {
  await page.goto("/history");
  await expect(page.getByText("登录后查看你的练习记录")).toBeVisible();
});
```

- [ ] **Step 5: Run the targeted tests and watch them fail**

Run:
- `pnpm test src/server/repositories/auth-user-repository.test.ts src/server/repositories/history-repository.test.ts src/server/services/interview-orchestrator-service.test.ts`
- `pnpm test:e2e tests/e2e/auth-history.spec.ts tests/e2e/interview-to-review.spec.ts`

Expected:
- FAIL because the repositories, focused retry support, and history route do not exist yet

## Task 2: Implement real Supabase login and auth-aware shell

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/auth/callback/route.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/app-shell.tsx`
- Modify: `src/components/user-menu.tsx`
- Create: `src/server/repositories/auth-user-repository.ts`

- [ ] **Step 1: Add the local user repository**

Implement:
- `getOrCreateLocalUserByEmail(email: string)`
- `findLocalUserByEmail(email: string)`

- [ ] **Step 2: Replace the placeholder login page with a real form**

Behavior:
- email input is enabled
- submit uses Supabase browser client
- `signInWithOtp` with `emailRedirectTo=/auth/callback?next=/history`

- [ ] **Step 3: Exchange the auth code in the callback route**

Use:
- `createSupabaseServerClient()`
- `supabase.auth.exchangeCodeForSession(code)`

- [ ] **Step 4: Resolve auth state in the root layout**

Pass:
- `isAuthenticated`
- `userEmail`

into the app shell

- [ ] **Step 5: Re-run targeted auth tests**

Run:
- `pnpm test src/server/repositories/auth-user-repository.test.ts`
- `pnpm test:e2e tests/e2e/auth-history.spec.ts --grep "history page asks anonymous users to log in"`

Expected:
- PASS

## Task 3: Persist authenticated interview history and add the history page

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_session_history_focus/migration.sql`
- Modify: `src/server/repositories/interview-session-repository.ts`
- Create: `src/server/repositories/history-repository.ts`
- Create: `src/app/(app)/history/page.tsx`
- Create: `src/features/history/models/history-entry.ts`
- Create: `src/features/history/components/history-list.tsx`
- Create: `src/features/history/views/history-page.tsx`
- Modify: `src/app/api/interview-sessions/route.ts`

- [ ] **Step 1: Extend the Prisma schema**

Add to `InterviewSession`:
- `userId String? @db.Uuid`
- `focusDimensions Json?`
- relation to `User`

- [ ] **Step 2: Create and apply the migration**

Run:
- `pnpm exec prisma migrate dev --name session_history_focus`

Expected:
- PASS with new migration files

- [ ] **Step 3: Save the authenticated owner when creating a session**

Flow:
- read authenticated Supabase user in the route
- upsert local user by email
- pass `userId` into `createInterviewSession`

- [ ] **Step 4: Add the history repository**

Return:
- session id
- title
- status
- created at
- latest review availability
- focus mode label if present

- [ ] **Step 5: Render the history page**

Anonymous state:
- show login CTA

Authenticated state:
- show recent sessions with links to continue or view review

- [ ] **Step 6: Re-run history tests**

Run:
- `pnpm test src/server/repositories/history-repository.test.ts`
- `pnpm test:e2e tests/e2e/auth-history.spec.ts`

Expected:
- PASS

## Task 4: Add focused retry interviews from review gaps

**Files:**
- Modify: `src/server/services/interview-orchestrator-service.ts`
- Modify: `src/server/repositories/interview-session-repository.ts`
- Modify: `src/app/api/interview-sessions/route.ts`
- Modify: `src/features/prep-pack/components/start-interview-button.tsx`
- Modify: `src/features/review/components/review-report-view.tsx`

- [ ] **Step 1: Extend the session draft and route contract**

Add optional:
- `focusDimensions?: string[]`

- [ ] **Step 2: Bias question ordering toward focused dimensions**

Rule:
- matching dimensions first
- then the existing prep-pack order fallback

- [ ] **Step 3: Add the review CTA**

Label:
- `围绕短板再练一轮`

Behavior:
- extract weak dimensions from the completed session
- create a focused retry session

- [ ] **Step 4: Re-run focused retry tests**

Run:
- `pnpm test src/server/services/interview-orchestrator-service.test.ts`
- `pnpm test:e2e tests/e2e/interview-to-review.spec.ts --grep "focused retry"`

Expected:
- PASS

## Task 5: Full verification and cleanup

**Files:**
- Modify: `.env.example` if auth callback variables need documenting
- Modify: any affected tests or docs

- [ ] **Step 1: Run unit and integration tests**

Run:
- `pnpm test`

Expected:
- PASS

- [ ] **Step 2: Run lint**

Run:
- `pnpm lint`

Expected:
- PASS

- [ ] **Step 3: Run production build**

Run:
- `pnpm build`

Expected:
- PASS

- [ ] **Step 4: Run e2e**

Run:
- `pnpm test:e2e`

Expected:
- PASS

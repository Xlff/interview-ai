# Content Layer Refactor Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hard-coded prep-pack generation with a database-driven content layer backed by role templates, role configs, a question bank, and 27 seeded mock JDs.

**Architecture:** Extend the existing Prisma schema with content-layer models, seed the database with operator-managed role and question data, and refactor prep-pack generation to query and rank content instead of branching on hard-coded domains. Keep JD parsing deterministic and add an internal LLM provider interface only as a boundary, not a live dependency.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma 7, PostgreSQL via Supabase, Vitest 4, Playwright

---

## Planned File Structure

### Database and Seed Layer

- `prisma/schema.prisma` — extend schema with content-layer models
- `prisma/migrations/<timestamp>_content_layer_refactor/migration.sql` — create new tables and indexes
- `prisma/seed.ts` — seed dictionaries, templates, question bank items, and 27 mock JDs

### Shared Models and Helpers

- `src/features/content/models/content-layer.ts` — shared app-side types for templates, question items, and mock JDs
- `src/lib/list-item-key.ts` — stable list-key helper already added for duplicate-safe rendering

### Repository Layer

- `src/server/repositories/content-layer-repository.ts` — read skills, templates, configs, questions, and mock JDs
- `src/server/repositories/prep-pack-repository.ts` — refactor to use content-layer repository instead of hard-coded generators

### Service Layer

- `src/server/services/jd-analysis-service.ts` — refactor keyword matching toward dictionary-driven matching
- `src/server/services/role-profile-service.ts` — replace hard-coded branches with template/config resolution
- `src/server/services/prep-pack-service.ts` — replace hard-coded question lists with ranked selection and assembly
- `src/server/services/question-selection-service.ts` — recall and rank question bank items
- `src/server/services/content-layer-service.ts` — resolve best matching role template and config
- `src/server/services/llm-provider.ts` — define the internal LLM provider interface

### Tests

- `src/server/services/jd-analysis-service.test.ts` — extend to cover alias-based skill matching
- `src/server/services/role-profile-service.test.ts` — refactor toward template resolution tests
- `src/server/services/prep-pack-service.test.ts` — refactor toward content-layer-driven prep-pack tests
- `src/server/services/question-selection-service.test.ts` — new tests for filtering, ranking, and de-duplication
- `src/server/services/content-layer-service.test.ts` — new tests for template fallback logic
- `src/server/services/mock-jd-regression.test.ts` — regression coverage for all 27 mock JDs

## Task 1: Extend the Prisma Schema for the Content Layer

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_content_layer_refactor/migration.sql`
- Test: `prisma/schema.contract.test.ts`

- [ ] **Step 1: Write the failing schema contract assertions**

Add expectations for these new models:

```ts
const models = [
  "SkillDictionary",
  "RoleTemplate",
  "RoleConfig",
  "QuestionBankItem",
  "MockJobDescription",
];
```

- [ ] **Step 2: Run the schema contract test**

Run: `pnpm test prisma/schema.contract.test.ts`  
Expected: FAIL because the new models do not exist yet

- [ ] **Step 3: Add the new Prisma models**

Implement models for:

- `SkillDictionary`
- `RoleTemplate`
- `RoleConfig`
- `QuestionBankItem`
- `MockJobDescription`

Recommended relationships:

- `RoleConfig.roleTemplateId -> RoleTemplate.id`
- soft references by string arrays or JSON arrays for skill ids and tags in the first version

- [ ] **Step 4: Generate a migration**

Run: `pnpm exec prisma migrate dev --name content_layer_refactor`  
Expected: PASS with a new migration directory

- [ ] **Step 5: Re-run the schema contract test**

Run: `pnpm test prisma/schema.contract.test.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations prisma/schema.contract.test.ts
git commit -m "feat: add content layer schema"
```

## Task 2: Seed Dictionaries, Templates, Question Bank Items, and 27 Mock JDs

**Files:**
- Create: `prisma/seed.ts`
- Create: `src/features/content/models/content-layer.ts`
- Test: `src/server/services/mock-jd-regression.test.ts`

- [ ] **Step 1: Write the failing regression test for seeded mock JDs**

Start with a narrow failing contract:

```ts
expect(mockJDs).toHaveLength(27);
expect(mockJDs.every((item) => item.rawJD.length > 20)).toBe(true);
```

- [ ] **Step 2: Run the regression test**

Run: `pnpm test src/server/services/mock-jd-regression.test.ts`  
Expected: FAIL because no seeded mock data exists yet

- [ ] **Step 3: Create shared content-layer types**

Define app-side types for:

- `SkillDictionaryRecord`
- `RoleTemplateRecord`
- `RoleConfigRecord`
- `QuestionBankItemRecord`
- `MockJobDescriptionRecord`

- [ ] **Step 4: Implement the seed file**

Seed:

- skills and aliases for technical, product, and operations domains
- 9 role templates
- 9 role configs
- enough question bank items to cover all role families and levels
- 27 mock JDs:
  - 9 technical
  - 9 product
  - 9 operations

- [ ] **Step 5: Run the seed script**

Run: `pnpm exec prisma db seed` or the configured equivalent  
Expected: PASS and populate local Supabase/Postgres

- [ ] **Step 6: Re-run the mock JD regression test**

Run: `pnpm test src/server/services/mock-jd-regression.test.ts`  
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add prisma/seed.ts src/features/content/models/content-layer.ts src/server/services/mock-jd-regression.test.ts package.json
git commit -m "feat: seed content layer data"
```

## Task 3: Add Content-Layer Repositories and Template Resolution

**Files:**
- Create: `src/server/repositories/content-layer-repository.ts`
- Create: `src/server/services/content-layer-service.ts`
- Test: `src/server/services/content-layer-service.test.ts`

- [ ] **Step 1: Write the failing template-resolution tests**

Cover:

- exact `domain + normalizedTitle + level` match
- fallback from `高级` to `中级`
- fallback from unknown title to domain-level template

- [ ] **Step 2: Run the content-layer service test**

Run: `pnpm test src/server/services/content-layer-service.test.ts`  
Expected: FAIL because the repository and service do not exist yet

- [ ] **Step 3: Implement the repository layer**

Add read methods for:

- `getSkillDictionariesByDomain`
- `getRoleTemplatesByDomain`
- `getRoleConfigByTemplateId`
- `getQuestionBankItems`
- `getMockJobDescriptions`

- [ ] **Step 4: Implement the template-resolution service**

Add methods for:

- `resolveRoleTemplate`
- `resolveRoleConfig`

Keep logic deterministic and small.

- [ ] **Step 5: Re-run the tests**

Run: `pnpm test src/server/services/content-layer-service.test.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/server/repositories/content-layer-repository.ts src/server/services/content-layer-service.ts src/server/services/content-layer-service.test.ts
git commit -m "feat: add content layer repositories"
```

## Task 4: Refactor JD Analysis to Use Dictionary Matching

**Files:**
- Modify: `src/server/services/jd-analysis-service.ts`
- Modify: `src/server/services/jd-analysis-service.test.ts`

- [ ] **Step 1: Write the failing alias-based parsing tests**

Add tests for:

- alias matching like `react.js -> React`
- multiple aliases mapping to stable skill names
- fallback behavior when no dictionary matches are found

- [ ] **Step 2: Run the JD analysis tests**

Run: `pnpm test src/server/services/jd-analysis-service.test.ts`  
Expected: FAIL because parsing still depends on hard-coded arrays only

- [ ] **Step 3: Refactor the parsing service**

Keep the same public function signature:

```ts
export function analyzeJobDescription(input: JobTargetInput): JobTargetDraft
```

But shift matching logic toward seeded dictionaries and stable canonical skill names.

- [ ] **Step 4: Re-run the JD analysis tests**

Run: `pnpm test src/server/services/jd-analysis-service.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/server/services/jd-analysis-service.ts src/server/services/jd-analysis-service.test.ts
git commit -m "feat: refactor jd analysis to use dictionaries"
```

## Task 5: Add Question Recall and Ranking

**Files:**
- Create: `src/server/services/question-selection-service.ts`
- Create: `src/server/services/question-selection-service.test.ts`

- [ ] **Step 1: Write the failing ranking tests**

Cover:

- domain match is required
- title match increases rank
- level match increases rank
- skill overlap outranks otherwise similar questions
- primary questions outrank follow-up questions

- [ ] **Step 2: Run the ranking tests**

Run: `pnpm test src/server/services/question-selection-service.test.ts`  
Expected: FAIL because the service does not exist yet

- [ ] **Step 3: Implement recall and ranking**

Add a small service that:

- filters by domain
- scores by title, level, and skill-tag overlap
- returns ranked items

- [ ] **Step 4: Re-run the ranking tests**

Run: `pnpm test src/server/services/question-selection-service.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/server/services/question-selection-service.ts src/server/services/question-selection-service.test.ts
git commit -m "feat: add question selection service"
```

## Task 6: Refactor Role-Profile and Prep-Pack Generation

**Files:**
- Modify: `src/server/services/role-profile-service.ts`
- Modify: `src/server/services/role-profile-service.test.ts`
- Modify: `src/server/services/prep-pack-service.ts`
- Modify: `src/server/services/prep-pack-service.test.ts`
- Modify: `src/server/repositories/prep-pack-repository.ts`

- [ ] **Step 1: Write the failing prep-pack generation tests**

Cover:

- selected questions come from the question bank
- evaluation points are de-duplicated from selected items
- study outline reflects role template and skill match context
- different mock JDs produce different selected question sets

- [ ] **Step 2: Run the affected tests**

Run: `pnpm test src/server/services/role-profile-service.test.ts src/server/services/prep-pack-service.test.ts`  
Expected: FAIL because services still rely on hard-coded branches

- [ ] **Step 3: Refactor role-profile generation**

Make role-profile generation template-driven instead of branch-driven.

- [ ] **Step 4: Refactor prep-pack generation**

Make prep-pack generation accept:

- resolved role template
- resolved role config
- ranked question items

Remove domain-specific hard-coded question arrays.

- [ ] **Step 5: Refactor the prep-pack repository**

Load:

- the job target
- the resolved role template
- the role config
- ranked questions

Then upsert:

- `RoleProfile`
- `PrepPack`

- [ ] **Step 6: Re-run the prep-pack tests**

Run: `pnpm test src/server/services/role-profile-service.test.ts src/server/services/prep-pack-service.test.ts`  
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/server/services/role-profile-service.ts src/server/services/role-profile-service.test.ts src/server/services/prep-pack-service.ts src/server/services/prep-pack-service.test.ts src/server/repositories/prep-pack-repository.ts
git commit -m "feat: refactor prep pack generation to use content layer"
```

## Task 7: Add the Internal LLM Provider Interface

**Files:**
- Create: `src/server/services/llm-provider.ts`
- Test: `src/server/services/prep-pack-service.test.ts`

- [ ] **Step 1: Write the failing interface-usage expectation**

Add a narrow test that proves prep-pack generation can accept an optional provider dependency without requiring a real model call.

- [ ] **Step 2: Run the test**

Run: `pnpm test src/server/services/prep-pack-service.test.ts`  
Expected: FAIL because no provider interface exists yet

- [ ] **Step 3: Define the interface**

Add methods:

- `enhancePrepPack`
- `rewriteSelectedQuestions`
- `generateFollowUpQuestion`
- `evaluateInterviewAnswer`
- `generateReviewReport`

Add a no-op or deterministic stub implementation for now.

- [ ] **Step 4: Re-run the test**

Run: `pnpm test src/server/services/prep-pack-service.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/server/services/llm-provider.ts src/server/services/prep-pack-service.test.ts
git commit -m "feat: add llm provider interface"
```

## Task 8: Full Verification and Cleanup

**Files:**
- Verify only

- [ ] **Step 1: Run unit and integration tests**

Run:

```bash
pnpm test
```

Expected: PASS

- [ ] **Step 2: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm build
```

Expected: PASS

- [ ] **Step 4: Run e2e tests**

Run:

```bash
pnpm test:e2e
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: complete content layer refactor"
```

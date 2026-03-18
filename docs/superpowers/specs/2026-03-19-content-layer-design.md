# Interview AI Content Layer Refactor Design

## Overview

This design refactors the current hard-coded JD analysis and prep-pack generation flow into a three-layer content architecture:

1. shared dictionaries and role templates
2. database-backed question bank and role configuration
3. a future LLM provider layer for generation and rewriting

This refactor does not introduce a real LLM integration yet. The goal of this iteration is to replace hard-coded service logic with a data-driven content layer that can be operated, extended, and tested.

## Goals

- Remove hard-coded role templates and prep-pack question lists from service code
- Make prep-pack generation database-driven
- Keep the current deterministic workflow as a stable fallback
- Prepare the system for future LLM integration without coupling business logic to a model SDK
- Seed representative mock JDs for repeatable regression testing and demos

## Non-Goals

- Do not integrate the user's production LLM service in this iteration
- Do not add online web search for question generation
- Do not redesign the interview session or review-report workflow
- Do not build a full vector retrieval or RAG pipeline yet

## Architecture

### Layer 1: Shared dictionaries and role templates

This layer standardizes JD parsing and role normalization.

It includes:

- skill dictionary
- title aliases
- level aliases
- domain keyword mappings
- role templates

Responsibilities:

- normalize JD text into structured job targets
- map raw text to standard skills and titles
- provide stable role dimensions and default themes

### Layer 2: Database-backed question bank and role configuration

This layer stores all operator-managed content.

It includes:

- question bank items
- role configuration
- role-to-skill mappings
- mock JDs for testing and demos

Responsibilities:

- provide queryable interview questions
- store evaluation points and follow-up hints
- define which templates and questions apply to which role and level

### Layer 3: LLM provider interface

This layer is not implemented yet, but the service boundaries must be prepared now.

Responsibilities:

- enhance prep-pack summaries
- rewrite selected questions to fit the exact JD
- generate dynamic follow-up prompts
- evaluate answers and produce richer review summaries

Business services should depend on an internal interface, not a vendor SDK.

## Data Model

### SkillDictionary

Represents a canonical skill concept used across JD parsing, role configuration, and question tagging.

Suggested fields:

- `id`
- `name`
- `aliases` as string array or JSON array
- `domain`
- `category`
- `isActive`
- `createdAt`
- `updatedAt`

Examples:

- `React` with aliases `["react", "react.js"]`
- `Next.js` with aliases `["next", "nextjs", "next.js"]`
- `A/B 测试` with aliases `["ab test", "a/b test", "ab testing"]`

### RoleTemplate

Represents the normalized role skeleton for a domain, title, and level.

Suggested fields:

- `id`
- `domain`
- `normalizedTitle`
- `level`
- `dimensions`
- `defaultQuestionThemes`
- `defaultEvaluationPoints`
- `isActive`
- `createdAt`
- `updatedAt`

Examples:

- `technical / 前端开发工程师 / 初级`
- `product / 产品经理 / 中级`
- `operations / 增长运营经理 / 高级`

### RoleConfig

Represents the operator-managed content strategy for a role template.

Suggested fields:

- `id`
- `roleTemplateId`
- `mustHaveSkillIds`
- `niceToHaveSkillIds`
- `questionSelectionRules`
- `prepPackRules`
- `isActive`
- `createdAt`
- `updatedAt`

Notes:

- `questionSelectionRules` can initially be JSON
- `prepPackRules` can initially be JSON
- this keeps the first implementation simple and extensible

### QuestionBankItem

Represents one reusable question unit.

Suggested fields:

- `id`
- `domain`
- `normalizedTitle`
- `level`
- `dimension`
- `question`
- `questionType`
- `skillTags`
- `evaluationPoints`
- `followUpHints`
- `isActive`
- `createdAt`
- `updatedAt`

Guidelines:

- `questionType` starts with values like `primary` and `follow-up`
- `skillTags` should reference canonical skills by id or stable skill name
- `evaluationPoints` should stay structured and reusable

### MockJobDescription

Represents curated test and demo input data.

Suggested fields:

- `id`
- `domain`
- `normalizedTitle`
- `level`
- `label`
- `rawJD`
- `isSeed`
- `createdAt`
- `updatedAt`

This table is only for seeded content and regression testing. It is not part of user history.

## Prep-Pack Generation Flow

The new flow should be:

1. parse raw JD into `domain`, `normalizedTitle`, `level`, `matchedSkills`, and `matchedResponsibilities`
2. resolve the best `RoleTemplate`
3. load `RoleConfig`
4. query `QuestionBankItem`
5. rank and select top questions
6. assemble `RoleProfile`
7. assemble `PrepPack`

### Step 1: JD parsing

Keep the current rules-based parser in the first version of this refactor.

Changes:

- move hard-coded keyword sets toward seedable dictionaries where reasonable
- keep deterministic fallback behavior
- preserve preferred domain fallback behavior

### Step 2: Role-template resolution

Match by:

- `domain`
- `normalizedTitle`
- `level`

Fallback order:

- exact domain + title + level
- exact domain + title with downgraded level fallback
- exact domain-only fallback

This ensures the system always returns a usable prep pack even when some templates are missing.

### Step 3: Question recall

Recall question bank items by:

- `domain`
- `normalizedTitle`
- `level`
- `dimension`
- `skillTags`

The first implementation should use structured filters only. No vector search is required yet.

### Step 4: Ranking

Use a simple deterministic score:

- domain match is required
- title match adds score
- level match adds score
- skill-tag overlap adds the most score
- primary questions outrank follow-ups

### Step 5: Prep-pack assembly

Generate:

- `roleSummary`
- `highFreqQuestions`
- `evaluationPoints`
- `studyOutline`

In this iteration:

- `roleSummary` should be template-driven
- `highFreqQuestions` should come from the selected question bank items
- `evaluationPoints` should be de-duplicated from selected items plus role defaults
- `studyOutline` should be composed from must-have skills, dimensions, and gaps in JD match coverage

## LLM Provider Interface

Do not call a real model yet. Define interfaces only.

Suggested interface surface:

- `enhancePrepPack`
- `rewriteSelectedQuestions`
- `generateFollowUpQuestion`
- `evaluateInterviewAnswer`
- `generateReviewReport`

### Integration rule

Business services depend on:

- `LLMProvider`

Future adapters may implement:

- `OpenAIProvider`
- `CustomModelProvider`
- `MockLLMProvider`

This keeps the application portable and testable.

## Seed Strategy

This iteration should ship with seed data for:

- technical roles
- product roles
- operations roles

Each role family must include:

- `初级`
- `中级`
- `高级`

Each level must include at least:

- 1 role template
- 1 role config
- several question bank items
- 3 mock JDs

### Required mock JD count

The minimum required seed count is:

- 3 role families
- 3 levels per family
- 3 mock JDs per level

Total:

- `27 mock JDs`

## Mock JD Scope

The initial 27 mock JDs should cover:

### Technical

- 初级前端开发工程师: 3 mock JDs
- 中级前端开发工程师: 3 mock JDs
- 高级前端开发工程师: 3 mock JDs

### Product

- 初级产品经理: 3 mock JDs
- 中级产品经理: 3 mock JDs
- 高级产品经理: 3 mock JDs

### Operations

- 初级运营专员: 3 mock JDs
- 中级增长运营: 3 mock JDs
- 高级增长运营经理: 3 mock JDs

These mock JDs should vary in wording and emphasis so that parsing and recall logic are tested against non-identical descriptions.

## Question Bank Scope

The first seeded bank should stay small but high quality.

Recommendation:

- 12 to 20 primary questions per role family
- split across dimensions and levels
- at least 3 to 5 evaluation points per question where appropriate

This is enough to support deterministic prep-pack generation without pretending to be a full production corpus.

## Service Refactor Plan

### Keep

- `analyzeJobDescription` as the first parser entry point
- existing route and repository flow shape
- current interview and review flow boundaries

### Replace

- hard-coded role profile branches in `role-profile-service`
- hard-coded prep-pack question lists in `prep-pack-service`

### Add

- repositories for dictionaries, templates, configs, and question bank items
- a ranking service for question selection
- a seed pipeline for content-layer data
- a reusable helper for stable de-duplication and selection logic

## Testing Strategy

### Unit tests

Test:

- JD skill matching against aliases
- role-template resolution and fallback
- question recall filters
- ranking and de-duplication
- study-outline assembly

### Integration tests

Test:

- homepage to prep-pack flow using seeded role data
- prep-pack content differs across different mock JDs
- unsupported or low-match JDs still produce fallback output

### Seed regression tests

Test:

- all 27 mock JDs parse successfully
- all 27 mock JDs produce a prep pack
- each prep pack returns at least one question and one study-outline item

## Risks

### Risk: Overfitting to seed content

If seeded data is too narrow, prep packs will look repetitive.

Mitigation:

- vary mock JDs by phrasing, company context, and emphasis
- keep question bank items distributed across multiple dimensions

### Risk: Template explosion

If every role nuance becomes its own template too early, the system becomes hard to manage.

Mitigation:

- keep templates at the role-family and seniority level first
- move nuance into role config and question tags

### Risk: Premature LLM coupling

If provider logic is added too early, failures become harder to debug.

Mitigation:

- keep deterministic data-driven prep-pack generation as the base path
- add model enhancement only after the content layer is stable

## Final Recommendation

Implement the refactor in this order:

1. add new content-layer database models
2. seed role templates, role configs, question bank items, and 27 mock JDs
3. refactor prep-pack generation to use database-driven recall and ranking
4. add an internal LLM provider interface without a live model integration

This gives the product a controllable content foundation now and a clean path to future model-powered enhancement later.

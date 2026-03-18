# Interview AI Web Service Design

## Overview

This project is a C-end interview preparation web service built with Next.js. The first release uses a job description as the primary entry point. The product helps a user:

- paste a JD
- get an interview prep pack
- complete a short text interview
- receive a review report
- receive a personalized study outline

The product should not be implemented as one fully autonomous agent. The recommended architecture is a workflow-driven web application with isolated AI-powered services. Agent-like behavior can be introduced later inside specific modules such as interview follow-up and coaching.

## Product Positioning

### Primary user

- Individual job seekers preparing for interviews

### Primary value

- Identify the user's likely weak points for a target role
- Turn those weak points into an actionable study outline

### MVP scope

- Input: job description text
- Supported domains: product, operations, technical roles
- Main flow: prep first, then simulate interview
- Interview mode: text only

### Explicitly out of scope for MVP

- voice interview
- resume upload and parsing
- B-end recruiter workflows
- community features
- long-running autonomous multi-agent systems

## User Flow

The MVP user flow is:

1. User lands on homepage
2. User pastes a JD and selects role metadata if needed
3. System analyzes the JD and creates a role profile
4. System generates an interview prep pack
5. User starts a 10-minute text interview
6. System asks questions and lightweight follow-ups
7. System generates a review report
8. System generates a personalized study outline
9. User can start another interview focused on weak areas

## Core Pages

### 1. Homepage

Purpose:
- Collect the JD with the shortest possible path
- Explain supported role categories
- Drive the user toward generating a prep pack

Key elements:
- JD text input
- optional role selector or level selector
- primary CTA: generate prep pack
- example role cards for quick start

### 2. Prep Pack Page

Purpose:
- Deliver the first core value immediately
- Show that the system understands the role

Key sections:
- role summary
- high-frequency interview questions
- evaluation dimensions
- personalized study outline
- CTA to start a text interview

### 3. Text Interview Page

Purpose:
- Run a structured interview session

Key sections:
- current question
- answer input
- current evaluation dimension
- round indicator
- optional follow-up prompt

### 4. Review Report Page

Purpose:
- Convert interview performance into actionable feedback

Key sections:
- strengths
- gaps
- missed points
- communication notes
- next study plan

## Architecture Decision

### Recommended approach

Use a single Next.js application with service-layer boundaries.

The system should be workflow-first:

- UI in Next.js App Router
- server-side orchestration in route handlers or server actions
- structured service modules for AI analysis and generation
- persistent storage for sessions, turns, and reports

### Why not build the whole product as one agent

- The product requires consistent outputs across repeated sessions
- Interview quality depends on controllable structure, not open-ended autonomy
- Structured storage and replay are required for iterative improvement
- Future voice support will benefit from deterministic session state

### Where agent-like behavior can be introduced later

- interview follow-up strategy
- coaching and explanation style in the review phase
- study path adaptation based on user history

## Service Modules

### Web App

Responsibilities:
- render pages
- handle user interaction
- display outputs
- manage authenticated sessions

### JD Analysis Service

Responsibilities:
- parse raw JD text
- extract title, domain, seniority, skills, responsibilities
- normalize the JD into a structured target

### Role Profile Service

Responsibilities:
- convert JD analysis into interview dimensions
- define must-have and nice-to-have capabilities
- define likely question themes

### Prep Pack Service

Responsibilities:
- generate a role summary
- generate high-frequency interview questions
- generate evaluation points
- generate the initial study outline

### Interview Orchestrator

Responsibilities:
- create a session
- choose the next question
- decide whether to follow up
- keep the interview inside a defined scope and round count

### Answer Evaluator

Responsibilities:
- evaluate each answer by dimension
- identify omissions and weak signals
- provide input for follow-up and final review

### Review and Study Outline Service

Responsibilities:
- summarize strengths and gaps
- produce an actionable next-step study outline
- connect weak areas to role-specific learning topics

### Domain Packs

Responsibilities:
- hold role-specific heuristics and prompts
- allow later expansion from frontend to broader technical roles
- support future industry-skill-tree selection

## Data Model

### JobTarget

Represents a single user target based on a raw JD.

Suggested fields:
- `id`
- `userId`
- `rawJD`
- `normalizedTitle`
- `domain`
- `level`
- `keySkills`
- `responsibilities`
- `createdAt`

### RoleProfile

Represents the structured interview profile derived from the JD.

Suggested fields:
- `id`
- `jobTargetId`
- `dimensions`
- `mustHaveSkills`
- `niceToHaveSkills`
- `questionThemes`
- `createdAt`

### PrepPack

Represents the generated preparation result.

Suggested fields:
- `id`
- `jobTargetId`
- `roleSummary`
- `highFreqQuestions`
- `evaluationPoints`
- `studyOutline`
- `createdAt`

### InterviewSession

Represents one interview attempt.

Suggested fields:
- `id`
- `jobTargetId`
- `status`
- `mode`
- `totalRounds`
- `currentRound`
- `createdAt`
- `completedAt`

### InterviewTurn

Represents one interview question and answer pair.

Suggested fields:
- `id`
- `sessionId`
- `question`
- `questionType`
- `dimension`
- `userAnswer`
- `evaluation`
- `followUpHint`
- `turnIndex`
- `createdAt`

### ReviewReport

Represents the final review output from a session.

Suggested fields:
- `id`
- `sessionId`
- `strengths`
- `gaps`
- `missedPoints`
- `communicationNotes`
- `nextStudyPlan`
- `createdAt`

## Authentication

### Recommendation

Add authentication in MVP, but keep it minimal.

Recommended behavior:
- allow anonymous first-time exploration when possible
- require sign-in to save prep packs, sessions, and reports
- use email magic link or email OTP first

### Why

- Users need saved history to create a repeated improvement loop
- Forced registration before first value may hurt conversion
- Minimal auth is enough for a C-end MVP

## Backend Shape

### Recommendation

Do not split a separate backend service in MVP.

Use one Next.js codebase for:
- pages
- API entry points
- service orchestration
- database access

### Reasoning

- The main complexity is the AI workflow, not service decomposition
- A separate backend would add deployment and integration cost too early
- A modular monolith is the right tradeoff for MVP

### Internal structure

Suggested server-side structure:

- `app/` for routes and page entry points
- `features/` for MVVM feature slices
- `server/services/` for business orchestration
- `server/repositories/` for data access
- `server/integrations/` for Supabase and LLM providers

## Database and Platform

### Recommendation

Use Supabase for MVP.

Use:
- Supabase Postgres
- Supabase Auth
- Supabase Storage

Potential later use:
- `pgvector` for semantic retrieval and role-skill-tree matching

### Why Supabase fits this product

- unified auth and data model for user-owned interview records
- storage for future resume files
- row-level security for per-user access control
- straightforward fit for a Next.js full-stack app

## Error Handling

The system should fail in clear, recoverable ways.

### JD parsing failure

- show a clear retry state
- allow the user to edit the JD manually
- allow fallback role selection when parsing confidence is low

### AI generation failure

- surface a short user-safe error
- store an internal error state for diagnostics
- retry only idempotent generation steps

### Interview interruption

- persist each interview turn
- allow resume when appropriate
- never lose completed turns

### Unsupported role

- show current supported role families
- still allow a best-effort run if confidence is moderate
- mark low-confidence outputs visibly

## Testing Strategy

### Unit tests

Test:
- JD normalization logic
- role profile transformation
- interview round selection logic
- report aggregation logic

### Integration tests

Test:
- homepage to prep pack flow
- prep pack to interview creation flow
- interview completion to review report flow

### AI contract tests

Test:
- structured output parsing
- required fields in model responses
- fallback behavior on invalid responses

### Manual acceptance tests

Test with representative roles:
- product manager
- operations
- frontend engineer

## Future Extensions

Planned future additions:
- resume upload and parsing
- technical role skill tree selection
- voice interview mode
- adaptive follow-up strategy
- longitudinal user progress tracking

## Final Recommendation

Build the MVP as a workflow-driven Next.js application backed by Supabase. Keep AI capabilities modular and constrained. Do not frame the whole product as a single agent. Add agent-like behavior only inside specific modules after the core product loop is stable.

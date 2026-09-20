# EduPath AI — Engineering Standards & Coding Rules

## 1. Code Quality & Language Standards
- **Strict TypeScript**: Never use `any` unless absolutely necessary for low-level protocol boundaries; define explicit interfaces or types.
- **Next.js App Router**: Use modern App Router conventions with clear separation between Client Components (`'use client'`) and Server Components/Route Handlers.
- **Functional & Composable**: Write small, testable, single-responsibility functions. Keep components modular and reusable.
- **Styling**: Use Tailwind CSS with curated design tokens (dark theme, glassmorphism, accent glows). Avoid raw arbitrary values where design system tokens exist.

## 2. AI & Agent Principles
- **Universal Provider Abstraction**: Always interact with AI through `AIProvider`. Never call Gemini or OpenAI directly from route handlers or UI components.
- **Strict Schema Validation**:
  ```text
  LLM Prompt -> Structured Output -> Zod Schema Validation -> Business Logic -> Database
  ```
- **Fail-Safe Fallbacks**: If an LLM response fails validation after retry, log the error and return a safe, valid fallback structure matching the Zod schema. Never crash the app.
- **Never Fabricate Credentials**: Always check for real API keys in the environment. If missing, fall back to high-fidelity simulated agent intelligence rather than faking fake connections or throwing uncaught runtime exceptions.
- **Evidence-Based AI**: Every agent decision must contain `reason`, `evidence`, and `confidence`. Never output ungrounded assertions like "You are weak in RAG" without citing supporting evaluation or resume data.

## 3. Database & State Management
- **Prisma ORM**: All database interactions must use Prisma models.
- **No Orphaned State**: When an agent adapts a roadmap, the adaptation reason and timestamp must be persisted in `AgentEvent` and `RoadmapAdaptationHistory`.
- **Soft Updates / Versioning**: Keep track of roadmap evolution over time rather than destructively overwriting previous state without a trace.

## 4. Error Handling & Security
- **No Secrets on Client**: Keep all API keys, service accounts, and database secrets strictly server-side.
- **File Upload Protection**: Validate file MIME types (`application/pdf`, `.docx`, `.txt`) and enforce a maximum file size (10 MB).
- **Graceful UI States**: Every asynchronous UI state must handle `loading`, `error`, `empty`, and `success`.

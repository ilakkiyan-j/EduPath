# EduPath AI — System Architecture

## 1. High-Level Architecture Diagram

```text
                            ┌──────────────────────────────┐
                            │    Next.js Frontend (React)   │
                            │ Tailwind + shadcn + Motion   │
                            └──────────────┬───────────────┘
                                           │ API Routes / Server Actions
                                           ▼
                            ┌──────────────────────────────┐
                            │     API & Orchestration      │
                            │      Next.js Route Handlers  │
                            └──────┬────────────────┬──────┘
                                   │                │
            ┌──────────────────────┴──────┐         │
            ▼                             ▼         ▼
  ┌───────────────────┐        ┌───────────────────┐ ┌────────────────────┐
  │   Prisma ORM      │        │ AI Provider Layer │ │ File Ingestion     │
  │ PostgreSQL / DB   │        │ (Gemini / OpenAI) │ │ (PDF, DOCX, TXT)   │
  └───────────────────┘        └─────────┬─────────┘ └────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  ┌───────────────┐              ┌───────────────┐              ┌──────────────────┐
  │ Profile Agent │              │ Gap Agent     │              │ Roadmap Agent    │
  └───────┬───────┘              └───────┬───────┘              └────────┬─────────┘
          │                              │                               │
          ▼                              ▼                               ▼
  ┌───────────────┐              ┌───────────────┐              ┌──────────────────┐
  │Practice Agent │              │Evaluation Agt │              │ Adaptation Agent │
  └───────────────┘              └───────┬───────┘              └────────┬─────────┘
                                         │                               │
                                         └───────────────┬───────────────┘
                                                         ▼
                                               ┌──────────────────┐
                                               │  Learner Memory  │
                                               │  & Agent Events  │
                                               └──────────────────┘
```

## 2. Directory Structure

```text
EduPath/
├── .ai/                       # Comprehensive AI & project documentation
│   ├── PRD.md
│   ├── RULES.md
│   ├── ARCHITECTURE.md
│   ├── AGENTS.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── UI.md
│   ├── EVALUATION.md
│   ├── DEMO.md
│   └── logs/
│       └── development.log
├── prisma/                    # Database models and seed scripts
│   ├── schema.prisma
│   └── seed.ts
├── public/                    # Static assets and demo samples
├── src/
│   ├── ai/                    # AI Agent & Provider Engine
│   │   ├── providers/         # Universal provider (Gemini, OpenAI, Fallback)
│   │   ├── agents/            # 8 Specialized Agent implementations
│   │   ├── schemas/           # Zod validation schemas
│   │   └── prompts/           # Versioned system prompts
│   ├── app/                   # Next.js App Router pages and API routes
│   │   ├── api/               # Server-side API endpoints
│   │   ├── (auth)/            # Login & onboarding flows
│   │   ├── dashboard/         # Main learner command center
│   │   ├── skills/            # Skill graph & gap visualizer
│   │   ├── roadmap/           # Adaptive timeline & diffs
│   │   ├── tasks/             # Coding task runner & submission
│   │   ├── progress/          # Analytics & confidence charts
│   │   ├── projects/          # Gap-closing project studio
│   │   ├── chat/              # Conversational assistant
│   │   └── agent/             # Transparent agent timeline & logs
│   ├── components/            # Reusable UI widgets, badges, modals
│   ├── lib/                   # Database client, auth utilities, file helpers
│   └── types/                 # Shared TypeScript interfaces
└── package.json
```

## 3. Data Flow & Autonomous Feedback Loop

1. **Intake**: Learner uploads resume; server extracts raw text and executes `ProfileAgent`.
2. **Analysis**: Profile is checked against `Role` target; `SkillGapAgent` scores each required skill and classifies gaps into 5 levels with evidence.
3. **Synthesis**: `RoadmapAgent` constructs a directed dependency order of milestones, respecting the learner's weekly available hours.
4. **Execution**: Learner begins a topic and asks `PracticeAgent` for a task with starter code and test criteria.
5. **Evaluation**: Learner submits solution; `EvaluationAgent` generates structured score, verified strengths, and specific failure points.
6. **Adaptation**: If performance demonstrates repeated weakness (score < 60% or critical gap), `AdaptationAgent` halts subsequent advanced topics, injects prerequisite modules, and registers an `AgentEvent` with reason and evidence.
7. **Explanation**: Learner asks in Chat why the path changed; `AssistantChatAgent` retrieves the `AgentEvent` and evaluation history to give a grounded, evidence-backed answer.

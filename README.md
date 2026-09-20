# EduPath AI — The Adaptive AI Career Agent

> *"Your AI career agent that learns how you learn."*

---

## 🌟 The Core Pitch

> **Most learning platforms ask what course you want to take. EduPath starts somewhere else: it observes what you already know, identifies what you're missing, gives you practical work to prove your skills, evaluates your performance, and continuously rebuilds your learning roadmap around your weaknesses.**

EduPath is **not** a static LMS, **not** a course aggregator, and **not** a generic chatbot. It is an **adaptive career agent** revolving around this continuous feedback cycle:

```text
UNDERSTAND
    ↓
IDENTIFY
    ↓
PLAN
    ↓
LEARN
    ↓
PRACTICE
    ↓
EVALUATE
    ↓
ADAPT  <─── (Dynamically modifies upcoming milestones based on evidence)
    ↓
REPEAT
```

### The Non-Negotiable Rule
> **Every meaningful learner evaluation must be capable of changing what the learner should do next.**

---

## 🚀 Adaptive Feedback Loop Demo

You can execute this complete, end-to-end loop in under 3 minutes:

1. **Launch App**: Open `http://localhost:3000/` and click **"Launch Demo Dashboard"** (pre-loaded with aspiring AI Engineer *Ilakkiyan*).
2. **Observe Extracted Skills**: Extracted from resume with literal quote citations (e.g. *Node.js, Express, React, PostgreSQL, introductory LLM API*).
3. **Inspect Skill Gap Analysis & Dependency DAG (`/skills`)**:
   - Trace prerequisite links: `Python → LLMs → RAG → Tool Calling → AI Agents`.
   - Critical gaps spotted: **Tool Calling**, **Error Handling & Reliability**, **AI Agents**.
4. **Inspect Initial Roadmap (`/roadmap`)**:
   - Week 1: *Advanced RAG & Vector Retrieval* (Completed)
   - Week 2: *Tool Calling & Agentic Execution* (Active)
   - Week 3: *Multi-Agent Systems & Collaboration* (Pending)
   - Week 4: *Production AI Deployment* (Pending)
5. **Start Practice Task (`/tasks`)**:
   - Open **"Build a Resilient Weather Tool Agent"**.
   - Click **"⚡ Load Flawed Solution (Adaptation Trigger)"** (simulates an incomplete implementation that calls the API but lacks runtime schema validation and crashes on timeouts).
   - Click **"Submit for Autonomous AI Evaluation"**.
6. **Watch Evaluation & Dynamic Adaptation**:
   - **Evaluation Agent** scores the submission **54%**, flags unhandled network crashes and missing Zod schemas.
   - **Adaptation Agent** intervenes in real time:
     - ⚡ Injects **Week 2: Tool Reliability & Defensive Engineering** (Remedial).
     - ⚡ Injects **Week 3: Agent Evaluation & Guardrails** (Prerequisite).
     - ⚡ Defers **Multi-Agent Systems** to Week 4 until tool reliability is mastered!
7. **Ask the Assistant (`/chat`)**:
   - Ask: *"Why did you change my roadmap?"*
   - Watch the agent answer using actual learner state, citing the 54% score, specific error handling omissions, and the architectural justification.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript (Strict), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend / API**: Next.js Server Route Handlers (`/api/...`).
- **Database & ORM**: PostgreSQL / SQLite (Dual-compatible), Prisma ORM.
- **AI Abstraction Layer**: `AIProvider` supporting **Google Gemini** (`@google/generative-ai`), **OpenAI** (`openai`), and deterministic high-fidelity **Mock Fallback** for instant zero-config demonstration and offline evaluation.
- **Validation**: Strict runtime schema enforcement via **Zod**.
- **File Parsing**: `pdf-parse` for resume PDF text extraction.

---

## 🤖 Specialized Multi-Agent Architecture

EduPath distributes intelligence across 8 specialized agents rather than one giant prompt:

1. **Profile Agent (`profile-agent.ts`)**: Parses raw document text; extracts verified skills with literal evidence quotes.
2. **Skill Gap Agent (`skill-gap-agent.ts`)**: Cross-analyzes profile against target role requirements into 5 gap states (`acquired`, `developing`, `moderate`, `high`, `critical`).
3. **Roadmap Agent (`roadmap-agent.ts`)**: Traverses dependency DAGs to generate personalized multi-week milestones honoring weekly hour budgets.
4. **Resource Agent (`resource-agent.ts`)**: Curates targeted documentation and tutorials with explicit "Why this resource?" rationales.
5. **Practice Agent (`practice-agent.ts`)**: Generates hands-on coding challenges with starter boilerplate and test rubrics.
6. **Evaluation Agent (`evaluation-agent.ts`)**: Grades submissions across correctness, architecture, error handling, and demonstrated competency.
7. **Adaptation Agent (`adaptation-agent.ts`)**: Reshapes the roadmap, adds prerequisites, or accelerates based on evaluation evidence.
8. **Chat Agent (`chat-agent.ts`)**: Natural language learning companion grounded in live learner memory and evaluation records.

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd EduPath
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(By default, `AI_PROVIDER="mock"` is enabled, allowing instant out-of-the-box evaluation without requiring third-party API keys. To use live LLM calls, set `AI_PROVIDER="gemini"` and supply `GEMINI_API_KEY`.)*

### 3. Initialize Database & Seed Demo Context
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Repository Structure

```text
EduPath/
├── .ai/                       # Comprehensive AI specifications & audit logs
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
├── prisma/
│   ├── schema.prisma          # Relational schema (19 models)
│   └── seed.ts                # Rich demo seeds (7 roles, skills, DAG, demo user)
├── src/
│   ├── ai/
│   │   ├── providers/         # Universal provider abstraction (Gemini, OpenAI, Mock)
│   │   ├── agents/            # 8 Autonomous Specialized Agents
│   │   └── schemas/           # Strict Zod schemas
│   ├── app/
│   │   ├── api/               # Server-side REST API route handlers
│   │   ├── dashboard/         # Command mission control & readiness gauge
│   │   ├── skills/            # Interactive SVG Dependency Graph & Gap report
│   │   ├── roadmap/           # Adaptive timeline & diff notifications
│   │   ├── tasks/             # Challenge workstation & live evaluation
│   │   ├── projects/          # Multi-gap capstone studio
│   │   ├── progress/          # Telemetry & skill confidence trajectories
│   │   ├── chat/              # Grounded learning assistant
│   │   ├── agent/             # Transparent decision audit log
│   │   └── onboarding/        # Resume dropzone & parser
│   └── components/            # Reusable UI widgets & Agent Drawer
└── package.json
```

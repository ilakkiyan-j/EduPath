# EduPath AI — Product Requirements Document (PRD)

## 1. Product Overview

### Name
**EduPath AI**

### Tagline
> *Your AI career agent that learns how you learn.*

### Core Pitch
> EduPath is an adaptive career agent that doesn't just tell learners what to learn. It understands their existing skills, identifies gaps against their target role, creates a personalized learning journey, gives them practical work, evaluates their performance, and continuously adapts the roadmap based on evidence.

---

## 2. Core Product Principle & Autonomous Loop

The entire application revolves around this continuous adaptive cycle:

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
ADAPT
    ↓
REPEAT
```

### The Non-Negotiable Rule
> **Every meaningful learner evaluation must be capable of changing what the learner should do next.**

EduPath is NOT a static LMS, NOT a generic course aggregator, and NOT a simple LLM wrapper chatbot. The roadmap is an active, mutable state machine driven by real performance evidence.

---

## 3. Target Audiences & Personas

1. **Career Switchers & Upskillers**: Developers transitioning into AI Engineering, DevOps, or Data Analysis who need to know what they actually lack rather than re-learning basics.
2. **Bootcamp & CS Graduates**: Learners with foundational coding knowledge seeking production-grade skills and structured project evidence for interviews.
3. **Technical Evaluators & Engineering Leads**: Evaluators looking for authentic agentic behavior—autonomous decision-making, transparent reasoning, structured output schemas, and dynamic adaptation.

---

## 4. Supported Target Roles

1. **AI Engineer**: LLM Fundamentals, Prompt Engineering, Embeddings, Vector Databases, RAG, Tool Calling, AI Agents, Evaluation, Backend APIs, System Design, Deployment.
2. **Software Engineer**: Data Structures, Algorithms, System Design, Git, Clean Code, Testing, CI/CD, SQL, Microservices.
3. **Frontend Engineer**: TypeScript, React, Next.js, State Management, Responsive Design, Web Performance, CSS Architecture, Accessibility, Testing.
4. **Backend Engineer**: Node.js/Go/Python, REST/GraphQL, Database Design, Caching (Redis), Authentication, Message Queues, Docker, Cloud Services.
5. **Machine Learning Engineer**: Python, Mathematics & Statistics, Scikit-Learn, PyTorch, Model Training, Feature Engineering, MLOps, Model Serving.
6. **Data Analyst**: SQL, Python/R, Pandas, Data Visualization, Statistics, Business Intelligence (Tableau/PowerBI), Data Cleaning.
7. **DevOps Engineer**: Linux, Docker, Kubernetes, CI/CD Pipelines, Infrastructure as Code (Terraform), Cloud (AWS/GCP), Monitoring & Observability.

---

## 5. Functional Requirements (P0, P1, P2)

### P0 — MVP Must Work End-to-End
- **Authentication**: Secure identity with guest/demo mode support.
- **Resume & Document Ingestion**: Extraction of text from PDF, DOCX, and TXT with metadata preservation.
- **Profile Agent**: Structured skill extraction with literal evidence excerpts from documents.
- **Skill Gap Agent**: Gap analysis matching profile against target role requirements with 5 gap levels (`acquired`, `developing`, `moderate`, `high`, `critical`).
- **Roadmap Agent**: Dynamic dependency-aware weekly milestone planning honoring learner time budget.
- **Practice Agent**: Generation of hands-on technical challenges with clear rubrics.
- **Evaluation Agent**: Grading code/text submissions against rubrics with structured score and identified weaknesses.
- **Adaptation Agent**: Automatic modification of future roadmap (inserting remedial prerequisites or accelerating) based on evaluation failures or mastery.
- **Main Dashboard**: Career readiness gauge, skill summary, current roadmap, today's task CTA, and live agent activity stream.

### P1 — Core Value Enhancers
- **Interactive Skill Graph**: Visual DAG with node mastery levels and dependency links.
- **Agent Activity Timeline**: Transparent chronological feed of all agent thoughts, decisions, and evidence.
- **Learner Memory**: Persistent tracking of history, repeated weaknesses, and roadmap changes.
- **Resource Recommendations**: Curated resources with explicit "Why this resource?" rationale.
- **Natural Language Assistant**: Conversational agent explaining decisions based on real learner state.
- **Project Generator**: AI-generated multi-gap closing project specifications.

### P2 — Polish & Extension
- GitHub repository URL analysis.
- Calendar integration & study reminders.
- Advanced velocity metrics and gamification badges.

---

## 6. Success Metrics & Live Demo Criteria
1. Full execution of the primary end-to-end adaptive demo script in < 3 minutes.
2. 100% schema validation adherence on all agent outputs.
3. Complete evidence transparency: learner can click any AI conclusion to see the exact reason and data behind it.

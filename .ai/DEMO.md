# EduPath AI — Live Demo Script

## 1. The Core Narrative
> *"Most learning platforms ask you what course you want to take. EduPath starts somewhere else: it asks what you already know."*

---

## 2. Step-by-Step Demo Flow

### Act 1: Intake & Evidence Extraction
1. Open EduPath at `/`.
2. Click **"Try Demo Profile"** (or upload a custom resume PDF).
3. System navigates to `/onboarding`.
4. Watch the `ProfileAgent` extract skills with literal textual evidence quotes (e.g. *Node.js, Express, React, PostgreSQL, basic LLM API calls*).
5. Target role is set to **AI Engineer**.

### Act 2: Gap Analysis & Skill Dependency Graph
1. Navigate to `/skills`.
2. Observe the Skill Gap report:
   - Acquired: *Full Stack, React, Node.js, SQL*
   - Critical Gaps: *Tool Calling, Error Handling, Multi-Agent Systems, Production AI*
3. Explore the interactive **Skill Dependency Graph**:
   - Trace upstream dependencies (Python -> LLMs -> RAG -> Tools -> Agents).

### Act 3: Dynamic Roadmap Synthesis
1. Navigate to `/roadmap`.
2. See the initial personalized roadmap synthesized by `RoadmapAgent`:
   - Week 1: *RAG & Context Retrieval*
   - Week 2: *Multi-Agent Systems*
   - Week 3: *Production AI & Deployment*

### Act 4: Adaptive Feedback Loop — Real-Time Intervention
1. Navigate to `/tasks`.
2. Select the active task: **"Weather Agent with Tool Calling"**.
3. Click the pre-filled **"Load Flawed / Incomplete Solution"** button (submits an implementation that calls the weather API but lacks robust error handling and tool schema validation).
4. Click **"Submit for Evaluation"**.
5. Watch the `EvaluationAgent` score the submission:
   - Score: **54%**
   - Demonstrated: *API Integration, Basic Prompting*
   - Weaknesses: *Error Handling, Tool Schema Validation, Fallback Recovery*
6. Observe the immediate banner:
   - ⚡ **Roadmap Dynamically Adapted by EduPath Agent**
7. Click **"View Adapted Roadmap"**:
   - Notice the insertion of:
     - *Week 2: Error Handling & Tool Reliability (Prerequisite Injected)*
     - *Week 3: Agent Evaluation & Guardrails*
     - Followed by *Week 4: Multi-Agent Systems*

### Act 5: Evidence-Based Conversational Explanation
1. Open the **Learning Assistant** (`/chat`).
2. Ask: *"Why did you change my roadmap?"*
3. Observe the AI's exact, evidence-grounded response citing the 54% score, missing error handling, and why tool reliability must precede multi-agent orchestration.
4. Conclude with:
   > *"EduPath doesn't just create a learning plan. It continuously learns what the learner needs next."*

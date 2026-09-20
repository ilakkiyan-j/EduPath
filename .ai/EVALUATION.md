# EduPath AI — Agent Evaluation Framework

## 1. Quality & Reliability Objectives
Deterministic reliability and schema adherence are prioritized over unpredictable open-ended autonomy. Every agent output is strictly validated against typed Zod schemas.

---

## 2. Evaluation Metrics Tracked

| Metric | Target | Measurement Strategy |
| :--- | :--- | :--- |
| **Schema Validation Rate** | 100% | Zod schema parse success on agent JSON output |
| **Fallback Recovery** | 100% | Automatic graceful recovery if LLM produces malformed response |
| **Evidence Grounding** | > 95% | Ratio of extracted skills backed by literal source quotes |
| **Adaptation Precision** | 100% | Weak submission (score < 60%) must deterministically adapt roadmap |
| **Latency** | < 2.5s | Turnaround time for structured agent responses |

---

## 3. Rubric Dimensions for Evaluation Agent
The `EvaluationAgent` assesses submissions along 5 weighted dimensions:
1. **Functional Correctness (30%)**: Does the solution solve the stated problem and satisfy functional requirements?
2. **Technical Implementation (25%)**: Code structure, language idioms, and clean modular design.
3. **Error Handling & Edge Cases (20%)**: Handling nulls, API errors, timeouts, and rate limits.
4. **Architecture & Design (15%)**: Proper separation of concerns, scalability, and maintainability.
5. **Demonstrated Competency (10%)**: Evidence that the target skill (e.g. Tool Calling) was understood rather than copied.

---

## 4. Adaptation Trigger Rules
- **Prerequisite Injection**: Triggered when a learner scores < 60% on a core milestone task with repeated weakness in a foundational skill (e.g. Tool Reliability or Error Handling).
- **Acceleration**: Triggered when a learner scores >= 95% on a milestone challenge with high confidence; optional elective skipped or advanced module brought forward.
- **Repeat / Refine**: Triggered when score is between 60% and 75%; targeted practice task generated before moving to subsequent milestone.

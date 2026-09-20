# EduPath AI — RESTful API Specification

All endpoints follow standard HTTP verbs, JSON request/response formats, and return `{ success: boolean, data?: any, error?: string }`.

---

## 1. Profile & Ingestion APIs

### `POST /api/profile/analyze`
- **Purpose**: Uploads and parses resume (PDF, DOCX, TXT) or raw text and runs `ProfileAgent`.
- **Request**: `multipart/form-data` with `file` or JSON `{ text: string }`.
- **Response**: Extracted profile with skills, levels, and evidence excerpts.

### `GET /api/profile`
- **Purpose**: Retrieves the active learner profile, career readiness, and preferences.

---

## 2. Skill Gaps & Dependencies

### `POST /api/gaps/analyze`
- **Purpose**: Triggers `SkillGapAgent` for a selected target role against the learner's profile.
- **Request**: `{ roleId: string }`
- **Response**: List of gap objects with severity (`acquired`, `developing`, `moderate`, `high`, `critical`) and textual evidence.

### `GET /api/skills/graph`
- **Purpose**: Returns node and edge data for the interactive Skill Dependency Graph for the active target role and learner mastery levels.

---

## 3. Roadmap & Adaptation

### `POST /api/roadmap/generate`
- **Purpose**: Executes `RoadmapAgent` to synthesize a personalized multi-week learning plan based on skill gaps, dependencies, and weekly time budget.
- **Request**: `{ weeklyHours: number, preferredStyle: string }`
- **Response**: Created `Roadmap` and ordered `RoadmapItem` milestones.

### `GET /api/roadmap`
- **Purpose**: Returns the active roadmap with milestone items, status, and adaptation history tags.

### `POST /api/roadmap/adapt`
- **Purpose**: Manually or programmatically triggers `AdaptationAgent` to evaluate whether recent submissions warrant roadmap modification.
- **Response**: Before/after diff and reason for adaptation.

---

## 4. Practice, Tasks & Evaluations

### `POST /api/tasks/generate`
- **Purpose**: Calls `PracticeAgent` to create a realistic hands-on challenge for the current milestone.
- **Request**: `{ milestoneId: string }`
- **Response**: Created task with requirements, starter code, and rubric.

### `GET /api/tasks` & `GET /api/tasks/[id]`
- **Purpose**: Lists all tasks and inspects specific task details.

### `POST /api/tasks/[id]/submit`
- **Purpose**: Receives learner submission, invokes `EvaluationAgent`, stores results, checks for weakness patterns, triggers `AdaptationAgent` if necessary, and logs `AgentEvent`.
- **Request**: `{ code?: string, text?: string, githubUrl?: string }`
- **Response**: Evaluation scorecard, score, detected weaknesses, confidence delta, and whether the roadmap was adapted.

---

## 5. Agent Timeline, Chat & Projects

### `GET /api/agent/events`
- **Purpose**: Fetches real-time timeline of agent operations, decisions, and evidence.

### `POST /api/chat`
- **Purpose**: Conversational assistant endpoint querying `LearnerMemory` and `AgentEvent` history.
- **Request**: `{ message: string, history: Array<{ role: string, content: string }> }`
- **Response**: Grounded response answering questions like *"Why did you change my roadmap?"*

### `POST /api/projects/generate`
- **Purpose**: Synthesizes a unified capstone project that addresses multiple critical gaps in one cohesive build.

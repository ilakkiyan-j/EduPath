# EduPath AI — Product Architecture & Specification

## Autonomous Adaptive Career Agent

> **EduPath is an adaptive career agent that doesn't just tell you what to learn. It observes what you know, identifies what you're missing, gives you work to prove your skills, evaluates your performance, and continuously rebuilds your learning path around your weaknesses.**

---

# 1. Product Vision

## Product Name

**EduPath AI**

## One-Line Pitch

> Upload your resume, choose your target role, and EduPath autonomously turns your skill gaps into an adaptive learning journey.

## Core Concept

EduPath is not a traditional learning management system.

It is an **AI-powered adaptive career and learning agent** that continuously performs:

```text
Understand
    ↓
Identify
    ↓
Plan
    ↓
Teach
    ↓
Practice
    ↓
Evaluate
    ↓
Adapt
    ↓
Repeat
```

The system should continuously update the learner's roadmap based on actual performance.

---

# 2. Problem We Are Solving

Learners often know the role they want but don't know:

* What skills they already have
* What skills they are missing
* Which skills should be learned first
* Which resources are relevant
* Whether they actually understand a topic
* Why they are struggling
* What project they should build
* What they should learn next

Existing learning platforms usually provide static courses.

EduPath provides an **adaptive learning journey**.

---

# 3. Core User Journey

```text
Resume / Portfolio / Certificates
                ↓
        Profile Agent
                ↓
        Skill Extraction
                ↓
          Target Role
                ↓
        Skill Gap Agent
                ↓
       Skill Dependency Graph
                ↓
          Roadmap Agent
                ↓
      Personalized Weekly Plan
                ↓
        Practice Generation
                ↓
          User Submission
                ↓
        Evaluation Agent
                ↓
       Skill Confidence Update
                ↓
      Adaptation Agent
                ↓
      Updated Learning Roadmap
```

---

# 4. MVP Scope

The initial MVP focuses on one complete autonomous loop.

## Must Have

1. Resume / document upload
2. Learner profile extraction
3. Target role selection
4. Skill gap analysis
5. Skill dependency graph
6. Personalized roadmap
7. Weekly learning plan
8. Learning resource recommendations
9. AI-generated practice tasks
10. Submission evaluation
11. Skill progress tracking
12. Adaptive roadmap updates
13. Natural-language learning assistant
14. Agent activity timeline

## Nice to Have

* GitHub integration
* Portfolio URL analysis
* Certificate verification
* Calendar integration
* Email reminders
* Advanced analytics
* Multiple learning styles
* Gamification

These should only be implemented after the core agent loop works.

---

# 5. Supported Target Roles

Initially, support a targeted set of core engineering roles:

```text
Software Engineer
Frontend Engineer
Backend Engineer
AI Engineer
ML Engineer
Data Analyst
DevOps Engineer
```

The architecture should allow new roles to be added later.

---

# 6. Learner Onboarding

The learner provides:

```text
Target Role
Experience Level
Career Goal
Weekly Availability
Learning Preference
```

Example:

```text
Target Role:
AI Engineer

Experience:
Entry Level

Weekly Availability:
15 hours

Learning Preference:
Hands-on

Career Goal:
Get an AI Engineer position
```

The learner can additionally upload:

```text
Resume.pdf
Portfolio
Certificates
Project descriptions
```

---

# 7. Agent Architecture

EduPath should use multiple specialized agents.

## Agent 1 — Profile Agent

### Responsibility

Understand the learner.

### Inputs

* Resume
* Portfolio
* Certificates
* Project descriptions
* User questionnaire

### Outputs

Structured learner profile.

Example:

```json
{
  "experience_level": "Entry",
  "skills": {
    "Python": 4,
    "JavaScript": 4,
    "React": 4,
    "Node.js": 4,
    "PostgreSQL": 3,
    "Machine Learning": 2,
    "LLMs": 3,
    "RAG": 3,
    "System Design": 1
  },
  "projects": [],
  "certifications": []
}
```

All agent outputs should use structured schemas wherever possible.

---

# 8. Agent 2 — Skill Gap Agent

## Responsibility

Compare the learner's existing capabilities against the requirements of the target role.

```text
Current Learner Profile
          +
Target Role Requirements
          ↓
       Skill Gap
```

Example:

| Skill         | Current | Required | Gap      |
| ------------- | ------: | -------: | -------- |
| Python        |       3 |        4 | Medium   |
| LLMs          |       3 |        4 | Medium   |
| RAG           |       2 |        4 | High     |
| AI Agents     |       1 |        4 | Critical |
| System Design |       2 |        3 | Medium   |
| Docker        |       2 |        3 | Medium   |

The agent must also explain the reason behind the gap.

Example:

> **AI Agents — Critical Gap**
>
> Your portfolio demonstrates LLM API usage and RAG, but there is insufficient evidence of multi-step agent orchestration, tool use, memory, and evaluation.

---

# 9. Skill Dependency Graph

One of the primary visual features.

Instead of presenting a simple list, represent skills as a dependency graph.

Example:

```text
                 AI ENGINEER
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
        RAG                   AI AGENTS
          │                       │
    ┌─────┴─────┐           ┌─────┴─────┐
    ↓           ↓           ↓           ↓
Embeddings   Vector DB    Tools       Memory
    │                       │
    └──────────┬────────────┘
               ↓
          Production AI
               │
               ↓
           Deployment
```

The roadmap agent should use this dependency information when deciding learning order.

---

# 10. Agent 3 — Roadmap Agent

## Responsibility

Generate a personalized learning journey.

Example:

```text
Week 1
AI Agent Fundamentals

Week 2
Tool Calling

Week 3
Memory + RAG

Week 4
Multi-Agent Workflows

Week 5
Production AI

Week 6
Capstone Project
```

The roadmap must NOT be static.

It should be updated when new evaluation evidence becomes available.

---

# 11. Agent 4 — Resource Agent

For every identified skill gap, recommend appropriate learning resources.

Possible resource types:

```text
Documentation
Video
Article
Course
Tutorial
Coding Exercise
Project
```

Each recommendation should contain:

```text
Resource
Skill addressed
Difficulty
Estimated duration
Reason for recommendation
```

Avoid simply dumping links.

The agent must explain why the resource is relevant to the learner.

---

# 12. Agent 5 — Practice Agent

Generate practical exercises based on the learner's current level.

Example:

```text
Current Skill:
AI Agents

Current Level:
Beginner

Practice Task:

Build a weather agent that can:
1. Receive a user question
2. Call a weather API
3. Extract the required information
4. Return a natural-language answer
5. Handle API failures
```

The difficulty should change based on the learner's performance.

---

# 13. Agent 6 — Evaluation Agent

Evaluate learner submissions.

The evaluator can assess:

```text
Technical correctness
Skill demonstration
Problem solving
Code quality
Architecture
Error handling
Understanding
```

Example output:

```json
{
  "score": 72,
  "skills_demonstrated": [
    "Tool Calling",
    "API Integration"
  ],
  "weak_areas": [
    "Error Handling"
  ],
  "confidence_update": {
    "tool_calling": 0.82,
    "api_integration": 0.75,
    "error_handling": 0.38
  },
  "next_action": "Practice error handling"
}
```

---

# 14. Agent 7 — Adaptation Agent

This is the most important agent.

It analyzes historical performance and decides whether the learning path needs to change.

Example:

```text
Attempt 1 → 52%
Attempt 2 → 58%
Attempt 3 → 54%

Detected:
Persistent weakness in System Design
```

Instead of continuing the original roadmap:

```text
Multi-Agent Systems
        ↓
Production AI
```

The agent changes it:

```text
System Design Fundamentals
        ↓
Architecture Exercise
        ↓
Guided Project
        ↓
Evaluation
        ↓
Multi-Agent Systems
```

This demonstrates genuine adaptive behavior.

---

# 15. Adaptive Learning Loop

The core agentic loop:

```text
Learn
  ↓
Practice
  ↓
Submit
  ↓
Evaluate
  ↓
Update Skill Confidence
  ↓
Detect Weakness
  ↓
Adapt Roadmap
  ↓
Generate Next Task
  ↓
Practice Again
```

This loop is the centerpiece of the end-to-end interactive demo.

---

# 16. Learner Memory

EduPath must maintain persistent learner memory.

Suggested structure:

```text
learner_memory

├── skills
├── completed_topics
├── failed_topics
├── assessment_history
├── preferred_learning_style
├── project_history
├── weak_areas
├── strong_areas
└── roadmap_changes
```

The agent should use previous learning history when generating future recommendations.

---

# 17. Project Generator

Generate projects that close multiple skill gaps.

Example:

Learner already knows:

```text
React
Node.js
PostgreSQL
RAG
```

Missing:

```text
AI Agents
System Design
Deployment
```

EduPath generates:

## AI Customer Support Agent

```text
React Dashboard
       ↓
Node.js API
       ↓
Agent Orchestrator
       ↓
RAG
       ↓
PostgreSQL
       ↓
Tool Calling
       ↓
Docker Deployment
```

This allows one project to develop multiple missing competencies.

---

# 18. Natural Language Learning Assistant

The learner should be able to ask questions about their journey.

Example:

> Why am I learning RAG before multi-agent systems?

The assistant should answer using the learner's actual skill profile and roadmap.

Example:

> Your current profile shows basic LLM and retrieval experience, while multi-agent workflows require stronger grounding and retrieval fundamentals. Your roadmap therefore places RAG before multi-agent orchestration.

---

# 19. Dynamic Constraints

The learner should be able to modify constraints.

Example:

> I only have 5 hours this week.

The agent should automatically re-plan.

```text
Original Plan:
10 hours

New Availability:
5 hours

Updated Plan:

2h → RAG fundamentals
1h → Embeddings exercise
2h → Mini RAG project

Deferred:

Vector database optimization
```

Another example:

> I already know Docker.

The agent should remove or reduce Docker-related learning tasks.

---

# 20. Dashboard

The dashboard should be simple and highly visual.

## Home

```text
Good evening, Ilakkiyan

Target:
AI Engineer

Career Readiness:
███████████████░░░░ 72%

Critical Gaps:
3

Skills In Progress:
4

Skills Acquired:
8
```

---

# 21. Skill Progress

Example:

```text
FOUNDATION

✓ Python
✓ Git
✓ APIs


AI ENGINEERING

✓ LLM Fundamentals
◐ RAG
🔴 AI Agents


PRODUCTION

🔴 System Design
🔴 Deployment
```

---

# 22. Weekly Learning Plan

Example:

```text
MONDAY

Learn
Agent Fundamentals

45 minutes


TUESDAY

Practice
Tool Calling

60 minutes


WEDNESDAY

Build
Weather Agent

90 minutes


THURSDAY

Evaluate
AI Assessment

30 minutes


FRIDAY

Fix
Error Handling

60 minutes


SATURDAY

Project
Customer Support Agent

3 hours
```

---

# 23. Progress Report

Generate automatically.

Example:

```text
WEEK 3 PROGRESS

Skills Acquired
✓ Prompt Engineering
✓ Tool Calling

Improving
◐ RAG
◐ Agent Memory

Needs Attention
⚠ Error Handling
⚠ System Design

This Week

4 tasks completed
3 projects submitted
1 weak area detected

Agent Recommendation

Spend next week strengthening
error handling before progressing
to multi-agent architecture.
```

---

# 24. Agent Activity Timeline

Expose the agent's work instead of hiding it.

Example:

```text
🤖 EduPath Agent

10:31 AM
Analyzed your resume

10:32 AM
Detected 23 technical skills

10:32 AM
Compared profile with AI Engineer role

10:33 AM
Found 6 skill gaps

10:33 AM
Generated dependency graph

10:34 AM
Created 6-week learning roadmap

10:35 AM
Generated this week's assignments
```

This makes the agent behavior transparently visible during evaluation.

---

# 25. Adaptive Skill Graph

This should be one of the primary "WOW" features.

Example:

```text
                 AI ENGINEER
                      │
          ┌───────────┴───────────┐
          ↓                       ↓
        RAG                   AI AGENTS
        82%                       43%
                                  │
                             ⚠ Weakness
                                  │
                                  ↓
                          Tool Reliability
                                31%
                                  │
                                  ↓
                            Next Focus
```

After completing the next exercise:

```text
Tool Reliability

31% → 67%
```

The graph updates dynamically.

---

# 26. Technology Stack

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
```

## Backend

Choose one:

```text
FastAPI
```

or:

```text
Node.js
Express
TypeScript
```

Prefer the stack the team can build fastest.

## Database

```text
PostgreSQL
```

## Vector Search

```text
pgvector
```

## AI

Use the configured LLM API key (Gemini, OpenAI) or deterministic fallback.

Possible options:

```text
Gemini
OpenAI
```

## Authentication

```text
Firebase Authentication
```

## File Storage

Use a cloud object-storage service available to the team.

---

# 27. Database Schema

Core tables:

```text
users

learner_profiles

skills

roles

role_skills

learner_skills

skill_gaps

skill_dependencies

roadmaps

roadmap_items

learning_resources

tasks

submissions

evaluations

progress_history

agent_events

learner_memory
```

---

# 28. Suggested Architecture

```text
                         EDUPath
                            │
                     Next.js + TS
                            │
                      API Layer
                            │
                  Agent Orchestrator
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   Profile Agent       Gap Agent          Roadmap Agent
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ↓
                    Practice Agent
                            │
                            ↓
                    Evaluation Agent
                            │
                            ↓
                   Adaptation Agent
                            │
                            ↓
                     Learner Memory
                            │
                            ↓
                    Updated Roadmap
```

---

# 29. Development Phases

## Phase 1 — Foundation

Build:

```text
Authentication
Dashboard
Database
File Upload
Learner Profile
```

### Milestone

```text
User
 ↓
Upload Resume
 ↓
Create Learner Profile
```

---

# Phase 2 — Intelligence

Build:

```text
Resume Parser
Skill Extraction
Target Role System
Skill Gap Analysis
```

### Milestone

```text
Resume
 ↓
Skill Profile
 ↓
Target Role
 ↓
Skill Gap Report
```

---

# Phase 3 — Roadmap

Build:

```text
Skill Dependency Graph
Roadmap Generation
Weekly Plan
Resource Recommendations
```

### Milestone

```text
Skill Gaps
 ↓
Personalized Learning Journey
```

---

# Phase 4 — Agent Loop

Build:

```text
Practice Generation
Submission
Evaluation
Skill Confidence Update
Roadmap Adaptation
```

### Milestone

```text
Task
 ↓
Submission
 ↓
Evaluation
 ↓
Weakness Detection
 ↓
Roadmap Update
```

This is the most important phase.

---

# Phase 5 — Memory

Implement:

```text
Learning History
Assessment History
Weak Areas
Strong Areas
Roadmap Changes
Project History
```

### Milestone

The agent remembers previous learner behavior.

---

# Phase 6 — UI Polish

Add:

```text
Skill Graph
Progress Animations
Agent Timeline
Progress Reports
Learning Chat
Responsive Dashboard
```

---

# 30. End-to-End Demo Story

Use one realistic learner.

### Step 1 — Upload

Upload a real resume.

### Step 2 — Select Target

```text
AI Engineer
```

### Step 3 — Profile Analysis

Show extracted skills.

### Step 4 — Gap Analysis

Show:

```text
Strong:
Full Stack
React
Node.js
APIs

Weak:
AI Agents
System Design
Production AI
```

### Step 5 — Generate Roadmap

Show the personalized learning journey.

### Step 6 — Generate Task

Agent generates a tool-calling project.

### Step 7 — Submit Weak Solution

Intentionally submit an incomplete implementation.

### Step 8 — Evaluation

Agent identifies:

```text
Tool Calling ✓
API Integration ✓
Error Handling ✗
```

### Step 9 — Adaptation

Show:

```text
Original:

Multi-Agent Systems
        ↓
Production AI


Updated:

Error Handling
        ↓
Tool Reliability
        ↓
Multi-Agent Systems
```

### Step 10 — Ask the Agent

Ask:

> Why did you change my roadmap?

The agent explains the decision using actual learner evidence.

This should be the climax of the demo.

---

# 31. Primary Architectural Differentiator

Do NOT position EduPath as:

> An AI learning platform.

Position it as:

> **An adaptive career agent that continuously learns about the learner.**

The key distinction:

```text
Traditional LMS

Course
 ↓
Complete Course
 ↓
Next Course


EduPath

Understand Learner
 ↓
Identify Gap
 ↓
Create Plan
 ↓
Generate Work
 ↓
Evaluate Evidence
 ↓
Detect Weakness
 ↓
Adapt Plan
 ↓
Repeat
```

---

# 32. Core Pitch

> **EduPath is an adaptive career agent that doesn't just tell you what to learn. It observes what you know, identifies what you're missing, gives you work to prove your skills, evaluates your performance, and continuously rebuilds your learning path around your weaknesses.**

---

# 33. Final Product Loop

The entire product should ultimately demonstrate:

```text
┌───────────────────────────────┐
│        LEARNER PROFILE        │
└───────────────┬───────────────┘
                ↓
        ┌───────────────┐
        │ Skill Analysis│
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ Skill Gap     │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ Roadmap       │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ Practice      │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ Evaluation    │
        └───────┬───────┘
                ↓
        ┌───────────────┐
        │ Adaptation    │
        └───────┬───────┘
                │
                └───────────────┐
                                ↓
                         UPDATED ROADMAP
                                │
                                └──────→ REPEAT
```

## The single most important principle

> **Every evaluation should have the ability to change what the learner does next.**

That is what makes EduPath an **agent**, rather than simply an LLM-powered learning dashboard.

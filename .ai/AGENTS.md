# EduPath AI — Specialized Agents Specification

## 1. Multi-Agent Topology Overview

EduPath uses specialized modular agents with dedicated prompts, inputs, and schemas rather than a monolithic catch-all prompt.

---

## 2. Agent 1: Profile Agent (`profile-agent.ts`)
- **Objective**: Parse raw document text (resume, portfolio, certifications) and extract verified learner profile.
- **Input**: `{ resumeText: string, metadata?: Record<string, unknown> }`
- **Output Schema**:
  ```typescript
  {
    experienceLevel: "entry" | "junior" | "mid" | "senior";
    summary: string;
    skills: Array<{
      skillName: string;
      level: number; // 1 to 5
      confidence: number; // 0.0 to 1.0
      evidence: Array<{ source: string; text: string }>;
    }>;
    projects: Array<{ title: string; description: string; technologies: string[] }>;
    certifications: string[];
  }
  ```
- **Constraint**: Must never invent skills without matching source evidence text.

---

## 3. Agent 2: Skill Gap Agent (`skill-gap-agent.ts`)
- **Objective**: Compare learner's extracted profile with target role requirements.
- **Input**: `{ learnerSkills: SkillProfile[], targetRole: RoleDefinition }`
- **Output Schema**:
  ```typescript
  {
    targetRole: string;
    overallReadiness: number; // 0 to 100 percentage
    gaps: Array<{
      skillName: string;
      currentLevel: number;
      requiredLevel: number;
      gapLevel: "acquired" | "developing" | "moderate" | "high" | "critical";
      confidence: number;
      reason: string;
      evidence: string[];
    }>;
    summary: string;
  }
  ```

---

## 4. Agent 3: Roadmap Agent (`roadmap-agent.ts`)
- **Objective**: Traverse skill dependencies to generate a personalized weekly milestone roadmap.
- **Input**: `{ gaps: SkillGap[], weeklyHours: number, preferredStyle: string }`
- **Output Schema**:
  ```typescript
  {
    title: string;
    totalWeeks: number;
    weeklyCommitmentHours: number;
    milestones: Array<{
      weekNumber: number;
      title: string;
      description: string;
      targetSkills: string[];
      estimatedHours: number;
      prerequisites: string[];
      status: "pending" | "in_progress" | "completed" | "adapted";
    }>;
  }
  ```

---

## 5. Agent 4: Resource Agent (`resource-agent.ts`)
- **Objective**: Provide high-signal learning resources for target skills with transparent reasons.
- **Input**: `{ skillName: string, gapLevel: string, learnerLevel: number }`
- **Output Schema**:
  ```typescript
  {
    skillName: string;
    resources: Array<{
      title: string;
      type: "documentation" | "article" | "video" | "course" | "tutorial" | "exercise";
      url: string;
      difficulty: "beginner" | "intermediate" | "advanced";
      estimatedDurationMinutes: number;
      reason: string; // Explains "Why this resource?"
    }>;
  }
  ```

---

## 6. Agent 5: Practice Agent (`practice-agent.ts`)
- **Objective**: Generate realistic practical coding/system tasks targeting active skill gaps.
- **Input**: `{ milestoneTitle: string, targetSkills: string[], difficulty: string }`
- **Output Schema**:
  ```typescript
  {
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    skillsAddressed: string[];
    requirements: string[];
    expectedOutcome: string;
    starterCode?: string;
    evaluationCriteria: string[];
    estimatedTimeMinutes: number;
  }
  ```

---

## 7. Agent 6: Evaluation Agent (`evaluation-agent.ts`)
- **Objective**: Grade learner submissions across multiple quality axes.
- **Input**: `{ task: TaskDefinition, submission: { code?: string; text?: string; githubUrl?: string } }`
- **Output Schema**:
  ```typescript
  {
    overallScore: number; // 0 to 100
    isPassing: boolean;
    skillsDemonstrated: string[];
    weakAreas: string[];
    strengths: string[];
    feedback: Array<{ category: string; comment: string; severity: "info" | "warning" | "error" }>;
    skillUpdates: Array<{ skillName: string; previousLevel: number; newLevel: number; confidenceChange: number }>;
    recommendedNextAction: string;
  }
  ```

---

## 8. Agent 7: Adaptation Agent (`adaptation-agent.ts`) - **Core Differentiator**
- **Objective**: Autonomously reshape the roadmap based on evaluation evidence.
- **Input**: `{ currentRoadmap: Roadmap, recentEvaluations: Evaluation[], repeatedWeaknesses: string[] }`
- **Output Schema**:
  ```typescript
  {
    adaptationTriggered: boolean;
    adaptationType: "continue" | "accelerate" | "repeat" | "simplify" | "inject_prerequisite" | "reorder";
    reason: string;
    evidence: string;
    modifiedMilestones: Array<{
      action: "kept" | "inserted" | "modified" | "removed";
      weekNumber: number;
      title: string;
      targetSkills: string[];
      justification: string;
    }>;
    agentSummaryForLearner: string;
  }
  ```

---

## 9. Agent 8: Assistant Chat Agent (`chat-agent.ts`)
- **Objective**: Answer questions ("Why did you change my roadmap?", "What should I do today?") grounded in live learner memory and agent event history.

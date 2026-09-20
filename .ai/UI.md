# EduPath AI — UI Design System & Component Guidelines

## 1. Design Language & Philosophy

- **Aesthetic**: Premium, dark-mode first, developer-focused, glassmorphic, and AI-native.
- **Palette**:
  - Background: Deep slate/zinc canvas (`#090d16`, `#0f172a`)
  - Surfaces: Frosted dark glass cards (`rgba(30, 41, 59, 0.7)` with subtle borders `border-slate-800/60` and `backdrop-blur-md`)
  - Primary Accent: Electric Indigo & Cyan (`#6366f1` / `#06b6d4`)
  - Status Accents:
    - Acquired / Mastered: Emerald (`#10b981`)
    - Developing / Moderate: Amber (`#f59e0b`)
    - Critical Gap / Weakness: Rose / Crimson (`#f43f5e`)
- **Typography**: Modern geometric typography (`Inter` / `Outfit` / `Geist Sans`), crisp monospaced font for code snippets (`JetBrains Mono` / `Fira Code`).

---

## 2. Key Pages & Routes

1. `/`: Landing page introducing the autonomous learning loop, pitch, and instant 1-click Demo entry.
2. `/onboarding`: Interactive resume dropzone, profile extractor with live scan effect, target role selector, and constraints slider.
3. `/dashboard`: Mission control with career readiness dial, skill summary cards, current active milestone, "Today's Task" CTA, and agent timeline widget.
4. `/skills`: Interactive SVG / Canvas Skill Dependency Graph displaying mastery levels and prerequisite links + filterable gap cards.
5. `/roadmap`: Adaptive learning journey with visual milestone timeline, adaptation badges ("Prerequisite Injected", "Accelerated"), and "Why did this change?" modals.
6. `/tasks`: Interactive task dashboard with difficulty filters.
7. `/tasks/[id]`: Split-pane challenge workstation with task instructions, requirements, starter code viewer, submission input, and real-time evaluation report card.
8. `/progress`: Visual analytics with confidence trajectory lines, demonstrated strengths, and weakness focus areas.
9. `/projects`: Capstone Project Studio with AI-synthesized full-stack projects that combine multiple skill gaps.
10. `/chat`: Persistent learning assistant aware of all learner memories, evaluations, and roadmap changes.
11. `/agent`: Detailed agent event log exposing timestamps, agent thoughts, structured JSON inputs/outputs, and decision justifications.

---

## 3. Micro-Animations & Interactivity (Framer Motion)
- **Roadmap Adaptation**: Smooth layout transitions when a new prerequisite milestone is inserted dynamically.
- **Agent Activity Glow**: Pulsing indicator when an agent is analyzing evidence or calculating gaps.
- **Skill Graph Hover**: Highlights connected upstream prerequisites and downstream unlocked skills on hover.

# 🌐 Universal Agent Instructions & Meta-Orchestration Protocol

> **Universal Compatibility**: This file is the single source of truth for all AI coding agents working in this repository (Claude Code, Antigravity, Cursor, Windsurf, Codex).

---

## 🧭 Executive Meta-Orchestration Protocol

On every user turn, you must act as the **Meta-Orchestrator** by adhering to the following 4-phase lifecycle:

### Phase 1: Dynamic Intent Routing
1. Inspect the user's request and match the task domain against available skills (in `skills/`, `.agents/skills/`, or global skill directories).
2. Dynamically select the best-suited skill(s). Do not hardcode skill lists—honor any current or future skills added to the workspace.
3. Prepend a subtle routing badge to your response:
   `🎯 [Orchestrator: <skill1> + <skill2>]`

---

### Phase 2: Adaptive Context & Memory Check
* **For Coding / Bugfixing / Refactoring Tasks**:
  * Check if `memory-bank/` exists in the repository root.
  * If it exists, **always read `memory-bank/activeContext.md` before making edits** to ensure alignment with active decisions, architecture constraints, and pending items.
  * If starting a new project and `memory-bank/` is absent, offer: `"/memory init"` to establish cross-session memory.
* **For General Q&A / Research**:
  * Proceed immediately without requiring file reads.

---

### Phase 3: Disciplined Execution & Verification Gate
* **UI & Frontend Tasks**:
  * Strictly enforce `design-taste-frontend` and `awesome-design`. Avoid AI slop: no generic centered 3-card rows, no cliché purple gradients, enforce real typographic scales, semantic color tokens, and handle all 6 interaction states (default, hover, active, focus-visible, disabled, loading).
* **Code Implementation & Bug Fixing**:
  * Strictly enforce `test-driven-development` (TDD). Write the failing test first, run it to confirm failure, then write minimal code to turn it green. Never declare work complete without running automated tests.
* **Git Hygiene**:
  * Strictly enforce `conventional-commits` (`feat:`, `fix:`, `refactor:`) for all commit messages and PR summaries.

---

### Phase 4: Post-Task Sync & Knowledge Graph Maintenance
* If code or architecture was modified during this turn:
  1. Update `memory-bank/activeContext.md` with the changes made and the immediate next steps.
  2. Update `memory-bank/progress.md` with newly completed milestones or open bugs.
  3. If `graphify-out/` exists in the repository, trigger an incremental re-index (`graphify . --update`) to ensure the codebase knowledge graph stays fresh.

---

## 🛠️ Recommended Baseline Skills

This repository includes the complete open-source baseline skillpack inside `skills/`:
* `meta-orchestrator`: Dynamic intent router & lifecycle coordinator.
* `memory-bank`: File-based cross-session project memory.
* `test-driven-development`: Red-Green-Refactor test engineering.
* `conventional-commits`: Semantic commits and clean git hygiene.
* `design-taste-frontend`: Anti-slop UI art direction.
* `awesome-design`: Design tokens, elevation, and component states.
* `web-design-guidelines`: UX, accessibility, and WCAG compliance audit.
* `image-to-code`: Screenshot and mockup translation.

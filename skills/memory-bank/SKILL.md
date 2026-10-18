---
name: memory-bank
description: Structured, persistent cross-session memory architecture for AI coding agents. Maintains a local, file-based Memory Bank across sessions (activeContext, systemPatterns, techContext, productContext, progress, projectbrief) to retain architectural context, ongoing state, tech decisions, and project roadmaps without context window decay. Use when starting a new project, resuming work across sessions, or when asked to "initialize memory", "update memory", "remember this", or "/memory".
---

# 🧠 Memory Bank — Persistent Agent Memory & Context Protocol

You are an agent equipped with **Memory Bank**, a structured external memory system.
Language models reset between sessions and lose context during long workflows. The Memory Bank solves this by externalizing project continuity into a structured directory of plain Markdown files within the repository.

---

## 📁 Memory Bank Architecture

The Memory Bank lives in a `memory-bank/` directory at the project root:

```text
project-root/
└── memory-bank/
    ├── projectbrief.md     # Core mission, scope, goals, non-negotiables
    ├── productContext.md   # Why this exists, user problems solved, user journeys
    ├── activeContext.md    # CURRENT FOCUS, active decisions, recent changes, immediate next steps
    ├── systemPatterns.md   # Architecture, component structure, design patterns, data flows
    ├── techContext.md      # Tech stack, dependencies, runtime constraints, env setup
    └── progress.md         # What works, what is built, known bugs, roadmap
```

---

## ⚡ Progressive Loading Protocol

To keep token usage lean and avoid context dilution:
1. **On Session Start / Resuming Work**:
   * Inspect if `memory-bank/` exists.
   * If it exists, read `memory-bank/activeContext.md` first. This immediately restores situational awareness.
   * Read `memory-bank/systemPatterns.md` or `techContext.md` ONLY when modifying relevant architecture or build configurations.
2. **On Major Decisions / Session End**:
   * Update `memory-bank/activeContext.md` with what changed and what remains.
   * Update `memory-bank/progress.md` with newly completed milestones or discovered bugs.

---

## 🛠️ Memory Commands & Actions

### 1. `/memory init` (Initialize Memory Bank)
If `memory-bank/` does not exist:
* Scan the repository structure (`package.json`, `README.md`, source files, git log).
* Generate all 6 core files populated with verified details from the current codebase.

### 2. `/memory update` (Sync Current State)
* Summarize the current session's code changes, architectural pivots, and active tasks into `activeContext.md`.
* Move completed items in `progress.md` from "In Progress" to "Completed".

### 3. `/memory record <decision>` (Log Technical Decision)
* Append the decision, rationale, and alternatives considered to `systemPatterns.md`.

---

## 📋 File Templates

### `activeContext.md`
```markdown
# Active Context

## Current Focus
- [Brief summary of the ongoing objective]

## Recent Changes
- [File or component modified] — [Rationale]

## Active Decisions & Considerations
- [Trade-off or pattern agreed upon]

## Next Steps
1. [Immediate task 1]
2. [Immediate task 2]
```

### `progress.md`
```markdown
# Project Progress

## What Works
- [Feature A] — verified functional
- [Feature B] — verified with unit tests

## What's Left to Build
- [ ] Milestone 1
- [ ] Milestone 2

## Known Issues / Blockers
- [Issue description and potential fix]
```

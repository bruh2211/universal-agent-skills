---
name: memory-bank-init
description: "Initializes the Memory Bank for the current project by scanning package.json, README, sources, and git history, then creating the memory-bank/ structure. Use for /memory init, 'initialize memory', 'set up project memory'."
---

# ðŸ§  /memory init â€” Initialize Memory Bank for Current Project

You are a memory bank initialization specialist. When the user invokes `/memory init` (or asks to initialize memory), you scan the current project and create the full Memory Bank structure.

## What /memory init does

1. **Scans the repository** â€” reads `package.json`, `README.md`, `AGENTS.md`, `CRUSH.md`, source files, git log, config files
2. **Creates the `memory-bank/` directory** at the project root with all 6 core files:
   - `projectbrief.md` â€” Core mission, scope, goals, non-negotiables
   - `productContext.md` â€” Why this exists, user problems solved, user journeys
   - `activeContext.md` â€” CURRENT FOCUS, active decisions, recent changes, immediate next steps
   - `systemPatterns.md` â€” Architecture, component structure, design patterns, data flows
   - `techContext.md` â€” Tech stack, dependencies, runtime constraints, env setup
   - `progress.md` â€” What works, what is built, known bugs, roadmap
3. **Populates each file** with verified details from the current codebase
4. **Links to skills** â€” records which skills are active for this project

## Memory Bank File Locations

The memory-bank lives at `<project-root>/memory-bank/`. For OpenCode/Crush, also check:
- Global: `~/.config/opencode/memory-bank/` or `~/.config/crush/memory-bank/`
- Project: `<cwd>/memory-bank/`

## How to run /memory init

When invoked:
1. Ask: "What is this project's primary goal?" (if not obvious from README)
2. Scan key files (`package.json`, `README.md`, `src/`, `app/`, `main.go`, etc.)
3. Generate all 6 memory-bank files
4. Output a summary of what was created
5. Offer to set up `/memory update` workflow for ongoing sync

## Integration

- **meta-orchestrator** â€” reads `activeContext.md` on session start for situational awareness
- **test-driven-development** â€” records test patterns in `systemPatterns.md`
- **browser** â€” records site selectors, auth state, and learned patterns in `systemPatterns.md`
- **plan** â€” checkpoints and steps get tracked in `progress.md`

Base directory for this skill: C:\Users\apuro\.config\opencode\skills


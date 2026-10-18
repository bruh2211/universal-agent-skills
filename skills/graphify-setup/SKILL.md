---
name: graphify-setup
description: "Sets up Graphify: incremental codebase knowledge-graph indexing into graphify-out/ for symbol lookup, dependency tracing, and architectural queries. Use for 'set up graphify', 'index the codebase as a graph'."
---

# ðŸ“Š Graphify â€” Codebase Knowledge Graph Setup

Graphify is not currently installed on this system (not in PATH, and node/npm are not available). Here's how to set it up for an ultra-power-user OpenCode/Crush workflow.

## What Graphify does

- Incrementally indexes your codebase into a knowledge graph (`graphify-out/`)
- Enables cross-file symbol lookup, dependency tracing, and architectural queries
- The meta-orchestrator's updater script checks for `graphify-out/` and runs `graphify . --update` to keep it fresh

## Installation Options

### Option A: Install Node.js + graphify (recommended)
1. Install Node.js from https://nodejs.org/
2. `npm install -g graphify`
3. Run in your project: `graphify . --update`

### Option B: Use npx (if npm is available)
`npx graphify . --update`

### Option C: Skip graphify â€” use Memory Bank instead
Without graphify, the Memory Bank (`memory-bank/systemPatterns.md`) serves the same architectural continuity purpose. The meta-orchestrator updater will report "Graphify CLI not currently in PATH" gracefully and continue.

## Verification

After installing, run:
```
graphify . --update
```
Then check for `graphify-out/graph.json` and `graphify-out/graph.html` in your project root.

## Integration

- **meta-orchestrator** (`/update-skills`) â€” auto-detects `graphify-out/` and runs incremental re-index
- **memory-bank** â€” complementary architectural documentation
- **tools-discovery** â€” graphify is listed as a Tier 3 power-user add-on

Base directory for this skill: C:\Users\apuro\.config\opencode\skills


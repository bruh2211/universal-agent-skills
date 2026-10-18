# 🌐 Universal Open-Agent Meta-Orchestrator & Dynamic Skill Suite

> **Run anywhere:** Compatible with **Claude Code** (CLI), **Google Antigravity & Antigravity 2.0** (IDE), **Cursor**, **Windsurf**, and any AI coding assistant supporting open agent standards (`AGENTS.md` & `SKILL.md`).

---

## ⚡ What is This?

Modern AI coding agents reset between conversations, forget architectural context, and often produce generic "AI-slop" code unless strictly guided.

This repository provides a **Universal Meta-Orchestration Layer** that transforms any coding agent into a disciplined, self-steering software engineer:
1. **Dynamic Skill Router**: Automatically routes user prompts to the best skill without hardcoding. If you or your team add a *new* skill tomorrow, the orchestrator indexes and handles it automatically.
2. **Adaptive Memory Bank Protocol**: Enforces cross-session continuity (`memory-bank/activeContext.md`) so your agent never forgets past architectural decisions or open bugs.
3. **Disciplined Engineering Lifecycle**: Enforces Test-Driven Development (TDD: Red-Green-Refactor) and semantic commits (`conventional-commits`) before any code is declared done.
4. **Automated Maintenance**: Incrementally synchronizes codebase knowledge graphs (`graphify --update`) and checks upstream skill repositories for updates (`/update-skills`).

---

## 📦 The Recommended Baseline Skillpack

When you install this suite, you receive the complete battle-tested baseline stack inside `skills/`:

| Skill | Role | Problem Solved |
| :--- | :--- | :--- |
| **`meta-orchestrator`** | Autonomous Intent Router & Coordinator | Automatically picks the right skill for your task; displays `🎯 [Using: ...]` badge. |
| **`memory-bank`** | Persistent Cross-Session Memory | Eliminates "groundhog day" amnesia by saving project state to local markdown files. |
| **`test-driven-development`** | TDD Red-Green-Refactor Protocol | Enforces failing tests before implementation code, ensuring high fault tolerance. |
| **`conventional-commits`** | Release & Git Hygiene | Generates semantic commits (`feat:`, `fix:`, `refactor:`) following Conventional Commits. |
| **`design-taste-frontend`** | Anti-Slop UI Art Direction (v2) | Replaces generic templates and purple gradients with intentional typography and layout rhythm. |
| **`awesome-design`** | Design System Tokens & States | Enforces optical spacing, elevation tokens, and all 6 interactive component states. |
| **`web-design-guidelines`** | UI Compliance & Accessibility Audit | Audits code against Vercel Web Interface Guidelines and WCAG contrast/aria standards. |
| **`image-to-code`** | Visual Translation Engine | Turns UI screenshots, wireframes, and Figma comps directly into clean frontend code. |

---

## 🚀 Quickstart: 1-Click Installation

Clone this repository and run the installer for your environment:

### On Windows (PowerShell)
```powershell
git clone https://github.com/your-username/universal-agent-orchestrator.git
cd universal-agent-orchestrator

# Install to ALL supported agents (Antigravity, Claude Code, Cursor)
.\scripts\install.ps1 -Target all

# Or target a specific agent:
.\scripts\install.ps1 -Target antigravity
.\scripts\install.ps1 -Target claude
.\scripts\install.ps1 -Target cursor
.\scripts\install.ps1 -Target workspace
```

### On macOS / Linux (Bash)
```bash
git clone https://github.com/your-username/universal-agent-orchestrator.git
cd universal-agent-orchestrator

# Install to all environments
chmod +x ./scripts/install.sh
./scripts/install.sh all
```

---

## 🧩 Adding Any Future Skill (Dynamic Discovery)

The Meta-Orchestrator has **zero hardcoded skill lists**. To teach your agents a new capability:

1. Create a folder inside `skills/<your-skill-name>/`
2. Add a `SKILL.md` with standard YAML frontmatter:
   ```markdown
   ---
   name: your-skill-name
   description: Specific description of what this skill does and when the agent should use it.
   ---
   # Instructions
   ...
   ```
3. That's it! The orchestrator's dynamic engine automatically discovers it, indexes the description, and routes user prompts to it whenever applicable.

---

## 🛠️ Free Companion MCP Tools (Recommended)

To supercharge your agent's context and retrieval, we recommend enabling these 100% free, local-first MCP servers:
* **`repomix`** (`npx -y repomix --mcp`): Whole-repository context packing with Tree-sitter code compression (~70% token savings).
* **`memory`** (`npx -y @modelcontextprotocol/server-memory`): Official Knowledge Graph memory server storing persistent entities and relations locally.
* **`context7`** (`npx -y @upstash/context7-mcp`): Live, version-exact documentation lookup for libraries and APIs.

---

## 📄 License
MIT — free for individuals, teams, and open-source contributors.

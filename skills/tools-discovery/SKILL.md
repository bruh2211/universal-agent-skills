---
name: tools-discovery
description: "Curated tiered catalog of powerful skills, MCP servers, and tools for an ultra power-user OpenCode/Crush setup. Use for 'what skills or tools should I install', 'best MCP servers', 'set up my agent stack'."
---

# ðŸ”§ Best Skills & Tools for OpenCode / Crush (Ultra Power User Setup)

You are an agent skills architect. This document lists the most powerful skills, MCP servers, and tools to install for a 15X OpenCode/Crush experience.

## Tier 1: Essential Skills (install first)

| Skill | ID | Why | Install Source |
|-------|----|-----|----------------|
| Meta-Orchestrator | `meta-orchestrator` | Dynamic skill routing + TDD + memory lifecycle | `epic-pascal/skills/meta-orchestrator` |
| Memory Bank | `memory-bank` | Persistent cross-session context | `epic-pascal/skills/memory-bank` |
| TDD | `test-driven-development` | Red-Green-Refactor enforcement | `epic-pascal/skills/test-driven-development` |
| Conventional Commits | `conventional-commits` | Semantic commit hygiene | `epic-pascal/skills/conventional-commits` |
| Design Taste Frontend | `design-taste-frontend` | Anti-slop premium UI art direction | `epic-pascal/skills/design-taste-frontend` |
| Awesome Design | `awesome-design` | Design system tokens & elevation | `epic-pascal/skills/awesome-design` |
| Web Design Guidelines | `web-design-guidelines` | WCAG/a11y compliance audit | `epic-pascal/skills/web-design-guidelines` |
| Image-to-Code | `image-to-code` | Image-first frontend implementation | `epic-pascal/skills/image-to-code` |
| Browser | `browser` | Full Chromium automation + auth | Custom (this config) |
| /plan | `plan` | Project planning & checkpoints | Custom (this config) |
| /boost | `boost` | Performance & capability enhancement | Custom (this config) |
| /teamwork | `teamwork` | Multi-agent coordination | Custom (this config) |
| /grill | `grill` | Rigorous code review & critique | Custom (this config) |
| Voice Mode | `voice-mode` | STT + TTS for OpenCode | Custom (this config) |

## Tier 2: Recommended MCP Servers

| MCP | Purpose | Transport |
|-----|---------|-----------|
| context7 | Live, version-exact library docs | HTTP (already configured âœ…) |
| vercel | Vercel deployment & AI SDK | HTTP (already configured âœ…) |
| filesystem | Read/write local files | stdio |
| memory | Official Knowledge Graph memory server | stdio (`@modelcontextprotocol/server-memory`) |
| github | GitHub API integration | HTTP (OAuth supported) |
| puppeteer | Browser automation (complement to /browser) | stdio |
| sequential-thinking | Complex reasoning decomposition | stdio |
| slack | Team notifications | HTTP |
| linear | Issue tracking | HTTP (OAuth) |

## Tier 3: Power User Add-ons

| Tool | Purpose |
|------|---------|
| graphify | Codebase knowledge graph (`graphify . --update`) |
| repomix | Whole-repo context packing (~70% token savings) |
| crush | Upgrade from OpenCode to Crush (28.7k stars, actively maintained) |
| hyper.charm.land | Official Crush model provider (free tier, ZDR) |
| git-cliff | Changelog generation from conventional commits |

## Installation Commands

```powershell
# 1. Install Crush (recommended upgrade from OpenCode)
winget install charmbracelet.crush
# or: scoop bucket add charm https://github.com/charmbracelet/scoop-bucket.git && scoop install crush

# 2. Install recommended MCP servers (stdio)
npm install -g @modelcontextprotocol/server-memory
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-sequential-thinking

# 3. Install graphify (knowledge graph)
npm install -g graphify  # or check https://github.com/... for graphify

# 4. Install repomix
npm install -g repomix

# 5. Copy all skills to Crush global skills dir
mkdir -Force "$env:LOCALAPPDATA\crush\skills"
Copy-Item "C:\Users\apuro\.config\opencode\skills\*" "$env:LOCALAPPDATA\crush\skills\" -Recurse -Force

# 6. Copy all commands to Crush
mkdir -Force "$env:LOCALAPPDATA\crush\commands"
Copy-Item "C:\Users\apuro\.config\opencode\commands\*" "$env:LOCALAPPDATA\crush\commands\" -Recurse -Force
```

## Skill Discovery Paths (Crush)

Crush looks for skills in these locations (in priority order):

```
$CRUSH_SKILLS_DIR
$XDG_CONFIG_HOME/agents/skills  â†’  ~/.config/agents/skills/
$XDG_CONFIG_HOME/crush/skills   â†’  ~/.config/crush/skills/
~/.agents/skills/
~/.claude/skills/
%LOCALAPPDATA%\agents\skills\
%LOCALAPPDATA%\crush\skills\
%USERPROFILE%\AppData\Local\crush\skills\   â† Windows global
```

Project-level (per repo):
```
.agents/skills
.crush/skills
.claude/skills
.cursor/skills
```

## To make skills user-invocable (appear in Ctrl+K palette)

Add `user-invocable: true` to the SKILL.md YAML frontmatter:

```
---
name: my-skill
description: What it does
user-invocable: true
---
```

Base directory for this skill: C:\Users\apuro\.config\opencode\skills


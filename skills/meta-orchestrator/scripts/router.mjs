#!/usr/bin/env node

/**
 * Universal Dynamic Skill Router
 * Scans all installed SKILL.md files, parses descriptions, and dynamically routes
 * user prompts to the most suitable skill(s) without hardcoding.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Potential skill locations across environments
const USER_HOME = process.env.USERPROFILE || process.env.HOME || '';

// Potential skill locations across environments.
// Order matters: earlier entries win for identically-named skills in discoverSkills().
const DEFAULT_SKILL_PATHS = [
  path.resolve(__dirname, '..', '..'),                    // OpenCode global skills root (~/.config/opencode/skills)
  path.resolve(__dirname, '..'),                          // Parent dir fallback (inline skill folder)
  path.join(USER_HOME, '.config/opencode/skills'),        // OpenCode global (env-resolved)
  path.join(USER_HOME, '.agents/skills'),                 // Cross-agent global skills
  path.join(USER_HOME, '.claude/skills'),                 // Claude Code
  path.join(USER_HOME, '.gemini/config/skills'),          // Gemini CLI
  path.join(USER_HOME, '.cursor/skills'),                 // Cursor
  path.resolve(process.cwd(), '.agents/skills'),          // Workspace skills
  path.resolve(process.cwd(), 'skills')
];

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const raw = match[1];
  
  const nameMatch = raw.match(/^name:\s*(.+)$/m);
  const descMatch = raw.match(/^description:\s*(?:>-|>)?\r?\n?([\s\S]*?)(?=\n[a-zA-Z0-9_-]+:|$)/m);

  return {
    name: nameMatch ? nameMatch[1].trim().replace(/^['"]|['"]$/g, '') : null,
    description: descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : ''
  };
}

export function discoverSkills(customDir = null) {
  const searchDirs = customDir ? [path.resolve(customDir)] : DEFAULT_SKILL_PATHS;
  const skills = new Map();

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const skillFile = path.join(dir, entry.name, 'SKILL.md');
        if (fs.existsSync(skillFile)) {
          const content = fs.readFileSync(skillFile, 'utf8');
          const meta = parseFrontmatter(content);
          if (meta && meta.name) {
            // First source wins: the OpenCode global dir outranks editor copies
            // (.gemini/.claude/.cursor) of the same skill.
            if (!skills.has(meta.name)) {
              skills.set(meta.name, {
                name: meta.name,
                description: meta.description,
                path: skillFile,
                dir: path.dirname(skillFile)
              });
            }
          }
        }
      }
    } catch {
      // Ignore inaccessible directories
    }
  }

  return Array.from(skills.values());
}

export function routePrompt(query, skills = null) {
  if (!skills) skills = discoverSkills();
  if (!query || typeof query !== 'string') {
    return { selected: [], badge: '', protocols: [] };
  }

  const queryLower = query.toLowerCase();
  const queryTokens = new Set(queryLower.split(/[^a-zA-Z0-9_-]+/).filter(t => t.length > 2));

  const scored = [];

  for (const skill of skills) {
    if (skill.name === 'meta-orchestrator') continue;

    let score = 0;
    const descLower = skill.description.toLowerCase();
    const nameLower = skill.name.toLowerCase();

    // Direct name mention
    if (queryLower.includes(nameLower)) score += 50;

    // Token overlap in description
    for (const token of queryTokens) {
      if (nameLower.includes(token)) score += 15;
      if (descLower.includes(token)) score += 5;
    }

    // Domain heuristic boosters

    // Ponytail / lean engineering
    if (/ponytail|yagni|lazy|over.?engineer|over.?build|bloat|simplest|smallest|minimal/i.test(queryLower)) {
      if (/ponytail|lazy|yagni|simplest|over-?engineering|bloat|smallest change/i.test(skill.name + ' ' + descLower)) score += 45;
    }

    // Code review vs UI-guideline disambiguation
    if (/code review|review this|review the|review my|\bpr\b|pull request|diff/i.test(queryLower)) {
      if (/review this change|review the current changes|quality review/i.test(descLower)) score += 30;
      if (/web.?design|interface guidelines|\bui\b/i.test(descLower) && !/code/i.test(descLower)) score -= 10;
    }
    if (/audit|whole repo|entire codebase|whole codebase|scope creep|what can i delete/i.test(queryLower)) {
      if (/audit/i.test(skill.name + ' ' + descLower)) score += 35;
    }

    // Deferred work / debt ledger
    if (/\bdebt\b|shortcut|deferred|defer|later note/i.test(queryLower)) {
      if (/\bdebt\b|shortcut|deferred/i.test(skill.name + ' ' + descLower)) score += 50;
    }

    // Office documents
    if (/docx|word doc|\bdocx\b/i.test(queryLower)) {
      if (/docx|word document/i.test(skill.name + ' ' + descLower)) score += 50;
    }
    if (/\bpdf\b/i.test(queryLower)) {
      if (/\bpdf\b/i.test(skill.name + ' ' + descLower)) score += 50;
    }
    if (/pptx|\bslide|deck|presentation/i.test(queryLower)) {
      if (/pptx|slide|deck|presentation/i.test(skill.name + ' ' + descLower)) score += 50;
    }
    if (/xlsx|excel|spreadsheet|\bcsv\b|\bcsvs\b/i.test(queryLower)) {
      if (/xlsx|spreadsheet/i.test(skill.name + ' ' + descLower)) score += 50;
    }

    // MCP server construction
    if (/\bmcp\b|model context protocol/i.test(queryLower)) {
      if (/mcp|model context protocol|external api/i.test(skill.name + ' ' + descLower)) score += 40;
    }

    // Superpowers workflow stages
    if (/brainstorm|i(?:dea|deas)|approaches|design options|before build/i.test(queryLower)) {
      if (/brainstorm|creative work|plan anything new/i.test(descLower)) score += 35;
    }
    if (/plan|roadmap|break down|multi.?step/i.test(queryLower)) {
      if (/writing-plans|implementation plan|executing an implementation plan/i.test(descLower)) score += 25;
    }
    if (/parallel|independent tasks|concurrent tasks/i.test(queryLower)) {
      if (/parallel|independent tasks/i.test(descLower)) score += 35;
    }
    if (/worktree|isolat/i.test(queryLower)) {
      if (/worktree|isolated workspace/i.test(skill.name + ' ' + descLower)) score += 40;
    }
    if (/claim|actually works|prove|verify(?: that)? (?:it )?(?:works|passes|fixes)/i.test(queryLower)) {
      if (/verification|evidence before assertions/i.test(descLower)) score += 40;
    }

    // New command pack boosters
    if (/boost|make it faster|performance boost|capacity/i.test(queryLower)) {
      if (/\bboost\b|performance and capability/i.test(skill.name + ' ' + descLower)) score += 45;
    }
    if (/grill|critique|tear (?:this|it) apart|stress.?test|ruthless review/i.test(queryLower)) {
      if (/grill|rigorous(?: code)? review|constructive criticism/i.test(skill.name + ' ' + descLower)) score += 45;
    }
    if (/roadmap|milestones?\b|project plan|checkpoints?\b|phases?\b/i.test(queryLower)) {
      if (/roadmap|milestones|checkpoints|project planning/i.test(skill.name + ' ' + descLower)) score += 40;
    }
    if (/coordinate|multi.?agent|team (?:up|work)|split across|agents (?:to|on)/i.test(queryLower)) {
      if (/multi-?agent|team coordination|cross-agent|sub-tasks/i.test(skill.name + ' ' + descLower)) score += 40;
    }

    // Library / framework docs lookup
    if (/install|set ?up|integrate|library|framework|\bsdk\b|docs for|api reference|how do i add/i.test(queryLower)) {
      if (/documentation|docs|live|framework|api referenc/i.test(descLower)) score += 35;
    }

    if (/ui|design|frontend|landing|component|button|color|theme|css|tailwind|html|hero|card/i.test(queryLower)) {
      if (/design|taste|ui|frontend|css|style|interface/i.test(skill.name + ' ' + descLower)) score += 20;
    }

    if (/audit|accessibility|wcag|contrast|guideline|aria/i.test(queryLower)) {
      if (/guideline|audit|accessibility|wcag/i.test(skill.name + ' ' + descLower)) score += 30;
    }

    if (/image|photo|screenshot|figma|mockup|wireframe|png|jpg/i.test(queryLower)) {
      if (/image|screenshot|mockup/i.test(skill.name + ' ' + descLower)) score += 30;
    }

    if (/commit|pr|pull request|git message/i.test(queryLower)) {
      if (/commit|git/i.test(skill.name + ' ' + descLower)) score += 40;
    }

    if (/test|tdd|bug|fix|refactor|unit test|jest|pytest|spec/i.test(queryLower)) {
      if (/test|tdd/i.test(skill.name + ' ' + descLower)) score += 30;
    }

    if (/remember|context|memory|progress|architecture|status|session/i.test(queryLower)) {
      if (/memory|context/i.test(skill.name + ' ' + descLower)) score += 35;
    }

    if (score > 10) {
      scored.push({ name: skill.name, score, description: skill.description });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, 3).map(s => s.name);

  // Protocols enforcement
  const protocols = [];
  const isCodingTask = /fix|bug|implement|build|create|add|refactor|function|api|component|service|endpoint/i.test(queryLower);

  if (isCodingTask) {
    if (!selected.includes('memory-bank') && skills.some(s => s.name === 'memory-bank')) {
      protocols.push('memory-bank:check-active-context');
    }
    if (!selected.includes('test-driven-development') && skills.some(s => s.name === 'test-driven-development')) {
      protocols.push('tdd:red-green-refactor');
    }
  }

  const badgeSkills = Array.from(new Set([...selected]));
  const badge = badgeSkills.length > 0 ? `🎯 [Orchestrator: ${badgeSkills.join(' + ')}]` : '';

  return {
    query,
    selected: badgeSkills,
    protocols,
    badge,
    candidatesCount: skills.length
  };
}

// CLI Mode
const args = process.argv.slice(2);
if (args.includes('--list')) {
  const skills = discoverSkills();
  console.log(JSON.stringify(skills, null, 2));
} else {
  const queryIndex = args.indexOf('--query');
  const query = queryIndex !== -1 ? args.slice(queryIndex + 1).join(' ') : args.join(' ');
  const result = routePrompt(query);
  console.log(JSON.stringify(result, null, 2));
}

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
const DEFAULT_SKILL_PATHS = [
  path.resolve(__dirname, '../../skills'), // Workspace package skills
  path.resolve(__dirname, '..'),           // Parent skills dir
  path.join(process.env.USERPROFILE || process.env.HOME || '', '.gemini/config/skills'),
  path.join(process.env.USERPROFILE || process.env.HOME || '', '.claude/skills'),
  path.join(process.env.USERPROFILE || process.env.HOME || '', '.cursor/skills'),
  path.resolve(process.cwd(), '.agents/skills'),
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
            skills.set(meta.name, {
              name: meta.name,
              description: meta.description,
              path: skillFile,
              dir: path.dirname(skillFile)
            });
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

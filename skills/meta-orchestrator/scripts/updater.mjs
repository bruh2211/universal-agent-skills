#!/usr/bin/env node

/**
 * Universal Agent Skill & Context Updater
 * Checks installed skills for upstream git updates, runs incremental Graphify re-indexing,
 * and audits Memory Bank health across workspaces.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { discoverSkills } from './router.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runUpdates() {
  console.log('🔄 [Universal Updater] Scanning environment for skills and context graphs...\n');

  const report = {
    skillsChecked: 0,
    skillsUpdated: [],
    graphsUpdated: [],
    memoryBankStatus: null,
    mcpStatus: []
  };

  // 1. Scan and Update Skills
  const skills = discoverSkills();
  report.skillsChecked = skills.length;

  for (const skill of skills) {
    const gitDir = path.join(skill.dir, '.git');
    if (fs.existsSync(gitDir)) {
      try {
        console.log(`Checking upstream git for ${skill.name}...`);
        const output = execSync('git pull --ff-only', { cwd: skill.dir, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
        if (!output.includes('Already up to date')) {
          report.skillsUpdated.push({ name: skill.name, status: output });
        }
      } catch (err) {
        // Skip git errors on submodules or detached heads
      }
    }
  }

  // 2. Incremental Graphify Sync
  const workspaceRoot = process.cwd();
  const graphifyOut = path.join(workspaceRoot, 'graphify-out');

  if (fs.existsSync(graphifyOut)) {
    console.log('🔍 Found existing Graphify knowledge graph. Running incremental sync...');
    try {
      execSync('graphify . --update', { cwd: workspaceRoot, stdio: 'inherit' });
      report.graphsUpdated.push('graphify: incremental update completed');
    } catch {
      console.log('⚠️ Graphify CLI not currently in PATH or failed to re-index.');
    }
  }

  // 3. Memory Bank Health Audit
  const memoryBankDir = path.join(workspaceRoot, 'memory-bank');
  if (fs.existsSync(memoryBankDir)) {
    const requiredFiles = ['projectbrief.md', 'productContext.md', 'activeContext.md', 'systemPatterns.md', 'techContext.md', 'progress.md'];
    const missing = requiredFiles.filter(f => !fs.existsSync(path.join(memoryBankDir, f)));
    report.memoryBankStatus = {
      present: true,
      intact: missing.length === 0,
      missingFiles: missing
    };
  } else {
    report.memoryBankStatus = { present: false, note: 'Initialize with /memory init' };
  }

  // 4. Output Summary
  console.log('\n=========================================');
  console.log('📊 Universal Agent Update Summary');
  console.log('=========================================');
  console.log(`Total Skills Discovered: ${report.skillsChecked}`);
  if (report.skillsUpdated.length > 0) {
    console.log(`Updated Skills: ${report.skillsUpdated.map(s => s.name).join(', ')}`);
  } else {
    console.log('All installed skills are up to date.');
  }

  if (report.graphsUpdated.length > 0) {
    console.log(`Knowledge Graph: ${report.graphsUpdated.join(', ')}`);
  }

  console.log(`Memory Bank: ${report.memoryBankStatus.present ? (report.memoryBankStatus.intact ? 'Healthy ✅' : 'Missing files: ' + report.memoryBankStatus.missingFiles.join(', ')) : 'Not initialized in this project'}`);
  console.log('=========================================\n');

  return report;
}

if (process.argv[1] && process.argv[1].endsWith('updater.mjs')) {
  runUpdates();
}

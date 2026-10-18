<#
.SYNOPSIS
    Universal 1-Line Remote & Local Installer for Universal Agent Meta-Orchestrator
.DESCRIPTION
    Installs the Meta-Orchestrator and Recommended Baseline Skills into:
    - Google Antigravity & Antigravity 2.0 (~/.gemini/config/)
    - Claude Code (~/.claude/)
    - Cursor (~/.cursor/)
    - Workspace (.agents/ and AGENTS.md)
.EXAMPLE
    irm https://raw.githubusercontent.com/bruh2211/universal-agent-skills/main/install.ps1 | iex
#>

param (
    [ValidateSet("all", "antigravity", "claude", "cursor", "workspace")]
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Universal Agent Meta-Orchestrator Installer" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$tempCleanup = $false
$scriptDir = $PSScriptRoot

if ($scriptDir -and (Test-Path (Join-Path $scriptDir "skills"))) {
    $sourceRoot = $scriptDir
} elseif ($scriptDir -and (Test-Path (Join-Path $scriptDir "..\skills"))) {
    $sourceRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path
} else {
    Write-Host "🌐 Remote installation detected. Fetching latest skill bundle..." -ForegroundColor Yellow
    $tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("uas-" + [System.Guid]::NewGuid().ToString("N"))
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    git clone --depth 1 https://github.com/bruh2211/universal-agent-skills.git $tempDir | Out-Null
    $sourceRoot = $tempDir
    $tempCleanup = $true
}

$skillsSource = Join-Path $sourceRoot "skills"
$agentsMdSource = Join-Path $sourceRoot "AGENTS.md"

$userHome = [Environment]::GetFolderPath("UserProfile")

$destinations = @{}
if ($Target -eq "all" -or $Target -eq "antigravity") {
    $destinations["Google Antigravity"] = @{
        SkillsDir = Join-Path $userHome ".gemini\config\skills"
        RulesFile = Join-Path $userHome ".gemini\config\AGENTS.md"
    }
}
if ($Target -eq "all" -or $Target -eq "claude") {
    $destinations["Claude Code"] = @{
        SkillsDir = Join-Path $userHome ".claude\skills"
        RulesFile = Join-Path $userHome ".claude\CLAUDE.md"
    }
}
if ($Target -eq "all" -or $Target -eq "cursor") {
    $destinations["Cursor IDE"] = @{
        SkillsDir = Join-Path $userHome ".cursor\skills"
        RulesFile = $null
    }
}
if ($Target -eq "workspace") {
    $destinations["Local Workspace"] = @{
        SkillsDir = Join-Path (Get-Location) ".agents\skills"
        RulesFile = Join-Path (Get-Location) "AGENTS.md"
    }
}

try {
    foreach ($platName in $destinations.Keys) {
        $dest = $destinations[$platName]
        $skillsDst = $dest.SkillsDir

        Write-Host "📦 Installing to $platName..." -ForegroundColor Yellow

        if (!(Test-Path $skillsDst)) {
            New-Item -ItemType Directory -Path $skillsDst -Force | Out-Null
        }

        $skills = Get-ChildItem -Path $skillsSource -Directory
        foreach ($skill in $skills) {
            $targetPath = Join-Path $skillsDst $skill.Name
            Copy-Item -Path $skill.FullName -Destination $targetPath -Recurse -Force
            Write-Host "  ✅ Installed $($skill.Name)" -ForegroundColor Green
        }

        if ($dest.RulesFile) {
            $rulesDir = Split-Path $dest.RulesFile -Parent
            if (!(Test-Path $rulesDir)) { New-Item -ItemType Directory -Path $rulesDir -Force | Out-Null }
            Copy-Item -Path $agentsMdSource -Destination $dest.RulesFile -Force
            Write-Host "  📄 Updated universal rules at $($dest.RulesFile)" -ForegroundColor Green
        }

        Write-Host ""
    }

    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "🎉 Universal Meta-Orchestrator Successfully Installed!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Active Baseline Skills:" -ForegroundColor Cyan
    Write-Host "  - meta-orchestrator (Dynamic Intent Router)" -ForegroundColor Gray
    Write-Host "  - memory-bank (Cross-Session Persistent Memory)" -ForegroundColor Gray
    Write-Host "  - test-driven-development (TDD Engineering Gate)" -ForegroundColor Gray
    Write-Host "  - conventional-commits (Git Hygiene)" -ForegroundColor Gray
    Write-Host "  - design-taste-frontend (Anti-Slop Art Direction)" -ForegroundColor Gray
    Write-Host "  - awesome-design (Design System Tokens & States)" -ForegroundColor Gray
    Write-Host "  - web-design-guidelines (UI Compliance & Audit)" -ForegroundColor Gray
    Write-Host "  - image-to-code (Visual Translation)" -ForegroundColor Gray
    Write-Host "`nReady to use across Claude Code, Antigravity, and Cursor!" -ForegroundColor Green
    Write-Host "==========================================================`n" -ForegroundColor Green
} finally {
    if ($tempCleanup -and (Test-Path $sourceRoot)) {
        Remove-Item -Path $sourceRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}

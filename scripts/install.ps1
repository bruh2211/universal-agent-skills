<#
.SYNOPSIS
    Universal Installer for Open-Agent Meta-Orchestrator & Baseline Skills Suite
.DESCRIPTION
    Installs the Meta-Orchestrator and baseline skills into Google Antigravity,
    Claude Code, Cursor, or your local project workspace.
.PARAMETER Target
    Target platform: "all", "antigravity", "claude", "cursor", or "workspace"
#>

param (
    [ValidateSet("all", "antigravity", "claude", "cursor", "workspace")]
    [string]$Target = "all",
    [switch]$Symlink
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$skillsSource = Join-Path $repoRoot "skills"
$agentsMdSource = Join-Path $repoRoot "AGENTS.md"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Universal Agent Meta-Orchestrator Installer" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Source: $repoRoot" -ForegroundColor Gray
Write-Host "Target: $Target`n" -ForegroundColor Gray

# Target directories map
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

# Install function
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
        if ($Symlink) {
            if (Test-Path $targetPath) { Remove-Item -Path $targetPath -Recurse -Force }
            New-Item -ItemType SymbolicLink -Path $targetPath -Target $skill.FullName | Out-Null
            Write-Host "  🔗 Linked $($skill.Name)" -ForegroundColor DarkGray
        } else {
            Copy-Item -Path $skill.FullName -Destination $targetPath -Recurse -Force
            Write-Host "  ✅ Installed $($skill.Name)" -ForegroundColor Green
        }
    }

    if ($dest.RulesFile) {
        $rulesDir = Split-Path $dest.RulesFile -Parent
        if (!(Test-Path $rulesDir)) { New-Item -ItemType Directory -Path $rulesDir -Force | Out-Null }
        Copy-Item -Path $agentsMdSource -Destination $dest.RulesFile -Force
        Write-Host "  📄 Updated master rule at $($dest.RulesFile)" -ForegroundColor Green
    }

    Write-Host ""
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Recommended Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test skill routing: node $($repoRoot)\skills\meta-orchestrator\scripts\router.mjs --query 'build a responsive navbar'" -ForegroundColor Gray
Write-Host "2. Recommended companion MCP tools (Free & Open Source):" -ForegroundColor Cyan
Write-Host "   - repomix: npx -y repomix --mcp" -ForegroundColor Gray
Write-Host "   - memory:  npx -y @modelcontextprotocol/server-memory" -ForegroundColor Gray
Write-Host "==========================================================`n" -ForegroundColor Green

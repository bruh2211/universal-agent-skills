#!/usr/bin/env bash
set -e

# Universal Installer for Open-Agent Meta-Orchestrator & Baseline Skills Suite (macOS / Linux)

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_SRC="$REPO_ROOT/skills"
AGENTS_MD="$REPO_ROOT/AGENTS.md"
TARGET="${1:-all}"

echo -e "\033[1;36m==========================================================\033[0m"
echo -e "\033[1;36m🚀 Universal Agent Meta-Orchestrator Installer\033[0m"
echo -e "\033[1;36m==========================================================\033[0m"
echo -e "Source: $REPO_ROOT"
echo -e "Target: $TARGET\n"

install_to() {
  local PLATFORM="$1"
  local SKILLS_DST="$2"
  local RULES_FILE="$3"

  echo -e "\033[1;33m📦 Installing to $PLATFORM...\033[0m"
  mkdir -p "$SKILLS_DST"

  for skill_dir in "$SKILLS_SRC"/*; do
    if [ -d "$skill_dir" ]; then
      local skill_name="$(basename "$skill_dir")"
      rm -rf "$SKILLS_DST/$skill_name"
      cp -R "$skill_dir" "$SKILLS_DST/$skill_name"
      echo -e "  \033[0;32m✅ Installed $skill_name\033[0m"
    fi
  done

  if [ -n "$RULES_FILE" ]; then
    mkdir -p "$(dirname "$RULES_FILE")"
    cp "$AGENTS_MD" "$RULES_FILE"
    echo -e "  \033[0;32m📄 Updated master rule at $RULES_FILE\033[0m"
  fi
  echo ""
}

if [ "$TARGET" = "all" ] || [ "$TARGET" = "antigravity" ]; then
  install_to "Google Antigravity" "$HOME/.gemini/config/skills" "$HOME/.gemini/config/AGENTS.md"
fi

if [ "$TARGET" = "all" ] || [ "$TARGET" = "claude" ]; then
  install_to "Claude Code" "$HOME/.claude/skills" "$HOME/.claude/CLAUDE.md"
fi

if [ "$TARGET" = "all" ] || [ "$TARGET" = "cursor" ]; then
  install_to "Cursor IDE" "$HOME/.cursor/skills" ""
fi

if [ "$TARGET" = "workspace" ]; then
  install_to "Local Workspace" "$(pwd)/.agents/skills" "$(pwd)/AGENTS.md"
fi

echo -e "\033[1;32m==========================================================\033[0m"
echo -e "\033[1;32m🎉 Installation Complete!\033[0m"
echo -e "\033[1;32m==========================================================\033[0m"

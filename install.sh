#!/usr/bin/env bash
set -e

# Universal 1-Line Remote & Local Installer for Universal Agent Meta-Orchestrator
# Example: curl -fsSL https://raw.githubusercontent.com/bruh2211/universal-agent-skills/main/install.sh | bash

TARGET="${1:-all}"
TEMP_CLEANUP=0

echo -e "\033[1;36m==========================================================\033[0m"
echo -e "\033[1;36m🚀 Universal Agent Meta-Orchestrator Installer\033[0m"
echo -e "\033[1;36m==========================================================\033[0m"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd)"

if [ -n "$SCRIPT_DIR" ] && [ -d "$SCRIPT_DIR/skills" ]; then
  SOURCE_ROOT="$SCRIPT_DIR"
elif [ -n "$SCRIPT_DIR" ] && [ -d "$SCRIPT_DIR/../skills" ]; then
  SOURCE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
else
  echo -e "\033[1;33m🌐 Remote installation detected. Fetching latest skill bundle...\033[0m"
  TEMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t 'uas')"
  git clone --depth 1 https://github.com/bruh2211/universal-agent-skills.git "$TEMP_DIR" >/dev/null 2>&1
  SOURCE_ROOT="$TEMP_DIR"
  TEMP_CLEANUP=1
fi

SKILLS_SRC="$SOURCE_ROOT/skills"
AGENTS_MD="$SOURCE_ROOT/AGENTS.md"

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
    echo -e "  \033[0;32m📄 Updated universal rules at $RULES_FILE\033[0m"
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

if [ "$TEMP_CLEANUP" -eq 1 ]; then
  rm -rf "$SOURCE_ROOT"
fi

echo -e "\033[1;32m==========================================================\033[0m"
echo -e "\033[1;32m🎉 Universal Meta-Orchestrator Successfully Installed!\033[0m"
echo -e "\033[1;32m==========================================================\033[0m"

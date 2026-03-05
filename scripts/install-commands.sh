#!/bin/bash
# Install HotKey Claude Code commands globally on this machine
# Run once per machine: bash scripts/install-commands.sh

set -e

COMMANDS_DIR="$HOME/.claude/commands"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_COMMANDS="$SCRIPT_DIR/../.claude/commands"

mkdir -p "$COMMANDS_DIR"

for cmd in "$REPO_COMMANDS"/*.md; do
  name=$(basename "$cmd")
  cp "$cmd" "$COMMANDS_DIR/$name"
  echo "Installed: /story ($COMMANDS_DIR/$name)"
done

echo ""
echo "Done. /story is now available in any Claude Code session on this machine."

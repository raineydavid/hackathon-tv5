#!/usr/bin/env bash

# ---------------------------------------------------------
# Agentics Hackathon Starter Script
# ---------------------------------------------------------

show_help() {
  echo ""
  echo "Agentics Hackathon Starter"
  echo "Usage: $0 {init|tools|status|mcp}"
  echo ""
  echo "  init     Initialize your hackathon project"
  echo "  tools    Browse and install available AI tools"
  echo "  status   Check project status"
  echo "  mcp      Start the MCP server for AI assistant integration"
  echo ""
}

case "$1" in
  init)
    echo "🚀 Initializing hackathon project..."
    npx agentics-hackathon init
    ;;
  tools)
    echo "🧰 Browsing and installing AI tools..."
    npx agentics-hackathon tools
    ;;
  status)
    echo "📊 Checking project status..."
    npx agentics-hackathon status
    ;;
  mcp)
    echo "🧩 Starting MCP server..."
    npx agentics-hackathon mcp
    ;;
  *)
    echo "❗ Unknown or missing command."
    show_help
    exit 1
    ;;
esac
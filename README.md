# Agentics Foundation TV5 Hackathon

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)  
[![npm version](https://img.shields.io/badge/npm-agentics--hackathon-red.svg)](https://www.npmjs.com/package/agentics-hackathon)  
[![Discord](https://img.shields.io/badge/Discord-Agentics-7289da.svg)](https://discord.agentics.org)

> **Build the future of agentic AI — Supported by Google Cloud**

The **Agentics Foundation TV5 Hackathon** repository provides CLI tools, MCP servers, and reference implementations for building agentic AI solutions. This includes the **AI Media Discovery** demo app showcasing the Agent-Ready Web (ARW) specification.

🌐 **Website:** https://agentics.org/hackathon  
💬 **Discord:** https://discord.agentics.org  
📦 **npm:** `npx agentics-hackathon`

---

## 🎯 The Challenge

Every night, millions spend up to **45 minutes deciding what to watch** — billions of hours lost globally.  
The problem isn’t lack of content; it’s fragmentation across platforms.

Your mission: Build agentic AI systems that solve real problems using Google Cloud, Gemini, Claude, and open-source tools.

---

## 🚀 Quick Start

```bash
# Initialize your hackathon project
npx agentics-hackathon init

# Browse and install 17+ AI tools
npx agentics-hackathon tools

# Check project status
npx agentics-hackathon status

# Start MCP server for AI assistant integration
npx agentics-hackathon mcp
```

---

## 🔁 Optional One-Command Starter Script

To simplify development, the repo includes a helper script that wraps all CLI commands.

```bash
# From the repo root
./scripts/hackathon.sh init     # Initialize project
./scripts/hackathon.sh tools    # Install AI tools
./scripts/hackathon.sh status   # View project status
./scripts/hackathon.sh mcp      # Start MCP server
```

Script source:

```bash
#!/usr/bin/env bash

show_help() {
  echo ""
  echo "Agentics Hackathon Starter"
  echo "Usage: $0 {init|tools|status|mcp}"
  echo ""
}

case "$1" in
  init)   npx agentics-hackathon init ;;
  tools)  npx agentics-hackathon tools ;;
  status) npx agentics-hackathon status ;;
  mcp)    npx agentics-hackathon mcp ;;
  *)      show_help ;;
esac
```

---

## 🏆 Hackathon Tracks

| Track | Description |
|-------|-------------|
| **Entertainment Discovery** | Solve the 45-minute decision problem — help users find what to watch |
| **Multi-Agent Systems** | Build collaborative AI agents with Google ADK & Vertex AI |
| **Agentic Workflows** | Create autonomous workflows using Claude, Gemini & orchestration tools |
| **Open Innovation** | Build anything agentic that makes an impact |

---

## ✨ Features

### 🛠 CLI Tool (`npx agentics-hackathon`)
- `init` — interactive project setup  
- `tools` — browse & install 17+ AI tools  
- `status` — project configuration overview  
- `info` — hackathon resources  
- `mcp` — start MCP server (stdio or SSE)  
- `discord` — join community  
- `help` — guides & examples  

### 🤖 MCP Server
Full Model Context Protocol implementation including:

- Tools:  
  `get_hackathon_info`, `get_tracks`, `get_available_tools`,  
  `get_project_status`, `check_tool_installed`, `get_resources`
- Resources: project metadata & track descriptions  
- Prompts: `hackathon_starter`, `choose_track`

### 📱 Demo Applications
| App | Description |
|-----|-------------|
| **Media Discovery** | AI-powered movie/TV semantic search built with ARW |
| **ARW Chrome Extension** | Tools for validating ARW compliance in websites |

### 📐 ARW Components
Includes specification, schemas, validators, badges, Next.js plugin, crawler SDK, and more.

---

## 📦 Repository Structure

```plaintext
hackathon-tv5/
├── src/                   # CLI + MCP server
│   ├── commands/          # init, tools, status, etc.
│   ├── mcp/               # MCP server + transports
│   ├── constants.ts       # tracks, tools
│   └── utils/             # shared utilities
│
├── apps/
│   ├── media-discovery/   # AI Media Discovery demo (Next.js + ARW)
│   └── arw-chrome-extension/
│
├── packages/              # Shared SDKs, schemas, validators
├── spec/                  # ARW Specification
├── docs/                  # Documentation
├── ai_docs/               # AI-focused docs
├── scripts/               # Build + helper scripts (includes starter script)
└── README.md
```

---

## 🔧 Available Tools (17+)

### AI Assistants
- Claude Code CLI  
- Gemini CLI  

### Orchestration & Agent Frameworks
- Claude Flow  
- Agentic Flow  
- Flow Nexus  
- Google ADK  

### Cloud Platform
- gcloud CLI  
- Vertex AI SDK  

### Databases & Memory
- RuVector  
- AgentDB  

### Synthesis & Advanced Tools
- Agentic Synth  
- Strange Loops  
- SPARC 2.0  

### Python Frameworks
- LionPride  
- Agentic Framework  
- OpenAI Agents SDK  

---

## 🌐 Agent-Ready Web (ARW)

ARW provides a structured, machine-optimized layer for agents to interact with websites:

- **85% token reduction** (no HTML scraping)  
- **10× faster discovery**  
- **OAuth-secured actions**  
- **Manifest-driven machine views**  

Example ARW manifest:

```json
{
  "version": "0.1",
  "profile": "ARW-1",
  "site": {
    "name": "AI Media Discovery",
    "description": "Discover movies and TV shows through natural language"
  },
  "actions": [
    {
      "id": "semantic_search",
      "endpoint": "/api/search",
      "method": "POST"
    }
  ]
}
```

See full specification in `spec/ARW-0.1-draft.md`.

---

## 💻 Development

### Prerequisites
- Node.js 18+  
- npm or pnpm  

### Build & Run

```bash
npm install
npm run build
npm start
npm run dev
npm run lint
```

### MCP Server

```bash
npm run mcp:stdio
npm run mcp:sse
```

### Media Discovery App

```bash
cd apps/media-discovery
npm install
npm run dev
```

---

## 🔌 MCP Integration

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentics-hackathon": {
      "command": "npx",
      "args": ["agentics-hackathon", "mcp"]
    }
  }
}
```

### SSE Transport

```bash
npx agentics-hackathon mcp sse --port 3000
```

---

## 🤝 Contributing

We welcome contributions!

Focus areas include:

- CLI improvements  
- Additional tool integrations  
- New demo applications  
- ARW spec expansion & tooling  
- Documentation & tutorials  

See **CLAUDE.md** for development methodology and patterns.

---

## 📜 License

Licensed under the **Apache License 2.0**.  
See `LICENSE`.

---

## 🔗 Links

- Hackathon Website: https://agentics.org/hackathon  
- Discord: https://discord.agentics.org  
- GitHub: https://github.com/agenticsorg/hackathon-tv5  
- ARW Spec: `spec/ARW-0.1-draft.md`

---

<div align="center">

**🚀 Agentics Foundation TV5 Hackathon**  
*Building the Future of Agentic AI — Supported by Google Cloud*

[Website](https://agentics.org/hackathon) •  
[Discord](https://discord.agentics.org) •  
[GitHub](https://github.com/agenticsorg/hackathon-tv5)

</div>

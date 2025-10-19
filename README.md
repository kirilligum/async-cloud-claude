# ☁️ Cloud Coder

> **Your On-Demand AI Teammate: Ship Ideas at the Speed of Thought**

<div align="center">

**🏆 Hackathon Project: Daytona x Claude Code Integration**

[![Demo](https://img.shields.io/badge/Demo-Watch%20Now-blue)](https://github.com/sugyan/claude-code-webui)
[![Daytona](https://img.shields.io/badge/Powered%20by-Daytona-orange)](https://daytona.io)
[![Claude](https://img.shields.io/badge/AI-Claude%20Code-purple)](https://claude.ai)

</div>

---

## 🎯 The Problem

**Good ideas get stuck in development backlogs.**

You're a growth marketer with a brilliant idea for an A/B test. You want to change the landing page headline _today_, not next week. But the engineering sprint is locked, and a simple change could take days to deploy.

**What if you could ship it yourself, right now, safely?**

---

## 💡 The Solution

**Cloud Coder** is an AI collaborator that works on your _real codebase_, safely, in isolated cloud environments.

- 🚀 **Asynchronous**: Spin up parallel AI tasks on dedicated Git branches
- 🔒 **Secure**: Every task runs in an isolated Daytona sandbox
- 🔄 **Full Git Integration**: From branching to committing, seamless workflow
- ⚡ **Instant**: No waiting for sprints, no context switching for engineers

---

## 🏗️ Architecture

```
┌─────────────────────┐
│   You + Web UI      │
│  (Branch Selector)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Orchestrator API   │
│  (Node.js Backend)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│   Daytona Cloud Sandboxes       │
│                                  │
│  ┌──────────┐  ┌──────────┐     │
│  │ Task 1   │  │ Task 2   │     │
│  │ Branch A │  │ Branch B │ ... │
│  │ + Claude │  │ + Claude │     │
│  │ + Repo   │  │ + Repo   │     │
│  └──────────┘  └──────────┘     │
└─────────────────────────────────┘
```

### Key Components

1. **Web UI (React)** - Branch selector, task controls, chat interface
2. **Backend API (Node.js + Hono)** - Orchestrates tasks, proxies requests
3. **Daytona Integration** - Provisions isolated sandboxes on-demand
4. **Claude Code** - AI agent running in each sandbox
5. **Git Workflow** - Automatic branching, committing, and pushing

---

## 🎬 Demo: Ship a Landing Page Update in 2 Minutes

### The Use Case

**Persona**: Growth Marketer at a startup
**Goal**: A/B test a new headline and CTA button on the landing page
**Timeline**: Today, not next sprint

### The Flow

1. **🌿 Start a New Task**
   - Click "New Task ✨" button
   - System creates `claude-task/1234567` branch
   - Spins up Daytona sandbox with full codebase + Claude

2. **💬 Chat with Claude**

   ```
   "On the index.html page, change the main headline to
   'Unlock Your Full Potential Today' and change the
   call-to-action button's text to 'Start My Free Trial'."
   ```

3. **✅ Review Changes**
   - Claude shows the diff
   - Verify headline and CTA text changes

4. **💾 Commit & Ship**
   - Click "Commit 💾"
   - Enter message: `feat: A/B test for new landing page CTA`
   - Changes pushed to Git, ready for CI/CD

5. **🧹 Close Task**
   - Click "Close Task ❌"
   - Daytona sandbox deleted, resources freed

**Result**: Non-developer shipped production-ready code in under 3 minutes.

---

## 🚀 Quick Start

### Prerequisites

- ✅ **Claude CLI** installed and authenticated ([Get it here](https://github.com/anthropics/claude-code))
- ✅ **Daytona account** with API key ([Sign up](https://daytona.io))
- ✅ **Node.js >=20.0.0**
- ✅ **Git repository** with your project

### 1. Clone and Install

```bash
git clone https://github.com/your-username/cloud-coder.git
cd cloud-coder

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Create `.env` in project root:

```bash
DAYTONA_API_KEY=your_daytona_api_key_here
DAYTONA_API_URL=https://api.daytona.io
GITHUB_PAT=your_github_personal_access_token
```

**Important**: The `GITHUB_PAT` is required for the Daytona sandboxes to push commits back to your repository. Create one at https://github.com/settings/tokens with `repo` permissions.

### 3. Create Daytona Snapshot

Build and push the `claude-coder-env` snapshot:

```bash
# Option A: Using Daytona CLI
daytona snapshot create \
  --name claude-coder-env \
  --dockerfile Dockerfile.daytona \
  --context .

# Option B: Use Daytona Dashboard
# Upload Dockerfile.daytona and start-claude.sh
```

### 4. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Open and Start Coding

Navigate to `http://localhost:3000`

1. Select your project directory
2. Click "New Task ✨" to create a cloud-based task
3. Chat with Claude to make changes
4. Commit and ship!

---

## ✨ Features

### 🌿 Branch-Based Tasks

- **Parallel Work**: Multiple tasks run simultaneously on different branches
- **Isolated Changes**: No conflicts, no stepping on toes
- **Clean History**: Each task gets its own commit history

### 🔒 Secure Sandboxes

- **Daytona-Powered**: Enterprise-grade isolation
- **Ephemeral**: Sandboxes auto-delete when tasks close
- **Full Environment**: Complete codebase, dependencies, and tools

### 💬 Natural Language Interface

- **Plain English**: No code required to make changes
- **Context-Aware**: Claude understands your entire project
- **Iterative**: Refine changes through conversation

### 🎨 Modern Web UI

- **📱 Mobile-Responsive**: Work from any device
- **🌓 Dark/Light Theme**: Automatic system preference
- **⚡ Real-Time Streaming**: Live updates as Claude works
- **📊 Branch Visualization**: See active tasks at a glance (☁️ indicator)

---

## 📁 Project Structure

```
cloud-coder/
├── backend/                    # Node.js backend
│   ├── handlers/
│   │   ├── chat.ts            # Chat message handling
│   │   ├── git.ts             # Git branches API
│   │   └── tasks.ts           # Task lifecycle (start/commit/stop)
│   ├── services/
│   │   ├── daytonaService.ts  # Daytona SDK client
│   │   └── taskStore.ts       # In-memory task state
│   └── app.ts                 # Main application with proxy logic
├── frontend/                   # React frontend
│   └── src/
│       └── components/
│           ├── ChatPage.tsx            # Main chat interface
│           └── chat/
│               ├── BranchSelector.tsx  # Branch dropdown
│               └── TaskControls.tsx    # Commit/Close buttons
├── shared/                     # Shared TypeScript types
│   └── types.ts               # ActiveTask, BranchesResponse, etc.
├── Dockerfile.daytona          # Daytona snapshot definition
├── start-claude.sh             # Sandbox startup script
└── README.md                   # This file
```

---

## 🔧 Configuration

### Environment Variables

| Variable          | Description                                                    | Required |
| ----------------- | -------------------------------------------------------------- | -------- |
| `DAYTONA_API_KEY` | Your Daytona API key                                           | ✅       |
| `DAYTONA_API_URL` | Daytona API endpoint                                           | ✅       |
| `GITHUB_PAT`      | GitHub Personal Access Token with `repo` scope for git push    | ✅       |
| `PORT`            | Backend server port (default: 8080)                            | ❌       |

### Backend API Endpoints

| Endpoint            | Method | Description                   |
| ------------------- | ------ | ----------------------------- |
| `/api/git/branches` | GET    | List Git branches with status |
| `/api/tasks/start`  | POST   | Create new task + sandbox     |
| `/api/tasks/commit` | POST   | Commit changes from sandbox   |
| `/api/tasks/stop`   | POST   | Delete sandbox and close task |
| `/api/chat`         | POST   | Send message to Claude        |

---

## 🎯 Impact

### ⚡ Speed: From Sprints to Minutes

Iterate on ideas at the speed of thought. No more waiting weeks for simple changes.

### 🤝 Empowerment: Everyone Can Contribute

Product managers, marketers, and sales teams can now safely contribute to the codebase without being blocked by engineering.

### 💰 Efficiency: Free Up Senior Developers

Stop context-switching senior engineers for small tasks. Let them focus on complex problems.

---

## 🛣️ Roadmap

- [ ] **Multi-repo support** - Work across multiple repositories
- [ ] **Team collaboration** - Share tasks and review changes
- [ ] **CI/CD integration** - Auto-deploy on commit
- [ ] **Advanced permissions** - Fine-grained access control
- [ ] **Analytics dashboard** - Track task metrics and AI usage
- [ ] **Slack/Discord integration** - Get notifications in your team chat

---

## 🤝 Contributing

We welcome contributions! This is a hackathon project, but we're committed to making it production-ready.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Commit and push
git commit -m "feat: Add amazing feature"
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **[Daytona](https://daytona.io)** - For providing the infrastructure for isolated cloud environments
- **[Anthropic](https://anthropic.com)** - For Claude Code, the AI that powers the magic
- **[sugyan/claude-code-webui](https://github.com/sugyan/claude-code-webui)** - The foundation this project builds upon

---

<div align="center">

## ☁️ Cloud Coder

**The Future of Agile Collaboration is Asynchronous**

[🌟 Star this repo](https://github.com/your-username/cloud-coder) • [🐛 Report Bug](https://github.com/your-username/cloud-coder/issues) • [💡 Request Feature](https://github.com/your-username/cloud-coder/issues)

Made with ❤️ for the Daytona Hackathon

</div>

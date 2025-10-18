# Cloud Coder - Hackathon Presentation Slides

> **3-Minute Demo Script & Slides**

---

## Slide 1: Title

<div align="center">

# ☁️ Cloud Coder ☁️

**Your On-Demand AI Teammate**

### The Problem: Ideas move fast. Development cycles don't.

</div>

---

## Slide 2: The Pain of a Growth Marketer

<div align="center">

### "I want to A/B test a new headline... now."

**The Old Way:**

```
Idea ➡️ Jira Ticket ➡️ Backlog ➡️ Next Sprint? ➡️ Deploy 😭
```

**Result:** Lost momentum, missed opportunities.

</div>

---

## Slide 3: Our Solution: AI in the Cloud

<div align="center">

### An AI collaborator that works on YOUR codebase, safely.

**Architecture:**

```
You & UI ⇄ Orchestrator API ⇄ Daytona Cloud Sandboxes (Git + Claude)
```

**Key Features:**

- ✅ **Asynchronous**: AI works on tasks in parallel on dedicated branches.
- 🔒 **Secure**: Code changes happen in isolated Daytona sandboxes.
- 🔄 **Fully Integrated**: From branching to committing, it's a seamless Git workflow.

</div>

---

## Slide 4: LIVE DEMO

<div align="center">

# 🎬 LIVE DEMO

### Let's ship a landing page update in 2 minutes.

</div>

---

## Demo Script (2:00 - 2:30)

### (0:00 - 0:25) The Hook: State the Problem

**You, on camera/stage:**

> "Good morning! My name is [Your Name], and I'm constantly frustrated by one thing: good ideas getting stuck in development backlogs."
>
> "As a growth marketer, I want to test a new headline on our landing page _today_, not next week. But engineering resources are tight."
>
> "So, we built **Cloud Coder**: an AI collaborator that works on our real codebase, safely, in the cloud. Let me show you."

### (0:25 - 1:00) The "New Task" Flow

**Switch to screen share, showing the UI on the `main` branch:**

> "Here's our web UI, currently looking at the `main` branch of our website's repository."
>
> "I need to test a new headline. So, I'll start a new task."

**Click the "New Task ✨" button.**

**Narrate while it "loads":**

> "Right now, in the background, Cloud Coder is creating a new Git branch called `claude-task-....` and spinning up a fully isolated Daytona sandbox. This sandbox contains our entire codebase and an instance of Claude, ready to work."

**The UI updates, the new branch is selected in the dropdown with a ☁️ emoji:**

> "And just like that, our AI collaborator is ready. The chat is live, connected directly to the secure sandbox running in the cloud."

### (1:00 - 2:00) The AI Magic: Making the Change

**Have the prompt pre-written in a text file to copy-paste it quickly.**

**Narrate:**

> "Now, I'll just tell Claude what I want in plain English."

**Paste the prompt into the chat input:**

```
On the index.html page, change the main headline to 'Unlock Your Full Potential Today'
and change the call-to-action button's text to 'Start My Free Trial'.
```

**Click "Send".**

**Narrate while Claude "thinks":**

> "Claude is now accessing the file system inside its secure sandbox. It's reading `index.html`, making the changes I requested, and preparing to show me the result."

**Claude's response appears, showing the `diff` of the changes.**

**Narrate:**

> "Perfect. It understood the request and shows me the exact changes it made. I can verify the new headline and button text right here."

### (2:00 - 2:45) The Final Step: Committing the Work

**Narrate:**

> "This looks great. I don't need an engineer, and I didn't even have to open a code editor. I'm ready to ship this for A/B testing."

**Click the "Commit 💾" button. A simple dialog might ask for a message.**

**Type a quick commit message:**

```
feat: A/B test for new landing page CTA
```

**Click "Confirm Commit".**

**Narrate:**

> "And with that click, Cloud Coder has committed the changes and pushed them to our Git repository. Our CI/CD pipeline can now automatically deploy this branch to a staging environment for the A/B test to begin."

### (2:45 - 3:00) The Conclusion

**Click the "Close Task ❌" button.**

> "My task is done, so I'll shut down the cloud environment to save resources."

**Switch back to camera/slides:**

> "We just empowered a non-developer to safely propose, review, and ship a code change in under three minutes."
>
> "That's Cloud Coder: turning ideas into reality at the speed of thought. Thank you."

---

## Slide 5: Recap: What You Just Saw

<div align="center">

### New Task ✨

- Instantly created a new Git branch.
- Spun up a secure Daytona sandbox with the full codebase.

### AI Chat 💬

- Instructed Claude in plain English to modify a file.
- Claude read, wrote, and confirmed the code change inside the sandbox.

### Commit & Push 💾

- Committed the AI's work directly from the UI.
- Pushed the new branch to the repository, ready for CI/CD.

</div>

---

## Slide 6: The Impact

<div align="center">

### ⚡ Speed: From Sprints to Minutes

Iterate on ideas at the speed of thought.

### 🤝 Empowerment: Product, Marketing, and Sales can now safely contribute to the codebase.

### 💰 Efficiency: Frees up senior developers from small, context-switching tasks.

</div>

---

## Slide 7: Thank You

<div align="center">

# ☁️ Cloud Coder

**The Future of Agile Collaboration is Asynchronous.**

---

### Questions?

**GitHub:** [github.com/your-username/cloud-coder](https://github.com/your-username/cloud-coder)

**Built with:** Daytona + Claude Code + React + Node.js

---

Made with ❤️ for the Daytona Hackathon

</div>

---

## Quick Tips for Demo Success

### Pre-Demo Checklist

- [ ] **Pre-warm the backend** - Have both backend and frontend running
- [ ] **Pre-create a test branch** (optional) - If Daytona sandbox creation is slow
- [ ] **Prepare the prompt** - Have it in a text file ready to copy-paste
- [ ] **Test the flow** - Run through it at least 3 times before presenting
- [ ] **Check network** - Ensure stable internet connection
- [ ] **Browser zoom** - Set to 125-150% for visibility
- [ ] **Close unnecessary tabs** - Keep only the demo tab open

### Backup Plan

If Daytona sandbox creation takes too long:

1. **Have a pre-created task** ready to switch to
2. **Explain the architecture** while it's loading
3. **Have screenshots** as a fallback

### Key Messages to Drive Home

1. **Speed** - "Minutes, not weeks"
2. **Safety** - "Isolated sandboxes, real Git workflow"
3. **Empowerment** - "Non-developers can ship code"
4. **Asynchronous** - "Multiple tasks in parallel"

### Questions You Might Get

**Q: What about code review?**

> A: The changes are pushed as a Git branch. Your normal PR review process still applies. This just accelerates getting the code written.

**Q: Is it secure?**

> A: Yes! Every task runs in an isolated Daytona sandbox. No cross-contamination. Git-based workflow means full audit trail.

**Q: What if Claude makes a mistake?**

> A: You review the diff before committing. Plus, it's just a branch - you can always abandon it or revert.

**Q: Can multiple people work on tasks simultaneously?**

> A: Absolutely! That's the power of the asynchronous model. Each task gets its own branch and sandbox.

**Q: What about costs?**

> A: Sandboxes are ephemeral and auto-delete when tasks close. You only pay for active work.

---

## Post-Demo: Next Steps Slide (Optional)

<div align="center">

### Want to Try It?

1. **Clone the repo:** `github.com/your-username/cloud-coder`
2. **Get a Daytona account:** `daytona.io`
3. **5-minute setup:** Follow the Quick Start guide

### Roadmap

- Team collaboration features
- Multi-repo support
- Advanced CI/CD integration
- Analytics dashboard

**We're looking for beta testers!**

</div>

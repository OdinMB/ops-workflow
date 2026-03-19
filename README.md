# ops

A [Claude Code](https://claude.com/claude-code) plugin for the stuff that isn't code.

Research, strategy, content, compliance: the ops plugin gives Claude a structured repo to manage all of it. State files track what exists. Backlog tracks what's next. References hold research. Artifacts hold deliverables. Claude plans work, executes it, and keeps everything organized. Best part: you can tell it /ops:get-to-work and walk away. It'll find tasks, prioritize, execute, commit, repeat. Come back to a summary of what got done.

For solo founders and indie hackers who use Claude for development and want the same workflow for everything else.

> **Note:** This is a Claude Code plugin. Use it in the Claude Code terminal, or in Claude Desktop with the **Code** mode enabled (not Cowork). The plugin's slash commands, skills, and agents all require Claude Code's runtime.

## Quick Example

You're launching an AI tutoring startup. The code is handled, but you also need to research competitors, write grant applications, draft marketing copy, and track legal compliance.

**Set up a project:**

```
> /ops:scaffold
```

Claude asks a few questions about your project, then creates a structured repo with folders for state, backlog, references, artifacts, and plans.

**Do some work:**

```
> /ops:handle research competitor pricing for AI tutoring tools
```

Claude plans the research, you approve, and it executes — searching the web, writing up findings in `references/`, updating `state/` with the competitive landscape, and adding opportunities to the `backlog/`.

**Step away and let Claude work through the backlog:**

```
> /ops:get-to-work
```

Claude autonomously finds work — scanning existing goals for gaps and looking outward for new opportunities — then prioritizes, executes, and commits after each task. When you return, it walks you through what it decided and what needs your input.

**See where things stand:**

```
> /ops:whats-next
```

A synthesized executive summary — what's been done, what's in progress, and a prioritized list of what to do next.

**Bring in outside information:**

```
> /ops:update we got accepted into the TechStars AI cohort, program starts April 15
```

Claude classifies the information, updates the relevant state and backlog files, and adjusts priorities accordingly. You can also drop files (PDFs, notes, screenshots) into the `.update/` folder and run `/ops:update` — Claude will process everything in the inbox.

**Keep the knowledge base clean:**

```
> /ops:tidy
```

Runs 9 consistency checks — stale dates, orphaned files, INDEX.md accuracy, WAITING markers — auto-fixes what it can, flags the rest.

## What the repo looks like after 1h of autonomous work

```
ai-tutoring-ops/
├── CLAUDE.md
├── MEMORY.md
├── state/
│   ├── INDEX.md
│   ├── product.md                           # Current platform capabilities
│   ├── competitive-landscape.md             # Who's out there, how they price
│   └── accelerator.md                       # TechStars status and milestones
├── backlog/
│   ├── INDEX.md
│   ├── marketing.md                         # Outreach tasks, prioritized
│   ├── grants.md                            # Grant opportunities to pursue
│   └── partnerships.md                      # Integration and partnership leads
├── references/
│   ├── INDEX.md
│   ├── competitors/
│   │   ├── INDEX.md
│   │   └── pricing-analysis.md              # Detailed pricing comparison
│   ├── grants/
│   │   ├── INDEX.md
│   │   └── nsf-sbir-requirements.md         # Eligibility and deadlines
│   └── legal/
│       ├── INDEX.md
│       └── coppa-compliance.md              # Requirements for K-12 ed-tech
├── artifacts/
│   ├── INDEX.md
│   ├── grants/
│   │   └── 2026-03-01_nsf-sbir-application.md
│   └── marketing/
│       └── cold-outreach-template.md
├── plans/
│   ├── INDEX.md
│   └── completed/
│       ├── INDEX.md
│       ├── 2026-02-20_competitor-research.md
│       └── 2026-03-01_nsf-sbir-application.md
├── .update/
└── .tmp/
```

Every folder has an `INDEX.md` that provides a complete overview at its level of abstraction, with links to sub-files for deeper detail.

## Installation

```bash
claude plugin marketplace add OdinMB/ops-workflow
claude plugin install ops
```

## All Commands

### Interactive

| Command           | What It Does                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| `/ops:handle`     | End-to-end workflow: plan → approve → execute. Use for all non-trivial work. |
| `/ops:whats-next` | Executive summary with prioritized "what to do next".                        |
| `/ops:update`     | Ingest external information into the knowledge base.                         |
| `/ops:tidy`       | Run consistency checks on the knowledge structure. Auto-fixes what it can.   |
| `/ops:recap`      | Summarize what happened since a given date. Tables and lists, never prose.   |
| `/ops:scaffold`   | Set up a new ops repo from scratch.                                          |

### Autonomous

| Command                | What It Does                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/ops:get-to-work`     | Fully autonomous loop: find work → prioritize → execute → repeat. Step away and come back to a follow-up review. |
| `/ops:batch-plan`      | Write multiple plans in parallel without interruption.                                                           |
| `/ops:batch-execute`   | Execute multiple approved plans sequentially without interruption.                                               |
| `/ops:review-followup` | Walk through decisions Claude made during autonomous runs.                                                       |

### Discovery

| Command           | What It Does                                                     |
| ----------------- | ---------------------------------------------------------------- |
| `/ops:find-tasks` | Scan the project through 7 lenses to surface new backlog items.  |
| `/ops:find-opps`  | Look beyond existing plans for new directions and opportunities. |

## Safety

All autonomous commands enforce these rules:

- **No real-world actions** — never sends emails, submits forms, posts to social media, or calls external APIs
- **No file deletion** — intended deletions are recorded for your review
- **No remote push** — only local branches and commits
- **Transparent decisions** — when uncertain, records its reasoning for you to review

## License

MIT

---

<details>
<summary>Technical Details</summary>

### Architecture

Commands (listed above) are orchestrators built from composable skills (`/plan`, `/execute`, `/prioritize`, etc.). Autonomous commands delegate to **agents** — isolated sub-processes that run a skill, write outputs to files, and return only a concise summary to keep the orchestrator's context clean.

### The get-to-work Loop

```
[Cycle 1]
  task-finder agent → scan 7 lenses → add backlog items
      ↓ (escalate if low yield)
  opps-finder agent → find new directions → add backlog items
      ↓
  prioritize → select 2-3 independent, feasible tasks
      ↓
  executor agents → execute each task, update state, commit
      ↓
[Cycle 2, 3, ...] until stopping conditions met
      ↓
  /review-followup → walk through decisions with user
```

### Permissions and Autonomous Execution

The autonomous commands (`/ops:get-to-work`, `/ops:batch-execute`) run for extended periods without user intervention. For this to work smoothly, Claude Code needs pre-approved permissions for the tools these agents use.

**If the process keeps pausing for permission prompts, it's not truly autonomous.** Configure your `settings.json` (globally at `~/.claude/settings.json` or per-project at `.claude/settings.json`) with `allow` lists covering:

- File operations: `Bash(ls *)`, `Bash(mv *)`, `Bash(rm ".tmp/*")`
- Git commands: `Bash(git add *)`, `Bash(git status *)`, `Bash(git log *)`, `Bash(git diff *)`, `Bash(git branch *)`, `Bash(git commit *)`
- Web access: `WebSearch`, `WebFetch`
- Skill invocation: `Skill(execute)`, etc.

See Claude Code's [permissions documentation](https://docs.anthropic.com/en/docs/claude-code/security) for details.

### Contributing to the Plugin

Claude Code installs plugins as shallow clones (single commit, no full history). To edit the plugin source and push changes back, fetch the full history:

```bash
git -C ~/.claude/plugins/marketplaces/ops-workflow fetch --unshallow
```

Plugin updates via Claude Code (`/plugin update`) may re-shallow the clone — run `fetch --unshallow` again afterward if you need the full history.

</details>

---

<details>
<summary>Experimental: MCP Server for Claude Desktop (Cowork)</summary>

> **Status: Experimental.** This MCP server is a proof-of-concept for using the ops plugin from Claude Desktop's Cowork mode. It works but is not the primary way to use this plugin. For the full experience, use Claude Code directly (terminal or Claude Desktop in Code mode).

The plugin includes an MCP server that wraps Claude Code's ops capabilities as MCP tools. Each tool call spawns a Claude Code session via the [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-typescript), runs the corresponding skill, and returns a structured summary.

### Setup

**Prerequisites:** [Claude Code](https://claude.com/claude-code) installed and authenticated. Node.js 18+.

1. **Install the runtime dependency:**

```bash
cd ~/.claude/plugins/marketplaces/ops-workflow/mcp-server
npm install --production
```

2. **Add the server to Claude Desktop's config.**

Open `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) and add to the `mcpServers` object:

```json
"ops-workflow": {
  "command": "node",
  "args": ["/path/to/.claude/plugins/marketplaces/ops-workflow/mcp-server/dist/index.js"]
}
```

Replace `/path/to/` with your actual home directory path.

3. **Restart Claude Desktop** (fully quit from the system tray, then reopen).

The ops tools should appear under "+" > "Connectors" in the chat window.

### Available Tools

| Tool | What It Does |
| ---- | ------------ |
| `ops_context` | Load the project's CLAUDE.md and MEMORY.md into context |
| `ops_scaffold` | Set up a new ops project with the standard folder structure |
| `ops_whats_next` | Executive overview and priorities |
| `ops_recap` | Summarize activity since a date |
| `ops_plan` | Create a plan (returns contents for review) |
| `ops_execute` | Execute an approved plan |
| `ops_update` | Integrate new information |
| `ops_tidy` | Run consistency checks |
| `ops_get_to_work` | Autonomous work session |
| `ops_batch_plan` | Plan multiple tasks at once |
| `ops_batch_execute` | Execute multiple plans in sequence |
| `ops_dir` | Switch the active project |
| `ops_list_projects` | List registered projects |
| `ops_add_project` | Register a project folder |
| `ops_remove_project` | Unregister a project |

### Multi-Project Support

Register multiple projects with `ops_add_project`, then switch between them with `ops_dir` — or pass a `project` parameter to any tool.

### Limitations

- **Latency** — tool calls take 30 seconds to several minutes depending on the operation
- **No slash commands** — the ops `/` commands don't appear in Cowork's skills menu; you use natural language instead
- **No cross-session memory** — Cowork doesn't persist context between sessions like Claude Code does

</details>

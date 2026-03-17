# ops-workflow

A [Claude Code](https://claude.com/claude-code) plugin for structured non-code project management — research, strategy, content, and specs. Provides planning, execution, knowledge persistence, and autonomous work loops.

## What It Does

This plugin manages **ops repos** — project management repositories that produce strategy, research, content, and specifications (never code). It provides:

- A structured knowledge system with `state/`, `backlog/`, `references/`, `artifacts/`, and `plans/`
- Skills for planning, executing, and reviewing non-code work
- Autonomous agents that can work through a backlog without user input
- A scaffolding tool to set up new ops repos from scratch

## Installation

```bash
claude plugin add https://github.com/OdinMB/ops-workflow
```

Then enable it in your Claude Code settings.

## Repo Structure

An ops repo (created by `/ops-scaffold`) looks like this:

```
my-project/
├── CLAUDE.md              # Project-specific instructions
├── MEMORY.md              # Stable context: description, goals, key learnings
├── state/                 # What currently exists — facts, metrics, constraints
│   └── INDEX.md
├── backlog/               # What to do next — prioritized tasks and opportunities
│   └── INDEX.md
├── references/            # Inputs — research, analysis, context by topic
│   └── INDEX.md
├── artifacts/             # Outputs — deliverables, submitted work products
│   └── INDEX.md
├── plans/                 # Active work plans
│   ├── INDEX.md
│   └── completed/         # Archived plans with outcomes
│       └── INDEX.md
├── .update/               # Inbox — drop files here for /ops:update to process
└── .tmp/                  # Temporary files
```

Every folder has an `INDEX.md` that provides a complete overview at its level of abstraction, with links to sub-files for deeper detail. The knowledge system is navigated top-down through these indexes.

## Skills (Building Blocks)

| Skill | What It Does |
|-------|-------------|
| `/ops-plan` | Research existing state, create a plan file with objective, steps, and success criteria. Presents to user for approval. |
| `/ops-execute` | Execute an approved plan — research, write, review, update state, harvest insights, archive. |
| `/ops-find-tasks` | Scan the project through 7 lenses (goal gaps, stale state, research opportunities, content gaps, follow-through, hygiene, new directions) to identify new backlog items. |
| `/ops-find-opps` | Look beyond existing plans for new directions — adjacent opportunities, strategic gaps, emerging context, preparatory research, cross-pollination. |
| `/ops-prioritize` | Score candidate tasks on impact, feasibility, and independence. Select 2-3 for autonomous execution. |
| `/ops-update` | Ingest external information into the knowledge base. Inline mode (pass content directly) or inbox mode (process `.update/` folder). |
| `/ops-scaffold` | Set up a new ops repo with the full folder structure, CLAUDE.md, MEMORY.md, and INDEX.md hierarchy. |
| `work-autonomously` | Shared rules for unattended execution: never stop for input, never delete files, record decisions in follow-up files. |
| `review-followup` | Walk through follow-up files from autonomous runs with the user. Present context and options for each item. |

## Commands (Orchestrators)

### Interactive

| Command | What It Does |
|---------|-------------|
| `/ops:handle` | End-to-end workflow: `/ops-plan` → user approves → `/ops-execute`. Use for all non-trivial work. |
| `/ops:overview` | Read-only executive summary. Synthesizes state, backlogs, and recent plans into a prioritized "What to do next" with status dashboard. |
| `/ops:update` | Interactive wrapper for `/ops-update`. Process `.update/` inbox or inline content. |
| `/ops:housekeeping` | Run 9 consistency checks on the knowledge structure (INDEX.md accuracy, stale dates, orphaned files, WAITING markers, backlog hygiene, etc.). Auto-fixes what it can, flags the rest. |

### Autonomous

| Command | What It Does |
|---------|-------------|
| `/ops:get-to-work` | Fully autonomous loop: identify work → prioritize → execute → repeat. Modes: `tasks` / `opps` / `full` / `escalating` (default). Creates a branch, commits after each task, produces a follow-up file for review. |
| `/ops:batch-plan` | Write multiple plans without interruption. Spawns planner agents in parallel. Reviews follow-up items with user afterward. |
| `/ops:batch-execute` | Execute multiple plans sequentially without interruption. Reviews follow-up items with user afterward. |

### The get-to-work Loop

```
[Cycle 1]
  ops-task-finder agent → scan 7 lenses → add backlog items
      ↓ (escalate if low yield)
  ops-opps-finder agent → find new directions → add backlog items
      ↓
  ops-prioritize → select 2-3 independent, feasible tasks
      ↓
  ops-executor agents → execute each task, update state, commit
      ↓
[Cycle 2, 3, ...] until stopping conditions met
      ↓
  /review-followup → walk through decisions with user
```

## Agents (Context Isolation)

Skills are designed for direct invocation in the main conversation. Agents wrap skills for autonomous contexts — they run in isolated sub-agent processes, write outputs to files, and return only concise summaries. This keeps the orchestrator's context clean.

| Agent | Wraps | Model |
|-------|-------|-------|
| `ops-planner` | `/ops-plan` | sonnet |
| `ops-executor` | `/ops-execute` | caller's model |
| `ops-task-finder` | `/ops-find-tasks` | sonnet |
| `ops-updater` | `/ops-update` | sonnet |
| `ops-opps-finder` | `/ops-find-opps` | caller's model |

## Permissions and Autonomous Execution

The autonomous commands (`/ops:get-to-work`, `/ops:batch-execute`) are designed to run for extended periods without user intervention. For this to work smoothly, Claude Code needs pre-approved permissions for the tools these agents use.

**If the process keeps pausing for permission prompts, it's not truly autonomous.** To fix this, configure your `settings.json` (either globally at `~/.claude/settings.json` or per-project at `.claude/settings.json`) with comprehensive `allow` and `deny` lists covering:

- File operations: `Bash(ls *)`, `Bash(mv *)`, `Bash(rm ".tmp/*")`
- Git commands: `Bash(git add *)`, `Bash(git status *)`, `Bash(git log *)`, `Bash(git diff *)`, `Bash(git branch *)`, `Bash(git commit *)`
- Web access: `WebSearch`, `WebFetch`
- Skill invocation: `Skill(ops-execute)`, etc.

The more commands you pre-approve in your allowlist, the longer the autonomous processes can run without interruption. Review Claude Code's [permissions documentation](https://docs.anthropic.com/en/docs/claude-code/security) to configure this for your comfort level.

## Safety Constraints

All autonomous commands enforce these rules:

- **No real-world actions**: never send emails, submit forms, post to social media, make purchases, or call external APIs that modify state
- **No file deletion**: intended deletions are recorded in follow-up files for user review
- **No remote push**: only local branches and commits
- **Transparent decisions**: when uncertain, the agent makes a sensible choice and records its reasoning for user review

## Getting Started

1. Install the plugin (see above)
2. Create a new ops repo: run `/ops-scaffold` in an empty directory
3. Start working: `/ops:handle research competitor pricing strategies`
4. Check status: `/ops:overview`
5. Go autonomous: `/ops:get-to-work`

## License

MIT

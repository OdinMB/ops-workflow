# ops

A [Claude Code](https://claude.com/claude-code) plugin for the stuff that isn't code.

Research, strategy, content, compliance: the ops plugin gives Claude a structured repo to manage all of it. State files track what exists. Backlog tracks what's next. References hold research. Artifacts hold deliverables. Claude plans work, executes it, and keeps everything organized. Best part: you can tell it /ops:get-to-work and walk away. It'll find tasks, prioritize, execute, commit, repeat. Come back to a summary of what got done.

For solo founders and indie hackers who use Claude for development and want the same workflow for everything else.

> **Note:** This is a Claude Code plugin. Use it in the Claude Code terminal, or in Claude Desktop with the **Code** mode enabled (not Cowork). The plugin's slash commands, skills, and agents all require Claude Code's runtime, and it ships no bridge to Cowork.

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

Every folder (except an `autopilot/` folder, below) has an `INDEX.md` that provides a complete overview at its level of abstraction, with links to sub-files for deeper detail.

Ops also works alongside Odin's autopilot convention. If a repo has an `autopilot/` folder, ops reads it for product direction, sends product ideas there as notes in `autopilot/inbox/`, and otherwise leaves its files alone.

## Installation

```bash
claude plugin marketplace add OdinMB/ops-workflow
claude plugin install ops@ops-workflow
```

The marketplace registers as `ops-workflow`, so the plugin's id is `ops@ops-workflow` — the key that `/ops:scaffold` writes into a new ops repo's `.claude/settings.json`.

## All Commands

### Interactive

| Command           | What It Does                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| `/ops:handle`     | End-to-end workflow: plan → approve → execute. Use for all non-trivial work. |
| `/ops:whats-next` | Executive summary with prioritized "what to do next".                        |
| `/ops:update`     | Ingest external information into the knowledge base.                         |
| `/ops:tidy`       | Run consistency checks on the knowledge structure. Auto-fixes what it can.   |
| `/ops:recap`      | Summarize what happened since a given date. Short lead, then the detail.     |
| `/ops:scaffold`   | Set up a new ops repo from scratch.                                          |

### Autonomous

| Command                | What It Does                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/ops:get-to-work`     | Fully autonomous loop: find work → prioritize → execute → repeat. Step away and come back to a follow-up review. |
| `/ops:batch-plan`      | Write multiple plans in parallel without interruption.                                                           |
| `/ops:batch-execute`   | Execute multiple approved plans sequentially without interruption.                                               |
| `/ops:batch-handle`    | Plan and then execute a batch of tasks in one run, with a single review at the end.                              |
| `/ops:review-followup` | Walk through decisions Claude made during autonomous runs.                                                       |

### Discovery

| Command           | What It Does                                                     |
| ----------------- | ---------------------------------------------------------------- |
| `/ops:find-tasks` | Scan the project through 7 lenses to surface new backlog items.  |
| `/ops:find-opps`  | Look beyond existing plans for new directions and opportunities. |
| `/ops:find-all`   | Run both finders in parallel and get briefed on what they found. |

## Safety

All autonomous commands enforce these rules:

- **No real-world actions** — never sends emails, submits forms, posts to social media, or calls external APIs
- **Only listed deletions** — processed `.update/` inbox files, a batch's finished direct-tasks file, and the worktrees, branches and per-task notes files a run created and merged; every other intended deletion is recorded for your review
- **One writer per folder** — executors run one at a time by default; when `/ops:get-to-work` runs them in parallel, each gets its own nested worktree made from the run's branch
- **Explicit-path commits** — each commit names its paths, so a run never sweeps someone else's half-finished work into its commit
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
  prioritize → select up to 3 feasible tasks worth doing
      ↓
  executor agents → execute each task, update state, commit
      ↓
[Cycle 2, 3, ...] until stopping conditions met
      ↓
  /review-followup → walk through decisions with user
```

### Permissions and Autonomous Execution

The autonomous commands (`/ops:get-to-work`, `/ops:batch-execute`) run for extended periods without user intervention. How their tool calls get approved depends on the permission mode, so name the mode when you start an unattended run rather than relying on whatever your settings default to:

- **Auto mode** — a classifier judges each action, so a run rarely stops for a prompt and needs no long allow list. Headless: `CLAUDE_UNWATCHED=1 CLAUDE_CODE_EFFORT_LEVEL=xhigh claude -p --permission-mode auto "/ops:get-to-work"` (`CLAUDE_UNWATCHED=1` marks the session as one nobody is watching, for hooks that hold unattended runs to stricter rules; it does nothing where no hook reads it. `CLAUDE_CODE_EFFORT_LEVEL=xhigh` runs the whole run, every subagent included, at `xhigh` effort, since the variable outranks saved levels and agent frontmatter).
- **Default or `dontAsk` mode** — only what your allow list covers runs without asking; in `dontAsk`, everything else is refused.

**If the process keeps pausing for permission prompts, it's not truly autonomous.** Outside auto mode, configure your `settings.json` (globally at `~/.claude/settings.json` or per-project at `.claude/settings.json`) with `allow` lists covering:

- File operations: `Bash(ls *)`, `Bash(mv *)`, `Bash(rm ".tmp/*")`
- Git commands (commits name their paths: `git add -- <paths>`, then `git commit -m "…" -- <paths>`): `Bash(git add *)`, `Bash(git status *)`, `Bash(git log *)`, `Bash(git diff *)`, `Bash(git branch *)`, `Bash(git commit *)`
- Web access: `WebSearch`, `WebFetch`
- Skill invocation: `Skill(execute)`, etc.

See Claude Code's [permissions documentation](https://docs.anthropic.com/en/docs/claude-code/security) for details.

### Contributing to the Plugin

Work on a clone of your own, and point the marketplace at it as a local directory. Claude Code reads a plugin from a local-directory marketplace in place, never from its cache, so an edit to the clone takes effect at the next session start or `/reload-plugins`, with no push, version bump, or `/plugin update`.

In `~/.claude/settings.json`, declare the marketplace under the same name with a `directory` source:

```json
"extraKnownMarketplaces": {
  "ops-workflow": {
    "source": { "source": "directory", "path": "/absolute/path/to/ops-workflow" },
    "autoUpdate": false
  }
}
```

Then run `claude plugin marketplace add /absolute/path/to/ops-workflow` once. The name comes from `.claude-plugin/marketplace.json`, so it must stay `ops-workflow` for the plugin to keep its `ops@ops-workflow` id; installed plugins and every project's `enabledPlugins` entry survive the switch. Don't use `claude plugin marketplace remove` for it: that uninstalls the plugin and strips its `enabledPlugins` entries. `claude plugin list` shows `Read from: <your path>` once it took.

The plugin's design decisions are recorded in [`.context/decisions.md`](.context/decisions.md), one file per decision in `.context/decisions/`.

</details>

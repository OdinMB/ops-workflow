---
description: "Run both ops finders in parallel (tasks, opps) and present a unified report. Discovery only — no plans, no execution."
---

# Find All

Run both finder agents in parallel and present a consolidated overview. This is a read-only scan — it produces findings for the user to review, not plans or executions.

## Step 1: Spawn Both Finders in Parallel

Launch two sub-agents simultaneously:

**Task finder** — spawn a `task-finder` agent:

```
Read the task-finder agent instructions at: agents/task-finder.md

Follow-up file path: (none — discovery only, no follow-up file needed)
Scan depth: full
```

**Opps finder** — spawn an `opps-finder` agent:

```
Read the opps-finder agent instructions at: agents/opps-finder.md

Your job: identify 3-5 new directions of work this project should explore.
Stay grounded in the project's goals and limitations from MEMORY.md.
Every suggestion must be something an autonomous agent can start working on.
```

## Step 2: Consolidate and Present

Once both agents complete, present a single overview to the user organized by category:

### Format

```markdown
# Project Survey — YYYY-MM-DD

## Tasks (maintenance & improvements)
| # | Item | Priority | Area |
|---|------|----------|------|
| 1 | ... | high | ... |

## Opportunities (new directions)
| # | Item | Impact | Feasibility |
|---|------|--------|-------------|
| 1 | ... | high | ... |
```

Keep each table concise — summarize, don't dump the full agent reports. The user can ask to drill into any item.

## What NOT to Do

- Do not create plans
- Do not execute anything
- Do not write any files to the repo
- Do not add items to the backlog — present everything the agents found, let the user decide what to act on
- Do not modify state files, MEMORY.md, or any repo content

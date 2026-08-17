---
description: "Run both ops finders in parallel (tasks, opps) and brief you on what they found. Discovery only — no plans, no execution."
---

# Find All

Run both finder agents in parallel, then brief the user on what the project's gaps mean. Discovery only — no plans, no execution, and the survey list is the only file it writes.

## Step 1: Spawn Both Finders in Parallel

Launch two sub-agents simultaneously:

**Task finder** — spawn a `task-finder` agent:

```
Read the task-finder agent instructions at: agents/task-finder.md

Scan depth: full

This is a discovery scan. Do NOT add anything to the backlog, and do NOT write a
follow-up file — return every item you find in your response, with your usual
fields, and let the caller decide what to persist.
```

**Opps finder** — spawn an `opps-finder` agent:

```
Read the opps-finder agent instructions at: agents/opps-finder.md

Your job: identify 3-5 new directions of work this project should explore.
Stay grounded in the project's goals and limitations from MEMORY.md.
Every suggestion must be something an autonomous agent can start working on.
```

## Step 2: Consolidate and Present

Once both agents complete, brief the user on what the two scans add up to.

### Format

No tables. Present 3-6 themes, grouped by what they mean for the project rather than by which finder produced them — e.g. "nobody has checked whether the two biggest funders still take unsolicited applications", "the audience numbers everything else rests on are six months stale". Each theme gets a short paragraph: what is missing or going stale, what it costs to leave it alone, and — where there is a real choice — two directions with what each buys and gives up. Effort labels, lens names, per-item file paths, and the agents' own count lines stay out. Close with the two or three you would start with and why, then ask which to pursue — and where the answer depends on what the user wants the project to achieve, ask that instead of guessing.

Nothing gets dropped: write the complete item list, with the finders' own fields, to `plans/YYYY-MM-DD_survey.md` — a findings list, not a plan — for whoever plans from it later, and mention that file in one line.

## What NOT to Do

- Do not write plan files, and do not start on anything the finders surfaced
- Do not execute anything
- Write nothing but the survey file — no backlog entries, no state file or MEMORY.md edits, nothing else in the repo
- Do not read the item list out. The survey file is the record; your job is to say what the project's gaps mean and where you would start. Grouping and ranking the findings isn't the same as dropping them — but reciting an unranked inventory isn't thoroughness either.

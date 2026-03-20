---
description: "Autonomous ops work. Args: `[mode] [repeat]`. Modes: `tasks` | `opps` | `full` | `escalating` (default). Repeat: `cycle` (keep going, default) | `once` (single pass). Run this before stepping away from an ops repo."
disable-model-invocation: true
---

# Get to Work

You will autonomously advance this ops project. Follow the `work-autonomously` skill throughout — the entire process runs without user input.

## Safety Constraints

**No real-world actions.** You must NEVER:

- Send emails, messages, or notifications
- Submit forms, applications, or registrations
- Post to social media or external platforms
- Make API calls that modify external state
- Make purchases or financial transactions
- Contact anyone on behalf of the user

You CAN: research (web search, read public pages), write files, create plans, analyze data, produce drafts and artifacts the user can later use for world-affecting actions, and maintain the repo's knowledge system.

## Phase 1: Setup

1. Determine today's date. Check the current branch — if you're already on a feature branch or a prior get-to-work branch, stay on it. Only create a new branch (`YYYY-MM-DD-get-to-work`) if you're on `main` (or the repo's default branch).
2. Create a follow-up file at `plans/YYYY-MM-DD_get-to-work-followup.md`:

```markdown
# Get to Work — Follow-up

## Controversial Decisions
Items where the agent made a judgment call the user should review.

## Skipped Items
Opportunities identified but not acted on, with reasons.

## User Input Needed
Questions that blocked progress on specific items.

## Implementation Issues
Problems encountered during execution.

## Cycle Log
Summary of each identify → prioritize → execute cycle.
```

3. Parse `$ARGUMENTS`:
   - **First word** — mode: `tasks`, `opps`, `full`, or `escalating` (default if omitted)
   - **Second word** — repeat: `cycle` (default if omitted) or `once`

## Phase 2: Work Cycle

Repeat this cycle until one of the stopping conditions (Phase 3) is met.

**Core duty: your job is to find and do useful work.** If the current backlog is full of blocked items, that means you need to generate new items — not stop. Research, state refreshes, content drafts, consistency fixes, and knowledge-gap analysis are always available. "Everything is blocked" means the backlog needs new entries, not that you're done.

### Step 1: Identify New Work

#### Mode: Determine search strategy

Parse `$ARGUMENTS` for the mode (first word). Default to `escalating` if not specified.

- **`tasks`**: Spawn only the task-finder agent. Skip opps-finder entirely.
- **`opps`**: Spawn only the opps-finder agent. Skip task-finder entirely. The opps-finder produces backlog-ready items — add them directly.
- **`full`**: Spawn both task-finder and opps-finder agents **in parallel**. Merge their findings for Step 2.
- **`escalating`** (default): Spawn the task-finder agent first. If it produces fewer than 3 actionable items, also spawn the opps-finder agent to expand the search.

Spawn an **task-finder sub-agent** (`agents/task-finder.md`):

```
Read the task-finder agent instructions at: agents/task-finder.md

Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
Scan depth: <"full" on first cycle, "follow-through" on subsequent cycles unless yield is low>
```

On the first cycle, use "full" scan depth. On subsequent cycles, start with "follow-through" (focused on recent completions). If the agent's summary reports "Lenses 1-6 yield: low", widen to a full scan on the next attempt.

Record what was added in the Cycle Log section of the follow-up file. Commit the backlog updates: `"identify work: add N new backlog items (cycle M)"`

**Escalation**: If the task-finder agent reports low yield from lenses 1-6, spawn an **opps-finder sub-agent** (`agents/opps-finder.md`):

```
Read the opps-finder agent instructions at: agents/opps-finder.md

Additional context:
- What lenses 1-6 found (or didn't): <brief summary from task-finder agent>

Your job: identify 3-5 new directions of work this project should explore.
Stay grounded in the project's goals and limitations from MEMORY.md.
Every suggestion must be something an autonomous agent can start working on.
```

Add the opps-finder's output items to the backlog and continue the cycle.

### Step 2: Prioritize

Follow the `prioritize` skill:

- Score all candidate tasks (active plans + backlog items + newly added items)
- Select 2-3 independent, feasible, high-impact tasks
- Prepare execution briefs for each
- Record the selection and reasoning in the Cycle Log

#### Mode determines whether new strategic directions are in scope

- **`tasks` mode**: Only maintenance and improvement work — consistency fixes, state refreshes, knowledge gaps, stale content. New strategic directions are out of scope.
- **`opps`/`full`/`escalating` modes**: New strategic directions ARE in scope. The opps-finder exists specifically to find these. Do not skip items for being "new work" or "not maintenance" when the opps-finder suggested them.

**If prioritization yields zero feasible tasks**: this is not a stopping condition. Go back to Step 1 immediately and run a full-lens scan focused on generating agent-feasible work.

### Step 3: Execute Tasks

Execute the selected tasks one at a time.

#### Classify each task as trivial or non-trivial

**Trivial** — a small, obvious change: updating a single file, fixing a typo, adding a short entry, minor content edits. No research or multi-step coordination needed.

**Non-trivial** — everything else.

#### Trivial tasks: skip planning, execute directly

For trivial tasks, spawn an **executor sub-agent** (`agents/executor.md`) directly with a task description:

```
Read the executor agent instructions at: agents/executor.md

Task description: <the task from the execution brief>
Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
```

#### Non-trivial tasks: plan first, then execute

For non-trivial tasks, first ensure a plan exists. If no plan file exists, spawn a **planner sub-agent** (`agents/planner.md`) to create one:

```
Read the planner agent instructions at: agents/planner.md

Task description: <the task from the execution brief>
Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
```

Then spawn the **executor sub-agent** with the plan:

```
Read the executor agent instructions at: agents/executor.md

Plan file path: <path to plan file>
Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
```

After each executor agent completes:

1. Review its summary for anything that should go in the follow-up file
2. Verify the agent actually persisted insights: check if MEMORY.md or backlog files were updated when the task involved research or analysis. If the agent produced findings but didn't persist them, do it now.
3. Commit all changes with a descriptive message: `"[task-slug]: [what was done]"`
4. Note the completed task in the Cycle Log

### Step 4: Assess & Loop

After completing all tasks in a cycle:

1. Re-read any state files or backlog files that were modified during execution
2. Check if the stopping conditions (Phase 3) are met
3. If not, return to Step 1 for the next cycle

## Phase 3: Stopping Conditions

Keep cycling. The default is to **keep going**, not to stop.

You stop ONLY when:

- **`once` mode**: Stop after completing one full identify→prioritize→execute pass
- **User-specified cutoff**: if the user provided a task limit or time constraint in $ARGUMENTS, respect it
- **Hard block**: ALL of the following must be true simultaneously:
  1. Every candidate task in the current backlog requires real-world actions or is blocked on user input
  2. You ran the task-finder agent with a **full scan across ALL lenses** — not just follow-through
  3. You spawned the **opps-finder agent** and it produced zero feasible items even after considering adjacent opportunities, strategic gaps, and preparatory research
  4. That combined effort produced zero new feasible items that an autonomous agent could work on
  5. You have already completed at least one full identify→prioritize→execute cycle in this session

Before declaring a hard block, verify each condition. If you only ran follow-through, go back and run a full scan. If you haven't spawned the opps-finder agent yet, do that before stopping.

These are NOT reasons to stop:
- "Diminishing returns" — small tasks are still valuable
- "The backlog is empty" — generate more items
- "Most items are blocked" — generate new ones that aren't
- "Remaining items require user action" — that describes the *current* backlog, not all possible work. Find new work.

When a stopping condition is met, proceed to Phase 4.

## Phase 4: Summary & Handoff

Create `plans/YYYY-MM-DD_get-to-work-summary.md`:

```markdown
# Get to Work — Summary

**Date:** YYYY-MM-DD
**Branch:** YYYY-MM-DD-get-to-work
**Cycles completed:** N

## What Was Done

| # | Task | Cycle | Status | Commit | Artifacts |
|---|------|-------|--------|--------|-----------|
| 1 | [task name] | 1 | completed | abc1234 | [files created] |
| 2 | [task name] | 1 | completed | def5678 | [files created] |
| 3 | [task name] | 2 | completed | ghi9012 | [files created] |
| ... | ... | ... | ... | ... | ... |

## New Backlog Items Added
[List of items added during identify-work phases that weren't executed]

## Stats
- Tasks completed: N
- Plans created: N
- State files updated: N
- Backlog items added: N
- Backlog items completed: N

## Stopping Reason
[Why the agent stopped cycling]

## Follow-up Required
[Summary of items from follow-up file, grouped by urgency]
```

Commit the summary: `"get-to-work: summary and follow-up (N tasks completed across M cycles)"`

### Handoff

When the user returns, present the summary and use the `/review-followup` skill to walk them through the follow-up file. After follow-up items are resolved, offer to merge the branch.

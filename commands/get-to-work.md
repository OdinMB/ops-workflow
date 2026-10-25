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
2. Create a follow-up file at `plans/YYYY-MM-DD_get-to-work-followup.md`, titled `# Get to Work — Follow-up`, with every section `ops:work-autonomously` lists (the agents write to all of them) and one more at the end:

```markdown
## Cycle Log
Summary of each identify → prioritize → execute cycle.
```

**How to write an entry.** Every entry leads with the decision, question, or omission stated in plain terms — what it means for the project, what it costs to leave as-is, and what the realistic options are. Someone who has not read a single file in this repo must be able to decide from the entry alone. Anything only an agent needs — plan file paths, state file or artifact names, backlog entry wording, commit refs — goes at the end of the entry under a `For the executor:` line, never in the opening sentences.

3. Parse `$ARGUMENTS`:
   - **First word** — mode: `tasks`, `opps`, `full`, or `escalating` (default if omitted)
   - **Second word** — repeat: `cycle` (default if omitted) or `once`

## Phase 2: Work Cycle

Repeat this cycle until one of the stopping conditions (Phase 3) is met.

**Your job is to use the time while the user is away on work worth doing.** A backlog of blocked items is a reason to look for work an agent can do — preparatory research, state refreshes, drafts, knowledge gaps — before concluding there is none. Everything you finish lands in the user's review, so the bar is whether it is worth their time, not whether it is possible.

### Step 1: Identify New Work

#### Mode: Determine search strategy

Parse `$ARGUMENTS` for the mode (first word). Default to `escalating` if not specified.

- **`tasks`**: Spawn only the task-finder agent. Skip opps-finder entirely.
- **`opps`**: Spawn only the opps-finder agent. Skip task-finder entirely. The opps-finder produces backlog-ready items — add them directly.
- **`full`**: Spawn both task-finder and opps-finder agents **in parallel**. Merge their findings for Step 2.
- **`escalating`** (default): Spawn the task-finder agent first. If its lenses 1-6 found fewer than 2 new feasible items, also spawn the opps-finder agent to expand the search (Escalation, below).

Spawn the task finder with `subagent_type: "ops:task-finder"` and this prompt:

```
Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
Scan depth: <"full" on first cycle, "follow-through" on subsequent cycles unless yield is low>
```

On the first cycle, use "full" scan depth. On subsequent cycles, start with "follow-through" (focused on recent completions). If a follow-through scan's `Lenses 1-6 new feasible items` count is below 2, widen to a full scan on the next attempt.

Record what was added in the Cycle Log section of the follow-up file. Commit the backlog updates and the follow-up file, naming their paths (`git add -- <paths>`, then `git commit -m "identify work: add N new backlog items (cycle M)" -- <paths>`)

**Escalation** (`escalating` mode only; `tasks` never escalates, and `opps` and `full` already ran the opps finder): if the task finder's `Lenses 1-6 new feasible items` count is below 2, spawn the opps finder with `subagent_type: "ops:opps-finder"` and this prompt:

```
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

**If prioritization yields no task worth doing** after only a follow-through scan, go back to Step 1 for a full scan (and, outside `tasks` mode, the opps finder) before applying Phase 3.

### Step 3: Execute Tasks

Execute the selected tasks. Independent tasks that touch different files can run in parallel — see the worktree note below. Otherwise, execute sequentially.

#### Classify each task as trivial or non-trivial

**Trivial** — a small, obvious change: updating a single file, fixing a typo, adding a short entry, minor content edits. No research or multi-step coordination needed.

**Non-trivial** — everything else.

#### Trivial tasks: skip planning, execute directly

For trivial tasks, spawn an executor (`subagent_type: "ops:executor"`) directly with a task description:

```
Task description: <the task from the execution brief>
Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
```

You can spawn multiple executor agents in parallel for independent trivial tasks that touch different files.

**Worktree isolation for parallel executors:** When spawning 2+ executor agents in parallel that might edit overlapping files (e.g., both updating MEMORY.md, the same state file, or the same backlog), use `isolation: "worktree"` on each agent so they work in separate git worktrees and don't create file conflicts. If the tasks clearly touch different files with no overlap, worktrees aren't needed — just spawn them normally. Don't create worktrees for a single agent running alone.

#### Non-trivial tasks: plan first, then execute

For non-trivial tasks, first ensure a plan exists. If no plan file exists, spawn a planner (`subagent_type: "ops:planner"`) to create one:

```
Task description: <the task from the execution brief>
Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
```

Then spawn an executor (`subagent_type: "ops:executor"`) with the plan:

```
Plan file path: <path to plan file>
Follow-up file path: plans/YYYY-MM-DD_get-to-work-followup.md
```

After each executor agent completes:

1. Review its summary for anything that should go in the follow-up file
2. Verify the agent actually persisted insights: check if MEMORY.md or backlog files were updated when the task involved research or analysis. If the agent produced findings but didn't persist them, do it now.
3. Commit the task's changes, naming their paths: `git add -- <paths>`, then `git commit -m "[task-slug]: [what was done]" -- <paths>`. Take the paths from the executor's summary and `git status`; never `git add -A` or a bare `git commit` (see `work-autonomously`, rule 4)
4. Note the completed task in the Cycle Log

### Step 4: Merge Worktrees

If any executor agents ran in worktrees during this cycle, merge their branches back into the current get-to-work branch before proceeding:

1. For each worktree branch, run `git merge <worktree-branch>`
2. If a merge conflict occurs, resolve it sensibly — prefer the more complete change, or combine both if they're complementary
3. Record any non-obvious conflict resolution decisions in the follow-up file under "Controversial Decisions" so the user can review them
4. After merging, clean up: `git worktree remove <path>` and `git branch -d <worktree-branch>` — one of the deletions `work-autonomously` allows, and only for worktrees this run created

Skip this step if no worktrees were used in this cycle.

### Step 5: Assess & Loop

After completing all tasks in a cycle:

1. Re-read any state files or backlog files that were modified during execution
2. Check if the stopping conditions (Phase 3) are met
3. If not, return to Step 1 for the next cycle

## Phase 3: Stopping Conditions

Keep cycling while there is work worth the user's review time; stop when what remains is not. A cosmetic edit, a speculative direction that nothing in MEMORY.md, state or the backlog points to, or filler that restates what the knowledge base already holds does not justify another cycle. Record such items under **Suggested Follow-Up Work** in the follow-up file rather than writing them into the knowledge base.

Stop when one of these holds:

- **`once` mode** — after one full identify→prioritize→execute pass.
- **The user's cutoff** — a task, cycle or time limit given in `$ARGUMENTS` (e.g. "max 3 cycles").
- **Nothing left worth doing** — after a full task-finder scan (not only follow-through) and, outside `tasks` mode, the opps finder, the feasible candidates left are cosmetic or speculative.
- **Hard block** — every candidate needs a real-world action or the user's input, and that same full search found nothing an agent can do.

Write which one held, and why, under **Stopping Reason** in the summary, then proceed to Phase 4.

## Phase 4: Summary & Handoff

Create `plans/YYYY-MM-DD_get-to-work-summary.md`:

```markdown
# Get to Work — Summary

**Date:** YYYY-MM-DD
**Branch:** YYYY-MM-DD-get-to-work
**Cycles completed:** N

## What Changed

Three to six sentences: what the project now knows, has, or can do that it could not before, and what it cost. No file names, no counts.

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

Commit the summary and follow-up files by path — `git add --` those two paths, then `git commit -m "get-to-work: summary and follow-up (N tasks completed across M cycles)" -- plans/YYYY-MM-DD_get-to-work-summary.md plans/YYYY-MM-DD_get-to-work-followup.md`

### Handoff

When the user returns, tell them in plain terms what the project gained and what it cost, what you deliberately left alone and why, and what still needs a decision from them. The table and the Stats block are the record a future session reads — don't read them out, don't recite file names, and don't turn counts into the briefing.

Then use the `/review-followup` skill to walk through the follow-up file.

Once follow-up items are resolved, offer the closing decision at the level of the work rather than the level of commits: keep all of it, keep it except one named piece — named by what it is, "the funder research", never by commit hash or filename — or leave the branch parked for now. Whichever they pick, map it onto the actual commits yourself.

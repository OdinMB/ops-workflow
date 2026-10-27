---
description: Generate an executive overview of the project. Synthesizes state, backlogs, and recent plans into a ranked action plan answering "What should we do next?"
allowed-tools: Read, Glob, Grep, Bash(git log *)
---

Generate an executive overview for this project. $ARGUMENTS

## Instructions

### 1. Gather Context

Read only the high-level INDEX files first. Be selective about drilling into details — only read individual files when needed to answer a specific question or fill a gap.

**Round 1 — INDEX files only** (skip any that don't exist):

1. **`MEMORY.md`** and **`charter.md`** — Project overview and knowledge map, and the goals your ranking serves (a repo set up before `charter.md` existed keeps them in MEMORY.md).
2. **`state/INDEX.md`** — Area names and status summaries.
3. **`backlog/INDEX.md`** — Priorities and item titles.
4. **`plans/completed/INDEX.md`** — Recently finished plans, for momentum.
5. **Active plans** — Glob `plans/*.md` and skip `INDEX.md`. Every other file directly under `plans/` is an active plan, except an autopilot cycle record (`*autopilot-cycle*`), which item 6 reads. `plans/INDEX.md` deliberately lists none of them, so it can't tell you what's in flight.
6. **Autopilot** — if the repo's CLAUDE.md has an `## Autopilot` section: `state/autopilot.md`, for what autopilot waits on the user for, and its latest cycle record, `plans/YYYY-MM-DD_autopilot-cycle*.md` (or in `plans/completed/` once the user has decided what it offered), for what autopilot built, offered and ranked next across both repositories. Code work lives in the code repo's backlog, and the cycle record is where this repo sees it — unless the section tells autopilot to keep code items in this repo's backlog too: then a backlog item marked `(code item)` is autopilot's to build, never ops work, and you recommend it as such. Entries in `backlog/ideas.md` are ideas autopilot has yet to route to a repository: never recommend them as ops work; at most mention how many wait.

**Round 2 — Selective drill-down:**

- Read every **active plan file** found by the glob (not completed ones — titles in `plans/completed/INDEX.md` are enough for momentum context).
- Read the individual state or backlog files your recommendations rest on, or that the user's focus area needs. Stay selective: read to check a candidate, not to survey the repo.

### 2. Verify before ranking

The INDEX summaries, backlog entries and plans are claims about the project, and they drift. Before a candidate goes on your list, check the claims it rests on:

- **Already done?** Look for its output in `references/`, `artifacts/`, `state/` or `plans/completed/`. An active plan whose artifacts already exist, or a backlog item whose research is already written up, is housekeeping, not next work.
- **Still blocked?** A `WAITING (` marker or a dependency may have resolved since it was written; check the state file it points at.
- **Still current?** Check the date in the state file it relies on, and `git log --oneline -15` for work the indexes don't show yet.

Drop or demote what fails the check, and put the mismatch under Housekeeping.

### 3. Analyze

With all context loaded, assess:

- **Momentum**: What has been accomplished recently? What's the trajectory?
- **Bottlenecks**: What's blocking progress? Are there unresolved decisions, missing prerequisites, or resource constraints?
- **Quick wins**: What high-impact items can be done with minimal effort?
- **Strategic bets**: What bigger moves could shift the project's trajectory?
- **Staleness**: Are any state files outdated? Are backlog items obsolete?

### 4. Output

Present the overview using this structure. Do not explain the project — the user knows what it is. Focus on **where things stand** and **what to do next**.

---

#### Header

```
# Executive Overview
_Generated: <today's date>_
```

#### Status Dashboard

A compact table showing key metrics at a glance. Pull numbers from state files. Use `—` for unknown values.

**Derive areas from top-level state entries** (folders and files directly under `state/`). Each row corresponds to one top-level entry. Do NOT nest every sub-topic — only add `└` child rows for sub-areas where something particularly noteworthy is happening right now (e.g., a recent launch, an upcoming deadline, a specific blocker). Most state areas should be a single row. Keep the dashboard to 3-5 top-level rows with 0-2 nested rows total.

Example (do NOT copy these rows — derive your own from the actual state files):
```
| Area | Status | Detail |
|------|--------|--------|
| Audience | <emoji> <one-line summary> | <key number or trend> |
| └ Social | <emoji> <one-line summary> | <only if noteworthy right now> |
| Platform | <emoji> <one-line summary> | <what's new or notable> |
| Handover | <emoji> <one-line summary> | <next milestone> |
```

Use these status emojis:
- `>>` = strong momentum, active progress
- `>` = moving, some progress
- `~` = stable, no change
- `!` = needs attention
- `x` = blocked

#### What to Do Next

```
## What to Do Next

### Quick wins (< 1 hour each)
1. **<Action>** — <one sentence: why and what it unlocks>
2. ...

### Focused work
1. **<Action>** — <one sentence: why and what it unlocks>
2. ...

### Strategic (needs planning)
1. **<Action>** — <one sentence: why and what it unlocks>
2. ...
```

Split recommendations into effort tiers. Maximum 3-4 items per tier. If a tier would be empty, omit it.

#### Waiting For (optional — omit if none)

Grep all files under `state/` and `backlog/` for the marker `WAITING (`. Each match follows the format `WAITING (who/what, since YYYY-MM-DD)`. Items may appear in state files (action taken, awaiting external response) or backlog files (action still pending but blocked). Surface them in a table:

```
## Waiting For
| Item | Waiting on | Since | Source |
|------|-----------|-------|--------|
| <what's waiting> | <who/what> | <date> | <filename> |
```

#### Open Decisions (optional — omit if none)

```
## Decisions Needed
| Decision | Options | Blocks | Deadline |
|----------|---------|--------|----------|
| <what needs deciding> | <A / B / C> | <what can't proceed> | <when> |
```

If `state/autopilot.md` holds anything waiting on the user's decision — work to ship or land, variants to pick, ask-first items, read-backs — or a cycle record still directly under `plans/` offers something, this section appears even with no other decision, and ends with what autopilot waits on: one line per kind, with how many. Bookkeeping is not a decision: a charter reconfirmation coming due gets one line, marked not counted, and branches to clean up or queued edits none. Tell the user to say "autopilot" in a session to decide them.

#### Housekeeping (optional — omit if nothing is stale)

```
## Housekeeping
- [ ] <stale file or obsolete item that should be updated/removed — with filename>
```

---

### 5. Focus Area

If the user specified a focus area, add an additional section after "What to Do Next":

```
## Deep Dive: <Focus Area>
<Detailed analysis of the focus area — current state, all relevant backlog items, dependencies, and a recommended sequence of actions.>
```

### Rules

- **Do not write or modify any files.** This command is read-only.
- **Be concrete.** "Submit to public-apis repo" is good. "Improve marketing" is not.
- **Reference sources.** When citing a backlog item, state file, or plan, mention the filename so the user can find it.
- **Respect the project's constraints.** If MEMORY.md mentions resource limits (solo project, non-commercial, limited time), factor those into your recommendations. Don't recommend things that require a team of five.
- **Don't repeat the backlog verbatim.** The user already has the backlog. Your job is to prioritize, connect, and recommend — not to copy-paste.
- **Skip project introductions.** Don't describe what the project is. The user knows. Start with where things are right now.

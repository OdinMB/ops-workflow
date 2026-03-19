---
description: Generate an executive overview of the project. Synthesizes state, backlogs, and recent plans into a ranked action plan answering "What should we do next?"
model: sonnet
allowed-tools: Read, Glob, Grep
---

Generate an executive overview for this project. $ARGUMENTS

## Instructions

### 1. Gather Context

Read only the high-level INDEX files first. Be selective about drilling into details — only read individual files when needed to answer a specific question or fill a gap.

**Round 1 — INDEX files only** (skip any that don't exist):

1. **`MEMORY.md`** — Project overview and knowledge map.
2. **`state/INDEX.md`** — Area names and status summaries.
3. **`backlog/INDEX.md`** — Priorities and item titles.
4. **`plans/INDEX.md`** — Note active vs completed plans.

**Round 2 — Selective drill-down:**

- Read **active plan files** (not completed ones — titles in the INDEX are enough for momentum context).
- Read up to **3** individual state or backlog files if they're directly relevant to your recommendations or the user's focus area. No more than 3.

### 2. Analyze

With all context loaded, assess:

- **Momentum**: What has been accomplished recently? What's the trajectory?
- **Bottlenecks**: What's blocking progress? Are there unresolved decisions, missing prerequisites, or resource constraints?
- **Quick wins**: What high-impact items can be done with minimal effort?
- **Strategic bets**: What bigger moves could shift the project's trajectory?
- **Staleness**: Are any state files outdated? Are backlog items obsolete?

### 3. Output

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

#### Housekeeping (optional — omit if nothing is stale)

```
## Housekeeping
- [ ] <stale file or obsolete item that should be updated/removed — with filename>
```

---

### 4. Focus Area

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

---
description: Summarize what happened in the project since a given date. Produces a structured overview of completed work, state changes, backlog movement, and key decisions — using tables and lists, never prose. Use when the user wants to catch up on project activity, review recent progress, or generate a status update for stakeholders. Trigger on phrases like "what happened since", "catch me up", "recap", "what did we do", "summary of recent work", "progress since", "status update since".
model: sonnet
allowed-tools: Read, Glob, Grep, Bash
---

Summarize what happened in this project since the date specified: $ARGUMENTS

If no date is provided, ask the user for one.

## Instructions

### 1. Parse the Date

Convert $ARGUMENTS to an absolute date (YYYY-MM-DD). Handle natural language like "last week", "March 1", "two weeks ago", "Monday". If the input is ambiguous or missing, ask the user.

Store the resolved date as `$SINCE`.

### 2. Gather Evidence

Collect changes from these sources. Read them in parallel where possible. Skip sources that don't exist.

#### a. Completed Plans

Read `plans/completed/INDEX.md`. Identify plans with date prefixes >= `$SINCE`. Read each matching plan file — focus on the **Objective**, **Outcome**, **Key Decisions**, and **Artifacts** sections.

#### b. Active Plans

Read `plans/INDEX.md`. Note any plans that were created after `$SINCE` (check their date prefix or file modification context). These represent work that started but hasn't finished yet.

#### c. Git History

Run `git log --oneline --after=$SINCE` to see commits in the date range. This captures changes that might not have corresponding plans (quick fixes, direct updates, autonomous work).

#### d. State File Changes

Grep all files under `state/` for `_Last updated:` lines. Flag any with dates >= `$SINCE` — these represent reality that changed during the period.

#### e. New Artifacts

Scan `artifacts/` (and subfolders) for files with date prefixes >= `$SINCE`. These are deliverables produced during the period.

#### f. MEMORY.md Changes

Check git log for commits that touched MEMORY.md since `$SINCE`. If any exist, note what Key Learnings or context was added.

#### g. Backlog Movement

Compare the current backlog state against git history to identify items that were added or removed since `$SINCE`. Use `git log --oneline --after=$SINCE -- backlog/` to approximate this.

### 3. Assess Volume and Set Granularity

Count the total number of changes (completed plans + state updates + artifacts + significant commits). The output should scale with what actually happened — **never pad quiet periods with filler**. A busy period needs compression; a quiet period just needs less output.

- **Quiet period** (1-3 changes): A short, structured list. Might be 100-150 words total. That's fine.
- **Moderate period** (4-8 changes): Table of completed work plus brief lists for state changes and backlog. ~200-400 words.
- **Busy period** (9-15 changes): Table with thematic grouping. Expand only the 2-3 most significant items. ~400-600 words.
- **Very busy period** (16+ changes): Organize by theme/area. Summarize patterns ("5 competitor research tasks completed, covering X, Y, Z"). Call out only the most notable items individually. Cap at ~600 words.

### 4. Output

Present the recap using structured lists and tables — never prose paragraphs. Skip any section with no content.

---

#### Header

```
# Recap: $SINCE to today
_<N> days | <change count> changes_
```

#### Completed Work

The core section. Always use a table when there are 3+ items, a bullet list for 1-2.

**Table format (3+ items):**
```
| # | What | Artifacts | Impact |
|---|------|-----------|--------|
| 1 | <description> | <filenames> | <what it unlocked> |
```

**List format (1-2 items):**
```
- **<description>** — <impact> _(plan: <filename>)_
```

Prioritize by impact, not chronology. Group related work on adjacent rows.

#### State Changes (omit if none)

```
## State Changes
- **<state area>**: <what's different now> _(state/<file>.md)_
```

#### In Progress (omit if no active plans started in this period)

```
## In Progress
- **<plan name>** — <what remains>
```

#### Backlog Changes (omit if nothing notable)

```
## Backlog Changes
- Added: <item> _(backlog/<file>.md)_
- Removed: <item>
```

#### Key Learnings (omit if MEMORY.md didn't change)

```
## Key Learnings
- <insight>
```

---

### Rules

- **Read-only.** Do not write or modify any files.
- **No padding.** If little happened, the recap is short. Never inflate quiet periods with extra detail or prose to fill space.
- **No prose.** Use bullet lists, tables, and structured sections. No narrative paragraphs.
- **Prioritize by impact.** Lead with the most significant changes, not the most recent.
- **Reference sources.** Mention filenames so the user can dig deeper.
- **Skip empty sections.** Only include sections that have content.
- **No project introduction.** The user knows what the project is. Start with what happened.
- **Connect the dots.** When changes are related, make the connection clear in the impact column or with grouping — but do it structurally, not with prose.

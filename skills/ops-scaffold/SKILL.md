---
name: ops-scaffold
description: Set up or adjust a non-code project management repo with the ops folder structure, CLAUDE.md, and INDEX.md hierarchy. Use when starting a new ops/PM repo from scratch or when an existing one needs to match the ops conventions.
---

# Ops Scaffold

Set up a new non-code project management repo, or adjust an existing one to match the ops conventions.

## Detect Mode

Check the current directory:

- **If `CLAUDE.md` exists** → **Adjust mode**: read it, compare against the template below, and propose specific changes. Don't overwrite — use Edit to patch. Ask before creating missing folders.
- **If no `CLAUDE.md`** → **New repo mode**: run the full interview and scaffold from scratch.

## Interview (New Repo Mode)

Ask the user:

1. **Project name** — what the project is called
2. **One-paragraph description** — what the project does, who it's for
3. **Constraints** — team size, budget, timeline, key limitations
4. **Goals** — 2-4 strategic goals for the near term
5. **Initial domain areas** — what topics will the project cover? These become the initial subfolders. Examples:
   - Marketing, legal, fundraising, partnerships, technical research
   - Or more specific: grants, audience growth, competitor analysis
6. **Connected to a coding repo?** — ask if this ops repo is paired with a codebase. If yes, ask for the relative path from this repo to the code repo root (e.g., `../` if sibling directories, `../app/` if nested). This enables read-only access to the code for context.

## Interview (Adjust Mode)

Read the existing structure (CLAUDE.md, MEMORY.md, folder listing). Then ask:

1. **What needs changing?** — or just check against the template and propose fixes
2. **Missing folders?** — offer to create any missing standard folders with INDEX.md files
3. **CLAUDE.md drift?** — show specific differences from the template and offer to patch

## Directory Structure

```
<project-dir>/
├── .claude/
│   └── settings.json
├── state/
│   └── INDEX.md
├── backlog/
│   └── INDEX.md
├── references/
│   └── INDEX.md
├── artifacts/
│   └── INDEX.md
├── plans/
│   ├── INDEX.md
│   └── completed/
│       └── INDEX.md
├── .update/
│   └── .gitkeep
├── .gitignore
├── CLAUDE.md
└── MEMORY.md
```

For each domain area the user specified, create a subfolder with an `INDEX.md` in the appropriate parent:
- Research topics → subfolders under `references/`
- Task areas → subfolders under `backlog/`
- Only create `state/` subfolders if the user has multiple distinct state areas

Example: if the user says "grants, marketing, legal" →
- `references/grants/INDEX.md`
- `references/marketing/INDEX.md`
- `references/legal/INDEX.md`
- `backlog/grants/INDEX.md` (if grants involve actionable tasks)

## .claude/settings.json

```json
{
  "permissions": {
    "allow": []
  }
}
```

## Connected Coding Repo (if applicable)

If the user said this ops repo is connected to a coding repo, set up read-only access:

### 1. Create `.claude/settings.local.json`

```json
{
  "permissions": {
    "allow": [
      "Read(<relative-path>/**)"
    ],
    "deny": [
      "Write(<relative-path>/**)",
      "Edit(<relative-path>/**)"
    ]
  }
}
```

Replace `<relative-path>` with the path the user provided (e.g., `../`, `../app`).

### 2. Add to CLAUDE.md

Add a section after "Working Directory":

```markdown
## Connected Codebase

This ops repo is paired with a coding repo at `<relative-path>`. You have **read-only** access to it for context — understanding architecture, reading implementations, checking current state.

**You MUST NEVER write, edit, or create files in the connected codebase.** All outputs belong in this PM folder. If work needs to happen in the code repo, produce a spec or brief in `artifacts/` that the user takes there.

**When to read the codebase:**
- To ground research or strategy in the actual implementation
- To verify state file accuracy against current code
- To inform specs and briefs with real architecture details
- When backlog items reference code features or components

**How to reference code:**
- Use relative paths: `<relative-path>/src/components/Header.tsx`
- Cite specific files and line numbers when referencing implementation details in artifacts
```

### 3. Add to MEMORY.md

Under the project description, add:

```markdown
## Connected Codebase

Paired with coding repo at `<relative-path>`. Read-only access for context. Never edit code — produce specs/briefs in artifacts/ instead.
```

## .gitignore

```gitignore
# AI development
.playwright-mcp/
.claude/settings.local.json
nul
NUL

# IDE
.vscode/

# Update inbox (keep the directory, ignore contents)
.update/*
!.update/.gitkeep
```

## MEMORY.md

**MEMORY.md is for stable project context only** — description, constraints, goals, and key learnings. It is NOT for task status, WAITING markers, blocked items, or anything that changes week-to-week. Those belong in `state/` and `backlog/` files.

Fill in from the interview answers:

```markdown
# Project Context

_Last updated: <today's date>_

## The Project

<one-paragraph description from interview>

## Constraints & Goals

<constraints and goals from interview, as bullet points>

## Key Learnings

_None yet._
```

## CLAUDE.md

Write a CLAUDE.md based on this template. Customize `[PROJECT NAME]` and adjust the Working Directory section if the repo is nested inside a code repo.

````markdown
# Project Management Repo

## What This Is

Project management folder for [PROJECT NAME]. Used for marketing, research, strategy, legal compliance, and operational planning — not for code.

## Working Directory

All paths in tool calls (Read, Write, Edit, Glob, Grep) must be relative to this directory. Examples:

- `references/marketing/INDEX.md` (correct)
- Glob pattern: `artifacts/**/*.md` (correct)

If the codebase lives in a parent or sibling directory, use relative paths (e.g., `../client/`, `../server/`) to read files from it.

You MUST NEVER write, edit, or create files outside this PM directory. All outputs belong in this PM folder only.

## Scope — What This Repo Does and Doesn't Do

This repo produces **strategy, research, content, and specifications** — not code. Never plan or attempt to implement changes in app codebases. You can:

- Draft copy, content, and marketing materials (stored in `artifacts/`)
- Research and recommend how something should be implemented
- Produce specs or briefs that the user takes to the coding repo
- Read codebases for context

You cannot: write code, create components, modify apps, or run app commands.

## Folder Structure

- `state/` — Living documents describing **what currently exists**. Updated when something actually changes.
- `backlog/` — **What to do next**: prioritized tasks, opportunities to pursue, draft plans. Items within each file are ordered by priority (highest first).
- `references/` — **Inputs**: research and context organized by topic. Read-only background that informs decisions.
- `artifacts/` — **Outputs**: stand-alone work products that were delivered or submitted (applications, marketing copy, pitches, specs). Do NOT proactively search this folder for context — only read artifacts when the user explicitly references them.
- `plans/` — Active plans currently being executed.
- `plans/completed/` — Completed plans with outcomes documented.
- `.update/` — **Inbox**: drop files here for processing via `/ops:update`. Contents are gitignored. After processing, files are either deleted or moved to `references/` or `artifacts/`.
- `MEMORY.md` — Always loaded in the system prompt. Contains project description, constraints, and key learnings only.

## Persisting Insights

Any task — research, content, strategy — can produce insights that matter beyond the task itself. When you finish a piece of work, actively ask: "Did I learn something that changes the project's understanding of its landscape, constraints, or opportunities?" If yes:

- **Key learnings** → add to `MEMORY.md` under Key Learnings. These must be **general, high-level insights** that shift the project's strategic understanding — not specific entities, names, or data points. Examples: "The academic AI-for-education space is more active than expected — multiple groups are building similar tools" (good) vs. "Stanford d.school is building 'Beyond the Horizon'" (too specific — belongs in a reference or state file). If a learning is about a specific organization, tool, deadline, or data point, it belongs in `references/` or `state/`, not MEMORY.md.
- **Actionable opportunities** → add to the appropriate `backlog/` file in priority order. Examples: grant programs worth applying to, audience segments to investigate, tools to evaluate.

Don't let insights live only in reference files where they'll be forgotten. The reference file stores the detail; MEMORY.md and backlog store the "so what" — but MEMORY.md stores only the *general* so-what, not the specifics.

## Workflow

Follow `/ops:handle` for all non-trivial tasks — it delegates to `/ops-plan` for planning and `/ops-execute` for execution.

## Plans vs. Artifacts vs. References

Three distinct roles — don't conflate them:

- **Plans** document the **process**: what steps were taken, what decisions were made, what the outcome was. Plans should NOT contain the final deliverable text — that belongs in an artifact.
- **Artifacts** are the **deliverables**: the actual submitted application, the published copy, the spec. An artifact stands alone and can be read without the plan.
- **References** are the **inputs**: research, analysis, data gathered before or during the work. They inform decisions but aren't deliverables themselves.

**Artifact naming:** Date-prefix artifacts that have been **delivered** (submitted applications, sent pitches, published posts) — e.g., `2026-02-16_grant-application.md`. Do NOT date-prefix drafts, templates, or reusable items that may be updated.

**Example flow for a grant application:**

1. Research the fund → `references/grants/opportunities.md` (input)
2. Plan the application → `plans/grant-application.md` (process)
3. Draft and submit → `artifacts/grants/2026-02-16_grant-application.md` (dated output)
4. Complete the plan → `plans/completed/2026-02-16_grant-application.md` (process log linking to the artifact)

## State vs. Backlog Separation

State files describe **what currently exists** — present reality. Backlog files describe **what to do next** — actions and opportunities to pursue.

**State files should contain:**

- Current metrics and facts
- Structural constraints
- Strategic context

**State files should NOT contain:**

- Opportunity tables with deadlines and statuses (backlogs)
- Upcoming deadline lists (backlogs)
- Open decisions about what to pursue (backlogs)
- Prioritized action items (backlogs)
- Forward-looking sections ("What's Needed", "Pipeline", "Strategy" with next steps)
- Backlog item counts (e.g., "5 active opportunities") — these go stale immediately

When an action is **taken** or an opportunity is **secured**, the result moves from the backlog to the relevant state file.

## Knowledge Navigation

This repo uses a recursive `INDEX.md` pattern. Every folder has an `INDEX.md` that provides a **complete overview of that topic at its level of abstraction**, plus links to sub-files and subfolders for deeper detail. An INDEX.md is not just a file listing — it should contain enough substantive content that a reader understands the full picture without needing to open any sub-files.

**Retrieval protocol:**

1. Start from CLAUDE.md's **Folder Structure** section to identify which folder holds the topic.
2. Read that folder's `INDEX.md`.
3. If you need more detail → follow the link to the sub-file or subfolder's `INDEX.md`.
4. **Never read an entire folder blindly** — always start from its `INDEX.md`.

**Maintenance protocol:**

1. When creating, deleting, renaming, or significantly changing any file → update that folder's `INDEX.md` entry.
2. When the substance of a topic changes → update the INDEX.md's overview content.
3. If the change shifts the folder's overall summary → cascade the update to the parent `INDEX.md`.

**When to create a new subfolder:**

- When a folder accumulates 5+ files on a distinct sub-topic.
- Always create an `INDEX.md` in the new subfolder immediately.

## Waiting-For Markers

When something is blocked on an external response, mark it inline with:

```
WAITING (who/what, since YYYY-MM-DD)
```

Place the marker right after the item description. Markers can appear in **state files** (action taken, awaiting response) or **backlog files** (action pending but blocked).

## State File Hygiene

Any living document (state files, backlogs, MEMORY.md) should have a `_Last updated: YYYY-MM-DD_` line near the top. Update the date when editing.

## General Rules

- **Never submit, send, or publish anything.** Only prepare drafts, prefill forms, and stage content. The user performs all final actions.
- Keep outputs concise and actionable.
- When doing research, cite sources.
- Before overwriting an existing file, confirm with the user or make edits (don't rewrite from scratch unless asked).
- **Copy/paste-ready text:** When producing text the user will copy into an email client, form, or terminal, output it as a single continuous block with no artificial line breaks. Let the client handle wrapping. Paragraph breaks (blank lines) are fine; hard line breaks within a paragraph are not.
- **Use unordered lists (-)** for backlog items, research findings, plan steps, and any list where entries may be added or removed. Numbered lists cause unnecessary churn — deleting item 3 of 9 forces renumbering items 4-9. Reserve numbered lists for cases where the count itself matters (e.g., "3 options to choose from" in a decision prompt).

## Memory

All project memory lives in this `CLAUDE.md` file and `MEMORY.md`. Do not use or update the auto-memory file under `~/.claude/projects/`.
````

## INDEX.md Files

Each INDEX.md should have real content, not placeholder comments. Write a brief overview of what that folder will contain based on the interview context.

**Root-level folders** (state/, backlog/, references/, artifacts/):

```markdown
# <Folder Name>

<One sentence describing what this folder contains in the context of this specific project.>

## Contents

_No files yet._
```

**Subfolders** (e.g., references/grants/):

```markdown
# <Topic>

<One sentence describing what research/tasks this subfolder covers.>

## Contents

_No files yet._
```

**plans/completed/INDEX.md:**

```markdown
# Completed Plans

Archived plans with documented outcomes.

## Contents

_No completed plans yet._
```

**plans/INDEX.md:**

```markdown
# Plans

Active plans. Don't update this INDEX for active plans — just create plan files here and move them to `completed/` when done.
```

## Initial State Files

If the user provided enough context during the interview, create 1-2 initial state files documenting what's already known:

- `state/platform.md` — if there's an existing product/service to document
- `state/audience.md` — if there are existing users/subscribers
- `state/<domain>.md` — for any area where current facts are known

Update `state/INDEX.md` to list these files.

## Initial Backlog Items

Ask the user: "What are the first 3-5 things you want to work on?" Add these to the appropriate backlog file(s), ordered by priority.

## Git Init (New Repo Mode)

Before creating any files, run `git init` in the project directory, then `git branch -M main` to rename the default branch. The finalized scaffolding becomes the first commit.

## README.md

Write a project README covering:

1. **Header**: Project name and one-paragraph description from the interview.
2. **Prerequisites**: Mention that this repo is designed to work with [Claude Code](https://claude.com/claude-code) and the **ops-workflow** plugin.
3. **Key Commands**: The ops-relevant commands — interactive (`/ops:handle`, `/ops:overview`, `/ops:update`, `/ops:housekeeping`), discovery (`/ops-find-tasks`, `/ops-find-opps`), and autonomous (`/ops:get-to-work`, `/ops:batch-plan`, `/ops:batch-execute`, `/review-followup`).
4. **Folder Structure**: This repo's specific folders with one-line descriptions based on the interview context.
5. **Typical Workflow**: 4-5 example commands using project-relevant language.

## Verification

After scaffolding (new repo) or adjusting:

1. Verify every folder has an INDEX.md
2. Verify MEMORY.md references are valid
3. Verify CLAUDE.md has no remaining `[PROJECT NAME]` placeholders
4. Run `ls` on each directory to confirm structure matches expectations
5. Stage all files and create the initial commit: `"Initial scaffolding"`

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

Follow `/ops:handle` for all non-trivial tasks — it delegates to `/plan` for planning and `/execute` for execution.

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

This repo uses a recursive `INDEX.md` pattern. Every folder has an `INDEX.md` that provides a **complete overview of that topic at its level of abstraction**, plus links to sub-files and subfolders for deeper detail.

An INDEX.md is **not a file listing** — it should contain enough substantive content (~2 pages) that a reader understands the full picture without needing to open any sub-files. Concretely: include the key facts, numbers, and status for each entry — not just a title and link. A reader should only need to open a sub-file when they need *more* detail than the INDEX provides. When updating sub-files, always propagate key changes back to the INDEX summary.

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

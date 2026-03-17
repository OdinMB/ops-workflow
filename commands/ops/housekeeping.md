---
description: Consistency check for non-code repos with INDEX.md hierarchy. Verifies INDEX.md accuracy, MEMORY.md references, orphaned files, stale dates, and WAITING markers.
model: sonnet
allowed-tools: Read, Edit, Write, Glob, Grep, Bash(ls *), Bash(rm *), Bash(mv *)
---

# Ops Housekeeping

Scan this project's knowledge structure for inconsistencies and staleness. Report findings, then fix everything that can be fixed automatically.

## Pre-check: Process .update/ Inbox

Before running consistency checks, process any pending files in `.update/`. Spawn the `ops-updater` agent (`agents/ops-updater.md`) to handle this in an isolated context. Pass it a follow-up file path at `.tmp/housekeeping-update-followup.md`.

If `.update/` is empty or doesn't exist, skip this step.

Wait for the updater agent to finish before proceeding — the consistency checks should run against the freshly-updated knowledge base.

## Checks

### 1. INDEX.md Accuracy

For every folder that contains an `INDEX.md`:

1. Read the `INDEX.md`.
2. List the actual files and subfolders in that directory.
3. Flag:
   - **Missing entries**: files/subfolders that exist but aren't listed in `INDEX.md`
   - **Stale entries**: entries in `INDEX.md` that reference files/subfolders that no longer exist
   - **Outdated summaries**: entries whose one-line description doesn't match the file's actual content (spot-check the 3 largest files per folder)

### 2. MEMORY.md References

1. Read `MEMORY.md`.
2. Check every file path or folder reference it mentions — verify they exist.
3. Check that `state/` file summaries in MEMORY.md roughly match the actual file content.
4. Flag references to deleted or renamed files.

### 3. Orphaned Files

Find `.md` files that aren't listed in any `INDEX.md`. Exclude:
- `MEMORY.md`, `CLAUDE.md`, `README.md` (root-level files)
- Files in `.claude/`, `.context/`, `.plans/` directories
- Files in `plans/` (active plans aren't indexed)

### 4. Stale Dates

Check `_Last updated:_` lines in `state/` and `backlog/` files. Flag any that are older than 60 days — they may need review.

### 5. WAITING Markers

Grep for `WAITING (` across all files. For each match:
- Extract who/what is being waited on and the since-date
- Flag any that are older than 30 days — they may need follow-up

### 6. Stale Backlog Items

Check `backlog/` files for items that appear to be completed — e.g., they describe work whose output already exists in `references/`, `artifacts/`, `state/`, or `plans/completed/`. Completed items should be deleted from the backlog (done items aren't backlog), so flag them for removal. Also flag items marked "done" or "completed" inline — they should be deleted, not marked.

### 7. Backlog Priority Order

Backlog items within each file should be ordered by priority (highest first). Check each `backlog/` file for obvious priority violations — e.g., low-effort hygiene tasks listed above high-impact strategic items, or items that clearly don't flow from most to least important. Flag files where the ordering looks off.

### 8. Plans Hygiene

1. Check `plans/` for files that look completed (filled Outcome section, all checkboxes checked, or `Status: completed`) but haven't been moved to `plans/completed/`.
2. Check `plans/completed/` for files missing date prefixes.

### 9. Subfolder Candidates

Flag any folder with 5+ `.md` files that don't have subfolders — it may be time to organize.

## Output

Present findings as a checklist grouped by check type:

```markdown
# Housekeeping Report
_Generated: <today's date>_

## INDEX.md Issues
- [ ] `references/marketing/INDEX.md` — missing entry for `seo-strategy.md`
- [ ] `state/INDEX.md` — stale entry for `partnerships.md` (file deleted)

## MEMORY.md Issues
- [ ] Reference to `state/funding.md` — file doesn't exist (renamed to `state/grants.md`?)

## Orphaned Files
- [ ] `references/legal/gdpr-notes.md` — not in any INDEX.md

## Stale Documents
- [ ] `state/audience.md` — last updated 2025-12-03 (100+ days ago)

## Stale WAITING Markers
- [ ] `backlog/growth.md:15` — WAITING (Nieman Lab reply, since 2026-01-10) — 63 days

## Stale Backlog Items
- [ ] `backlog/growth.md:8` — "Research podcast directories" — output exists at `references/podcasting/directories.md`, delete from backlog

## Backlog Priority Order
- [ ] `backlog/growth.md` — low-effort hygiene items ranked above strategic opportunities

## Plans Hygiene
- [ ] `plans/social-media-setup.md` — looks completed but not moved

## Subfolder Candidates
- [ ] `references/marketing/` — 7 files, consider organizing

## Summary
- N issues found across N checks
- N files scanned
```

If a section has no findings, omit it.

## Phase 2: Fix

After producing the report, fix every issue you can. Specifically:

| Issue type | Action |
|---|---|
| Missing INDEX.md entry | Add the entry with an accurate one-line summary |
| Stale INDEX.md entry (file deleted) | Remove the entry |
| Outdated INDEX.md summary | Update the summary to match actual content |
| MEMORY.md references deleted file | Remove or update the reference |
| Orphaned file | Add it to the appropriate INDEX.md |
| Stale backlog item (work already done) | Delete the item from the backlog file |
| Backlog item marked "done"/"completed" | Delete it |
| Completed plan not moved | Move to `plans/completed/` with date prefix |
| Completed plan in `plans/completed/` missing date prefix | Rename to add date prefix |

Do **not** auto-fix:
- Stale dates (flag only — the content may still be accurate)
- Stale WAITING markers (flag only — needs human judgement)
- Backlog priority order (flag only — needs human judgement)
- Subfolder candidates (flag only — needs human decision on organization)

After fixing, update the report: change `[ ]` to `[x]` for each fixed item and append a brief note of what was done.

## Rules

- **Be specific.** Always include the exact filename and what's wrong.
- **Don't over-flag.** Minor wording differences between an INDEX.md summary and a file's content are fine. Only flag when the summary is clearly wrong or misleading.

---
name: ops-find-tasks
description: Scan an ops repo's goals, state, and backlog to identify new valuable work items. Produces new backlog entries integrated into the project's knowledge system. Used by the get-to-work command — load when autonomously identifying what an ops project should be working on next.
---

# Ops Find Tasks

Analyze the project's goals, current state, and existing backlog to surface new work items that would move the project forward. The output is new backlog entries — this skill does NOT execute them.

## Context Required

Before running this skill, you need the project overview already loaded (MEMORY.md, state files, backlog, recent plans). If you don't have it, gather it now following the same context-loading steps as `ops:overview`.

## Analysis Lenses

Examine the project through these lenses to find work that isn't already tracked. Skip lenses that don't apply to the project.

### 1. Goal Gaps

Compare the project's stated goals (from MEMORY.md and state files) against what's actually being tracked in the backlog:

- Goals with no corresponding backlog items or active plans
- Goals where progress has stalled — the last related completed plan is old
- Sub-goals or prerequisites that are implied but not explicitly tracked

### 2. Stale State

State files describe reality. When reality changes, state files need updating:

- State entries older than 60 days that likely need refreshing (market data, competitor info, pricing, statistics)
- State entries that reference external resources that may have changed
- Missing state files for aspects of the project that have evolved since the last update

### 3. Research Opportunities

Knowledge gaps that could be filled with web research or analysis:

- Competitors, tools, or platforms mentioned in goals but not yet researched
- Industry trends relevant to the project's domain
- Best practices or case studies that could inform strategy
- Reference material that would strengthen existing plans

### 4. Content & Artifact Gaps

Deliverables that would be useful based on the project's current trajectory:

- Templates, frameworks, or checklists referenced in plans but not yet created
- Drafts that are needed as prerequisites for backlog items
- Documentation that would make future work easier

### 5. Follow-Through

Work that naturally follows from recently completed plans:

- Next steps mentioned in completed plan outcomes that aren't tracked
- Items marked as "future work" or "out of scope" in completed plans
- Monitoring or review tasks that should happen after major deliverables

### 6. Consistency & Hygiene

Structural improvements to the project's knowledge system:

- INDEX.md files that need updating
- Backlog items that are vague and need scoping into concrete tasks
- Duplicate or overlapping backlog items that should be merged
- Backlog items that are actually done and should be deleted (done items aren't backlog)

### 7. New Directions

When lenses 1-6 are running dry, think beyond the project's existing structure. This lens is handled by the **ops-opps-finder agent** when called from `get-to-work`. When running `ops-find-tasks` standalone, briefly consider: what adjacent opportunities, strategic gaps, or preparatory research should the project explore that isn't already tracked? Add concrete, actionable items — not vague strategic musings.

## Process

### Step 1: Scan

For each applicable lens, search for opportunities. Use Glob/Grep/Read to examine:

- All state files and their freshness
- All backlog files and their items
- Recent completed plans (last 5-10)
- MEMORY.md for stated goals and priorities
- References directory for existing research

### Step 2: Filter

Remove items that:

- Are already tracked in the backlog (even if worded differently)
- Are too vague to act on (refine them first, or skip)
- Consist *entirely* of real-world actions the agent cannot perform (e.g., physically attending a meeting)
- Are trivial maintenance that doesn't move the project forward

### Step 3: Create Backlog Entries

For each new work item:

1. Determine which backlog file it belongs in (by topic/category)
2. Write a clear, actionable entry with:
   - **What**: concrete description of the task
   - **Why**: how it connects to project goals
   - **Effort estimate**: light (< 1 hour), medium (1-3 hours), or heavy (3+ hours)
3. Insert the entry into the appropriate backlog file **in priority order** (highest first). Read the existing items, judge where the new item ranks relative to them, and place it there — not at the end
4. Update the backlog file's INDEX.md if needed

### Step 4: Report

Produce a summary of what was added:

```markdown
## New Work Items Identified

### Added to backlog
| # | Item | File | Lens | Effort |
|---|------|------|------|--------|
| 1 | [description] | backlog/[file].md | [lens] | light/medium/heavy |
| 2 | ... | ... | ... | ... |

### Skipped (already tracked or not actionable)
- [brief description] — [reason skipped]
```

## Rules

- **Do not execute any work items.** Only identify and add them to the backlog.
- **Delete completed backlog items.** If a backlog item is fully done (work product exists in references, artifacts, state, or completed plans), remove it — done items aren't backlog. If partially done, rewrite it to cover only the remaining work. If you're unsure whether something is truly done, note it in the follow-up file rather than leaving a stale entry.
- **Be concrete.** "Research X and write findings to references/X.md" is good. "Improve marketing" is not.
- **Respect project constraints.** If MEMORY.md mentions resource limits, don't suggest work that requires resources the project doesn't have.
- **Include real-world final steps.** If a task involves submitting a form, sending an email, etc., include the full task in the backlog (including the real-world step). The autonomous execution layer (`get-to-work`, `work-autonomously`) is responsible for scoping what agents actually do — this skill just identifies what needs doing.

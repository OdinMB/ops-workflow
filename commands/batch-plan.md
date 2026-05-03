---
description: Create a batch of ops plans continuously without user input, storing any user questions in a .md file to be processed with the user afterwards. Do NOT invoke this yourself! Should only be invoked by the user.
disable-model-invocation: true
---

# Task

You will be going on a plan writing spree for non-code work. I will provide a list of tasks or ideas. Write an ops plan for each of these items without interruptions.

Follow the `work-autonomously` skill throughout.

# Guidelines

- Create a follow-up file per the `work-autonomously` skill.
- At the start of the batch, pick a short slug-style **batch prefix** that names the theme of this batch (e.g. `music`, `q2-launch`, `donor-outreach`). Use the user's framing if they offered one; otherwise derive it from the tasks. Keep it lowercase, hyphenated, and brief.
- Filenames of plans should reference the goal of the plan, with today's date and the batch+order prefix: `<batch>-<NN>-YYYY-MM-DD-<slug>.md` (e.g. `music-01-2026-04-19-launch-brief.md`). The batch prefix keeps multiple concurrent ordered batches in `plans/` from stepping on each other.
- You can write plans in parallel if they don't directly relate to each other.
- **Scope check**: Plans must never include implementing changes in app codebases. This workflow produces content, research, specs, and briefs — not code.

# Triage

Before planning, classify each task as **trivial** or **needs-plan**:

- **Trivial** — a single obvious deliverable with no open questions: a small content edit, a one-paragraph note, updating a single field in a tracker, pasting known information into a document, a short email draft. No research required, no structural decisions, no stakeholder calls to resolve.
- **Needs-plan** — everything else: multi-step work, research, content requiring judgment, anything with open questions a planner could usefully surface.

When in doubt, treat it as needs-plan.

Trivial tasks skip the planner entirely and go into a single `plans/<batch>-direct-tasks.md` file as numbered entries. Non-trivial tasks get planned as usual. **Use the same numeric prefix sequence for both** so execution order across the whole batch is preserved. With batch prefix `music`:

- Task 1 (trivial) → entry `01.` in `plans/music-direct-tasks.md`
- Task 2 (needs-plan) → `plans/music-02-YYYY-MM-DD-<slug>.md`
- Task 3 (trivial) → entry `03.` in `plans/music-direct-tasks.md`
- Task 4 (needs-plan) → `plans/music-04-YYYY-MM-DD-<slug>.md`

`<batch>-direct-tasks.md` format:

```markdown
# Direct Tasks (music)

01. <task description — one or two sentences, enough for an executor agent to act on>
03. <task description>
```

If no trivial tasks are present, don't create the file.

# Planning

For each **needs-plan** task, spawn an **planner sub-agent** (`agents/planner.md`):

```
Read the planner agent instructions at: agents/planner.md

Task description: <the task or idea to plan>
Follow-up file path: <path to the follow-up file>
Plan file path: plans/<batch>-<NN>-YYYY-MM-DD-<slug>.md
```

After each planner agent completes, review its summary. If it recorded decisions or questions in the follow-up file, note them for the review phase.

You can spawn multiple planner agents in parallel if the tasks don't directly relate to each other.

# Review

Once all plans are written, use the `/review-followup` skill to walk through the follow-up file with the user. After each item is resolved, integrate the decision into the relevant plan file so each plan is self-contained. Then delete the follow-up file.

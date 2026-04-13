---
description: Execute a batch of ops plans continuously without user input, storing any issues and user questions in a .md file to be processed with the user afterwards. Do NOT invoke this yourself! Should only be invoked by the user.
disable-model-invocation: true
---

# Task

You will be going on a plan execution spree for non-code work. I will provide a list of plans. Execute these plans one by one without interruptions.

Follow the `work-autonomously` skill throughout.

# Steps

1. Check the current branch — if you're already on a feature branch, stay on it. Only create a new branch if you're on `main` (or the repo's default branch).
2. Create a follow-up file per the `work-autonomously` skill.
3. Build the ordered work queue: merge plan files (`plans/NN-*.md`) and any entries in `plans/direct-tasks.md` into a single list sorted by numeric prefix. Don't look ahead, don't run items in parallel.
4. Process the queue in order. Plan-file items go through the plan-based flow below; direct-task items go through the direct-task flow.
5. After all items are processed, use the `/review-followup` skill to walk through follow-up items with the user.
6. When all follow-up items are resolved, confirm with the user to merge the branch. Then perform the merge.

# Execution (plan files)

For each plan file, spawn an **executor sub-agent** (`agents/executor.md`):

```
Read the executor agent instructions at: agents/executor.md

Plan file path: <path to the plan>
Follow-up file path: <path to the follow-up file>
```

After each executor agent completes:

1. Review its summary for status and any follow-up items
2. Verify the agent persisted insights: check if MEMORY.md or backlog files were updated when appropriate. If the agent produced findings but didn't persist them, do it now.
3. Commit all changes (artifacts + state updates + completed plan) with a descriptive message

Don't batch commits across multiple plans — one commit per plan.

# Execution (direct tasks)

For each entry in `plans/direct-tasks.md`, spawn an **executor sub-agent** with just the task description (no plan file):

```
Read the executor agent instructions at: agents/executor.md

Task description: <the direct-task entry, verbatim>
Follow-up file path: <path to the follow-up file>
```

The executor should carry out the work directly without writing a plan. Same discipline as plan-file items — one commit per direct task, insights persisted when relevant. After a successful direct task, remove its entry from `plans/direct-tasks.md` and include the file change in the commit. When the last entry is processed, delete `plans/direct-tasks.md` entirely.

If a direct task turns out to be non-trivial once the executor starts (surprising scope, unclear approach, surfacing design questions), record it in the follow-up file and move on — don't spiral into an ad-hoc plan inside the direct-task flow.

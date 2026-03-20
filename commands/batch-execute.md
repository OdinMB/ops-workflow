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
3. Execute the plans one after the other. Don't look ahead into future plans, and don't execute plans in parallel.
4. After all plans are executed, use the `/review-followup` skill to walk through follow-up items with the user.
5. When all follow-up items are resolved, confirm with the user to merge the branch. Then perform the merge.

# Execution

For each plan, spawn an **executor sub-agent** (`agents/executor.md`):

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

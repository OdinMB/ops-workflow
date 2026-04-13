---
description: Plan and execute a batch of ops tasks continuously without user input. Combines /ops:batch-plan and /ops:batch-execute for end-to-end autonomous handling of many items in a row. Never for code changes. Do NOT invoke this yourself! Should only be invoked by the user.
disable-model-invocation: true
---

# Task

You will be going on a plan-and-execute spree for non-code work. I will provide a list of tasks or ideas. For each one, write an ops plan and then execute it — without interruptions.

Follow the `work-autonomously` skill throughout.

**Scope check**: This workflow produces content, research, specs, and briefs — not code. Never include app codebase changes in plans or execution.

# Process

This command composes the two existing batch commands. Run them in sequence using a **single shared follow-up file** so questions and decisions from both phases land in the same place for review.

## 1. Planning phase

Follow `/ops:batch-plan` to produce ordered plan files (`01-YYYY-MM-DD-<slug>.md`, `02-…`, …) in `plans/`. Create the follow-up file at the start of this phase — reuse it for the execution phase instead of creating a second one.

Skip `/ops:batch-plan`'s own review step: do NOT run `/review-followup` between phases, and do NOT delete the follow-up file. The user reviews everything once at the end.

## 2. Execution phase

Follow `/ops:batch-execute` against the plans just written, passing the same follow-up file. Execute plans in the order their prefixes indicate.

Skip `/ops:batch-execute`'s final `/review-followup` step as well — you'll run it once at the very end.

## 3. Review

Once all plans are executed, run `/review-followup` on the shared follow-up file. After all items are resolved, confirm with the user to merge the branch back into the main branch, then perform the merge.

# Why compose instead of duplicate

`/ops:batch-plan` and `/ops:batch-execute` already encode the details of each phase (planner/executor sub-agents, commit discipline, insight persistence, follow-up conventions). This command exists only to chain them with a shared follow-up file and a single review at the end — don't restate their instructions here.

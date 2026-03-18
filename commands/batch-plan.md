---
description: Create a batch of ops plans continuously without user input, storing any user questions in a .md file to be processed with the user afterwards. Do NOT invoke this yourself! Should only be invoked by the user.
---

# Task

You will be going on a plan writing spree for non-code work. I will provide a list of tasks or ideas. Write an ops plan for each of these items without interruptions.

Follow the `work-autonomously` skill throughout.

# Guidelines

- Create a follow-up file per the `work-autonomously` skill.
- Filenames of plans should reference the goal of the plan, prefixed with today's date: `YYYY-MM-DD-<slug>.md`.
- Give plan files an additional numeric prefix to indicate implementation order. (`01-`, `02-`, etc.)
- You can write plans in parallel if they don't directly relate to each other.
- **Scope check**: Plans must never include implementing changes in app codebases. This workflow produces content, research, specs, and briefs — not code.

# Planning

For each task, spawn an **planner sub-agent** (`agents/planner.md`):

```
Read the planner agent instructions at: agents/planner.md

Task description: <the task or idea to plan>
Follow-up file path: <path to the follow-up file>
Plan file path: plans/<NN>-YYYY-MM-DD-<slug>.md
```

After each planner agent completes, review its summary. If it recorded decisions or questions in the follow-up file, note them for the review phase.

You can spawn multiple planner agents in parallel if the tasks don't directly relate to each other.

# Review

Once all plans are written, use the `/review-followup` skill to walk through the follow-up file with the user. After each item is resolved, integrate the decision into the relevant plan file so each plan is self-contained. Then delete the follow-up file.

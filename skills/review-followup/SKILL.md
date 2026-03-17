---
name: review-followup
description: Process follow-up files from autonomous runs (ops:batch-execute, ops:get-to-work). Walks through each item, presents options, takes action, and cleans up.
argument-hint: "[optional path to follow-up file]"
---

# Review Follow-Up

Process follow-up `.md` files left by autonomous commands (`/ops:batch-execute`, `/ops:get-to-work`).

## 1. Find the follow-up file

If `$ARGUMENTS` contains a file path, use that. Otherwise, search for follow-up files:

1. Check `.plans/` and `plans/` for files matching `*follow*up*` or `*followup*`.
2. If multiple found, list them and ask the user which to review.
3. If none found, tell the user and stop.

Read the file. Also read the branch's git log (`git log main..HEAD --oneline`) to understand what was done.

## 2. Present the summary

Give a brief overview:
- How many items total across all sections
- Which sections have items (skip empty ones)
- The branch name and number of commits

## 3. Walk through each section

**Context before questions.** For every item you present, show the relevant context *first* — the actual code snippet, diff, file path, commit message, or whatever the user needs to understand the situation — before presenting options or asking anything. The follow-up file often contains only a brief summary; that's not enough. Read the relevant files, run `git show` on the relevant commit, or do whatever it takes so the user sees the concrete reality, not just an abstract description. Never ask "what do you want to do about X?" without first showing X.

Process sections in this order (skip empty ones):

### Implementation Issues
These block quality. Present each issue with options:
- **Fix now** — address the issue immediately
- **Create backlog item** — add to `.plans/` or `backlog/` for later
- **Dismiss** — not worth fixing

### Controversial Decisions
The agent made a judgment call. For each, show the decision and reasoning, then offer:
- **Keep as-is** — the agent's choice is fine
- **Revert** — undo this specific change (identify the commit)
- **Modify** — adjust the approach (ask what they want)

### User Input Needed
Questions the agent couldn't resolve. For each, read the relevant code/files so you understand the full situation, then present the question with that context and concrete options where possible. The follow-up file's summary alone is rarely enough — the user needs to see what's actually going on before they can answer. After getting the answer, take action if the answer implies a code change.

### Files to Delete
List each file with a one-line explanation of why. Offer:
- **Delete all** — remove everything listed
- **Pick individually** — go through one by one
- **Skip** — leave them for now

### DB Migrations
List the schema changes. These always need manual review. Just present them clearly — don't offer to run them.

### Skipped Items
Opportunities the agent chose not to act on. For each:
- **Plan it** — create a plan file for future work
- **Add to backlog** — lighter-weight tracking
- **Dismiss** — not worth pursuing

### Borderline Insights
Findings the agent wasn't sure were worth persisting. For each:
- **Add to CLAUDE.md** — if it's a project-wide convention or rule
- **Add to context file** — if it's topic-specific (ask which file)
- **Add to MEMORY.md** — if it's cross-project knowledge
- **Dismiss** — not worth keeping

### Suggested Follow-Up Work
Potential new work items. For each:
- **Create plan** — write a plan file
- **Add to backlog** — add as a backlog item
- **Dismiss** — not worth pursuing

## 4. Clean up

After all items are resolved:

1. Delete the follow-up file.
2. Summarize what was done: items kept, reverted, planned, dismissed.
3. If any items generated new plan or backlog files, list them.

## Rules

- **Context first, always.** Before every question or set of options, show the concrete context: the relevant code snippet, diff (`git show <commit>`), file path, or error. The follow-up file's one-liner is a pointer, not enough context for a decision. Read the actual source before presenting anything to the user.
- Use **AskUserQuestion** with concrete options — don't ask open-ended questions when you can present choices.
- Batch related items when possible (e.g., "these 3 skipped items are all test coverage — plan all, dismiss all, or pick individually?").
- When reverting, use `git revert` on the specific commit rather than manual edits, unless the commit contains mixed changes.
- When creating plan files, follow the project's existing plan format (check `.plans/` or `plans/` for examples).
- Keep momentum — the goal is to process the entire file in one session.

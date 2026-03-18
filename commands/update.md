---
description: Process external information into the ops repo's knowledge base. Drop files in .update/ or pass content inline. Use when you have new information (research, status changes, reference material, deliverables) to integrate into the project's structured knowledge system.
---

# Update

Process external information into the knowledge base.

## Detect Mode

- **If `$ARGUMENTS` is non-empty** → use the `/ops-update` skill directly (inline content stays in this context).
- **If `$ARGUMENTS` is empty or blank** → use the `/ops-update` skill directly (process `.update/` inbox interactively).

Use the `/ops-update` skill with `$ARGUMENTS` passed through. The skill handles both inline and inbox modes.

**When called from autonomous contexts** (e.g., `/ops:tidy`, `/ops:get-to-work`): the caller should spawn the `ops-updater` agent instead of invoking this command, to keep the work in an isolated context window.

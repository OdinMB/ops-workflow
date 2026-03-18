---
name: update
description: Process external information into the ops repo's knowledge base. Drop files in .update/ or pass content inline. Use when you have new information (research, status changes, reference material, deliverables) to integrate into the project's structured knowledge system.
argument-hint: <content to integrate, or empty to process .update/ folder>
---

# Update

Ingest external information into this ops repo's knowledge base. Two modes depending on whether arguments are provided.

## Detect Mode

- **If `$ARGUMENTS` is non-empty** → **Inline mode**: the arguments contain the information to integrate.
- **If `$ARGUMENTS` is empty or blank** → **Inbox mode**: process files from `.update/`.

---

## Inline Mode

The user provided content directly: $ARGUMENTS

1. **Load context.** Read `CLAUDE.md` and `MEMORY.md` to understand the repo structure, goals, and current state.

2. **Classify the information.** Determine what kind of knowledge this is:
   - **Status update** → belongs in `state/`
   - **Research / reference material** → belongs in `references/`
   - **Actionable opportunity or task** → belongs in `backlog/`
   - **Deliverable or work product** → belongs in `artifacts/`
   - **Strategic insight** → may also warrant a MEMORY.md Key Learnings update
   - **Mixed** → split into appropriate destinations

3. **Integrate.** For each piece of information:
   - Read the target file first — never overwrite blindly. Merge or append.
   - When updating state files, update the `_Last updated: YYYY-MM-DD_` line.
   - When adding backlog items, insert in priority order (highest first), not at the end.
   - If placement is genuinely ambiguous, ask the user before proceeding.

4. **INDEX.md cascade.** For every file created or significantly changed, update that folder's `INDEX.md`. If the folder's overall summary changed, cascade to the parent `INDEX.md`.

5. **MEMORY.md check.** If the information shifts the project's strategic understanding — a new constraint, a key learning, a changed goal — add or update an entry under Key Learnings. Don't add specific data points (those belong in state/references); only add general insights.

6. **Summarize.** Tell the user what was placed where.

---

## Inbox Mode

Process all files in the `.update/` directory.

1. **Load context.** Read `CLAUDE.md` and `MEMORY.md`.

2. **List files.** Check `.update/` for files (skip `.gitkeep`). If empty, tell the user "No files in `.update/` to process" and stop.

3. **Process each file.** For each file in `.update/`:

   a. **Read and understand** the file's contents. Consider the filename, format, and content to determine what it is.

   b. **Classify** — same categories as inline mode (status update, research, task, deliverable, mixed).

   c. **Extract and integrate** relevant information into the knowledge base:
      - Create or update files in `state/`, `references/`, `backlog/`, or `artifacts/` as appropriate.
      - Read target files before writing — merge, don't overwrite.
      - Update `_Last updated:_` dates on state files.
      - Insert backlog items in priority order.

   d. **INDEX.md cascade** — update every affected INDEX.md.

   e. **Dispose of the source file:**
      - **Delete** if all useful information has been extracted into structured knowledge (the common case — raw notes, status emails, data dumps).
      - **Move to `references/`** if the file itself is a useful reference to keep (e.g., a PDF report, a detailed analysis document).
      - **Move to `artifacts/`** if the file is a deliverable or work product (e.g., a submitted application, a finalized spec). Date-prefix it if it's been delivered.
      - If unsure whether to keep or delete, ask the user.

4. **MEMORY.md check** — same as inline mode. Update Key Learnings if warranted.

5. **Summarize.** List each file processed, where its information was placed, and whether the file was deleted or moved.

---

## Rules

- **State vs. backlog separation** — facts about current reality go in `state/`. Actions and opportunities go in `backlog/`. Don't mix them.
- **Don't duplicate** — before creating a new file, check if an existing file already covers that topic. Extend the existing file rather than creating a parallel one.
- **Preserve structure** — follow the repo's existing organizational patterns. If grants info lives in `references/grants/`, new grant research goes there too.
- **Cite sources** — if the incoming information references external sources (URLs, documents, people), preserve those citations in the integrated output.
- **Be conservative with MEMORY.md** — most updates don't warrant a Key Learnings entry. Only add entries that change the project's strategic understanding.

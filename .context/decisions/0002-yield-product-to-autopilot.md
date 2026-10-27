---
id: ADR-0002
title: Ops yields a repo's product to autopilot when an autopilot/ folder is present
status: superseded
date: 2026-10-27
superseded-by: ADR-0003
deciders: ["Odin Mühlenbein", "claude-code (AI)"]
context-repo: OdinMB/ops-workflow
---

# ADR-0002 · Ops yields a repo's product to autopilot when an autopilot/ folder is present

## Context

Odin, the plugin's owner, runs a private skill of his own, autopilot: a standing product-manager
agent that keeps its memory in an `autopilot/` folder inside a project's `-pm` repository, which
is an ops repo. Its files include a charter (product goals, users, non-goals), personas, a
roadmap, ideas, discarded ideas with their reasons, what it waits on the user for, a journal,
per-cycle digests and an `inbox/` for notes. When autopilot is set up in an ops repo, its setup
writes an `## Autopilot` section into that repo's `CLAUDE.md` that carries the full contract.

Until this change the plugin treated every folder of an ops repo as its own. `/ops:tidy` indexed,
split, moved and archived whatever it found; the finders read the project's goals only from
`MEMORY.md` and wrote product ideas into `backlog/`; `/ops:update` filed product feedback in
`state/`, `backlog/` or `references/`; and unattended runs could edit any file in the repo. In a
repo that also held `autopilot/`, two agents would each keep a record of the product's direction,
and housekeeping could rearrange files that autopilot reads by fixed name.

On 2026-10-26, in the session that coordinated this change, Odin decided that autopilot owns the
product — who it is for, product goals, users and personas, roadmap, ideas, and what was decided
against — while `MEMORY.md`'s goals keep everything else (stewardship, outreach, funding,
contributors), and asked for ops to be patched to match. The plugin is public, and most of its
users have no `autopilot/` folder.

## Decision

When a repo has an `autopilot/` folder, ops yields the product to autopilot. Ops reads
`autopilot/charter.md` for the product goals beside `MEMORY.md`'s, the roadmap's Now section and
`waiting.md` in `/ops:whats-next`, and the digests in `/ops:recap`; it checks `ideas.md` and
`discards.md` before proposing a product idea; and it sends product feedback, product and feature
ideas, and code or product work (linking any spec it wrote in `artifacts/`) to short notes in
`autopilot/inbox/` rather than to `backlog/`, `state/` or `references/`. In a session the user is
in, and only when the user asks, ops may edit the charter, personas, ideas, discards or the
roadmap's Next and Later directly, saying so in the commit message. Unattended runs only add
notes to `autopilot/inbox/`, and housekeeping leaves the folder out of every check and fix. The
contract itself lives in the repo's `## Autopilot` section, written by autopilot's setup; the
plugin carries only short lines that point at it. A repo without an `autopilot/` folder behaves as
before.

## Consequences

- One owner for a product's direction in each repo: ops no longer keeps a second, diverging list
  of product work in `backlog/`, and `/ops:tidy` can no longer move or split files autopilot reads.
- A public plugin now names a private convention of its owner's, and a reader without autopilot
  meets a README paragraph and conditional lines in twenty of its files that do nothing for them.
- The contract is split: its full text is written by autopilot's setup, while ops carries file
  names (`charter.md`, `ideas.md`, `discards.md`, `waiting.md`, `roadmap.md`, `digests/`,
  `inbox/`) in its own files. A rename on autopilot's side leaves those lines silently stale.
- In such a repo, product ideas wait in `autopilot/inbox/` until autopilot's next cycle instead of
  showing up in the ops backlog, so `/ops:whats-next` and `/ops:prioritize` see less product work
  of their own.
- Revisit if autopilot's file names or contract change, if autopilot is retired, or if someone
  other than the owner wants the same hand-off, which would argue for a configurable product-owner
  folder in place of the name `autopilot/`.

## Alternatives considered

- **Leave ops as it was** — housekeeping would keep indexing, splitting and archiving autopilot's
  files, and the finders would keep product ideas in `backlog/`, so two records of the product's
  direction would drift apart.
- **Paste the whole contract into the plugin** — every change on autopilot's side would need a
  plugin release, and the public plugin would describe a private skill at length.
- **A configurable product-owner folder** — more general, but nobody besides the owner needs it
  yet, and it adds a setting to every ops repo for one convention.
- **Ops keeps the product, and autopilot reads ops' backlog** — turned down by the owner's
  decision that autopilot owns the product.

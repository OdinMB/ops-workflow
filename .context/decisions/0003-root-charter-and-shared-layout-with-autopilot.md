---
id: ADR-0003
title: Goals live in a root charter.md, and autopilot works in the ops layout instead of an autopilot/ folder
status: accepted
date: 2026-10-27
deciders: ["Odin Mühlenbein", "claude-code (AI)"]
context-repo: OdinMB/ops-workflow
supersedes: ["ADR-0002"]
themes: ["personal-data"]
---

# ADR-0003 · Goals live in a root charter.md, and autopilot works in the ops layout instead of an autopilot/ folder

## Context

Under ADR-0002, a repo with an `autopilot/` folder split its goals in two: the product goals in
`autopilot/charter.md`, everything else (a steward, contributors, outreach, funding) in
`MEMORY.md`'s "Constraints & Goals", where every ops repo kept its goals. Ops sent product feedback
and ideas to notes in `autopilot/inbox/`, could edit autopilot's product files in a watched session
only with a `Product-Edit:` commit trailer, and left the whole folder out of housekeeping.

A review of the owner's setup on 2026-10-27 found what the split cost. `/ops:prioritize` weighed
both goal documents while autopilot read only its charter, so goals the owner had just set for a
project (a natural owner to take it over, open source by a date) counted to autopilot as new
directions it could not pursue. Autopilot was about to take on non-code work in the same repo, which
would have put two unattended rankers and executors, an autopilot cycle and `/ops:get-to-work`, on
one `backlog/` with no claim between them. The plugin carried conditional lines naming autopilot's
files in about twenty places.

Odin, the plugin's owner, decided on 2026-10-27, in the session that coordinated this change: every
goal lives in one `charter.md` at the repo's root, in the shape autopilot's charter already had plus
the audiences goals target, and `/ops:scaffold` creates it for every ops repo; autopilot moves into
the ops layout (ideas to `backlog/ideas.md`, discards to `references/discards.md`, personas to
`references/users/`, its policy to `references/autopilot-policy.md`, its ways of seeing to
`state/harness.md`, what waits on the owner to `state/autopilot.md`, its journal and digests to
cycle records in `plans/`, its inbox to `.update/`); the wall between the two goes, so an ops
session's edit to a shared file counts as the owner's direction, and only `state/autopilot.md` and
`references/autopilot-policy.md` stay autopilot's alone; and `/ops:get-to-work` steps aside where
autopilot runs the unattended work, without stopping the ops planner and executor that autopilot
itself spawns. He answered the design that set this out "yes", in his own words relayed verbatim to
the run that wrote this entry, adding: "-pm claude.md file should be able to have a comment for
autopilot like 'store all backlog items, code and non-code, in the -pm repo'. That way, we can steer
the behavior in case we want planning in a non-code repo." The paths, wording and conflict rules
below are the agent's, as in OdinMB/.claude's ADR-0074, which records the same decision for autopilot.

## Decision

Every ops repo keeps its goals in `charter.md` at its root: who the project is for, the job they
need done, numbered goals each with how you'd know, the audiences those goals target, non-goals,
what the owner cares about, and risk appetite. `/ops:scaffold` writes it from its interview, and
offers to move an older repo's goals out of `MEMORY.md`, which keeps the project description,
constraints, key learnings and one line pointing to the charter. The finders, `/ops:prioritize`,
`/ops:whats-next`, `/ops:update` and the planner read goals there, falling back to `MEMORY.md` in a
repo set up before the charter existed. Goals change only on the user's word, and an unattended run
never changes `charter.md`. Any repo with `references/discards.md` has the finders check it before
proposing an idea.

Where a repo's `CLAUDE.md` has an `## Autopilot` section, autopilot works in this layout as a peer.
Ops treats every file as shared except `state/autopilot.md` and `references/autopilot-policy.md`,
which it never edits; `/ops:tidy` indexes autopilot's files like any others but never moves the
paths autopilot finds by name or a cycle record autopilot has not yet archived. A product or code
idea goes to `backlog/ideas.md`, which autopilot routes to a repository; a steering line in the
section may keep code items in this repo too, in `backlog/code.md`, each marked as a code item and
autopilot's to build. User feedback goes only to `references/users/feedback.md`, anonymised before
it is written, since the inbox where autopilot used to anonymise it is gone. `/ops:whats-next` reads
`state/autopilot.md` and the latest `plans/*autopilot-cycle*` record, and `/ops:recap` reads the
cycle records in its period. `/ops:get-to-work` stops with one line where the section says
autopilot runs the project's unattended work; the batch commands and the watched commands run as
before. The task-finder, opps-finder and planner take an optional Working folder and Focus, as the
executor already took a Working folder, and all four ops agents take a Caller field: with
autopilot as the caller they are told the step-aside is not for them, return ideas and judgment
calls in their summary rather than files autopilot would not see, name a real person only one at a
time with a reason, and the executor writes anything sent in the user's name from a Voice file it
reads by path. An `autopilot/` folder left from the old layout is left alone until autopilot moves
it. As under ADR-0002, the contract's full text lives in the repo's `## Autopilot` section, written
by autopilot's setup, the plugin carries only short lines keyed on that section, and a repo without
it behaves as before apart from the charter.

## Consequences

- One goal list, which every ranker reads, so non-product goals reach autopilot's cycles and ops'
  finders alike, and one unattended worker per autopilot project.
- Every ops repo gains a root file. Existing repos keep their goals in `MEMORY.md` until
  `/ops:scaffold` moves them, so until then the readers look in two places, through a fallback
  that can go stale once no repo needs it.
- Goals are no longer imported into every session with `MEMORY.md`; a session that needs them
  reads `charter.md`, and one that skips it works without them.
- With the wall gone, nothing in git separates an ops session the owner directed from one he did
  not: autopilot takes both as his direction. What guards the charter is that unattended runs
  never change it, and that `/ops:get-to-work` steps aside; an unattended `/ops:batch-execute` still
  runs in an autopilot project.
- The step-aside rests on the section's wording, read by meaning, and on the ops agents being told
  it is not for them. A section worded so that it reads as stopping every unattended ops agent would
  stop autopilot's own executors.
- The plugin still names autopilot's files (`state/autopilot.md`, `references/autopilot-policy.md`,
  `backlog/ideas.md`, `backlog/code.md`, `references/discards.md`, `references/decisions.md`,
  `references/users/` and its `feedback.md` line, `state/harness.md`, the cycle record's name), and
  now its Caller and Voice file inputs too, so a rename on autopilot's side
  leaves those lines silently stale, as under ADR-0002.
- Revisit if autopilot is retired, if someone other than the owner wants the same hand-off, or if
  the owner wants ops' cheaper unattended loop back in an autopilot project.

## Alternatives considered

- **Keep ADR-0002's split** — two goal documents, weighed differently by the two rankers, and
  non-product goals out of autopilot's reach.
- **Autopilot reads `MEMORY.md`'s goals beside its charter, without editing them** — less
  migration, but still two goal documents that the two sides can weigh differently.
- **A root charter only in autopilot projects** — ops would read goals from two places for good,
  depending on whether a repo has autopilot.
- **Both unattended loops keep running, with a claim marker on backlog entries** — a lock
  convention in a public plugin, and the two rankers would still disagree.
- **Keep the wall** — inbox notes and the `Product-Edit:` trailer would keep every ops reader
  conditional on autopilot, and ops sessions' edits would still need a trailer to count.

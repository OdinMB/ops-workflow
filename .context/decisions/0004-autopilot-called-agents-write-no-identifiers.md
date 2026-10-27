---
id: ADR-0004
title: With autopilot as the caller, the ops planner and executor write nothing that identifies a person
status: accepted
date: 2026-10-27
deciders: ["claude-code (AI)", "Odin Mühlenbein"]
context-repo: OdinMB/ops-workflow
themes: [personal-data]
---

# ADR-0004 · With autopilot as the caller, the ops planner and executor write nothing that identifies a person

## Context

Under ADR-0003, the ops agents autopilot spawns could name a real person only one at a time, with a
reason. The planner and the executor spelled the rule out in their "When autopilot is the caller"
sections: never in bulk, the reason beside each name, only the personal data the goal needs, a note
of what is kept and until when, names only in the -pm repo. That was a copy of autopilot's own
named-people rule, which lives in a policy file in the user's -pm repo, outside this plugin.

On 2026-10-27 autopilot's owner changed that rule, as recorded in OdinMB/.claude's ADR-0075 and
relayed to the agent that wrote this entry: nothing that identifies a person is ever stored,
anywhere, and what is kept instead is a pointer to a project, an organisation or a channel. A copy
in this plugin would now contradict the rule it copied, and in other people's setups these agents
cannot read the caller's policy file to check.

## Decision

With autopilot as the caller, the planner and the executor each carry one line in place of the
copied rule: never write anything that identifies a person; keep pointers to projects,
organisations or channels; the caller's policy governs the rest. This replaces, for those two
agents, ADR-0003's clause that the ops agents name a real person only one at a time with a reason.
The task-finder and the opps-finder keep that clause's wording for now: in autopilot's discovery
scans they write nothing, and autopilot's brief to them carries its policy's rule as written. The
rest of ADR-0003 holds.

## Consequences

The two agents that write files for autopilot can no longer leave a person's identifier in a -pm
repo, and the plugin no longer holds a copy of autopilot's rule that drifts when the rule changes:
the one line defers to the caller. A plan or deliverable that needs a contact now names where to
find one, and the user finds the person. The plugin now states two forms at once: the writing
agents carry the new line, the finders the older wording. The finders' wording sits in their "When
autopilot is the caller" sections, so it applies under autopilot's brief, not outside it: a finder
autopilot calls reads a line that lets it name a person beside a brief that forbids it, and autopilot
replaces any identifier in a finder's items with a pointer before filing them. Revisit when the
finders are next changed, or if autopilot's rule changes again.

## Alternatives considered

- **Keep the copied rule in both agents** — it would contradict autopilot's rule, and a reader in
  another setup could not tell which holds.
- **Change all four agents in one step** — the change was scoped to the two agents that write
  files; the finders' wording is left for a change of its own.
- **Drop the line and rely on the caller's brief alone** — the executor writes into the repo
  whatever the brief leaves out, so the boundary belongs in its own text.

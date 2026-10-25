---
id: ADR-0001
title: Retire the Cowork MCP bridge
status: accepted
date: 2026-10-25
deciders: ["claude-code (AI)"]
context-repo: OdinMB/ops-workflow
---

# ADR-0001 · Retire the Cowork MCP bridge

## Context

Since March 2026 the plugin carried `mcp-server/`, an experimental MCP server that let Claude
Desktop's Cowork mode call the ops skills. Each tool call started a Claude Code session through the
Claude Agent SDK with `permissionMode: "bypassPermissions"`, without marking the session as
unwatched and possibly without loading the user's settings. Its project registry,
`projects.json`, was empty, and the README described it as a proof of concept.

A review of the owner's setup on 2026-10-25 found that no ops command had been typed since
2026-03-14 and that nothing showed the bridge in use, and asked whether to retire the bridge or
harden it. Hardening meant dropping the permission bypass, loading user, project and local
settings, setting `CLAUDE_UNWATCHED=1`, fixing the README's install path, and from then on keeping
the bridge's npm dependencies patched (it had already needed one round for 30 Dependabot alerts).

The run that wrote this entry received the answer through its workflow coordinator: Odin, the
plugin's owner, decided in conversation on 2026-10-25 to retire the bridge, because too few people
use the plugin to justify it and he works in the terminal. The entry names the agent that recorded
it until Odin confirms it in his own words.

## Decision

The plugin ships no bridge to Claude Desktop's Cowork mode. `mcp-server/` and its README section
are removed; the plugin is used from Claude Code, in the terminal or in Claude Desktop's Code mode.
The bridge's source stays in git history, at the last commit before its removal.

## Consequences

- The plugin has no npm dependencies left, so no dependency updates or security alerts to keep up
  with, and no unattended session that runs with permissions bypassed.
- Anyone who wired the bridge into Claude Desktop loses its tools after updating the plugin; they
  must switch to Claude Code. The registry was empty and no use was found, so this is expected to
  touch nobody, but it cannot be confirmed for a public plugin's other installs.
- The core repository's note on building MCP servers for Claude Desktop
  (`mcp-servers-for-claude-desktop.md`) existed only to serve this bridge and is retired with it;
  it too survives only in git history.
- Revisit if Cowork gains a way to run Claude Code plugins, or if people ask for the plugin outside
  Claude Code. A new bridge would start from the hardening list in Context, not from the old code.

## Alternatives considered

- **Harden the bridge** — the fixes are small, but they keep a public, permission-sensitive
  component and its dependencies alive for a use nobody was found to have.
- **Leave it as it was** — keeps a bridge that runs unattended sessions with permissions bypassed in
  a public plugin.
- **Move it to a separate repository** — the same upkeep, for the same absent users.

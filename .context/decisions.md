# Decision log

The repository's architectural decisions, oldest first. Each decision lives in its own file under
`.context/decisions/`; this index lists them by title. Unlike the rest of `.context/`, the log is a
historical record: entries are appended and never rewritten. An accepted entry that no longer holds
is superseded by a later one, and both stay, the older one marked as superseded.

To add one: take the next free id, counting the ids listed here and the stub ids in every plan
under `.plans/` and `.plans/completed/` (which is why an id can be missing from this list); create
its file, `.context/decisions/NNNN-<short-slug>.md`; and add its line at the bottom of this list.

- [ADR-0001 · Retire the Cowork MCP bridge](decisions/0001-retire-cowork-mcp-bridge.md)
- [ADR-0002 · Ops yields a repo's product to autopilot when an autopilot/ folder is present](decisions/0002-yield-product-to-autopilot.md) — superseded by ADR-0003
- [ADR-0003 · Goals live in a root charter.md, and autopilot works in the ops layout instead of an autopilot/ folder](decisions/0003-root-charter-and-shared-layout-with-autopilot.md)
- [ADR-0004 · With autopilot as the caller, the ops planner and executor write nothing that identifies a person](decisions/0004-autopilot-called-agents-write-no-identifiers.md)

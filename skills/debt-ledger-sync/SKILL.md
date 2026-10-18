---
name: debt-ledger-sync
description: Harvests deferred `shortcut:` comments from the codebase (same format as ponytail-debt) into a persistent debt ledger synced with Memory Bank, so deferred work survives across sessions instead of becoming "never". Use when asked to "sync debt", "update the debt ledger", "/debt-ledger-sync", "what did we defer", or during /update-skills and Memory Bank sync.
---

# Debt Ledger Sync

Scans the codebase for deferred-work markers, then writes them into a durable ledger
that Memory Bank tracks. One-shot report + one file write. Never modifies source code.

## Marker format

Recognizes comments matching (case-insensitive), optionally prefixed by language:

- `shortcut:` — canonical marker (ponytail 5+)
- `ponytail:` — legacy marker (older ponytail)
- `TODO(with reason)` / `FIXME:` — only when followed by a colon and explanation

Marker bodies end at the closing comment token. Nested braces, prose, and code stay untouched.

## Workflow

1. **Grep the workspace** for `shortcut:|ponytail:` (and `FIXME:` when flagged) across
   source files, excluding `node_modules`, `.git`, `dist`, `build`, `graphify-out`,
   `memory-bank`, and one-time vendored dirs.
2. **For each hit** capture: file path, line number, the marker text, and any trailing
   reason after the colon.
3. **Merge into the ledger** at `memory-bank/debt-ledger.md` (create `memory-bank/` first
   if it does not exist — see bootstrap below):
   - Keep entries grouped by file.
   - Deduplicate: an existing entry for the same path+line+text is left as-is; changed
     lines get their text refreshed rather than duplicated.
   - Mark resolved entry candidates for human review (marker no longer present in code)
     instead of deleting them — the user confirms removal.
   - New entries go under a `## Open (session <id or date>)` heading sorted by path.
4. **Mirror into Memory Bank**: append/refresh a summarize-only section in
   `memory-bank/progress.md` → `### Deferred work (debt ledger)` with the count and
   top 3 highest-churn items, followed by a pointer to the ledger file. Do not paste
   the whole ledger there.
5. **Report to the user**: total open items, newly added, resolved candidates, and the
   ledger path.

Ledger entry format:

```markdown
- [ ] `path/to/file.ts:123` — reason text (first seen YYYY-MM-DD)
```

## Memory Bank bootstrap

If `memory-bank/` does not exist in the workspace, ask the user once whether to run
the standard `/memory init` bootstrap (`memory-bank.md` skill). If they decline, still
scatter the ledger into `memory-bank/debt-ledger.md` so a later init picks it up, and
note that Memory Bank was not initialized.

## Guardrails

- Never edit source code, never resolve markers automatically.
- Never delete ledger entries without explicit user confirmation.
- Keep the diff to `memory-bank/` only (plus read-only source greps).

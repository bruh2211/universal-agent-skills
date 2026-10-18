---
name: prompt-clarity
description: "Turns vague, contradictory, or over-loaded prompts, specs, briefs, and agent handoffs into unambiguous, LLM-optimized instructions through a single gated pipeline (clarify → structure → sharpen → compress) while locking user intent so rewrites never drift. Use when asked to 'fix my prompt', 'make this clearer', 'rewrite this prompt', 'this prompt is ambiguous', 'prep a handoff for another agent', or before sending any important prompt to an LLM or subagent."
---

# Prompt Clarity — Gated Multi-Skill Pipeline

Composes four research-backed prompt disciplines into one pipeline with hard gates so
they never fight each other or damage the original intent:

| Phase | Discipline | Source skill it embodies |
|---|---|---|
| 1 | Ambiguity resolution & contract capture | `prompt-optimizer` (Sentry) + `llm-friendly-context` |
| 2 | Structure scaffolding | `prompt-engineering` (CodeAlive) |
| 3 | Content sharpening | `plsfix` (12 principles) |
| 4 | Token compression (optional pass) | `prompt-token-efficiency` (GitHub) |

## The one rule

**One pass per phase, in order, each phase exits through its gate before the next
starts.** Never run two phases in the same response, never re-open a closed phase.

---

## Phase 0 — Intent Snapshot (always first, never skipped)

Before any rewrite, record in plain text at the top of your working notes:

1. **The ask** — what the user ultimately wants back (deliverable, not process).
2. **The audience** — which model/agent consumes it, and what it can see (repo, web, nothing).
3. **Hard constraints** — budget, format, scope, safety, non-goals.
4. **Success criteria** — what "worked" looks like when the consumer finishes.
5. **Unknowns** — anything the user must confirm, tagged `[CONFIRM]`.

If the ask itself is unclear, STOP and ask the user 1-3 questions. Do not guess into
a rewrite. If the user wants speed ("just clean it up"), still write phases 0-2, and
mark phase 3 deliveries with `[CONFIRM]` where intent had to be inferred.

**Gate 0:** intent snapshot written; every contradiction between ask and constraints
surfaced and resolved (or explicitly parked as `[CONFIRM]`).

## Phase 1 — Ambiguity Resolution

Rewrite every vague expression into an observable decision rule. Use this table:

| Ambiguous form | Rewrite as |
|---|---|
| "appropriate", "proper", "better", "some" | a measurable criterion or checklist |
| "as needed" / "if needed" | the triggering condition + required action |
| "per convention" | the exact file, function, or documented convention |
| "related files" | specific paths, globs, or search hints |
| "optional" (as an unresolved choice) | required / omitted / required-if-`<condition>` |
| "TBD", "placeholder" | blocking unresolved item with owner + required input |
| pronouns with fuzzy antecedents | the concrete noun |
| negative instruction ("don't do X") | positive directive (do Y instead; keep narrow hard prohibitions only) |

Also capture the contract: task type, output shape required by the consumer, input
sources available, and the escalation path when data is missing or contradictory.

**Gate 1:** no undefined nouns, no vague qualifiers, success criteria testable,
output shape defined. Read the draft back against the Phase 0 snapshot — meaning
unchanged.

## Phase 2 — Structural Scaffolding

Assemble with structural markup. Keep exactly one job per block:

```
<context>  — background, constraints, data (stable facts)
<task>     — the single objective, numbered steps if sequential
<rules>    — positive directives, decision rules, uncertainty handling
<examples> — only if format/tone/edge case ambiguity would otherwise fail
<output_format> — required shape, length bound, error/escalation format
```

- Context before the ask (left-to-right processing).
- One goal per section; compound asks split into numbered steps.
- Separate instructions from data with delimiters; reference tags explicitly.
- If multiple goals genuinely remain, split the artifact into multiple prompts/passes
  instead of warping one prompt to hold them all.

**Gate 2:** a reader could pipe each block independently; no block mixes concerns.
Diff vs Phase 1 draft shows only structural moves — no meaning edits.

## Phase 3 — Content Sharpening (plsfix pass)

Apply the 12 principles in order. For each accepted edit, cite its principle:

1. Structure: context-first, one-ask-per-section, step decomposition, markup ✅ (usually done in Phase 2)
2. Content beats: concrete nouns, named audience, defined "done", one relevant example, positive framing, say why it matters, state what to do when uncertain, contradiction scan.
3. Delivery: stable terminology (one term per concept), sentence-level precision.

Every inferred change is tagged `[CONFIRM]` in a **change report**: edit → principle →
reason. Voice of the original is preserved; do not invent requirements.

**Gate 3:** change report complete; every edit traceable to a principle or Phase 0
item; user-visible `[CONFIRM]` list is short and actionable.

## Phase 4 — Compression (optional, only when asked or tokens are critical)

Then, and only then, remove filler. Rules:

- Keep all constraints and the locked intent. Cut only repetition, pleasantries,
  narrative framing, dead examples.
- Prefer imperative bullets; keep one minimal example if it prevents failure.
- Never compress past the point where `[CONFIRM]` items or constraints drop out.
- Keep a backup of the pre-compression version; compression is reversible.

**Gate 4:** fewer tokens, zero lost constraints, loss checked against the Phase 0
snapshot.

## Anti-drift guarantees (the "don't wreck the input" rules)

1. The Phase 0 snapshot is immutable after Gate 0; every later phase must still
   satisfy it. Conflict → stop and escalate, not silently reinterpret.
2. Each pass produces a **diff**, not a new document. The user always sees what moved.
3. `[CONFIRM]` items are questions for the user, never silently resolved.
4. Compression is last and reversible; structure is never "tightened" away.
5. If the artifact is for repeated production use, offer the eval loop (baseline →
   cluster failures → 2-4 candidates → holdout validation) from `prompt-optimizer`
   as a follow-up, rather than inline guessing.

## Escalation

- Intent unclear → ask before rewriting (Phase 0 stops the pipeline).
- Contradictory requirements → surface each, do not pick quietly.
- No way to define success criteria → say so; propose the smallest eval to fix it.

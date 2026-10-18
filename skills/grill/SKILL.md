---
name: grill
description: "Rigorous code review and critique: correctness, security, performance, anti-patterns, UI house rules, and whether tests test real behavior. Use for /grill, 'critique this hard', 'what is wrong with this'."
---

# /grill â€” Rigorous Code Review & Critique Command

You are a demanding code reviewer. When the user invokes `/grill`, you subject code, design, or architecture to intense, constructive criticism â€” finding flaws, weaknesses, anti-patterns, and missed opportunities before they ship.

## What /grill does

- **Code critique** â€” reviews implementation for correctness, clarity, security, performance, and maintainability.
- **Design grill** â€” evaluates UI/UX against house rules (no slop, no gradients, no nested boxes, readable typography, real imagery).
- **Architecture grill** â€” challenges tech decisions, data flow, coupling, and scalability assumptions.
- **Test grill** â€” checks test coverage, edge cases, boundary conditions, and whether tests actually test behavior.
- **Commit grill** â€” verifies conventional commits, atomicity, and clear descriptions.

## Grill rules

1. **Be harsh on the work, kind to the person.** Attack the code, not the author.
2. **Be specific.** Cite file:line where possible. No vague "this could be better."
3. **Prioritize.** Separate blockers (must fix) from suggestions (nice to have).
4. **Offer fixes.** For every flaw, suggest a concrete replacement or pattern.
5. **Re-grill.** After fixes are applied, re-review to confirm resolution.

## Grill checklist

| Area | What to look for |
|------|------------------|
| Correctness | Bugs, off-by-one, null handling, race conditions, wrong return types |
| Security | Secrets in code, injection, auth gaps, missing validation |
| Performance | N+1 queries, blocking calls, unoptimized renders, large bundles |
| Readability | Naming, magic numbers, deep nesting, long functions |
| Testing | Missing edge cases, mocked-away logic, no failure-path tests |
| Design (frontend) | Slop tells: gradients, pills, glass, icon cards, tiny labels, nested boxes |
| DX | Type safety, lint errors, build speed, unclear scripts |

## How to run /grill

1. **Read the target.** Get the file(s), PR diff, or design to review.
2. **Output findings.** Use terse `file:line` format for code issues, plus prose for design/architecture.
3. **Classify severity:** `BLOCKER`, `MAJOR`, `MINOR`, `NIT`.
4. **Propose remediation.** Show before/after snippets where helpful.
5. **Ask for re-grill.** Invite the user to apply fixes and re-invoke `/grill`.

## Integration with other skills

- Use **web-design-guidelines** to audit UI against Web Interface Guidelines.
- Use **design-taste-frontend** to check for anti-slop house-rule violations.
- Use **test-driven-development** to verify that fixes have tests.
- Use **memory-bank** to record recurring issues in `systemPatterns.md`.

## Output format

```
# /grill Report: <target>

## Summary
X issues found: B blocker(s), M major(s), m minor(s), n nit(s).

## BLOCKER
- `src/file.ts:42` â€” Unhandled promise rejection in `handleEvent`. Fix: add `.catch()` or try/catch.

## MAJOR
- `src/file.ts:15` â€” N+1 query in `getUsers`. Fix: batch fetch with `IN` clause.

## MINOR
- `src/file.ts:88` â€” Magic number `86400`. Fix: replace with `SECONDS_PER_DAY` constant.

## Design (if applicable)
- Hero section uses gradient background â€” violates "No gradients" house rule. Replace with flat colour.

## Re-grill
Apply fixes, then re-run `/grill` to verify.
```

Base directory for this skill: C:\Users\apuro\.config\opencode\skills


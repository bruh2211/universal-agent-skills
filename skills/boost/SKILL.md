---
name: boost
description: "Performance and capability boost: audit runtime/bundle/DB/cold-start bottlenecks, unlock missing capabilities (caching, retries, queues, auth), upgrade architecture, improve DX. Use for /boost, 'make it faster', 'boost capability'."
---

# /boost â€” Performance & Capability Enhancement Command

You are a performance optimization and capability enhancement specialist. When the user invokes `/boost`, you identify ways to make code, architecture, or workflows faster, stronger, or more capable.

## What /boost does

- **Performance audit** â€” find bottlenecks in runtime, bundle size, database queries, cold starts, rendering, or asset loading.
- **Capability boost** â€” add missing features that unlock new behavior (caching, retries, queueing, real-time, vector search, auth, observability).
- **Architecture upgrade** â€” refactor toward scalability, modularity, or resilience without changing external behavior.
- **Developer experience boost** â€” improve tooling, scripts, type safety, linting, test speed, or deploy velocity.

## How to run /boost

1. **Inspect the target.** Read the relevant code, config, or architecture. Check `memory-bank/techContext.md` and `systemPatterns.md` if present.
2. **Diagnose.** List concrete issues with impact (high/medium/low) and effort (small/medium/large).
3. **Propose boosts.** For each issue, give:
   - What to change (file, function, config)
   - Why it helps (metric or behavior)
   - How to verify (test, benchmark, build)
4. **Apply or scaffold.** Implement the highest-impact boost first, or offer a boost plan for the user to approve.

## Boost categories

| Category | Examples |
|----------|----------|
| Runtime speed | Memoization, indexing, connection pooling, lazy loading, edge caching |
| Bundle size | Tree-shaking, code splitting, dependency pruning, image optimization |
| Database | Query optimization, indexes, read replicas, connection pooling |
| Reliability | Retries, circuit breakers, timeouts, dead-letter queues, health checks |
| Observability | Logging, tracing, metrics, alerts, dashboards |
| DX | TypeScript strictness, pre-commit hooks, faster test scripts, deploy scripts |

## Integration with other skills

- Use **test-driven-development** â€” write a failing test that captures the performance regression before boosting.
- Use **conventional-commits** â€” commit boosts as `perf:` or `feat:`.
- Use **memory-bank** â€” record architectural changes in `systemPatterns.md`.
- Use **meta-orchestrator** â€” route boost tasks to `design-taste-frontend` (UI perf), `awesome-design` (token architecture), etc.

Base directory for this skill: C:\Users\apuro\.config\opencode\skills


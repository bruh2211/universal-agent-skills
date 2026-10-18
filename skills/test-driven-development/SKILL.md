---
name: test-driven-development
description: Test-Driven Development (TDD) and test-first engineering workflow. Enforces the Red-Green-Refactor cycle, prevents premature implementation code, guides edge-case test generation, and ensures high test coverage and fault tolerance across any stack (Jest, Vitest, Pytest, Go test, JUnit). Use when writing new features, fixing bugs with regression tests, refactoring critical paths, or when asked to "write tests", "use TDD", or "/tdd".
---

# 🧪 Test-Driven Development (TDD) Protocol

You are an expert software engineer practicing disciplined **Test-Driven Development (TDD)**. When this skill is active, you strictly adhere to the **Red-Green-Refactor** lifecycle.

---

## 🔁 The Red-Green-Refactor Lifecycle

```
      [ 1. RED ] ───────────► [ 2. GREEN ] ───────────► [ 3. REFACTOR ]
Write a failing test         Write minimal code to             Clean up & optimize
that defines desired         make the failing test            without altering
behavior.                    pass.                            behavior.
```

### Step 1: RED (Write the Test First)
* **Never write implementation code before a test.**
* Identify requirements, boundaries, error paths, and edge cases.
* Write a test that asserts the exact expected behavior, return type, or thrown exception.
* **Run the test and confirm it FAILS** for the expected reason (e.g., function not defined, assertion failed). If the test passes before implementation, the test is invalid.

### Step 2: GREEN (Make it Pass)
* Write the **simplest, most minimal code** necessary to satisfy the test.
* Avoid premature optimization or speculative features ("YAGNI" — You Aren't Gonna Need It).
* Run the test suite and confirm it turns **GREEN**.

### Step 3: REFACTOR (Improve Code Quality)
* Eliminate duplication, improve naming, extract helpers, and simplify algorithms.
* Ensure all tests remain **GREEN** throughout the refactoring step.

---

## 🛡️ Testing Matrix for Robust Code

Always cover the following 4 tiers for any new unit or feature:

1. **Happy Path**: Standard valid input produces the expected output.
2. **Boundary Conditions**: Zero, empty strings, null, undefined, max integer limits, empty arrays, single-item collections.
3. **Error & Exception Handling**: Invalid arguments trigger proper error types and human-readable messages.
4. **Asynchronous & Race Conditions**: Timeouts, rejected promises, network drops, concurrent mutations.

---

## 🚫 Anti-Patterns to Reject
* Writing all implementation code and adding tests afterwards as an afterthought.
* Testing implementation details or internal private variables rather than observable public contracts.
* Mocking everything so heavily that the test tests the mocks rather than the real logic.

---
name: conventional-commits
description: Standardizes semantic git commit messages, atomic commits, branch hygiene, and clean PR descriptions following the Conventional Commits specification. Use when preparing git commits, staging changes, writing commit messages, organizing pull requests, or when asked to "commit this", "write commit message", or "/commit".
---

# 📦 Conventional Commits & Git Hygiene Skill

You are a Git workflow and release engineering specialist. When preparing commit messages, branch naming, or pull request descriptions, enforce strict **Conventional Commits v1.0.0** standards.

---

## 📌 Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
* `feat`: A new feature for the user.
* `fix`: A bug fix.
* `docs`: Documentation only changes.
* `style`: Changes that do not affect code meaning (white-space, formatting, semicolons).
* `refactor`: A code change that neither fixes a bug nor adds a feature.
* `perf`: A code change that improves performance.
* `test`: Adding missing tests or correcting existing tests.
* `build`: Changes affecting build system or external dependencies (npm, cargo, gradle).
* `ci`: Changes to CI configuration files and scripts (GitHub Actions, CircleCI).
* `chore`: Maintenance tasks, repo configs, tool updates.

---

## 📐 Rules for Clean Commits

1. **Imperative Mood**: Use imperative present tense in the subject line (e.g., `"add auth token validation"`, NOT `"added auth token validation"` or `"adds auth token validation"`).
2. **No Trailing Period**: Do not end the subject line with a period.
3. **Atomic Commits**: Each commit should represent one logical, self-contained change. Never mix unrelated refactors with bug fixes.
4. **Breaking Changes**: Mark breaking changes with a `!` after the type/scope and include a `BREAKING CHANGE:` footer:
   ```
   feat(api)!: switch authentication header from X-Auth to Bearer token

   BREAKING CHANGE: Clients must update Authorization header to use the standard Bearer scheme.
   ```
5. **Issue References**: Reference issues cleanly in the footer:
   `Closes #142` or `Fixes #205`.

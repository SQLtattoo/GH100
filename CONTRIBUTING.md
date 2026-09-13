# Contributing

Keep the application explainable in two minutes and the presentation within ten.
Use Node 22 built-in APIs; do not add a framework or validation dependency without
discussing it. Tests must be deterministic, offline, and fast.

1. Read the [security policy](SECURITY.md).
2. Change the smallest relevant slice and add meaningful tests under `test`.
3. Run `npm test`, `npm run lint`, `npm run build`, then `npm run demo:verify`.
4. Review workflow permissions, shell inputs, immutable action pins, and artifact contents.
5. Update relative documentation links and the instructor narration when behavior changes.

Lint checks JavaScript syntax, JSON parsing, tabs, trailing whitespace, and final
newlines. It is intentionally not ESLint. The complete verifier also needs existing
PowerShell 7 and PyYAML; obtain approval before installing missing tools. Preserve
the lockfile even when it contains no dependencies, so `npm ci` and the npm cache
key remain demonstrable. Dependabot updates must preserve full SHA pins and their
human-readable release comments; review release changes before accepting updates.

Do not push, change a remote, create a secret, or publish a package on behalf of an
instructor without explicit permission. A pull request must never gain publishing
authority. Only an explicitly opted-in manual main-branch package dispatch may
publish. Do not add a local `publish` command or credential-based cloud simulation.

[CODEOWNERS](CODEOWNERS) intentionally has no active owner until the instructor
chooses a real account with write access. CODEOWNERS requests reviews; it does not
enforce approval without appropriate branch/ruleset controls. Never invent a user
or team in teaching material. Local Git identity is the user's choice; do not
change global Git configuration.

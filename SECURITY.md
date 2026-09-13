# Security Policy

This teaching repository has no production service or supported credential store.
Only the current main-branch demo is maintained. Never add real credentials,
credential-shaped placeholders, private data, or token dumps to code, issues,
artifacts, caches, or summaries. `COURSE_DEMO_FLAG` is a non-sensitive presence flag,
not a cloud credential. Tests use only the plain word `enabled`.

## Report a problem

Use the repository's Security > Report a vulnerability option when private
vulnerability reporting has been enabled by its owner. Otherwise contact the
instructor privately using the course's established channel. Do not open a public
issue containing a suspected secret. If a real credential was exposed, revoke it
at its issuer; deleting a file or workflow log is not sufficient remediation.

## Review boundaries

- Treat PR code, action code, build outputs, and cache contents as executable or untrusted input.
- Do not switch to `pull_request_target` to work around missing fork secrets.
- Keep explicit permissions, full action SHAs, disabled checkout credential persistence, and hosted runners.
- Never add credentials to a cache or artifact. Masking is not a security boundary.
- A composite action shares its job's runner and token authority; it is not an isolation mechanism.
- Require review of workflow edits before running secret-bearing or publishing jobs on main.
- `packages: write` and `id-token: write` are independent capabilities; neither is needed for ordinary CI.

[Local verification](scripts/demo-verify.ps1) runs deterministic pattern checks,
not an exhaustive secret scanner or GitHub policy engine. It scans authored files
and the small build outputs, excluding user editor settings, Git metadata,
dependencies, and package archives. Findings suppress matched values. No files are
sent to GitHub's secret-scanning service. Hosted execution and policy enforcement
must be verified separately with owner permission.

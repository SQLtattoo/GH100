# GH-100: Actions, Credentials, and Trust

A ten-minute instructor demonstration for a one-day GitHub Administration course.
Four modules, two completed, ten fast tests, zero application dependencies.

> **Disclaimer:** This repository is provided for learning and demonstration purposes.
> Product behavior, course content, and documentation can change. Always verify the
> latest information in [Microsoft Learn](https://learn.microsoft.com/) and the official
> product documentation collected in [REFERENCES.md](REFERENCES.md).

## Local verification

```powershell
npm run demo:verify
```

Requires existing Node.js 22+, npm, PowerShell 7, and Python with PyYAML for YAML
verification. The application and CI use no Python. CI explicitly selects Node 22.
The verifier installs no external packages: `npm ci --offline` checks the empty
lockfile, with lifecycle scripts, auditing, and funding requests disabled.
Missing tools are reported, never installed automatically.

```powershell
npm test
npm run lint
npm run build
Get-Content dist/summary.txt
```

Expected application output:

```text
GH-100 GitHub Administration: 2/4 modules complete (50%).
```

## Account and repository requirements

**A personal GitHub Free account and a public repository you own are sufficient.**
No Enterprise account, organization administrator, Azure subscription, PAT, or
self-hosted runner is needed. Standard public-repository GitHub-hosted runners
avoid private-repository minute budgets. Artifact storage and package quotas still
apply. Private repositories also work subject to your plan and policy limits.

An Enterprise Cloud account can use an allowed personal repository, but inherited
policy may prohibit Actions, public repositories, or packages. Membership alone
does not grant settings access. This demo does not require bypassing those policies.
GitHub Enterprise Server is not the target: runner availability and artifact action
compatibility differ (upload/download-artifact v4 are not supported on GHES).

## Demonstration components

- [Course application](src/course-status.mjs) and [one test file](test/course-status.test.mjs).
- [CI](.github/workflows/ci.yml), [reusable CI](.github/workflows/reusable-ci.yml),
  [local action](.github/actions/course-summary/action.yml), [OIDC explainer](.github/workflows/oidc-explainer.yml),
  and [package workflow](.github/workflows/package.yml).

## Supporting documentation

- [Best practices cheatsheet](BEST-PRACTICES-CHEATSHEET.md) — the practices demonstrated
  in the course, common misconceptions, and areas that require current documentation.
- [Current GitHub references](REFERENCES.md) — the authoritative source list for this
  repository, grouped by topic for verifying volatile GitHub details.

## Safe defaults

Push/PR CI has read-only repository permissions and no secret-consuming step.
Secret presence runs only on a manual main-branch dispatch in a non-fork repository.
It writes only `configured` or `not configured`. OIDC is explanation only: no token
request, token output, login, or cloud call. Package dispatch defaults to an archive
dry run; only explicit opt-in on main in a non-fork repository enables GHCR login
and publishing. The npm project is private and has no publish script or lifecycle
hooks. Local rehearsal never invokes Docker, authenticates, publishes, or contacts
GitHub/cloud APIs.

This prepared copy is connected to the public `SQLtattoo/GH100` repository and has
local Git history. Local rehearsal creates no additional remote, secret, package, or
cloud resource. Before any live change, obtain the owner's approval for each
operation. The user performs sign-in and any secret entry themselves.
Generated build and test evidence is ignored by Git. The Docker image is data-only,
built `FROM scratch`, not runnable.

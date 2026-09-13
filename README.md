# GH-100: Actions, Credentials, and Trust

A ten-minute instructor demonstration for a one-day GitHub Administration course.
Four modules, two completed, ten fast tests, zero application dependencies.

## Rehearse locally

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

## Choose your account

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

## Open the teaching path

- [Ten-minute walkthrough](docs/demo-walkthrough.md): exact timing, narration, trust boundaries, and local checkpoint commands.
- [Architecture](docs/architecture.md): orchestration versus runner execution, caches, artifacts, secrets, and OIDC.
- [Enterprise bridge](docs/enterprise-bridge.md): explanatory governance mappings, not live administration.
- [Failure fallback](docs/failure-fallback.md): offline rehearsal and honest substitutes for unavailable live evidence.
- [Course application](src/course-status.mjs) and [one test file](test/course-status.test.mjs).
- [CI](.github/workflows/ci.yml), [reusable CI](.github/workflows/reusable-ci.yml),
  [local action](.github/actions/course-summary/action.yml), [OIDC explainer](.github/workflows/oidc-explainer.yml),
  and [package workflow](.github/workflows/package.yml).

## Safe defaults

Push/PR CI has read-only repository permissions and no secret-consuming step.
Secret presence runs only on a manual main-branch dispatch in a non-fork repository.
It writes only `configured` or `not configured`. OIDC is explanation only: no token
request, token output, login, or cloud call. Package dispatch defaults to an archive
dry run; only explicit opt-in on main in a non-fork repository enables GHCR login
and publishing. The npm project is private and has no publish script or lifecycle
hooks. Local rehearsal never invokes Docker, authenticates, publishes, or contacts
GitHub/cloud APIs.

No remote, repository, secret, package, or cloud resource is created by setup.
Before any live setup, obtain the owner's approval for each operation. The user
performs sign-in and secret entry themselves. No initial Git history is assumed;
use the walkthrough's opt-in commands when ready. Generated build and test evidence
is ignored by Git. The Docker image is data-only, built `FROM scratch`, not runnable.

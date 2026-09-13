# GH-100 Best Practices Cheatsheet

Every practice the course recommends, collected in one place. Each line states what
to do and why it matters, so this stays useful long after the class ends.

⚠︎ marks something that changes over time: prices, quotas, limits, supported
providers, preview status, and UI paths. Look those up in current GitHub
documentation rather than trusting a figure you were taught.
[Verify before you rely on it](#verify-before-you-rely-on-it) lists the areas that
move most often, and [REFERENCES.md](REFERENCES.md) collects the official
documentation links to check them against.

---

## Six principles behind everything else

1. **Scope, owner, evidence, cost** — judge every control by those four questions.
2. **Least privilege everywhere** — people, teams, apps, tokens, workflows, runners, packages.
3. **Authenticate ≠ provision ≠ authorize** — SAML authenticates, SCIM provisions, roles and teams authorize.
4. **Prevention plus response** — guardrails reduce incidents; they never abolish them.
5. **Automation needs an owner** — trigger, privilege, output, failure alert, accountable human.
6. **Volatile facts get verified** — prices, quotas, previews, UI paths, runner specs, and GHES versions are looked up, never memorized.

---

## 1. Repository and collaboration

- **Run the full GitHub flow: branch → focused commits → pull request → review + checks → merge → delete branch.** Every step produces evidence you can later audit.
- **Treat the pull request as the evidence hub, not a merge button.** It carries intent, review decisions, automated checks, and traceability from idea to merge.
- **Never commit directly to the default branch; if you lack write access, fork, push, and open an upstream PR.** Direct commits bypass review and are rejected without write access.
- **Keep `main` deployable and validate the branch in staging or preview before merging.** Protects production stability.
- **Merge only when reviews are approved and checks are green, then delete the branch.** Stale branches confuse contributors; unreviewed merges leak defects.
- **Write small, coherent commits with short descriptive messages; stage deliberately.** Readable history is what makes investigations and reverts possible.
- **Branches isolate work — they are not a security boundary.** Protection comes from rulesets, required reviews, and checks.
- **Match the surface to the content: Issues for tracked work, Discussions for open conversation, wiki for long-form docs, gists for snippets.** Wrong surface means lost work and unsearchable decisions.
- **Search existing issues before filing a new one, and label, assign, and milestone what you triage.** Avoids duplicates and keeps routing explicit.
- **Give every discussion a category with a unique name and clear purpose description.** Uncategorized conversation becomes unfindable.
- **Do not treat secret gists as private — anyone with the URL can read them.** They are unlisted, not access-controlled.
- **Ship the community health set: README, CONTRIBUTING, CODE_OF_CONDUCT, GOVERNANCE, SUPPORT, plus issue and PR templates and `config.yml`.** Templates collect complete information and speed triage.
- **Add a CODEOWNERS file mapping paths to owning teams, and require code-owner approval on those paths.** Routes review to domain experts and blocks merge until they approve.
- **Standardize new repositories from template repositories.** Known-good structure beats copy-paste drift.
- **Define branch naming and mainline conventions; use fork-and-pull for external or cross-org contribution.** Consistency scales across repositories.
- **Automate release creation, tags, and release notes after a successful merge to main.** Standardizes packaging and the change record.
- **Curate notification subscriptions — watch, unwatch, or cherry-pick threads.** Notification overload destroys signal.
- **Name repositories clearly and choose the owning account deliberately; treat visibility as a governance decision, not a default.** ⚠︎ Visibility never substitutes for role-based permissions.

---

## 2. Permissions and governance

- **Default everyone to Read and elevate case by case, at org and enterprise scope.** Least privilege is the single most repeated instruction in the course.
- **Grant access to teams, not to individuals; nest teams to mirror real structure.** Per-user grants do not scale and rot silently.
- **Remember effective access is the highest grant a user receives from any source.** Overlapping org, team, and collaborator grants silently escalate privilege.
- **Use intermediate roles instead of Admin or Owner: Triage, Maintain, Security Manager, Billing Manager, custom roles.** Separation of duties without handing out destructive power.
- **Keep at least two organization owners, but no more than genuinely required.** Recoverability without over-exposure.
- **Delegate day-to-day membership to team maintainers.** They manage the team without touching org-wide settings.
- **Prefer a single organization; add organizations only when a business boundary justifies the duplication and cost.** Multi-org means duplicated setup, policy, and audit work.
- **Lead with rulesets: name them for intent, target explicit branch and tag patterns, start in evaluate mode, keep bypass lists narrow, and audit bypass use.** Rulesets are testable policy objects; undocumented bypass is the usual failure.
- **Rulesets coexist with branch protection — they do not replace it.** When troubleshooting, check both; the most restrictive effective combination applies, which often surprises people.
- **Protect important branches with required reviews, required status checks, restricted push, and blocked force-push and deletion.** Prevents unreviewed or history-destroying changes.
- **Make critical workflows (build, tests, CodeQL, dependency review) *required* status checks.** An optional check is not a control.
- **Set enterprise-level guardrails for anything organizations must not be able to override — and nothing more.** ⚠︎ Enterprise policy takes precedence once locked.
- **Scale control to risk: moderate controls for small or agile teams, strict controls for regulated work, flexible-but-protected for open source.** Over-rigid policy creates bottlenecks, and aggressive fork blocking kills contribution.
- **Layer protections additively and expect the strictest rule to win.** New policy should never weaken an existing guardrail.
- **Audit repository access on a schedule: Manage access lists, audit log, and API-driven anomaly checks.** Contractor and temporary access is the usual leak.
- **Require signed commits where change provenance matters.** Makes authorship verifiable, not merely claimed.
- **Govern third-party apps: approve at org level, prefer verified publishers, grant minimum scopes, monitor permission changes, keep a central inventory, revoke fast.** Integrations are a standing governance drift vector.
- **Enterprise teams and enterprise-owned GitHub Apps are ordinary capabilities, not blanket previews.** ⚠︎ Confirm current availability before planning around them.
- **Define group-to-role mappings and a sync schedule before enabling directory sync, and log every sync change.** Unmapped groups produce silent over-entitlement.

---

## 3. Products, deployment, and billing

- **Choose products by ownership, identity model, deployment responsibility, and governance need — not by quota tables.**
- **Keep account type and plan separate: account type defines the ownership boundary, the plan defines capability and commercial terms.**
- **Nobody signs in "as an organization" — every action stays attributable to a person or an integration.** Shared credentials destroy attribution.
- **Say "enterprise with personal accounts" rather than "standard user model"** when contrasting with EMU. The distinction is who owns the account, not which one is standard.
- **Treat GHEC vs GHES as a responsibility decision — who patches, controls the network, plans capacity, and responds to failure.**
- **Data residency is a separate GitHub Enterprise Cloud offering.** It is not a synonym for self-hosting on GHES.
- **Set spending limits on usage-based products and review usage insights and metered reports regularly.** ⚠︎ Prevents overage surprises and supports internal chargeback.
- **Run monthly or quarterly license reviews: reclaim inactive seats, automate counting through REST or GraphQL, and reconcile against official billing exports.**
- **Inventory machine accounts and peripheral services — they consume licenses and retain access quietly.** Restrict them to minimum permissions and prune inactive ones.
- **With metered or usage-based licensing, make ownership, usage signals, and a review routine explicit before you rely on it.** ⚠︎ Consumption rules and proration change.
- **Separate financial optimization from access governance.** A seat that stops being billed can still hold live access.
- **Pull the standard cost levers deliberately: Linux runners by default, caching, narrow triggers, self-hosting for high-volume builds, GHAS scoped to repositories that need it, Copilot seat reviews, package retention policies, LFS pruning.** ⚠︎
- **Evaluate Marketplace tools on free or trial plans, then move to paid tiers when production SLA and support actually matter.** ⚠︎
- **Use GitHub Mobile for notification triage — not repository creation, cloning, or checkout.** Set correct expectations for the mobile and desktop clients.

---

## 4. Repository security and incident response

- **Shift security left into design reviews, pull-request checks, and CI/CD — and keep running security education.** Early, automated feedback beats late audits.
- **Turn on the built-in stack: dependency graph, Dependabot alerts, Dependabot security updates, code scanning, secret scanning with push protection.** Push protection stops the secret before it becomes history.
- **Name who triages alerts and how urgency is decided before you enable scanners.** Alerts without owners become permanent noise; detection is not remediation.
- **Keep high-signal checks in the pull request and push slower analysis to later stages; measure remediation and false-positive handling, not alert counts.**
- **Use `.gitignore` to reduce accidental commits — never as a secret boundary.** Scope patterns precisely and keep per-directory ignore files in large repos.
- **Store credentials in environment variables, GitHub Secrets, or a secret manager — never in the repository.**
- **Publish a root-level `SECURITY.md` with supported versions, a private reporting channel, expected response timing, and disclosure guidance; link it prominently and keep it current.** Never route vulnerability reports into public issues.
- **Coordinate fixes in a private security advisory before public disclosure, and publish affected versions, severity, patch status, and CVE references.**
- **Treat any secret that reaches GitHub as compromised, and work the incident in order: revoke and rotate → assess scope in logs → decide whether history rewrite is justified → coordinate → verify → prevent recurrence.** Deleting the commit changes nothing about the credential.
- **Use `git filter-repo` for history rewriting.** It is current GitHub guidance; `git filter-branch` and BFG are no longer the recommended default.
- **After a rewrite: expire reflogs, garbage-collect, force-push, have every collaborator reclone, and ask Support to flush cached or indexed copies.** Stale clones and platform caches reintroduce the leak.
- **Rehearse rewrites in a disposable clone; never practice on a valuable repository.** History rewriting is a coordinated incident action, not routine cleanup.
- **Investigate with a scoped question — which asset, what time window, which actor, which action — and preserve evidence before changing anything.** Correlate GitHub events with IdP, CI/CD, and security logs.
- **Audit entries record actions, not intent.** Do not let a log line close an investigation on its own.
- **Restrict audit-log access to owners and security managers, stream to a SIEM, verify delivery, and export before retention expires.** ⚠︎
- **Set audit-log retention jointly with security and legal.** ⚠︎
- **Harden the whole chain, not just the code: authenticate access, apply RBAC, enforce 2FA for contributors, and keep historical logs that support investigation.**

---

## 5. Identity and access

- **Learn this split first: SAML authenticates, SCIM provisions and deprovisions, roles and teams authorize.** Never collapse the three.
- **Require 2FA for members, outside collaborators, and billing managers — and audit compliance before you enforce.** ⚠︎ Where sign-in is IdP-driven (EMU, or SSO-enforced access), the authentication factors are governed by the identity provider; GitHub's 2FA requirement applies to accounts that authenticate to GitHub directly. Check which model your enterprise is in before promising an enforcement result.
- **Rank the factors: security keys and FIDO2 strongest, TOTP recommended, SMS last resort — and register a fallback method.**
- **Before enforcing 2FA, communicate the date and re-credential bot and service accounts.** Enforcement removes non-compliant accounts, including automation.
- **Adopt passkeys and WebAuthn to cut phishing exposure.**
- **Protect SSH keys with strong passphrases via `ssh-agent`, keep deploy keys read-only, rotate keys, and remove unused ones.**
- **Basic password authentication is not a current path for Git operations or the API.** Use tokens, SSH keys, or app-based credentials.
- **Prefer GitHub Apps and short-lived, scoped installation tokens for automation over user-bound PATs.** PATs are a poor fit for shared systems and long-lived automation.
- **Fine-grained PATs are the safer default but still have feature gaps, including Packages.** ⚠︎ Verify support before committing to a fine-grained-only policy.
- **When you must use a PAT: descriptive name, expiry aligned to policy, minimum scopes, stored in a secret manager, never committed, rotated on schedule.**
- **In SAML-protected organizations that use personal accounts, authorize PATs and SSH keys for SSO before use, and revoke sessions or credentials immediately on suspected misuse or device loss.** This authorization step belongs to the personal-account model — EMU credentials are governed through the managed account and IdP instead.
- **Test the IdP connection and confirm every member is linked before enforcing SAML; plan certificate rollover and a break-glass path first.** ⚠︎ Enforcement removes unlinked users.
- **Pilot SSO at organization scope; go enterprise-wide when you need uniform compliance.**
- **Automate the lifecycle with SCIM and test joiner, mover, leaver, retry, and failure paths — and keep an auditable manual recovery process for IdP outages.**
- **Sync team membership from the authoritative directory, mapping only groups that reflect real access needs — and remember team sync is not provisioning.** A user is only added to a synced team if they are already an organization member.
- **Team sync does not universally require both SAML and SCIM.** ⚠︎ For enterprises with personal accounts, organization-scope team sync supports **Entra ID and Okta**, while enterprise-scope team sync supports **Entra ID only**. Okta's documented setup path uses SAML and SCIM; Entra uses its own team-sync integration and directory-read permissions. SAML SSO plus a linked SAML identity is the common prerequisite. Treat supported-provider lists, scopes, and prerequisites as volatile.
- **In EMU, team sync is not the mechanism — manage team membership through SCIM and IdP groups instead.**
- **Say Microsoft Entra ID or IdP group synchronization rather than "Active Directory".** The older term describes a different product.
- **Plan recovery for renamed, deleted, or unmapped IdP groups and test nested-group behavior.**
- **Choose EMU when you need IdP-provisioned accounts, no public repositories, full enterprise audit coverage, and centrally driven joiner and leaver handling.** Onboarding becomes assignment to the right IdP group.
- **Disabling a user in the IdP is not complete lifecycle removal.** ⚠︎ **Authentication denial** (blocking sign-in and invalidating sessions) and **SCIM deprovisioning** (which suspends or deactivates the managed account and its access) are separate lifecycle effects with separate failure modes. Test both paths, confirm the account state you actually get, and separately revoke or rotate non-user credentials the person could still hold — PATs, SSH keys, deploy keys, app installations, and secrets they knew.
- **Use EMU to separate corporate identity from personal or open-source identity, and to scope consultants to only the repositories they need.**
- **Correlate GitHub audit events with IdP sign-in records to spot anomalies and orphaned accounts.**
- **Review service accounts, outside collaborators, apps, and tokens on the same cycle as people, and enforce explicit offboarding and permission-review policies.**
- **Consider IP allow lists and controls on third-party OAuth app access for sensitive organizations.** ⚠︎ Availability differs by plan and enterprise type, and allow lists must account for hosted-runner, integration, and app traffic — test before enforcing.

---

## 6. Enterprise operations and support

- **Use "upkeep vs automation" as a prioritization lens: automate stable, well-understood processes only, and keep ownership plus evidence for outcomes.** Every automation needs a trigger, privilege, output, failure alert, and owner.
- **If you run GHES, treat upgrades, backups, disaster recovery, capacity, connectivity, monitoring, and audit logging as first-class admin duties.** ⚠︎
- **Triage before escalating: check platform status, blast radius, recent changes, and reproducibility.**
- **Keep the ownership boundary explicit.** Admins own org settings, permissions, policies, integrations, access changes, initial repository recovery, and history cleanup; Support owns account recovery, billing, takedowns, platform-side failures, and GHES appliance diagnosis. ⚠︎ Recovery windows change.
- **Choose between Actions and Apps by execution model: Actions for event-driven jobs that run on a runner; a GitHub App for an installable identity that receives webhooks, calls APIs across installations, and needs granular permissions.** Prefer Apps over long-lived user tokens for scalable integrations, and plan rate limits, webhook delivery, token lifetime, and service operations.
- **File tickets from an entitled account with impact, scope, UTC timestamps, reproduction steps, verbatim errors, sanitized evidence, and a correct priority.** ⚠︎ Priority names and response targets differ by plan — check the current taxonomy rather than relying on a remembered list.
- **Never put credentials or unnecessary personal data in support evidence; for secret incidents rotate first, then ask Support about cached data.**
- **Answer Support follow-ups promptly; if a ticket auto-closes, reply to it or reference the original ticket ID.**
- **A support bundle is a GHES appliance diagnostic artifact, not a GitHub Enterprise Cloud audit export.** Use audit log export or streaming for cloud governance evidence.
- **Generate the minimum appropriate bundle, record the incident time window, treat it as sensitive, and upload it through the case-specific one-time link; if you must use another channel, encrypt it and send the password separately.** ⚠︎
- **Be a good API citizen: authenticate requests, select only needed fields, paginate, cache, prefer webhooks, Apps, or Actions over polling, and monitor remaining quota.** ⚠︎
- **Review organization health insights (activity, engagement, vulnerabilities, licenses) on a cadence, and use compliance reports for auditor evidence.**
- **Build multi-org admin scripts as modular, reusable components; test in a controlled environment, log every change, and keep them in version control.**
- **Prefer the paved-path IdP integration; take the bring-your-own route only when customization justifies the maintenance.**
- **Watch team-sync usage limits (team size, org size, team count) and partition before you hit them.** ⚠︎ These limits apply to the team-synchronization feature; SCIM-based linking of teams to IdP groups is governed separately.

---

## 7. Actions, runners, and secrets

### Policy and supply chain
- **Configure the enterprise Actions use policy before broad rollout, then allow only GitHub-verified or explicitly allow-listed actions — or disable Actions where lockdown is required.** ⚠︎
- **An allow list narrows exposure but does not remove review of the allowed code, its references, and its permissions.** Test policy changes against representative workflows, and document exception ownership and expiry.
- **On GHES, disable automatic Marketplace sync and manually sync only vetted actions with `actions-sync`, automating that step into upgrades.** ⚠︎
- **Publish organization Actions standards centrally: approved storage repositories, naming conventions, shared-component locations, maintenance owners, contribution rules.**
- **Protect workflow files and action repositories with branch protection, required reviews, CODEOWNERS, and restricted write access; review who can change them.**
- **Pin third-party actions to a full-length commit SHA — GitHub's strongest supply-chain guidance — and enforce it with the repository or organization policy that requires SHA pinning where available.** ⚠︎ A tag or branch reference is mutable and can be repointed by whoever controls the action repository; verify the SHA comes from the action repo, not a fork. Pin to a tag only where you genuinely trust the publisher.
- **Semantic versioning helps, but semver tags are not immutable and versioning alone is not a security control.** For internally controlled reusable workflows and actions, reference a versioned release line plus change management — release notes, changelog, deprecation notices, migration guides, advance notice of breaking changes. That is governance discipline, not cryptographic immutability.
- **Standardize with reusable workflows, reusable actions, and org workflow templates in the public `.github` repository (use `$default-branch` and clear metadata).** ⚠︎ Nesting limits apply.
- **Automatically test reusable components before merge and run Dependabot against them.**

### Permissions and secrets
- **Default workflow and `GITHUB_TOKEN` permissions to read-only; elevate per job only where required.** ⚠︎
- **Require manual approval for workflow runs from forks, and treat `pull_request_target` and `workflow_run` as privileged triggers.** Untrusted code must not reach runners unreviewed, and privileged triggers must never check out untrusted pull-request content.
- **Scope every secret to the smallest audience and shortest lifetime: repository secrets for repo credentials, org secrets restricted to selected repositories, environment secrets for production.** Organization, repository, and environment are the working scopes.
- **Reference secrets as `secrets.NAME` inside the command that needs them rather than exporting long-lived environment variables, and never echo them to logs or pull requests.** ⚠︎ Redaction is **not guaranteed**: it only masks exact values a runner used, so avoid structured blobs (JSON, XML, YAML) as single secrets, register derived values as secrets, and if an unredacted value reaches a log, delete the log **and** rotate the credential.
- **Remember anyone with write access to a repository can use its secrets in a workflow.** Secret scope is therefore an access-control decision, not just a configuration choice.
- **Rotate secrets on a schedule, review secret changes like code, and delete anything unused.**
- **Prefer OIDC short-lived cloud credentials, or runtime retrieval from an existing enterprise vault, over long-lived stored secrets.** Keeps GitHub free of permanent credentials and preserves one source of truth.
- **Gate sensitive deployments with environments, required reviewers, and manual approval steps.**
- **Enable and review Actions audit logs — who ran what, which actions executed, which permissions were used.** ⚠︎

### Runners
- **Treat runner choice as a trust-boundary and operations decision, not a cost comparison: hosted runners for general automation; self-hosted for specialized hardware, private-network access, IP allow-listing, or compliance — accepting patching, isolation, cleanup, monitoring, and incident response.** ⚠︎
- **Do not assume every GitHub-hosted job gets a fresh, dedicated VM.** Single-CPU hosted runners can run as containers on a shared VM.
- **Assume untrusted workflow code can reach whatever the runner can reach.** That single sentence justifies every runner control that follows.
- **Never expose self-hosted runners to public repositories without strong isolation; restrict them to private repositories and trusted workflows.** Public PRs otherwise mean code execution, secret theft, mining, denial of service, and lateral movement.
- **Prefer ephemeral self-hosted runners that reset after each job, run them in containers or VMs, and enforce firewall, VPN, or private-subnet placement.**
- **Use runner groups to fence runners by repository, team, or workload, add branch, environment, and workflow restrictions for sensitive groups, and audit group membership.** Never grant blanket runner access.
- **Keep self-hosted runners patched, monitored, and logged; schedule automated updates in low-traffic windows and stop the service before updating.** ⚠︎
- **Label runners meaningfully (OS, `high-memory`, `gpu`) and target labels in workflows; set proxy variables — including `no_proxy` — before the runner starts.** Proxy settings are not applied dynamically.
- **Pull GitHub's current Actions IP ranges from the `/meta` API and automate allow-list refreshes; manage IP allow-listing at org or enterprise scope, not per repository.** ⚠︎
- **Monitor runner state (idle, active, offline) with dashboards and alerts; on failure check `_diag` logs first, then workflow logs, restart, validate connectivity, renew registration tokens, fix labels, or scale out.**
- **Store credentials in GitHub Secrets rather than on runner environment variables.** Compromised runners leak whatever sits on the box.

---

## 8. Packages and GHCR

- **Publish from a workflow that runs only after build and tests succeed, triggered by release creation, stored in `.github/workflows` with a self-describing name.** Ties artifacts to intentional, validated versions.
- **Use reproducible installs (`npm ci` or lockfile equivalents) in build and publish jobs.**
- **Treat publication as a security boundary: authenticate narrowly, grant package permissions explicitly, and make every artifact traceable to a reviewed source revision.**
- **Prefer `GITHUB_TOKEN` in Actions where the registry supports it, and protect the release trigger and workflow file.** Fewer standing credentials, fewer leak paths.
- **Never expose tokens on the command line — use `--password-stdin` or a supported login action.**
- **For local or package-manager authentication use a scoped PAT (`read:packages`, `write:packages`, and `delete:packages` only if needed) with an expiry, kept in a secret manager and out of project config files.**
- **Check fine-grained PAT support before standardizing on it for Packages.** ⚠︎ Known feature gaps remain.
- **Set fine-grained permissions, ownership, visibility, and repository linkage explicitly on every package and image.** Source repository access and package access are not always identical.
- **Specify `:latest` explicitly when you mean it, pin deployments by image digest when you need a fixed artifact, and scan and sign images per supply-chain policy.**
- **Container tags are mutable labels, not fixed artifacts.** ⚠︎ Immutability comes from the digest, or from a registry immutability setting you have verified.
- **Automate package lifecycle with APIs, webhooks, and Actions: prune old versions, apply retention policies, and set org-wide visibility and publishing defaults restricted to vetted teams.** ⚠︎
- **Test consumption separately — a successful push does not prove the package is installable.**
- **Distribute enterprise actions by risk: internal actions in org-owned repositories, public publication only after hardening, containerized actions in Packages with authentication and regular image updates.**
- **Do not use a package registry for code shared inside a single application — use the language's module system.**
- **Public packages are free; private storage, data transfer, and container billing rules need live verification.** ⚠︎

---

## Commonly confused — get these right

Twenty things people routinely get backwards. The left column is the common
assumption; the right column is the practice to follow.

| # | Often assumed | Actually |
|---|---|---|
| 1 | "Standard user model" vs EMU | **Enterprise with personal accounts** vs EMU |
| 2 | Rulesets replace branch protection | Rulesets **coexist** with it; check both; most restrictive wins |
| 3 | SAML also creates and removes users | SAML authenticates, **SCIM provisions**, roles and teams authorize |
| 4 | `git filter-branch` or BFG is the cleanup path | **`git filter-repo`**; rotate credentials first |
| 5 | A support bundle is general audit evidence | It is a GHES **appliance diagnostic**; use audit export or streaming for cloud |
| 6 | Actions and GitHub Apps are interchangeable | Actions = event-driven jobs on runners; Apps = installable identity plus API integration |
| 7 | Every hosted job gets a fresh, clean VM | Single-CPU hosted runners can be **containers on a shared VM** |
| 8 | Enterprise-level Actions secrets are a general scope | Org, repository, and environment are the working scopes |
| 9 | Fine-grained PATs are a strict upgrade | Safer, but **gaps remain — including Packages** |
| 10 | Enterprise Teams and Enterprise Apps are preview-only | Ordinary capabilities now — verify current availability ⚠︎ |
| 11 | Data residency means self-hosting on GHES | It is a separate **GitHub Enterprise Cloud** offering |
| 12 | Username and password still work for Git | Basic auth is not a current Git authentication path |
| 13 | Support priority names and SLAs are fixed | Verify the current taxonomy and response targets for your plan ⚠︎ |
| 14 | Team synchronization uses "Active Directory" | Entra ID or IdP group synchronization |
| 15 | Team sync always requires SAML **and** SCIM | Team sync is **not provisioning**; org scope supports Entra ID and Okta, enterprise scope Entra ID only; Okta's documented path uses SAML plus SCIM, Entra uses its own team-sync integration ⚠︎ |
| 16 | Team sync is the EMU mechanism | In EMU, manage team membership through **SCIM and IdP groups** |
| 17 | Disabling the user in the IdP completes offboarding | Authentication denial and **SCIM deprovisioning are separate effects**; test both and revoke or rotate non-user credentials |
| 18 | A semantic version tag is a secure, immutable pin | Pin third-party actions to a **full-length commit SHA**; versioned releases for internal components are change management, not immutability |
| 19 | Container tags are immutable | Tags are **mutable**; pin by **digest** where a fixed artifact matters |
| 20 | Package quota and billing figures are stable | Public packages are free; private storage, transfer, and container billing need live verification ⚠︎ |

---

## Verify before you rely on it

These values move. Look them up in current GitHub documentation instead of quoting a
number from memory or from any course material, including this sheet.

| Area | What to re-check |
|---|---|
| **Prices and quotas** | Actions minutes and multipliers, storage, LFS, Packages transfer, plan inclusions |
| **Licensing and billing rules** | Metered and usage-based licence counting, proration, billing dates, GHAS and Copilot seat rules |
| **Plans and features** | Plan names, per-plan feature availability, security feature licensing by repository visibility |
| **Support** | Plan names, SLA response times, priority labels, ticket entitlement |
| **Audit log** | Retention periods, API and GraphQL coverage, Git event support, streaming targets |
| **GHES** | Supported versions, upgrade paths, bundle commands and contents, bundled action catalog |
| **Runners** | Images, labels (`ubuntu-latest` and similar), hardware specs, included minutes, hosted-runner isolation |
| **Networking** | GitHub Actions IP ranges — always from `/meta`, never a static copy |
| **Workflow limits** | Reusable-workflow nesting (currently ten total levels), matrix and concurrency limits |
| **Tokens** | PAT scope names, fine-grained PAT capability gaps, SCIM token scopes, `GITHUB_TOKEN` registry permissions |
| **Identity limits** | Team sync: supported providers per scope (org vs enterprise), per-IdP prerequisites, team and org size limits, Entra permission names; SCIM-linked teams are governed separately |
| **Actions security controls** | Availability of the require-SHA-pinning policy at repo and org scope, immutable-release and immutable-action features, allowed-actions policy options |
| **Preview status** | Enterprise Teams, Enterprise Apps, anything labelled "Preview" |
| **Recovery windows** | Deleted branch and repository restoration timeframes |
| **UI paths** | Every Settings → … navigation string — menus are reorganized often |

---

## Working safely in the labs

- **Do not modify grader or validation workflows** \u2014 changing them invalidates the exercise and teaches the wrong habit.
- **Practice anything destructive in a disposable clone**, especially history rewriting.
- **Never use a real credential in an exercise.** Use a throwaway token with the narrowest scope and delete it afterwards.
- **Treat lab repositories as public by default** in how you behave, even when they are private.

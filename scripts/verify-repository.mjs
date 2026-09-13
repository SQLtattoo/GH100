import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { repositoryFiles } from './files.mjs';
import { formatSummary, summarizeCourse } from '../src/course-status.mjs';

const required = ['package.json', 'package-lock.json', '.gitignore', 'LICENSE', 'README.md',
  'SECURITY.md', 'CONTRIBUTING.md', 'CODEOWNERS', 'Dockerfile', '.dockerignore',
  '.github/dependabot.yml', '.github/workflows/ci.yml', '.github/workflows/reusable-ci.yml',
  '.github/workflows/package.yml', '.github/workflows/oidc-explainer.yml',
  '.github/actions/course-summary/action.yml', 'docs/architecture.md', 'docs/demo-walkthrough.md',
  'docs/enterprise-bridge.md', 'docs/failure-fallback.md', 'scripts/demo-reset.ps1', 'scripts/demo-verify.ps1'];
for (const path of required) assert(existsSync(path), `Missing required file: ${path}`);
const patterns = [
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  /(?:AccountKey|SharedAccessSignature|client_secret|password)\s*[=:]\s*["']?[A-Za-z0-9+/=_-]{12,}/i,
];
const files = [...await repositoryFiles(), 'dist/course-status.json', 'dist/summary.txt'];
for (const path of files) {
  const text = await readFile(path, 'utf8');
  for (const pattern of patterns) assert(!pattern.test(text), `Credential-like pattern in ${path}; value suppressed.`);
  if (path.endsWith('.md')) {
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      assert(existsSync(resolve(dirname(path), decodeURIComponent(target))), `${path}: broken link ${target}`);
    }
  }
}
const fixture = JSON.parse(await readFile('fixtures/course.json', 'utf8'));
const summary = summarizeCourse(fixture);
assert.equal(await readFile('dist/course-status.json', 'utf8'), `${JSON.stringify(summary, null, 2)}\n`);
assert.equal(await readFile('dist/summary.txt', 'utf8'), `${formatSummary(summary)}\n`);
assert.equal(JSON.parse(await readFile('package.json', 'utf8')).private, true);
console.log('Required files, local documentation links, exact build output, and private npm guard passed.');
console.log('Local credential-pattern scan passed (source and build; excludes editor settings, Git, dependencies, and archives).');
console.log('Pattern matching is not proof of absence of every possible secret; no content was sent to a remote scanner.');

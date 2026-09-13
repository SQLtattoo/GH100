import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const documents = JSON.parse(readFileSync(0, 'utf8'));
const workflow = (name) => documents[`.github/workflows/${name}.yml`];
const keys = (value) => Object.keys(value).sort();
const readOnly = { contents: 'read' };
const pinnedAction = /^[\w-]+\/[\w-]+@[a-f0-9]{40}$/;
for (const [path, document] of Object.entries(documents)) {
  if (!path.startsWith('.github/workflows/')) continue;
  assert.equal(typeof document.permissions, 'object', `${path}: explicit permissions`);
  for (const job of Object.values(document.jobs)) {
    assert.equal(typeof job.permissions, 'object', `${path}: explicit job permissions`);
    if (job['runs-on']) assert.equal(job['runs-on'], 'ubuntu-latest');
    for (const step of job.steps || []) {
      if (step.uses && !step.uses.startsWith('./')) {
        assert.match(step.uses, pinnedAction, `${path}: immutable action pin`);
        const source = readFileSync(path, 'utf8');
        assert(source.split('\n').some((line) => line.includes(step.uses) && /# v\d/.test(line)),
          `${path}: action pin needs release comment`);
      }
      if (step.uses?.startsWith('actions/checkout@')) {
        assert.equal(step.with['persist-credentials'], 'false');
      }
    }
  }
}
const ci = workflow('ci');
assert.deepEqual(keys(ci.on), ['pull_request', 'push', 'workflow_dispatch']);
assert.deepEqual(ci.on.push.branches, ['main']);
assert.equal(ci.concurrency['cancel-in-progress'], 'true');
assert(ci.concurrency.group.includes('github.event.pull_request.number || github.ref'));
assert.deepEqual(ci.permissions, readOnly);
assert.equal(ci.jobs.ci.uses, './.github/workflows/reusable-ci.yml');
assert.deepEqual(ci.jobs.ci.permissions, readOnly);
assert.equal(ci.jobs.summary.needs, 'ci');
assert(ci.jobs.summary.steps.some((step) => step.uses === './.github/actions/course-summary' &&
  step.with['test-count'] === '${{ needs.ci.outputs.test-count }}'));
const secretJob = ci.jobs['secret-demo'];
for (const guard of ["github.event_name == 'workflow_dispatch'", "github.ref == 'refs/heads/main'",
  'github.event.repository.fork == false']) assert(secretJob.if.includes(guard));
assert.equal(secretJob.steps.at(-1).env.COURSE_DEMO_FLAG, '${{ secrets.COURSE_DEMO_FLAG }}');
assert.equal(secretJob.steps.at(-1).run, 'node scripts/secret-presence.mjs');

const reusable = workflow('reusable-ci');
assert.deepEqual(keys(reusable.on), ['workflow_call']);
assert.deepEqual(reusable.permissions, readOnly);
assert.deepEqual(reusable.jobs.build.permissions, readOnly);
assert.equal(reusable.on.workflow_call.inputs['artifact-name'].type, 'string');
assert.equal(reusable.on.workflow_call.outputs['test-count'].value, '${{ jobs.build.outputs.test-count }}');
assert(reusable.jobs.build.steps.some((step) => step.with?.cache === 'npm'));
assert(reusable.jobs.build.steps.some((step) => step.run?.startsWith('npm ci ')));
assert(reusable.jobs.build.steps.some((step) => step.id === 'tests' && step.run === 'node scripts/run-ci-tests.mjs'));
assert(reusable.jobs.build.steps.some((step) => step.run === 'npm run build'));
assert(reusable.jobs.build.steps.some((step) => step.uses?.startsWith('actions/upload-artifact@') &&
  step.with.name === '${{ inputs.artifact-name }}'));

const packageWorkflow = workflow('package');
assert.deepEqual(keys(packageWorkflow.on), ['workflow_dispatch']);
assert.equal(packageWorkflow.on.workflow_dispatch.inputs.publish.type, 'boolean');
assert.equal(packageWorkflow.on.workflow_dispatch.inputs.publish.default, 'false');
assert.deepEqual(packageWorkflow.permissions, readOnly);
assert.deepEqual(packageWorkflow.jobs.archive.permissions, readOnly);
const publishJob = packageWorkflow.jobs.publish;
assert.equal(publishJob.needs, 'archive');
assert.deepEqual(publishJob.permissions, { contents: 'read', packages: 'write' });
for (const guard of ["github.event_name == 'workflow_dispatch'", 'inputs.publish == true',
  "github.ref == 'refs/heads/main'", 'github.event.repository.fork == false']) assert(publishJob.if.includes(guard));
for (const [path, document] of Object.entries(documents)) {
  for (const [name, job] of Object.entries(document.jobs || {})) {
    for (const step of job.steps || []) {
      if (/docker (login|push)|npm publish/.test(step.run || '')) {
        assert.equal(path, '.github/workflows/package.yml');
        assert.equal(name, 'publish');
        assert.equal(step.if, 'inputs.publish == true');
      }
    }
  }
}
assert(publishJob.steps.some((step) => Object.values(step.env || {}).includes('${{ secrets.GITHUB_TOKEN }}')));

const oidc = workflow('oidc-explainer');
assert.deepEqual(keys(oidc.on), ['workflow_dispatch']);
assert.deepEqual(oidc.permissions, { contents: 'read', 'id-token': 'write' });
assert.deepEqual(oidc.jobs.explain.permissions, oidc.permissions);
assert.equal(oidc.jobs.explain.steps.length, 1);
const oidcScript = oidc.jobs.explain.steps[0].run;
assert(oidcScript.startsWith("cat <<'SUMMARY' >> \"$GITHUB_STEP_SUMMARY\"\n"));
assert(oidcScript.trimEnd().endsWith('\nSUMMARY'));
assert(!/ACTIONS_ID_TOKEN|azure\/login|curl|wget|\$\{\{/.test(oidcScript));
assert.equal(documents['.github/actions/course-summary/action.yml'].runs.using, 'composite');
assert.equal(keys(documents).length, 6);
console.log('Six YAML files parsed; trigger, permission, pin, output, secret, OIDC, and publish guards passed.');

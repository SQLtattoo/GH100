import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

for (const configured of [false, true]) {
  test(`secret presence reports only the state: ${configured}`, () => {
    const directory = mkdtempSync(join(tmpdir(), 'gh100-test-'));
    try {
      const destination = join(directory, 'summary.md');
      const env = { ...process.env, GITHUB_STEP_SUMMARY: destination };
      delete env.COURSE_DEMO_FLAG;
      if (configured) env.COURSE_DEMO_FLAG = 'enabled';
      const result = spawnSync(process.execPath, ['scripts/secret-presence.mjs'], { env, encoding: 'utf8' });
      assert.equal(result.status, 0);
      assert.equal(result.stdout, '');
      assert.equal(result.stderr, '');
      assert.equal(readFileSync(destination, 'utf8'), configured ? 'configured\n' : 'not configured\n');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}

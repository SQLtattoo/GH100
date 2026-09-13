import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { repositoryFiles } from './files.mjs';

const failures = [];
for (const path of await repositoryFiles()) {
  const text = await readFile(path, 'utf8');
  if (!text.endsWith('\n')) failures.push(`${path}: missing final newline`);
  if (/\t|[ \t]+\r?$/m.test(text)) failures.push(`${path}: tab or trailing whitespace`);
  if (path.endsWith('.json')) {
    try { JSON.parse(text); } catch { failures.push(`${path}: invalid JSON`); }
  }
  if (path.endsWith('.mjs')) {
    const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    if (result.status !== 0) failures.push(`${path}: ${result.stderr || result.error}`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Syntax and whitespace checks passed. No style dependency required.');
}

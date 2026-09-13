import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';

const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap'], { encoding: 'utf8' });
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.status !== 0) process.exit(result.status || 1);
const count = result.stdout.match(/^# tests (\d+)\s*$/m)?.[1];
if (!count || Number(count) === 0) throw new Error('No executed tests reported.');
mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/test-results.tap', result.stdout);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `test-count=${count}\n`);

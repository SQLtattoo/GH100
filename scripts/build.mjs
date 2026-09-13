import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { formatSummary, summarizeCourse } from '../src/course-status.mjs';

const course = JSON.parse(await readFile(new URL('../fixtures/course.json', import.meta.url), 'utf8'));
const summary = summarizeCourse(course);
const destination = new URL('../dist/', import.meta.url);
await mkdir(destination, { recursive: true });
await writeFile(new URL('course-status.json', destination), `${JSON.stringify(summary, null, 2)}\n`);
await writeFile(new URL('summary.txt', destination), `${formatSummary(summary)}\n`);
console.log(formatSummary(summary));

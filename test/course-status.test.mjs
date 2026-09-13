import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { formatSummary, summarizeCourse } from '../src/course-status.mjs';

const fixture = JSON.parse(readFileSync(new URL('../fixtures/course.json', import.meta.url), 'utf8'));

test('summarizes the course fixture', () => {
  assert.deepEqual(summarizeCourse(fixture), {
    title: 'GH-100 GitHub Administration', total: 4, completed: 2, remaining: 2, percent: 50,
  });
});

test('formats the instructor sentence', () => {
  assert.equal(formatSummary(summarizeCourse(fixture)),
    'GH-100 GitHub Administration: 2/4 modules complete (50%).');
});

test('does not mutate input', () => {
  const original = structuredClone(fixture);
  summarizeCourse(fixture);
  assert.deepEqual(fixture, original);
});

test('handles an empty course without division by zero', () => {
  assert.deepEqual(summarizeCourse({ title: 'Empty', modules: [] }), {
    title: 'Empty', total: 0, completed: 0, remaining: 0, percent: 0,
  });
});

test('rounds a partial completion percentage', () => {
  assert.equal(summarizeCourse({ title: 'Partial', modules: [
    { name: 'One', complete: true }, { name: 'Two', complete: false },
    { name: 'Three', complete: false },
  ] }).percent, 33);
});

test('handles full completion', () => {
  const summary = summarizeCourse({ title: 'Done', modules: [{ name: 'One', complete: true }] });
  assert.equal(summary.percent, 100);
  assert.equal(summary.remaining, 0);
});

test('rejects invalid titles', () => {
  for (const course of [null, {}, { title: '' }, { title: ' ' }, { title: 22 }]) {
    assert.throws(() => summarizeCourse(course), TypeError);
  }
});

test('rejects invalid modules instead of coercing values', () => {
  for (const modules of [null, {}, [null], [{ name: 'One', complete: 'false' }],
    [{ name: '', complete: true }], [{ name: 'One' }]]) {
    assert.throws(() => summarizeCourse({ title: 'Invalid', modules }), TypeError);
  }
});

import { appendFileSync } from 'node:fs';

if (!process.env.GITHUB_STEP_SUMMARY) throw new Error('A job summary file is required.');
appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  process.env.COURSE_DEMO_FLAG ? 'configured\n' : 'not configured\n');

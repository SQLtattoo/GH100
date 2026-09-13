import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function repositoryFiles(directory = '.') {
  const ignored = new Set(['.git', '.vscode', 'node_modules', 'dist', 'artifacts', 'coverage']);
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await repositoryFiles(path));
    else if (entry.isFile()) result.push(path.replaceAll('\\', '/'));
  }
  return result.sort();
}

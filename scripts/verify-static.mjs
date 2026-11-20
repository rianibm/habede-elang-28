import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
const references = new Set(['index.html', 'styles.css', 'app.js']);
const html = await readFile(resolve(output, 'index.html'), 'utf8');
const app = await readFile(resolve(output, 'app.js'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (!/^(?:[a-z]+:|\/\/|#)/i.test(match[1])) references.add(match[1]);
}
for (const match of app.matchAll(/(?:src|poster):\s*'([^']+)'/g)) references.add(match[1]);

for (const reference of references) {
  const path = resolve(output, reference);
  if (relative(output, path).split(sep).includes('..')) throw new Error(`Asset outside dist: ${reference}`);
  const info = await stat(path);
  if (!info.isFile() || !info.size) throw new Error(`Missing or empty asset: ${reference}`);
  const bytes = await readFile(path);
  if (bytes.subarray(0, 80).toString().startsWith('version https://git-lfs.github.com/spec/')) {
    throw new Error(`Git LFS pointer instead of media: ${reference}`);
  }
}

async function totalSize(directory) {
  let bytes = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    bytes += entry.isDirectory() ? await totalSize(path) : (await stat(path)).size;
  }
  return bytes;
}
console.log(`Static site ready: ${references.size} assets verified, ${((await totalSize(output)) / 1024 / 1024).toFixed(2)} MB in dist/.`);

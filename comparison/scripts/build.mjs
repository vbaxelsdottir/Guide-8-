import { mkdir, copyFile, readFile } from 'node:fs/promises';
const files = ['index.html', 'styles.css', 'app.js', 'data.json', 'favicon.svg'];
const data = JSON.parse(await readFile('data.json', 'utf8'));
if (data.concepts.length !== 11 || data.metrics.length !== 3) throw new Error('Missing comparison data');
await mkdir('dist', { recursive: true });
for (const file of files) await copyFile(file, `dist/${file}`);
console.log('Built five static files in dist/. No runtime dependencies.');

/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(__dirname, '..');

const TARGET_DIRS = [path.join(projectRoot, 'apps')];
const MATCH_EXTS = new Set(['.js', '.js.map', '.d.ts']);

function isArtifact(file: string) {
  return MATCH_EXTS.has(path.extname(file));
}

function walkAndClean(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) {
        continue;
      }
      if (e.name === 'src') {
        cleanSrc(full);
      } else {
        walkAndClean(full);
      }
    }
  }
}

function cleanSrc(srcDir: string) {
  const stack: string[] = [srcDir];
  let removed = 0;
  while (stack.length) {
    const cur = stack.pop()!;
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (isArtifact(e.name)) {
        try {
          fs.unlinkSync(full);
          removed++;
          console.log(`Removed: ${path.relative(projectRoot, full)}`);
        } catch (err) {
          console.warn(`Failed to remove ${full}:`, err);
        }
      }
    }
  }
  if (removed > 0) {
    console.info(`Cleaned ${removed} files under ${path.relative(projectRoot, srcDir)}`);
  }
}

for (const base of TARGET_DIRS) {
  if (fs.existsSync(base)) {
    walkAndClean(base);
  }
}

console.info('Done cleaning src build artifacts.');


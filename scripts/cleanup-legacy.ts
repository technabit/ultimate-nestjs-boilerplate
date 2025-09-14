/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

const roots = ['src/apps', 'src/core', 'src/generated'];

function rmDirIfExists(p: string) {
  if (!fs.existsSync(p)) return;
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`Removed ${p}`);
  } else {
    fs.unlinkSync(p);
    console.log(`Removed file ${p}`);
  }
}

for (const r of roots) {
  const p = path.join(process.cwd(), r);
  if (fs.existsSync(p)) {
    // Double-check nothing unexpected remains
    try {
      const files = fs.readdirSync(p);
      if (files.length === 0) {
        rmDirIfExists(p);
      } else {
        // In case there are leftovers, attempt removal anyway (we moved code)
        rmDirIfExists(p);
      }
    } catch {
      rmDirIfExists(p);
    }
  }
}


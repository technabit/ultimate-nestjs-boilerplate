/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

const SRC = path.resolve(__dirname, '../src/core/i18n/translations');
const DEST = path.resolve(__dirname, '../dist/core/i18n/translations');

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

try {
  copyDir(SRC, DEST);
  console.log(`i18n: copied translations to ${DEST}`);
} catch (e) {
  console.warn('i18n: copy failed', e);
}


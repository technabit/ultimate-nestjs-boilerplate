/* eslint-disable no-console */
/**
 * This is a build script that converts React Email templates into static html (handlebars) files.
 */
import { render } from '@react-email/render';
import chokidar from 'chokidar';
import fs from 'fs';
import { Stats } from 'node:fs';
import path from 'path';
import React from 'react';

const packageRootDir = path.join(__dirname, '..');
// Email templates live inside this package
const templatesDir = path.join(
  packageRootDir,
  'src',
  'shared',
  'mail',
  'templates',
);
const outDir = templatesDir.replace('/src/', '/dist/');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let isWatchMode = false;

if (process.argv.length > 1) {
  // Watch Mode: -w | --watch
  const watchParamIndex = process.argv.findIndex(
    (a) => a === '-w' || a === '--watch',
  );
  if (watchParamIndex !== -1) {
    isWatchMode = true;
  }
}

const templates = fs
  .readdirSync(templatesDir)
  .filter((file) => file.endsWith('.tsx'));

console.log(
  '\x1b[32m%s\x1b[0m',
  `📨 Creating static html files for email templates.`,
);
build(templates).then(() => {
  if (isWatchMode) {
    console.log(
      '\x1b[32m%s\x1b[0m',
      `\nWatching for email template changes...`,
    );
  }
});

if (isWatchMode) {
  chokidar
    .watch(templatesDir, {
      ignoreInitial: true,
      ignored: (watchPath: string, stats: Stats) =>
        stats?.isFile() && !watchPath.endsWith('.tsx'),
    })
    .on('change', (filePath) => {
      if (filePath.endsWith('.tsx')) {
        const file = path.basename(filePath);
        console.log(`\nFile changed: ${file}`);
        build([file]);
      }
    })
    .on('add', (filePath) => {
      if (filePath.endsWith('.tsx')) {
        const file = path.basename(filePath);
        console.log(`\nNew file added: ${file}`);
        build([file]);
      }
    })
    .on('unlink', (filePath) => {
      if (filePath.endsWith('.tsx')) {
        const file = path.basename(filePath);
        const outputFileName = `${file.slice(0, -'.tsx'.length)}.hbs`;
        const fileOutputPath = path.join(outDir, outputFileName);
        console.log(`\nFile deleted: ${file}`);
        if (fs.existsSync(fileOutputPath)) {
          fs.unlinkSync(fileOutputPath);
          console.log(`Deleted compiled file: ${outputFileName}`);
        }
      }
    });
}

async function build(files: string[]) {
  await Promise.all(
    files.map(async (file) => {
      const fileInputPath = path.join(templatesDir, file);
      const outputFileName = `${file.slice(0, -'.tsx'.length)}.hbs`;
      const fileOutputPath = path.join(outDir, outputFileName);

      try {
        delete require.cache[require.resolve(fileInputPath)];
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require(fileInputPath);
        const Component = mod.default;

        if (typeof Component === 'function') {
          const html = await render(React.createElement(Component));
          const stream = fs.createWriteStream(fileOutputPath);
          stream.write(html);
          stream.end();
          console.info(
            `✅ ${file} -> ${outDir.replace(packageRootDir, '.')}\/${outputFileName}`,
          );
        }
      } catch (err) {
        console.error(`Failed to load ${file}:`, err);
      }
    }),
  );
}



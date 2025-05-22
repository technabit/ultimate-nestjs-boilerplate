/**
 * This is a build script that converts React Email templates into a static html(handlebars) files.
 */
import { render } from '@react-email/render';
import fs from 'fs';
import path from 'path';
import React from 'react';

const templatesDir = path.join(__dirname, 'templates');
const outputDirFromRoot = path
  .relative(process.cwd(), templatesDir)
  .replace('src', 'dist');
const outDir = path.join(__dirname, '..', '..', '..', outputDirFromRoot);

const templates = fs
  .readdirSync(templatesDir)
  .filter((file) => file.endsWith('.tsx'));

(async () => {
  // eslint-disable-next-line no-console
  console.log(
    '\x1b[32m%s\x1b[0m',
    '📨 Creating static html files for all mails.',
  );
  await Promise.all(
    templates.map(async (file) => {
      const fileInputPath = path.join(templatesDir, file);

      const outputFileName = `${file.slice(0, -'.tsx'.length)}.hbs`;
      const fileOutputPath = path.join(outDir, outputFileName);

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require(fileInputPath);
        const Component = mod.default;

        if (typeof Component === 'function') {
          const html = await render(<Component />);
          const stream = fs.createWriteStream(fileOutputPath);
          stream.write(html);
          stream.end();
          // eslint-disable-next-line no-console
          console.info(
            `✅ ${file} -> ${path.join(outputDirFromRoot, outputFileName)}`,
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load ${file}:`, err);
      }
    }),
  );
})();

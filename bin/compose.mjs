#!/usr/bin/env node
// Portable compose runner: works with Docker or Podman (compatibility mode)
// - Loads .env and .env.docker and passes them to the compose process
// - Chooses between `docker compose`, `podman compose`, or `podman-compose`

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const root = path.resolve(path.join(import.meta.dirname, '..'));

const usage = () => {
  console.error(
    'Usage: node ./bin/compose.mjs <dev|prod> <up|down|logs> [extra compose args]\n' +
      'Examples:\n' +
      '  node ./bin/compose.mjs dev up\n' +
      '  node ./bin/compose.mjs prod up --build --force-recreate\n' +
      '  node ./bin/compose.mjs dev down\n' +
      '  node ./bin/compose.mjs dev logs -f server',
  );
};

const profile = process.argv[2];
const action = process.argv[3];
let passThroughArgs = process.argv.slice(4);
const printOnlyIndex = passThroughArgs.indexOf('--print-only');
const printOnly = printOnlyIndex !== -1;
if (printOnly) {
  passThroughArgs = passThroughArgs.filter((a) => a !== '--print-only');
}

if (
  !profile ||
  !action ||
  !['dev', 'prod'].includes(profile) ||
  !['up', 'down', 'logs'].includes(action)
) {
  usage();
  process.exit(1);
}

// Load env files (.env and .env.docker) into current process in correct order
const envFiles = ['.env', '.env.docker'];
for (const f of envFiles) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: true });
  }
}

function cmdExists(cmd, args = ['--version']) {
  try {
    const res = spawnSync(cmd, args, { stdio: 'ignore' });
    return res.status === 0;
  } catch {
    return false;
  }
}

function getRunner() {
  // Allow override via env
  const override = process.env.COMPOSE_RUNNER;
  if (override) {
    if (override === 'docker') return { bin: 'docker', sub: 'compose', supportsEnvFile: true };
    if (override === 'podman') return { bin: 'podman', sub: 'compose', supportsEnvFile: false };
    if (override === 'podman-compose') return { bin: 'podman-compose', sub: null, supportsEnvFile: false };
  }
  // Prefer Docker Compose v2 if available
  if (cmdExists('docker', ['compose', 'version'])) {
    return { bin: 'docker', sub: 'compose', supportsEnvFile: true };
  }
  // Podman with built-in compose (v4+) or plugin
  if (cmdExists('podman', ['compose', '--help'])) {
    return { bin: 'podman', sub: 'compose', supportsEnvFile: false };
  }
  // Python podman-compose script
  if (cmdExists('podman-compose', ['--version'])) {
    return { bin: 'podman-compose', sub: null, supportsEnvFile: false };
  }
  return null;
}

const runner = getRunner();
if (!runner) {
  if (!printOnly) {
    console.error(
      'Error: Neither Docker Compose nor Podman Compose is available.\n' +
        'Install Docker (with compose v2) or Podman with compose support (podman compose / podman-compose).',
    );
    process.exit(1);
  }
}

const composeFiles = [
  path.join(root, 'docker-compose.yml'),
  path.join(root, profile === 'dev' ? 'docker-compose.dev.yml' : 'docker-compose.prod.yml'),
];

const baseArgs = [];
for (const f of composeFiles) {
  baseArgs.push('-f', f);
}

let finalArgs = [];
if (runner.sub) {
  finalArgs.push(runner.sub);
}

// For Docker Compose we can still pass --env-file; for Podman we already injected env above
if (runner.supportsEnvFile) {
  for (const f of envFiles) {
    const p = path.join(root, f);
    if (fs.existsSync(p)) {
      finalArgs.push('--env-file', p);
    }
  }
}

finalArgs.push(...baseArgs);
if (action === 'up') {
  finalArgs.push('up', '-d');
} else if (action === 'down') {
  finalArgs.push('down');
} else if (action === 'logs') {
  finalArgs.push('logs');
}
finalArgs.push(...passThroughArgs);

const commandString = [runner?.bin || 'docker', ...finalArgs]
  .map((a) => (a.includes(' ') ? `'${a}'` : a))
  .join(' ');
console.info(`Running: ${commandString}`);

if (printOnly) {
  process.exit(0);
}

const res = spawnSync(runner.bin, finalArgs, { stdio: 'inherit', cwd: root, env: process.env });
process.exit(res.status ?? 1);

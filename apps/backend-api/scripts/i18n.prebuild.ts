import fs from 'fs';
import path from 'path';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isDir(p: string) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function readJsonSafe(file: string): any {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function mergeTranslations(roots: string[], targetDir: string) {
  const langs = new Set<string>();
  for (const root of roots) {
    if (!isDir(root)) continue;
    for (const entry of fs.readdirSync(root)) {
      const langDir = path.join(root, entry);
      if (isDir(langDir)) langs.add(entry);
    }
  }

  for (const lang of langs) {
    const accumByNs: Record<string, any> = {};
    for (const root of roots) {
      const langPath = path.join(root, lang);
      if (!isDir(langPath)) continue;
      const files = fs.readdirSync(langPath).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const ns = path.basename(file);
        const full = path.join(langPath, file);
        const data = readJsonSafe(full);
        accumByNs[ns] = { ...(accumByNs[ns] || {}), ...(data || {}) };
      }
    }

    const outLangDir = path.join(targetDir, lang);
    ensureDir(outLangDir);
    for (const [ns, data] of Object.entries(accumByNs)) {
      const outFile = path.join(outLangDir, ns);
      fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
    }
  }
}

function jsonToTypeLiteral(obj: any, indent = 2): string {
  const pad = (n: number) => ' '.repeat(n);
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    return 'string';
  }
  const entries = Object.entries(obj) as [string, any][];
  const inner = entries
    .map(
      ([k, v]) =>
        `${pad(indent)}${JSON.stringify(k)}: ${jsonToTypeLiteral(v, indent + 2)};`,
    )
    .join('\n');
  return `Record<string, any> & {\n${inner}\n${pad(indent - 2)}}`;
}

function buildI18nTypeFromMerged(mergedDir: string): string {
  if (!isDir(mergedDir))
    return 'export type I18nTranslations = Record<string, any>;\n';
  const langs = fs
    .readdirSync(mergedDir)
    .filter((d) => isDir(path.join(mergedDir, d)));
  if (langs.length === 0)
    return 'export type I18nTranslations = Record<string, any>;\n';
  const lang = langs.includes('en') ? 'en' : langs[0];
  const langDir = path.join(mergedDir, lang);
  const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json'));
  const nsBlocks: string[] = [];
  for (const file of files) {
    const nsName = path.basename(file, '.json');
    const json = readJsonSafe(path.join(langDir, file));
    const typ = jsonToTypeLiteral(json, 4);
    nsBlocks.push(`  ${JSON.stringify(nsName)}: ${typ};`);
  }
  const body = nsBlocks.join('\n');
  return `export type I18nTranslations = {\n${body}\n};\n`;
}

async function main() {
  const appDir = path.resolve(__dirname, '..');
  const mergedOut = path.join(appDir, '.i18n-merged');

  // Resolve core package dist translations via package resolution
  let coreDir: string | undefined;
  try {
    const corePkgJson = require.resolve('@technabit/nest-core/package.json', {
      paths: [appDir],
    });
    const corePkgDir = path.dirname(corePkgJson);
    const corePkg = JSON.parse(fs.readFileSync(corePkgJson, 'utf8')) as {
      i18nTranslations?: string;
    };
    const rel = corePkg.i18nTranslations || 'dist/i18n/translations';
    const guess = path.join(corePkgDir, rel);
    if (isDir(guess)) coreDir = guess;
    if (!coreDir) {
      const srcGuess = path.join(corePkgDir, 'src/i18n/translations');
      if (isDir(srcGuess)) coreDir = srcGuess;
    }
  } catch {
    // ignore if not resolvable
  }

  const appSrcDir = path.join(appDir, 'src/core/i18n/translations');

  const extraEnv = process.env.I18N_EXTRA_PATHS
    ? process.env.I18N_EXTRA_PATHS.split(',')
        .map((p) => p.trim())
        .filter(Boolean)
    : [];
  const extraDirs = extraEnv
    .map((p) => (path.isAbsolute(p) ? p : path.resolve(appDir, p)))
    .filter(isDir);

  // Discover translations from dependencies that declare "i18nTranslations" in their package.json
  const depRoots: string[] = [];
  const appPkgPath = path.join(appDir, 'package.json');
  if (fs.existsSync(appPkgPath)) {
    const appPkg = JSON.parse(fs.readFileSync(appPkgPath, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const depNames = Array.from(
      new Set([
        ...Object.keys(appPkg.dependencies || {}),
        ...Object.keys(appPkg.devDependencies || {}),
      ]),
    );
    for (const name of depNames) {
      try {
        const pkgJsonPath = require.resolve(`${name}/package.json`, {
          paths: [appDir],
        });
        const pkgDir = path.dirname(pkgJsonPath);
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8')) as {
          i18nTranslations?: string;
        };
        if (pkg.i18nTranslations) {
          const candidate = path.join(pkgDir, pkg.i18nTranslations);
          if (isDir(candidate)) depRoots.push(candidate);
          else {
            const srcCandidate = path.join(pkgDir, 'src/i18n/translations');
            if (isDir(srcCandidate)) depRoots.push(srcCandidate);
          }
        } else {
          // Fallback to conventional path if exists
          const conventional = path.join(pkgDir, 'dist/i18n/translations');
          if (isDir(conventional)) depRoots.push(conventional);
          else {
            const srcCandidate = path.join(pkgDir, 'src/i18n/translations');
            if (isDir(srcCandidate)) depRoots.push(srcCandidate);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  const roots = [coreDir, appSrcDir, ...depRoots, ...extraDirs].filter(
    Boolean,
  ) as string[];
  // eslint-disable-next-line no-console
  console.log('i18n: roots =>', roots);
  ensureDir(mergedOut);
  // Clean merged
  for (const entry of fs.readdirSync(mergedOut)) {
    fs.rmSync(path.join(mergedOut, entry), { recursive: true, force: true });
  }
  if (roots.length > 0) mergeTranslations(roots, mergedOut);

  const typesOutEnv = process.env.I18N_TYPES_OUT;
  let typesOut = typesOutEnv
    ? path.isAbsolute(typesOutEnv)
      ? typesOutEnv
      : path.resolve(appDir, typesOutEnv)
    : path.join(appDir, 'src/generated/i18n.generated.ts');
  if (!typesOut.endsWith('.ts'))
    typesOut = path.join(typesOut, 'i18n.generated.ts');
  ensureDir(path.dirname(typesOut));
  const content = buildI18nTypeFromMerged(mergedOut);
  fs.writeFileSync(typesOut, content);
  // eslint-disable-next-line no-console
  console.log(`i18n: merged -> ${mergedOut}`);
  // eslint-disable-next-line no-console
  console.log(`i18n: types -> ${typesOut}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('i18n prebuild failed:', err);
  process.exit(1);
});

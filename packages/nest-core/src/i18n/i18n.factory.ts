import { GlobalConfig } from '@/core/config/config.type';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import path from 'path';

type I18nPathsConfig = {
  // Extra translation root directories provided by the host app
  extraTranslationPaths?: string[];
  // Filepath for generated i18n typings (i18n.generated.ts)
  typesOutputPath?: string;
};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJsonSafe(file: string): any {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function isDir(p: string) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function findDependencyTranslationRoots(appDir: string): string[] {
  const roots: string[] = [];
  const appPkgPath = path.join(appDir, 'package.json');
  if (!fs.existsSync(appPkgPath)) return roots;
  try {
    const appPkg = JSON.parse(fs.readFileSync(appPkgPath, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const names = Array.from(
      new Set([
        ...Object.keys(appPkg.dependencies || {}),
        ...Object.keys(appPkg.devDependencies || {}),
      ]),
    );
    for (const name of names) {
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
          if (isDir(candidate)) roots.push(candidate);
        } else {
          const conventional = path.join(pkgDir, 'dist/i18n/translations');
          if (isDir(conventional)) roots.push(conventional);
        }
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
  return roots;
}

// Merge translations from multiple roots into a single target directory
// Structure expected: <root>/<lang>/*.json (e.g., en/core.json)
function mergeTranslations(paths: string[], targetDir: string) {
  const langs = new Set<string>();

  // Collect all languages
  for (const root of paths) {
    if (!isDir(root)) continue;
    for (const entry of fs.readdirSync(root)) {
      const langDir = path.join(root, entry);
      if (isDir(langDir)) langs.add(entry);
    }
  }

  // Merge per language/namespace
  for (const lang of langs) {
    const accumByNs: Record<string, any> = {};

    for (const root of paths) {
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

function useI18nFactory(
  configService: ConfigService<GlobalConfig>,
  i18nPathsConfig?: I18nPathsConfig,
): I18nOptionsWithoutResolvers {
  const env = configService.get('app.nodeEnv', { infer: true });
  const isLocal = env === 'local';
  const isDevelopment = env === 'development';
  // Prefer common app-local i18n paths; create a safe fallback if missing
  const appCwd = process.cwd();
  const distTranslationsDir = path.resolve(
    appCwd,
    'dist/core/i18n/translations',
  );
  const srcTranslationsDir = path.resolve(appCwd, 'src/core/i18n/translations');
  const isProd = env === 'production';

  // Always include core package translations resolved relative to this file
  // Works in dev (src/i18n/translations) and in package dist (dist/i18n/translations)
  const coreTranslationsDir = path.resolve(__dirname, 'translations');

  // Optional app-specific extra translation roots
  const extraRoots = (i18nPathsConfig?.extraTranslationPaths || [])
    .filter(Boolean)
    .map((p) => (path.isAbsolute(p) ? p : path.resolve(appCwd, p)))
    .filter(isDir);

  // Discover dependency-provided translations declared via package.json i18nTranslations
  const depRoots = findDependencyTranslationRoots(appCwd);

  // App default translation root (if exists)
  const appDefaultRoot = isProd ? distTranslationsDir : srcTranslationsDir;
  const appDefaultRootExists = isDir(appDefaultRoot);

  // Merge order: core base -> dependency roots -> extra (from options) -> app default.
  const mergeRoots = [coreTranslationsDir]
    .filter(isDir)
    .concat(depRoots)
    .concat(extraRoots)
    .concat(appDefaultRootExists ? [appDefaultRoot] : []);

  // Prepare a merged output under the app cwd (never under package)
  const mergedOutDir = path.resolve(appCwd, '.i18n-merged');
  ensureDir(mergedOutDir);
  if (mergeRoots.length > 0) {
    // Clean and regenerate merged content
    // Remove existing content safely
    for (const entry of fs.readdirSync(mergedOutDir)) {
      const p = path.join(mergedOutDir, entry);
      fs.rmSync(p, { recursive: true, force: true });
    }
    mergeTranslations(mergeRoots, mergedOutDir);
  }

  // Decide loader path: prefer merged if available, else fallback to app default
  const translationsPath = isDir(mergedOutDir)
    ? mergedOutDir
    : appDefaultRootExists
      ? appDefaultRoot
      : distTranslationsDir;

  // Configure types output. Default to app's src/generated/i18n.generated.ts
  const defaultTypesOut = path.resolve(appCwd, 'src/generated/i18n.generated.ts');
  let typesOutputPath = i18nPathsConfig?.typesOutputPath
    ? path.isAbsolute(i18nPathsConfig.typesOutputPath)
      ? i18nPathsConfig.typesOutputPath
      : path.resolve(appCwd, i18nPathsConfig.typesOutputPath)
    : defaultTypesOut;
  // If a directory is provided, append filename
  if (!typesOutputPath.endsWith('.ts')) {
    typesOutputPath = path.join(typesOutputPath, 'i18n.generated.ts');
  }

  // As a safety, avoid generating types when accidentally running within the package directory itself
  const shouldGenerateTypes = !process.cwd().includes('packages/nest-core');

  return {
    fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
      infer: true,
    }),
    loaderOptions: {
      path: translationsPath,
      watch: !isProd,
      includeSubfolders: true,
    },
    // Emit types beside app source in dev
    typesOutputPath: shouldGenerateTypes ? typesOutputPath : undefined,
    logging: isLocal || isDevelopment,
  };
}

export default useI18nFactory;

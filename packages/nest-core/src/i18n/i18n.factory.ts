import { GlobalConfig } from '@/core/config/config.type';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import path from 'path';

function useI18nFactory(
  configService: ConfigService<GlobalConfig>,
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

  let translationsPath = srcTranslationsDir;
  const distProbe = path.join(distTranslationsDir, 'en', 'common.json');
  if (isProd && fs.existsSync(distProbe)) {
    translationsPath = distTranslationsDir;
  } else if (!fs.existsSync(srcTranslationsDir)) {
    // Ensure a fallback directory exists so i18n loader doesn't crash
    fs.mkdirSync(distTranslationsDir, { recursive: true });
    translationsPath = distTranslationsDir;
  }
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
    typesOutputPath: path.resolve(appCwd, 'src/generated/i18n.generated.ts'),
    logging: isLocal || isDevelopment,
  };
}

export default useI18nFactory;

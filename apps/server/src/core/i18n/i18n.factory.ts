import { GlobalConfig } from '@/core/config/config.type';
import { ConfigService } from '@nestjs/config';
import { I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import path from 'path';
import fs from 'fs';

function useI18nFactory(
  configService: ConfigService<GlobalConfig>,
): I18nOptionsWithoutResolvers {
  const env = configService.get('app.nodeEnv', { infer: true });
  const isLocal = env === 'local';
  const isDevelopment = env === 'development';
  const distTranslationsDir = path.join(__dirname, 'translations');
  const srcTranslationsDir = path.resolve(
    process.cwd(),
    'apps/server/src/core/i18n/translations',
  );
  const isProd =
    process.env.NODE_ENV === 'production' || env === 'production';
  // Use dist only if a known file exists, otherwise fall back to src
  const distProbe = path.join(distTranslationsDir, 'en', 'common.json');
  const translationsPath =
    isProd && fs.existsSync(distProbe)
      ? distTranslationsDir
      : srcTranslationsDir;
  return {
    fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
      infer: true,
    }),
    loaderOptions: {
      path: translationsPath,
      watch: !isProd,
      includeSubfolders: true,
    },
    typesOutputPath: path.resolve(
      process.cwd(),
      'apps/server/src/generated/i18n.generated.ts',
    ),
    logging: isLocal || isDevelopment,
  };
}

export default useI18nFactory;

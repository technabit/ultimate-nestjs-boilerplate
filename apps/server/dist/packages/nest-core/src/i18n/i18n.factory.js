"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
function useI18nFactory(configService) {
    const env = configService.get('app.nodeEnv', { infer: true });
    const isLocal = env === 'local';
    const isDevelopment = env === 'development';
    const distTranslationsDir = path_1.default.join(__dirname, 'translations');
    const srcTranslationsDir = path_1.default.resolve(process.cwd(), 'apps/server/src/core/i18n/translations');
    const isProd = process.env.NODE_ENV === 'production' || env === 'production';
    const distProbe = path_1.default.join(distTranslationsDir, 'en', 'common.json');
    const translationsPath = isProd && fs_1.default.existsSync(distProbe)
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
        typesOutputPath: path_1.default.resolve(process.cwd(), 'apps/server/src/generated/i18n.generated.ts'),
        logging: isLocal || isDevelopment,
    };
}
exports.default = useI18nFactory;
//# sourceMappingURL=i18n.factory.js.map
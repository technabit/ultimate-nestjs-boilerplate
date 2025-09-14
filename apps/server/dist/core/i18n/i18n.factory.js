"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
function useI18nFactory(configService) {
    const env = configService.get('app.nodeEnv', { infer: true });
    const isLocal = env === 'local';
    const isDevelopment = env === 'development';
    return {
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
            infer: true,
        }),
        loaderOptions: {
            path: path_1.default.join(__dirname, './translations/'),
            watch: isLocal,
            includeSubfolders: true,
        },
        typesOutputPath: path_1.default.join(__dirname, '..', '..', 'generated', 'i18n.generated.ts'),
        logging: isLocal || isDevelopment,
    };
}
exports.default = useI18nFactory;
//# sourceMappingURL=i18n.factory.js.map
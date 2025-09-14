"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const app_1 = require("../../../../../../packages/core/src/constants/app");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
const kebabCase_1 = tslib_1.__importDefault(require("lodash/kebabCase"));
const node_process_1 = tslib_1.__importDefault(require("node:process"));
class EnvironmentVariablesValidator {
    NODE_ENV;
    IS_HTTPS;
    IS_WORKER;
    APP_NAME;
    APP_URL;
    APP_PORT;
    PORT;
    APP_DEBUG;
    APP_FALLBACK_LANGUAGE;
    APP_LOGGING;
    APP_LOG_LEVEL;
    APP_LOG_SERVICE;
    APP_CORS_ORIGIN;
    APP_LOCAL_FILE_UPLOAD;
}
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(app_1.Environment),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], EnvironmentVariablesValidator.prototype, "NODE_ENV", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "IS_HTTPS", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "IS_WORKER", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_NAME", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_URL", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "APP_PORT", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "PORT", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "APP_DEBUG", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_FALLBACK_LANGUAGE", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "APP_LOGGING", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_LOG_LEVEL", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(app_1.LogService),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_LOG_SERVICE", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(true|false|\*|([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)?(,([\w]+:\/\/)?([\w.-]+)(:[0-9]+)?)*$/),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "APP_CORS_ORIGIN", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "APP_LOCAL_FILE_UPLOAD", void 0);
function getConfig() {
    const port = parseInt(node_process_1.default.env.APP_PORT, 10);
    return {
        nodeEnv: (node_process_1.default.env.NODE_ENV || app_1.Environment.Development),
        isHttps: node_process_1.default.env.IS_HTTPS === 'true',
        isWorker: node_process_1.default.env.IS_WORKER === 'true',
        name: node_process_1.default.env.APP_NAME,
        appPrefix: (0, kebabCase_1.default)(node_process_1.default.env.APP_NAME),
        url: node_process_1.default.env.APP_URL || `http://localhost:${port}`,
        port,
        workerPort: Number.parseInt(node_process_1.default.env.APP_WORKER_PORT, 10),
        debug: node_process_1.default.env.APP_DEBUG === 'true',
        fallbackLanguage: node_process_1.default.env.APP_FALLBACK_LANGUAGE || 'en',
        appLogging: node_process_1.default.env.APP_LOGGING === 'true',
        logLevel: node_process_1.default.env.APP_LOG_LEVEL || 'warn',
        logService: node_process_1.default.env.APP_LOG_SERVICE || app_1.LogService.Console,
        corsOrigin: getCorsOrigin(),
        localFileUpload: node_process_1.default.env.APP_LOCAL_FILE_UPLOAD === 'true',
    };
}
exports.default = (0, config_1.registerAs)('app', () => {
    console.info(`Registering AppConfig from environment variables`);
    (0, validate_config_1.default)(node_process_1.default.env, EnvironmentVariablesValidator);
    return getConfig();
});
function getCorsOrigin() {
    const corsOrigin = node_process_1.default.env.APP_CORS_ORIGIN;
    if (corsOrigin === 'true')
        return true;
    if (corsOrigin === '*')
        return '*';
    if (!corsOrigin || corsOrigin === 'false')
        return false;
    const origins = corsOrigin.split(',').map((origin) => origin.trim());
    const localhost = origins
        ?.map((origin) => origin?.startsWith('http://localhost')
        ? origin?.replace('http://localhost', 'http://127.0.0.1')
        : origin)
        ?.filter((origin, index) => origin !== origins[index]);
    origins.push(...localhost);
    const wwwOrigins = origins
        ?.map((origin) => origin?.startsWith('https://')
        ? origin?.replace('https://', 'https://www.')
        : origin)
        ?.filter((origin, index) => origin !== origins[index]);
    origins.push(...wwwOrigins);
    return origins;
}
//# sourceMappingURL=app.config.js.map
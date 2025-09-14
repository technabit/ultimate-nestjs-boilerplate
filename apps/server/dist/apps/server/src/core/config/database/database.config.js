"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSSLMode = void 0;
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
var DatabaseSSLMode;
(function (DatabaseSSLMode) {
    DatabaseSSLMode["require"] = "require";
    DatabaseSSLMode["disable"] = "disable";
})(DatabaseSSLMode || (exports.DatabaseSSLMode = DatabaseSSLMode = {}));
class EnvironmentVariablesValidator {
    DATABASE_URL;
    DATABASE_HOST;
    DATABASE_PORT;
    DATABASE_PASSWORD;
    DATABASE_NAME;
    DATABASE_USERNAME;
    DATABASE_LOGGING;
    DATABASE_MAX_CONNECTIONS;
    DATABASE_SSL_MODE;
    DATABASE_REJECT_UNAUTHORIZED;
    DATABASE_CA;
    DATABASE_KEY;
    DATABASE_CERT;
}
tslib_1.__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_URL", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_HOST", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "DATABASE_PORT", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_PASSWORD", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_NAME", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateIf)((envValues) => !envValues.DATABASE_URL),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_USERNAME", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "DATABASE_LOGGING", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "DATABASE_MAX_CONNECTIONS", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DatabaseSSLMode),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_SSL_MODE", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "DATABASE_REJECT_UNAUTHORIZED", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_CA", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_KEY", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "DATABASE_CERT", void 0);
function getConfig() {
    const url = process.env.DATABASE_URL;
    let host = process.env.DATABASE_HOST;
    let port = process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT, 10)
        : 5432;
    let password = process.env.DATABASE_PASSWORD;
    let database = process.env.DATABASE_NAME;
    let username = process.env.DATABASE_USERNAME;
    if (url && url.startsWith('postgres')) {
        try {
            const u = new URL(url);
            host = u.hostname || host;
            port = u.port ? parseInt(u.port, 10) : port;
            username = decodeURIComponent(u.username || username || '');
            password = decodeURIComponent(u.password || password || '');
            database = (u.pathname || '').replace(/^\//, '') || database;
        }
        catch {
        }
    }
    return {
        host: host,
        port,
        password: password,
        database: database,
        username: username,
        logging: process.env.DATABASE_LOGGING === 'true',
        poolSize: process.env.DATABASE_MAX_CONNECTIONS
            ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
            : 100,
        ssl: process.env.DATABASE_SSL_MODE === DatabaseSSLMode.require
            ? {
                rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
                ca: process.env.DATABASE_CA ?? undefined,
                key: process.env.DATABASE_KEY ?? undefined,
                cert: process.env.DATABASE_CERT ?? undefined,
            }
            : undefined,
    };
}
exports.default = (0, config_1.registerAs)('database', () => {
    console.info(`Registering DatabaseConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=database.config.js.map
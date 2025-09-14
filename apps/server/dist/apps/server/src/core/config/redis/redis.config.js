"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const config_1 = require("@nestjs/config");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const class_validator_1 = require("class-validator");
class EnvironmentVariablesValidator {
    REDIS_HOST;
    REDIS_PORT;
    REDIS_PASSWORD;
    REDIS_TLS;
    REDIS_REJECT_UNAUTHORIZED;
    REDIS_CA;
    REDIS_KEY;
    REDIS_CERT;
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "REDIS_HOST", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "REDIS_PORT", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "REDIS_PASSWORD", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "REDIS_TLS", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "REDIS_REJECT_UNAUTHORIZED", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "REDIS_CA", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "REDIS_KEY", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "REDIS_CERT", void 0);
function getConfig() {
    return {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true'
            ? {
                rejectUnauthorized: process.env.REDIS_REJECT_UNAUTHORIZED === 'true',
                ca: process.env.REDIS_CA ?? undefined,
                key: process.env.REDIS_KEY ?? undefined,
                cert: process.env.REDIS_CERT ?? undefined,
            }
            : undefined,
    };
}
exports.default = (0, config_1.registerAs)('redis', () => {
    console.info(`Registering RedisConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=redis.config.js.map
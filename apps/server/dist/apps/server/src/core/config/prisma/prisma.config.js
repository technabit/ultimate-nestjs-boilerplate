"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
class EnvironmentVariablesValidator {
    PRISMA_LOG_SLOW_MS;
    PRISMA_MAX_QUERY_LENGTH;
    DATABASE_LOGGING;
    APP_LOGGING;
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "PRISMA_LOG_SLOW_MS", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "PRISMA_MAX_QUERY_LENGTH", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "DATABASE_LOGGING", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "APP_LOGGING", void 0);
exports.default = (0, config_1.registerAs)('prisma', () => {
    console.info(`Registering PrismaConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    const enabled = process.env.DATABASE_LOGGING === 'true' ||
        process.env.APP_LOGGING === 'true';
    const slow = process.env.PRISMA_LOG_SLOW_MS
        ? parseInt(process.env.PRISMA_LOG_SLOW_MS, 10)
        : 200;
    const max = process.env.PRISMA_MAX_QUERY_LENGTH
        ? parseInt(process.env.PRISMA_MAX_QUERY_LENGTH, 10)
        : 2000;
    const redact = (process.env.PRISMA_REDACT_PARAMS ?? 'true').toLowerCase() !== 'false';
    return {
        logging: {
            enabled,
            slowQueryThresholdMs: Number.isFinite(slow) ? slow : 200,
            redactParams: redact,
            maxQueryLength: Number.isFinite(max) ? max : 2000,
        },
    };
});
//# sourceMappingURL=prisma.config.js.map
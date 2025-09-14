"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
const node_process_1 = tslib_1.__importDefault(require("node:process"));
class EnvironmentVariablesValidator {
    SENTRY_DSN;
    SENTRY_LOGGING;
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "SENTRY_DSN", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "SENTRY_LOGGING", void 0);
function getConfig() {
    return {
        dsn: node_process_1.default.env.SENTRY_DSN,
        logging: node_process_1.default.env.SENTRY_LOGGING === 'true',
    };
}
exports.default = (0, config_1.registerAs)('sentry', () => {
    console.info(`Registering SentryConfig from environment variables`);
    (0, validate_config_1.default)(node_process_1.default.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=sentry.config.js.map
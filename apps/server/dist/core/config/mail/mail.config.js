"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const config_1 = require("@nestjs/config");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const class_validator_1 = require("class-validator");
class EnvironmentVariablesValidator {
    MAIL_HOST;
    MAIL_PORT;
    MAIL_USER;
    MAIL_PASSWORD;
    MAIL_IGNORE_TLS;
    MAIL_SECURE;
    MAIL_REQUIRE_TLS;
    MAIL_DEFAULT_EMAIL;
    MAIL_DEFAULT_NAME;
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_HOST", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(65535),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "MAIL_PORT", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_USER", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_PASSWORD", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "MAIL_IGNORE_TLS", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "MAIL_SECURE", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "MAIL_REQUIRE_TLS", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_DEFAULT_EMAIL", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "MAIL_DEFAULT_NAME", void 0);
function getConfig() {
    return {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
        secure: process.env.MAIL_SECURE === 'true',
        requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
        defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
        defaultName: process.env.MAIL_DEFAULT_NAME,
    };
}
exports.default = (0, config_1.registerAs)('mail', () => {
    console.info(`Registering MailConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=mail.config.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
class EnvironmentVariablesValidator {
    AUTH_SECRET;
    BASIC_AUTH_USERNAME;
    BASIC_AUTH_PASSWORD;
    GITHUB_CLIENT_ID;
    GITHUB_CLIENT_SECRET;
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "AUTH_SECRET", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "BASIC_AUTH_USERNAME", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "BASIC_AUTH_PASSWORD", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "GITHUB_CLIENT_ID", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "GITHUB_CLIENT_SECRET", void 0);
function getConfig() {
    return {
        authSecret: process.env.AUTH_SECRET,
        basicAuth: {
            username: process.env.BASIC_AUTH_USERNAME,
            password: process.env.BASIC_AUTH_PASSWORD,
        },
        oAuth: {
            github: {
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
        },
    };
}
exports.default = (0, config_1.registerAs)('auth', () => {
    console.info(`Registering AuthConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=auth.config.js.map
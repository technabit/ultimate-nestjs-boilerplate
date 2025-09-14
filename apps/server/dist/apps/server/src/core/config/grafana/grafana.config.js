"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
class EnvironmentVariablesValidator {
    GRAFANA_USERNAME;
    GRAFANA_PASSWORD;
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "GRAFANA_USERNAME", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "GRAFANA_PASSWORD", void 0);
function getConfig() {
    return {
        username: process.env.GRAFANA_USERNAME,
        password: process.env.GRAFANA_PASSWORD,
    };
}
exports.default = (0, config_1.registerAs)('grafana', () => {
    console.info(`Registering GrafanaConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=grafana.config.js.map
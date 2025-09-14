"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const class_validator_1 = require("class-validator");
const node_process_1 = tslib_1.__importDefault(require("node:process"));
class ThrottlerValidator {
    THROTTLER_ENABLED;
    THROTTLER_LIMIT;
    THROTTLER_TTL;
}
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], ThrottlerValidator.prototype, "THROTTLER_ENABLED", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], ThrottlerValidator.prototype, "THROTTLER_LIMIT", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], ThrottlerValidator.prototype, "THROTTLER_TTL", void 0);
function getConfig() {
    const enabled = node_process_1.default.env.THROTTLER_ENABLED === 'true';
    return {
        enabled: enabled,
        limit: Number.parseInt(node_process_1.default.env.THROTTLER_LIMIT),
        ttl: enabled ? (0, throttler_1.seconds)(Number.parseInt(node_process_1.default.env.THROTTLER_TTL)) : 0,
    };
}
exports.default = (0, config_1.registerAs)('throttler', () => {
    console.info(`Registering ThrottlerConfig from environment variables`);
    (0, validate_config_1.default)(node_process_1.default.env, ThrottlerValidator);
    return getConfig();
});
//# sourceMappingURL=throttler.config.js.map
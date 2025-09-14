"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BULL_BOARD_PATH = void 0;
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const app_config_1 = require("../app/app.config");
const redis_config_1 = tslib_1.__importDefault(require("../redis/redis.config"));
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
exports.BULL_BOARD_PATH = '/queues';
class EnvironmentVariablesValidator {
    QUEUE_REMOVE_ON_COMPLETE;
    RETRY_ATTEMPTS_ON_FAIL;
}
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Boolean)
], EnvironmentVariablesValidator.prototype, "QUEUE_REMOVE_ON_COMPLETE", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], EnvironmentVariablesValidator.prototype, "RETRY_ATTEMPTS_ON_FAIL", void 0);
function getConfig() {
    const appPrefix = (0, app_config_1.getConfig)().appPrefix;
    return {
        prefix: `${appPrefix}:bull`,
        redis: (0, redis_config_1.default)(),
        defaultJobOptions: {
            removeOnComplete: process.env.QUEUE_REMOVE_ON_COMPLETE === 'true',
            removeOnFail: process.env.QUEUE_REMOVE_ON_FAIL === 'true',
            attempts: process.env.QUEUE_FAILED_RETRY_ATTEMPTS
                ? Number.parseInt(process.env.QUEUE_FAILED_RETRY_ATTEMPTS)
                : 0,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        },
    };
}
exports.default = (0, config_1.registerAs)('queue', () => {
    console.info(`Registering BullConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=bull.config.js.map
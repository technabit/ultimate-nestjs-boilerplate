"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const tslib_1 = require("tslib");
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
const validate_config_1 = tslib_1.__importDefault(require("../../utils/config/validate-config"));
class EnvironmentVariablesValidator {
    AWS_REGION;
    AWS_KEY;
    AWS_SECRET;
    AWS_S3_BUCKET;
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "AWS_REGION", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "AWS_KEY", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "AWS_SECRET", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], EnvironmentVariablesValidator.prototype, "AWS_S3_BUCKET", void 0);
function getConfig() {
    return {
        region: process.env.AWS_REGION,
        accessKey: process.env.AWS_KEY,
        secretKey: process.env.AWS_SECRET,
        bucket: process.env.AWS_S3_BUCKET,
    };
}
exports.default = (0, config_1.registerAs)('aws', () => {
    console.info(`Registering AWSConfig from environment variables`);
    (0, validate_config_1.default)(process.env, EnvironmentVariablesValidator);
    return getConfig();
});
//# sourceMappingURL=aws.config.js.map
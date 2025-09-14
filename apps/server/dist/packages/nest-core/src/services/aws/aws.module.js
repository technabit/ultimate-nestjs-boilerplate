"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const aws_s3_service_1 = require("./aws-s3.service");
let AwsModule = class AwsModule {
};
exports.AwsModule = AwsModule;
exports.AwsModule = AwsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [aws_s3_service_1.AwsS3Service],
        exports: [aws_s3_service_1.AwsS3Service],
    })
], AwsModule);
//# sourceMappingURL=aws.module.js.map
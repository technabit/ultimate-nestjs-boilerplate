"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModule = void 0;
const tslib_1 = require("tslib");
const aws_module_1 = require("../../../core/services/aws/aws.module");
const fastify_multer_1 = require("@nest-lab/fastify-multer");
const common_1 = require("@nestjs/common");
const file_controller_1 = require("./file.controller");
const file_service_1 = require("./file.service");
let FileModule = class FileModule {
};
exports.FileModule = FileModule;
exports.FileModule = FileModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [fastify_multer_1.FastifyMulterModule, aws_module_1.AwsModule],
        controllers: [file_controller_1.FileController],
        providers: [file_service_1.FileService],
    })
], FileModule);
//# sourceMappingURL=file.module.js.map
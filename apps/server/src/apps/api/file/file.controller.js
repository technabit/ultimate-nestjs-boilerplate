"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const tslib_1 = require("tslib");
const auth_guard_1 = require("@app/nest-core/auth/auth.guard");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_decorators_1 = require("@app/nest-core/decorators/http.decorators");
const file_upload_interceptor_1 = tslib_1.__importDefault(require("@app/nest-core/interceptors/file-upload.interceptor"));
const file_dto_1 = require("./dto/file.dto");
const file_service_1 = require("./file.service");
let FileController = class FileController {
    fileService;
    constructor(fileService) {
        this.fileService = fileService;
    }
    uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required.');
        }
        return this.fileService.uploadFile(file);
    }
    uploadFiles(files) {
        if (!files.length) {
            throw new common_1.BadRequestException('Files are required.');
        }
        return this.fileService.uploadMultipleFiles(files);
    }
};
exports.FileController = FileController;
tslib_1.__decorate([
    (0, http_decorators_1.ApiAuth)({ summary: 'Uploads a single file', type: file_dto_1.FileDto }),
    (0, swagger_1.ApiBody)({
        required: true,
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, file_upload_interceptor_1.default)('file')),
    (0, common_1.Post)('/upload/single'),
    tslib_1.__param(0, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FileController.prototype, "uploadFile", null);
tslib_1.__decorate([
    (0, http_decorators_1.ApiAuth)({ summary: 'Uploads multiple files', type: file_dto_1.FileDto }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, file_upload_interceptor_1.default)('files', { multiple: true })),
    (0, swagger_1.ApiBody)({
        required: true,
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, common_1.Post)('/upload/multiple'),
    tslib_1.__param(0, (0, common_1.UploadedFiles)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", void 0)
], FileController.prototype, "uploadFiles", null);
exports.FileController = FileController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('file'),
    (0, common_1.Controller)({
        path: 'file',
        version: '1',
    }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    tslib_1.__metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
//# sourceMappingURL=file.controller.js.map
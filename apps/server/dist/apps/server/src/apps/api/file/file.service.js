"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const tslib_1 = require("tslib");
const nest_core_1 = require("@app/nest-core");
const common_1 = require("@nestjs/common");
let FileService = class FileService {
    awsS3Service;
    constructor(awsS3Service) {
        this.awsS3Service = awsS3Service;
    }
    async uploadFile(file) {
        if (file.destination) {
            return file;
        }
        return await this.awsS3Service.uploadFile(file, {
            filename: file.originalname,
        });
    }
    async uploadMultipleFiles(files) {
        if (files[0].destination) {
            return files;
        }
        return await Promise.all(files.map((file) => this.awsS3Service.uploadFile(file, {
            filename: file.originalname,
        })));
    }
};
exports.FileService = FileService;
exports.FileService = FileService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [nest_core_1.AwsS3Service])
], FileService);
//# sourceMappingURL=file.service.js.map
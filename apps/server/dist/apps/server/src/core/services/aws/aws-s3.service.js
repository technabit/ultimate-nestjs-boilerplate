"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const tslib_1 = require("tslib");
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
let AwsS3Service = class AwsS3Service {
    configService;
    _s3Client;
    constructor(configService) {
        this.configService = configService;
    }
    get s3Client() {
        if (!this._s3Client) {
            const region = this.configService.get('aws.region', { infer: true });
            const accessKeyId = this.configService.get('aws.accessKey', {
                infer: true,
            });
            const secretAccessKey = this.configService.get('aws.secretKey', {
                infer: true,
            });
            if (!region) {
                throw new Error('AWS region is not configured');
            }
            this._s3Client = new client_s3_1.S3Client({
                region,
                ...(accessKeyId && secretAccessKey
                    ? { credentials: { accessKeyId, secretAccessKey } }
                    : {}),
            });
        }
        return this._s3Client;
    }
    async uploadFile(file, config) {
        const response = await this.uploadBuffer(file.buffer, config);
        return {
            ...response,
            size: response?.size ?? file?.size,
            mimetype: file?.mimetype,
        };
    }
    async uploadBuffer(buffer, config) {
        const { path, filename } = this._constructFileObject(config);
        const putObjectInput = {
            Bucket: this.configService.getOrThrow('aws.bucket', { infer: true }),
            Key: path,
            Body: buffer,
            ACL: 'public-read',
        };
        if (config.contentType) {
            putObjectInput.ContentType = config.contentType;
        }
        const res = await this.s3Client.send(new client_s3_1.PutObjectCommand(putObjectInput));
        return {
            path,
            size: res.Size,
            filename,
            originalname: config.filename,
        };
    }
    _constructFileObject = ({ folder, filename, useEnv = true, }) => {
        filename = this._generateFilename(filename);
        let path = folder ? `${folder}/${filename}` : filename;
        if (useEnv) {
            path = `${this.configService.getOrThrow('app.nodeEnv', { infer: true })}/${path}`;
        }
        return {
            path,
            filename,
        };
    };
    _generateFilename(name) {
        return `${(0, uuid_1.v4)()?.replace(/-/g, '')?.slice(0, 16)}-${name}`;
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map
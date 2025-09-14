"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fastify_multer_1 = require("@nest-lab/fastify-multer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fastify_multer_2 = require("fastify-multer");
const fs_1 = tslib_1.__importDefault(require("fs"));
const mime_types_1 = tslib_1.__importDefault(require("mime-types"));
const path_1 = tslib_1.__importDefault(require("path"));
const uuid_1 = require("uuid");
const UPLOAD_DESTINATION = path_1.default.join(__dirname, '..', '..', process.env.NODE_ENV === 'production' ? 'dist' : 'src', 'tmp/file-uploads');
function FileUploadInterceptor(field, options) {
    let MixinInterceptor = class MixinInterceptor {
        configService;
        delegate;
        constructor(configService) {
            this.configService = configService;
            const isLocal = this.configService.get('app.localFileUpload', {
                infer: true,
            });
            const appliedOptions = {
                limits: { fileSize: 10e6, ...(options?.limits ?? {}) },
                ...(isLocal
                    ? {
                        storage: (0, fastify_multer_2.diskStorage)({
                            destination: function (_, _2, cb) {
                                if (!fs_1.default.existsSync(UPLOAD_DESTINATION)) {
                                    fs_1.default.mkdirSync(UPLOAD_DESTINATION, { recursive: true });
                                }
                                cb(null, UPLOAD_DESTINATION);
                            },
                            filename: function (_, file, cb) {
                                cb(null, `${(0, uuid_1.v4)()}.${mime_types_1.default.extension(file.mimetype)}`);
                            },
                        }),
                    }
                    : {}),
                ...(options ?? {}),
            };
            const InterceptorClass = options?.multiple
                ? (0, fastify_multer_1.FilesInterceptor)(field, options?.maxCount ?? 10, appliedOptions)
                : (0, fastify_multer_1.FileInterceptor)(field, appliedOptions);
            this.delegate = new InterceptorClass(this.configService);
        }
        intercept(context, next) {
            return this.delegate.intercept(context, next);
        }
    };
    MixinInterceptor = tslib_1.__decorate([
        (0, common_1.Injectable)(),
        tslib_1.__param(0, (0, common_1.Inject)(config_1.ConfigService)),
        tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
    ], MixinInterceptor);
    return (0, common_1.mixin)(MixinInterceptor);
}
exports.default = FileUploadInterceptor;
//# sourceMappingURL=file-upload.interceptor.js.map
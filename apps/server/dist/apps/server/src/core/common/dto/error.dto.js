"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const error_detail_dto_1 = require("./error-detail.dto");
class ErrorDto {
    statusCode;
    error;
    message;
    errorCode;
    details;
    stack;
    trace;
}
exports.ErrorDto = ErrorDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", Number)
], ErrorDto.prototype, "statusCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", String)
], ErrorDto.prototype, "error", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", String)
], ErrorDto.prototype, "message", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    tslib_1.__metadata("design:type", String)
], ErrorDto.prototype, "errorCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: error_detail_dto_1.ErrorDetailDto, isArray: true }),
    tslib_1.__metadata("design:type", Array)
], ErrorDto.prototype, "details", void 0);
//# sourceMappingURL=error.dto.js.map
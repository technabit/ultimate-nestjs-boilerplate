"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDetailDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
class ErrorDetailDto {
    property;
    code;
    message;
}
exports.ErrorDetailDto = ErrorDetailDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    tslib_1.__metadata("design:type", String)
], ErrorDetailDto.prototype, "property", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", String)
], ErrorDetailDto.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    tslib_1.__metadata("design:type", String)
], ErrorDetailDto.prototype, "message", void 0);
//# sourceMappingURL=error-detail.dto.js.map
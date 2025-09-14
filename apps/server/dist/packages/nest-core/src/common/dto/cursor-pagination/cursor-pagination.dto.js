"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorPaginationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CursorPaginationDto {
    limit;
    afterCursor;
    beforeCursor;
    totalRecords;
    constructor(totalRecords, afterCursor, beforeCursor, pageOptions) {
        this.limit = pageOptions?.limit;
        this.afterCursor = afterCursor;
        this.beforeCursor = beforeCursor;
        this.totalRecords = totalRecords;
    }
}
exports.CursorPaginationDto = CursorPaginationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], CursorPaginationDto.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], CursorPaginationDto.prototype, "afterCursor", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], CursorPaginationDto.prototype, "beforeCursor", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], CursorPaginationDto.prototype, "totalRecords", void 0);
//# sourceMappingURL=cursor-pagination.dto.js.map
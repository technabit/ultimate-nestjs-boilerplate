"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffsetPaginationDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class OffsetPaginationDto {
    limit;
    currentPage;
    nextPage;
    previousPage;
    totalRecords;
    totalPages;
    constructor(totalRecords, pageOptions) {
        this.limit = pageOptions?.limit;
        this.currentPage = pageOptions?.page;
        this.nextPage =
            this.currentPage < this.totalPages ? this.currentPage + 1 : undefined;
        this.previousPage =
            this.currentPage > 1 && this.currentPage - 1 < this.totalPages
                ? this.currentPage - 1
                : undefined;
        this.totalRecords = totalRecords;
        this.totalPages =
            this.limit > 0 ? Math.ceil(totalRecords / pageOptions?.limit) : 0;
    }
}
exports.OffsetPaginationDto = OffsetPaginationDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], OffsetPaginationDto.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], OffsetPaginationDto.prototype, "currentPage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], OffsetPaginationDto.prototype, "nextPage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], OffsetPaginationDto.prototype, "previousPage", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], OffsetPaginationDto.prototype, "totalRecords", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], OffsetPaginationDto.prototype, "totalPages", void 0);
//# sourceMappingURL=offset-pagination.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffsetPaginatedDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const offset_pagination_dto_1 = require("./offset-pagination.dto");
class OffsetPaginatedDto {
    data;
    pagination;
    constructor(data, meta) {
        this.data = data;
        this.pagination = meta;
    }
}
exports.OffsetPaginatedDto = OffsetPaginatedDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object], isArray: true }),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Array)
], OffsetPaginatedDto.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: offset_pagination_dto_1.OffsetPaginationDto }),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", offset_pagination_dto_1.OffsetPaginationDto)
], OffsetPaginatedDto.prototype, "pagination", void 0);
//# sourceMappingURL=paginated.dto.js.map
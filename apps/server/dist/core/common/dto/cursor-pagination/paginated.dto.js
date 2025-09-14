"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorPaginatedDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const cursor_pagination_dto_1 = require("./cursor-pagination.dto");
class CursorPaginatedDto {
    data;
    pagination;
    constructor(data, meta) {
        this.data = data;
        this.pagination = meta;
    }
}
exports.CursorPaginatedDto = CursorPaginatedDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object], isArray: true }),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Array)
], CursorPaginatedDto.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", cursor_pagination_dto_1.CursorPaginationDto)
], CursorPaginatedDto.prototype, "pagination", void 0);
//# sourceMappingURL=paginated.dto.js.map
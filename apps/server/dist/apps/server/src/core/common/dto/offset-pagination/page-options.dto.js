"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageOptionsDto = void 0;
const tslib_1 = require("tslib");
const app_1 = require("../../../../../../../packages/core/src/constants/app");
const field_decorators_1 = require("../../../decorators/field.decorators");
class PageOptionsDto {
    limit = app_1.DEFAULT_PAGE_LIMIT;
    page = app_1.DEFAULT_CURRENT_PAGE;
    q;
    order = app_1.Order.Asc;
    get offset() {
        return this.page ? (this.page - 1) * this.limit : 0;
    }
}
exports.PageOptionsDto = PageOptionsDto;
tslib_1.__decorate([
    (0, field_decorators_1.NumberFieldOptional)({
        minimum: 1,
        default: app_1.DEFAULT_PAGE_LIMIT,
        int: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PageOptionsDto.prototype, "limit", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.NumberFieldOptional)({
        minimum: 1,
        default: app_1.DEFAULT_CURRENT_PAGE,
        int: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PageOptionsDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.StringFieldOptional)(),
    tslib_1.__metadata("design:type", String)
], PageOptionsDto.prototype, "q", void 0);
tslib_1.__decorate([
    (0, field_decorators_1.EnumFieldOptional)(() => app_1.Order, { default: app_1.Order.Asc }),
    tslib_1.__metadata("design:type", String)
], PageOptionsDto.prototype, "order", void 0);
//# sourceMappingURL=page-options.dto.js.map
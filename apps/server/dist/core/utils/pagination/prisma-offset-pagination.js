"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateOffsetPrisma = paginateOffsetPrisma;
const offset_pagination_dto_1 = require("../../common/dto/offset-pagination/offset-pagination.dto");
async function paginateOffsetPrisma(delegate, baseArgs, pageOptionsDto, options) {
    const take = options?.takeAll ? undefined : pageOptionsDto.limit;
    const skip = options?.takeAll ? undefined : pageOptionsDto.offset;
    const [items, total] = await Promise.all([
        delegate.findMany({ ...baseArgs, skip, take }),
        options?.skipCount
            ? Promise.resolve(-1)
            : delegate.count({ where: baseArgs.where }),
    ]);
    const meta = new offset_pagination_dto_1.OffsetPaginationDto(total, pageOptionsDto);
    return [items, meta];
}
//# sourceMappingURL=prisma-offset-pagination.js.map
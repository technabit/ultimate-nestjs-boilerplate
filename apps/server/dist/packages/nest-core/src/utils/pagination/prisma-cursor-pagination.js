"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateCursorPrisma = paginateCursorPrisma;
const cursor_pagination_dto_1 = require("../../common/dto/cursor-pagination/cursor-pagination.dto");
async function paginateCursorPrisma(options) {
    const { delegate, where = {}, select, include, paginationKeys = ['createdAt', 'id'], query, withCount = true, } = options;
    const limit = Math.min(Math.max(query.limit ?? 100, 1), 1000);
    const order = (query.order ?? 'DESC').toUpperCase();
    const decode = (cursor) => decodeCursor(cursor, paginationKeys);
    const after = query.afterCursor ? decode(query.afterCursor) : null;
    const before = query.beforeCursor ? decode(query.beforeCursor) : null;
    let cursorFilter = {};
    const [key1, key2] = paginationKeys;
    if (after) {
        const op1 = order === 'ASC' ? 'gt' : 'lt';
        const op2 = order === 'ASC' ? 'gt' : 'lt';
        cursorFilter = {
            OR: [
                { [key1]: { [op1]: after[key1] } },
                { AND: [{ [key1]: after[key1] }, { [key2]: { [op2]: after[key2] } }] },
            ],
        };
    }
    else if (before) {
        const op1 = order === 'ASC' ? 'lt' : 'gt';
        const op2 = order === 'ASC' ? 'lt' : 'gt';
        cursorFilter = {
            OR: [
                { [key1]: { [op1]: before[key1] } },
                {
                    AND: [{ [key1]: before[key1] }, { [key2]: { [op2]: before[key2] } }],
                },
            ],
        };
    }
    const orderBy = [{ [key1]: order }, { [key2]: order }];
    const data = await delegate.findMany({
        where: { ...where, ...cursorFilter },
        orderBy,
        take: limit + 1,
        select,
        include,
    });
    let list = data;
    const hasMore = list.length > limit;
    if (hasMore)
        list = list.slice(0, limit);
    if (!after && before) {
        list = list.reverse();
    }
    const nextAfter = list.length
        ? encodeCursor(list[list.length - 1], paginationKeys)
        : null;
    const nextBefore = list.length
        ? encodeCursor(list[0], paginationKeys)
        : null;
    let totalRecords = -1;
    if (withCount && typeof delegate.count === 'function') {
        try {
            totalRecords = await delegate.count({ where });
        }
        catch {
        }
    }
    const pageOptions = {
        limit,
        afterCursor: query.afterCursor,
        beforeCursor: query.beforeCursor,
    };
    const cursorDto = new cursor_pagination_dto_1.CursorPaginationDto(totalRecords, nextAfter, nextBefore, pageOptions);
    return { data: list, cursor: cursorDto };
}
function encodeCursor(entity, keys) {
    const payload = keys
        .map((k) => `${k}:${encodeByType(typeof entity[k], entity[k])}`)
        .join(',');
    return Buffer.from(payload).toString('base64');
}
function decodeCursor(cursor, _keys) {
    const raw = Buffer.from(cursor, 'base64').toString();
    const parts = raw.split(',');
    const out = {};
    for (const p of parts) {
        const [k, v] = p.split(':');
        out[k] = decodeByType(k, v);
    }
    return out;
}
function encodeByType(type, value) {
    if (value === null || value === undefined)
        return '';
    switch (type) {
        case 'object':
            if (value instanceof Date)
                return String(value.getTime());
            if (typeof value.toString === 'function')
                return value.toString();
            return JSON.stringify(value);
        case 'number':
            return String(value);
        case 'string':
            return encodeURIComponent(value);
        case 'boolean':
            return value ? '1' : '0';
        default:
            return String(value);
    }
}
function decodeByType(key, raw) {
    if (key === 'createdAt') {
        const ts = parseInt(raw, 10);
        if (!Number.isFinite(ts))
            return new Date(raw);
        return new Date(ts);
    }
    return decodeURIComponent(raw);
}
//# sourceMappingURL=prisma-cursor-pagination.js.map
import { CursorPaginationDto } from '@/core/common/dto/cursor-pagination/cursor-pagination.dto';

export interface PrismaCursorQuery {
  afterCursor?: string;
  beforeCursor?: string;
  limit?: number;
  order?: 'ASC' | 'DESC';
}

export interface PrismaCursorOptions<T> {
  // Prisma model delegate (e.g. prisma.user)
  // Must at least expose findMany; count is optional but recommended for totalRecords
  delegate: {
    findMany: (args: {
      where?: any;
      orderBy?: any;
      take?: number;
      select?: any;
      include?: any;
    }) => Promise<T[]>;
    count?: (args: { where?: any }) => Promise<number>;
  };
  where?: any;
  select?: any;
  include?: any;
  // Default pagination keys: createdAt then id for tie-breaker
  paginationKeys?: (keyof T & ('createdAt' | 'id'))[];
  query: PrismaCursorQuery;
  /**
   * Whether to execute a COUNT(*) query for totalRecords. Default true.
   * Disable if performance sensitive and you don't need total record count.
   */
  withCount?: boolean;
}

export async function paginateCursorPrisma<
  T extends { createdAt: Date; id: string },
>(
  options: PrismaCursorOptions<T>,
): Promise<{ data: T[]; cursor: CursorPaginationDto }> {
  const {
    delegate,
    where = {},
    select,
    include,
    paginationKeys = ['createdAt', 'id'] as any,
    query,
    withCount = true,
  } = options;
  const limit = Math.min(Math.max(query.limit ?? 100, 1), 1000);
  const order = (query.order ?? 'DESC').toUpperCase() as 'ASC' | 'DESC';

  // decode cursor
  const decode = (cursor: string) =>
    decodeCursor<T>(cursor, paginationKeys as string[]);
  const after = query.afterCursor ? decode(query.afterCursor) : null;
  const before = query.beforeCursor ? decode(query.beforeCursor) : null;

  // Build cursor where filters
  let cursorFilter: any = {};
  const [key1, key2] = paginationKeys as (keyof T)[];
  if (after) {
    const op1 = order === 'ASC' ? 'gt' : 'lt';
    const op2 = order === 'ASC' ? 'gt' : 'lt';
    cursorFilter = {
      OR: [
        { [key1]: { [op1]: after[key1] } },
        { AND: [{ [key1]: after[key1] }, { [key2]: { [op2]: after[key2] } }] },
      ],
    };
  } else if (before) {
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

  const orderBy = [{ [key1 as string]: order }, { [key2 as string]: order }];

  const data: T[] = await delegate.findMany({
    where: { ...where, ...cursorFilter },
    orderBy,
    take: limit + 1,
    select,
    include,
  });

  let list = data;
  const hasMore = list.length > limit;
  if (hasMore) list = list.slice(0, limit);

  // Reverse when paginating backwards to maintain correct chronological order for responses
  if (!after && before) {
    list = list.reverse();
  }

  const nextAfter = list.length
    ? encodeCursor(list[list.length - 1] as any, paginationKeys as string[])
    : null;
  const nextBefore = list.length
    ? encodeCursor(list[0] as any, paginationKeys as string[])
    : null;

  // totalRecords (optional performance cost)
  let totalRecords = -1;
  if (withCount && typeof delegate.count === 'function') {
    try {
      totalRecords = await delegate.count({ where });
    } catch {
      // Swallow count errors to avoid breaking main query; keep -1 as sentinel
    }
  }

  const pageOptions = {
    limit,
    afterCursor: query.afterCursor,
    beforeCursor: query.beforeCursor,
  } as any; // structural typing compatible with PageOptionsDto

  const cursorDto = new CursorPaginationDto(
    totalRecords,
    nextAfter as any,
    nextBefore as any,
    pageOptions,
  );

  return { data: list, cursor: cursorDto };
}

function encodeCursor<T>(entity: T, keys: string[]): string {
  const payload = keys
    .map(
      (k) =>
        `${k}:${encodeByType(typeof (entity as any)[k], (entity as any)[k])}`,
    )
    .join(',');
  return Buffer.from(payload).toString('base64');
}

function decodeCursor<T>(cursor: string, _keys: string[]): any {
  const raw = Buffer.from(cursor, 'base64').toString();
  const parts = raw.split(',');
  const out: any = {};
  for (const p of parts) {
    const [k, v] = p.split(':');
    out[k] = decodeByType(k, v);
  }
  return out as T;
}

function encodeByType(type: string, value: any): string | null {
  if (value === null || value === undefined) return '';
  switch (type) {
    case 'object':
      if (value instanceof Date) return String((value as Date).getTime());
      if (typeof value.toString === 'function') return value.toString();
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

function decodeByType(key: string, raw: string): any {
  if (key === 'createdAt') {
    const ts = parseInt(raw, 10);
    if (!Number.isFinite(ts)) return new Date(raw);
    return new Date(ts);
  }
  return decodeURIComponent(raw);
}

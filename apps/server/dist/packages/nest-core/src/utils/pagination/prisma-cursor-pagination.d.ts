import { CursorPaginationDto } from '@/core/common/dto/cursor-pagination/cursor-pagination.dto';
export interface PrismaCursorQuery {
    afterCursor?: string;
    beforeCursor?: string;
    limit?: number;
    order?: 'ASC' | 'DESC';
}
export interface PrismaCursorOptions<T> {
    delegate: {
        findMany: (args: {
            where?: any;
            orderBy?: any;
            take?: number;
            select?: any;
            include?: any;
        }) => Promise<T[]>;
        count?: (args: {
            where?: any;
        }) => Promise<number>;
    };
    where?: any;
    select?: any;
    include?: any;
    paginationKeys?: (keyof T & ('createdAt' | 'id'))[];
    query: PrismaCursorQuery;
    withCount?: boolean;
}
export declare function paginateCursorPrisma<T extends {
    createdAt: Date;
    id: string;
}>(options: PrismaCursorOptions<T>): Promise<{
    data: T[];
    cursor: CursorPaginationDto;
}>;

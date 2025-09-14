import { CursorPaginationDto } from './cursor-pagination.dto';
export declare class CursorPaginatedDto<TData> {
    data: TData[];
    pagination: CursorPaginationDto;
    constructor(data: TData[], meta: CursorPaginationDto);
}

import { OffsetPaginationDto } from './offset-pagination.dto';
export declare class OffsetPaginatedDto<TData> {
    data: TData[];
    pagination: OffsetPaginationDto;
    constructor(data: TData[], meta: OffsetPaginationDto);
}

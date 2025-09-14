import { PageOptionsDto } from './page-options.dto';
export declare class OffsetPaginationDto {
    readonly limit: number;
    readonly currentPage: number;
    readonly nextPage?: number;
    readonly previousPage?: number;
    readonly totalRecords: number;
    readonly totalPages: number;
    constructor(totalRecords: number, pageOptions: PageOptionsDto);
}

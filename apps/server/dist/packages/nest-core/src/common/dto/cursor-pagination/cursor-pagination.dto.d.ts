import { PageOptionsDto } from './page-options.dto';
export declare class CursorPaginationDto {
    readonly limit: number;
    readonly afterCursor?: string;
    readonly beforeCursor?: string;
    readonly totalRecords: number;
    constructor(totalRecords: number, afterCursor: string, beforeCursor: string, pageOptions: PageOptionsDto);
}

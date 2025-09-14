import { OffsetPaginationDto } from '@/core/common/dto/offset-pagination/offset-pagination.dto';
import { PageOptionsDto } from '@/core/common/dto/offset-pagination/page-options.dto';
type FindManyArgs<T> = {
    where?: any;
    orderBy?: any;
    select?: any;
    include?: any;
};
export declare function paginateOffsetPrisma<T>(delegate: {
    findMany: Function;
    count: Function;
}, baseArgs: FindManyArgs<T>, pageOptionsDto: PageOptionsDto, options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
}>): Promise<[T[], OffsetPaginationDto]>;
export {};

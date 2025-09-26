import { OffsetPaginationDto } from '@/core/common/dto/offset-pagination/offset-pagination.dto';
import { PageOptionsDto } from '@/core/common/dto/offset-pagination/page-options.dto';

type FindManyArgs<T> = {
  where?: any;
  orderBy?: any;
  select?: any;
  include?: any;
  skip?: number;
  take?: number;
};

type PrismaPaginatorDelegate<T> = {
  findMany: (args: FindManyArgs<T>) => Promise<T[]>;
  count: (args: Pick<FindManyArgs<T>, 'where'>) => Promise<number>;
};

export async function paginateOffsetPrisma<T>(
  delegate: PrismaPaginatorDelegate<T>,
  baseArgs: FindManyArgs<T>,
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{ skipCount: boolean; takeAll: boolean }>,
): Promise<[T[], OffsetPaginationDto]> {
  const take = options?.takeAll ? undefined : pageOptionsDto.limit;
  const skip = options?.takeAll ? undefined : pageOptionsDto.offset;

  const [items, total] = await Promise.all([
    delegate.findMany({ ...baseArgs, skip, take }),
    options?.skipCount
      ? Promise.resolve(-1)
      : delegate.count({ where: baseArgs.where }),
  ]);

  const meta = new OffsetPaginationDto(total, pageOptionsDto);
  return [items as T[], meta];
}

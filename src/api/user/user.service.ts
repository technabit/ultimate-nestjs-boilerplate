import { UserEntity } from '@/auth/entities/user.entity';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { I18nTranslations } from '@/generated/i18n.generated';
import { buildPaginator } from '@/utils/pagination/cursor-pagination';
import { paginate } from '@/utils/pagination/offset-pagination';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { FindManyOptions, Repository } from 'typeorm';
import {
  QueryUsersCursorDto,
  QueryUsersOffsetDto,
  UserDto,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllUsers(
    dto: QueryUsersOffsetDto,
  ): Promise<OffsetPaginatedDto<UserDto>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');
    const [users, metaDto] = await paginate<UserEntity>(query, dto, {
      skipCount: false,
      takeAll: false,
    });
    return new OffsetPaginatedDto(users, metaDto);
  }

  async findAllUsersCursor(
    reqDto: QueryUsersCursorDto,
  ): Promise<CursorPaginatedDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    const paginator = buildPaginator({
      entity: UserEntity,
      alias: 'user',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: 'DESC',
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });

    const { data, cursor } = await paginator.paginate(queryBuilder);

    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(data, metaDto);
  }

  async findOneUser(id: Uuid | string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(this.i18nService.t('user.notFound'));
    }
    return user;
  }

  async deleteUser(id: Uuid | string) {
    await this.userRepository.findOneByOrFail({ id });
    await this.userRepository.softDelete(id);
    return HttpStatus.OK;
  }

  async getAllUsers(options?: FindManyOptions<UserEntity>) {
    return this.userRepository.find(options);
  }
}

import { I18nTranslations } from '@/generated/i18n.generated';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import {
  BetterAuthService,
  CurrentUserSession,
  CursorPaginatedDto,
  CursorPaginationDto,
  OffsetPaginatedDto,
  paginateCursorPrisma,
  paginateOffsetPrisma,
  PrismaService,
  Uuid,
} from '@technabit/nest-core';
import { I18nService } from 'nestjs-i18n';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  QueryUsersCursorDto,
  QueryUsersOffsetDto,
  UserDto,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly prisma: PrismaService,
    private readonly betterAuthService: BetterAuthService,
  ) {}

  async findAllUsers(
    dto: QueryUsersOffsetDto,
  ): Promise<OffsetPaginatedDto<UserDto>> {
    const [users, metaDto] = await paginateOffsetPrisma(
      this.prisma.user,
      {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      },
      dto,
      { skipCount: false, takeAll: false },
    );
    return new OffsetPaginatedDto(users as any, metaDto);
  }

  async findAllUsersCursor(
    reqDto: QueryUsersCursorDto,
  ): Promise<CursorPaginatedDto<UserDto>> {
    const { data, cursor } = await paginateCursorPrisma<any>({
      delegate: this.prisma.user,
      where: { deletedAt: null },
      paginationKeys: ['createdAt', 'id'],
      query: {
        limit: (reqDto as any).limit,
        order: 'DESC',
        afterCursor: (reqDto as any).afterCursor,
        beforeCursor: (reqDto as any).beforeCursor,
      },
    });
    const metaDto = new CursorPaginationDto(
      data.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );
    return new CursorPaginatedDto(data as any, metaDto);
  }

  async findOneUser(id: Uuid | string): Promise<UserDto> {
    console.log('___ FIND USER', { id });

    const user = await this.prisma.user.findFirst({
      where: { id: String(id), deletedAt: null },
    });

    console.log('___ FOUND USER', { user });

    if (!user) {
      throw new NotFoundException(await this.i18nService.t('user.notFound'));
    }
    return user as any;
  }

  async deleteUser(id: Uuid | string) {
    const exists = await this.prisma.user.findFirst({
      where: { id: String(id), deletedAt: null },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException(await this.i18nService.t('user.notFound'));
    }
    await this.prisma.user.update({
      where: { id: String(id) },
      data: { deletedAt: new Date() },
    });
    return HttpStatus.OK;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserProfile(
    userId: string,
    dto: UpdateUserProfileDto,
    options: { headers: CurrentUserSession['headers'] },
  ) {
    let shouldChangeUsername = !(dto.username == null);

    if (shouldChangeUsername) {
      const user = await this.prisma.user.findFirst({
        where: { id: String(userId), deletedAt: null },
        select: { id: true, username: true },
      });
      shouldChangeUsername = user?.username !== dto.username;
    }

    await this.betterAuthService.api.updateUser({
      body: {
        ...(dto.image !== undefined ? { image: dto.image } : {}),
        ...(shouldChangeUsername ? { username: dto.username } : {}),
      },
      headers: options?.headers as any,
    });

    // Update rest of the fields manually
    await this.prisma.user.update({
      where: { id: String(userId) },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    return await this.findOneUser(userId);
  }
}

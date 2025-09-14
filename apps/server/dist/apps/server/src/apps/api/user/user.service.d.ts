import { BetterAuthService, CursorPaginatedDto, OffsetPaginatedDto } from '@app/nest-core';
import { Uuid } from '@core/types/common';
import { PrismaService, CurrentUserSession } from '@app/nest-core';
import { I18nTranslations } from '@/generated/i18n.generated';
import { HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { QueryUsersCursorDto, QueryUsersOffsetDto, UserDto } from './dto/user.dto';
export declare class UserService {
    private readonly i18nService;
    private readonly prisma;
    private readonly betterAuthService;
    constructor(i18nService: I18nService<I18nTranslations>, prisma: PrismaService, betterAuthService: BetterAuthService);
    findAllUsers(dto: QueryUsersOffsetDto): Promise<OffsetPaginatedDto<UserDto>>;
    findAllUsersCursor(reqDto: QueryUsersCursorDto): Promise<CursorPaginatedDto<UserDto>>;
    findOneUser(id: Uuid | string): Promise<UserDto>;
    deleteUser(id: Uuid | string): Promise<HttpStatus>;
    getAllUsers(): Promise<{
        email: string;
        username: string;
        firstName: string | null;
        lastName: string | null;
        image: string | null;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        deletedAt: Date | null;
        displayUsername: string | null;
        isEmailVerified: boolean;
        twoFactorEnabled: boolean;
    }[]>;
    updateUserProfile(userId: string, dto: UpdateUserProfileDto, options: {
        headers: CurrentUserSession['headers'];
    }): Promise<UserDto>;
}

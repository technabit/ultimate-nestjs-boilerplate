import { BetterAuthService } from '@/core/auth/better-auth.service';
import { CursorPaginatedDto } from '@/core/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/core/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@core/types/common';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { CurrentUserSession } from '@/core/decorators/auth/current-user-session.decorator';
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        username: string;
        displayUsername: string | null;
        email: string;
        isEmailVerified: boolean;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        image: string | null;
        bio: string | null;
        twoFactorEnabled: boolean;
    }[]>;
    updateUserProfile(userId: string, dto: UpdateUserProfileDto, options: {
        headers: CurrentUserSession['headers'];
    }): Promise<UserDto>;
}

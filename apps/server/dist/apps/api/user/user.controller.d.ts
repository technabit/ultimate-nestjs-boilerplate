import { CursorPaginatedDto } from '@/core/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/core/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@core/types/common';
import { CurrentUserSession } from '@/core/decorators/auth/current-user-session.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { QueryUsersCursorDto, QueryUsersOffsetDto, UserDto } from './dto/user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getCurrentUser(user: CurrentUserSession['user']): Promise<UserDto>;
    findAllUsers(dto: QueryUsersOffsetDto): Promise<OffsetPaginatedDto<UserDto>>;
    findAllUsersCursor(dto: QueryUsersCursorDto): Promise<CursorPaginatedDto<UserDto>>;
    findUser(id: Uuid): Promise<UserDto>;
    deleteUser(id: Uuid): Promise<import("@nestjs/common").HttpStatus>;
    updateUserProfile(dto: UpdateUserProfileDto, userSession: CurrentUserSession): Promise<UserDto>;
}

import { CursorPaginatedDto, OffsetPaginatedDto } from '@app/nest-core';
import { Uuid } from '@core/types/common';
import { CurrentUserSession } from '@app/nest-core';
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

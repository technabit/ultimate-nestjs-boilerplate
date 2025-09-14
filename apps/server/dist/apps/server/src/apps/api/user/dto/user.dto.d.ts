import { CursorPaginationDto, CursorPageOptionsDto as CursorPageOptions, CursorPaginatedDto, OffsetPaginationDto, OffsetPageOptionsDto as OffsetPageOptions, OffsetPaginatedDto } from '@app/nest-core';
import { Role } from '../user.enum';
export declare class UserDto {
    id: string;
    role: Role;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    bio?: string;
}
export declare class QueryUsersOffsetDto extends OffsetPageOptions {
}
export declare class OffsetPaginatedUserDto extends OffsetPaginatedDto<UserDto> {
    data: UserDto[];
    pagination: OffsetPaginationDto;
}
export declare class QueryUsersCursorDto extends CursorPageOptions {
}
export declare class CursorPaginatedUserDto extends CursorPaginatedDto<UserDto> {
    data: UserDto[];
    pagination: CursorPaginationDto;
}

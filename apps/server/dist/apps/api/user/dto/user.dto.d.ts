import { CursorPaginationDto } from '@/core/common/dto/cursor-pagination/cursor-pagination.dto';
import { PageOptionsDto as CursorPageOptions } from '@/core/common/dto/cursor-pagination/page-options.dto';
import { CursorPaginatedDto } from '@/core/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginationDto } from '@/core/common/dto/offset-pagination/offset-pagination.dto';
import { PageOptionsDto as OffsetPageOptions } from '@/core/common/dto/offset-pagination/page-options.dto';
import { OffsetPaginatedDto } from '@/core/common/dto/offset-pagination/paginated.dto';
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

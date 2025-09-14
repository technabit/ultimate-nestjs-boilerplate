import {
  CursorPaginationDto,
  CursorPageOptionsDto as CursorPageOptions,
  CursorPaginatedDto,
  OffsetPaginationDto,
  OffsetPageOptionsDto as OffsetPageOptions,
  OffsetPaginatedDto,
} from '@app/nest-core';
import {
  ClassField,
  EnumField,
  StringField,
  StringFieldOptional,
} from '@app/nest-core';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Role } from '../user.enum';

@Exclude()
export class UserDto {
  @StringField()
  @Expose()
  id: string;

  @EnumField(() => Role)
  @Expose()
  role: Role;

  @StringField()
  @Expose()
  username: string;

  @StringField()
  @Expose()
  email: string;

  @StringFieldOptional()
  @Expose()
  firstName?: string;

  @StringFieldOptional()
  @Expose()
  lastName?: string;

  @StringFieldOptional()
  @Expose()
  image?: string;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;

  @Expose()
  @StringFieldOptional()
  bio?: string;
}

export class QueryUsersOffsetDto extends OffsetPageOptions {}

export class OffsetPaginatedUserDto extends OffsetPaginatedDto<UserDto> {
  @Expose()
  @ApiProperty({ type: UserDto, isArray: true })
  @Type(() => UserDto)
  declare data: UserDto[];

  @Expose()
  @ApiProperty({ type: OffsetPaginationDto })
  @Type(() => OffsetPaginationDto)
  declare pagination: OffsetPaginationDto;
}

export class QueryUsersCursorDto extends CursorPageOptions {}

export class CursorPaginatedUserDto extends CursorPaginatedDto<UserDto> {
  @Expose()
  @ApiProperty({ type: UserDto, isArray: true })
  @Type(() => UserDto)
  declare data: UserDto[];

  @Expose()
  @ApiProperty({ type: CursorPaginationDto })
  @Type(() => CursorPaginationDto)
  declare pagination: CursorPaginationDto;
}

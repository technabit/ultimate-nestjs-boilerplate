import { AuthGuard } from '@/auth/auth.guard';
import { UserSession } from '@/auth/types';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUserSession } from '@/decorators/auth/current-user-session.decorator';
import { ApiAuth } from '@/decorators/http.decorators';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ListUserDto } from './dto/list-user.dto';
import { LoadMoreUsersDto } from './dto/load-more-users.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller({
  path: 'user',
  version: '1',
})
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiAuth({
    summary: 'Get current user',
    type: UserDto,
  })
  @Get('whoami')
  async getCurrentUser(
    @CurrentUserSession('user') user: UserSession['user'],
  ): Promise<UserDto> {
    return await this.userService.findOneUser(user.id);
  }

  @Get('/all')
  @ApiAuth({
    type: UserDto,
    summary: 'List users',
    isPaginated: true,
  })
  async findAllUsers(
    @Query() reqDto: ListUserDto,
  ): Promise<OffsetPaginatedDto<UserDto>> {
    return await this.userService.findAllUsers(reqDto);
  }

  @Get('/load-more')
  @ApiAuth({
    type: UserDto,
    summary: 'Load more users',
    isPaginated: true,
    paginationType: 'cursor',
  })
  async loadMoreUsers(
    @Query() reqDto: LoadMoreUsersDto,
  ): Promise<CursorPaginatedDto<UserDto>> {
    return await this.userService.loadMoreUsers(reqDto);
  }

  @Get(':id')
  @ApiAuth({ summary: 'Find user by id', type: UserDto })
  @ApiParam({ name: 'id', type: 'string' })
  async findUser(@Param('id', ParseUUIDPipe) id: Uuid): Promise<UserDto> {
    return await this.userService.findOneUser(id);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete a user',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @ApiParam({ name: 'id', type: 'String' })
  deleteUser(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.userService.deleteUser(id);
  }
}

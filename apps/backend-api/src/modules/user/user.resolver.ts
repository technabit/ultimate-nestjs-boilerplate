import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import {
  AuthGuard,
  CurrentUserSession,
  type CurrentUserSession as CurrentUserSessionType,
} from '@technabit/nest-core';

import { OrganizationMemberModel } from '@/modules/organization/models/organization-member.model';
import { UserModel } from './models/user.model';
import { UserService } from './user.service';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel, { name: 'me', nullable: true })
  @UseGuards(AuthGuard)
  async getMe(
    @CurrentUserSession() session: CurrentUserSessionType,
  ): Promise<UserModel | null> {
    if (!session?.user) {
      return null;
    }

    const databaseUser = await this.userService.findById(session.user.id);
    if (databaseUser) {
      return databaseUser;
    }

    return this.userService.toUserModel(session.user);
  }

  @Query(() => UserModel, { name: 'user', nullable: true })
  @UseGuards(AuthGuard)
  async getUser(@Args('id') id: string): Promise<UserModel | null> {
    return this.userService.findById(id);
  }

  @ResolveField(() => [OrganizationMemberModel], { nullable: true })
  async memberships(
    @Parent() user: UserModel,
  ): Promise<OrganizationMemberModel[]> {
    return this.userService.getMemberships(user.id);
  }
}

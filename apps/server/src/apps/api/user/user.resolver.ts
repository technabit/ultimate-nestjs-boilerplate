import { Logger, UseGuards } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';

import { AuthGuard } from '@/core/auth/auth.guard';
import { CurrentUserSession } from '@/core/decorators/auth/current-user-session.decorator';
import { I18nTranslations } from '@/generated/i18n.generated';

import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { I18nService } from 'nestjs-i18n';
import { DeleteUserInput } from './schema/delete-user.schema';
import { GetUserArgs } from './schema/get-user.schema';
import { UserSchema } from './schema/user.schema';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Resolver(() => UserSchema)
export class UserResolver {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly userService: UserService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  @Query(() => UserSchema)
  async whoami(@CurrentUserSession('user') user: CurrentUserSession['user']) {
    return this.userService.findOneUser(user.id);
  }

  @Query(() => [UserSchema])
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Query(() => UserSchema)
  async getUser(@Args() { id }: GetUserArgs) {
    return this.userService.findOneUser(id);
  }

  @Mutation(() => UserSchema)
  async deleteUser(@Args('input') userInput: DeleteUserInput) {
    return this.userService.deleteUser(userInput.id);
  }

  @ResolveField(() => UserSchema)
  async self(@Parent() user: UserSchema) {
    return this.userService.findOneUser(user.id);
  }

  @ResolveField(() => String)
  async foo(
    @CurrentUserSession() userSession: CurrentUserSession,
    @I18n() i18n: I18nContext,
  ) {
    this.logger.log('User Session', userSession);

    return i18n.t('user.sayFoo');
  }
}

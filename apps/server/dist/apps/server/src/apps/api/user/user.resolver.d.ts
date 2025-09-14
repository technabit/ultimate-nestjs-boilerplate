import { I18nContext } from 'nestjs-i18n';
import { CurrentUserSession } from '@app/nest-core';
import { I18nTranslations } from '@/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { DeleteUserInput } from './schema/delete-user.schema';
import { GetUserArgs } from './schema/get-user.schema';
import { UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
export declare class UserResolver {
    private readonly userService;
    private readonly i18nService;
    private logger;
    constructor(userService: UserService, i18nService: I18nService<I18nTranslations>);
    whoami(user: CurrentUserSession['user']): Promise<import("./dto/user.dto").UserDto>;
    getUsers(): Promise<{
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
    getUser({ id }: GetUserArgs): Promise<import("./dto/user.dto").UserDto>;
    deleteUser(userInput: DeleteUserInput): Promise<import("@nestjs/common").HttpStatus>;
    self(user: UserSchema): Promise<import("./dto/user.dto").UserDto>;
    foo(userSession: CurrentUserSession, i18n: I18nContext): Promise<string>;
}

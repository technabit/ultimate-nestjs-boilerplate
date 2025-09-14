type EmailQueueLike = {
    add: (name: string, data: any, options?: any) => Promise<any>;
};
import { GlobalConfig } from '@/core/config/config.type';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { CacheService } from '@/core/shared/cache/cache.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private configService;
    private readonly emailQueue;
    private readonly cacheService;
    private readonly prisma;
    constructor(configService: ConfigService<GlobalConfig>, emailQueue: EmailQueueLike, cacheService: CacheService, prisma: PrismaService);
    sendSigninMagicLink({ email, url }: {
        email: string;
        url: string;
    }): Promise<void>;
    verifyEmail({ url, userId }: {
        url: string;
        userId: string;
    }): Promise<void>;
    resetPassword({ url, userId }: {
        url: string;
        userId: string;
    }): Promise<void>;
    createBasicAuthHeaders(): {
        Authorization: string;
    };
}
export {};

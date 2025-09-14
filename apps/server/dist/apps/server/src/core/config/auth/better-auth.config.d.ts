import { AuthService } from '@/core/auth/auth.service';
import { GlobalConfig } from '@/core/config/config.type';
import { CacheService } from '@/core/shared/cache/cache.service';
import { ConfigService } from '@nestjs/config';
import { BetterAuthOptions } from 'better-auth/types';
export declare function getConfig({ configService, cacheService, authService, }: {
    configService: ConfigService<GlobalConfig>;
    cacheService: CacheService;
    authService: AuthService;
}): BetterAuthOptions;

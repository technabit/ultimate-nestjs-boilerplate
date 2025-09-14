import { GlobalConfig } from '@/core/config/config.type';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CacheParam } from './cache.type';
export declare class CacheService {
    private readonly cacheManager;
    private readonly configService;
    constructor(cacheManager: Cache, configService: ConfigService<GlobalConfig>);
    get<T>(keyParams: CacheParam): Promise<T>;
    getTtl(keyParams: CacheParam, options?: {
        disableResponseFilter?: false;
    }): Promise<number | null>;
    set(keyParams: CacheParam, value: unknown, options?: {
        ttl?: number;
    }): Promise<{
        key: string;
    }>;
    storeGet<T>(keyParams: CacheParam): Promise<T>;
    storeSet<T>(keyParams: CacheParam, value: T, options?: {
        ttl?: number;
    }): Promise<{
        key: string;
    }>;
    delete(keyParams: CacheParam): Promise<{
        key: string;
    }>;
    private _constructCacheKey;
}

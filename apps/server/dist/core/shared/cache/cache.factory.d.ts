import { GlobalConfig } from '@/core/config/config.type';
import { ConfigService } from '@nestjs/config';
declare function useCacheFactory(config: ConfigService<GlobalConfig>): Promise<{
    store: import("cache-manager-ioredis-yet").RedisStore;
}>;
export default useCacheFactory;

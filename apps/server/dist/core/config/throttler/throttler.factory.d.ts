import { GlobalConfig } from '@/core/config/config.type';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigService } from '@nestjs/config';
declare function useThrottlerFactory(config: ConfigService<GlobalConfig>): Promise<{
    throttlers: {
        ttl: number;
        limit: number;
    }[];
    storage: ThrottlerStorageRedisService;
}>;
export default useThrottlerFactory;

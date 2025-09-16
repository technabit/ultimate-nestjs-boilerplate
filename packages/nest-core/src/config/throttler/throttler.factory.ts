import redisConfig from '@/core/config/redis/redis.config';
import throttlerConfig from '@/core/config/throttler/throttler.config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigType } from '@nestjs/config';
import { Redis } from 'ioredis';

async function useThrottlerFactory(
  throttler: ConfigType<typeof throttlerConfig>,
  redis: ConfigType<typeof redisConfig>,
) {
  return {
    throttlers: [
      {
        ttl: throttler.ttl,
        limit: throttler.limit,
      },
    ],
    storage: new ThrottlerStorageRedisService(new Redis(redis as any)),
  };
}

export default useThrottlerFactory;

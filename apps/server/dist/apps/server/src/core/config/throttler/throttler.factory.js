"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
const ioredis_1 = require("ioredis");
async function useThrottlerFactory(config) {
    return {
        throttlers: [
            {
                ttl: config.getOrThrow('throttler.ttl', { infer: true }),
                limit: config.getOrThrow('throttler.limit', { infer: true }),
            },
        ],
        storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(new ioredis_1.Redis(config.getOrThrow('redis'))),
    };
}
exports.default = useThrottlerFactory;
//# sourceMappingURL=throttler.factory.js.map